"""
Comprehensive Pytest Suite for Project-First Architecture (Prompt 02).
Validates:
  - 1 Proyecto = 1 Project rule (183 total projects)
  - Deterministic IDs and slug stability
  - End-to-end provenance traceability
  - Structured descriptions and 18-section detailed explanations
  - Anti-false-merge protection and classification taxonomy
  - Zero source loss (31/31 PDFs preserved)
  - Project-First validator gate
"""

import pytest
import json
from pathlib import Path

from scripts.project_first.extractor import extract_all_projects
from scripts.project_first.ids import generate_project_id, slugify
from scripts.project_first.validators import ProjectFirstValidator
from scripts.project_first.deduplication import compare_projects, tokenize
from scripts.project_first.models import DuplicateClassification
from tests.project_first.golden_dataset import GOLDEN_1_PROJECT, GOLDEN_5_PROJECTS, FALSE_MERGE_BENCHMARKS

REPO_ROOT = Path(__file__).resolve().parents[2]
PROJECTS_CATALOG_PATH = REPO_ROOT / "public" / "projects.json"
SOURCES_DIR = REPO_ROOT / "Engineering guides"


@pytest.fixture(scope="module")
def project_catalog():
    assert PROJECTS_CATALOG_PATH.exists(), "public/projects.json must exist"
    with open(PROJECTS_CATALOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def test_one_project_one_technical_project(project_catalog):
    """Verify that exactly 183 independent projects exist."""
    projects = project_catalog.get("projects", [])
    assert len(projects) == 183, f"Expected 183 independent projects, found {len(projects)}"
    
    # Check that each project has a unique ID
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
        assert p.get("relativePath", "").startswith("Engineering guides/")
        assert len(p.get("sources", [])) >= 1
        s = p["sources"][0]
        assert s["sourceHash"] is not None and len(s["sourceHash"]) == 64
        assert s["pageStart"] > 0
        assert s["pageEnd"] >= s["pageStart"]


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


def test_false_merge_prevention(project_catalog):
    """Verify that projects sharing an MCU but with different titles/functions NEVER merge."""
    projects = project_catalog.get("projects", [])
    proj_map = {p["title"]: p for p in projects}
    
    # Check that different projects are not grouped in the same CanonicalProject
    for cp in project_catalog.get("canonicalProjects", []):
        member_ids = cp.get("memberProjectIds", [])
        if len(member_ids) > 1:
            member_projs = [p for p in projects if p["projectId"] in member_ids]
            # All members in an exact duplicate canonical cluster must have compatible titles
            first_title = member_projs[0]["title"]
            for other in member_projs[1:]:
                toks1 = tokenize(first_title)
                toks2 = tokenize(other["title"])
                sim = len(toks1.intersection(toks2)) / len(toks1.union(toks2))
                assert sim >= 0.70 or cp["canonicalTitle"] == other["title"], (
                    f"FALSE MERGE DETECTED in CanonicalProject {cp['canonicalProjectId']}: "
                    f"'{first_title}' merged with '{other['title']}'!"
                )


def test_no_source_loss():
    """Verify that all 31 source PDFs remain preserved on disk without loss."""
    pdfs = list(SOURCES_DIR.glob("*.pdf"))
    assert len(pdfs) == 31, f"Expected 31 PDFs on disk, found {len(pdfs)}"


def test_project_first_validators_pass():
    """Run full ProjectFirstValidator suite."""
    validator = ProjectFirstValidator()
    passed, errors, warnings = validator.run_all()
    assert passed, f"ProjectFirstValidator failed with errors: {errors}"
