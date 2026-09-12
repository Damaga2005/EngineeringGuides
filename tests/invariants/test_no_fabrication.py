import json
import pytest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = REPO_ROOT / "public" / "guides.json"

def test_no_unverified_prices_marked_verified():
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    for guide in catalog.get("guides", []):
        for bom in guide.get("bom", []):
            if isinstance(bom, dict):
                if bom.get("priceStatus") == "VERIFIED":
                    assert bom.get("supplier"), f"VERIFIED price must have supplier attribution in {guide['id']}"
