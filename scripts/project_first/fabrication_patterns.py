"""
Single source of truth for banned synthetic/fabricated phrase detection
(Prompt 02.3, Section 2 & 18). Every validator, audit generator and test
MUST import this list rather than maintaining its own copy - a banned
phrase absent from one checker and present in another is exactly how
P02.2 falsely certified PASS while fabricated text shipped to production.
"""

from typing import List

BANNED_FABRICATION_PHRASES: List[str] = [
    "Información técnica estructurada",
    "Pendiente de verificación",
    "Placeholder",
    "Lorem ipsum",
    "Continuidad de layout en pág",
    "Adquiere variables y ejecuta control",
    "Procesa señales y ejecuta la función",
    "Aplicación práctica y despliegue en",
    "Sistema de ingeniería aplicada",
    "Implementación y validación técnica de",
    "Análisis técnico fundado",
    "Subsistema documentado",
    "Adquiere variables",
    "Procesa señales",
    "Aplicación práctica",
]

# Structural truncation/synthesis markers that must never appear inside a
# literal sourceText value, regardless of surrounding wording.
TRUNCATION_MARKERS: List[str] = [
    "...",
]


def find_banned_phrase(text: str) -> str:
    """Return the first banned phrase found in text (case-insensitive), or ''."""
    if not text:
        return ""
    lower = text.lower()
    for phrase in BANNED_FABRICATION_PHRASES:
        if phrase.lower() in lower:
            return phrase
    return ""
