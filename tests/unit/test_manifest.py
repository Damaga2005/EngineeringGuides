import json
import pytest
from pathlib import Path
from scripts.foundation.models import SourceManifest, DocumentStatus
from scripts.foundation.manifest import build_source_manifest

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = REPO_ROOT / "docs" / "foundation" / "source_manifest.json"

def test_manifest_file_exists_and_valid():
    assert MANIFEST_PATH.exists(), "source_manifest.json must exist"
    manifest = SourceManifest.model_validate_json(MANIFEST_PATH.read_text(encoding="utf-8"))
    assert manifest.documentCount == 31
    assert manifest.uniqueHashCount == 30
    assert len(manifest.documents) == 31

def test_manifest_id_stability():
    manifest = SourceManifest.model_validate_json(MANIFEST_PATH.read_text(encoding="utf-8"))
    ids = [d.sourceId for d in manifest.documents]
    expected_ids = [f"guide-{i:03d}" for i in range(1, 32)]
    assert ids == expected_ids, "Manifest sourceIds must be sequentially ordered guide-001 to guide-031"

def test_duplicate_pdf_preserved_and_mapped():
    manifest = SourceManifest.model_validate_json(MANIFEST_PATH.read_text(encoding="utf-8"))
    duplicates = [d for d in manifest.documents if d.isDuplicate]
    assert len(duplicates) == 1, "Must detect exactly 1 duplicate source"
    dup = duplicates[0]
    assert dup.fileName == "6_Upgrades_Your_Drone_Is_Missing.pdf"
    assert dup.duplicateOf == "guide-002"
    target = next(d for d in manifest.documents if d.sourceId == dup.duplicateOf)
    assert target.sha256 == dup.sha256
