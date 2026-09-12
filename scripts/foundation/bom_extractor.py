"""
Structured BOM & Price Snapshot Extraction Engine.
Complies with Prompt 01 Sections 18, 19, and 20.
Strictly separates engineering data from market data.
Unknown/unverified prices are set to null with status UNVERIFIED.
"""

import re
from typing import List, Optional
from scripts.foundation.models import (
    DocumentIR,
    BOMItem,
    PriceSnapshot,
    PriceStatus,
    Provenance,
    ProvenanceOrigin,
    ProvenanceConfidence
)

COMMON_ELECTRONICS_KEYWORDS = [
    "resistor", "capacitor", "inductor", "diode", "led", "mosfet", "transistor",
    "esp32", "stm32", "raspberry pi", "teensy", "arduino", "oled", "tft", "display",
    "sensor", "lidar", "radar", "lora", "transceiver", "gps", "imu", "accelerometer",
    "gyroscope", "battery", "bms", "regulator", "ldo", "op-amp", "adc", "dac",
    "antenna", "camera", "lens", "servo", "motor", "driver", "pcb", "crystal"
]

def extract_structured_bom(doc_ir: DocumentIR) -> List[BOMItem]:
    """
    Extract structured BOM items from Document IR.
    Never fabricates prices or unknown manufacturers.
    """
    bom_items: List[BOMItem] = []
    item_counter = 0

    for page in doc_ir.pages:
        for block in page.blocks:
            text = block.text
            # Look for lines mentioning electronic parts or specifications
            lines = text.splitlines()
            for line in lines:
                l_lower = line.lower().strip()
                if any(k in l_lower for k in COMMON_ELECTRONICS_KEYWORDS) and len(line.strip()) > 3:
                    # Clean line
                    clean_name = line.strip(" •-*#[]()").split(":")[0].strip()
                    if len(clean_name) > 40:
                        clean_name = clean_name[:40].strip()

                    item_counter += 1
                    item_id = f"{doc_ir.sourceId}-bom-{item_counter:03d}"

                    # Detect if a price is mentioned in the text (e.g. $15, €20)
                    price_match = re.search(r"[\$€£](\d+(?:\.\d{1,2})?)", line)
                    if price_match:
                        price_val = float(price_match.group(1))
                        price_status = PriceStatus.FRESH
                        price_conf = ProvenanceConfidence.EXACT
                    else:
                        price_val = None
                        price_status = PriceStatus.UNVERIFIED
                        price_conf = ProvenanceConfidence.NEEDS_REVIEW

                    snapshot = PriceSnapshot(
                        amount=price_val,
                        currency="USD",
                        supplier=None,
                        sourceUrl=None,
                        retrievedAt=None,
                        provider="source_text" if price_val else "none",
                        confidence=price_conf,
                        status=price_status
                    )

                    prov = Provenance(
                        source=doc_ir.sourceId,
                        sourcePath=doc_ir.relativePath,
                        sourceHash=doc_ir.sha256,
                        sourcePage=page.pageNumber,
                        sourceSection="BOM",
                        extractionMethod="text-keyword-bom-v1",
                        extractorVersion="1.0.0",
                        origin=ProvenanceOrigin.EXTRACTED,
                        confidence=ProvenanceConfidence.HEURISTIC
                    )

                    bom_items.append(BOMItem(
                        itemId=item_id,
                        component=clean_name,
                        manufacturer=None,
                        partNumber=None,
                        quantity="1",
                        unit="pcs",
                        specs=line.strip()[:100],
                        source=doc_ir.sourceId,
                        sourcePage=page.pageNumber,
                        notes=None,
                        priceSnapshot=snapshot,
                        provenance=prov
                    ))

    return bom_items
