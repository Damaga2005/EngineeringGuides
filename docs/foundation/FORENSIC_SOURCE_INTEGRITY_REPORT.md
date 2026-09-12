# Forensic Source Integrity & CI Failure Analysis Report (Prompt 01.2)

## 1. Executive Summary
- **Repository:** `Damaga2005/EngineeringGuides`
- **Branch:** `main`
- **Previous Certification Commit:** `a55e54b38aa3c7c77bfdacf1400ba79ab59b08b8`
- **GitHub Actions Incident:** CI execution of commit `a55e54b` failed at step `Run Source & Asset Validators` with:
  ```text
  FOUNDATION VALIDATION FAILED
  20 errors, 0 warnings
  ```
- **Forensic Diagnosis:** The failure was caused by platform-dependent line-ending translation on Windows due to the absence of a `.gitattributes` file and active `core.autocrlf = true`. When the initial foundation manifest (`source_manifest.json`) was generated on Windows in commit `ed9d65d2`, 10 source PDFs lacking initial binary null bytes were treated as text by Git, inflating every lone `0x0A` (LF) into `0x0D 0x0A` (CRLF) upon local checkout. The manifest erroneously recorded these Windows CRLF-expanded byte sizes and hashes. When GitHub Actions checked out the repository on Ubuntu Linux (`ubuntu-latest`), Git checked out the pristine canonical Git blobs (with Unix `\n`), which did not match the CRLF-expanded expectations.
- **Resolution:** Created `.gitattributes` enforcing `*.pdf binary` across all platforms, normalized local working tree checkouts to the canonical Git blobs, updated `source_manifest.json`, IR provenance, and catalog to the canonical hashes, and verified 100% test, determinism, idempotency, and build gates.

---

## 2. Baseline Forense (Read-Only State at Start of Audit)
- **HEAD Commit:** `a55e54b38aa3c7c77bfdacf1400ba79ab59b08b8`
- **origin/main Commit:** `a55e54b38aa3c7c77bfdacf1400ba79ab59b08b8`
- **Branch:** `main`
- **Working Tree:** `CLEAN`
- **Git Config:** `core.autocrlf = true`
- **`.gitattributes`:** Absent (initially)

---

## 3. Forensic Identification of Affected Source Files
A bit-level audit of all 31 PDFs compared the manifest expectations against the Git repository blobs (the actual files checked out in CI on Ubuntu):

| # | File Name | Expected Size (Manifest / Win CRLF) | Actual Size (CI / Canonical Blob) | Size Diff (bytes) | Expected SHA-256 (Windows CRLF) | Actual Canonical SHA-256 (Git Blob / CI) |
|---|---|---|---|---|---|---|
| 1 | `cs portfolio projects.pdf` | 1,081,500 | 1,080,658 | +842 | `0a80bffc518a6f25ad0d139bbe3dcf1c01d00e8f776b80d71d49bcd75c9d2073` | `bfbdb595e58f998607ed3f85070f02d268dbc38120cc4c4bd3e8e1716effdc8a` |
| 2 | `dangerously_overeducated_engineer_guide.pdf` | 18,238 | 17,975 | +263 | `3c0712dcec6c251b433e49856a068b9b7ab924dc67e34ab9036d47a114e96f0d` | `1987495df6a7b8824b53c7c6b985695217140f3c0c64560393f3dbb085aa4906` |
| 3 | `ee ai era projects.pdf` | 366,848 | 366,334 | +514 | `307e095efd6f4e7bc42ba8293cbedb92e19d51d6b87cb4730481f6c0bc992c0d` | `aff92715aebd9ce6a8dd0b2b8e8fe56c021157b3867115d49f9c698b96d1c46b` |
| 4 | `ee defense tech part2.pdf` | 366,597 | 366,044 | +553 | `93190cb08ab967a2b01e2552f0b56ec97762b28516c1e37e730f6beac7b4f5c9` | `90c7eed1d3908d390e5ac722938ca87525850ad240239e13dc8577dccac2e540` |
| 5 | `ee physical ai embodiment.pdf` | 607,376 | 606,788 | +588 | `92a38cfc580ec18b7c4dc48037a66ee8fbea9190eed71b5063d3f25282c1d362` | `4ede95cec207c88b3b4cde02e0f2966bf3585c2cb551d379701ae25df73bfc85` |
| 6 | `ee_portfolio_projects.pdf` | 28,136 | 27,789 | +347 | `fd09c2a12d77783c01968ad84c6271977fabfc40f8dcf7bbfebc3538d2959116` | `fd932845b67b6c5917fe5891af5daece6a38b575429aae3f3d5e86309d49ba88` |
| 7 | `follow @1nska.pdf` | 20,534 | 20,251 | +283 | `518a28f940af62650d4eed17e882ec2f63047746d9d23f7073e4c6c1b16e31eb` | `67abfeb6fcf5253d18ca9ba499f7f3aee18091190f05f28242749f2e569e3444` |
| 8 | `LATESTrecruiter_ee_portfolio.pdf` | 1,304,402 | 1,303,540 | +862 | `dae0b52f6d153254c18aa4cf8afb35efe5ce083c0b1558e955b990b7c0b447a1` | `6e8bfcfa951eed1627e07a813ae93189b76e795d008c5d05842f69643ee96803` |
| 9 | `me_portfolio_projects.pdf` | 889,487 | 888,636 | +851 | `18b165ba177f1be3aa354b368aed98d0af4b71239c6662eb3b207509209c2acc` | `66bae01af4411981ae580568f9e82ebe82edd204be279bbc70bcf82aa894b629` |
| 10 | `ml guide engineers.pdf` | 19,668 | 19,423 | +245 | `c86362ab7573eda52c7be73a7c1bd4150a5b3be0f3a393ea3578ffa2ac475835` | `c0cda1ecdc0ce02017f9b3d3075a5f50ff2128c2167ac87c4546a0675050a295` |

- **Metrics:**
  - `affected_file_count`: 10
  - `affected_size_count`: 10
  - `affected_hash_count`: 10
  - `affected_size_count == affected_hash_count`: **True**

---

## 4. Historical Git Investigation Across Key Commits
For each affected file, the Git object database was audited across all key commits:
- `972fe682360f703859ff37d4fed2cc096330da60` (Documentation base)
- `ed9d65d20cc133d79fc91772c7fce2caaaa92aa2` (Prompt 01 implementation)
- `a55e54b38aa3c7c77bfdacf1400ba79ab59b08b8` (Prompt 01.1 reconciliation)

### Findings:
1. **Zero Git Mutations in Repository History:**
   The blob SHA in Git's tree for all 10 PDFs is completely identical across `972fe682`, `ed9d65d2`, and `a55e54b3`.
   In fact, `git log --follow --stat -- "Engineering guides/<FILE>"` proves that no PDF in `Engineering guides/` has been touched by any commit since the initial upload commit:
   `commit f02a5ea025f801e8526aec8e8704d49daca4a532 ("Add files via upload")`
2. **Initial Upload Analysis:**
   In commit `f02a5ea`, 17 PDFs contained null bytes in their leading bytes and were recorded as `Bin 0 -> X bytes`.
   The other 14 PDFs did not contain null bytes in their initial buffer and Git's heuristic treated them without the binary flag, recording them with `+N insertions`.
3. **No Script Mutates Source PDFs:**
   Auditing all scripts in `scripts/` and `.github/` confirmed that all operations on `Engineering guides/` are strictly read-only (`fitz.open()`, `open(..., 'rb')`). The legacy `sync_gdrive.py` script remains decommissioned.

---

## 5. Byte-by-Byte Cryptographic & Line-Ending Proof
To confirm whether the on-disk discrepancy was strictly CRLF expansion, every byte of the canonical Git blob was compared against the local Windows on-disk file:
```python
converted = re.sub(b"(?<!\r)\n", b"\r\n", blob_bytes)
assert converted == disk_bytes
```
**Result:** `converted == disk_bytes` evaluated to **True** for all 10 files.
Furthermore, the size difference in bytes is identically equal to the count of lone `0x0A` (LF) bytes in the canonical Git blob:
- `cs portfolio projects.pdf`: lone LFs = 842, size diff = 842 bytes
- `dangerously_overeducated_engineer_guide.pdf`: lone LFs = 263, size diff = 263 bytes
- `ee ai era projects.pdf`: lone LFs = 514, size diff = 514 bytes
- `ee defense tech part2.pdf`: lone LFs = 553, size diff = 553 bytes
- `ee physical ai embodiment.pdf`: lone LFs = 588, size diff = 588 bytes
- `ee_portfolio_projects.pdf`: lone LFs = 347, size diff = 347 bytes
- `follow @1nska.pdf`: lone LFs = 283, size diff = 283 bytes
- `LATESTrecruiter_ee_portfolio.pdf`: lone LFs = 862, size diff = 862 bytes
- `me_portfolio_projects.pdf`: lone LFs = 851, size diff = 851 bytes
- `ml guide engineers.pdf`: lone LFs = 245, size diff = 245 bytes
- **Total expansion across 10 files:** 5,348 bytes.

**Classification:** `CI_CHECKOUT_MISMATCH` / `MANIFEST_FROM_WRONG_REVISION` (manifest generated from platform-mutated Windows working copy).

---

## 6. Corpus-Wide Integrity Audit (All 31 Guides)
Recalculated from the canonical Git blobs:
- **Total Documents:** 31
- **Total Extracted Pages:** 521 pages
- **Total Blob Size:** 27,037,458 bytes (exactly 27,042,806 - 5,348)
- **Unique SHA-256 Hashes:** 30
- **Duplicate Pair:** Exactly 1 pair:
  - `(PART 21) 6_Upgrades_Your_Drone_Is_Missing.pdf` (sourceId: `guide-002`)
  - `6_Upgrades_Your_Drone_Is_Missing.pdf` (sourceId: `guide-015`, marked `isDuplicate: true`, `duplicateOf: "guide-002"`)
  - Both files have identical canonical SHA-256: `87f5986df3355a1a1f0a1c73a69a2e61df3f1a660a5d4a6652433e361286be62`
  - Both files preserved on disk (Section 12: No Loss Rule).

---

## 7. Toolchain Comparison (Local vs CI)
| Component | Local Runtime | GitHub Actions CI Runtime | Status | Impact Analysis |
|---|---|---|---|---|
| OS | Windows 11 (win32) | Ubuntu 22.04 LTS (linux) | Expected Cross-Platform | Solved via `.gitattributes` |
| Python | 3.14.6 | 3.11 (configured in `ci.yml`) | Warning (Minor) | No effect on PyMuPDF/JSON schemas |
| PyMuPDF | 1.28.0 | Installed via `pip install -r requirements.txt` | Reproducible | Identical PDF parsing & text extraction |
| pytest | 9.1.1 | Installed via `pip install -r requirements.txt` | Reproducible | Identical test execution |
| Node.js | v26.5.1 | v20 (configured in `ci.yml`) | Warning (Minor) | Identical bundle output via Vite |
| npm | 11.17.0 | v10.x | Reproducible | `npm ci` strictly follows `package-lock.json` |
| Vite | 6.4.3 | 6.4.3 (pinned in `package-lock.json`) | Exact Match | Identical build pipeline |
| React | 19.3.0 | 19.3.0 (pinned in `package-lock.json`) | Exact Match | Identical component rendering |

---

## 8. Corrective Actions Applied
1. **Added Root `.gitattributes`:**
   Configured explicit binary attributes for all PDFs and media files:
   ```gitattributes
   * text=auto eol=lf
   *.pdf binary
   *.png binary
   *.jpg binary
   *.jpeg binary
   *.svg text eol=lf
   *.json text eol=lf
   *.md text eol=lf
   *.py text eol=lf
   *.js text eol=lf
   *.jsx text eol=lf
   ```
2. **Normalized On-Disk Working Tree:**
   Re-checked out all 31 PDFs on Windows through Git with `.gitattributes` active. All 31 files on disk now match the canonical Git repository blobs byte-for-byte (27,037,458 bytes total).
3. **Reconciled Foundation Manifest & Provenance:**
   Rebuilt `docs/foundation/source_manifest.json` and `docs/foundation/ir/*.json` using `python -m scripts.foundation.pipeline`. The manifest now records the canonical cross-platform SHA-256 hashes and file sizes.
4. **Synchronized Static Catalog:**
   Updated `public/guides.json` with canonical hashes and sizes.

---

## 9. Gate Verification Results
- **Source & Asset Validators (`scripts/foundation/validators.py`):**
  - **Result:** `FOUNDATION VALIDATION PASSED (0 errors, 0 warnings)`
- **Automated Test Suite (`pytest tests/ -v`):**
  - **Result:** `14 passed in 148.45s (0:02:28)`
- **Determinism Verification (Build A vs Build B):**
  - `public/guides.json`: `e6106ed2da00166d...` == `e6106ed2da00166d...` (**MATCH**)
  - `source_manifest.json`: `5b54d74e04835e36...` == `5b54d74e04835e36...` (**MATCH**)
  - **Result:** `EXACT BYTE-FOR-BYTE MATCH (PASS)`
- **Idempotency Verification:**
  - **Result:** `IDEMPOTENCY VERIFICATION: PASSED (31 source files strictly unmutated, outputs identical)`
- **Web Application Build (`npm run build`):**
  - **Result:** `built in 1m 9s (PASS)`

## 10. Remote CI Verification
- **GitHub Actions Workflows:**
  - `Continuous Integration & Verification Gate`:
    - **Run ID:** `34683862799`
    - **Commit SHA:** `0299e6580e55bce2725e2db812239d565ba1ea7b`
    - **Status:** **SUCCESS / PASS** (all steps passed: Validators, Pytest, Deterministic Pipeline, Web Build)
  - `Deploy EngineeringGuides Portal to GitHub Pages`:
    - **Run ID:** `34683862806`
    - **Commit SHA:** `0299e6580e55bce2725e2db812239d565ba1ea7b`
    - **Status:** **SUCCESS / PASS** (built and deployed to GitHub Pages)
