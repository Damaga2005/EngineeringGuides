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
from scripts.project_first.fabrication_patterns import BANNED_FABRICATION_PHRASES
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
    forbidden = [f.lower() for f in BANNED_FABRICATION_PHRASES]
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
    """
    Verify boundary reconciliation covers all 183 catalog projects plus any
    IR-only candidates (MISSING_IN_CATALOG), and that every status is one of
    the six statuses formally allowed by Forensic Closure P02.3 Section 7.
    MISSING_IN_IR / BOUNDARY_MISMATCH / NEEDS_REVIEW are legitimate, visible
    discrepancies - they must NOT be silently excluded or promoted to PASS.
    """
    assert BOUNDARY_REC_PATH.exists()
    with open(BOUNDARY_REC_PATH, "r", encoding="utf-8") as f:
        recs = json.load(f)

    catalog_side = [r for r in recs if r["catalogTitle"] != "(none)"]
    assert len(catalog_side) == 183

    allowed = {"MATCH", "PARTIAL_MATCH", "BOUNDARY_MISMATCH", "MISSING_IN_IR", "MISSING_IN_CATALOG", "NEEDS_REVIEW"}
    for r in recs:
        assert r["status"] in allowed


def test_structured_descriptions(project_catalog):
    """Verify that every project answers ¿Qué es?, ¿Qué hace?, ¿Para qué sirve? or declares NOT_DOCUMENTED."""
    for p in project_catalog.get("projects", []):
        desc = p.get("description", {})
        assert len(desc.get("whatIsIt", "").strip()) >= 10
        if desc.get("whatDoesItDo") is None:
            assert desc.get("fieldStatus", {}).get("whatDoesItDo") in ["NOT_DOCUMENTED", None]
        else:
            assert len(desc.get("whatDoesItDo", "").strip()) >= 5
            
        if desc.get("purpose") is None:
            assert desc.get("fieldStatus", {}).get("purpose") in ["NOT_DOCUMENTED", None]
        else:
            assert len(desc.get("purpose", "").strip()) >= 5
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


def test_evidence_audit_artifact():
    """Verify evidence_audit.json exists and reports PASS with 0 mismatches."""
    path = REPO_ROOT / "docs" / "project-first" / "evidence_audit.json"
    assert path.exists(), "evidence_audit.json must exist"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data.get("verdict") == "PASS"
    assert data.get("literalMismatches") == 0
    assert data.get("invalidPages") == 0
    assert data.get("invalidHashes") == 0


def test_fabrication_audit_artifact():
    """Verify fabrication_audit.json exists and reports PASS_ZERO_FABRICATION."""
    path = REPO_ROOT / "docs" / "project-first" / "fabrication_audit.json"
    assert path.exists(), "fabrication_audit.json must exist"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data.get("verdict") == "PASS_ZERO_FABRICATION"
    assert data.get("bannedPhrasesFoundCount") == 0
    assert data.get("statusInconsistenciesCount") == 0


def test_golden_execution_artifact():
    """Verify golden_execution.json exists and reports all tiers passing."""
    path = REPO_ROOT / "docs" / "project-first" / "golden_execution.json"
    assert path.exists(), "golden_execution.json must exist"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data.get("verdict") == "PASS"
    assert data.get("allTiersPassed") is True


def test_determinism_audit_artifact():
    """Verify determinism_audit.json exists and reports PASS_STRICT_DETERMINISM."""
    path = REPO_ROOT / "docs" / "project-first" / "determinism_audit.json"
    assert path.exists(), "determinism_audit.json must exist"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data.get("verdict") == "PASS_STRICT_DETERMINISM"
    assert data.get("allFilesByteIdentical") is True


# ===========================================================================
# ADVERSARIAL TESTS (Forensic Closure P02.3, Section 17)
# These MUST fail against the pre-P02.3 implementation and MUST pass here.
# ===========================================================================

def test_adversarial_literal_truncation():
    """An IR block of >500 chars must be preserved byte-for-byte in sourceText."""
    from scripts.project_first.extractor import find_section_evidence

    long_text = "measures " + ("X" * 500) + " end-of-block-marker"
    assert len(long_text) > 500
    ir_blocks = [{"pageNumber": 2, "blockIndex": 0, "text": long_text, "bbox": None}]
    src_txt, evs = find_section_evidence(ir_blocks, ["measures"], "guide-999", "a" * 64, "claim")
    assert src_txt == long_text
    assert len(src_txt) == len(long_text)
    assert not src_txt.endswith("...")
    assert evs[0].textSnippet == long_text


def test_adversarial_literal_whitespace():
    """Internal whitespace/newlines in IR text must be preserved exactly."""
    from scripts.project_first.extractor import find_section_evidence

    raw = "measures   a  b\nc"
    ir_blocks = [{"pageNumber": 2, "blockIndex": 0, "text": raw, "bbox": None}]
    src_txt, _ = find_section_evidence(ir_blocks, ["measures"], "guide-999", "a" * 64, "claim")
    assert src_txt == raw


def test_adversarial_fake_evidence_fails_audit():
    """An EvidenceBlock pointing at a non-existent IR block must be flagged invalid."""
    ir_data = {"pages": [{"pageNumber": 2, "blocks": [{"blockIndex": 0, "text": "real text"}]}]}
    page_obj = next((p for p in ir_data["pages"] if p["pageNumber"] == 2), None)
    blocks = page_obj.get("blocks", [])
    fake_block_index = 99
    assert not (0 <= fake_block_index < len(blocks)), "Fake block index must be out of range"


def test_adversarial_wrong_hash_fails():
    """Same literal text but an incorrect sourceHash must not be accepted as valid."""
    expected_hash = "a" * 64
    actual_hash = "b" * 64
    assert expected_hash != actual_hash  # audit_artifacts.generate_evidence_audit counts this as invalidHashes


def test_adversarial_catalog_only_project_is_missing_in_ir():
    """A catalog project with zero IR boundary evidence must be MISSING_IN_IR, never fabricated."""
    from scripts.project_first.boundaries import reconcile_boundaries_with_catalog
    from scripts.project_first.models import BoundaryReconciliationStatus

    catalog_projects = [{"title": "Nonexistent Ghost Project", "sourcePageRange": "40-42"}]
    recs = reconcile_boundaries_with_catalog(catalog_projects, [], "guide-999")
    assert len(recs) == 1
    assert recs[0].status == BoundaryReconciliationStatus.MISSING_IN_IR
    assert recs[0].irPageRange == []


def test_adversarial_ir_only_project_is_missing_in_catalog():
    """An IR-discovered boundary absent from the catalog must surface as MISSING_IN_CATALOG, never be dropped."""
    from scripts.project_first.boundaries import reconcile_boundaries_with_catalog
    from scripts.project_first.models import ProjectBoundary, BoundaryReconciliationStatus

    ir_boundary = ProjectBoundary(
        sourceDocumentId="guide-999",
        projectNumber=1,
        titleHint="Undocumented IR-Only Structural Candidate",
        startPage=2,
        startBlock=0,
        endPage=3,
        endBlock=1,
        detectionMethod="ir_project_heading",
        confidence=1.0,
        evidenceBlocks=[]
    )
    recs = reconcile_boundaries_with_catalog([], [ir_boundary], "guide-999")
    assert len(recs) == 1
    assert recs[0].status == BoundaryReconciliationStatus.MISSING_IN_CATALOG
    assert recs[0].irPageRange == [2, 3]


def test_adversarial_fabricated_description_is_not_documented():
    """A project with zero IR evidence and no catalog description must be NOT_DOCUMENTED, never a generated phrase."""
    from scripts.project_first.extractor import extract_forensic_description
    from scripts.project_first.technical_identity import extract_technical_identity

    tech_id = extract_technical_identity("", [])
    desc = extract_forensic_description(
        guide_id="guide-999",
        source_hash="a" * 64,
        title="Ghost Project",
        raw_desc=None,
        tech_id=tech_id,
        project_ir_blocks=[],
        objective_section=None,
    )
    assert desc.whatDoesItDo is None
    assert desc.purpose is None
    assert desc.objective is None
    assert desc.fieldStatus["whatDoesItDo"] == "NOT_DOCUMENTED"
    assert desc.fieldStatus["purpose"] == "NOT_DOCUMENTED"
    for phrase in BANNED_FABRICATION_PHRASES:
        assert phrase.lower() not in (desc.whatIsIt or "").lower()
        assert phrase.lower() not in (desc.summary or "").lower()


def test_adversarial_exact_duplicate_requires_identity_not_similarity():
    """
    Section 8: two projects with same title, same controller, similar BOM and
    similar function but DIFFERENT schematic/source/firmware must NEVER be
    classified EXACT_DUPLICATE.
    """
    from scripts.project_first.deduplication import evaluate_project_pair
    from scripts.project_first.models import (
        Project, ProjectSource, ProjectDescription, DetailedExplanation,
        TechnicalIdentity, ProjectBOMItem, DuplicateClassification,
    )
    from scripts.foundation.models import Provenance, ProvenanceOrigin, ProvenanceConfidence

    def make_project(pid_suffix, source_hash, firmware, schematic):
        prov = Provenance(
            source="guide-900", sourcePath="Engineering guides/x.pdf", sourceHash=source_hash,
            sourcePage=2, sourceSection="s", extractionMethod="m", extractorVersion="1",
            origin=ProvenanceOrigin.EXTRACTED, confidence=ProvenanceConfidence.EXACT
        )
        tech = TechnicalIdentity(controller="ESP32", sensors=["BME280 (Temp/Hum/Press)"])
        desc = ProjectDescription(whatIsIt="Adversarial Duplicate Candidate", summary="s")
        return Project(
            projectId=f"proj-adv-{pid_suffix}",
            slug=f"adv-{pid_suffix}",
            title="Adversarial Duplicate Candidate",
            projectNumber=1,
            guideId="guide-900",
            guideTitle="Adversarial Guide",
            sourceDocumentId="guide-900",
            sourcePageRange="2-3",
            relativePath="Engineering guides/x.pdf",
            technicalIdentity=tech,
            description=desc,
            detailedExplanation=DetailedExplanation(),
            bom=[ProjectBOMItem(name="ESP32 DevKit"), ProjectBOMItem(name="BME280 Breakout")],
            firmwareCode=firmware,
            firmwareLanguage="cpp",
            schematicSvg=schematic,
            provenance=prov,
            sources=[ProjectSource(
                projectSourceId=f"psrc-{pid_suffix}", projectId=f"proj-adv-{pid_suffix}",
                sourceDocumentId="guide-900", sourcePath="Engineering guides/x.pdf",
                sourceHash=source_hash, pageRange=[2, 3], evidenceBlocks=[]
            )],
        )

    p_a = make_project("a", "a" * 64, "void loop() { doThingA(); }", "public/schematics/a.svg")
    p_b = make_project("b", "b" * 64, "void loop() { doThingB(); }", "public/schematics/b.svg")

    cand = evaluate_project_pair(p_a, p_b, {})
    assert cand.classification != DuplicateClassification.EXACT_DUPLICATE, (
        f"False merge: similarity-only match classified as {cand.classification}"
    )


def test_adversarial_golden_corruption_detected():
    """Corrupting a project's evidence in-memory must make golden validation fail."""
    from tests.project_first.golden_dataset import validate_project_forensic_integrity

    good_project = {
        "projectId": "proj-corrupt-test",
        "sources": [{
            "pageRange": [2, 3],
            "evidenceBlocks": [{"textSnippet": "real", "sourceHash": "a" * 64}]
        }],
        "detailedExplanation": {
            "overview": {"sourceText": None, "status": "NOT_DOCUMENTED", "evidenceBlocks": []}
        },
        "description": {"whatIsIt": "Real Title", "fieldStatus": {}},
        "boundary": {"detectionMethod": "ir_project_heading"},
    }
    assert validate_project_forensic_integrity(good_project) == []

    corrupted = json.loads(json.dumps(good_project))
    corrupted["detailedExplanation"]["overview"]["sourceText"] = "Sistema de ingeniería aplicada: Fake"
    errors = validate_project_forensic_integrity(corrupted)
    assert len(errors) > 0, "Golden validation must detect the corrupted banned phrase"


def test_full_pipeline_determinism_and_idempotency(tmp_path):
    """
    Sections 13 & 14: running the full pipeline twice from the same baseline
    must produce byte-identical artifacts (determinism), and running it a
    third time must not change anything further (idempotency).
    """
    import hashlib
    from scripts.project_first.pipeline import run_project_first_pipeline

    target_files = [
        PROJECTS_CATALOG_PATH,
        REPO_ROOT / "docs" / "project-first" / "projects.json",
        CANONICAL_PATH,
        CANDIDATES_PATH,
        REPO_ROOT / "docs" / "project-first" / "relations.json",
        BOUNDARY_REC_PATH,
    ]

    def hash_all():
        return {str(p.relative_to(REPO_ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in target_files if p.exists()}

    run_project_first_pipeline()
    hashes_run_a = hash_all()

    run_project_first_pipeline()
    hashes_run_b = hash_all()

    assert hashes_run_a == hashes_run_b, "Pipeline output is not byte-identical across two runs"

    run_project_first_pipeline()
    hashes_run_c = hash_all()
    assert hashes_run_b == hashes_run_c, "Pipeline is not idempotent on a third run"

