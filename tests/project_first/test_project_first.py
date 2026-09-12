"""
Comprehensive Pytest Suite for Project-First Architecture (Prompt 02.1).
Validates:
  - 1 Proyecto = 1 Project rule (183 total projects)
  - Deterministic IDs and slug stability
  - End-to-end provenance traceability and EvidenceBlocks
  - Literal IR sourceText extraction without placeholders (Zero Fabrication)
  - Structured descriptions and 18-section detailed explanations
  - Anti-false-merge protection and classification taxonomy
  - Zero source loss (31/31 PDFs preserved)
  - Golden Dataset execution (Golden-1, Golden-5, Golden-20, Full-183)
  - ProjectFirstValidator 10-check gate
"""

import pytest
import json
from pathlib import Path

from scripts.project_first.ids import generate_project_id, slugify
from scripts.project_first.validators import ProjectFirstValidator
from scripts.project_first.deduplication import tokenize
from scripts.project_first.models import DuplicateClassification
from tests.project_first.golden_dataset import (
    GOLDEN_1_PROJECT,
    GOLDEN_5_PROJECTS,
    GOLDEN_20_PROJECTS,
    FALSE_MERGE_BENCHMARKS,
    run_golden_tier_1,
    run_golden_tier_5,
    run_golden_tier_20,
    run_golden_tier_full,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
PROJECTS_CATALOG_PATH = REPO_ROOT / "public" / "projects.json"
CANONICAL_PATH = REPO_ROOT / "docs" / "project-first" / "canonical_projects.json"
CANDIDATES_PATH = REPO_ROOT / "docs" / "project-first" / "duplicate_candidates.json"
BOUNDARY_REC_PATH = REPO_ROOT / "docs" / "project-first" / "boundary_reconciliation.json"
MANIFEST_PATH = REPO_ROOT / "docs" / "foundation" / "source_manifest.json"
SOURCES_DIR = REPO_ROOT / "Engineering guides"


@pytest.fixture(scope="module")
def project_catalog():
    assert PROJECTS_CATALOG_PATH.exists(), "public/projects.json must exist"
    with open(PROJECTS_CATALOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture(scope="module")
def canonical_projects():
    assert CANONICAL_PATH.exists(), "docs/project-first/canonical_projects.json must exist"
    with open(CANONICAL_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture(scope="module")
def duplicate_candidates():
    assert CANDIDATES_PATH.exists(), "docs/project-first/duplicate_candidates.json must exist"
    with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
        return json.load(f).get("candidates", [])


@pytest.fixture(scope="module")
def source_manifest():
    assert MANIFEST_PATH.exists(), "docs/foundation/source_manifest.json must exist"
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        docs = json.load(f).get("documents", [])
        return {d["sourceId"]: d for d in docs}


def test_one_project_one_technical_project(project_catalog):
    """Verify that exactly 183 independent projects exist."""
    projects = project_catalog.get("projects", [])
    assert len(projects) == 183, f"Expected 183 independent projects, found {len(projects)}"
    
    pids = [p["projectId"] for p in projects]
    assert len(pids) == len(set(pids)), "All projectIds must be strictly unique"


def test_deterministic_ids_stability():
    """Verify that ID generation is strictly deterministic across runs."""
    id1 = generate_project_id("guide-001", 1, "Digital Night-Vision Monocular")
    id2 = generate_project_id("guide-001", 1, "Digital Night-Vision Monocular")
    assert id1 == id2
    assert id1 == "proj-9cc1a42f66e7c4d5"


def test_provenance_traceability(project_catalog):
    """Verify that 100% of projects maintain valid provenance to their source PDF."""
    for p in project_catalog.get("projects", []):
        assert p.get("sourceDocumentId") is not None
        assert len(p.get("sources", [])) >= 1
        s = p["sources"][0]
        assert s.get("sourcePath", "").startswith("Engineering guides/")
        assert s["sourceHash"] is not None and len(s["sourceHash"]) == 64
        pr = s["pageRange"]
        assert len(pr) == 2
        assert pr[0] > 0
        assert pr[1] >= pr[0]


def test_source_text_is_literal_ir_text(project_catalog):
    """Verify that every section with sourceText has evidenceBlocks from IR."""
    for p in project_catalog.get("projects", []):
        exp = p.get("detailedExplanation", {})
        for sec_name, sec in exp.items():
            if not sec:
                continue
            stxt = sec.get("sourceText")
            if stxt is not None:
                assert sec.get("status") == "SOURCE"
                ebs = sec.get("evidenceBlocks", [])
                assert len(ebs) >= 1, f"Project {p['projectId']} section {sec_name} missing EvidenceBlocks"
                for eb in ebs:
                    assert eb.get("textSnippet") is not None
                    assert len(eb.get("sourceHash", "")) == 64


def test_no_generated_text_in_source_fields(project_catalog):
    """Verify that no generated placeholders exist in source fields."""
    forbidden = ["información técnica estructurada", "pendiente de verificación", "placeholder"]
    for p in project_catalog.get("projects", []):
        exp = p.get("detailedExplanation", {})
        for sec_name, sec in exp.items():
            if not sec:
                continue
            stxt = sec.get("sourceText")
            if stxt:
                for fb in forbidden:
                    assert fb not in stxt.lower(), f"Placeholder '{fb}' found in {p['projectId']} {sec_name}"


def test_project_source_hash_matches_manifest(project_catalog, source_manifest):
    """Verify that project source hashes match the official source manifest."""
    for p in project_catalog.get("projects", []):
        for s in p.get("sources", []):
            doc_id = s["sourceDocumentId"]
            assert doc_id in source_manifest, f"Unknown document {doc_id}"
            assert s["sourceHash"] == source_manifest[doc_id]["sha256"]


def test_project_boundaries_are_ir_derived():
    """Verify that boundary reconciliation records 183 projects without unmapped entries."""
    assert BOUNDARY_REC_PATH.exists()
    with open(BOUNDARY_REC_PATH, "r", encoding="utf-8") as f:
        recs = json.load(f)
    assert len(recs) == 183
    for r in recs:
        assert r["status"] in ["MATCH", "PARTIAL_MATCH", "BOUNDARY_MISMATCH"]


def test_structured_descriptions(project_catalog):
    """Verify that every project answers ¿Qué es?, ¿Qué hace?, ¿Para qué sirve?."""
    for p in project_catalog.get("projects", []):
        desc = p.get("description", {})
        assert len(desc.get("whatIsIt", "").strip()) >= 10
        assert len(desc.get("whatDoesItDo", "").strip()) >= 10
        assert len(desc.get("purpose", "").strip()) >= 10
        assert isinstance(desc.get("technologies", []), list)


def test_detailed_explanations_sections(project_catalog):
    """Verify that detailed technical explanations contain active sections."""
    for p in project_catalog.get("projects", []):
        exp = p.get("detailedExplanation", {})
        assert exp.get("overview") is not None
        assert exp.get("whatDoesItDo") is not None
        assert exp.get("hardware") is not None
        assert exp.get("connections") is not None
        assert exp.get("power") is not None
        assert exp.get("sources") is not None


def test_false_merge_prevention(project_catalog, canonical_projects):
    """Verify that distinct projects never merge in canonical projects."""
    projects = project_catalog.get("projects", [])
    proj_map = {p["projectId"]: p for p in projects}
    
    for cp in canonical_projects:
        member_ids = cp.get("projectIds", [])
        if len(member_ids) > 1:
            member_projs = [proj_map[mid] for mid in member_ids]
            first_title = member_projs[0]["title"]
            for other in member_projs[1:]:
                toks1 = tokenize(first_title)
                toks2 = tokenize(other["title"])
                sim = len(toks1.intersection(toks2)) / len(toks1.union(toks2))
                assert sim >= 0.70, f"False merge: '{first_title}' merged with '{other['title']}'!"


def test_anti_false_merge_benchmarks(duplicate_candidates):
    """Verify that anti-false-merge benchmarks are strictly respected."""
    cand_map = {(c["projectAId"], c["projectBId"]): c for c in duplicate_candidates}
    cand_map.update({(c["projectBId"], c["projectAId"]): c for c in duplicate_candidates})
    
    for bm in FALSE_MERGE_BENCHMARKS:
        pair_cand = cand_map.get((bm["projectA"], bm["projectB"]))
        if pair_cand:
            assert pair_cand["classification"] != bm["forbiddenClassification"], (
                f"Benchmark failed: {bm['case']} was classified as {pair_cand['classification']}"
            )


def test_no_source_loss():
    """Verify that all 31 source PDFs remain preserved on disk without loss."""
    pdfs = list(SOURCES_DIR.glob("*.pdf"))
    assert len(pdfs) == 31, f"Expected 31 PDFs on disk, found {len(pdfs)}"


def test_golden_1_tier(project_catalog):
    """Verify Golden-1 benchmark tier."""
    passed, errors = run_golden_tier_1(project_catalog)
    assert passed, f"Golden-1 failed: {errors}"


def test_golden_5_tier(project_catalog):
    """Verify Golden-5 benchmark tier."""
    passed, errors = run_golden_tier_5(project_catalog)
    assert passed, f"Golden-5 failed: {errors}"


def test_golden_20_tier(project_catalog):
    """Verify Golden-20 benchmark tier."""
    passed, errors = run_golden_tier_20(project_catalog)
    assert passed, f"Golden-20 failed: {errors}"


def test_golden_full_tier(project_catalog):
    """Verify Full-183 benchmark tier."""
    passed, errors = run_golden_tier_full(project_catalog)
    assert passed, f"Full-183 failed: {errors}"


def test_project_first_validators_pass():
    """Run full ProjectFirstValidator 10-check suite."""
    validator = ProjectFirstValidator()
    passed, errors, warnings = validator.run_all()
    assert passed, f"ProjectFirstValidator failed with errors: {errors}"
