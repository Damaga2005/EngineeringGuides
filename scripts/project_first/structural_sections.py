"""
Structural (real-heading) technical section extractor.

Forensic Closure P02.3 fixed fabrication and catalog dependency, but its
section extractor still matched a single, decontextualized IR block per
generic keyword (e.g. "build" -> any block containing that substring
anywhere on the page). The result was 100% literal but frequently
incoherent: a mid-sentence fragment, a page footer, or an unrelated line.

This module instead locates the REAL structural headings that literally
exist in the source documents - "// why this matters", "How It Works",
"// build steps", "// interview questions", "What this proves to a
recruiter:", "-> The job this maps to:", and safety callout boxes - and
captures the COMPLETE, COHERENT, literal multi-block span between one
heading and the next. It never rewrites, truncates or normalizes any
block's text; it only chooses which contiguous literal blocks belong
together, exactly as boundaries.py already does for project spans.

Known limitation (disclosed, not silently patched over): some source pages
use a two-column layout where two heading blocks appear back-to-back with
no body block between them (e.g. "// build steps" immediately followed by
"// interview questions"). In that case the two sections' true bodies are
interleaved in extraction order. This module resolves the one recurring
instance of that pattern (build steps vs. interview questions, distinguished
by interview-question lines literally ending in the source document's own
"->" arrow glyph) and otherwise still includes the shared span in both
neighbouring headings' NEXT real section rather than silently dropping it.
"""

import re
from typing import List, Dict, Any, Optional, Tuple

from scripts.foundation.models import Provenance, ProvenanceOrigin, ProvenanceConfidence
from scripts.project_first.models import EvidenceBlock, TechnicalSection, ContentStatus
from scripts.project_first.ids import generate_evidence_id

# Real section headings that appear as their OWN block in the source IR.
# Matching is case-insensitive against the block text after stripping a
# leading "//" marker (both "// why this matters" and standalone "Why This
# Matters" heading styles are used across the 31 guides).
REAL_SECTION_HEADINGS: List[Tuple[str, str, int, str]] = [
    (r'^why this matters\b', 'whatIsItFor', 3, '3. ¿Para qué sirve?'),
    (r'^how it works\b', 'operation', 12, '12. Principio de funcionamiento físico/lógico'),
    (r'^key design decisions\b', 'architecture', 5, '5. Arquitectura del sistema'),
    (r'^build steps\b', 'assembly', 13, '13. Ensamblaje e integración paso a paso'),
    (r'^interview questions\b', 'interviewPrep', 19, '19. Preparación para entrevistas técnicas'),
]

# Headings that are real structural markers (they DO delimit spans) but do
# not get their own TechnicalSection, because their content is already
# represented as real structured data elsewhere (the BOM table).
BOUNDARY_ONLY_HEADINGS = [r'^bill of materials\b']

RECRUITER_OR_JOB_PATTERN = re.compile(r'what this proves to a recruiter|the job this maps to', re.IGNORECASE)
SAFETY_CALLOUT_PATTERN = re.compile(r'^!\s*\n', re.IGNORECASE)
SAFETY_INLINE_PATTERN = re.compile(r'^safety\s*:', re.IGNORECASE)


def _strip_heading_prefix(text: str) -> str:
    t = text.strip()
    if t.startswith('//'):
        t = t[2:].strip()
    return t


def _heading_match(text: str) -> Optional[Tuple[str, Optional[int], Optional[str]]]:
    """Return (key, sectionIndex, title) for a real section heading,
    ('BOUNDARY', None, None) for a boundary-only heading, or None."""
    t = _strip_heading_prefix(text).lower()
    for pattern in BOUNDARY_ONLY_HEADINGS:
        if re.match(pattern, t):
            return ('BOUNDARY', None, None)
    for pattern, key, idx, title in REAL_SECTION_HEADINGS:
        if re.match(pattern, t):
            return (key, idx, title)
    return None


def is_boilerplate_block(text: str) -> bool:
    """
    Identify running page furniture and BOM table fragments that are real
    literal content but do not belong in a narrative section: repeated
    per-page footers/headers, and BOM table header/rows (already
    represented as real structured data in the project's `bom` field).
    The block itself is NEVER altered - it is simply excluded from THIS
    particular concatenated span.
    """
    t = text.strip()
    if not t:
        return True
    if 'field guide' in t.lower() and re.search(r'\d+\s*/\s*\d+', t):
        return True  # e.g. "... a Build List field guide\n2 / 18"
    if t.upper().startswith('COMPONENT') and 'QTY' in t.upper():
        return True  # BOM table header row
    if t.count('\n') >= 2 and re.search(r'[~$]\d', t):
        return True  # BOM table data row ("Name\nSpec\nQty\n$Cost")
    return False


def _build_section(
    blocks: List[Dict[str, Any]],
    guide_id: str,
    source_hash: str,
    key: str,
    section_index: int,
    title: str,
) -> Optional[TechnicalSection]:
    kept = [
        b for b in blocks
        if not is_boilerplate_block(b.get('text', ''))
        and _heading_match(b.get('text', '')) is None
    ]
    if not kept:
        return None

    literal_text = "\n\n".join(b['text'] for b in kept)
    ev_blocks = []
    for b in kept:
        ev_blocks.append(EvidenceBlock(
            evidenceId=generate_evidence_id(guide_id, b['pageNumber'], b['blockIndex']),
            sourceDocumentId=guide_id,
            pageNumber=b['pageNumber'],
            blockIndex=b['blockIndex'],
            textSnippet=b['text'],
            bbox=b.get('bbox'),
            sourceHash=source_hash,
            claim=title,
        ))
    prov = Provenance(
        source=guide_id,
        sourcePath="",
        sourceHash=source_hash,
        sourcePage=kept[0]['pageNumber'],
        sourceSection=title,
        extractionMethod="forensic-structural-heading-matcher-v2.4",
        extractorVersion="2.4.0",
        origin=ProvenanceOrigin.EXTRACTED,
        confidence=ProvenanceConfidence.EXACT,
    )
    return TechnicalSection(
        sectionIndex=section_index,
        title=title,
        sourceText=literal_text,
        derivedExplanation=None,
        status=ContentStatus.SOURCE,
        derivedFrom=[ev.evidenceId for ev in ev_blocks],
        evidenceBlocks=ev_blocks,
        provenance=prov,
    )


def trim_trailing_next_project_teaser(blocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Several guides print the NEXT project's "What this proves to a
    recruiter" / "The job this maps to" / safety-callout teaser at the
    BOTTOM of the CURRENT project's last page, immediately before the next
    project's own title marker. Because boundary discovery has no marker to
    delimit this teaser, it is otherwise silently absorbed into the current
    project's block range and misattributed (e.g. an optics project's
    "careerRelevance" section ends up describing an unrelated HUD project).

    If a "what this proves to a recruiter" block appears within the tail of
    this project's block range, and no other real structural heading (why
    this matters / how it works / build steps / interview questions)
    follows it, the teaser and everything after it is trimmed off - it does
    not belong to this project, and there is no reliable marker to instead
    attribute it forward to whichever project follows.
    """
    trigger_idx = None
    for idx, b in enumerate(blocks):
        if RECRUITER_OR_JOB_PATTERN.search(b.get('text', '')):
            trigger_idx = idx
            break  # first occurrence only - a legitimate mid-project one, if any, is rare and kept
    if trigger_idx is None:
        return blocks

    tail = blocks[trigger_idx:]
    for b in tail:
        if _heading_match(b.get('text', '')) not in (None, ('BOUNDARY', None, None)):
            return blocks  # a real heading follows: this project genuinely continues past the trigger

    return blocks[:trigger_idx]


def extract_structural_sections(
    project_ir_blocks: List[Dict[str, Any]],
    guide_id: str,
    source_hash: str,
) -> Dict[str, TechnicalSection]:
    """
    Returns a dict of {detailedExplanation_key: TechnicalSection} built from
    the document's own real structural headings. Keys not present in the
    result had no recognizable real heading for this project and should
    fall back to the caller's weaker keyword-based matcher (or remain
    NOT_DOCUMENTED).
    """
    result: Dict[str, TechnicalSection] = {}
    if not project_ir_blocks:
        return result

    heading_positions = []  # (index, key, sectionIndex, title)
    for idx, b in enumerate(project_ir_blocks):
        m = _heading_match(b.get('text', ''))
        if m:
            heading_positions.append((idx,) + m)

    # 1. Overview: from just after the project's own title marker (index 0
    # of project_ir_blocks, which callers align to boundary.startBlock) up
    # to the first recognized heading of any kind.
    first_any_idx = heading_positions[0][0] if heading_positions else len(project_ir_blocks)
    overview = _build_section(
        project_ir_blocks[1:first_any_idx], guide_id, source_hash,
        'overview', 1, '1. Descripción general'
    )
    if overview:
        result['overview'] = overview

    real_headings = [h for h in heading_positions if h[1] != 'BOUNDARY']

    skip_next = False
    for i, (idx, key, sec_idx, title) in enumerate(real_headings):
        if skip_next:
            skip_next = False
            continue

        end_idx = real_headings[i + 1][0] if i + 1 < len(real_headings) else len(project_ir_blocks)
        span = project_ir_blocks[idx + 1:end_idx]

        if not span and i + 1 < len(real_headings):
            # Two-column layout artifact: this heading is immediately
            # followed by another real heading with zero body blocks
            # between them. Known recurring case: "build steps" directly
            # followed by "interview questions" - split the SHARED
            # following span using the source's own "->" arrow glyph,
            # which the interview-question lines literally end with.
            next_key = real_headings[i + 1][1]
            shared_end = real_headings[i + 2][0] if i + 2 < len(real_headings) else len(project_ir_blocks)
            shared = project_ir_blocks[real_headings[i + 1][0] + 1:shared_end]
            if key == 'assembly' and next_key == 'interviewPrep':
                interview_blocks = [b for b in shared if b.get('text', '').rstrip().endswith('→')]
                other_blocks = [b for b in shared if not b.get('text', '').rstrip().endswith('→')]
                sec = _build_section(other_blocks, guide_id, source_hash, key, sec_idx, title)
                if sec:
                    result[key] = sec
                sec2 = _build_section(
                    interview_blocks, guide_id, source_hash,
                    next_key, real_headings[i + 1][2], real_headings[i + 1][3]
                )
                if sec2:
                    result[next_key] = sec2
                skip_next = True
                continue
            # Unknown adjacent-heading pair: fall through to the general
            # case below (assign the whole shared span to THIS heading;
            # the next heading may still recover a non-empty span against
            # whatever follows it).
            span = shared

        section = _build_section(span, guide_id, source_hash, key, sec_idx, title)
        if section:
            result[key] = section

    # 2. Inline overlays that live inside a content block rather than their
    # own heading block: recruiter-proof / job-mapping, and safety callouts.
    for idx, b in enumerate(project_ir_blocks):
        text = b.get('text', '')
        if 'careerRelevance' not in result and RECRUITER_OR_JOB_PATTERN.search(text):
            end = idx + 1
            max_end = min(idx + 4, len(project_ir_blocks))
            while end < max_end and not _heading_match(project_ir_blocks[end].get('text', '')):
                end += 1
            sec = _build_section(
                project_ir_blocks[idx:end], guide_id, source_hash,
                'careerRelevance', 20, '20. Relevancia profesional (qué demuestra y a qué puesto aplica)'
            )
            if sec:
                result['careerRelevance'] = sec

        if 'safety' not in result and (
            SAFETY_CALLOUT_PATTERN.match(text.strip()) or SAFETY_INLINE_PATTERN.match(text.strip())
        ):
            end = idx + 1
            max_end = min(idx + 4, len(project_ir_blocks))
            while end < max_end and not _heading_match(project_ir_blocks[end].get('text', '')):
                end += 1
            sec = _build_section(
                project_ir_blocks[idx:end], guide_id, source_hash,
                'safety', 17, '17. Seguridad técnica y precauciones operativas'
            )
            if sec:
                result['safety'] = sec

    return result
