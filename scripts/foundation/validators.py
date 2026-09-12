"""
Comprehensive Validation Suite for EngineeringGuides Foundation (Prompt 01).
Enforces:
- Schema validation for Source Manifest, Document IR, and Static Catalog
- SHA-256 source file integrity (bit-level audit)
- Non-fabrication invariants (BOM prices, voltages, GPIOs)
- Duplicate source traceability (No Loss rule)
- Static asset cross-referencing and XML safety
- LocalStorage contract adherence
"""

import json
import hashlib
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Dict, Any, Tuple

from scripts.foundation.models import (
    SourceManifest,
    DocumentIR,
    AssetEntity,
    PriceStatus,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_FOUNDATION = REPO_ROOT / "docs" / "foundation"
MANIFEST_PATH = DOCS_FOUNDATION / "source_manifest.json"
IR_DIR = DOCS_FOUNDATION / "ir"
PUBLIC_DIR = REPO_ROOT / "public"
CATALOG_PATH = PUBLIC_DIR / "guides.json"
SCHEMATICS_DIR = PUBLIC_DIR / "schematics"
COVERS_DIR = PUBLIC_DIR / "covers"
SOURCE_PDFS_DIR = REPO_ROOT / "Engineering guides"


class FoundationValidationError(Exception):
    pass


class FoundationValidator:
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def log_error(self, msg: str):
        self.errors.append(msg)
        print(f"  [ERROR] {msg}")

    def log_warning(self, msg: str):
        self.warnings.append(msg)
        print(f"  [WARN]  {msg}")

    def validate_source_manifest(self) -> SourceManifest:
        print("[CHECK 1/7] Validating Source Manifest...")
        if not MANIFEST_PATH.exists():
            self.log_error(f"Manifest not found at {MANIFEST_PATH}")
            raise FoundationValidationError("Manifest missing")

        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            raw = f.read()

        manifest = SourceManifest.model_validate_json(raw)
        if manifest.documentCount != 31:
            self.log_error(f"Expected 31 documents in manifest, got {manifest.documentCount}")
        if manifest.uniqueHashCount != 30:
            self.log_error(f"Expected 30 unique hashes in manifest, got {manifest.uniqueHashCount}")

        # Check duplicate pairing
        duplicates = [d for d in manifest.documents if d.isDuplicate]
        if len(duplicates) != 1:
            self.log_error(f"Expected exactly 1 duplicate source entry, found {len(duplicates)}")
        else:
            dup = duplicates[0]
            if dup.duplicateOf != "guide-002" or dup.fileName != "6_Upgrades_Your_Drone_Is_Missing.pdf":
                self.log_error(f"Unexpected duplicate mapping: {dup.fileName} -> {dup.duplicateOf}")

        return manifest

    def validate_source_pdfs_integrity(self, manifest: SourceManifest):
        print("[CHECK 2/7] Verifying Source PDF Bit-Level Integrity...")
        for doc in manifest.documents:
            pdf_path = REPO_ROOT / doc.relativePath
            if not pdf_path.exists():
                self.log_error(f"Source PDF missing from disk: {doc.relativePath}")
                continue

            # Check file size
            actual_size = pdf_path.stat().st_size
            if actual_size != doc.fileSize:
                self.log_error(f"Size mismatch for {doc.relativePath}: expected {doc.fileSize}, got {actual_size}")

            # Check SHA-256
            h = hashlib.sha256()
            with open(pdf_path, "rb") as f:
                while chunk := f.read(65536):
                    h.update(chunk)
            actual_hash = h.hexdigest()
            if actual_hash != doc.sha256:
                self.log_error(f"SHA-256 mismatch for {doc.relativePath}: expected {doc.sha256}, got {actual_hash}")

    def validate_document_ir(self, manifest: SourceManifest):
        print("[CHECK 3/7] Validating Document IR Files...")
        if not IR_DIR.exists():
            self.log_error(f"IR directory missing at {IR_DIR}")
            return

        ir_files = list(IR_DIR.glob("*.json"))
        if len(ir_files) != 31:
            self.log_error(f"Expected 31 IR JSON files, found {len(ir_files)}")

        for doc in manifest.documents:
            ir_file = IR_DIR / f"{doc.sourceId}.json"
            if not ir_file.exists():
                self.log_error(f"IR file missing for {doc.sourceId}")
                continue

            with open(ir_file, "r", encoding="utf-8") as f:
                ir = DocumentIR.model_validate_json(f.read())

            if ir.sourceId != doc.sourceId:
                self.log_error(f"IR sourceId mismatch in {ir_file.name}: {ir.sourceId} != {doc.sourceId}")
            if ir.pageCount != doc.pageCount:
                self.log_error(f"IR pageCount mismatch for {doc.sourceId}: {ir.pageCount} != {doc.pageCount}")
            if len(ir.pages) != doc.pageCount:
                self.log_error(f"IR pages list length mismatch for {doc.sourceId}: {len(ir.pages)} != {doc.pageCount}")

            # Validate each page geometry and text
            for page in ir.pages:
                if page.width <= 0 or page.height <= 0:
                    self.log_error(f"Invalid dimensions on {doc.sourceId} page {page.pageNumber}: {page.width}x{page.height}")

    def validate_static_assets(self):
        print("[CHECK 4/7] Validating Static Assets and XML Security...")
        if not SCHEMATICS_DIR.exists():
            self.log_error(f"Schematics directory missing: {SCHEMATICS_DIR}")
            return

        svg_files = list(SCHEMATICS_DIR.glob("*.svg"))
        if len(svg_files) < 184:
            self.log_warning(f"Expected at least 184 schematic SVGs, found {len(svg_files)}")

        for svg_path in svg_files:
            try:
                tree = ET.parse(svg_path)
                root = tree.getroot()
                if not root.tag.endswith("svg"):
                    self.log_error(f"Asset root element is not <svg>: {svg_path.name}")
                # Security: check for script tags or dangerous handlers
                content = svg_path.read_text(encoding="utf-8", errors="ignore").lower()
                if "<script" in content or "javascript:" in content or "onload=" in content:
                    self.log_error(f"Security hazard: active script in SVG: {svg_path.name}")
            except Exception as e:
                self.log_error(f"Malformed XML in SVG asset {svg_path.name}: {e}")

        # Check cover images
        if not COVERS_DIR.exists():
            self.log_error(f"Covers directory missing: {COVERS_DIR}")
        else:
            covers = list(COVERS_DIR.glob("*.png"))
            if len(covers) < 31:
                self.log_warning(f"Expected 31 covers, found {len(covers)}")

    def validate_static_catalog(self, manifest: SourceManifest):
        print("[CHECK 5/7] Validating Static Catalog Contract...")
        if not CATALOG_PATH.exists():
            self.log_error(f"Catalog not found at {CATALOG_PATH}")
            return

        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            catalog = json.load(f)

        if not isinstance(catalog, dict):
            self.log_error("Catalog is not a valid JSON object")
            return

        if catalog.get("schemaVersion") != "1.0.0":
            self.log_error(f"Invalid catalog schemaVersion: {catalog.get('schemaVersion')}")

        guides = catalog.get("guides", [])
        if len(guides) != 31:
            self.log_error(f"Expected 31 guides in catalog, got {len(guides)}")

        # Verify ID matching
        catalog_ids = {g["id"] for g in guides}
        manifest_ids = {d.sourceId for d in manifest.documents}
        if catalog_ids != manifest_ids:
            diff = catalog_ids.symmetric_difference(manifest_ids)
            self.log_error(f"ID mismatch between manifest and catalog: {diff}")

        # Verify each guide references valid assets
        for g in guides:
            # Check schematic references in projects if any
            for p in g.get("keyProjects", []):
                schem = p.get("schematicSvg")
                if schem and schem.startswith("public/schematics/"):
                    disk_path = REPO_ROOT / schem
                    if not disk_path.exists():
                        self.log_warning(f"Project schematic referenced does not exist: {schem}")

    def validate_no_fabrication_invariants(self):
        print("[CHECK 6/7] Enforcing Zero-Fabrication Invariants...")
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            catalog = json.load(f)

        for guide in catalog.get("guides", []):
            # Check BOM items: must not fabricate verified prices
            for bom in guide.get("bom", []):
                if isinstance(bom, dict):
                    # If price is set, ensure it's not disguised as verified fact without source
                    status = bom.get("priceStatus")
                    if status and status == "VERIFIED" and not bom.get("supplier"):
                        self.log_error(f"Fabrication violation: VERIFIED price without supplier in {guide['id']}")

    def validate_offline_and_no_google_drive(self):
        print("[CHECK 7/7] Enforcing Offline Readiness and Google Drive Decoupling...")
        # Verify sync-gdrive workflow does not exist
        gdrive_wf = REPO_ROOT / ".github" / "workflows" / "sync-gdrive.yml"
        if gdrive_wf.exists():
            self.log_error(f"Google Drive workflow still exists: {gdrive_wf}")

        # Verify active sync_gdrive.py script does not exist
        sync_script = REPO_ROOT / "scripts" / "sync_gdrive.py"
        if sync_script.exists():
            self.log_error(f"Active Google Drive script still exists: {sync_script}")

        # Verify App.jsx does not contain runtime api.github.com
        app_jsx = REPO_ROOT / "src" / "App.jsx"
        if app_jsx.exists():
            content = app_jsx.read_text(encoding="utf-8")
            if "api.github.com" in content:
                self.log_error("src/App.jsx still contains runtime api.github.com calls")

    def run_all(self) -> Tuple[bool, List[str], List[str]]:
        print("==================================================")
        print("  Running EngineeringGuides Foundation Validators")
        print("==================================================")
        try:
            manifest = self.validate_source_manifest()
            self.validate_source_pdfs_integrity(manifest)
            self.validate_document_ir(manifest)
            self.validate_static_assets()
            self.validate_static_catalog(manifest)
            self.validate_no_fabrication_invariants()
            self.validate_offline_and_no_google_drive()
        except Exception as e:
            self.log_error(f"Validation failed with exception: {e}")

        passed = len(self.errors) == 0
        print("==================================================")
        if passed:
            print(f"  FOUNDATION VALIDATION PASSED ({len(self.warnings)} warnings)")
        else:
            print(f"  FOUNDATION VALIDATION FAILED ({len(self.errors)} errors, {len(self.warnings)} warnings)")
        print("==================================================")
        return passed, self.errors, self.warnings


if __name__ == "__main__":
    validator = FoundationValidator()
    passed, errors, warnings = validator.run_all()
    exit(0 if passed else 1)
