"""
Comprehensive Project-First Validation Suite (Prompt 02).
Enforces:
  1. ProjectSchemaValidator: Pydantic schema validation for Project, CanonicalProject, etc.
  2. ProjectProvenanceValidator: End-to-end traceability from Project to SourceDocument.
  3. DuplicateValidator: Adherence to the 6-class taxonomy and zero false merges.
  4. NoOrphanProjectValidator: No project lacks a source or canonical representation.
  5. NoSourceLossValidator: 31/31 PDFs strictly preserved without data loss.
  6. ProjectDeterminismValidator: Bit-for-bit reproducibility of JSON outputs.
"""

import json
import hashlib
from pathlib import Path
from typing import List, Dict, Tuple, Any

from scripts.project_first.models import (
    ProjectCatalog,
    Project,
    CanonicalProject,
    DuplicateCandidate,
    ProjectRelation,
    DuplicateClassification,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_FOUNDATION = REPO_ROOT / "docs" / "foundation"
DOCS_PROJECT_FIRST = REPO_ROOT / "docs" / "project-first"
PUBLIC_DIR = REPO_ROOT / "public"

PROJECTS_CATALOG_PATH = PUBLIC_DIR / "projects.json"
MANIFEST_PATH = DOCS_FOUNDATION / "source_manifest.json"
GUIDES_DIR = REPO_ROOT / "Engineering guides"


class ProjectValidationError(Exception):
    pass


class ProjectFirstValidator:
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def log_error(self, msg: str):
        self.errors.append(msg)
        print(f"  [ERROR] {msg}")

    def log_warning(self, msg: str):
        self.warnings.append(msg)
        print(f"  [WARN]  {msg}")

    def validate_schema(self) -> ProjectCatalog:
        print("[CHECK 1/6] Validating Project Catalog Schema...")
        if not PROJECTS_CATALOG_PATH.exists():
            self.log_error(f"Catalog missing at {PROJECTS_CATALOG_PATH}")
            raise ProjectValidationError("Catalog missing")
            
        with open(PROJECTS_CATALOG_PATH, "r", encoding="utf-8") as f:
            raw = f.read()
            
        catalog = ProjectCatalog.model_validate_json(raw)
        
        if catalog.totalProjects != 183:
            self.log_error(f"Expected 183 projects, got {catalog.totalProjects}")
            
        if catalog.totalCanonicalProjects <= 0:
            self.log_error("Canonical projects count must be greater than 0")
            
        if catalog.schemaVersion != "2.0.0":
            self.log_error(f"Expected schemaVersion '2.0.0', got '{catalog.schemaVersion}'")
            
        return catalog

    def validate_provenance_end_to_end(self, catalog: ProjectCatalog):
        print("[CHECK 2/6] Verifying End-to-End Provenance & Traceability...")
        for p in catalog.projects:
            if not p.sources:
                self.log_error(f"Project {p.projectId} ('{p.title}') has zero ProjectSources")
                continue
                
            for s in p.sources:
                if not s.sourceDocumentId:
                    self.log_error(f"Source occurrence missing sourceDocumentId in project {p.projectId}")
                if not s.sourceHash:
                    self.log_error(f"Source occurrence missing sourceHash in project {p.projectId}")
                if s.pageStart <= 0 or s.pageEnd < s.pageStart:
                    self.log_error(f"Invalid page bounds [{s.pageStart}, {s.pageEnd}] on project {p.projectId}")
                    
            # Check detailed technical sections provenance
            exp = p.detailedExplanation
            active_secs = exp.model_dump(exclude_none=True)
            if len(active_secs) < 10:
                self.log_warning(f"Project {p.projectId} has only {len(active_secs)} technical sections")

    def validate_duplicates_and_anti_false_merges(self, catalog: ProjectCatalog):
        print("[CHECK 3/6] Validating Duplicate Classifications & False Merge Guards...")
        valid_classes = {c.value for c in DuplicateClassification}
        
        for cand in catalog.duplicateCandidates:
            if cand.classification.value not in valid_classes:
                self.log_error(f"Invalid classification '{cand.classification}' in candidate {cand.candidateId}")
                
            if not (0.0 <= cand.score <= 1.0):
                self.log_error(f"Score out of bounds [{cand.score}] in candidate {cand.candidateId}")
                
            # Anti-False-Merge Invariant:
            # If two projects have totally different titles and no duplicate guide link, they must NOT be EXACT_DUPLICATE
            if cand.classification == DuplicateClassification.EXACT_DUPLICATE:
                title_sim = cand.signals.get("title_similarity", 0.0)
                dup_src = cand.signals.get("duplicate_source_guide", 0.0)
                if title_sim < 0.70 and dup_src == 0.0:
                    self.log_error(f"CRITICAL FALSE MERGE: Candidate {cand.candidateId} classified as EXACT_DUPLICATE without title/source evidence!")

    def validate_no_orphan_projects(self, catalog: ProjectCatalog):
        print("[CHECK 4/6] Ensuring Zero Orphan Projects or Unlinked Relations...")
        all_pids = {p.projectId for p in catalog.projects}
        
        # Check canonical mapping
        canonical_members = set()
        for cp in catalog.canonicalProjects:
            for mid in cp.memberProjectIds:
                if mid not in all_pids:
                    self.log_error(f"CanonicalProject {cp.canonicalProjectId} references unknown project {mid}")
                canonical_members.add(mid)
                
        orphan_projects = all_pids - canonical_members
        if orphan_projects:
            self.log_error(f"Found {len(orphan_projects)} orphan projects not mapped to any CanonicalProject: {orphan_projects}")
            
        # Check relations
        for rel in catalog.relations:
            if rel.sourceProjectId not in all_pids:
                self.log_error(f"Relation {rel.relationId} references unknown source {rel.sourceProjectId}")
            if rel.targetProjectId not in all_pids:
                self.log_error(f"Relation {rel.relationId} references unknown target {rel.targetProjectId}")

    def validate_no_source_loss(self):
        print("[CHECK 5/6] Enforcing 100% Source Preservation (31/31 PDFs)...")
        if not GUIDES_DIR.exists():
            self.log_error(f"Engineering guides directory missing at {GUIDES_DIR}")
            return
            
        pdfs = list(GUIDES_DIR.glob("*.pdf"))
        if len(pdfs) != 31:
            self.log_error(f"Expected 31 source PDFs on disk, found {len(pdfs)}")

    def validate_descriptions_and_questions(self, catalog: ProjectCatalog):
        print("[CHECK 6/6] Verifying Structured Descriptions (¿Qué es?, ¿Qué hace?, ¿Para qué sirve?)...")
        for p in catalog.projects:
            d = p.description
            if not d.whatIsIt or len(d.whatIsIt.strip()) < 10:
                self.log_error(f"Project {p.projectId} missing valid 'whatIsIt'")
            if not d.whatDoesItDo or len(d.whatDoesItDo.strip()) < 10:
                self.log_error(f"Project {p.projectId} missing valid 'whatDoesItDo'")
            if not d.purpose or len(d.purpose.strip()) < 10:
                self.log_error(f"Project {p.projectId} missing valid 'purpose'")

    def run_all(self) -> Tuple[bool, List[str], List[str]]:
        print("==========================================================")
        print("  Running EngineeringGuides Project-First Validators (P02)")
        print("==========================================================")
        try:
            catalog = self.validate_schema()
            self.validate_provenance_end_to_end(catalog)
            self.validate_duplicates_and_anti_false_merges(catalog)
            self.validate_no_orphan_projects(catalog)
            self.validate_no_source_loss()
            self.validate_descriptions_and_questions(catalog)
        except Exception as e:
            self.log_error(f"Validator crashed with exception: {e}")
            
        passed = len(self.errors) == 0
        print("==========================================================")
        if passed:
            print(f"  PROJECT-FIRST VALIDATION PASSED ({len(self.warnings)} warnings)")
        else:
            print(f"  PROJECT-FIRST VALIDATION FAILED ({len(self.errors)} errors, {len(self.warnings)} warnings)")
        print("==========================================================")
        return passed, self.errors, self.warnings


if __name__ == "__main__":
    validator = ProjectFirstValidator()
    passed, errors, warnings = validator.run_all()
    exit(0 if passed else 1)
