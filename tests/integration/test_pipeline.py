import json
import pytest
from pathlib import Path
from scripts.foundation.pipeline import run_foundation_pipeline

REPO_ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = REPO_ROOT / "public" / "guides.json"

def test_run_pipeline_end_to_end():
    catalog = run_foundation_pipeline()
    assert catalog["schemaVersion"] == "1.0.0"
    assert catalog["totalGuides"] == 31
    assert len(catalog["guides"]) == 31
    assert CATALOG_PATH.exists()
