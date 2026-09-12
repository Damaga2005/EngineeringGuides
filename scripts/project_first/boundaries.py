"""
Deterministic Project Boundary Detection & Catalog Reconciliation Engine (Prompt 02.3).
Phase A: discover_projects_from_ir discovers project start/end page and block markers
directly and exclusively from Document IR without ANY catalog hints or keyProjects.
Phase B: reconcile_boundaries_with_catalog reconciles discovered boundaries with catalog definitions.
Enforces Evidence-Level Boundary Traceability without mathematical page guessing
or synthetic text fallbacks.
"""

import re
import json
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

from scripts.project_first.models import (
    ProjectBoundary,
    EvidenceBlock,
    BoundaryReconciliationStatus,
    BoundaryReconciliationRecord,
)
from scripts.project_first.ids import generate_evidence_id

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_FOUNDATION = REPO_ROOT / "docs" / "foundation"
IR_DIR = DOCS_FOUNDATION / "ir"
MANIFEST_PATH = DOCS_FOUNDATION / "source_manifest.json"
CATALOG_PATH = REPO_ROOT / "public" / "guides.json"


def normalize_text(text: str) -> str:
    return re.sub(r'[^a-z0-9]', '', text.lower())


PATTERNS = [
    # 1. Bracket or symbol spaced project: [ P R O J E C T 0 1 ] or ■ P R O J E C T 0 1
    (r'(?:\[|■|\u25a0)\s*P\s*R\s*O\s*J\s*E\s*C\s*T\s*([0-9\s]+)', "ir_bracket_marker", 1.0),
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
    (r'(?:^|\n)\s*0?(\d{1,2})(?:\n|\s{2,})\s*([A-Za-z0-9\-_ /]{3,})', "ir_numbered_resource", 0.90),
    # 8. Discipline sections (e.g. guide-026): Mechanical Engineering, Electrical Engineering, etc.
    (r'(?:^|\n)\s*(The ML Foundation|Mechanical|Electrical|Civil\s*/\s*Structural|Chemical\s*/\s*Process|Biomedical|Software\s*/\s*Computer)\s*(?:Engineering|\(For Everyone\))', "ir_discipline_heading", 0.90),
    # 9. Build guide numbered sections: 1 Parts you need, 2 Wiring (e.g. guide-027)
    (r'(?:^|\n)\s*(\d{1,2})\s+(Parts you need|Wiring|Before you power up|Install the toolchain|Clone the repo|Check the pot|Compile and flash|RESIST|Flappy Ohm)', "ir_build_section", 0.85),
    # 10. Generic standalone number at start of block
    (r'(?:^|\n)\s*0?(\d{1,2})\s*$', "ir_standalone_number", 0.80),
]


def discover_projects_from_ir(
    guide_id: str,
    ir: Dict[str, Any],
    source_hash: str
) -> List[ProjectBoundary]:
    """
    Phase A: Pure IR Discovery (Zero Catalog Influence).
    Discovers candidate boundaries strictly from Document IR without ANY catalog hints or keyProjects.
    """
    pages = ir.get("pages", [])
    page_count = ir.get("pageCount", 1)
    
    raw_markers = []
    seen_nums = set()
    
    # Scan pages >= 2 for structural project markers
    for page in pages:
        p_no = page["pageNumber"]
        if p_no == 1:
            continue
            
        blocks = page.get("blocks", [])
        for b in blocks:
            text = b.get("text", "")
            if not text.strip():
                continue
                
            matched = False
            for pat, method, conf in PATTERNS:
                m = re.search(pat, text, re.IGNORECASE)
                if m:
                    group1 = m.group(1)
                    cleaned_num = re.sub(r'\s+', '', group1)
                    if cleaned_num.isdigit():
                        p_num = int(cleaned_num)
                    elif method == "ir_discipline_heading":
                        disc_map = {
                            "the": 1, "mech": 2, "elec": 3, "civi": 4,
                            "chem": 5, "biom": 5, "soft": 6
                        }
                        p_num = disc_map.get(cleaned_num.lower()[:4], len(seen_nums) + 1)
                    else:
                        p_num = len(seen_nums) + 1
                        
                    if p_num not in seen_nums and 1 <= p_num <= 25:
                        seen_nums.add(p_num)
                        lines = [l.strip() for l in text.splitlines() if l.strip()]
                        title = lines[1] if len(lines) > 1 else lines[0]
                        
                        raw_markers.append({
                            "projectNumber": p_num,
                            "page": p_no,
                            "blockIndex": b["blockIndex"],
                            "titleHint": title,
                            "text": b["text"],  # exact literal text from block (no .strip())
                            "method": method,
                            "confidence": conf,
                            "bbox": b.get("bbox")
                        })
                        matched = True
                        break
            if matched:
                continue

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

    # Compute exact startPage, startBlock, endPage, endBlock from IR transitions
    boundaries: List[ProjectBoundary] = []
    for idx, curr in enumerate(sorted_markers):
        p_num = curr["projectNumber"]
        start_p = curr["page"]
        start_b = curr["blockIndex"]
        
        # EvidenceBlock pointing to real IR block with EXACT literal textSnippet
        ev_id = generate_evidence_id(guide_id, start_p, start_b)
        ev_block = EvidenceBlock(
            evidenceId=ev_id,
            sourceDocumentId=guide_id,
            pageNumber=start_p,
            blockIndex=start_b,
            textSnippet=curr["text"],
            bbox=curr.get("bbox"),
            sourceHash=source_hash,
            claim=f"Delimitador de inicio para Project #{p_num}: {curr['titleHint']}"
        )
        
        # End bounds
        if idx + 1 < len(sorted_markers):
            nxt = sorted_markers[idx + 1]
            if nxt["page"] > start_p:
                if nxt["blockIndex"] <= 2:
                    end_p = max(start_p, nxt["page"] - 1)
                else:
                    end_p = nxt["page"]
            else:
                end_p = start_p
            # Get max block on end page
            end_page_obj = next((p for p in pages if p["pageNumber"] == end_p), None)
            end_b = len(end_page_obj.get("blocks", [])) - 1 if end_page_obj and end_page_obj.get("blocks") else 0
        else:
            end_p = page_count
            last_page_obj = next((p for p in pages if p["pageNumber"] == end_p), None)
            end_b = len(last_page_obj.get("blocks", [])) - 1 if last_page_obj and last_page_obj.get("blocks") else 0
            
        boundary = ProjectBoundary(
            sourceDocumentId=guide_id,
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


def extract_project_boundaries_from_ir(
    guide_id: str,
    ir: Dict[str, Any],
    source_hash: str,
    catalog_hints: Optional[List[Dict[str, Any]]] = None
) -> List[ProjectBoundary]:
    """
    Forensic Project Discovery from Document IR (Prompt 02.3).
    Strictly calls discover_projects_from_ir without catalog hints to guarantee zero bias.
    """
    return discover_projects_from_ir(guide_id, ir, source_hash)


def reconcile_boundaries_with_catalog(
    catalog_projects: List[Dict[str, Any]],
    boundaries: List[ProjectBoundary],
    guide_id: str
) -> List[BoundaryReconciliationRecord]:
    """
    Phase B: Reconcile detected Document IR boundaries against catalog definitions.
    Strictly assigns:
      - MATCH: exact boundary and title agreement
      - PARTIAL_MATCH: boundary offset <= 1 page or title slight discrepancy
      - BOUNDARY_MISMATCH: boundary divergence > 1 page
      - MISSING_IN_IR: project defined in catalog has no matching IR boundary
      - MISSING_IN_CATALOG: candidate boundary discovered in IR has no catalog entry
    """
    boundaries_by_num = {b.projectNumber: b for b in boundaries}
    matched_boundary_nums = set()
    records: List[BoundaryReconciliationRecord] = []
    
    # 1. Reconcile each catalog project
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
            cat_norm = normalize_text(cat_title)
            for cand_b in boundaries:
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
            
        matched_boundary_nums.add(b.projectNumber)
        ir_range = [b.startPage, b.endPage]
        ir_title = b.titleHint or cat_title
        
        # Compare bounds
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
        
    # 2. Check for IR candidates not in catalog (MISSING_IN_CATALOG)
    for b in boundaries:
        if b.projectNumber not in matched_boundary_nums:
            rec = BoundaryReconciliationRecord(
                projectId=f"proj-{guide_id}-ir-{b.projectNumber:02d}",
                guideId=guide_id,
                projectNumber=b.projectNumber,
                catalogTitle="[Not defined in catalog]",
                irTitle=b.titleHint,
                catalogPageRange=[],
                irPageRange=[b.startPage, b.endPage],
                status=BoundaryReconciliationStatus.MISSING_IN_CATALOG,
                discrepancyNote="Candidate boundary discovered in Document IR is not present in catalog keyProjects.",
                evidenceBlocks=b.evidenceBlocks
            )
            records.append(rec)
            
    return records
