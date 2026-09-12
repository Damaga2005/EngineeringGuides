# EngineeringGuides: Project-First Release Certification Report (P02.3)

**Repository:** `Damaga2005/EngineeringGuides`
**Pipeline Standard:** EngineeringGuides Project-First v2.3.0 (P02.3 Forensic Closure Final)
**Baseline commit (before this closure):** `b3f201194ee05b0ef378715ee6dfce33f95547de`

This report supersedes the P02.2 report. That report's `PASS` verdict was **not
reliable**: `docs/project-first/fabrication_audit.json` reported
`PASS_ZERO_FABRICATION` while `public/projects.json` actually contained the
banned phrase *"Análisis técnico fundado en evidencia literal..."* **2,636
times** and *"Implementación y validación técnica de {title}."* **183 times**
(once per project) — because the P02.2 validator's own banned-phrase list did
not include the phrases the P02.2 extractor was actually generating. Section
2/18/25 of the P02.3 closure prompt exist specifically to prevent this failure
mode ("no confíes en el propio certification report"). This report was
produced only after re-deriving every number below directly from the current
working tree, not from the prior report.

---

## 1. Release Gate Verification Checklist

| Check Item | Required Standard | Observed Result | Status |
|---|---|---|---|
| **CHECK 1: Schema** | Pydantic validation, `ProjectCatalog` v2.1.0 | 183 projects, 181 canonical projects | **PASS** |
| **CHECK 2: Source Hash** | Every source occurrence matches `source_manifest.json` | 100% matched, 0 mismatches | **PASS** |
| **CHECK 3: Evidence Provenance** | Every SOURCE section backed by ≥1 EvidenceBlock | 0 SOURCE-without-evidence violations | **PASS** |
| **CHECK 4: Zero Fabrication** | Structural SOURCE/DERIVED/NOT_DOCUMENTED audit, 0 banned phrases | 0 banned phrases, 0 status inconsistencies | **PASS** |
| **CHECK 5: Boundary Integrity** | Independent IR-only discovery, reconciliation visible | 183/183 catalog-side reconciled (31 MATCH, 127 PARTIAL_MATCH, 19 BOUNDARY_MISMATCH, 6 MISSING_IN_IR); 180 IR-only candidates preserved as MISSING_IN_CATALOG | **PASS** (discrepancies visible, not auto-promoted) |
| **CHECK 6: Deduplication** | 16,653 pairs, EXACT_DUPLICATE requires identity evidence only | 2 EXACT_DUPLICATE (firmware/schematic identity), 0 similarity-only false merges | **PASS** |
| **CHECK 7: Source Preservation** | 31/31 PDFs intact, SHA-256 matched | 31/31 present and matched | **PASS** |
| **CHECK 8: Structured Descriptions** | Status-based (SOURCE/DERIVED/UNVERIFIED/NOT_DOCUMENTED), not `len() >= 10` | 183/183 have valid fieldStatus | **PASS** |
| **CHECK 9: Golden Dataset** | Golden-1/5/20/Full re-verified against **raw Document IR on disk**, not against `projects.json` | 4/4 tiers PASS, all SOURCE sections byte-verified against `docs/foundation/ir/*.json` | **PASS** |
| **CHECK 10: Determinism** | Full pipeline Run A vs Run B, byte-for-byte, all generated artifacts | 6/6 artifacts byte-identical | **PASS** |
| **Idempotency** | Run B vs Run C (3rd run) byte-for-byte | Byte-identical | **PASS** |
| **Automated Test Suite** | `pytest tests/ -v` including 11 new adversarial tests (Section 17) | 45/45 PASSED | **PASS** |
| **Foundation Validators** | `python -m scripts.foundation.validators` | 7/7 checks PASSED (untouched by this closure) | **PASS** |
| **Frontend Production Build** | `npm run build` (pipeline + Vite + asset copy) | Built successfully, 0 errors | **PASS** |
| **Audit Artifacts Generated** | 4 forensic audit JSONs, regenerated with strict byte-equality | `evidence_audit.json`, `fabrication_audit.json`, `golden_execution.json`, `determinism_audit.json` | **PASS** |
| **CI SHA / Deploy SHA / Report SHA == HEAD** | GitHub Actions run + Pages deploy after push | **Not pushed to `origin/main` yet** | **BLOCKED** |
| **Prompt 03 Boundary** | Zero P03 code touched | Preserved | **PASS** |

**FINAL RELEASE GATE: BLOCKED** — every local gate is green, but CI/Deploy SHA
verification (Section 20/24) cannot be performed until this closure is pushed
to `origin/main` and GitHub Actions/Pages complete. Per Section 20, this is
reported as `BLOCKED`, never invented as `PASS`.

---

## 2. What Was Actually Wrong in P02.2 (Confirmed, Not Assumed)

Each item below was verified against the P02.2 code and its own generated
output before any fix was applied — not inferred from the audit prompt alone.

1. **`extract_project_boundaries_from_ir()` received `catalog_hints` (`keyProjects`)**
   and used them to (a) cap the maximum structural project number
   (`max_allowed_num = len(catalog_hints)`), and (b) search Document IR text
   for catalog titles when no numbered marker existed. This is exactly the
   `keyProjects → discovery` dependency Section 1/6 prohibits.
2. **`extractor.py` generated the literal banned phrases** `"Sistema de
   ingeniería aplicada: {title}"`, `"Implementación y validación técnica de
   {title}."`, and a template combining `sourceText[:200].strip() + "..."`
   with `"Análisis técnico fundado en evidencia literal..."` /
   `"Subsistema documentado..."`. Confirmed via `grep -c` on the generated
   `public/projects.json`: 2,636 occurrences each of the last two phrases,
   183 occurrences of the objective-field fallback.
3. **`deduplication.py`'s `EXACT_DUPLICATE` classifier had a similarity-only
   path** (`exact_title_match and title_jaccard == 1.0 and controller_match
   == 1.0 and bom_overlap >= 0.35 and not conflict_evidence`) with zero
   identity evidence required. Both `EXACT_DUPLICATE` pairs in the P02.2
   output were produced by this exact condition.
4. **`audit_artifacts.py`'s evidence auditor accepted substring matches**
   (`snippet in ir_text or ir_text in snippet`) instead of the byte-exact
   `==` Section 4 requires.
5. **`golden_dataset.py` validated `projects.json` against expected values
   copied from the same catalog that produced it** — it never re-opened the
   raw Document IR to independently verify a SOURCE section's literal text.
6. **`reconciliation.py` created `VARIANT_OF`/`RELATED_TO` relations with a
   generic fallback description** (`"Variante de arquitectura de
   circuito."`) when no concrete evidence existed, instead of `NO RELATION`.
7. **`validators.py`'s banned-phrase lists did not match what the extractor
   actually generated**, and `check_8` validated `whatIsIt` by
   `len(text) >= 10` rather than by fieldStatus.
8. **A self-referential catalog feedback loop**: `pipeline.py` synchronized
   `public/guides.json['keyProjects'][i]['sourcePageRange']` with the
   IR-derived boundary on every run — but `guides.json` is *also* the
   `keyProjects` catalog used as reconciliation ground truth. This silently
   converted every `BOUNDARY_MISMATCH` into a `MATCH` on the very next
   pipeline run, permanently erasing the discrepancy (found while validating
   Section 7's "must remain visible" requirement, not called out in the
   audit prompt itself).

## 3. What Changed

- `scripts/project_first/boundaries.py`: split into
  `discover_projects_from_ir(ir, source_document_id, source_hash)` (Phase A,
  zero catalog input, fixed structural ceiling) and
  `reconcile_boundaries_with_catalog(...)` (Phase B; now also emits
  `MISSING_IN_CATALOG` records for IR-only candidates instead of discarding them).
- `scripts/project_first/extractor.py`: removed every banned fallback phrase;
  technical sections are now strictly `SOURCE` (literal, evidenced) or
  `NOT_DOCUMENTED` (null); description fields use `SOURCE` / `UNVERIFIED` /
  `NOT_DOCUMENTED` depending on real evidence provenance; catalog entries with
  `MISSING_IN_IR` boundaries get an explicit zero-confidence `NEEDS_REVIEW`
  boundary instead of a fabricated page span.
- `scripts/project_first/deduplication.py`: `EXACT_DUPLICATE` now requires
  concrete identity evidence (same source document + slot, shared schematic
  identity, or shared firmware identity) — similarity signals alone can only
  produce `PROBABLE_DUPLICATE`/`RELATED`/`NEEDS_REVIEW`.
- `scripts/project_first/reconciliation.py`: `VARIANT_OF`/`RELATED_TO`
  relations are only created when concrete evidence exists; otherwise `NO
  RELATION` (nothing is created).
- `scripts/project_first/audit_artifacts.py`: evidence literal-match check is
  now strict `==`; fabrication audit adds structural checks (`DERIVED`
  without `derivedFrom`, truncation-marker detection) using the shared
  `scripts/project_first/fabrication_patterns.py` list.
- `scripts/project_first/fabrication_patterns.py` (new): single source of
  truth for banned phrases, imported by every validator/audit/test so no
  checker can silently fall behind the extractor again.
- `scripts/project_first/determinism_check.py` (new): runs the full pipeline
  three times (Run A/B/C) and writes a real `determinism_audit.json`.
- `scripts/project_first/pipeline.py`: no longer overwrites
  `guides.json['keyProjects'][i]['sourcePageRange']` (removes the
  self-referential feedback loop above); only stable identifiers
  (`projectId`, `projectSlug`, `canonicalProjectId`) are synchronized.
- `scripts/project_first/validators.py`: all 10 checks rewritten against the
  shared banned-phrase list and the corrected boundary/dedup semantics;
  `CHECK 5` now surfaces `BOUNDARY_MISMATCH`/`MISSING_IN_IR`/
  `MISSING_IN_CATALOG` counts as warnings instead of silently requiring
  exactly 183 clean records.
- `tests/project_first/golden_dataset.py`: added
  `verify_evidence_against_raw_ir()`, which re-opens
  `docs/foundation/ir/<guide>.json` directly and byte-compares every SOURCE
  section against it — wired into all four Golden tiers.
- `tests/project_first/test_project_first.py`: added 11 adversarial tests
  (Section 17: literal truncation, literal whitespace, fake evidence, wrong
  hash, catalog-only → MISSING_IN_IR, IR-only → MISSING_IN_CATALOG,
  fabricated description → NOT_DOCUMENTED, exact-duplicate-requires-identity,
  golden corruption detection, full pipeline determinism, idempotency).

---

## 4. Forensic Corpus Accounting & Metrics (re-derived from current output)

```
Source documents:                31 (30 unique)
Total projects:                  183
Projects reconciled with catalog (183 total):
  MATCH:                          31
  PARTIAL_MATCH:                 127
  BOUNDARY_MISMATCH:              19   <- now visible (was silently hidden by the P02.2 feedback loop)
  MISSING_IN_IR:                   6   <- catalog entries with zero IR evidence; sections NOT_DOCUMENTED
  MISSING_IN_CATALOG:             (see below, IR-only candidates)
IR-only structural candidates with no catalog match (MISSING_IN_CATALOG): 180
  (expected: removing the keyProjects search-limit lets the pattern matcher
  surface many generic numbered headings/BOM lines as candidates; this is the
  honest cost of catalog-independent discovery and is preserved, not hidden)

Canonical projects:               181
All-pairs evaluated:            16,653
  EXACT_DUPLICATE:                  2   (identity evidence: same firmware code + same controller)
  PROBABLE_DUPLICATE:               2
  VARIANT:                          0
  RELATED:                        162
  NEEDS_REVIEW:                    23
  UNRELATED:                   16,464
Project relations (evidence-backed only): 158

Evidence audit:
  Total evidence blocks audited: 2,793
  Literal matches (byte ==):     2,793
  Literal mismatches:                0
  Invalid hashes:                    0
  Verdict:                        PASS

Fabrication audit:
  SOURCE fields:                 2,923
  DERIVED fields:                    0
  NOT_DOCUMENTED fields:         1,093
  Banned phrases found:              0
  Status inconsistencies:            0
  Verdict:                 PASS_ZERO_FABRICATION

Golden dataset (re-verified against raw IR, not projects.json):
  Golden-1:     PASS (1 project)
  Golden-5:     PASS (5 projects)
  Golden-20:    PASS (20 projects)
  Golden-Full:  PASS (183 projects)

Determinism (Run A vs Run B, all 6 generated artifacts, byte-for-byte): PASS
Idempotency (Run B vs Run C):                                          PASS

Tests:      45/45 passed
Validators: 10/10 checks passed (3 discrepancy warnings surfaced, not hidden)
Build:      PASS (npm run build, 0 errors)
CI:         BLOCKED (not yet pushed)
Deploy:     BLOCKED (not yet pushed)
```

No number above was rounded or omitted. The 6 `MISSING_IN_IR` and 19
`BOUNDARY_MISMATCH` catalog entries, and the 180 IR-only
`MISSING_IN_CATALOG` candidates, are real, disclosed gaps between the
catalog and the Document IR — they are not failures of this closure; they are
exactly what Section 7 requires to remain visible instead of being
auto-promoted to PASS.

---

## 5. P03 Boundary

No file under any P03-designated path was created or modified. This closure
is strictly scoped to `scripts/project_first/`, `tests/project_first/`,
`docs/project-first/`, and the two generated catalogs
(`public/projects.json`, `public/guides.json`).
