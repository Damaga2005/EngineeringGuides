"""
Deterministic Source Manifest Builder and PDF Validator.
Complies with Prompt 01 Sections 9, 10, 11, and 14.
"""

import os
import hashlib
import json
from pathlib import Path
from typing import List, Dict, Tuple
import fitz  # PyMuPDF

from scripts.foundation.models import (
    SourceManifest,
    SourceDocumentManifestItem,
    DocumentStatus,
    ProvenanceConfidence
)

REPO_ROOT = Path(__file__).resolve().parents[2]
GUIDES_DIR = REPO_ROOT / "Engineering guides"
OUTPUT_MANIFEST_PATH = REPO_ROOT / "docs" / "foundation" / "source_manifest.json"

def calculate_sha256(filepath: Path) -> str:
    """Compute SHA-256 hash of a file deterministically."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def validate_pdf_document(filepath: Path, sha256: str) -> Tuple[DocumentStatus, int, bool, str, List[str]]:
    """
    Validate PDF integrity and extractability according to Section 10.
    Checks existence, structure, truncation, pages, and corruption.
    """
    warnings: List[str] = []
    if not filepath.exists():
        return DocumentStatus.INVALID, 0, False, "File does not exist", ["FILE_MISSING"]

    file_size = filepath.stat().st_size
    if file_size < 1024:
        warnings.append("SUSPICIOUS_SMALL_FILE_SIZE")

    try:
        doc = fitz.open(filepath)
    except Exception as e:
        return DocumentStatus.INVALID, 0, False, f"PDF parser failed: {e}", ["CORRUPT_OR_TRUNCATED"]

    page_count = len(doc)
    if page_count == 0:
        doc.close()
        return DocumentStatus.INVALID, 0, False, "Zero pages in PDF document", ["EMPTY_DOCUMENT"]

    total_chars = 0
    corrupt_pages = 0
    for p_idx in range(page_count):
        try:
            page = doc[p_idx]
            text = page.get_text()
            total_chars += len(text)
        except Exception as e:
            corrupt_pages += 1
            warnings.append(f"Page {p_idx+1} extraction failed: {e}")

    doc.close()

    text_extractable = total_chars > 50
    if not text_extractable:
        warnings.append("LOW_OR_NO_EXTRACTABLE_TEXT_MAY_BE_SCANNED_IMAGE")

    if corrupt_pages > 0 and corrupt_pages == page_count:
        status = DocumentStatus.INVALID
        extraction_status = "TOTAL_EXTRACTION_FAILURE"
    elif corrupt_pages > 0:
        status = DocumentStatus.VALID_WITH_WARNINGS
        extraction_status = f"PARTIAL_EXTRACTION_({page_count - corrupt_pages}/{page_count}_PAGES_OK)"
    elif len(warnings) > 0:
        status = DocumentStatus.VALID_WITH_WARNINGS
        extraction_status = f"EXTRACTED_WITH_WARNINGS_({total_chars}_CHARS)"
    else:
        status = DocumentStatus.VALID
        extraction_status = f"FULLY_EXTRACTED_({total_chars}_CHARS)"

    return status, page_count, text_extractable, extraction_status, warnings

def build_source_manifest() -> SourceManifest:
    """
    Scan 'Engineering guides/' and construct a strictly deterministic manifest.
    Files are sorted canonically by lowercase filename.
    """
    OUTPUT_MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    pdf_files = sorted([f for f in GUIDES_DIR.iterdir() if f.is_file() and f.suffix.lower() == ".pdf"],
                       key=lambda x: x.name.lower())

    seen_hashes: Dict[str, str] = {}
    items: List[SourceDocumentManifestItem] = []
    total_size = 0

    for idx, pdf_path in enumerate(pdf_files, 1):
        source_id = f"guide-{idx:03d}"
        sha256 = calculate_sha256(pdf_path)
        file_size = pdf_path.stat().st_size
        total_size += file_size

        status, page_count, text_extractable, ext_status, warnings = validate_pdf_document(pdf_path, sha256)

        is_dup = False
        dup_of = None
        if sha256 in seen_hashes:
            is_dup = True
            dup_of = seen_hashes[sha256]
            warnings.append(f"BYTE_IDENTICAL_DUPLICATE_OF_{dup_of}")
        else:
            seen_hashes[sha256] = source_id

        rel_path = f"Engineering guides/{pdf_path.name}"

        item = SourceDocumentManifestItem(
            sourceId=source_id,
            relativePath=rel_path,
            fileName=pdf_path.name,
            fileType="pdf",
            fileSize=file_size,
            sha256=sha256,
            status=status,
            extractor="pymupdf",
            extractorVersion=fitz.__version__,
            pageCount=page_count,
            textExtractable=text_extractable,
            extractionStatus=ext_status,
            validationStatus=status,
            isDuplicate=is_dup,
            duplicateOf=dup_of,
            warnings=warnings
        )
        items.append(item)

    manifest = SourceManifest(
        schemaVersion="1.0.0",
        generator="engineering-guides-foundation",
        generatorVersion="1.0.0",
        documentCount=len(items),
        uniqueHashCount=len(seen_hashes),
        totalSizeBytes=total_size,
        documents=items
    )

    OUTPUT_MANIFEST_PATH.write_text(
        json.dumps(manifest.model_dump(), indent=2, sort_keys=True, ensure_ascii=False) + "\n",
        encoding="utf-8"
    )
    return manifest

if __name__ == "__main__":
    m = build_source_manifest()
    print(f"Source Manifest generated successfully: {m.documentCount} documents, {m.uniqueHashCount} unique hashes.")
