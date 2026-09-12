"""
Formal Pydantic and JSON Schema definitions for EngineeringGuides Foundation (Prompt 01).
Ensures strict validation, deterministic serialization, and provenance tracking.
"""

from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict

class ProvenanceOrigin(str, Enum):
    EXTRACTED = "extracted"
    CURATED = "curated"
    GENERATED = "generated"
    INFERRED = "inferred"
    EXTERNAL = "external"

class ProvenanceConfidence(str, Enum):
    EXACT = "EXACT"
    HEURISTIC = "HEURISTIC"
    FALLBACK = "FALLBACK"
    NEEDS_REVIEW = "NEEDS_REVIEW"

class DocumentStatus(str, Enum):
    VALID = "VALID"
    VALID_WITH_WARNINGS = "VALID_WITH_WARNINGS"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    INVALID = "INVALID"

class PriceStatus(str, Enum):
    FRESH = "FRESH"
    STALE = "STALE"
    EXPIRED = "EXPIRED"
    UNAVAILABLE = "UNAVAILABLE"
    UNVERIFIED = "UNVERIFIED"

class AssetType(str, Enum):
    COVER = "cover"
    SCHEMATIC = "schematic"
    PAGE_SLIDE = "page_slide"
    PHOTO = "photo"
    DOCUMENT = "document"

class AssetClassification(str, Enum):
    SOURCE = "SOURCE"
    CURATED = "CURATED"
    GENERATED = "GENERATED"
    ILLUSTRATIVE = "ILLUSTRATIVE"

class Provenance(BaseModel):
    model_config = ConfigDict(extra="forbid")
    source: str = Field(description="ID of source document, e.g. guide-001")
    sourcePath: str = Field(description="Repository-relative path with forward slashes")
    sourceHash: str = Field(description="SHA-256 hash of the source document")
    sourcePage: Optional[int] = Field(default=None, description="1-based page number")
    sourceSection: Optional[str] = Field(default=None, description="Heading or section identifier")
    extractionMethod: str = Field(description="Extractor technique, e.g. pymupdf-text-layout")
    extractorVersion: str = Field(description="Version of extractor tool")
    origin: ProvenanceOrigin = Field(description="Origin classification")
    confidence: ProvenanceConfidence = Field(description="Confidence rating")
    generatorVersion: Optional[str] = Field(default=None, description="Version of generator if origin is generated")

class SourceDocumentManifestItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sourceId: str
    relativePath: str
    fileName: str
    fileType: str = "pdf"
    fileSize: int
    sha256: str
    status: DocumentStatus
    extractor: str
    extractorVersion: str
    pageCount: int
    textExtractable: bool
    extractionStatus: str
    validationStatus: DocumentStatus
    isDuplicate: bool = False
    duplicateOf: Optional[str] = None
    warnings: List[str] = Field(default_factory=list)

class SourceManifest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schemaVersion: str = "1.0.0"
    generator: str = "engineering-guides-foundation"
    generatorVersion: str = "1.0.0"
    documentCount: int
    uniqueHashCount: int
    totalSizeBytes: int
    documents: List[SourceDocumentManifestItem]

class TextBlock(BaseModel):
    model_config = ConfigDict(extra="forbid")
    blockIndex: int
    blockType: str = Field(description="heading, paragraph, list, table, formula, code")
    text: str
    bbox: Optional[List[float]] = Field(default=None, description="[x0, y0, x1, y1] coordinates")
    pageNumber: int
    confidence: ProvenanceConfidence = ProvenanceConfidence.EXACT

class PageIR(BaseModel):
    model_config = ConfigDict(extra="forbid")
    pageNumber: int
    width: float
    height: float
    textExtractable: bool
    charCount: int
    blocks: List[TextBlock] = Field(default_factory=list)

class DocumentIR(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schemaVersion: str = "1.0.0"
    sourceId: str
    relativePath: str
    sha256: str
    pageCount: int
    metadata: Dict[str, Any] = Field(default_factory=dict)
    pages: List[PageIR]
    provenance: Provenance

class ProjectSignal(BaseModel):
    model_config = ConfigDict(extra="forbid")
    signalId: str
    sourceId: str
    rawMarker: str
    titleGuess: str
    pageNumber: int
    startBlockIndex: int
    detectionMethod: str
    confidence: ProvenanceConfidence
    provenance: Provenance

class PriceSnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid")
    amount: Optional[float] = Field(default=None, description="Price amount in target currency, or null if unverified")
    currency: str = "USD"
    supplier: Optional[str] = None
    sourceUrl: Optional[str] = None
    retrievedAt: Optional[str] = None
    provider: str = "none"
    confidence: ProvenanceConfidence = ProvenanceConfidence.NEEDS_REVIEW
    availability: Optional[str] = None
    shippingStatus: Optional[str] = None
    taxStatus: Optional[str] = None
    status: PriceStatus = PriceStatus.UNVERIFIED

class BOMItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    itemId: str
    component: str
    manufacturer: Optional[str] = None
    partNumber: Optional[str] = None
    quantity: str = "1"
    unit: Optional[str] = "pcs"
    specs: Optional[str] = None
    source: str
    sourcePage: Optional[int] = None
    notes: Optional[str] = None
    priceSnapshot: PriceSnapshot
    provenance: Provenance

class AssetEntity(BaseModel):
    model_config = ConfigDict(extra="forbid")
    assetId: str
    sourcePath: str
    type: AssetType
    format: str
    sizeBytes: int
    sha256: str
    classification: AssetClassification
    validationStatus: DocumentStatus
    provenance: Provenance
