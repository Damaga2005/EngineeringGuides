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
        blocks: List[TextBlock] = []
        char_count = 0

        for b_idx, b in enumerate(raw_blocks):
            if len(b) >= 5:
                bx0, by0, bx1, by1, btext = float(b[0]), float(b[1]), float(b[2]), float(b[3]), str(b[4]).strip()
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
