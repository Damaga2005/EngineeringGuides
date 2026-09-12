import pytest
from pathlib import Path
from scripts.foundation.models import DocumentIR, SourceManifest

REPO_ROOT = Path(__file__).resolve().parents[2]
IR_DIR = REPO_ROOT / "docs" / "foundation" / "ir"
MANIFEST_PATH = REPO_ROOT / "docs" / "foundation" / "source_manifest.json"

def test_ir_all_documents_present_and_valid():
    manifest = SourceManifest.model_validate_json(MANIFEST_PATH.read_text(encoding="utf-8"))
    for doc in manifest.documents:
        ir_file = IR_DIR / f"{doc.sourceId}.json"
        assert ir_file.exists(), f"IR file for {doc.sourceId} must exist"
        ir = DocumentIR.model_validate_json(ir_file.read_text(encoding="utf-8"))
        assert ir.sourceId == doc.sourceId
        assert ir.pageCount == doc.pageCount
        assert len(ir.pages) == doc.pageCount
        assert ir.provenance.source == doc.sourceId
        assert ir.provenance.sourceHash == doc.sha256

def test_ir_page_dimensions_valid():
    sample_ir_path = IR_DIR / "guide-001.json"
    ir = DocumentIR.model_validate_json(sample_ir_path.read_text(encoding="utf-8"))
    for page in ir.pages:
        assert page.width > 0
        assert page.height > 0
        assert len(page.blocks) >= 0


def test_ir_zapfdingbats_icons_decoded_not_raw_ascii():
    """
    Regression guard: guide-024's per-project difficulty meter is drawn with
    an embedded ZapfDingbats-named font PyMuPDF has no ToUnicode map for, so
    plain extraction returns raw byte codes as if they were ASCII (e.g. a
    meter of four filled stars and one filled square came back as the
    literal string "####I"). Rendering the exact PDF region to an image
    confirmed the true glyphs (see scripts/foundation/ir_extractor.py's
    _ZAPFDINGBATS_GLYPH_MAP). The extracted IR text must show the real
    glyphs, never the raw "#"/"I" artifact.
    """
    ir = DocumentIR.model_validate_json((IR_DIR / "guide-024.json").read_text(encoding="utf-8"))
    difficulty_lines = [
        b.text for page in ir.pages for b in page.blocks if b.text.startswith("Difficulty:")
    ]
    assert len(difficulty_lines) >= 6, "Expected a Difficulty line per project in guide-024"
    for line in difficulty_lines:
        assert "★" in line or "■" in line, f"Expected decoded star/square glyphs in: {line!r}"
        assert "#" not in line, f"Raw ZapfDingbats artifact '#' leaked into: {line!r}"
