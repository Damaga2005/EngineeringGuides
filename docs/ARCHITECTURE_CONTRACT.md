# Architecture Contract: EngineeringGuides Foundation (Prompt 01)

## 1. Source of Truth
- The Git repository Damaga2005/EngineeringGuides is the sole canonical source of truth.
- The canonical documents repository directory is Engineering guides/.
- All downstream entities, metadata, intermediate representations, and catalog artifacts are derived deterministically from this directory.
- No remote storage services (e.g. Google Drive, S3, external clouds) are permitted as runtime or build-time dependencies for the canonical catalog.

## 2. Unidirectional Data Pipeline
The system strictly separates pipeline stages:

`
[SOURCE: Engineering guides/*.pdf]
      ↓
[STAGE 1: SOURCE MANIFEST & VALIDATION]
      ↓
[STAGE 2: DOCUMENT IR EXTRACTION]
      ↓
[STAGE 3: NORMALIZATION & PROVENANCE TAGGING]
      ↓
[STAGE 4: SCHEMAS & CROSS-INTEGRITY VALIDATION]
      ↓
[STAGE 5: DETERMINISTIC STATIC CATALOG BUILD]
      ↓
[CONSUMPTION: STATIC FRONTEND (Zero runtime API calls)]
`

Rules:
1. No monolithic scripts combining extraction, synthetic fabrication, and catalog publishing.
2. Every stage must produce an explicit, auditable intermediate artifact or validated memory structure.

## 3. Data Boundaries: Engineering vs. Market Data
Engineering data and market data are strictly segregated:

### 3.1 Engineering Data (Immutable Technical Facts)
- Components, pinouts, wiring tables, schematics, firmware code, physical principles, dimensions, and safety guidelines.
- Origin: extracted directly from source documents (extracted) or verified by domain engineering (curated).
- Never altered by market fluctuations.

### 3.2 Market Data (Volatile External Snapshots)
- Prices, costs, supplier names, stock availability, shipping estimates, query timestamps.
- Origin: captured via PriceSnapshot with explicit metadata (
etrievedAt, supplier, confidence, status).
- Status values: FRESH, STALE, EXPIRED, UNAVAILABLE.
- If a price is unknown, it MUST be recorded as UNVERIFIED / 
ull, NEVER fabricated or guessed.

## 4. Formal Provenance Model
Every extracted or derived data point must carry or inherit provenance:
- source: identifier of the source document (e.g., guide-001).
- sourcePath: relative repository path (e.g., Engineering guides/(PART 20)...pdf).
- sourceHash: SHA-256 hash of the source document file.
- sourcePage: 1-based page number where the data appears (or 
ull if global).
- sourceSection: heading or section identifier.
- extractionMethod: method used (e.g., pymupdf-text-layout, manual-curation, heuristic-signal).
- extractorVersion: semantic version of the extractor.
- origin: one of extracted, curated, generated, inferred, external.
- confidence: EXACT, HEURISTIC, FALLBACK, NEEDS_REVIEW.
- generatorVersion: version of the generation tool when origin == generated.

## 5. Deterministic Build Rules
1. **Same Inputs + Same Code = Same Output**: Two consecutive builds on identical sources must produce byte-identical artifacts.
2. **Key Sorting**: All JSON objects are serialized with alphabetically sorted keys.
3. **Array Ordering**: All lists (documents, projects, assets, BOM items) are sorted deterministically by stable IDs, never by filesystem discovery order.
4. **No Runtime Timestamps in Canonical Output**: Dynamic runtime execution timestamps that break byte reproducibility are prohibited in canonical catalog artifacts. Use document content hashes or fixed metadata versions.
5. **No Random UUIDs**: IDs are deterministic functions of content and relative paths.
6. **Normalized Paths and Line Endings**: Unix-style relative paths (/) and LF line endings (\n) across all environments (Windows, Linux, macOS).

## 6. Preparation for Project-First Architecture (Prompt 02)
Prompt 01 does NOT perform canonical project deduplication.
However, it guarantees that the catalog structure is open to multiple project sources per guide:
`
Guide (Source Document)
 ├── ProjectSource (Detected Project Signal / Boundary)
 ├── ProjectSource
 └── ...
`
Page and block boundaries are preserved in Document IR to allow Prompt 02 to extract and canonicalize individual projects without re-engineering the extraction foundation.
