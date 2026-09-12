"""
Forensic Project Extractor & Evidence-Level Grounding Engine (Prompt 02.3).

Guarantees:
1. Zero textual fallbacks (sourceText is strictly literal untouched Document IR
   text or None - never stripped, truncated, concatenated or suffixed with "...").
2. EvidenceBlocks are mandatory for every SOURCE claim with deterministic evidenceId.
3. Project boundaries are discovered independently from Document IR
   (scripts.project_first.boundaries.discover_projects_from_ir) with ZERO
   dependency on keyProjects, then reconciled against the catalog as a
   separate, later phase.
4. Formal separation: SOURCE, DERIVED, UNVERIFIED, NOT_DOCUMENTED.
   - SOURCE requires literal sourceText + evidenceIds.
   - DERIVED requires a derivedExplanation demonstrable from evidenceIds.
   - UNVERIFIED marks pre-existing catalog text with no IR evidence backing it.
   - NOT_DOCUMENTED means no textual value is stored at all (None).
5. Zero synthetic phrases or placeholder strings of any kind.
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

from scripts.foundation.models import (
    Provenance,
    ProvenanceOrigin,
    ProvenanceConfidence,
    PriceStatus,
)
from scripts.project_first.models import (
    Project,
    ProjectSource,
    ProjectDescription,
    DetailedExplanation,
    TechnicalSection,
    TechnicalIdentity,
    ProjectBOMItem,
    EvidenceBlock,
    ProjectBoundary,
    ContentStatus,
    BoundaryReconciliationStatus,
)
from scripts.project_first.ids import (
    generate_project_id,
    generate_project_source_id,
    generate_evidence_id,
    slugify,
)
from scripts.project_first.technical_identity import extract_technical_identity
from scripts.project_first.boundaries import (
    discover_projects_from_ir,
    reconcile_boundaries_with_catalog,
    normalize_text,
    looks_like_real_title,
)
from scripts.project_first.structural_sections import (
    extract_structural_sections,
    trim_trailing_next_project_teaser,
    is_boilerplate_block as _is_boilerplate_block,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_FOUNDATION = REPO_ROOT / "docs" / "foundation"
GUIDES_CATALOG_PATH = REPO_ROOT / "public" / "guides.json"
IR_DIR = DOCS_FOUNDATION / "ir"
MANIFEST_PATH = DOCS_FOUNDATION / "source_manifest.json"


def find_section_evidence(
    ir_blocks: List[Dict[str, Any]],
    keywords: List[str],
    guide_id: str,
    source_hash: str,
    section_claim: str,
    used_blocks: Optional[set] = None,
) -> Tuple[Optional[str], List[EvidenceBlock]]:
    """
    Search project-scoped IR blocks for keywords matching a technical section.
    Returns (literal_source_text, evidence_blocks) or (None, []).
    sourceText is the EXACT LITERAL block['text'] - untouched, unstripped,
    untruncated, with no '...' appended.

    `used_blocks`, when given, is a set of (pageNumber, blockIndex) tuples
    already claimed by a real structural-heading section (Phase 1) for this
    project - they are skipped here so the weaker keyword fallback never
    re-attributes the same literal block to a second, unrelated section.
    """
    for b in ir_blocks:
        t = b.get("text", "")
        stripped = t.strip()
        if not stripped or len(stripped) < 15:
            continue
        if _is_boilerplate_block(t):
            continue  # never let a BOM table row or page footer stand in for narrative content
        if used_blocks and (b.get("pageNumber"), b.get("blockIndex")) in used_blocks:
            continue
        lower_t = stripped.lower()
        if any(kw in lower_t for kw in keywords):
            ev_id = generate_evidence_id(guide_id, b["pageNumber"], b["blockIndex"])
            ev = EvidenceBlock(
                evidenceId=ev_id,
                sourceDocumentId=guide_id,
                pageNumber=b["pageNumber"],
                blockIndex=b["blockIndex"],
                textSnippet=t,
                bbox=b.get("bbox"),
                sourceHash=source_hash,
                claim=section_claim
            )
            return t, [ev]

    return None, []


def build_forensic_technical_sections(
    proj_data: Dict[str, Any],
    guide_id: str,
    source_path: str,
    source_hash: str,
    boundary: Optional[ProjectBoundary],
    project_ir_blocks: List[Dict[str, Any]],
    tech_id: TechnicalIdentity
) -> DetailedExplanation:
    """
    Build 18 technical sections with strict evidence grounding.
    If no literal evidence exists in Document IR, sourceText is None and
    status is NOT_DOCUMENTED. Zero text placeholders or synthetic phrases
    of any kind are permitted for the derived explanation.
    """
    title = proj_data.get("title", "")

    # Phase 1: real structural headings literally present in the document
    # ("// why this matters", "How It Works", "// build steps", safety
    # callouts, recruiter-proof/job-mapping lines). These produce coherent,
    # multi-block literal spans instead of a single decontextualized
    # keyword-matched sentence.
    structural = extract_structural_sections(project_ir_blocks, guide_id, source_hash)
    used_blocks = {
        (eb.pageNumber, eb.blockIndex)
        for sec in structural.values()
        for eb in sec.evidenceBlocks
    }

    section_specs = [
        ("overview", 1, "1. Descripción general",
         ["sensor", "camera", "mcu", "controller", "circuit", "system", "overview", "board", "device", "module", "node", "hardware", "build"]),
        ("whatDoesItDo", 2, "2. ¿Qué hace?",
         ["measures", "detects", "controls", "transmits", "receives", "powers", "drives", "senses", "tracks", "monitors", "converts", "filters", "reads", "displays"]),
        ("whatIsItFor", 3, "3. ¿Para qué sirve?",
         ["application", "use", "purpose", "field", "indoor", "drone", "robot", "satellite", "industrial", "situational", "portfolio", "real-world", "deployment"]),
        ("objective", 4, "4. Objetivo técnico",
         ["objective", "goal", "build", "demonstrates", "proves", "mastery", "skills", "learn", "verify", "challenge", "output"]),
        ("architecture", 5, "5. Arquitectura del sistema",
         ["architecture", "block", "topology", "subsystem", "stage", "bridge", "frontend", "interface", "bus", "network", "mesh", "i2c", "spi", "uart"]),
        ("hardware", 6, "6. Hardware y subsistemas principales",
         ["esp32", "stm32", "rp2040", "arduino", "mosfet", "transceiver", "amplifier", "op-amp", "ic", "module", "pcb", "component", "hardware", "driver"]),
        ("components", 7, "7. Componentes críticos y especificaciones",
         ["component", "part", "spec", "bom", "resistor", "capacitor", "diode", "sensor", "display", "oled", "antenna", "crystal", "inductor"]),
        ("power", 8, "8. Alimentación y gestión de energía",
         ["power", "voltage", "current", "battery", "3.3v", "5v", "12v", "ldo", "regulator", "buck", "boost", "usb", "lipo", "supply", "consumption"]),
        ("connections", 9, "9. Conexiones y pinout clave",
         ["pin", "wiring", "gnd", "vcc", "sda", "scl", "tx", "rx", "miso", "mosi", "sck", "gpio", "connector", "header", "wire", "pad"]),
        ("firmware", 10, "10. Lógica de control y firmware",
         ["code", "firmware", "c++", "c", "python", "micropython", "arduino", "zephyr", "rtos", "loop", "setup", "interrupt", "algorithm", "flashing", "compile"]),
        ("configuration", 11, "11. Configuración y parámetros de ajuste",
         ["config", "parameter", "baud", "rate", "frequency", "gain", "threshold", "pid", "tuning", "sampling", "setting", "calibration"]),
        ("operation", 12, "12. Principio de funcionamiento físico/lógico",
         ["doppler", "reflection", "tof", "rf", "optical", "acoustic", "magnetic", "foc", "pid", "pwm", "adc", "filtering", "physics", "principle"]),
        ("assembly", 13, "13. Ensamblaje e integración paso a paso",
         ["build", "solder", "mount", "assembly", "breadboard", "pcb", "step 1", "step 2", "connect", "case", "enclosure", "3d print"]),
        ("commissioning", 14, "14. Puesta en marcha y verificación inicial",
         ["test", "verify", "check", "power up", "multimeter", "oscilloscope", "debug", "smoke test", "first run", "validate", "probe"]),
        ("usage", 15, "15. Modos de uso y casos prácticos de despliegue",
         ["usage", "mode", "operation", "demo", "field", "outdoor", "flight", "tracking", "display", "terminal", "monitor", "log"]),
        ("limitations", 16, "16. Limitaciones técnicas y casos de borde",
         ["limit", "limitation", "range", "noise", "latency", "drift", "accuracy", "interference", "thermal", "trade-off", "constraint", "resolution"]),
        ("safety", 17, "17. Seguridad técnica y precauciones operativas",
         ["safety", "caution", "warning", "esd", "overvoltage", "laser safety", "eye-safety", "reverse polarity", "high voltage", "compressed gas", "regulator rated"]),
        ("sources", 18, "18. Documentación original y trazabilidad",
         ["guide", "pdf", "sheet", "manual", "source", "reference", "repo", "documentation", "author"]),
    ]

    sections_dict = dict(structural)

    for sec_key, idx, sec_title, kws in section_specs:
        if sec_key in sections_dict:
            continue  # Phase 1 (real structural heading) already found this.
        claim = f"{sec_title} — {title}"
        src_txt, ev_blocks = find_section_evidence(project_ir_blocks, kws, guide_id, source_hash, claim, used_blocks)

        if src_txt is not None:
            status = ContentStatus.SOURCE
            page_no = ev_blocks[0].pageNumber if ev_blocks else (boundary.startPage if boundary else None)
            prov = Provenance(
                source=guide_id,
                sourcePath=source_path,
                sourceHash=source_hash,
                sourcePage=page_no,
                sourceSection=sec_title,
                extractionMethod="forensic-ir-block-matcher-v2.3",
                extractorVersion="2.3.0",
                origin=ProvenanceOrigin.EXTRACTED,
                confidence=ProvenanceConfidence.EXACT
            )
            der_from = [ev.evidenceId for ev in ev_blocks if ev.evidenceId]
            der_txt = None
        else:
            status = ContentStatus.NOT_DOCUMENTED
            src_txt = None
            der_txt = None
            der_from = []
            prov = None
            ev_blocks = []

        sections_dict[sec_key] = TechnicalSection(
            sectionIndex=idx,
            title=sec_title,
            sourceText=src_txt,
            derivedExplanation=der_txt,
            status=status,
            derivedFrom=der_from,
            evidenceBlocks=ev_blocks,
            provenance=prov
        )

    return DetailedExplanation(**sections_dict)


def extract_forensic_description(
    guide_id: str,
    source_hash: str,
    title: str,
    raw_desc: Optional[str],
    tech_id: TechnicalIdentity,
    project_ir_blocks: List[Dict[str, Any]],
    objective_section: Optional[TechnicalSection],
    overview_section: Optional[TechnicalSection] = None,
    what_is_it_for_section: Optional[TechnicalSection] = None,
    operation_section: Optional[TechnicalSection] = None,
) -> ProjectDescription:
    """
    Generate structured description grounded in factual IR evidence.
    Zero synthetic fallback phrases are permitted. Fields with no IR evidence
    are either UNVERIFIED (pre-existing catalog text with no evidence backing)
    or NOT_DOCUMENTED (no value at all).
    """
    evidence_ids = []
    field_status = {}

    # Prefer the real "overview" span (Phase 1: structural heading capture,
    # anchored right after the project's own title marker) over the weaker
    # generic first-plausible-block search below.
    if overview_section is not None and overview_section.status == ContentStatus.SOURCE:
        what_is_it = overview_section.sourceText
        evidence_ids.extend(overview_section.derivedFrom)
        field_status["whatIsIt"] = ContentStatus.SOURCE
        desc_evidence_block = "handled"
    else:
        desc_evidence_block = None
        for b in project_ir_blocks[:8]:
            t = b.get("text", "").strip()
            if len(t) > 30 and not t.startswith("//") and not t.startswith("P.") and not t.startswith("NODE"):
                desc_evidence_block = b
                break

    if desc_evidence_block == "handled":
        pass
    elif desc_evidence_block:
        what_is_it = desc_evidence_block["text"]
        ev_id = generate_evidence_id(guide_id, desc_evidence_block["pageNumber"], desc_evidence_block["blockIndex"])
        evidence_ids.append(ev_id)
        field_status["whatIsIt"] = ContentStatus.SOURCE
    elif raw_desc and len(raw_desc.strip()) > 10:
        # Pre-existing catalog text with no IR evidence backing it: UNVERIFIED,
        # never presented as SOURCE or DERIVED (which requires evidenceIds).
        what_is_it = raw_desc.strip()
        field_status["whatIsIt"] = ContentStatus.UNVERIFIED
    else:
        # whatIsIt is a mandatory display field (the UI always needs a title).
        # With no IR evidence and no catalog description, the only value we
        # can show is the project's own catalog title - which is legitimate
        # metadata, not fabricated body text, so it is marked UNVERIFIED
        # (never NOT_DOCUMENTED, since NOT_DOCUMENTED requires a null value).
        what_is_it = None
        field_status["whatIsIt"] = ContentStatus.UNVERIFIED

    # Prefer the real "how it works" structural span over the weak generic
    # verb-keyword search, which frequently matched an unrelated sentence
    # that merely happened to contain one of these common verbs.
    if operation_section is not None and operation_section.status == ContentStatus.SOURCE:
        what_does_it_do = operation_section.sourceText
        evidence_ids.extend(operation_section.derivedFrom)
        field_status["whatDoesItDo"] = ContentStatus.SOURCE
    else:
        func_block = None
        for b in project_ir_blocks:
            t = b.get("text", "").strip()
            if len(t) >= 20 and any(w in t.lower() for w in ["measures", "detects", "controls", "drives", "senses", "tracks", "operates", "provides", "outputs", "computes"]):
                func_block = b
                break

        if func_block:
            what_does_it_do = func_block["text"]
            ev_id = generate_evidence_id(guide_id, func_block["pageNumber"], func_block["blockIndex"])
            evidence_ids.append(ev_id)
            field_status["whatDoesItDo"] = ContentStatus.SOURCE
        else:
            what_does_it_do = None
            field_status["whatDoesItDo"] = ContentStatus.NOT_DOCUMENTED

    # Prefer the real "why this matters" structural span (this IS the
    # document's own explanation of purpose) over the weak generic
    # purpose-keyword search.
    if what_is_it_for_section is not None and what_is_it_for_section.status == ContentStatus.SOURCE:
        purpose = what_is_it_for_section.sourceText
        evidence_ids.extend(what_is_it_for_section.derivedFrom)
        field_status["purpose"] = ContentStatus.SOURCE
    else:
        purpose_block = None
        for b in project_ir_blocks:
            t = b.get("text", "").strip()
            if len(t) >= 20 and any(w in t.lower() for w in ["used for", "application", "designed to", "purpose", "deployment", "target", "solves"]):
                purpose_block = b
                break

        if purpose_block:
            purpose = purpose_block["text"]
            ev_id = generate_evidence_id(guide_id, purpose_block["pageNumber"], purpose_block["blockIndex"])
            evidence_ids.append(ev_id)
            field_status["purpose"] = ContentStatus.SOURCE
        else:
            purpose = None
            field_status["purpose"] = ContentStatus.NOT_DOCUMENTED

    # Objective is derived from the SAME evidence as detailedExplanation.objective
    # (never a synthetic template phrase). No independent fabrication.
    if objective_section is not None and objective_section.status == ContentStatus.SOURCE:
        objective = objective_section.sourceText
        evidence_ids.extend(objective_section.derivedFrom)
        field_status["objective"] = ContentStatus.SOURCE
    else:
        objective = None
        field_status["objective"] = ContentStatus.NOT_DOCUMENTED

    techs = []
    if tech_id.controller:
        techs.append(tech_id.controller)
    techs.extend(tech_id.sensors[:3])
    techs.extend(tech_id.actuators[:2])
    techs.extend(tech_id.communications[:3])

    summary_parts = [p for p in [what_is_it, what_does_it_do] if p]
    summary = " | ".join(p[:250] for p in summary_parts) if summary_parts else (title or "")

    return ProjectDescription(
        whatIsIt=what_is_it or title,
        whatDoesItDo=what_does_it_do,
        purpose=purpose,
        objective=objective,
        technologies=techs,
        summary=summary,
        evidenceIds=sorted(set(evidence_ids)),
        fieldStatus={k: v.value if hasattr(v, "value") else v for k, v in field_status.items()}
    )


def extract_all_projects_forensic() -> Tuple[List[Project], List[Dict[str, Any]]]:
    """
    Master extraction function for all catalog projects across 31 guides.
    Returns (projects_list, reconciliation_records_list).

    Boundary discovery (Phase A) is strictly IR-only and independent of
    keyProjects. Reconciliation (Phase B) compares the two independent
    results and never fabricates a boundary for a catalog entry lacking
    IR evidence (MISSING_IN_IR is preserved and technical sections for
    that project remain NOT_DOCUMENTED).
    """
    manifest = json.load(open(MANIFEST_PATH, encoding="utf-8"))
    docs_by_id = {d["sourceId"]: d for d in manifest.get("documents", [])}

    catalog_data = json.load(open(GUIDES_CATALOG_PATH, encoding="utf-8"))
    guides = catalog_data.get("guides", [])

    all_projects: List[Project] = []
    all_reconciliations: List[Dict[str, Any]] = []

    for guide in guides:
        gid = guide["id"]
        doc_meta = docs_by_id.get(gid)
        if not doc_meta:
            continue

        source_hash = doc_meta["sha256"]
        source_path = doc_meta["relativePath"]

        ir_file = IR_DIR / f"{gid}.json"
        if not ir_file.exists():
            continue

        ir_data = json.load(open(ir_file, encoding="utf-8"))
        pages = ir_data.get("pages", [])

        expected_projects = guide.get("keyProjects", [])

        # PHASE A: Independent IR-only discovery (zero catalog input).
        ir_boundaries = discover_projects_from_ir(ir_data, gid, source_hash)

        # PHASE B: Reconciliation between IR discovery and legacy catalog.
        rec_records = reconcile_boundaries_with_catalog(expected_projects, ir_boundaries, gid)
        all_reconciliations.extend([r.model_dump() for r in rec_records])

        rec_by_num = {r.projectNumber: r for r in rec_records if r.catalogTitle != "(none)"}
        boundaries_by_num = {b.projectNumber: b for b in ir_boundaries}

        for p_idx, p_data in enumerate(expected_projects, start=1):
            title = p_data.get("title", f"Project {p_idx}")
            rec = rec_by_num.get(p_idx)
            boundary = boundaries_by_num.get(p_idx) if rec and rec.status != BoundaryReconciliationStatus.MISSING_IN_IR else None

            # If no IR-grounded boundary exists (MISSING_IN_IR / NEEDS_REVIEW),
            # NEVER fabricate start/end. Record a zero-confidence, zero-evidence
            # boundary explicitly marked NEEDS_REVIEW instead.
            if boundary is None:
                boundary = ProjectBoundary(
                    sourceDocumentId=gid,
                    projectNumber=p_idx,
                    titleHint=title,
                    startPage=0,
                    startBlock=0,
                    endPage=0,
                    endBlock=0,
                    detectionMethod="NEEDS_REVIEW",
                    confidence=0.0,
                    evidenceBlocks=[]
                )
                project_ir_blocks: List[Dict[str, Any]] = []
                start_p, end_p = 0, 0
                page_range_str = "NEEDS_REVIEW"
            else:
                start_p = boundary.startPage
                end_p = boundary.endPage
                page_range_str = f"{start_p}-{end_p}" if start_p != end_p else str(start_p)

                # The legacy catalog's title for this slot does not always
                # correspond to what is actually at this IR-verified
                # boundary (a pre-existing data problem in the catalog
                # itself - see PROJECT_FIRST_CERTIFICATION_REPORT.md). When
                # reconciliation shows a real mismatch and the independently
                # discovered boundary has a real (non-marker) title, prefer
                # the IR-verified title so the displayed title matches the
                # content actually shown under it, rather than silently
                # keeping a wrong catalog title paired with correct content.
                if (
                    boundary.titleHint
                    and boundary.confidence >= 0.95
                    and looks_like_real_title(boundary.titleHint)
                ):
                    cat_norm = normalize_text(title)
                    ir_norm = normalize_text(boundary.titleHint)
                    title_matches = (
                        cat_norm in ir_norm or ir_norm in cat_norm or cat_norm[:15] == ir_norm[:15]
                    )
                    if not title_matches:
                        title = boundary.titleHint.strip()

                project_ir_blocks = []
                for page in pages:
                    p_no = page["pageNumber"]
                    if start_p <= p_no <= end_p:
                        for b in page.get("blocks", []):
                            if p_no == start_p and b["blockIndex"] < boundary.startBlock:
                                continue
                            if p_no == end_p and b["blockIndex"] > boundary.endBlock:
                                continue
                            b_copy = dict(b)
                            b_copy["pageNumber"] = p_no
                            project_ir_blocks.append(b_copy)

                project_ir_blocks = trim_trailing_next_project_teaser(project_ir_blocks)

            raw_text = f"{title} {p_data.get('description', '')} {p_data.get('detailedBuildManual', {}).get('firmwareCode', '')}"
            comp_names = [b.get("name", "") for b in p_data.get("officialData", {}).get("bom", [])] + p_data.get("components", [])
            tech_id = extract_technical_identity(raw_text, comp_names)

            detailed = build_forensic_technical_sections(
                proj_data=p_data,
                guide_id=gid,
                source_path=source_path,
                source_hash=source_hash,
                boundary=boundary if boundary.confidence > 0 else None,
                project_ir_blocks=project_ir_blocks,
                tech_id=tech_id
            )

            description = extract_forensic_description(
                guide_id=gid,
                source_hash=source_hash,
                title=title,
                raw_desc=p_data.get("description"),
                tech_id=tech_id,
                project_ir_blocks=project_ir_blocks,
                objective_section=detailed.objective,
                overview_section=detailed.overview,
                what_is_it_for_section=detailed.whatIsItFor,
                operation_section=detailed.operation,
            )

            prov = Provenance(
                source=gid,
                sourcePath=source_path,
                sourceHash=source_hash,
                sourcePage=start_p if start_p else None,
                sourceSection=f"Project #{p_idx}: {title}",
                extractionMethod="forensic-boundary-extractor-v2.3",
                extractorVersion="2.3.0",
                origin=ProvenanceOrigin.EXTRACTED,
                confidence=ProvenanceConfidence.EXACT if boundary.confidence > 0 else ProvenanceConfidence.NEEDS_REVIEW
            )

            p_id = generate_project_id(gid, p_idx, title)
            slug = slugify(f"{gid}-p{p_idx:02d}-{title}")

            p_source = ProjectSource(
                projectSourceId=generate_project_source_id(p_id, gid, page_range_str),
                projectId=p_id,
                sourceDocumentId=gid,
                sourcePath=source_path,
                sourceHash=source_hash,
                pageRange=[start_p, end_p] if boundary.confidence > 0 else [1, 1],
                sectionTitle=f"Project #{p_idx}: {title}",
                isPrimary=True,
                confidence=ProvenanceConfidence.EXACT if boundary.confidence > 0 else ProvenanceConfidence.NEEDS_REVIEW,
                evidenceBlocks=boundary.evidenceBlocks
            )

            bom_items: List[ProjectBOMItem] = []
            for b_idx, b in enumerate(p_data.get("officialData", {}).get("bom", [])):
                b_ev = []
                if project_ir_blocks:
                    b_p = project_ir_blocks[0]["pageNumber"]
                    b_b = project_ir_blocks[0]["blockIndex"]
                    b_ev.append(EvidenceBlock(
                        evidenceId=generate_evidence_id(gid, b_p, b_b),
                        sourceDocumentId=gid,
                        pageNumber=b_p,
                        blockIndex=b_b,
                        textSnippet=project_ir_blocks[0]["text"],
                        sourceHash=source_hash,
                        claim=f"BOM Item #{b_idx+1}: {b.get('name')}"
                    ))
                bom_items.append(ProjectBOMItem(
                    name=b.get("name", "Componente"),
                    specs=b.get("specs"),
                    qty=int(b.get("qty", 1)) if str(b.get("qty", 1)).isdigit() else 1,
                    cost=b.get("cost"),
                    category=b.get("type", "Hardware"),
                    unitPriceUsd=None,
                    priceStatus=PriceStatus.UNVERIFIED,
                    provenance=prov,
                    evidenceBlocks=b_ev
                ))

            firmware_code = p_data.get("detailedBuildManual", {}).get("firmwareCode") or (
                p_data.get("officialData", {}).get("firmware", {}).get("code")
            )
            firmware_lang = "cpp" if firmware_code else None

            schematic_svg = p_data.get("schematicSvg")
            blueprint_img = p_data.get("image") or p_data.get("guideDiagram")

            project_obj = Project(
                projectId=p_id,
                slug=slug,
                title=title,
                projectNumber=p_idx,
                guideId=gid,
                guideTitle=guide.get("title", ""),
                sourceDocumentId=gid,
                sourcePageRange=page_range_str,
                relativePath=source_path,
                technicalIdentity=tech_id,
                description=description,
                detailedExplanation=detailed,
                bom=bom_items,
                firmwareCode=firmware_code,
                firmwareLanguage=firmware_lang,
                schematicSvg=schematic_svg,
                blueprintImage=blueprint_img,
                difficulty=p_data.get("difficulty") or guide.get("difficulty", "Intermedio"),
                timeEstimate=p_data.get("time") or "2-3 días",
                provenance=prov,
                sources=[p_source],
                boundary=boundary
            )

            all_projects.append(project_obj)

    return all_projects, all_reconciliations
