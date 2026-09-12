"""
Formal Pydantic Data Models for Project-First Architecture (Prompt 02).
Ensures strict validation, deterministic serialization, and end-to-end provenance.
"""

from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict

from scripts.foundation.models import (
    ProvenanceOrigin,
    ProvenanceConfidence,
    Provenance,
    DocumentStatus,
    BOMItem,
    PriceStatus,
)


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
    whatIsIt: str = Field(description="¿Qué es?: Definición concisa y fiel del sistema")
    whatDoesItDo: str = Field(description="¿Qué hace?: Descripción técnica operativa")
    purpose: str = Field(description="¿Para qué sirve?: Propósito y casos de uso en el mundo real")
    objective: Optional[str] = Field(default=None, description="¿Cuál es su objetivo?")
    technologies: List[str] = Field(default_factory=list, description="¿Qué tecnología utiliza?")
    summary: str = Field(description="Resumen técnico integrado")


class TechnicalSection(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sectionIndex: int
    title: str
    sourceText: str = Field(description="Texto fuente original o cita directa textual")
    derivedExplanation: str = Field(description="Explicación técnica derivada y estructurada")
    provenance: Provenance


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
    sourceHash: str = Field(description="SHA-256 of the source document")
    pageStart: int
    pageEnd: int
    sections: List[str] = Field(default_factory=list)
    evidenceBlocks: List[int] = Field(default_factory=list, description="IR block indices containing source evidence")
    extractionMethod: str = "project-boundary-detector-v1"
    extractorVersion: str = "1.0.0"
    confidence: ProvenanceConfidence = ProvenanceConfidence.EXACT



class ProjectBOMItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    itemNumber: int = Field(default=1)
    componentName: str = Field(description="Nombre del componente")
    quantity: int = Field(default=1)
    designator: Optional[str] = None
    value: Optional[str] = None
    manufacturer: Optional[str] = None
    partNumber: Optional[str] = None
    supplier: Optional[str] = None
    unitPriceUsd: Optional[float] = None
    priceStatus: PriceStatus = PriceStatus.UNVERIFIED
    notes: Optional[str] = None
    provenance: Optional[Provenance] = None


class ConflictRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")
    conflictId: str
    field: str
    sourceAId: str
    sourceBId: str
    sourceAValue: Any
    sourceBValue: Any
    status: str = "NEEDS_REVIEW"
    notes: str
    provenance: Provenance


class Project(BaseModel):
    model_config = ConfigDict(extra="forbid")
    projectId: str = Field(description="Deterministic Project ID, e.g. proj-...")
    slug: str = Field(description="URL-safe unique slug")
    title: str = Field(description="Technical project title")
    projectNumber: int = Field(description="1-based index within the source guide")
    guideId: str = Field(description="Source guide ID, e.g. guide-001")
    guideTitle: str = Field(description="Title of containing guide")
    sourceDocumentId: str = Field(description="Source document ID")
    relativePath: str = Field(description="Relative path to source document")
    sourcePageRange: List[int] = Field(description="[start_page, end_page]")
    description: ProjectDescription
    detailedExplanation: DetailedExplanation
    technicalIdentity: TechnicalIdentity
    bom: List[ProjectBOMItem] = Field(default_factory=list)
    schematicSvg: Optional[str] = Field(default=None, description="Path to project schematic SVG")
    blueprintImage: Optional[str] = Field(default=None, description="Path to blueprint or photo")
    firmwareCode: Optional[str] = Field(default=None, description="Firmware snippet or reference")
    firmwareLanguage: Optional[str] = Field(default=None)
    timeEstimate: str = Field(default="1-2 semanas")
    difficulty: str = Field(default="Intermedio")
    sources: List[ProjectSource] = Field(default_factory=list)
    provenance: Provenance


class ProjectVariant(BaseModel):
    model_config = ConfigDict(extra="forbid")
    variantId: str
    canonicalProjectId: str
    variantTitle: str
    differences: Dict[str, Any] = Field(description="Documented technical deltas: MCU, sensor, etc.")
    sourceProjectId: str
    provenance: Provenance


class DuplicateCandidate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    candidateId: str
    projectAId: str
    projectBId: str
    projectATitle: str
    projectBTitle: str
    score: float = Field(ge=0.0, le=1.0)
    signals: Dict[str, float] = Field(description="Individual signal scores: title, controller, bom, text")
    classification: DuplicateClassification
    confidence: ProvenanceConfidence
    reasoning: str
    provenance: Provenance


class ProjectRelation(BaseModel):
    model_config = ConfigDict(extra="forbid")
    relationId: str
    sourceProjectId: str
    targetProjectId: str
    relationType: RelationType
    description: str
    confidence: ProvenanceConfidence = ProvenanceConfidence.EXACT
    provenance: Provenance


class CanonicalProject(BaseModel):
    model_config = ConfigDict(extra="forbid")
    canonicalProjectId: str
    slug: str
    canonicalTitle: str
    memberProjectIds: List[str] = Field(description="List of Project IDs grouped under this canonical identity")
    projectSources: List[ProjectSource] = Field(description="All documentary occurrences preserving provenance")
    technicalIdentity: TechnicalIdentity
    reconciledDescription: ProjectDescription
    reconciledExplanation: DetailedExplanation
    reconciledBom: List[ProjectBOMItem] = Field(default_factory=list)
    schematicSvg: Optional[str] = None
    blueprintImage: Optional[str] = None
    conflicts: List[ConflictRecord] = Field(default_factory=list)
    variants: List[ProjectVariant] = Field(default_factory=list)
    relations: List[ProjectRelation] = Field(default_factory=list)
    provenance: Provenance


class ProjectCatalog(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schemaVersion: str = "2.0.0"
    generator: str = "engineering-guides-project-first"
    generatorVersion: str = "1.0.0"
    totalProjects: int
    totalCanonicalProjects: int
    totalVariants: int
    totalDuplicateCandidates: int
    totalRelations: int
    projects: List[Project]
    canonicalProjects: List[CanonicalProject]
    duplicateCandidates: List[DuplicateCandidate]
    relations: List[ProjectRelation]
