"""
Full Pipeline Determinism & Idempotency Runner (Forensic Closure P02.3, Sections 13 & 14).

Executes the complete Project-First pipeline twice from the same baseline
(Run A, Run B) and byte-for-byte compares every generated artifact via
SHA-256, writing docs/project-first/determinism_audit.json.

This is NOT limited to a handful of JSON files: it hashes every artifact
listed in compute_current_artifact_hashes(), which covers public/projects.json,
docs/project-first/projects.json, canonical_projects.json,
duplicate_candidates.json, relations.json and boundary_reconciliation.json.
"""

import json
from pathlib import Path

from scripts.project_first.pipeline import run_project_first_pipeline
from scripts.project_first.audit_artifacts import (
    compute_current_artifact_hashes,
    generate_determinism_audit,
    DOCS_PROJECT_FIRST,
)


def run_determinism_and_idempotency_check() -> dict:
    print("==========================================================")
    print("  FULL PIPELINE RUN A")
    print("==========================================================")
    run_project_first_pipeline()
    hashes_a = compute_current_artifact_hashes()

    print("==========================================================")
    print("  FULL PIPELINE RUN B")
    print("==========================================================")
    run_project_first_pipeline()
    hashes_b = compute_current_artifact_hashes()

    determinism_result = generate_determinism_audit(hashes_a, hashes_b)

    print("==========================================================")
    print("  IDEMPOTENCY CHECK (Run C over Run B baseline)")
    print("==========================================================")
    run_project_first_pipeline()
    hashes_c = compute_current_artifact_hashes()
    idempotent = hashes_b == hashes_c

    print(f"Determinism (A vs B): {determinism_result['verdict']}")
    print(f"Idempotency (B vs C): {'PASS' if idempotent else 'FAIL'}")

    determinism_result["idempotencyCheckPassed"] = idempotent
    out_path = DOCS_PROJECT_FIRST / "determinism_audit.json"
    out_path.write_text(json.dumps(determinism_result, indent=2, sort_keys=True, ensure_ascii=False) + "\n", encoding="utf-8")
    return determinism_result


if __name__ == "__main__":
    result = run_determinism_and_idempotency_check()
    ok = result["verdict"] == "PASS_STRICT_DETERMINISM" and result["idempotencyCheckPassed"]
    exit(0 if ok else 1)
