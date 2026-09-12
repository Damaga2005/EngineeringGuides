import json
import hashlib
import pytest
from pathlib import Path
from scripts.foundation.pipeline import run_foundation_pipeline

def test_determinism_byte_for_byte():
    run1 = run_foundation_pipeline()
    json1 = json.dumps(run1, indent=2, sort_keys=True, ensure_ascii=False)
    h1 = hashlib.sha256(json1.encode("utf-8")).hexdigest()

    run2 = run_foundation_pipeline()
    json2 = json.dumps(run2, indent=2, sort_keys=True, ensure_ascii=False)
    h2 = hashlib.sha256(json2.encode("utf-8")).hexdigest()

    assert h1 == h2, "Pipeline must be strictly deterministic across consecutive runs"
    assert json1 == json2, "Output JSON strings must be identical byte-for-byte"
