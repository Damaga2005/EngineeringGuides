import pytest
from scripts.foundation.models import (
    BOMItem,
    PriceSnapshot,
    PriceStatus,
    Provenance,
    ProvenanceOrigin,
    ProvenanceConfidence,
)

def test_bom_no_fabrication_default():
    prov = Provenance(
        source="guide-001",
        sourcePath="Engineering guides/guide-001.pdf",
        sourceHash="abc",
        sourcePage=3,
        extractionMethod="text-layout",
        extractorVersion="1.0.0",
        origin=ProvenanceOrigin.EXTRACTED,
        confidence=ProvenanceConfidence.EXACT
    )
    bom = BOMItem(
        itemId="bom-001",
        partNumber="STM32F405RGT6",
        component="Microcontroller",
        quantity="1",
        source="guide-001",
        sourcePage=3,
        priceSnapshot=PriceSnapshot(amount=None, status=PriceStatus.UNVERIFIED),
        provenance=prov
    )
    assert bom.priceSnapshot.amount is None
    assert bom.priceSnapshot.status == PriceStatus.UNVERIFIED
    assert bom.provenance.confidence == ProvenanceConfidence.EXACT

def test_bom_with_verified_price():
    prov = Provenance(
        source="guide-002",
        sourcePath="Engineering guides/guide-002.pdf",
        sourceHash="def",
        sourcePage=5,
        extractionMethod="text-layout",
        extractorVersion="1.0.0",
        origin=ProvenanceOrigin.EXTRACTED,
        confidence=ProvenanceConfidence.EXACT
    )
    bom = BOMItem(
        itemId="bom-002",
        partNumber="ESP32-WROOM-32E",
        component="WiFi/BLE MCU",
        quantity="2",
        source="guide-002",
        sourcePage=5,
        priceSnapshot=PriceSnapshot(
            amount=3.50,
            currency="USD",
            supplier="Mouser",
            status=PriceStatus.FRESH,
            confidence=ProvenanceConfidence.EXACT
        ),
        provenance=prov
    )
    assert bom.priceSnapshot.amount == 3.50
    assert bom.priceSnapshot.supplier == "Mouser"
    assert bom.priceSnapshot.status == PriceStatus.FRESH
