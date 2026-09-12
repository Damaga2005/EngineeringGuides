"""
Deterministic Cryptographic ID and Slug Generators for Project-First Architecture (Prompt 02).
Guarantees zero random UUIDs, zero timestamps, and 100% cross-platform reproducibility.
"""

import hashlib
import re
import unicodedata


def deterministic_hash(content: str, length: int = 16) -> str:
    """Generate a deterministic hex digest from normalized UTF-8 string."""
    return hashlib.sha256(content.strip().encode("utf-8")).hexdigest()[:length]


def slugify(text: str) -> str:
    """Convert text into an alphanumeric kebab-case slug deterministically."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    text = re.sub(r"[-\s]+", "-", text)
    return text or "unnamed-project"


def generate_project_id(source_document_id: str, project_number: int, title: str) -> str:
    """Derive stable Project ID: proj-<hash>."""
    canonical_key = f"{source_document_id}:p{project_number:02d}:{title.strip().lower()}"
    return f"proj-{deterministic_hash(canonical_key)}"


def generate_project_source_id(project_id: str, source_document_id: str, page_start: int) -> str:
    """Derive stable ProjectSource ID: psrc-<hash>."""
    canonical_key = f"{project_id}:{source_document_id}:page{page_start}"
    return f"psrc-{deterministic_hash(canonical_key)}"


def generate_canonical_project_id(canonical_name: str, controller: str = "") -> str:
    """Derive stable CanonicalProject ID: cproj-<hash>."""
    canonical_key = f"{canonical_name.strip().lower()}:{controller.strip().lower()}"
    return f"cproj-{deterministic_hash(canonical_key)}"


def generate_variant_id(canonical_project_id: str, diff_fingerprint: str) -> str:
    """Derive stable ProjectVariant ID: var-<hash>."""
    canonical_key = f"{canonical_project_id}:{diff_fingerprint.strip().lower()}"
    return f"var-{deterministic_hash(canonical_key)}"


def generate_candidate_id(project_a_id: str, project_b_id: str) -> str:
    """Derive stable DuplicateCandidate ID from canonically sorted pair: cand-<hash>."""
    pair = sorted([project_a_id, project_b_id])
    canonical_key = f"{pair[0]}:{pair[1]}"
    return f"cand-{deterministic_hash(canonical_key)}"


def generate_relation_id(source_project_id: str, target_project_id: str, relation_type: str) -> str:
    """Derive stable ProjectRelation ID: rel-<hash>."""
    canonical_key = f"{source_project_id}:{target_project_id}:{relation_type}"
    return f"rel-{deterministic_hash(canonical_key)}"


def generate_conflict_id(source_a_id: str, source_b_id: str, field_name: str) -> str:
    """Derive stable ConflictRecord ID: conf-<hash>."""
    pair = sorted([source_a_id, source_b_id])
    canonical_key = f"{pair[0]}:{pair[1]}:{field_name}"
    return f"conf-{deterministic_hash(canonical_key)}"
