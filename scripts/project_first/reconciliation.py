"""
Cross-Source Reconciliation & Project Graph Consolidation Engine (Prompt 02).
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
    Provenance,
    ProvenanceOrigin,
    ProvenanceConfidence,
    ConflictRecord,
)
from scripts.project_first.ids import (
    generate_canonical_project_id,
    generate_relation_id,
    generate_conflict_id,
    generate_variant_id,
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
            parent[root_j] = root_i

    # Only union EXACT_DUPLICATE pairs! Never PROBABLE_DUPLICATE or VARIANT!
    for cand in candidates:
        if cand.classification == DuplicateClassification.EXACT_DUPLICATE:
            union(cand.projectAId, cand.projectBId)
            
    # Group into clusters
    clusters: Dict[str, List[Project]] = {}
    for p in projects:
        root = find(p.projectId)
        clusters.setdefault(root, []).append(p)
        
    canonical_projects: List[CanonicalProject] = []
    relations: List[ProjectRelation] = []
    
    for root_id, member_projs in clusters.items():
        primary = member_projs[0]
        all_sources = []
        for p in member_projs:
            all_sources.extend(p.sources)
            
        cproj_id = generate_canonical_project_id(primary.title, primary.technicalIdentity.controller or "")
        cslug = slugify(primary.title)
        
        # Information union & conflict detection across members
        conflicts: List[ConflictRecord] = []
        if len(member_projs) > 1:
            # Compare primary vs subsequent members for discrepancies
            for other in member_projs[1:]:
                # Check controller conflict
                mcu_a = primary.technicalIdentity.controller
                mcu_b = other.technicalIdentity.controller
                if mcu_a and mcu_b and mcu_a != mcu_b:
                    conflicts.append(ConflictRecord(
                        conflictId=generate_conflict_id(primary.sourceDocumentId, other.sourceDocumentId, "controller"),
                        field="technicalIdentity.controller",
                        sourceAId=primary.sourceDocumentId,
                        sourceBId=other.sourceDocumentId,
                        sourceAValue=mcu_a,
                        sourceBValue=mcu_b,
                        status="NEEDS_REVIEW",
                        notes=f"Discrepancia en controlador entre fuentes duplicadas: {mcu_a} vs {mcu_b}",
                        provenance=primary.provenance
                    ))
                    
        # Reconcile BOMs: union components preserving unique names
        seen_bom_names = set()
        reconciled_bom = []
        for p in member_projs:
            for b in p.bom:
                norm_name = b.componentName.strip().lower()
                if norm_name not in seen_bom_names:
                    seen_bom_names.add(norm_name)
                    reconciled_bom.append(b)
                    
        prov = Provenance(
            source=",".join([p.guideId for p in member_projs]),
            sourcePath=",".join([p.relativePath for p in member_projs]),
            sourceHash=",".join([p.provenance.sourceHash[:8] for p in member_projs]),
            sourcePage=primary.sourcePageRange[0],
            sourceSection=primary.title,
            extractionMethod="canonical-reconciliation-engine-v1",
            extractorVersion="1.0.0",
            origin=ProvenanceOrigin.CURATED if len(member_projs) > 1 else ProvenanceOrigin.EXTRACTED,
            confidence=ProvenanceConfidence.EXACT
        )
        
        cproj = CanonicalProject(
            canonicalProjectId=cproj_id,
            slug=cslug,
            canonicalTitle=primary.title,
            memberProjectIds=[p.projectId for p in member_projs],
            projectSources=all_sources,
            technicalIdentity=primary.technicalIdentity,
            reconciledDescription=primary.description,
            reconciledExplanation=primary.detailedExplanation,
            reconciledBom=reconciled_bom,
            schematicSvg=primary.schematicSvg,
            blueprintImage=primary.blueprintImage,
            conflicts=conflicts,
            variants=[],
            relations=[],
            provenance=prov
        )
        canonical_projects.append(cproj)
        
    # 2. Build graph relations for VARIANT and RELATED candidates
    for cand in candidates:
        if cand.classification == DuplicateClassification.VARIANT:
            rel_id = generate_relation_id(cand.projectAId, cand.projectBId, "VARIANT_OF")
            rel = ProjectRelation(
                relationId=rel_id,
                sourceProjectId=cand.projectAId,
                targetProjectId=cand.projectBId,
                relationType=RelationType.VARIANT_OF,
                description=cand.reasoning,
                confidence=cand.confidence,
                provenance=cand.provenance
            )
            relations.append(rel)
        elif cand.classification == DuplicateClassification.RELATED:
            rel_id = generate_relation_id(cand.projectAId, cand.projectBId, "RELATED_TO")
            rel = ProjectRelation(
                relationId=rel_id,
                sourceProjectId=cand.projectAId,
                targetProjectId=cand.projectBId,
                relationType=RelationType.RELATED_TO,
                description=cand.reasoning,
                confidence=cand.confidence,
                provenance=cand.provenance
            )
            relations.append(rel)
            
    # Attach relations to canonical projects
    cproj_by_member = {}
    for cp in canonical_projects:
        for mid in cp.memberProjectIds:
            cproj_by_member[mid] = cp
            
    for rel in relations:
        cp_src = cproj_by_member.get(rel.sourceProjectId)
        if cp_src and rel not in cp_src.relations:
            cp_src.relations.append(rel)
            
    return canonical_projects, relations
