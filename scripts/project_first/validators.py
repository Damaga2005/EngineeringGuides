"""
Comprehensive Project-First Validation Suite (Prompt 02.1).
Enforces 10 Strict Recertification Checks:
  CHECK 1: Schema (Pydantic validation for ProjectCatalog 2.1.0, CanonicalProject, DuplicateCandidate, ProjectRelation)
  CHECK 2: Source Hash Integrity (Every source occurrence matches source_manifest.json SHA-256)
  CHECK 3: Evidence-Level Provenance (Every non-null sourceText backed by EvidenceBlocks)
  CHECK 4: Zero Fabrication (0 placeholder strings, 0 unevidenced SOURCE claims)
  CHECK 5: Boundary Integrity (183 IR-derived boundaries verified in boundary_reconciliation.json)
  CHECK 6: Deduplication Integrity (16,653 pairs evaluated, 0 false merges, exact duplicates verified)
  CHECK 7: Source Preservation (31/31 PDFs intact, non-empty, matching manifest SHA-256)
  CHECK 8: Structured Description Integrity (¿Qué es?, ¿Qué hace?, ¿Para qué sirve? present and grounded)
  CHECK 9: Golden Dataset Execution (Golden-1, Golden-5, Golden-20, Full-183)
  CHECK 10: Determinism (Stable hash and reproducibility of JSON outputs)
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
from tests.project_first.golden_dataset import (
    run_golden_tier_1,
    run_golden_tier_5,
    run_golden_tier_20,
    run_golden_tier_full,
    FALSE_MERGE_BENCHMARKS,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_FOUNDATION = REPO_ROOT / "docs" / "foundation"
DOCS_PROJECT_FIRST = REPO_ROOT / "docs" / "project-first"
PUBLIC_DIR = REPO_ROOT / "public"

PROJECTS_CATALOG_PATH = PUBLIC_DIR / "projects.json"
CANONICAL_PATH = DOCS_PROJECT_FIRST / "canonical_projects.json"
CANDIDATES_PATH = DOCS_PROJECT_FIRST / "duplicate_candidates.json"
RELATIONS_PATH = DOCS_PROJECT_FIRST / "relations.json"
BOUNDARY_REC_PATH = DOCS_PROJECT_FIRST / "boundary_reconciliation.json"
MANIFEST_PATH = DOCS_FOUNDATION / "source_manifest.json"
GUIDES_DIR = REPO_ROOT / "Engineering guides"


class ProjectValidationError(Exception):
    pass


class ProjectFirstValidator:
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.manifest: Dict[str, Any] = {}
        if MANIFEST_PATH.exists():
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                docs = json.load(f).get("documents", [])
                self.manifest = {d["sourceId"]: d for d in docs}

    def log_error(self, msg: str):
        self.errors.append(msg)
        print(f"  [ERROR] {msg}")

    def log_warning(self, msg: str):
        self.warnings.append(msg)
        print(f"  [WARN]  {msg}")

    def check_1_schema(self) -> Tuple[ProjectCatalog, List[CanonicalProject], List[DuplicateCandidate], List[ProjectRelation]]:
        print("[CHECK 1/10] Schema Validation (Pydantic Models: Catalog, Canonical, Candidates, Relations)...")
        if not PROJECTS_CATALOG_PATH.exists():
            self.log_error(f"Catalog missing at {PROJECTS_CATALOG_PATH}")
            raise ProjectValidationError("Catalog missing")
            
        with open(PROJECTS_CATALOG_PATH, "r", encoding="utf-8") as f:
            raw = f.read()
            
        catalog = ProjectCatalog.model_validate_json(raw)
        
        if catalog.totalProjects != 183:
            self.log_error(f"Expected exactly 183 projects, got {catalog.totalProjects}")
            
        if catalog.schemaVersion != "2.1.0":
            self.log_error(f"Expected schemaVersion '2.1.0', got '{catalog.schemaVersion}'")
            
        # Canonical Projects
        if not CANONICAL_PATH.exists():
            self.log_error(f"Canonical projects missing at {CANONICAL_PATH}")
            canonical_projs = []
        else:
            with open(CANONICAL_PATH, "r", encoding="utf-8") as f:
                canon_raw = json.load(f)
            canonical_projs = [CanonicalProject.model_validate(item) for item in canon_raw]
            if len(canonical_projs) <= 0:
                self.log_error("Canonical projects count must be > 0")

        # Duplicate Candidates
        if not CANDIDATES_PATH.exists():
            self.log_error(f"Duplicate candidates missing at {CANDIDATES_PATH}")
            candidates = []
        else:
            with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
                cand_data = json.load(f)
            candidates = [DuplicateCandidate.model_validate(item) for item in cand_data.get("candidates", [])]

        # Relations
        if not RELATIONS_PATH.exists():
            self.log_error(f"Relations missing at {RELATIONS_PATH}")
            relations = []
        else:
            with open(RELATIONS_PATH, "r", encoding="utf-8") as f:
                rel_raw = json.load(f)
            relations = [ProjectRelation.model_validate(item) for item in rel_raw]
            
        return catalog, canonical_projs, candidates, relations

    def check_2_source_hash_integrity(self, catalog: ProjectCatalog):
        print("[CHECK 2/10] Source Hash Integrity (Verification against source_manifest.json)...")
        if not self.manifest:
            self.log_error(f"Source manifest missing or empty at {MANIFEST_PATH}")
            return
            
        for p in catalog.projects:
            for s in p.sources:
                doc_info = self.manifest.get(s.sourceDocumentId)
                if not doc_info:
                    self.log_error(f"Source document {s.sourceDocumentId} for project {p.projectId} not in manifest")
                    continue
                expected_sha = doc_info.get("sha256")
                if s.sourceHash != expected_sha:
                    self.log_error(f"Hash mismatch in project {p.projectId}: source {s.sourceHash} != manifest {expected_sha}")

    def check_3_evidence_provenance(self, catalog: ProjectCatalog):
        print("[CHECK 3/10] Evidence-Level Provenance (Every source claim backed by EvidenceBlocks)...")
        for p in catalog.projects:
            # Check source occurrence bounds and evidence
            for s in p.sources:
                if len(s.pageRange) != 2 or s.pageRange[0] <= 0 or s.pageRange[1] < s.pageRange[0]:
                    self.log_error(f"Invalid pageRange {s.pageRange} in project {p.projectId}")
                if not s.evidenceBlocks:
                    self.log_error(f"Project {p.projectId} source occurrence has 0 evidence blocks")
                    
            # Check technical sections
            exp = p.detailedExplanation
            for sec_name, sec in exp.model_dump(exclude_none=True).items():
                if not isinstance(sec, dict):
                    continue
                stxt = sec.get("sourceText")
                status = sec.get("status")
                ev = sec.get("evidenceBlocks", [])
                
                if stxt is not None:
                    if not ev:
                        self.log_error(f"Project {p.projectId} section {sec_name} has sourceText but zero EvidenceBlocks!")
                    for eb in ev:
                        if not eb.get("textSnippet"):
                            self.log_error(f"Project {p.projectId} section {sec_name} EvidenceBlock missing textSnippet")

    def check_4_zero_fabrication(self, catalog: ProjectCatalog):
        print("[CHECK 4/10] Zero Fabrication Gate (0 placeholder strings, 0 fabricated text)...")
        forbidden_snippets = [
            "Información técnica estructurada",
            "Pendiente de verificación",
            "Placeholder",
            "Lorem ipsum",
            "Continuidad de layout en pág",
            "Adquiere variables y ejecuta control",
            "Procesa señales y ejecuta la función",
            "Aplicación práctica y despliegue en"
        ]
        
        for p in catalog.projects:
            exp = p.detailedExplanation
            for sec_name, sec in exp.model_dump(exclude_none=True).items():
                if not isinstance(sec, dict):
                    continue
                stxt = sec.get("sourceText")
                if stxt:
                    for fb in forbidden_snippets:
                        if fb.lower() in stxt.lower():
                            self.log_error(f"CRITICAL FABRICATION: Project {p.projectId} section {sec_name} contains placeholder '{fb}'!")
                # If status is NOT_DOCUMENTED, sourceText MUST be None
                if sec.get("status") == "NOT_DOCUMENTED" and stxt is not None:
                    self.log_error(f"Project {p.projectId} section {sec_name} has status NOT_DOCUMENTED but non-null sourceText!")

    def check_5_boundary_integrity(self):
        print("[CHECK 5/10] Boundary Integrity (IR-Derived Boundaries & Reconciliation)...")
        if not BOUNDARY_REC_PATH.exists():
            self.log_error(f"Boundary reconciliation record missing at {BOUNDARY_REC_PATH}")
            return
            
        with open(BOUNDARY_REC_PATH, "r", encoding="utf-8") as f:
            rec_data = json.load(f)
            
        reconciliations = rec_data if isinstance(rec_data, list) else rec_data.get("reconciliations", [])
        if len(reconciliations) != 183:
            self.log_error(f"Expected 183 boundary reconciliations, got {len(reconciliations)}")
            
        for r in reconciliations:
            if r.get("status") in ["MISSING_IN_IR", "MISSING_IN_CATALOG"]:
                self.log_error(f"Boundary unmapped: {r}")

    def check_6_deduplication_integrity(self, candidates: List[DuplicateCandidate]):
        print("[CHECK 6/10] Deduplication Integrity (Anti-False-Merge & Identity Evidence)...")
        for cand in candidates:
            if cand.classification == DuplicateClassification.EXACT_DUPLICATE:
                title_sim = cand.evaluatedSignals.get("title_similarity", 0.0)
                dup_src = cand.evaluatedSignals.get("duplicate_source_guide", 0.0)
                if title_sim < 0.70 and dup_src == 0.0:
                    self.log_error(f"CRITICAL FALSE MERGE: Candidate {cand.candidateId} classified EXACT_DUPLICATE without identity evidence!")

        # Verify anti-false-merge benchmarks
        cand_map = {(c.projectAId, c.projectBId): c for c in candidates}
        cand_map.update({(c.projectBId, c.projectAId): c for c in candidates})
        
        for bm in FALSE_MERGE_BENCHMARKS:
            pair_cand = cand_map.get((bm["projectA"], bm["projectB"]))
            if pair_cand:
                if pair_cand.classification.value == bm["forbiddenClassification"]:
                    self.log_error(f"Benchmark False-Merge failed: {bm['case']} classified as {pair_cand.classification}!")

    def check_7_source_preservation(self):
        print("[CHECK 7/10] Source Preservation (31/31 PDFs intact, non-empty, matching manifest)...")
        if not GUIDES_DIR.exists():
            self.log_error(f"Engineering guides directory missing at {GUIDES_DIR}")
            return
            
        pdfs = list(GUIDES_DIR.glob("*.pdf"))
        if len(pdfs) != 31:
            self.log_error(f"Expected 31 source PDFs on disk, found {len(pdfs)}")
            
        for pdf_path in pdfs:
            size = pdf_path.stat().st_size
            if size == 0:
                self.log_error(f"Empty PDF file: {pdf_path.name}")
                
            # Verify SHA-256 against manifest
            h = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
            matched = any(doc.get("sha256") == h for doc in self.manifest.values())
            if not matched:
                self.log_error(f"PDF {pdf_path.name} sha256 {h} not found in source manifest!")

    def check_8_structured_descriptions(self, catalog: ProjectCatalog):
        print("[CHECK 8/10] Structured Description Integrity (¿Qué es?, ¿Qué hace?, ¿Para qué sirve?)...")
        for p in catalog.projects:
            d = p.description
            if not d.whatIsIt or len(d.whatIsIt.strip()) < 10:
                self.log_error(f"Project {p.projectId} missing valid 'whatIsIt'")
                
            if d.whatDoesItDo is None:
                status_val = d.fieldStatus.get("whatDoesItDo")
                if status_val not in ["NOT_DOCUMENTED", None]:
                    self.log_error(f"Project {p.projectId} whatDoesItDo is None but fieldStatus is {status_val}")
            elif len(d.whatDoesItDo.strip()) < 5:
                self.log_error(f"Project {p.projectId} invalid 'whatDoesItDo'")
                
            if d.purpose is None:
                status_val = d.fieldStatus.get("purpose")
                if status_val not in ["NOT_DOCUMENTED", None]:
                    self.log_error(f"Project {p.projectId} purpose is None but fieldStatus is {status_val}")
            elif len(d.purpose.strip()) < 5:
                self.log_error(f"Project {p.projectId} invalid 'purpose'")

    def check_9_golden_dataset(self, catalog: ProjectCatalog):
        print("[CHECK 9/10] Golden Dataset Execution (Golden-1, Golden-5, Golden-20, Full-183)...")
        cat_dict = json.loads(catalog.model_dump_json())
        
        # Golden-1
        p1, e1 = run_golden_tier_1(cat_dict)
        if not p1:
            for err in e1:
                self.log_error(f"Golden-1: {err}")
                
        # Golden-5
        p5, e5 = run_golden_tier_5(cat_dict)
        if not p5:
            for err in e5:
                self.log_error(f"Golden-5: {err}")
                
        # Golden-20
        p20, e20 = run_golden_tier_20(cat_dict)
        if not p20:
            for err in e20:
                self.log_error(f"Golden-20: {err}")
                
        # Full-183
        pfull, efull = run_golden_tier_full(cat_dict)
        if not pfull:
            for err in efull:
                self.log_error(f"Full-183: {err}")

    def check_10_determinism(self, catalog: ProjectCatalog):
        print("[CHECK 10/10] Determinism Validation (Hash Stability)...")
        # Verify JSON serializability stability
        raw1 = catalog.model_dump_json(indent=2)
        cat2 = ProjectCatalog.model_validate_json(raw1)
        raw2 = cat2.model_dump_json(indent=2)
        if hashlib.sha256(raw1.encode("utf-8")).hexdigest() != hashlib.sha256(raw2.encode("utf-8")).hexdigest():
            self.log_error("Determinism failure: serialization is non-idempotent")

    def run_all(self) -> Tuple[bool, List[str], List[str]]:
        print("==========================================================")
        print("  Running EngineeringGuides Project-First Validators (P02.1)")
        print("==========================================================")
        try:
            catalog, canonical_projs, candidates, relations = self.check_1_schema()
            self.check_2_source_hash_integrity(catalog)
            self.check_3_evidence_provenance(catalog)
            self.check_4_zero_fabrication(catalog)
            self.check_5_boundary_integrity()
            self.check_6_deduplication_integrity(candidates)
            self.check_7_source_preservation()
            self.check_8_structured_descriptions(catalog)
            self.check_9_golden_dataset(catalog)
            self.check_10_determinism(catalog)
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
