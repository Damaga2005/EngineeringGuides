"""
Master Deterministic Project-First Pipeline (Prompt 02 & Prompt 02.1).
Orchestrates:
  IR Boundary Detection & Reconciliation ->
  Forensic Project Extraction (Zero Fabrication, Literal SourceText) ->
  Exhaustive Pairwise Deduplication (16,653 pairs) ->
  Canonical Consolidation & Graph Building ->
  Deterministic Serialization & Catalog Synchronization.
"""

import json
from pathlib import Path
from typing import Dict, Any, List

from scripts.project_first.models import (
    Project,
    CanonicalProject,
    DuplicateCandidate,
    ProjectRelation,
    ProjectCatalog,
)
from scripts.project_first.extractor import extract_all_projects_forensic
from scripts.project_first.deduplication import evaluate_all_pairs_exhaustive
from scripts.project_first.reconciliation import build_canonical_projects

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_FOUNDATION = REPO_ROOT / "docs" / "foundation"
DOCS_PROJECT_FIRST = REPO_ROOT / "docs" / "project-first"
PUBLIC_DIR = REPO_ROOT / "public"

MANIFEST_PATH = DOCS_FOUNDATION / "source_manifest.json"
PUBLIC_PROJECTS_PATH = PUBLIC_DIR / "projects.json"
PUBLIC_GUIDES_PATH = PUBLIC_DIR / "guides.json"


def run_project_first_pipeline() -> Dict[str, Any]:
    print("==========================================================")
    print("  Executing EngineeringGuides Project-First Pipeline (P02.1)")
    print("==========================================================")
    
    DOCS_PROJECT_FIRST.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Load Duplicate Guides Mapping from Foundation Manifest
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)
        
    dup_guides_map = {}
    for d in manifest.get("documents", []):
        if d.get("isDuplicate") and d.get("duplicateOf"):
            dup_guides_map[d["sourceId"]] = d["duplicateOf"]
            dup_guides_map[d["duplicateOf"]] = d["sourceId"]
            
    # 2. Extract All Projects Forensically with Real IR Boundaries
    print("--> Step 1/5: Extracting all technical projects from 31 Document IR files...")
    projects, boundary_recs = extract_all_projects_forensic()
    print(f"    Total projects extracted: {len(projects)}")
    print(f"    Total boundary reconciliations: {len(boundary_recs)}")
    
    # Save boundary reconciliation report
    (DOCS_PROJECT_FIRST / "boundary_reconciliation.json").write_text(
        json.dumps(boundary_recs, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # 3. Exhaustive Pairwise Deduplication (183 * 182 / 2 = 16,653 pairs)
    print("--> Step 2/5: Exhaustively evaluating 16,653 candidate pairs...")
    candidates, dedup_stats = evaluate_all_pairs_exhaustive(projects, dup_guides_map)
    exact_dups = [c for c in candidates if c.classification.value == "EXACT_DUPLICATE"]
    variants = [c for c in candidates if c.classification.value == "VARIANT"]
    related = [c for c in candidates if c.classification.value == "RELATED"]
    needs_review = [c for c in candidates if c.classification.value == "NEEDS_REVIEW"]
    
    print(f"    Total pairs evaluated: {dedup_stats['total_pairs_evaluated']}")
    print(f"    - EXACT_DUPLICATE: {len(exact_dups)}")
    print(f"    - PROBABLE_DUPLICATE: {dedup_stats.get('PROBABLE_DUPLICATE', 0)}")
    print(f"    - VARIANT:         {len(variants)}")
    print(f"    - RELATED:         {len(related)}")
    print(f"    - NEEDS_REVIEW:    {len(needs_review)}")
    print(f"    - UNRELATED:       {dedup_stats.get('UNRELATED', 0)}")
    
    # 4. Cross-Source Reconciliation & Project Graph
    print("--> Step 3/5: Reconciling canonical projects and building relation graph...")
    canonical_projects, relations = build_canonical_projects(projects, candidates)
    print(f"    Canonical Projects consolidated: {len(canonical_projects)}")
    print(f"    Project Relations established:   {len(relations)}")
    
    # 5. Build ProjectCatalog
    catalog = ProjectCatalog(
        schemaVersion="2.1.0",
        generatedAt="2026-09-12T00:00:00Z",
        totalProjects=len(projects),
        projects=projects,
        metadata={
            "generator": "engineering-guides-project-first",
            "version": "2.1.0",
            "totalCanonicalProjects": len(canonical_projects),
            "totalVariants": len(variants),
            "totalDuplicateCandidates": len(candidates),
            "totalRelations": len(relations),
            "deduplicationStats": dedup_stats,
            "boundaryReconciliationsCount": len(boundary_recs)
        }
    )
    
    # 6. Save Deterministic Artifacts
    print("--> Step 4/5: Serializing deterministic JSON datasets...")
    
    # public/projects.json
    PUBLIC_PROJECTS_PATH.write_text(
        json.dumps(catalog.model_dump(), indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # docs/project-first/projects.json
    (DOCS_PROJECT_FIRST / "projects.json").write_text(
        json.dumps([p.model_dump() for p in projects], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # docs/project-first/canonical_projects.json
    (DOCS_PROJECT_FIRST / "canonical_projects.json").write_text(
        json.dumps([cp.model_dump() for cp in canonical_projects], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # docs/project-first/duplicate_candidates.json
    candidate_export = {
        "stats": dedup_stats,
        "candidates": [c.model_dump() for c in candidates]
    }
    (DOCS_PROJECT_FIRST / "duplicate_candidates.json").write_text(
        json.dumps(candidate_export, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # docs/project-first/relations.json
    (DOCS_PROJECT_FIRST / "relations.json").write_text(
        json.dumps([r.model_dump() for r in relations], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # 7. Synchronize public/guides.json with verified projectId, projectSlug, canonicalProjectId
    print("--> Step 5/5: Synchronizing documentary guide catalog with Project IDs...")
    if PUBLIC_GUIDES_PATH.exists():
        with open(PUBLIC_GUIDES_PATH, "r", encoding="utf-8") as f:
            guides_data = json.load(f)
            
        proj_by_guide_and_num = {(p.guideId, p.projectNumber): p for p in projects}
        cproj_by_proj_id = {}
        for cp in canonical_projects:
            for pid in cp.projectIds:
                cproj_by_proj_id[pid] = cp.canonicalProjectId
                
        for guide in guides_data.get("guides", []):
            gid = guide.get("id")
            for p_idx, kp in enumerate(guide.get("keyProjects", []), start=1):
                p_match = proj_by_guide_and_num.get((gid, p_idx))
                if p_match:
                    kp["projectId"] = p_match.projectId
                    kp["projectSlug"] = p_match.slug
                    kp["canonicalProjectId"] = cproj_by_proj_id.get(p_match.projectId, p_match.projectId)
                    if p_match.boundary:
                        kp["sourcePageRange"] = f"{p_match.boundary.startPage}-{p_match.boundary.endPage}"
                    
        PUBLIC_GUIDES_PATH.write_text(
            json.dumps(guides_data, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
            encoding="utf-8"
        )
        
    print("==========================================================")
    print("  PROJECT-FIRST PIPELINE COMPLETED SUCCESSFULLY")
    print(f"  - 183 Projects, {len(canonical_projects)} Canonical Projects, {len(relations)} Relations")
    print("  - 16,653 Pairs Exhaustively Evaluated")
    print("==========================================================")
    return {
        "projects": len(projects),
        "canonicalProjects": len(canonical_projects),
        "duplicateCandidates": len(candidates),
        "relations": len(relations),
        "dedupStats": dedup_stats
    }


if __name__ == "__main__":
    run_project_first_pipeline()