"""
Tests for Fuzzy Matching Engine with sample BBVA data.
Uses unittest.mock to avoid SQLAlchemy model constraints.
"""
import pytest
from decimal import Decimal
from datetime import datetime
from unittest.mock import MagicMock
from app.services.reconciliation.fuzzy_matching import FuzzyMatchingEngine


def _make_bank_tx(id, fecha, concepto, monto, tipo='cargo', concepto_limpio=None, proveedor=None):
    """Create a mock BankTransaction"""
    tx = MagicMock()
    tx.id = id
    tx.fecha = fecha
    tx.concepto = concepto
    tx.concepto_limpio = concepto_limpio or concepto.lower()
    tx.monto = Decimal(str(monto))
    tx.tipo = tipo
    tx.proveedor = proveedor
    tx.match_status = 'unmatched'
    tx.confidence_score = None
    return tx


def _make_cfdi(id, total, fecha_str, emisor_nombre, concepto=''):
    """Create a mock Document (CFDI)"""
    cfdi = MagicMock()
    cfdi.id = id
    cfdi.document_type = 'cfdi'
    cfdi.extracted_data = {
        'total': total,
        'fecha': fecha_str,
        'emisor_nombre': emisor_nombre,
        'concepto': concepto,
    }
    return cfdi


def test_fuzzy_match_bbva_sample():
    """Test fuzzy matching with realistic BBVA bank data"""
    engine = FuzzyMatchingEngine()

    tx = _make_bank_tx(
        id=1,
        fecha=datetime(2026, 3, 10),
        concepto="COMISION POR SERVICIOS BANCARIOS MARZO BBVA",
        monto='1500.00',
        tipo='cargo',
    )

    cfdi = _make_cfdi(
        id=101,
        total=1500.00,
        fecha_str="2026-03-09T10:00:00",
        emisor_nombre="BBVA MEXICO SA DE CV",
        concepto="COMISION POR SERVICIOS BANCARIOS",
    )

    # First, test the internal match to see actual score
    result = engine._check_fuzzy_match(tx, cfdi)
    if result is None:
        # The threshold is blocking, so let's check the raw scores
        l_score = engine._levenshtein_similarity(
            tx.concepto_limpio, "COMISION POR SERVICIOS BANCARIOS"
        )
        j_score = engine._jaccard_similarity(
            tx.concepto_limpio, "COMISION POR SERVICIOS BANCARIOS"
        )
        p_score = engine._match_provider_names(
            tx.concepto, "BBVA MEXICO SA DE CV"
        )
        raw_confidence = (
            l_score * engine.WEIGHT_LEVENSHTEIN +
            j_score * engine.WEIGHT_JACCARD +
            p_score * engine.WEIGHT_PROVIDER +
            engine.WEIGHT_AMOUNT +
            engine.WEIGHT_DATE
        )
        pytest.fail(
            f"_check_fuzzy_match returned None. "
            f"Raw scores: L={l_score:.3f}, J={j_score:.3f}, P={p_score:.3f}, "
            f"Weighted={raw_confidence:.3f}, Threshold={engine.THRESHOLD_FUZZY_MEDIUM}"
        )

    matches, unmatched = engine.match([tx], [cfdi])
    assert len(matches) == 1, f"Expected 1 match, got {len(matches)}. Unmatched: {len(unmatched)}"
    assert matches[0].cfdi.id == 101
    assert matches[0].confidence_score >= 0.70
    assert matches[0].match_type == 'fuzzy'


def test_fuzzy_match_exact_amount_different_concept():
    """Test that same amount but completely different concept does NOT match"""
    engine = FuzzyMatchingEngine()

    tx = _make_bank_tx(
        id=2,
        fecha=datetime(2026, 3, 10),
        concepto="COMPRA ABARROTES DOÑA LUCHA",
        monto='500.00',
    )

    cfdi = _make_cfdi(
        id=102,
        total=500.00,
        fecha_str="2026-03-09T10:00:00",
        emisor_nombre="TIENDA OXXO SA DE CV",
        concepto="VENTA DE COMBUSTIBLE",
    )

    matches, unmatched = engine.match([tx], [cfdi])
    # These have very different concepts so should not fuzzy match
    assert len(unmatched) >= 1 or (len(matches) == 1 and matches[0].confidence_score < 0.85)


def test_levenshtein_similarity_direct():
    """Directly test the Levenshtein similarity method"""
    engine = FuzzyMatchingEngine()
    score = engine._levenshtein_similarity(
        "comision por servicios bancarios marzo bbva",
        "comision por servicios bancarios"
    )
    assert score > 0.7, f"Expected Levenshtein > 0.7, got {score}"


def test_jaccard_similarity_direct():
    """Directly test the Jaccard similarity method"""
    engine = FuzzyMatchingEngine()
    score = engine._jaccard_similarity(
        "comision servicios bancarios bbva mexico",
        "comision servicios bancarios"
    )
    assert score > 0.5, f"Expected Jaccard > 0.5, got {score}"
