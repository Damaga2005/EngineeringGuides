"""
Multi-Signal Project Deduplication & Classification Engine (Prompt 02.3).
Strictly implements:
1. FALSE NEGATIVE > FALSE MERGE invariant.
2. Formal, unified definition of EXACT_DUPLICATE based solely on UNEQUIVOCAL IDENTITY EVIDENCE.
3. Separation of IDENTITY EVIDENCE from SIMILARITY EVIDENCE (text similarity alone NEVER creates EXACT_DUPLICATE).
4. Exhaustive pairwise evaluation across all 183 * 182 / 2 = 16,653 pairs.
"""

import re
from typing import List, Dict, Tuple, Any, Set
from scripts.project_first.models import (
    Project,
    DuplicateCandidate,
    DuplicateClassification,
    ProvenanceConfidence,
)
from scripts.project_first.ids import generate_candidate_id


def tokenize(text: str) -> Set[str]:
    """Extract alphanumeric lowercase tokens."""
    if not text:
        return set()
    return set(re.findall(r"\b[a-zA-Z0-9]{2,}\b", text.lower()))


def jaccard_similarity(set_a: Set[str], set_b: Set[str]) -> float:
    """Compute Jaccard similarity coefficient between two sets."""
    if not set_a and not set_b:
        return 1.0
    if not set_a or not set_b:
        return 0.0
    return len(set_a.intersection(set_b)) / len(set_a.union(set_b))


def normalize_title(text: str) -> str:
    """Clean title string for exact comparison."""
    return re.sub(r'[^a-z0-9]', '', text.lower())


def evaluate_project_pair(
    p_a: Project,
    p_b: Project,
    duplicate_guides_map: Dict[str, str]
) -> DuplicateCandidate:
    """
    Perform rigorous multi-signal evaluation on a pair of projects.
    Separates IDENTITY EVIDENCE from SIMILARITY EVIDENCE.
    Strictly forbids EXACT_DUPLICATE classification based solely on textual/BOM similarity.
    """
    signals: Dict[str, Any] = {}
    identity_evidence: List[str] = []
    similarity_evidence: List[str] = []
    conflict_evidence: List[str] = []
    
    # 1. Exact Title Match & Token Jaccard
    norm_title_a = normalize_title(p_a.title)
    norm_title_b = normalize_title(p_b.title)
    exact_title_match = (norm_title_a == norm_title_b)
    
    toks_a = tokenize(p_a.title)
    toks_b = tokenize(p_b.title)
    title_jaccard = jaccard_similarity(toks_a, toks_b)
    
    signals["exact_title_match"] = exact_title_match
    signals["title_similarity"] = round(title_jaccard, 4)
    if exact_title_match:
        similarity_evidence.append("Títulos idénticos tras normalización alfanumérica.")
    elif title_jaccard > 0.6:
        similarity_evidence.append(f"Alta similitud léxica de títulos ({title_jaccard:.2f}).")

    # 2. Source Document Duplication Signal
    # Byte-level identical PDF origin check
    source_hash_a = p_a.sources[0].sourceHash if p_a.sources else None
    source_hash_b = p_b.sources[0].sourceHash if p_b.sources else None
    same_source_hash = (source_hash_a is not None and source_hash_a == source_hash_b and p_a.guideId != p_b.guideId)
    same_slot = (p_a.projectNumber == p_b.projectNumber)
    
    signals["same_source_hash"] = same_source_hash
    signals["same_project_slot"] = same_slot
    
    if same_source_hash and same_slot:
        if exact_title_match:
            identity_evidence.append(f"Mismo slot de proyecto (#{p_a.projectNumber}) en PDFs fuente idénticos bit a bit (SHA: {source_hash_a[:12]}...).")
        else:
            conflict_evidence.append(f"Mismo slot en PDFs duplicados pero títulos divergen: '{p_a.title}' vs '{p_b.title}'.")

    # 3. Controller / MCU Analysis
    mcu_a = p_a.technicalIdentity.controller
    mcu_b = p_b.technicalIdentity.controller
    
    if mcu_a and mcu_b:
        controller_match = (mcu_a.lower() == mcu_b.lower())
        signals["controller_match"] = 1.0 if controller_match else 0.0
        if controller_match:
            similarity_evidence.append(f"Mismo microcontrolador principal: {mcu_a}.")
        else:
            conflict_evidence.append(f"Discrepancia crítica de controlador: {mcu_a} vs {mcu_b}.")
    elif not mcu_a and not mcu_b:
        signals["controller_match"] = 0.5
    else:
        signals["controller_match"] = 0.2
        conflict_evidence.append(f"Controlador asimétrico: {mcu_a or 'None'} vs {mcu_b or 'None'}.")

    # 4. Schematic Vector Match
    schem_a = p_a.schematicSvg
    schem_b = p_b.schematicSvg
    schematic_match = bool(schem_a and schem_b and schem_a == schem_b)
    signals["schematic_match"] = 1.0 if schematic_match else 0.0
    if schematic_match:
        identity_evidence.append(f"Mismo esquemático vectorial SVG compartido: {schem_a}.")

    # 5. BOM Overlap (Tokenized word-level set union)
    bom_toks_a = set().union(*[tokenize(b.name) for b in p_a.bom if b.name]) if p_a.bom else set()
    bom_toks_b = set().union(*[tokenize(b.name) for b in p_b.bom if b.name]) if p_b.bom else set()
    bom_overlap = jaccard_similarity(bom_toks_a, bom_toks_b)
    signals["bom_overlap"] = round(bom_overlap, 4)
    if bom_overlap >= 0.35:
        similarity_evidence.append(f"Lista de materiales con componentes compartidos ({bom_overlap:.2f}).")

    # 6. Primary Sensor Comparison
    sensors_a = set(normalize_title(s) for s in p_a.technicalIdentity.sensors)
    sensors_b = set(normalize_title(s) for s in p_b.technicalIdentity.sensors)
    sensor_overlap = jaccard_similarity(sensors_a, sensors_b)
    signals["sensor_overlap"] = round(sensor_overlap, 4)
    if sensors_a and sensors_b and not sensors_a.intersection(sensors_b):
        conflict_evidence.append(f"Discrepancia en sensores clave: {list(p_a.technicalIdentity.sensors)} vs {list(p_b.technicalIdentity.sensors)}.")

    # Composite Similarity Score
    sim_score = (
        title_jaccard * 0.40 +
        signals.get("controller_match", 0.0) * 0.25 +
        bom_overlap * 0.20 +
        sensor_overlap * 0.15
    )
    sim_score = round(min(1.0, max(0.0, sim_score)), 4)
    
    # STRICT CLASSIFICATION ENGINE (Enforces FALSE NEGATIVE > FALSE MERGE)
    # Definition of EXACT_DUPLICATE: Requires unequivocal, hard IDENTITY EVIDENCE.
    # Textual similarity (title + MCU + BOM overlap) can NEVER produce EXACT_DUPLICATE on its own.
    classification = DuplicateClassification.UNRELATED
    is_exact = False
    
    if same_source_hash and same_slot and exact_title_match:
        is_exact = True
        identity_evidence.append("Certificación de identidad por coincidencia criptográfica de PDF y slot.")
    elif exact_title_match and schematic_match and signals.get("controller_match") == 1.0:
        is_exact = True
        identity_evidence.append("Certificación de identidad por coincidencia total de esquemático y arquitectura.")
            
    if is_exact:
        classification = DuplicateClassification.EXACT_DUPLICATE
    elif conflict_evidence and (title_jaccard > 0.65 or same_source_hash or exact_title_match):
        # High similarity or same PDF but conflicting evidence -> NEVER MERGE, ISOLATE AS NEEDS_REVIEW!
        classification = DuplicateClassification.NEEDS_REVIEW
    elif exact_title_match or title_jaccard >= 0.85:
        classification = DuplicateClassification.PROBABLE_DUPLICATE
    elif signals.get("controller_match") == 1.0 and (bom_overlap > 0.4 or sensor_overlap > 0.4):
        classification = DuplicateClassification.RELATED
    elif p_a.technicalIdentity.function and p_a.technicalIdentity.function == p_b.technicalIdentity.function and title_jaccard > 0.3:
        classification = DuplicateClassification.RELATED
    elif sim_score >= 0.4:
        classification = DuplicateClassification.RELATED
    else:
        classification = DuplicateClassification.UNRELATED
        
    cand_id = generate_candidate_id(p_a.projectId, p_b.projectId)
    
    return DuplicateCandidate(
        candidateId=cand_id,
        projectAId=p_a.projectId,
        projectBId=p_b.projectId,
        similarityScore=sim_score,
        classification=classification,
        matchEvidence=similarity_evidence + identity_evidence,
        conflictEvidence=conflict_evidence,
        evaluatedSignals=signals,
        identityEvidence=identity_evidence,
        similarityEvidence=similarity_evidence
    )


def evaluate_all_pairs_exhaustive(
    projects: List[Project],
    duplicate_guides_map: Dict[str, str]
) -> Tuple[List[DuplicateCandidate], Dict[str, int]]:
    """
    Exhaustively evaluate all N * (N - 1) / 2 pairs without lossy prefiltering.
    Returns:
    - candidates: All candidates classified as EXACT_DUPLICATE, PROBABLE_DUPLICATE,
                  VARIANT, RELATED, or NEEDS_REVIEW.
    - stats: Full frequency distribution across all 6 classes.
    """
    n = len(projects)
    total_pairs = n * (n - 1) // 2
    
    candidates: List[DuplicateCandidate] = []
    stats: Dict[str, int] = {
        "total_pairs_evaluated": total_pairs,
        "EXACT_DUPLICATE": 0,
        "PROBABLE_DUPLICATE": 0,
        "VARIANT": 0,
        "RELATED": 0,
        "NEEDS_REVIEW": 0,
        "UNRELATED": 0,
    }
    
    for i in range(n):
        for j in range(i + 1, n):
            cand = evaluate_project_pair(projects[i], projects[j], duplicate_guides_map)
            cls_name = cand.classification.value
            stats[cls_name] = stats.get(cls_name, 0) + 1
            
            # Retain all pairs that have any relationship signal
            if cand.classification != DuplicateClassification.UNRELATED:
                candidates.append(cand)
                
    # Sort candidates deterministically by candidateId
    candidates.sort(key=lambda c: c.candidateId)
    return candidates, stats
