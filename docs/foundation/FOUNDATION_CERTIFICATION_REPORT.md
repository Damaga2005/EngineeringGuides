# Prompt 01: Foundation Certification Report

**Repository:** Damaga2005/EngineeringGuides  
**Commit Hash / HEAD:** `972fe682360f703859ff37d4fed2cc096330da60`  
**Branch:** `main`  
**Evaluation Date:** 2026-09-12  
**Evaluation Pipeline:** `scripts/foundation/`  
**Verification Verdict:** **FOUNDATION PASS**

---

## A. Baseline Inventory Audit

Prior to making any file modifications, a comprehensive read-only audit was conducted across the entire repository.

| Metric | Measured Value | Target / Status |
| :--- | :--- | :--- |
| **Total Guides** | 31 | 31 (All accounted for) |
| **Total Source PDFs** | 31 | In `Engineering guides/` |
| **Total PDF Pages** | 521 | Verified via PyMuPDF |
| **Unique SHA-256 Hashes** | 30 | 1 duplicate pair identified |
| **Duplicate Source Identified** | `6_Upgrades_Your_Drone_Is_Missing.pdf` | Byte-identical to `(PART 21) 6_Upgrades_Your_Drone_Is_Missing.pdf` |
| **Static Assets in public/** | 709 total files | 31 covers, 184 SVGs, 524 PNG slides/projects |
| **Legacy Catalog** | `public/guides.json` (2.19 MB) | Mixed extracted and synthetic data |
| **Google Drive References** | 5 files | `.github/workflows/sync-gdrive.yml`, `scripts/sync_gdrive.py`, `README.md`, `scripts/make_docs.py`, `src/components/StatsModal.jsx` |
| **Automated Tests** | 0 tests | Zero test coverage in legacy state |

---

## B. Source of Truth & Repository Canonicalization

- **Canonical Location:** The Git repository directory `Engineering guides/` is established as the sole, authoritative source of truth.
- **No Loss Guarantee (Rule 4):** No PDF was deleted or mutated. The duplicate source `6_Upgrades_Your_Drone_Is_Missing.pdf` is fully registered in `docs/foundation/source_manifest.json` with `isDuplicate: true` and `duplicateOf: "guide-002"`.
- **ID Stability:** Identifiers `guide-001` through `guide-031` are deterministically assigned based on alphanumeric sorting and pinned in the source manifest.

---

## C. Google Drive Decoupling & Retirement Audit

- **Active Workflow Removal:** `.github/workflows/sync-gdrive.yml` has been permanently deleted from Git.
- **Script Archival:** `scripts/sync_gdrive.py` has been decommissioned and moved to `scripts/archive/sync_gdrive.py.decommissioned` with an explanatory header.
- **Documentation Decoupling:** `README.md` and `src/components/StatsModal.jsx` have been updated to remove all claims of Google Drive synchronization.
- **Audit Documentation:** Full decoupling report compiled in `docs/foundation/GOOGLE_DRIVE_REMOVAL.md`.

---

## D. Ingestion, PDF Integrity & Text Extractability

- **Parser Engine:** PyMuPDF (`fitz`) version 1.25.x / 1.26.x.
- **Corrupted / Truncated PDFs:** 0 (all 31 files parsed successfully).
- **Text Extractability:** 100% of PDFs yielded structured text blocks.
- **Manifest Serialization:** Serialized to `docs/foundation/source_manifest.json` under `SourceManifestSchema` (schemaVersion `1.0.0`).

---

## E. Document IR Generation & Provenance System

- **Storage Location:** `docs/foundation/ir/guide-001.json` through `docs/foundation/ir/guide-031.json`.
- **IR Fidelity:** Every page contains physical bounding boxes (`bbox`), font geometry, line layout, and block classification (`heading`, `paragraph`, `list`, `table`, `code`).
- **Provenance Model:** Every item tracks `sourceId`, `sourcePath`, `sourceHash`, `sourcePage`, `extractionMethod`, `extractorVersion`, `origin` (`extracted` | `curated` | `generated`), and `confidence` (`EXACT` | `HEURISTIC` | `NEEDS_REVIEW`).

---

## F. BOM Contract & Price Integrity Audit

- **Rule of No Fabrication (Rule 2):** Strictly enforced. No synthetic prices (e.g. `$65`, `$35`) are fabricated or disguised as verified market facts.
- **Price Separation:** All engineering BOM items have a dedicated `PriceSnapshot` model.
- **Unverified Status:** If price data is not backed by an authentic supplier quote, `amount` is set to `null` and `status` is set to `UNVERIFIED`.

---

## G. Asset Integrity & XML/SVG Security

- **Schematics Validated:** 184 electrical schematics in `public/schematics/*.svg`.
- **XML Well-Formedness:** 100% pass rate. All dynamic strings and text nodes sanitized using `xml_escape` (e.g. `&` replaced with `&amp;`).
- **SVG Security:** Tested and verified zero `<script>` tags, zero `javascript:` URIs, and zero inline event handlers (`onload`, `onclick`).
- **Covers:** 31 PNG cover images verified in `public/covers/`.

---

## H. Determinism, Reproducibility & Idempotency

- **Byte-for-Byte Determinism:** Consecutive pipeline executions generate identical SHA-256 hashes for `public/guides.json` and `docs/foundation/source_manifest.json`.
- **Idempotency:** Re-running the pipeline leaves source files in `Engineering guides/` byte-for-byte untouched (verified via file timestamps and SHA-256 hashes).
- **Ordering:** All dictionaries and arrays in output JSONs are strictly ordered (`sort_keys=True`, 2-space indentation, trailing newline).

---

## I. Frontend Decoupling & LocalStorage Hardening

- **Runtime API Removal:** Removed unauthenticated `https://api.github.com/repos/...` calls from `src/App.jsx`. Catalog reload now loads from `./guides.json?t=${Date.now()}` for completely offline-safe operation.
- **LocalStorage Hardening:** Implemented `src/utils/storage.js`:
  - Enforces `STORAGE_VERSION = 1` and prefix `eng_v1_`.
  - Automatic migration from legacy keys (`eng_guides_view_mode`, `eng_guides_favorites`, `build_check_*`).
  - Safe error recovery preventing unhandled JSON parse exceptions.
- **UI Integrity:** All components (`Navbar`, `SearchAndFilter`, `GuideCard`, `GuideLanding`, `ProjectBuildGuide`, `StatsModal`) remain fully functional.

---

## J. CI/CD Hardening & Security Posture

- **Deployment Workflow (`.github/workflows/deploy.yml`):**
  - Divided into distinct `build` and `deploy` jobs with environment boundaries.
  - Replaced `npm install` with `npm ci`.
  - Enforced least-privilege permissions: top-level `permissions: {}`, `build: contents: read`, `deploy: pages: write, id-token: write`.
  - Includes pre-deployment validation gate and test suite execution.
- **CI Workflow (`.github/workflows/ci.yml`):**
  - Triggers on push and pull requests to `main`.
  - Executes `python -m scripts.foundation.validators`.
  - Executes `pytest tests/ -v`.
  - Verifies deterministic catalog generation and frontend Vite build.

---

## K. Automated Test Suite & Invariant Gates

- **Framework:** `pytest` 9.x.
- **Configuration:** `pytest.ini` (`pythonpath = .`, `testpaths = tests`).
- **Execution Evidence:**

```text
============================= test session starts =============================
platform win32 -- Python 3.14.6, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\dmart\Documents\EngineeringGuides
configfile: pytest.ini
collected 14 items

tests/integration/test_pipeline.py::test_run_pipeline_end_to_end PASSED  [  7%]
tests/invariants/test_determinism.py::test_determinism_byte_for_byte PASSED [ 14%]
tests/invariants/test_idempotency.py::test_idempotency_no_source_mutation PASSED [ 21%]
tests/invariants/test_no_fabrication.py::test_no_unverified_prices_marked_verified PASSED [ 28%]
tests/unit/test_assets.py::test_schematics_valid_xml PASSED              [ 35%]
tests/unit/test_assets.py::test_schematics_security_clean PASSED         [ 42%]
tests/unit/test_assets.py::test_covers_exist PASSED                      [ 50%]
tests/unit/test_bom.py::test_bom_no_fabrication_default PASSED           [ 57%]
tests/unit/test_bom.py::test_bom_with_verified_price PASSED              [ 64%]
tests/unit/test_ir.py::test_ir_all_documents_present_and_valid PASSED    [ 71%]
tests/unit/test_ir.py::test_ir_page_dimensions_valid PASSED              [ 78%]
tests/unit/test_manifest.py::test_manifest_file_exists_and_valid PASSED  [ 85%]
tests/unit/test_manifest.py::test_manifest_id_stability PASSED           [ 92%]
tests/unit/test_manifest.py::test_duplicate_pdf_preserved_and_mapped PASSED [100%]

============================= 14 passed in 33.55s =============================
```

- **Validation Gate (`python -m scripts.foundation.validators`):**

```text
==================================================
  Running EngineeringGuides Foundation Validators
==================================================
[CHECK 1/7] Validating Source Manifest...
[CHECK 2/7] Verifying Source PDF Bit-Level Integrity...
[CHECK 3/7] Validating Document IR Files...
[CHECK 4/7] Validating Static Assets and XML Security...
[CHECK 5/7] Validating Static Catalog Contract...
[CHECK 6/7] Enforcing Zero-Fabrication Invariants...
[CHECK 7/7] Enforcing Offline Readiness and Google Drive Decoupling...
==================================================
  FOUNDATION VALIDATION PASSED (0 warnings)
==================================================
```

---

## L. Certification Conclusion

In accordance with Section 36 (Foundation Gate Checklist) and Section 39 (Final Prompt 01 Report) of the specification:

- [x] Canonical source of truth established in Git.
- [x] Google Drive fully decoupled and archived.
- [x] All 31 source PDFs ingested and verified without corruption.
- [x] Duplicate source preserved and mapped (Rule 4).
- [x] Document IR generated with complete provenance.
- [x] Zero-fabrication contract enforced (Rule 2).
- [x] 184 SVG schematics validated for XML well-formedness and security.
- [x] Pipeline determinism and idempotency proven.
- [x] Frontend decoupled from runtime GitHub API; LocalStorage hardened.
- [x] CI/CD workflows hardened with least privilege and separation of concerns.
- [x] Automated test suite passing at 100%.

**FINAL VERDICT:**
# FOUNDATION PASS
