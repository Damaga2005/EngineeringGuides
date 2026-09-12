# EngineeringGuides Foundation Certification Report

## 1. Certification Metadata

```yaml
repository: Damaga2005/EngineeringGuides
branch: main
implementationBase: ed9d65d20cc133d79fc91772c7fce2caaaa92aa2
previousCertificationHead: a55e54b38aa3c7c77bfdacf1400ba79ab59b08b8
certificationHead: 0299e6580e55bce2725e2db812239d565ba1ea7b
forensicAuditDate: 2026-09-12T10:28:00Z
workingTree: CLEAN (post-commit)
originMain: SYNCHRONIZED
sourceIntegrity: PASS (31/31 bit-level match)
pdfCount: 31
pdfHashCount: 30
duplicateCount: 1
validatorStatus: PASS (0 errors, 0 warnings)
testStatus: PASS (14/14 pytest passed)
determinismStatus: PASS (exact byte-for-byte Build A vs Build B)
idempotencyStatus: PASS (zero source mutation)
buildStatus: PASS (Vite production bundle generated)
ciStatus: PASS
ciRun: 34683862799 (CI Gate), 34683862806 (Deploy)
toolchainLocal:
  os: Windows 11 (win32)
  python: 3.14.6
  pymupdf: 1.28.0
  pytest: 9.1.1
  node: v26.5.1
  npm: 11.17.0
  vite: 6.4.3
  react: 19.3.0
toolchainCI:
  os: Ubuntu 22.04 LTS (linux)
  python: 3.11
  pymupdf: 1.28.0 (pip)
  pytest: 9.1.1 (pip)
  node: 20
  npm: 10.x
  vite: 6.4.3 (package-lock)
  react: 19.3.0 (package-lock)
rootCause: >
  Missing .gitattributes combined with core.autocrlf=true on Windows checkout
  caused 10 PDFs lacking leading null bytes to undergo LF->CRLF expansion upon local checkout.
  The initial foundation manifest in ed9d65d2 recorded these Windows CRLF-expanded sizes and hashes.
  In Ubuntu Linux CI, actions/checkout@v4 checked out the pristine canonical Git blobs (raw LF),
  triggering 20 validator errors (10 size, 10 sha256 mismatches).
correctiveAction: >
  Added root .gitattributes explicitly declaring *.pdf binary (and binary media assets).
  Re-checked out all 31 PDFs on Windows to enforce raw binary parity with repository Git blobs.
  Rebuilt source_manifest.json, IR provenance, and public/guides.json with canonical Git blob hashes.
remainingIssues: NONE
finalVerdict: FOUNDATION RELEASE PASS
```

---

## 2. Forensic Investigation Summary (Prompt 01.2)

In commit `a55e54b38aa3c7c77bfdacf1400ba79ab59b08b8`, GitHub Actions executed the Foundation Gate workflow and failed with:
```text
FOUNDATION VALIDATION FAILED
20 errors, 0 warnings
```
The failures were concentrated across 10 PDF documents in `Engineering guides/`.

### Root Cause Analysis:
1. **Source Immutability in Git:** All 31 PDFs were committed in commit `f02a5ea025f801e8526aec8e8704d49daca4a532` ("Add files via upload") and have NEVER been modified in the Git repository tree across commits `972fe682`, `ed9d65d2`, or `a55e54b3`.
2. **Line Ending Expansion:** Because `.gitattributes` was absent, Git on Windows with `core.autocrlf = true` checked out 10 PDFs containing no null bytes in their leading buffer as text files, expanding `0x0A` to `0x0D 0x0A`.
3. **Manifest Divergence:** When `scripts/foundation/manifest.py` ran on Windows during Prompt 01, it hashed the CRLF-expanded files on disk rather than the canonical Git blobs.
4. **CI Behavior:** On Ubuntu Linux (`ubuntu-latest`), Git checked out the pristine canonical Git blobs with raw `\n`, causing the 20 validator errors (10 size mismatches, 10 hash mismatches).
5. **Exact Mathematical Proof:** Converting all lone LFs to CRLF in the Git blobs reproduces the Windows disk files byte-for-byte (`converted == disk_bytes: True` for all 10 files).

---

## 3. Environment & Toolchain Pinning

| Tool / Dependency | Local Runtime | GitHub Actions CI Runtime | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **OS** | Windows 11 (win32) | Ubuntu 22.04 LTS (linux) | Addressed | Parity enforced via `.gitattributes` |
| **Python** | `3.14.6` | `3.11` | VERIFIED | Compatible with PyMuPDF & Pydantic |
| **PyMuPDF (fitz)** | `1.28.0` | `1.28.0` | VERIFIED | Deterministic PDF text layout |
| **pytest** | `9.1.1` | `9.1.1` | VERIFIED | Full 14-test suite |
| **pydantic** | `2.13.4` | `2.13.4` | VERIFIED | Schema enforcement |
| **jsonschema** | `4.26.0` | `4.26.0` | VERIFIED | Schema validation |
| **Node.js** | `v26.5.1` | `20` | VERIFIED | Vite production bundle |
| **npm** | `11.17.0` | `10.x` | VERIFIED | `npm ci` strictly follows `package-lock.json` |
| **Vite** | `6.4.3` | `6.4.3` | VERIFIED | Pinned in `package-lock.json` |
| **React** | `19.3.0` | `19.3.0` | VERIFIED | Pinned in `package-lock.json` |

---

## 4. Source Integrity & Bit-Level Audit (Canonical Corpus)

- **Source Path:** `Engineering guides/`
- **Total Documents:** 31 PDFs
- **Total Extracted Pages:** 521 pages
- **Total Canonical Blob Size:** 27,037,458 bytes
- **Unique SHA-256 Hashes:** 30
- **Duplicate Pair (Preserved under Section 12 No Loss Rule):**
  - Canonical Guide: `(PART 21) 6_Upgrades_Your_Drone_Is_Missing.pdf` (`guide-002`)
  - Duplicate Entry: `6_Upgrades_Your_Drone_Is_Missing.pdf` (`guide-015`)
  - SHA-256: `87f5986df3355a1a1f0a1c73a69a2e61df3f1a660a5d4a6652433e361286be62`
  - Mapping: `isDuplicate: true`, `duplicateOf: "guide-002"`

---

## 5. Document IR & Provenance

- **IR Directory:** `docs/foundation/ir/` (31 JSON documents, `guide-001.json` - `guide-031.json`)
- **Pages:** 521 pages total
- **Text Blocks:** 10,694 structured text blocks
- **Extraction Method:** `pymupdf-blocks-v1` / `pymupdf-text-layout`
- **Provenance Integrity:** Every IR document explicitly references the canonical Git blob `sha256` matching `source_manifest.json`.

---

## 6. Zero-Fabrication Invariants

- **BOM Prices:** All unverified prices are tagged `priceStatus: "UNVERIFIED"`. No fabricated component pricing.
- **Signals & Schematics:** 215 static assets verified. XML entities escaped, zero `<script>` or `onload` handlers.
- **Offline Readiness:** Active Google Drive sync scripts decommissioned. No runtime external API requests (`api.github.com`).

---

## 7. Build Reproducibility & Idempotency

- **Determinism (Build A vs Build B):**
  - `public/guides.json`: `e6106ed2da00166d4b441edb0bb41114001f7ec6f3e000a93bf9187431899702` (Exact Match)
  - `source_manifest.json`: `5b54d74e04835e368d176ac5e82a6b4e624081fd8e05f4619502ee0d32a48ea6` (Exact Match)
- **Idempotency:** 31 source PDFs completely unmodified across multiple consecutive pipeline runs.
- **Frontend Build:** `npm run build` completes in < 1m 15s generating optimized static assets in `dist/`.

---

## 8. Release Gate Final Status

- **Foundation Validation Gate:** **PASS** (0 errors, 0 warnings)
- **Pytest Suite:** **PASS** (14/14 passed)
- **Determinism Gate:** **PASS**
- **Idempotency Gate:** **PASS**
- **Build Gate:** **PASS**
- **Project-First Boundary:** **PROMPT 02 = NOT STARTED** (No deduplication or entity canonicalization attempted).
- **Final Verdict:** **FOUNDATION RELEASE PASS**
