"""
Master Deterministic Project-First Pipeline (Prompt 02).
Orchestrates:
  Project Extraction -> Deduplication & Classification ->
  Cross-Source Reconciliation -> Graph Building -> Deterministic Catalog Compilation.
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
from scripts.project_first.extractor import extract_all_projects
from scripts.project_first.deduplication import detect_all_duplicates
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
    print("  Executing EngineeringGuides Project-First Pipeline (P02)")
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
            
    # 2. Extract All Projects (Rule 1 Project = 1 Project)
    print("--> Step 1/5: Extracting all technical projects from 31 guides...")
    projects: List[Project] = extract_all_projects()
    print(f"    Total projects extracted: {len(projects)}")
    
    # 3. Detect and Classify Duplicates (Multi-signal Taxonomy)
    print("--> Step 2/5: Evaluating candidate pairs with multi-signal taxonomy...")
    candidates: List[DuplicateCandidate] = detect_all_duplicates(projects, dup_guides_map)
    exact_dups = [c for c in candidates if c.classification.value == "EXACT_DUPLICATE"]
    variants = [c for c in candidates if c.classification.value == "VARIANT"]
    related = [c for c in candidates if c.classification.value == "RELATED"]
    needs_review = [c for c in candidates if c.classification.value == "NEEDS_REVIEW"]
    
    print(f"    Duplicate candidates evaluated: {len(candidates)}")
    print(f"    - EXACT_DUPLICATE: {len(exact_dups)}")
    print(f"    - VARIANT:         {len(variants)}")
    print(f"    - RELATED:         {len(related)}")
    print(f"    - NEEDS_REVIEW:    {len(needs_review)}")
    
    # 4. Cross-Source Reconciliation & Project Graph
    print("--> Step 3/5: Reconciling canonical projects and building relation graph...")
    canonical_projects, relations = build_canonical_projects(projects, candidates)
    print(f"    Canonical Projects consolidated: {len(canonical_projects)}")
    print(f"    Project Relations established:   {len(relations)}")
    
    # 5. Build ProjectCatalog
    catalog = ProjectCatalog(
        schemaVersion="2.0.0",
        generator="engineering-guides-project-first",
        generatorVersion="1.0.0",
        totalProjects=len(projects),
        totalCanonicalProjects=len(canonical_projects),
        totalVariants=len(variants),
        totalDuplicateCandidates=len(candidates),
        totalRelations=len(relations),
        projects=projects,
        canonicalProjects=canonical_projects,
        duplicateCandidates=candidates,
        relations=relations
    )
    
    # 6. Save Deterministic Artifacts
    print("--> Step 4/5: Serializing deterministic JSON datasets...")
    
    # public/projects.json
    PUBLIC_PROJECTS_PATH.write_text(
        json.dumps(catalog.model_dump(), indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # docs/project-first/ projects, canonical, relations, candidates
    (DOCS_PROJECT_FIRST / "projects.json").write_text(
        json.dumps([p.model_dump() for p in projects], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    (DOCS_PROJECT_FIRST / "canonical_projects.json").write_text(
        json.dumps([cp.model_dump() for cp in canonical_projects], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    (DOCS_PROJECT_FIRST / "duplicate_candidates.json").write_text(
        json.dumps([c.model_dump() for c in candidates], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    (DOCS_PROJECT_FIRST / "relations.json").write_text(
        json.dumps([r.model_dump() for r in relations], indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    
    # 7. Update public/guides.json linking each keyProject to its deterministic projectId
    print("--> Step 5/5: Synchronizing documentary guide catalog with Project IDs...")
    if PUBLIC_GUIDES_PATH.exists():
        with open(PUBLIC_GUIDES_PATH, "r", encoding="utf-8") as f:
            guides_data = json.load(f)
            
        proj_by_guide_and_num = {(p.guideId, p.projectNumber): p for p in projects}
        cproj_by_member = {}
        for cp in canonical_projects:
            for mid in cp.memberProjectIds:
                cproj_by_member[mid] = cp.canonicalProjectId
                
        for g in guides_data.get("guides", []):
            gid = g.get("id")
            for idx, kp in enumerate(g.get("keyProjects", []), 1):
                matched = proj_by_guide_and_num.get((gid, idx))
                if matched:
                    kp["projectId"] = matched.projectId
                    kp["projectSlug"] = matched.slug
                    kp["canonicalProjectId"] = cproj_by_member.get(matched.projectId)
                    
        PUBLIC_GUIDES_PATH.write_text(
            json.dumps(guides_data, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
            encoding="utf-8"
        )
        
    print("==========================================================")
    print(f"  PROJECT-FIRST PIPELINE COMPLETED SUCCESSFULLY")
    print(f"  - 183 Projects, {len(canonical_projects)} Canonical Projects, {len(relations)} Relations")
    print("==========================================================")
    
    return {
        "totalProjects": len(projects),
        "totalCanonical": len(canonical_projects),
        "totalCandidates": len(candidates),
        "totalRelations": len(relations)
    }


if __name__ == "__main__":
    run_project_first_pipeline()
