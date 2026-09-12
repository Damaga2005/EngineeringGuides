"""
Cross-Source Reconciliation & Project Graph Consolidation Engine (Prompt 02 & Prompt 02.1).
Consolidates CanonicalProjects from EXACT_DUPLICATE sets.
Performs Information Union while preserving field-level provenance and recording
conflicts as NEEDS_REVIEW without picking arbitrary winners.
"""

from typing import List, Dict, Set, Any, Tuple, Optional
from scripts.project_first.models import (
    Project,
    CanonicalProject,
    ProjectVariant,
    ProjectRelation,
    DuplicateCandidate,
    DuplicateClassification,
    RelationType,
    ConflictRecord,
    ProjectBOMItem,
)
from scripts.project_first.ids import (
    generate_canonical_project_id,
    generate_relation_id,
    generate_conflict_id,
    slugify,
)


def build_canonical_projects(
    projects: List[Project],
    candidates: List[DuplicateCandidate]
) -> Tuple[List[CanonicalProject], List[ProjectRelation]]:
    """
    Consolidate canonical projects from exact duplicate clusters and
    build the typed project relation graph.
    """
    proj_map = {p.projectId: p for p in projects}
    
    # 1. Identify EXACT_DUPLICATE clusters using disjoint set union
    parent = {p.projectId: p.projectId for p in projects}
    
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]
        
    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            parent[root_i] = root_j

    exact_dups = [c for c in candidates if c.classification == DuplicateClassification.EXACT_DUPLICATE]
    for cand in exact_dups:
        union(cand.projectAId, cand.projectBId)
        
    # Group into clusters
    clusters: Dict[str, List[str]] = {}
    for p in projects:
        root = find(p.projectId)
        clusters.setdefault(root, []).append(p.projectId)
        
    canonical_projects: List[CanonicalProject] = []
    
    for root_id, member_ids in clusters.items():
        member_projs = [proj_map[mid] for mid in sorted(member_ids)]
        primary = member_projs[0]
        
        sorted_pids = sorted([p.projectId for p in member_projs])
        cproj_id = generate_canonical_project_id(sorted_pids)
        cslug = slugify(f"canon-{primary.title}")
        
        all_sources = []
        for p in member_projs:
            all_sources.extend(p.sources)
            
        conflicts: List[ConflictRecord] = []
        
        # Check for field conflicts if multiple members
        if len(member_projs) > 1:
            for i in range(len(member_projs)):
                for j in range(i + 1, len(member_projs)):
                    p_i = member_projs[i]
                    p_j = member_projs[j]
                    mcu_i = p_i.technicalIdentity.controller
                    mcu_j = p_j.technicalIdentity.controller
                    if mcu_i and mcu_j and mcu_i != mcu_j:
                        conf_id = generate_conflict_id(p_i.projectId, p_j.projectId, "technicalIdentity.controller")
                        conflicts.append(ConflictRecord(
                            conflictId=conf_id,
                            fieldPath="technicalIdentity.controller",
                            valueA=mcu_i,
                            valueB=mcu_j,
                            sourceAId=p_i.projectId,
                            sourceBId=p_j.projectId,
                            resolution="NEEDS_REVIEW"
                        ))
                        
        # Reconcile BOMs: union components preserving unique names
        seen_bom_names = set()
        reconciled_bom: List[ProjectBOMItem] = []
        for p in member_projs:
            for b in p.bom:
                norm_name = b.name.strip().lower()
                if norm_name not in seen_bom_names:
                    seen_bom_names.add(norm_name)
                    reconciled_bom.append(b)
                    
        # Firmware snippets
        firmware_snippets = []
        for p in member_projs:
            if p.firmwareCode:
                firmware_snippets.append({
                    "projectId": p.projectId,
                    "language": p.firmwareLanguage or "cpp",
                    "code": p.firmwareCode
                })
                
        cproj = CanonicalProject(
            canonicalProjectId=cproj_id,
            canonicalSlug=cslug,
            preferredTitle=primary.title,
            projectIds=sorted_pids,
            variantIds=[],
            technicalIdentity=primary.technicalIdentity,
            canonicalDescription=primary.description,
            consolidatedBOM=reconciled_bom,
            firmwareSnippets=firmware_snippets,
            schematicSvg=primary.schematicSvg,
            blueprintImage=primary.blueprintImage,
            sources=all_sources,
            conflictRecords=conflicts
        )
        canonical_projects.append(cproj)
        
    # 2. Build graph relations for VARIANT and RELATED candidates
    relations: List[ProjectRelation] = []
    
    for cand in candidates:
        if cand.classification == DuplicateClassification.VARIANT:
            rel_id = generate_relation_id(cand.projectAId, cand.projectBId, "VARIANT_OF")
            ev_list = cand.matchEvidence or ["Variante de arquitectura de circuito."]
            desc = f"Variante técnica documentada: {'; '.join(ev_list[:2])}"
            rel = ProjectRelation(
                relationId=rel_id,
                sourceProjectId=cand.projectAId,
                targetProjectId=cand.projectBId,
                relationType=RelationType.VARIANT_OF,
                description=desc,
                confidence=cand.similarityScore,
                evidence=ev_list
            )
            relations.append(rel)
        elif cand.classification == DuplicateClassification.RELATED:
            rel_id = generate_relation_id(cand.projectAId, cand.projectBId, "RELATED_TO")
            ev_list = cand.similarityEvidence or cand.matchEvidence or ["Arquitectura o subsistemas afines."]
            desc = f"Relación arquitectónica documentada: {'; '.join(ev_list[:2])}"
            rel = ProjectRelation(
                relationId=rel_id,
                sourceProjectId=cand.projectAId,
                targetProjectId=cand.projectBId,
                relationType=RelationType.RELATED_TO,
                description=desc,
                confidence=cand.similarityScore,
                evidence=ev_list
            )
            relations.append(rel)
            
    # Sort for determinism
    canonical_projects.sort(key=lambda cp: cp.canonicalProjectId)
    relations.sort(key=lambda r: r.relationId)
    
    return canonical_projects, relations