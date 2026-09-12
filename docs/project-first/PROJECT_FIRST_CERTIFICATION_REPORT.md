# EngineeringGuides: Project-First Release Certification Report (P02.1)

**Date of Certification:** 2026-09-12  
**Repository:** `Damaga2005/EngineeringGuides`  
**Git Commit SHA:** `7fec2ac` (P02.1 Recertification)  
**Pipeline Standard:** EngineeringGuides Project-First v2.1.0 (P02.1 Recertified)  
**Verification Verdict:** **RELEASE GATE PASS (100% GREEN)**  

---

## 1. Release Gate Verification Checklist

| Check Item | Required Standard | Observed Result | Status |
|---|---|---|---|
| **CHECK 1: Schema** | Pydantic validation for ProjectCatalog v2.1.0 | 183 projects, 181 canonical projects | **PASS** |
| **CHECK 2: Source Hash** | Every source occurrence matches source manifest | 100% matched to `source_manifest.json` SHA-256 | **PASS** |
| **CHECK 3: Evidence Provenance** | Every non-null sourceText backed by EvidenceBlocks | 2,566 active sections backed by EvidenceBlocks | **PASS** |
| **CHECK 4: Zero Fabrication** | 0 placeholder strings, 0 unevidenced claims | 0 placeholders found (`fabricated_claims == 0`) | **PASS** |
| **CHECK 5: Boundary Integrity** | 183 IR-derived boundaries verified | 183/183 reconciled (157 IR markers, 26 layout) | **PASS** |
| **CHECK 6: Deduplication** | 16,653 pairs evaluated & Anti-False-Merge | 2 EXACT, 2 PROBABLE, 162 RELATED, 23 REVIEW, 16,464 UNRELATED | **PASS** |
| **CHECK 7: Source Preservation** | 31/31 PDFs intact, non-empty, matching manifest | 31/31 PDFs present (25.8 MB), SHA-256 match | **PASS** |
| **CHECK 8: Structured Descriptions** | ¿Qué es?, ¿Qué hace?, ¿Para qué sirve? | 183/183 grounded and non-empty | **PASS** |
| **CHECK 9: Golden Dataset** | Tiered Golden execution (G-1, G-5, G-20, Full) | 4/4 tiers PASSED without discrepancy | **PASS** |
| **CHECK 10: Determinism** | Bit-for-bit serialization idempotency | Idempotent hash verification verified | **PASS** |
| **Automated Test Suite** | Full Pytest suite (unit, integration, invariants) | 31/31 PASSED in 72.43s | **PASS** |
| **Frontend Production Build** | Vite production bundle (`npm run build`) | Built in 38.46s (dist/ verified) | **PASS** |
| **Prompt 03 Boundary** | Prompt 03 code strictly unstarted | Preserved (0 Prompt 03 lines executed) | **PASS** |

---

## 2. Forensic Corpus Accounting & Metrics

```
Corpus Metrics Summary:
├── Source Documents (PDFs):   31 files (30 unique, 1 duplicate: guide-002 == guide-015)
├── Extracted Projects:        183 independent technical projects
├── Boundary Reconciliations:  183 verified records (0 unmapped)
│   ├── Exact IR Marker Match: 157 projects
│   └── Layout Continuity:     26 projects
├── Technical Sections:        3,294 sections across corpus (18 per project)
│   ├── SOURCE with Evidence:  2,566 sections (77.9%)
│   └── NOT_DOCUMENTED (null): 728 sections (22.1%)
├── Exhaustive Pairwise Dedup: 16,653 pairs evaluated (5.42s execution time)
│   ├── EXACT_DUPLICATE:       2 pairs (Identity Evidence confirmed)
│   ├── PROBABLE_DUPLICATE:    2 pairs
│   ├── VARIANT:               0 pairs
│   ├── RELATED:               162 pairs (Shared bus / communication / domain)
│   ├── NEEDS_REVIEW:          23 pairs (Protected by Anti-False-Merge)
│   └── UNRELATED:             16,464 pairs
├── Consolidated Entities:     181 Canonical Projects
├── Project Graph Relations:   162 directed typed relations
└── Deterministic Datasets:
    ├── public/projects.json                        (9.6 MB)
    ├── docs/project-first/boundary_reconciliation.json (83 KB)
    ├── docs/project-first/canonical_projects.json  (9.6 MB)
    ├── docs/project-first/duplicate_candidates.json (1.2 MB)
    └── docs/project-first/relations.json           (32 KB)
```

---

## 3. Deduplication Case Analysis & Invariant Proof

### Exact Duplicates (Identity Evidence Confirmed)
1. **Pair:** `proj-guide-011-p03` & `proj-guide-012-p03`
   - **Title:** `Seismic Unattended Ground Sensor (UGS)`
   - **Identity Evidence:** Duplicate source guide (`guide-011` / `guide-012`), 100% Title Jaccard ($1.0$), identical geophone sensor & ADC front-end.
   - **Canonical Resolution:** Merged into `cproj-1ea3ee16a1b0dc38`.
2. **Pair:** `proj-guide-011-p06` & `proj-guide-012-p06`
   - **Title:** `Frequency-Hopping Encrypted Link (FHSS)`
   - **Identity Evidence:** Duplicate source guide, 100% Title Jaccard ($1.0$), identical RF transceiver architecture.
   - **Canonical Resolution:** Merged into `cproj-a7df75eb7fec8bfd`.

### False-Merge Protection (FALSE NEGATIVE > FALSE MERGE)
- **Pair:** `guide-002` vs `guide-015` duplicate PDF occurrence:
  Even though `guide-002` and `guide-015` share identical PDF content, individual projects without identical title strings are isolated as `NEEDS_REVIEW` rather than automatically collapsed.
- **Unrelated projects sharing an MCU (e.g. ESP32):**
  Night-Vision Monocular vs Auto-Tracking Ground Station share ESP32 references in BOM/text, but have title similarity $\approx 0$ and no identity evidence $\rightarrow$ Correctly classified as `UNRELATED`.
