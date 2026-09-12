"""
Tiered Golden Dataset for Project-First Architecture Verification (Prompt 02.1).
Contains controlled calibration cases for:
  - Golden-1: Single project deep audit
  - Golden-5: Diverse 5-domain projects
  - Golden-20: 20-project cross-guide representative audit
  - Full-183: Entire corpus validation
  - Anti-false-merge benchmarks
"""

import json
from pathlib import Path
from typing import Dict, List, Tuple, Any

from scripts.project_first.fabrication_patterns import BANNED_FABRICATION_PHRASES

REPO_ROOT = Path(__file__).resolve().parents[2]
IR_DIR = REPO_ROOT / "docs" / "foundation" / "ir"
_ir_cache: Dict[str, Any] = {}


def _load_ir(source_document_id: str) -> Dict[str, Any]:
    if source_document_id not in _ir_cache:
        ir_file = IR_DIR / f"{source_document_id}.json"
        _ir_cache[source_document_id] = json.load(open(ir_file, encoding="utf-8")) if ir_file.exists() else {}
    return _ir_cache[source_document_id]


def verify_evidence_against_raw_ir(p: Dict[str, Any]) -> List[str]:
    """
    Forensic Closure P02.3, Section 12: Golden assertions must not merely
    re-check the pipeline's own output for internal consistency - they must
    independently re-open the raw Document IR file on disk and confirm that
    every SOURCE section's sourceText is BYTE-IDENTICAL to the actual IR
    block text at its declared pageNumber/blockIndex. This re-derives ground
    truth from Document IR directly, rather than trusting projects.json.
    """
    errors = []
    pid = p.get("projectId", "UNKNOWN")
    gid = p.get("sourceDocumentId")
    ir_data = _load_ir(gid) if gid else {}
    pages_by_no = {pg["pageNumber"]: pg for pg in ir_data.get("pages", [])}

    exp = p.get("detailedExplanation", {})
    for sec_name, sec in exp.items():
        if not isinstance(sec, dict) or sec.get("status") != "SOURCE":
            continue
        stxt = sec.get("sourceText")
        ev_list = sec.get("evidenceBlocks", [])
        raw_segments = []
        segment_error = False
        for eb in ev_list:
            page = pages_by_no.get(eb.get("pageNumber"))
            if not page:
                errors.append(f"[{pid}] {sec_name}: evidence page {eb.get('pageNumber')} not found in raw IR {gid}")
                segment_error = True
                continue
            blocks = page.get("blocks", [])
            b_idx = eb.get("blockIndex")
            if not (0 <= b_idx < len(blocks)):
                errors.append(f"[{pid}] {sec_name}: evidence blockIndex {b_idx} out of range in raw IR {gid} p{eb.get('pageNumber')}")
                segment_error = True
                continue
            raw_segments.append(blocks[b_idx].get("text", ""))
        if segment_error:
            continue
        # A section's sourceText may span multiple literal IR blocks
        # (Forensic Closure follow-up: real structural headings capture
        # coherent multi-block spans). It must be EXACTLY the "\n\n".join()
        # of its own evidenceBlocks' raw IR text, in order - a single-block
        # section is just the degenerate case of this same check.
        reconstructed = "\n\n".join(raw_segments)
        if stxt != reconstructed:
            errors.append(f"[{pid}] {sec_name}: sourceText does NOT byte-match raw IR block text (independent re-check)")
    return errors

# Tier 1: Controlled 1-project benchmark (Digital Night-Vision Monocular)
GOLDEN_1_PROJECT = {
    "projectId": "proj-9cc1a42f66e7c4d5",
    "sourceDocumentId": "guide-001",
    "projectNumber": 1,
    "expectedTitle": "Digital Night-Vision Monocular",
    "expectedController": None,
    "expectedStartPage": 2,
    "expectedEndPage": 5,
    "minEvidenceBlocks": 1,
    "minActiveSections": 10
}

# Tier 2: Controlled 5-project benchmark across diverse engineering domains
GOLDEN_5_PROJECTS = [
    {
        "projectId": "proj-9cc1a42f66e7c4d5",
        "sourceDocumentId": "guide-001",
        "projectNumber": 1,
        "title": "Digital Night-Vision Monocular",
        "domain": "Optics & Computer Vision",
        "controller": None,
        "startPage": 2,
        "endPage": 5
    },
    {
        "projectId": "proj-3c8e3f6f2e8b24be",
        "sourceDocumentId": "guide-002",
        "projectNumber": 1,
        "title": "Indoor Position Hold (Optical Flow + ToF)",
        "domain": "Autonomous UAV & Robotics",
        "controller": None,
        "startPage": 2,
        "endPage": 4
    },
    {
        "projectId": "proj-2af812b638d86e49",
        "sourceDocumentId": "guide-003",
        "projectNumber": 1,
        "title": "Cold-Gas Reaction Thruster",
        "domain": "Aerospace & Propulsion",
        "controller": None,
        "startPage": 2,
        "endPage": 5
    },
    {
        "projectId": "proj-fe7e3a913842843d",
        "sourceDocumentId": "guide-004",
        "projectNumber": 1,
        "title": "ADS-B Aircraft Radar",
        "domain": "Software Defined Radio & RF",
        "controller": None,
        "startPage": 2,
        "endPage": 5
    },
    {
        "projectId": "proj-097a8eaf224741a8",
        "sourceDocumentId": "guide-005",
        "projectNumber": 1,
        "title": "Closed-Loop Stepper Controller",
        "domain": "Power Electronics & Motion Control",
        "controller": None,
        "startPage": 2,
        "endPage": 3
    }
]

# Tier 3: 20 audited projects across multiple guides
GOLDEN_20_PROJECTS = [
    {"projectId": "proj-9cc1a42f66e7c4d5", "sourceDocumentId": "guide-001", "projectNumber": 1, "title": "Digital Night-Vision Monocular", "controller": None, "startPage": 2, "endPage": 5},
    {"projectId": "proj-a6a7911d0a82e714", "sourceDocumentId": "guide-001", "projectNumber": 2, "title": "Wearable Heads-Up Display (HUD)", "controller": "ESP32-S3", "startPage": 5, "endPage": 8},
    {"projectId": "proj-7b3d0a559298c92a", "sourceDocumentId": "guide-001", "projectNumber": 3, "title": "Solar Perimeter Sentry Tower", "controller": "ESP32-CAM", "startPage": 8, "endPage": 11},
    {"projectId": "proj-8df10854ea1082a6", "sourceDocumentId": "guide-001", "projectNumber": 5, "title": "Off-Grid LoRa Mesh Node", "controller": "ESP32", "startPage": 13, "endPage": 15},
    {"projectId": "proj-3c8e3f6f2e8b24be", "sourceDocumentId": "guide-002", "projectNumber": 1, "title": "Indoor Position Hold (Optical Flow + ToF)", "controller": None, "startPage": 2, "endPage": 4},
    {"projectId": "proj-7251513973158948", "sourceDocumentId": "guide-002", "projectNumber": 2, "title": "Obstacle-Avoidance Sensor Ring", "controller": None, "startPage": 4, "endPage": 7},
    {"projectId": "proj-b4e3670bf00a9de2", "sourceDocumentId": "guide-002", "projectNumber": 4, "title": "2-Axis Brushless Gimbal (FOC)", "controller": None, "startPage": 9, "endPage": 11},
    {"projectId": "proj-2af812b638d86e49", "sourceDocumentId": "guide-003", "projectNumber": 1, "title": "Cold-Gas Reaction Thruster", "controller": None, "startPage": 2, "endPage": 5},
    {"projectId": "proj-8c76d2f0e14a7e6d", "sourceDocumentId": "guide-003", "projectNumber": 2, "title": "Auto-Tracking Ground Station", "controller": "ESP32", "startPage": 6, "endPage": 8},
    {"projectId": "proj-c552597bc8d468cc", "sourceDocumentId": "guide-003", "projectNumber": 4, "title": "CubeSat Flight Computer (OBC)", "controller": "STM32F4", "startPage": 12, "endPage": 15},
    {"projectId": "proj-fe7e3a913842843d", "sourceDocumentId": "guide-004", "projectNumber": 1, "title": "ADS-B Aircraft Radar", "controller": None, "startPage": 2, "endPage": 5},
    {"projectId": "proj-53dcbf9d339e022d", "sourceDocumentId": "guide-004", "projectNumber": 4, "title": "AIS Marine Vessel Tracker", "controller": None, "startPage": 13, "endPage": 15},
    {"projectId": "proj-097a8eaf224741a8", "sourceDocumentId": "guide-005", "projectNumber": 1, "title": "Closed-Loop Stepper Controller", "controller": None, "startPage": 2, "endPage": 3},
    {"projectId": "proj-14bca4088da46825", "sourceDocumentId": "guide-006", "projectNumber": 1, "title": "Custom STM32 Flight Controller", "controller": "STM32F4", "startPage": 2, "endPage": 3},
    {"projectId": "proj-02bea515e35b1b01", "sourceDocumentId": "guide-008", "projectNumber": 4, "title": "Dual-Wavelength Pulse Oximeter (PPG)", "controller": None, "startPage": 12, "endPage": 13},
    {"projectId": "proj-1a64e60857cbc87d", "sourceDocumentId": "guide-011", "projectNumber": 1, "title": "GNSS Receiver & Resilience Analysis", "controller": "ESP32", "startPage": 2, "endPage": 5},
    {"projectId": "proj-628a686b3596462b", "sourceDocumentId": "guide-014", "projectNumber": 3, "title": "Composite Armor Instrumented Impact Tester", "controller": None, "startPage": 7, "endPage": 10},
    {"projectId": "proj-0d37911802b012cb", "sourceDocumentId": "guide-017", "projectNumber": 5, "title": "Ingeniería Inversa de Productos Comerciales Reales", "controller": None, "startPage": 8, "endPage": 8},
    {"projectId": "proj-a1795bd7588ca33b", "sourceDocumentId": "guide-022", "projectNumber": 5, "title": "Programación KRL, Puesta en Marcha y Retorno", "controller": None, "startPage": 8, "endPage": 11},
    {"projectId": "proj-fb1ddf823a1438db", "sourceDocumentId": "guide-028", "projectNumber": 2, "title": "Phil's Lab High-Speed Hardware Design", "controller": None, "startPage": 3, "endPage": 3},
]

# Anti-False-Merge Benchmarks: Pairs that must NEVER be classified as EXACT_DUPLICATE
FALSE_MERGE_BENCHMARKS = [
    {
        "case": "Same MCU (ESP32) but completely different functions (Night-Vision HUD vs Satellite Station)",
        "projectA": "proj-a6a7911d0a82e714",  # Wearable Heads-Up Display (HUD)
        "projectB": "proj-8c76d2f0e14a7e6d",  # Auto-Tracking Ground Station
        "forbiddenClassification": "EXACT_DUPLICATE"
    },
    {
        "case": "Same guide family (Drone systems) but different subsystems (Position Hold vs Gimbal)",
        "projectA": "proj-3c8e3f6f2e8b24be",  # Indoor Position Hold
        "projectB": "proj-b4e3670bf00a9de2",  # 2-Axis Brushless Gimbal (FOC)
        "forbiddenClassification": "EXACT_DUPLICATE"
    },
    {
        "case": "Multi-rotor vs Satellite OBC (STM32F4 flight controller vs CubeSat OBC)",
        "projectA": "proj-14bca4088da46825",  # Custom STM32 Flight Controller
        "projectB": "proj-c552597bc8d468cc",  # CubeSat Flight Computer (OBC)
        "forbiddenClassification": "EXACT_DUPLICATE"
    }
]


def validate_project_forensic_integrity(p: Dict[str, Any]) -> List[str]:
    """Verify that an individual project has zero-fabrication and valid evidence provenance."""
    errors = []
    pid = p.get("projectId", "UNKNOWN")
    
    # A project whose boundary is honestly declared NEEDS_REVIEW (i.e. the
    # independent IR-only discovery found zero evidence for this catalog
    # slot - Section 1/6/7 MISSING_IN_IR) is a disclosed gap, not fabrication.
    # It must NOT be required to carry evidence it does not have; it MUST be
    # visibly marked as such rather than silently padded with placeholders.
    boundary = p.get("boundary") or {}
    is_declared_needs_review = boundary.get("detectionMethod") == "NEEDS_REVIEW"

    # 1. Sources exist with page bounds and evidence
    sources = p.get("sources", [])
    if not sources:
        errors.append(f"[{pid}] Missing sources array")
    else:
        for s in sources:
            pr = s.get("pageRange", [])
            if len(pr) != 2 or pr[0] <= 0 or pr[1] < pr[0]:
                if not is_declared_needs_review:
                    errors.append(f"[{pid}] Invalid pageRange: {pr}")
            ev = s.get("evidenceBlocks", [])
            if not ev and not is_declared_needs_review:
                errors.append(f"[{pid}] Source occurrence has zero evidenceBlocks")
            for eb in ev:
                if not eb.get("textSnippet"):
                    errors.append(f"[{pid}] EvidenceBlock missing textSnippet")
                if not eb.get("sourceHash") or len(eb.get("sourceHash")) != 64:
                    errors.append(f"[{pid}] EvidenceBlock invalid sourceHash")

    # 2. Detailed explanation zero fabrication check
    exp = p.get("detailedExplanation", {})
    banned_phrases = BANNED_FABRICATION_PHRASES
    for sec_name, sec in exp.items():
        if not sec:
            continue
        stxt = sec.get("sourceText")
        status = sec.get("status")
        ev_list = sec.get("evidenceBlocks", [])
        
        # Zero placeholder or banned strings
        if stxt:
            for bp in banned_phrases:
                if bp.lower() in stxt.lower():
                    errors.append(f"[{pid}] Section {sec_name} contains banned/placeholder string in sourceText: '{bp}'")
            
        # Status consistency
        if stxt is not None and status != "SOURCE":
            errors.append(f"[{pid}] Section {sec_name} has sourceText but status is {status}")
        if status == "SOURCE" and not ev_list:
            errors.append(f"[{pid}] Section {sec_name} status is SOURCE but has zero evidenceBlocks")
        if status == "NOT_DOCUMENTED" and stxt is not None:
            errors.append(f"[{pid}] Section {sec_name} status is NOT_DOCUMENTED but sourceText is non-null")
            
    # 3. Description answers core questions or declares NOT_DOCUMENTED
    desc = p.get("description", {})
    fstatus = desc.get("fieldStatus", {})
    
    what_is_it = desc.get("whatIsIt")
    if not what_is_it or len(str(what_is_it).strip()) < 5:
        errors.append(f"[{pid}] Description field 'whatIsIt' is missing or too short")
        
    what_does = desc.get("whatDoesItDo")
    if what_does is None:
        status_val = fstatus.get("whatDoesItDo")
        if status_val not in ["NOT_DOCUMENTED", None]:
            errors.append(f"[{pid}] Description field 'whatDoesItDo' is None but fieldStatus is {status_val}")
    elif len(str(what_does).strip()) < 5:
        errors.append(f"[{pid}] Description field 'whatDoesItDo' is too short: '{what_does}'")
        
    purp = desc.get("purpose")
    if purp is None:
        status_val = fstatus.get("purpose")
        if status_val not in ["NOT_DOCUMENTED", None]:
            errors.append(f"[{pid}] Description field 'purpose' is None but fieldStatus is {status_val}")
    elif len(str(purp).strip()) < 5:
        errors.append(f"[{pid}] Description field 'purpose' is too short: '{purp}'")
        
    return errors


def run_golden_tier_1(catalog: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Execute Golden-1 verification."""
    errors = []
    projects = {p["projectId"]: p for p in catalog.get("projects", [])}
    
    g1 = GOLDEN_1_PROJECT
    pid = g1["projectId"]
    if pid not in projects:
        return False, [f"Golden-1 project {pid} not found in catalog"]
        
    p = projects[pid]
    if p["title"] != g1["expectedTitle"]:
        errors.append(f"Golden-1 title mismatch: expected '{g1['expectedTitle']}', got '{p['title']}'")
    if p["sourceDocumentId"] != g1["sourceDocumentId"]:
        errors.append(f"Golden-1 guide mismatch: expected '{g1['sourceDocumentId']}', got '{p['sourceDocumentId']}'")
        
    pr = p["sources"][0]["pageRange"]
    if pr[0] != g1["expectedStartPage"] or pr[1] != g1["expectedEndPage"]:
        errors.append(f"Golden-1 pageRange mismatch: expected [{g1['expectedStartPage']}, {g1['expectedEndPage']}], got {pr}")
        
    errors.extend(validate_project_forensic_integrity(p))
    errors.extend(verify_evidence_against_raw_ir(p))
    return len(errors) == 0, errors


def run_golden_tier_5(catalog: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Execute Golden-5 verification across 5 diverse engineering domains."""
    errors = []
    projects = {p["projectId"]: p for p in catalog.get("projects", [])}
    
    for g in GOLDEN_5_PROJECTS:
        pid = g["projectId"]
        if pid not in projects:
            errors.append(f"Golden-5 project {pid} ({g['title']}) not found in catalog")
            continue
        p = projects[pid]
        if p["title"] != g["title"]:
            errors.append(f"Golden-5 title mismatch for {pid}: '{p['title']}' != '{g['title']}'")
        errors.extend(validate_project_forensic_integrity(p))
        errors.extend(verify_evidence_against_raw_ir(p))
        
    return len(errors) == 0, errors


def run_golden_tier_20(catalog: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Execute Golden-20 representative cross-guide audit."""
    errors = []
    projects = {p["projectId"]: p for p in catalog.get("projects", [])}
    
    for g in GOLDEN_20_PROJECTS:
        pid = g["projectId"]
        if pid not in projects:
            errors.append(f"Golden-20 project {pid} ({g['title']}) not found in catalog")
            continue
        p = projects[pid]
        if p["title"] != g["title"]:
            errors.append(f"Golden-20 title mismatch for {pid}: '{p['title']}' != '{g['title']}'")
        errors.extend(validate_project_forensic_integrity(p))
        errors.extend(verify_evidence_against_raw_ir(p))
        
    return len(errors) == 0, errors


def run_golden_tier_full(catalog: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Execute Full-183 complete corpus forensic verification."""
    errors = []
    projects = catalog.get("projects", [])
    if len(projects) != 183:
        errors.append(f"Full-183: Expected exactly 183 projects, got {len(projects)}")
        
    for p in projects:
        errors.extend(validate_project_forensic_integrity(p))
        errors.extend(verify_evidence_against_raw_ir(p))
        
    return len(errors) == 0, errors
