import pytest
from pathlib import Path
from scripts.foundation.manifest import build_source_manifest

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCES_DIR = REPO_ROOT / "Engineering guides"

def test_idempotency_no_source_mutation():
    hashes_before = {}
    for p in SOURCES_DIR.glob("*.pdf"):
        hashes_before[p.name] = p.stat().st_mtime_ns

    m1 = build_source_manifest()
    m2 = build_source_manifest()

    for p in SOURCES_DIR.glob("*.pdf"):
        assert p.stat().st_mtime_ns == hashes_before[p.name], f"Source file {p.name} was modified by pipeline"

    assert m1.documentCount == m2.documentCount == 31
    assert [d.sourceId for d in m1.documents] == [d.sourceId for d in m2.documents]
