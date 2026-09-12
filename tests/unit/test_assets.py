import xml.etree.ElementTree as ET
import pytest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCHEMATICS_DIR = REPO_ROOT / "public" / "schematics"
COVERS_DIR = REPO_ROOT / "public" / "covers"

def test_schematics_valid_xml():
    svg_files = list(SCHEMATICS_DIR.glob("*.svg"))
    assert len(svg_files) >= 184, f"Expected at least 184 SVGs, found {len(svg_files)}"
    for svg_path in svg_files:
        tree = ET.parse(svg_path)
        root = tree.getroot()
        assert root.tag.endswith("svg"), f"Root must be <svg> in {svg_path.name}"

def test_schematics_security_clean():
    svg_files = list(SCHEMATICS_DIR.glob("*.svg"))
    for svg_path in svg_files:
        content = svg_path.read_text(encoding="utf-8").lower()
        assert "<script" not in content, f"Active script found in {svg_path.name}"
        assert "javascript:" not in content, f"Active JS URI found in {svg_path.name}"
        assert "onload=" not in content, f"Event handler found in {svg_path.name}"

def test_covers_exist():
    covers = list(COVERS_DIR.glob("*.png"))
    assert len(covers) >= 31, f"Expected at least 31 covers, found {len(covers)}"
