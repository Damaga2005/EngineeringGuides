"""
Deterministic Project Boundary Detection & Catalog Reconciliation Engine (Prompt 02.3).

Enforces strict two-phase separation (Forensic Closure P02.3, Section 1 & 6):

  PHASE A - discover_projects_from_ir(ir, source_document_id, source_hash):
    Discovers project boundary candidates using ONLY the Document IR:
    headings, numbering, layout markers and structural patterns.
    Receives NO catalog, NO keyProjects, NO title hints of any kind.

  PHASE B - reconcile_boundaries_with_catalog(catalog_projects, ir_boundaries, guide_id):
    Compares the independently-discovered IR boundaries against the legacy
    catalog (keyProjects) and records MATCH / PARTIAL_MATCH / BOUNDARY_MISMATCH /
    MISSING_IN_IR / MISSING_IN_CATALOG / NEEDS_REVIEW. The catalog is NEVER used
    to fabricate an IR candidate, and IR candidates are NEVER discarded because
    they lack a catalog counterpart (they surface as MISSING_IN_CATALOG).

No fallback_document_span, no catalog-driven title lookup and no synthetic
start/end fabrication are permitted anywhere in this module.
"""

import re
from typing import List, Dict, Any, Optional

from scripts.project_first.models import (
    ProjectBoundary,
    EvidenceBlock,
    BoundaryReconciliationStatus,
    BoundaryReconciliationRecord,
)
from scripts.project_first.ids import generate_evidence_id

# Fixed, catalog-independent ceiling for structural project numbering.
# This is NOT derived from keyProjects length; it is a generous constant
# bound on how large a single-document numbered sequence can plausibly be.
MAX_STRUCTURAL_PROJECT_NUMBER = 60


def normalize_text(text: str) -> str:
    return re.sub(r'[^a-z0-9]', '', text.lower())


PATTERNS = [
    # 1. Bracket or symbol spaced project: [ P R O J E C T 0 1 ] or ■ P R O J E C T 0 1
    (r'(?:\[|■|■)\s*P\s*R\s*O\s*J\s*E\s*C\s*T\s*([0-9\s]+)', "ir_bracket_marker", 1.0),
    # 2. Chevron: ❯ project 01 or ❯project 01
    (r'❯\s*project\s*0?(\d+)', "ir_chevron_marker", 1.0),
    # 3. Project heading: PROJECT 1, PROJECT 01
    (r'(?:^|\n)\s*PROJECT\s*0?(\d+)(?:\b|\n|:|\s)', "ir_project_heading", 1.0),
    # 4. Upgrade: UPGRADE 01
    (r'(?:^|\n)\s*UPGRADE\s*0?(\d+)', "ir_upgrade_marker", 1.0),
    # 5. Hash numbered: #1, #2
    (r'(?:^|\n)\s*#\s*0?(\d+)(?:\b|\n|:|\s)', "ir_hash_marker", 0.95),
    # 6. Step marker: STEP 01, STEP 1
    (r'(?:^|\n)\s*STEP\s*0?(\d+)(?:\b|\n|:|\s)', "ir_step_marker", 0.95),
    # 7. Two-digit numbered resource: 01 Name, 02 Name
    (r'(?:^|\n)\s*0?(\d{1,2})\s{2,}([A-Za-z0-9\-_ /]{3,})', "ir_numbered_resource", 0.90),
    (r'(?:^|\n)\s*0?(\d{1,2})\s*$', "ir_standalone_number", 0.85),
    # 8. Numbered section in build guides: 1 Parts you need, 2 Wiring
    (r'(?:^|\n)\s*(\d{1,2})\s+([A-Za-z0-9\-_ /]{4,})', "ir_section_number", 0.80),
]


def discover_projects_from_ir(
    ir: Dict[str, Any],
    source_document_id: str,
    source_hash: str,
) -> List[ProjectBoundary]:
    """
    PHASE A - IR-ONLY DISCOVERY.

    Discovers project boundary candidates using exclusively:
      - headings, IR blocks, numbering, structural patterns, layout, document
        continuity and sequences present literally in the Document IR.

    Receives NO catalog_hints, NO keyProjects and NO legacy catalog of any kind.
    The search space (max structural number) is a fixed constant, never derived
    from any external catalog length.
    """
    pages = ir.get("pages", [])
    page_count = ir.get("pageCount", 1)

    raw_markers = []

    # 1. Scan for explicit structural markers across all pages >= 2
    for page in pages:
        p_no = page["pageNumber"]
        if p_no == 1:
            continue

        blocks = page.get("blocks", [])
        for b in blocks:
            text = b.get("text", "").strip()
            if not text:
                continue

            for pat, method, conf in PATTERNS:
                m = re.search(pat, text, re.IGNORECASE)
                if m:
                    raw_num = re.sub(r'\s+', '', m.group(1))
                    if raw_num.isdigit():
                        p_num = int(raw_num)
                        if not (1 <= p_num <= MAX_STRUCTURAL_PROJECT_NUMBER):
                            continue
                        lines = [l.strip() for l in text.splitlines() if l.strip()]
                        title = lines[1] if len(lines) > 1 else (lines[0] if lines else None)

                        raw_markers.append({
                            "projectNumber": p_num,
                            "page": p_no,
                            "blockIndex": b["blockIndex"],
                            "titleHint": title,
                            "text": b["text"],  # exact literal text from block
                            "method": method,
                            "confidence": conf,
                            "bbox": b.get("bbox")
                        })
                    break

    # Group by projectNumber, picking highest confidence occurrence
    by_num: Dict[int, Dict[str, Any]] = {}
    for m in sorted(raw_markers, key=lambda x: (x["confidence"], -x["page"]), reverse=True):
        p_num = m["projectNumber"]
        if p_num not in by_num:
            by_num[p_num] = m

    # Convert to ordered candidate list
    sorted_markers = [by_num[k] for k in sorted(by_num.keys())]
    if not sorted_markers:
        return []

    # 2. Compute exact startPage, startBlock, endPage, endBlock from IR transitions
    boundaries: List[ProjectBoundary] = []
    for idx, curr in enumerate(sorted_markers):
        p_num = curr["projectNumber"]
        start_p = curr["page"]
        start_b = curr["blockIndex"]

        ev_id = generate_evidence_id(source_document_id, start_p, start_b)
        ev_block = EvidenceBlock(
            evidenceId=ev_id,
            sourceDocumentId=source_document_id,
            pageNumber=start_p,
            blockIndex=start_b,
            textSnippet=curr["text"],
            bbox=curr.get("bbox"),
            sourceHash=source_hash,
            claim=f"Delimitador de inicio detectado en IR para candidato de proyecto #{p_num}."
        )

        if idx + 1 < len(sorted_markers):
            nxt = sorted_markers[idx + 1]
            if nxt["page"] > start_p:
                if nxt["blockIndex"] <= 2:
                    end_p = max(start_p, nxt["page"] - 1)
                else:
                    end_p = nxt["page"]
            else:
                end_p = start_p
            end_page_obj = next((p for p in pages if p["pageNumber"] == end_p), None)
            end_b = len(end_page_obj.get("blocks", [])) - 1 if end_page_obj and end_page_obj.get("blocks") else 0
        else:
            end_p = page_count
            last_page_obj = next((p for p in pages if p["pageNumber"] == end_p), None)
            end_b = len(last_page_obj.get("blocks", [])) - 1 if last_page_obj and last_page_obj.get("blocks") else 0

        boundary = ProjectBoundary(
            sourceDocumentId=source_document_id,
            projectNumber=p_num,
            titleHint=curr["titleHint"],
            startPage=start_p,
            startBlock=start_b,
            endPage=end_p,
            endBlock=max(0, end_b),
            detectionMethod=curr["method"],
            confidence=curr["confidence"],
            evidenceBlocks=[ev_block]
        )
        boundaries.append(boundary)

    return boundaries


# Backwards-compatible alias kept for callers expecting the pre-P02.3 name.
# Signature is now catalog-independent: catalog_hints is REMOVED.
def extract_project_boundaries_from_ir(
    guide_id: str,
    ir: Dict[str, Any],
    source_hash: str,
) -> List[ProjectBoundary]:
    return discover_projects_from_ir(ir, guide_id, source_hash)


def reconcile_boundaries_with_catalog(
    catalog_projects: List[Dict[str, Any]],
    ir_boundaries: List[ProjectBoundary],
    guide_id: str
) -> List[BoundaryReconciliationRecord]:
    """
    PHASE B - RECONCILIATION.

    Compares two INDEPENDENTLY produced results:
      - ir_boundaries: produced solely by discover_projects_from_ir() (Phase A).
      - catalog_projects: the legacy keyProjects catalog.

    Records MATCH, PARTIAL_MATCH, BOUNDARY_MISMATCH, MISSING_IN_IR for every
    catalog entry, and MISSING_IN_CATALOG for every IR-discovered boundary that
    has no corresponding catalog entry. Never fabricates a start/end for a
    catalog entry lacking IR evidence; never discards an IR-only boundary.
    """
    boundaries_by_num = {b.projectNumber: b for b in ir_boundaries}
    records: List[BoundaryReconciliationRecord] = []
    matched_boundary_keys: set = set()

    for idx, cat_p in enumerate(catalog_projects, start=1):
        pid = cat_p.get("projectId", f"proj-{guide_id}-p{idx:02d}")
        cat_title = cat_p.get("title", f"Project #{idx}")
        range_str = cat_p.get("sourcePageRange", "")
        if range_str and "-" in str(range_str):
            parts = str(range_str).split("-")
            try:
                cat_start = int(parts[0])
                cat_end = int(parts[1])
            except ValueError:
                cat_start = cat_p.get("pageStart", 1)
                cat_end = cat_p.get("pageEnd", cat_start)
        else:
            cat_start = cat_p.get("pageStart", 1)
            cat_end = cat_p.get("pageEnd", cat_start)
        cat_range = [cat_start, cat_end]

        b = boundaries_by_num.get(idx)
        if not b:
            # Reconciliation-only fuzzy title match against INDEPENDENTLY
            # discovered IR candidates (comparison-only normalization is
            # permitted at reconciliation time; it creates no new evidence).
            cat_norm = normalize_text(cat_title)
            for cand_b in ir_boundaries:
                if cand_b.projectNumber in matched_boundary_keys:
                    continue
                if cand_b.titleHint and (cat_norm in normalize_text(cand_b.titleHint) or normalize_text(cand_b.titleHint) in cat_norm):
                    b = cand_b
                    break

        if not b:
            rec = BoundaryReconciliationRecord(
                projectId=pid,
                guideId=guide_id,
                projectNumber=idx,
                catalogTitle=cat_title,
                irTitle=None,
                catalogPageRange=cat_range,
                irPageRange=[],
                status=BoundaryReconciliationStatus.MISSING_IN_IR,
                discrepancyNote="Project defined in catalog has no matching boundary marker in Document IR.",
                evidenceBlocks=[]
            )
            records.append(rec)
            continue

        matched_boundary_keys.add(b.projectNumber)
        ir_range = [b.startPage, b.endPage]
        ir_title = b.titleHint or cat_title

        norm_cat = normalize_text(cat_title)
        norm_ir = normalize_text(ir_title)
        title_similar = (norm_cat in norm_ir or norm_ir in norm_cat) or (norm_cat[:15] == norm_ir[:15])

        if ir_range == cat_range and title_similar:
            status = BoundaryReconciliationStatus.MATCH
            note = "Exact title and boundary match."
        elif ir_range == cat_range:
            status = BoundaryReconciliationStatus.PARTIAL_MATCH
            note = f"Page range matched [{ir_range[0]}, {ir_range[1]}], title discrepancy: '{cat_title}' vs '{ir_title}'."
        elif abs(ir_range[0] - cat_range[0]) <= 1 and abs(ir_range[1] - cat_range[1]) <= 1:
            status = BoundaryReconciliationStatus.PARTIAL_MATCH
            note = f"Boundary offset of <= 1 page: Catalog [{cat_range[0]}, {cat_range[1]}] vs IR [{ir_range[0]}, {ir_range[1]}]."
        else:
            status = BoundaryReconciliationStatus.BOUNDARY_MISMATCH
            note = f"Boundary divergence: Catalog [{cat_range[0]}, {cat_range[1]}] vs IR [{ir_range[0]}, {ir_range[1]}]."

        rec = BoundaryReconciliationRecord(
            projectId=pid,
            guideId=guide_id,
            projectNumber=idx,
            catalogTitle=cat_title,
            irTitle=ir_title,
            catalogPageRange=cat_range,
            irPageRange=ir_range,
            status=status,
            discrepancyNote=note,
            evidenceBlocks=b.evidenceBlocks
        )
        records.append(rec)

    # MISSING_IN_CATALOG: IR-discovered boundaries with no catalog counterpart.
    # These are preserved (never silently dropped) per Section 1/6 requirements.
    for b in ir_boundaries:
        if b.projectNumber in matched_boundary_keys:
            continue
        rec = BoundaryReconciliationRecord(
            projectId=f"ir-only-{guide_id}-p{b.projectNumber:02d}",
            guideId=guide_id,
            projectNumber=b.projectNumber,
            catalogTitle="(none)",
            irTitle=b.titleHint,
            catalogPageRange=[],
            irPageRange=[b.startPage, b.endPage],
            status=BoundaryReconciliationStatus.MISSING_IN_CATALOG,
            discrepancyNote="Document IR contains a structurally-detected project boundary with no corresponding catalog (keyProjects) entry.",
            evidenceBlocks=b.evidenceBlocks
        )
        records.append(rec)

    return records
