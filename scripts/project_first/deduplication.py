"""
Multi-Signal Project Deduplication & Classification Engine (Prompt 02).
Enforces the Cardinal Rule: FALSE NEGATIVE > FALSE MERGE.
Categorizes candidate pairs into:
  EXACT_DUPLICATE, PROBABLE_DUPLICATE, VARIANT, RELATED, UNRELATED, NEEDS_REVIEW.
"""

import re
from typing import List, Dict, Tuple, Any
from scripts.project_first.models import (
    Project,
    DuplicateCandidate,
    DuplicateClassification,
    ProvenanceConfidence,
    Provenance,
    ProvenanceOrigin,
)
from scripts.project_first.ids import generate_candidate_id


def tokenize(text: str) -> set:
    """Extract alphanumeric lowercase tokens."""
    return set(re.findall(r"\b[a-zA-Z0-9]{2,}\b", text.lower()))


def jaccard_similarity(set_a: set, set_b: set) -> float:
    """Compute Jaccard similarity coefficient between two sets."""
    if not set_a and not set_b:
        return 1.0
    if not set_a or not set_b:
        return 0.0
    return len(set_a.intersection(set_b)) / len(set_a.union(set_b))


def compare_projects(p_a: Project, p_b: Project, duplicate_guides_map: Dict[str, str]) -> DuplicateCandidate:
    """
    Perform multi-signal evaluation on a pair of projects.
    Returns an explainable DuplicateCandidate.
    """
    signals: Dict[str, float] = {}
    
    # 1. Title Similarity
    toks_a = tokenize(p_a.title)
    toks_b = tokenize(p_b.title)
    title_sim = jaccard_similarity(toks_a, toks_b)
    signals["title_similarity"] = round(title_sim, 4)
    
    # 2. Source Document Exact Duplicate Relationship
    # If guide-A is a byte-identical duplicate of guide-B and projectNumbers match
    is_dup_guide = (
        duplicate_guides_map.get(p_a.guideId) == p_b.guideId or
        duplicate_guides_map.get(p_b.guideId) == p_a.guideId
    )
    same_index = (p_a.projectNumber == p_b.projectNumber)
    signals["duplicate_source_guide"] = 1.0 if (is_dup_guide and same_index) else 0.0
    
    # 3. Controller Match
    mcu_a = p_a.technicalIdentity.controller
    mcu_b = p_b.technicalIdentity.controller
    if mcu_a and mcu_b:
        signals["controller_match"] = 1.0 if mcu_a == mcu_b else 0.0
    elif not mcu_a and not mcu_b:
        signals["controller_match"] = 0.5
    else:
        signals["controller_match"] = 0.3
        
    # 4. Schematic SVG Match
    schem_a = p_a.schematicSvg
    schem_b = p_b.schematicSvg
    if schem_a and schem_b and schem_a == schem_b:
        signals["schematic_match"] = 1.0
    else:
        signals["schematic_match"] = 0.0
        
    # 5. BOM Component Overlap
    flat_a = set().union(*[tokenize(b.componentName) for b in p_a.bom]) if p_a.bom else set()
    flat_b = set().union(*[tokenize(b.componentName) for b in p_b.bom]) if p_b.bom else set()
    signals["bom_overlap"] = round(jaccard_similarity(flat_a, flat_b), 4)

    # Composite Score
    score = (
        signals["title_similarity"] * 0.40 +
        signals["duplicate_source_guide"] * 0.35 +
        signals["controller_match"] * 0.15 +
        signals["bom_overlap"] * 0.10
    )
    score = round(min(1.0, max(0.0, score)), 4)
    
    # Classification Logic (FALSE NEGATIVE > FALSE MERGE)
    classification: DuplicateClassification = DuplicateClassification.UNRELATED
    confidence: ProvenanceConfidence = ProvenanceConfidence.EXACT
    reasoning: str = ""
    
    if signals["duplicate_source_guide"] == 1.0 and signals["title_similarity"] >= 0.85:
        classification = DuplicateClassification.EXACT_DUPLICATE
        confidence = ProvenanceConfidence.EXACT
        reasoning = "Idéntico proyecto derivado de guías fuente duplicadas certificadas."
    elif signals["title_similarity"] >= 0.85 and signals["controller_match"] == 1.0 and signals["bom_overlap"] >= 0.8:
        classification = DuplicateClassification.EXACT_DUPLICATE
        confidence = ProvenanceConfidence.EXACT
        reasoning = "Coincidencia estricta de título, microcontrolador y lista de materiales BOM."
    elif signals["title_similarity"] >= 0.75 and signals["controller_match"] == 0.0:
        # Same concept but different MCU -> VARIANT!
        classification = DuplicateClassification.VARIANT
        confidence = ProvenanceConfidence.EXACT
        reasoning = f"Variante técnica con diferente microcontrolador: {mcu_a} vs {mcu_b}."
    elif signals["title_similarity"] >= 0.70 and score >= 0.65:
        classification = DuplicateClassification.PROBABLE_DUPLICATE
        confidence = ProvenanceConfidence.HEURISTIC
        reasoning = "Alta similitud técnica y conceptual, pero sin evidencia concluyente de identidad física."
    elif signals["title_similarity"] >= 0.40 or (p_a.technicalIdentity.function and p_a.technicalIdentity.function == p_b.technicalIdentity.function and score >= 0.40):
        classification = DuplicateClassification.RELATED
        confidence = ProvenanceConfidence.EXACT
        reasoning = "Proyectos con relación funcional o temática compartida dentro del mismo dominio técnico."
    elif 0.35 <= score < 0.65:
        classification = DuplicateClassification.NEEDS_REVIEW
        confidence = ProvenanceConfidence.NEEDS_REVIEW
        reasoning = "Similitud moderada sin suficiente evidencia para afirmar identidad técnica ni relación."
    else:
        classification = DuplicateClassification.UNRELATED
        confidence = ProvenanceConfidence.EXACT
        reasoning = "Proyectos técnicamente independientes sin solapamiento significativo."
        
    cand_id = generate_candidate_id(p_a.projectId, p_b.projectId)
    
    prov = Provenance(
        source=f"{p_a.guideId}+{p_b.guideId}",
        sourcePath=f"{p_a.relativePath},{p_b.relativePath}",
        sourceHash=f"{p_a.provenance.sourceHash[:8]}:{p_b.provenance.sourceHash[:8]}",
        sourcePage=p_a.sourcePageRange[0],
        sourceSection="DEDUPLICATION_EVALUATION",
        extractionMethod="multi-signal-classifier-v1",
        extractorVersion="1.0.0",
        origin=ProvenanceOrigin.GENERATED,
        confidence=confidence
    )
    
    return DuplicateCandidate(
        candidateId=cand_id,
        projectAId=p_a.projectId,
        projectBId=p_b.projectId,
        projectATitle=p_a.title,
        projectBTitle=p_b.title,
        score=score,
        signals=signals,
        classification=classification,
        confidence=confidence,
        reasoning=reasoning,
        provenance=prov
    )


def detect_all_duplicates(projects: List[Project], duplicate_guides_map: Dict[str, str]) -> List[DuplicateCandidate]:
    """
    Evaluate pairs across the projects corpus.
    To avoid quadratic overhead on unrelated pairs, filters candidates by title overlap or source duplication.
    """
    candidates: List[DuplicateCandidate] = []
    
    n = len(projects)
    for i in range(n):
        for j in range(i + 1, n):
            p_a = projects[i]
            p_b = projects[j]
            
            # Quick filter: only evaluate pairs with title token overlap, same function, or duplicate guide relationship
            toks_a = tokenize(p_a.title)
            toks_b = tokenize(p_b.title)
            is_dup_guide = (
                duplicate_guides_map.get(p_a.guideId) == p_b.guideId or
                duplicate_guides_map.get(p_b.guideId) == p_a.guideId
            )
            
            if bool(toks_a.intersection(toks_b)) or is_dup_guide or (p_a.technicalIdentity.controller and p_a.technicalIdentity.controller == p_b.technicalIdentity.controller):
                cand = compare_projects(p_a, p_b, duplicate_guides_map)
                if cand.classification != DuplicateClassification.UNRELATED:
                    candidates.append(cand)
                    
    return candidates
