"""
Formal Pydantic Data Models for Project-First Architecture (Prompt 02 & Prompt 02.1).
Ensures strict validation, evidence-level provenance, zero-fabrication guarantees,
and deterministic serialization.
"""

from enum import Enum
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field, ConfigDict

from scripts.foundation.models import (
    ProvenanceOrigin,
    ProvenanceConfidence,
    Provenance,
    DocumentStatus,
    BOMItem,
    PriceStatus,
)


class ContentStatus(str, Enum):
    SOURCE = "SOURCE"
    DERIVED = "DERIVED"
    GENERATED = "GENERATED"
    NOT_DOCUMENTED = "NOT_DOCUMENTED"
    UNVERIFIED = "UNVERIFIED"


class DuplicateClassification(str, Enum):
    EXACT_DUPLICATE = "EXACT_DUPLICATE"
    PROBABLE_DUPLICATE = "PROBABLE_DUPLICATE"
    VARIANT = "VARIANT"
    RELATED = "RELATED"
    UNRELATED = "UNRELATED"
    NEEDS_REVIEW = "NEEDS_REVIEW"


class RelationType(str, Enum):
    VARIANT_OF = "VARIANT_OF"
    RELATED_TO = "RELATED_TO"
    DERIVED_FROM = "DERIVED_FROM"
    PREREQUISITE_FOR = "PREREQUISITE_FOR"
    DUPLICATE_OF = "DUPLICATE_OF"
    SHARES_COMPONENTS_WITH = "SHARES_COMPONENTS_WITH"
    SHARES_FIRMWARE_WITH = "SHARES_FIRMWARE_WITH"


class BoundaryReconciliationStatus(str, Enum):
    MATCH = "MATCH"
    PARTIAL_MATCH = "PARTIAL_MATCH"
    BOUNDARY_MISMATCH = "BOUNDARY_MISMATCH"
    MISSING_IN_IR = "MISSING_IN_IR"
    MISSING_IN_CATALOG = "MISSING_IN_CATALOG"
    NEEDS_REVIEW = "NEEDS_REVIEW"


class EvidenceBlock(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sourceDocumentId: str = Field(description="e.g. guide-001")
    pageNumber: int = Field(description="1-based page number in source PDF")
    blockIndex: int = Field(description="0-based block index within Document IR page")
    textSnippet: str = Field(description="Literal text extracted from the block")
    bbox: Optional[List[float]] = Field(default=None, description="[x0, y0, x1, y1] bounding box in PDF points")
    sourceHash: str = Field(description="SHA-256 of the source PDF")
    claim: Optional[str] = Field(default=None, description="What this evidence supports")


class ProjectBoundary(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sourceDocumentId: str = Field(description="e.g. guide-001")
    projectNumber: int = Field(description="1-based project sequence number in the document")
    titleHint: Optional[str] = Field(default=None, description="Title detected in heading/block")
    startPage: int = Field(description="Starting page number (1-based)")
    startBlock: int = Field(description="Starting block index on startPage")
    endPage: int = Field(description="Ending page number (1-based)")
    endBlock: int = Field(description="Ending block index on endPage")
    detectionMethod: str = Field(description="e.g. ir_heading_marker, ir_title_pattern, layout_continuity")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    evidenceBlocks: List[EvidenceBlock] = Field(default_factory=list)


class BoundaryReconciliationRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")
    projectId: str
    guideId: str
    projectNumber: int
    catalogTitle: str
    irTitle: Optional[str] = None
    catalogPageRange: List[int]
    irPageRange: List[int]
    status: BoundaryReconciliationStatus
    discrepancyNote: Optional[str] = None


class TechnicalIdentity(BaseModel):
    model_config = ConfigDict(extra="forbid")
    controller: Optional[str] = Field(default=None, description="Normalized main MCU/SoC, e.g., ESP32, STM32F4")
    controllerFamily: Optional[str] = Field(default=None, description="Controller family e.g. ESP32, ARM Cortex, AVR")
    sensors: List[str] = Field(default_factory=list, description="Sensors utilized")
    actuators: List[str] = Field(default_factory=list, description="Actuators utilized (motors, servos, relays)")
    communications: List[str] = Field(default_factory=list, description="Protocols and interfaces: SPI, I2C, UART, LoRa, BLE, WiFi")
    power: Optional[str] = Field(default=None, description="Operating voltage and power source requirements")
    firmware: Optional[str] = Field(default=None, description="Language/runtime, e.g. C/C++, MicroPython, FreeRTOS, Arduino")
    majorComponents: List[str] = Field(default_factory=list, description="Key ICs, modules or passive networks")
    architecture: Optional[str] = Field(default=None, description="System topology, e.g. edge-node, closed-loop controller")
    function: Optional[str] = Field(default=None, description="Primary engineering domain function")
    constraints: List[str] = Field(default_factory=list, description="Known physical, timing or electrical constraints")


class ProjectDescription(BaseModel):
    model_config = ConfigDict(extra="forbid")
    whatIsIt: str = Field(description="¿Qué es?: Definición concisa y fiel del sistema respaldada por evidencia")
    whatDoesItDo: str = Field(description="¿Qué hace?: Descripción técnica operativa respaldada por evidencia")
    purpose: str = Field(description="¿Para qué sirve?: Propósito y casos de uso respaldados por evidencia")
    objective: Optional[str] = Field(default=None, description="¿Cuál es su objetivo?")
    technologies: List[str] = Field(default_factory=list, description="¿Qué tecnología utiliza?")
    summary: str = Field(description="Resumen técnico integrado")


class TechnicalSection(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sectionIndex: int
    title: str
    sourceText: Optional[str] = Field(default=None, description="Texto literal exacto extraído de Document IR o None")
    derivedExplanation: Optional[str] = Field(default=None, description="Explicación técnica fundamentada en evidencia o None")
    status: ContentStatus = Field(default=ContentStatus.SOURCE)
    evidenceBlocks: List[EvidenceBlock] = Field(default_factory=list)
    provenance: Optional[Provenance] = None


class DetailedExplanation(BaseModel):
    model_config = ConfigDict(extra="forbid")
    overview: Optional[TechnicalSection] = None
    whatDoesItDo: Optional[TechnicalSection] = None
    whatIsItFor: Optional[TechnicalSection] = None
    objective: Optional[TechnicalSection] = None
    architecture: Optional[TechnicalSection] = None
    operation: Optional[TechnicalSection] = None
    hardware: Optional[TechnicalSection] = None
    components: Optional[TechnicalSection] = None
    connections: Optional[TechnicalSection] = None
    power: Optional[TechnicalSection] = None
    firmware: Optional[TechnicalSection] = None
    configuration: Optional[TechnicalSection] = None
    assembly: Optional[TechnicalSection] = None
    commissioning: Optional[TechnicalSection] = None
    usage: Optional[TechnicalSection] = None
    limitations: Optional[TechnicalSection] = None
    safety: Optional[TechnicalSection] = None
    sources: Optional[TechnicalSection] = None


class ProjectSource(BaseModel):
    model_config = ConfigDict(extra="forbid")
    projectSourceId: str = Field(description="Deterministic ID for this occurrence")
    projectId: str = Field(description="ID of the extracted Project")
    sourceDocumentId: str = Field(description="e.g. guide-001")
    sourcePath: str = Field(description="Repository path to the source PDF")
    sourceHash: str = Field(description="SHA-256 hash of the source PDF")
    pageRange: List[int] = Field(description="[startPage, endPage] bounds in source PDF")
    sectionTitle: Optional[str] = None
    isPrimary: bool = True
    confidence: ProvenanceConfidence = ProvenanceConfidence.EXACT
    evidenceBlocks: List[EvidenceBlock] = Field(default_factory=list)


class ProjectBOMItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    specs: Optional[str] = None
    qty: int = 1
    cost: Optional[str] = None
    category: Optional[str] = None
    designator: Optional[str] = None
    value: Optional[str] = None
    manufacturer: Optional[str] = None
    partNumber: Optional[str] = None
    supplier: Optional[str] = None
    unitPriceUsd: Optional[float] = None
    priceStatus: PriceStatus = PriceStatus.UNVERIFIED
    notes: Optional[str] = None
    provenance: Optional[Provenance] = None
    evidenceBlocks: List[EvidenceBlock] = Field(default_factory=list)


class Project(BaseModel):
    model_config = ConfigDict(extra="forbid")
    projectId: str = Field(description="Deterministic ID: proj-{sha256[:16]}")
    slug: str = Field(description="Deterministic human-friendly URL slug")
    title: str = Field(description="Canonical title of the project")
    projectNumber: int = Field(description="Sequence number within the guide")
    guideId: str = Field(description="Primary source guide ID e.g. guide-001")
    guideTitle: str = Field(description="Title of the source guide")
    sourceDocumentId: str = Field(description="e.g. guide-001")
    sourcePageRange: str = Field(description="e.g. 2-4")
    relativePath: str = Field(description="Path to PDF")
    technicalIdentity: TechnicalIdentity
    description: ProjectDescription
    detailedExplanation: DetailedExplanation
    bom: List[ProjectBOMItem] = Field(default_factory=list)
    firmwareCode: Optional[str] = Field(default=None, description="Firmware snippet or reference")
    firmwareLanguage: Optional[str] = Field(default=None)
    schematicSvg: Optional[str] = Field(default=None, description="Path to project schematic SVG")
    blueprintImage: Optional[str] = Field(default=None, description="Path to blueprint or photo")
    difficulty: Optional[str] = None
    timeEstimate: Optional[str] = None
    provenance: Provenance
    sources: List[ProjectSource] = Field(default_factory=list)
    boundary: Optional[ProjectBoundary] = None


class DuplicateCandidate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    candidateId: str = Field(description="cand-{sha256[:16]}")
    projectAId: str
    projectBId: str
    similarityScore: float = Field(ge=0.0, le=1.0)
    classification: DuplicateClassification
    matchEvidence: List[str] = Field(default_factory=list)
    conflictEvidence: List[str] = Field(default_factory=list)
    evaluatedSignals: Dict[str, Any] = Field(default_factory=dict)
    identityEvidence: List[str] = Field(default_factory=list)
    similarityEvidence: List[str] = Field(default_factory=list)


class ConflictRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")
    conflictId: str
    fieldPath: str
    valueA: Any
    valueB: Any
    sourceAId: str
    sourceBId: str
    resolution: str = "NEEDS_REVIEW"


class ProjectVariant(BaseModel):
    model_config = ConfigDict(extra="forbid")
    variantId: str
    projectId: str
    variantType: str
    differences: Dict[str, Any]


class CanonicalProject(BaseModel):
    model_config = ConfigDict(extra="forbid")
    canonicalProjectId: str = Field(description="cproj-{sha256[:16]}")
    canonicalSlug: str
    preferredTitle: str
    projectIds: List[str] = Field(description="All merged Project IDs belonging to this entity")
    variantIds: List[str] = Field(default_factory=list)
    technicalIdentity: TechnicalIdentity
    canonicalDescription: ProjectDescription
    consolidatedBOM: List[ProjectBOMItem] = Field(default_factory=list)
    firmwareSnippets: List[Dict[str, str]] = Field(default_factory=list)
    schematicSvg: Optional[str] = None
    blueprintImage: Optional[str] = None
    sources: List[ProjectSource] = Field(default_factory=list)
    conflictRecords: List[ConflictRecord] = Field(default_factory=list)


class ProjectRelation(BaseModel):
    model_config = ConfigDict(extra="forbid")
    relationId: str = Field(description="rel-{sha256[:16]}")
    sourceProjectId: str
    targetProjectId: str
    relationType: RelationType
    description: str
    confidence: float = 1.0


class ProjectCatalog(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schemaVersion: str = "2.1.0"
    generatedAt: str
    totalProjects: int
    projects: List[Project]
    metadata: Dict[str, Any] = Field(default_factory=dict)