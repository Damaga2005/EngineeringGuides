# EngineeringGuides: Project-First Release Certification Report (P02.3)

**Repository:** `Damaga2005/EngineeringGuides`
**Pipeline Standard:** EngineeringGuides Project-First v2.3.0 (P02.3 Forensic Closure Final)
**Baseline commit (before this closure):** `b3f201194ee05b0ef378715ee6dfce33f95547de`

This report distinguishes several separate commit/state identities. They are
**not interchangeable** and must never be collapsed into a single "HEAD":

| Identity | SHA | What it identifies |
|---|---|---|
| **P02.3 certified code commit** | `3de1fc23261d0fdca3d7690eb6a1acbae881516a` | The commit whose code was actually extracted, tested, validated, built, and deployed. This is what "P02.3 is certified" refers to. This value is a permanent fact and does not change. |
| **CI headSha** | `3de1fc23261d0fdca3d7690eb6a1acbae881516a` | The commit the CI workflow ([run 34691695150](https://github.com/Damaga2005/EngineeringGuides/actions/runs/34691695150), `success`) actually ran against. Permanent fact. |
| **Deploy headSha** | `3de1fc23261d0fdca3d7690eb6a1acbae881516a` | The commit the GitHub Pages deploy workflow ([run 34691695148](https://github.com/Damaga2005/EngineeringGuides/actions/runs/34691695148), `success`) actually deployed. Permanent fact. |

**Documentation commit history** (each is a child of the certified code
commit above, not the certified code itself; this list only grows forward
and each entry's own SHA is a permanent fact about *that specific edit*):

| Documentation commit | Purpose | CI (check-runs) | Deploy (check-runs) |
|---|---|---|---|
| `96a6c4bf418406d8333b64c6ccb79e5acb320823` | First attempt to record CI/Deploy verification. **Superseded**: used ambiguous "Closure commit (HEAD)" wording that stopped being true as soon as it landed on `main`. | success | success |
| `bcd7fb7e8a697d08272cf932d217b883840f4854` | Corrected the ambiguous wording (P02.3.1). Introduced the identity table above. | success (verified via `gh api repos/.../commits/bcd7fb7.../check-runs`, not the legacy `/status` endpoint, which GitHub Actions does not populate and always returns `statuses: []` for Actions-only repos) | success (same verification) |
| *(this edit, P02.3.2)* | Removed the self-referential "current HEAD" field described below. | — | — |

**Relationship:** `3de1fc2` is an ancestor of every documentation commit
above (`git merge-base --is-ancestor 3de1fc2 <sha>` → true for each). The
certified code commit and the documentation commits are **different commits
by design** — `main` moves forward by one purely-documental commit each time
this report is corrected, which is expected and does not invalidate the
P02.3 code certification.

## Certification SHA semantics

A versioned document committed as part of commit `X` cannot self-referentially
contain the final SHA of `X` as a stable property of its own content, because
the document's content is itself an input to `X`'s hash. **This applies
recursively**: the P02.3.1 correction (`bcd7fb7`) still described itself as
"current main HEAD", which was true only until this very edit (P02.3.2)
landed and moved HEAD again. Any report that hardcodes a "current HEAD" field
will go stale the next time that same report is edited — there is no fixed
point.

The fix is not to chase a moving value but to stop treating it as a
certification criterion at all:

- `certifiedCodeCommit`, `ciHeadSha`, `deployHeadSha` — permanent facts about
  one specific, already-tested commit. These never change and are safe to
  hardcode.
- The **documentation commit history** table above is append-only: each row
  is a permanent fact about the edit that produced it, verified independently
  against GitHub's API at the time it was added.
- **"Current main HEAD" is deliberately not hardcoded anywhere in this
  document.** To find it, run `git rev-parse origin/main`. Whatever that
  command returns is - by definition - one commit at or after the last row in
  the table above, and this report does not need to be re-edited every time
  someone pushes to `main` for an unrelated reason.

`reportSha == HEAD` is never used as a certification criterion in this
document, and no field in this document claims to equal "the current HEAD".

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
| **Certified code commit == CI headSha** | `gh run view 34691695150 --json headSha` | `3de1fc2` == `3de1fc2` | **PASS** |
| **Certified code commit == Deploy headSha** | `gh run view 34691695148 --json headSha` | `3de1fc2` == `3de1fc2` | **PASS** |
| **Every documentation commit is a descendant of the certified code commit** | `git merge-base --is-ancestor 3de1fc2 <doc-sha>` for each row in the documentation history table | true for `96a6c4b`, true for `bcd7fb7` | **PASS** |
| **Each documentation commit's own CI/Deploy checks (not the code's)** | `gh api repos/.../commits/<sha>/check-runs` | `96a6c4b`: 3/3 success; `bcd7fb7`: 3/3 success (verified via the Checks API - the legacy `/commits/<sha>/status` endpoint returns `statuses: []` for Actions-only repos and must not be read as "no checks ran") | **PASS** |
| **Prompt 03 Boundary** | Zero P03 code touched | Preserved | **PASS** |

**FINAL RELEASE GATE: PASS** — all local gates are green, the certified code
commit `3de1fc23261d0fdca3d7690eb6a1acbae881516a` was pushed to `origin/main`
and both the CI workflow (run 34691695150) and the GitHub Pages deploy
workflow (run 34691695148) completed successfully against that exact commit
SHA. Every documentation commit made since then is a purely-documental
descendant, independently verified via the GitHub Checks API - none of them
is itself part of what CI/Deploy originally tested, and this report does not
claim otherwise. This report intentionally does not assert a "current main
HEAD" value (see *Certification SHA semantics* above); read
`git rev-parse origin/main` for that.

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
CI:         PASS (run 34691695150, headSha 3de1fc2)
Deploy:     PASS (run 34691695148, headSha 3de1fc2)
```

No number above was rounded or omitted. The 6 `MISSING_IN_IR` and 19
`BOUNDARY_MISMATCH` catalog entries, and the 180 IR-only
`MISSING_IN_CATALOG` candidates, are real, disclosed gaps between the
catalog and the Document IR — they are not failures of this closure; they are
exactly what Section 7 requires to remain visible instead of being
auto-promoted to PASS.

---

## 5. Certification Chain

```
b3f201194ee05b0ef378715ee6dfce33f95547de   (P02.2 baseline)
        │
        │ P02.3 code (this report's Sections 2-4)
        ▼
3de1fc23261d0fdca3d7690eb6a1acbae881516a   (P02.3 certified code commit)
        │
        │ CI PASS (run 34691695150)
        │ Deploy PASS (run 34691695148)
        ▼
96a6c4bf418406d8333b64c6ccb79e5acb320823   (doc commit: recorded CI/Deploy SHAs; used ambiguous "HEAD" wording)
        │
        │ own CI/Deploy checks: 3/3 success (Checks API)
        ▼
bcd7fb7e8a697d08272cf932d217b883840f4854   (doc commit: corrected the ambiguous wording, P02.3.1)
        │
        │ own CI/Deploy checks: 3/3 success (Checks API)
        ▼
... (this edit, P02.3.2) ...
        │
        ▼
current main HEAD  (read live via `git rev-parse origin/main` - not hardcoded here)
```

`3de1fc2` remains the P02.3 certified code commit regardless of how many
purely-documental commits are later added on top of it. A later HEAD does not
retroactively decertify an earlier commit's CI/Deploy results, and a
documentation commit does not need its own CI/Deploy run to "inherit" the
certification of the code it describes — it only needs to itself introduce no
functional change (verified for `96a6c4b` and `bcd7fb7` via `git diff
--name-status 3de1fc2 <sha>`, both touching only this report). Each
documentation commit's own CI/Deploy result is recorded because it is useful
evidence that the edit didn't break anything - not because it is required to
"transfer" the P02.3 code certification, which lives permanently on `3de1fc2`.

---

## 6. P03 Boundary

No file under any P03-designated path was created or modified, in the P02.3
certified code commit or in any subsequent documentation-only commit. This
closure is strictly scoped to `scripts/project_first/`, `tests/project_first/`,
`docs/project-first/`, and the two generated catalogs
(`public/projects.json`, `public/guides.json`).

**P03: NOT STARTED.**
