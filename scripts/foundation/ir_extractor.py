"""
High-Fidelity Document Intermediate Representation (IR) Extractor.
Complies with Prompt 01 Sections 13, 14, and 15.
Preserves block ordering, coordinates, headings, and provenance.
"""

import os
import json
import re
from pathlib import Path
from typing import List, Dict, Any
import fitz  # PyMuPDF

from scripts.foundation.models import (
    DocumentIR,
    PageIR,
    TextBlock,
    Provenance,
    ProvenanceOrigin,
    ProvenanceConfidence
)

REPO_ROOT = Path(__file__).resolve().parents[2]
IR_DIR = REPO_ROOT / "docs" / "foundation" / "ir"

# A handful of source PDFs draw small rating/checklist icons (a difficulty
# meter, a checklist) using an embedded ZapfDingbats-named font with a
# custom /Differences encoding. PyMuPDF has no ToUnicode map for it and
# falls back to the raw byte codes, so "get_text" returns them as if they
# were literal ASCII - e.g. a difficulty meter meant to show four filled
# stars and a filled square comes back as the string "####I". This is not
# real text ever printed in the document; rendering the exact PDF region
# to an image confirmed each glyph below (scripts/foundation - see the
# guide-024 Difficulty line, guide-022 checklist bullets). Mapping the
# confirmed codepoints back to the glyph actually drawn is a literal-text
# correction, not fabrication: the ASCII PyMuPDF returns was never in the
# source at all.
_ZAPFDINGBATS_GLYPH_MAP = {
    0x14: "✔",  # ✔ HEAVY CHECK MARK
    0x23: "★",  # ★ BLACK STAR
    0x49: "■",  # ■ BLACK SQUARE
}
_ZAPFDINGBATS_TRANSLATE = str.maketrans(_ZAPFDINGBATS_GLYPH_MAP)


def _fix_dingbat_spans(block_text: str, block_bbox, dingbat_spans) -> str:
    """
    Replace any ZapfDingbats-font glyph run inside this block with its
    true glyph (see _ZAPFDINGBATS_GLYPH_MAP), using each span's own bbox
    to scope the fix to spans physically inside this block and processing
    them in left-to-right reading order so an ordinary word ("I") in a
    different, non-dingbat span elsewhere in the same block is never
    touched.
    """
    if not dingbat_spans:
        return block_text
    text = block_text
    cursor = 0
    bx0, by0, bx1, by1 = block_bbox
    for span_text, (sx0, sy0, sx1, sy1) in dingbat_spans:
        if not (sx0 >= bx0 - 1 and sx1 <= bx1 + 1 and sy0 >= by0 - 1 and sy1 <= by1 + 1):
            continue
        idx = text.find(span_text, cursor)
        if idx == -1:
            continue
        mapped = span_text.translate(_ZAPFDINGBATS_TRANSLATE)
        text = text[:idx] + mapped + text[idx + len(span_text):]
        cursor = idx + len(mapped)
    return text

def classify_block_type(text: str) -> str:
    """Classify text block by structure and content."""
    t = text.strip()
    if not t:
        return "empty"
    if re.match(r"^(PROJECT\s+\d+|PART\s+\d+|BUILD\s+\d+|NODE\s+\d+|STEP\s+\d+)", t, re.IGNORECASE):
        return "project_boundary_heading"
    if re.match(r"^(WHY THIS MATTERS|WHAT THIS PROVES|THE JOB THIS MAPS TO|SAFETY|BOM|BILL OF MATERIALS|SCHEMATIC|WIRING|FIRMWARE)", t, re.IGNORECASE):
        return "section_heading"
    if re.match(r"^([•\-\*]|\d+[\.\)])\s+", t):
        return "list"
    if any(k in t.lower() for k in ["resistor", "capacitor", "microcontroller", "sensor", "qty", "part number"]):
        if "\t" in t or "  " in t or "|" in t:
            return "table"
    if len(t) < 80 and t.isupper() and len(t.split()) < 8:
        return "heading"
    return "paragraph"

def extract_document_ir(source_id: str, pdf_path: Path, sha256: str) -> DocumentIR:
    """Extract structured Document IR from a PDF file preserving pages, blocks, and provenance."""
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    pages: List[PageIR] = []

    for p_idx in range(page_count):
        page = doc[p_idx]
        p_num = p_idx + 1
        width = float(page.rect.width)
        height = float(page.rect.height)
        
        raw_blocks = page.get_text("blocks")

        dingbat_spans = [
            (span["text"], span["bbox"])
            for dblock in page.get_text("dict")["blocks"]
            for dline in dblock.get("lines", [])
            for span in dline["spans"]
            if "dingbat" in span.get("font", "").lower() and span.get("text")
        ]

        blocks: List[TextBlock] = []
        char_count = 0

        for b_idx, b in enumerate(raw_blocks):
            if len(b) >= 5:
                bx0, by0, bx1, by1 = float(b[0]), float(b[1]), float(b[2]), float(b[3])
                btext = str(b[4])
                if dingbat_spans:
                    btext = _fix_dingbat_spans(btext, (bx0, by0, bx1, by1), dingbat_spans)
                btext = btext.strip()
                if btext:
                    char_count += len(btext)
                    btype = classify_block_type(btext)
                    blocks.append(TextBlock(
                        blockIndex=b_idx,
                        blockType=btype,
                        text=btext,
                        bbox=[round(bx0, 2), round(by0, 2), round(bx1, 2), round(by1, 2)],
                        pageNumber=p_num,
                        confidence=ProvenanceConfidence.EXACT
                    ))

        pages.append(PageIR(
            pageNumber=p_num,
            width=round(width, 2),
            height=round(height, 2),
            textExtractable=char_count > 10,
            charCount=char_count,
            blocks=blocks
        ))

    meta = doc.metadata or {}
    clean_meta = {k: str(v) for k, v in meta.items() if v}
    doc.close()

    provenance = Provenance(
        source=source_id,
        sourcePath=f"Engineering guides/{pdf_path.name}",
        sourceHash=sha256,
        sourcePage=None,
        sourceSection="ROOT",
        extractionMethod="pymupdf-blocks-v1",
        extractorVersion=fitz.__version__,
        origin=ProvenanceOrigin.EXTRACTED,
        confidence=ProvenanceConfidence.EXACT
    )

    doc_ir = DocumentIR(
        schemaVersion="1.0.0",
        sourceId=source_id,
        relativePath=f"Engineering guides/{pdf_path.name}",
        sha256=sha256,
        pageCount=page_count,
        metadata=clean_meta,
        pages=pages,
        provenance=provenance
    )

    IR_DIR.mkdir(parents=True, exist_ok=True)
    out_file = IR_DIR / f"{source_id}.json"
    out_file.write_text(
        json.dumps(doc_ir.model_dump(), indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    return doc_ir

def extract_all_documents_ir(manifest) -> Dict[str, DocumentIR]:
    """Extract Document IR for every document in the source manifest."""
    all_ir = {}
    for doc_item in manifest.documents:
        pdf_path = REPO_ROOT / doc_item.relativePath
        ir = extract_document_ir(doc_item.sourceId, pdf_path, doc_item.sha256)
        all_ir[doc_item.sourceId] = ir
    return all_ir
