"""
Golden Dataset for Project-First Architecture Verification (Prompt 02).
Contains controlled calibration cases for 1, 5, 20 projects, and anti-false-merge benchmarks.
"""

# Benchmark 1: Controlled 1-project case
GOLDEN_1_PROJECT = {
    "sourceDocumentId": "guide-001",
    "projectNumber": 1,
    "expectedTitle": "Digital Night-Vision Monocular",
    "expectedController": None,
    "expectedPageStart": 1,
    "minActiveSections": 15
}

# Benchmark 5: Controlled 5-project cases across diverse domains
GOLDEN_5_PROJECTS = [
    {"guideId": "guide-001", "pNum": 1, "title": "Digital Night-Vision Monocular"},
    {"guideId": "guide-002", "pNum": 1, "title": "Indoor Position Hold (Optical Flow + ToF)"},
    {"guideId": "guide-003", "pNum": 1, "title": "Cold-Gas Reaction Thruster"},
    {"guideId": "guide-004", "pNum": 1, "title": "ADS-B Aircraft Radar"},
    {"guideId": "guide-005", "pNum": 1, "title": "Closed-Loop Stepper Controller"},
]

# Benchmark Anti-False-Merge: Cases that must NEVER merge
FALSE_MERGE_BENCHMARKS = [
    {
        "case": "Same MCU (ESP32) but completely different functions (Night-Vision vs Satellite)",
        "projectA": {"title": "Digital Night-Vision Monocular", "mcu": "ESP32", "function": "Vision"},
        "projectB": {"title": "Auto-Tracking Ground Station", "mcu": "ESP32", "function": "Aerospace"},
        "expectedClassification": "UNRELATED"
    },
    {
        "case": "Same Sensors (BME280) but different domain and architecture",
        "projectA": {"title": "Solar Perimeter Sentry Tower", "sensors": ["BME280"]},
        "projectB": {"title": "Cold-Gas Reaction Thruster", "sensors": ["BME280"]},
        "expectedClassification": "UNRELATED"
    }
]
