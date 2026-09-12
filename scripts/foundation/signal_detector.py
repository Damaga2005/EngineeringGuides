"""
Preliminary Project Signal Detector.
Complies with Prompt 01 Section 16 & Section 22.
Detects candidate project boundaries without premature canonicalization.
"""

import re
from typing import List
from scripts.foundation.models import (
    DocumentIR,
    ProjectSignal,
    Provenance,
    ProvenanceOrigin,
    ProvenanceConfidence
)

SIGNAL_REGEX = re.compile(
    r"^(PROJECT\s*#?\s*\d+|PART\s*#?\s*\d+|BUILD\s*#?\s*\d+|NODE\s*#?\s*\d+|MODULE\s*#?\s*\d+)",
    re.IGNORECASE
)

def detect_project_signals(doc_ir: DocumentIR) -> List[ProjectSignal]:
    """
    Scan Document IR blocks to find preliminary project boundaries.
    Does NOT deduplicate or canonicalize (reserved for Prompt 02).
    """
    signals: List[ProjectSignal] = []
    sig_count = 0

    for page in doc_ir.pages:
        for block in page.blocks:
            lines = [ln.strip() for ln in block.text.splitlines() if ln.strip()]
            for line in lines:
                m = SIGNAL_REGEX.match(line)
                if m:
                    sig_count += 1
                    raw_marker = m.group(1).upper()
                    # Guess title from remainder of line or first 60 chars
                    remainder = line[m.end():].strip(" :-–—")
                    title_guess = remainder if len(remainder) > 3 else line[:60]

                    conf = ProvenanceConfidence.EXACT if block.blockType == "project_boundary_heading" else ProvenanceConfidence.HEURISTIC

                    prov = Provenance(
                        source=doc_ir.sourceId,
                        sourcePath=doc_ir.relativePath,
                        sourceHash=doc_ir.sha256,
                        sourcePage=page.pageNumber,
                        sourceSection=raw_marker,
                        extractionMethod="regex-boundary-signal-v1",
                        extractorVersion="1.0.0",
                        origin=ProvenanceOrigin.EXTRACTED,
                        confidence=conf
                    )

                    signals.append(ProjectSignal(
                        signalId=f"{doc_ir.sourceId}-sig-{sig_count:02d}",
                        sourceId=doc_ir.sourceId,
                        rawMarker=raw_marker,
                        titleGuess=title_guess,
                        pageNumber=page.pageNumber,
                        startBlockIndex=block.blockIndex,
                        detectionMethod="regex-boundary-signal-v1",
                        confidence=conf,
                        provenance=prov
                    ))

    return signals
