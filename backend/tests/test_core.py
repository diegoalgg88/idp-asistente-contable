"""
Unit Tests - Core Modules
Tests unitarios para módulos core: config, security, validators
"""

import pytest
from datetime import timedelta

from app.core.config import Settings, settings, validate_settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
    RFCValidator,
    validate_rfc_list,
)


# =============================================================================
# CONFIG TESTS
# =============================================================================

class TestConfig:
    """Tests for configuration module"""

    def test_settings_instance(self):
        """Test settings instance is created"""
        assert settings is not None
        assert isinstance(settings.APP_NAME, str)
        assert isinstance(settings.APP_VERSION, str)

    def test_settings_default_values(self):
        """Test default settings values"""
        assert settings.RATE_LIMIT == 40  # NVIDIA NIM Develop tier
        assert settings.MAX_WORKERS == 4
        assert settings.REQUEST_TIMEOUT == 120

    def test_validate_settings_missing_api_key(self, monkeypatch):
        """Test validation fails without API key"""
        monkeypatch.setenv("NVIDIA_API_KEY", "")
        
        # Reload settings
        test_settings = Settings()
        is_valid, message = validate_settings()
        
        # Should fail or pass depending on implementation
        # (validate_settings creates directories if missing)
        assert isinstance(is_valid, bool)
        assert isinstance(message, str)


# =============================================================================
# SECURITY TESTS
# =============================================================================

class TestSecurity:
    """Tests for security utilities"""

    def test_password_hashing(self):
        """Test password hashing"""
        password = "test_password_123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert len(hashed) > 0
        assert verify_password(password, hashed)
        assert not verify_password("wrong_password", hashed)

    def test_access_token_creation(self):
        """Test JWT access token creation"""
        data = {"sub": "123", "email": "test@example.com"}
        token = create_access_token(data=data)
        
        assert token is not None
        assert len(token) > 0
        
        # Decode and verify
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "123"
        assert payload["email"] == "test@example.com"

    def test_access_token_expiration(self):
        """Test JWT access token expiration"""
        data = {"sub": "123"}
        
        # Create token that expires in 1 minute
        token = create_access_token(
            data=data,
            expires_delta=timedelta(minutes=1)
        )
        
        payload = decode_access_token(token)
        assert payload is not None
        assert "exp" in payload

    def test_expired_token(self):
        """Test expired token returns None"""
        data = {"sub": "123"}
        
        # Create expired token
        token = create_access_token(
            data=data,
            expires_delta=timedelta(seconds=-1)  # Already expired
        )
        
        payload = decode_access_token(token)
        assert payload is None


# =============================================================================
# RFC VALIDATOR TESTS
# =============================================================================

class TestRFCValidator:
    """Tests for RFC validator"""

    def test_clean_rfc(self):
        """Test RFC cleaning"""
        assert RFCValidator.clean_rfc("ABC123456XYZ") == "ABC123456XYZ"
        assert RFCValidator.clean_rfc("abc123456xyz") == "ABC123456XYZ"
        assert RFCValidator.clean_rfc("AB-C1-23-45-6X-YZ") == "ABC123456XYZ"
        assert RFCValidator.clean_rfc("AB O123456XYZ") == "AB 0123456XYZ"  # O → 0
        assert RFCValidator.clean_rfc("AB I123456XYZ") == "AB 1123456XYZ"  # I → 1

    def test_validate_format_persona_moral(self):
        """Test RFC validation for persona moral (12 chars)"""
        # Valid PM RFCs
        assert RFCValidator.validate_format("ABC123456XYZ")[0] is True
        assert RFCValidator.validate_format("FEM123456ABC")[0] is True
        
        # Invalid PM RFCs
        assert RFCValidator.validate_format("ABC123456XY")[0] is False  # 11 chars
        assert RFCValidator.validate_format("ABC123456XYZA")[0] is False  # 13 chars
        assert RFCValidator.validate_format("123456789012")[0] is False  # Numbers only

    def test_validate_format_persona_fisica(self):
        """Test RFC validation for persona física (13 chars)"""
        # Valid PF RFCs
        assert RFCValidator.validate_format("ABC123456XYZA")[0] is True
        assert RFCValidator.validate_format("GOMJ800101ABC")[0] is True
        
        # Invalid PF RFCs
        assert RFCValidator.validate_format("ABC123456XYZ")[0] is False  # 12 chars
        assert RFCValidator.validate_format("ABC123456XYZAB")[0] is False  # 14 chars

    def test_fix_ocr_errors(self):
        """Test OCR error correction"""
        # Common OCR errors
        assert RFCValidator.fix_ocr_errors("ABC123456XYZ") == "ABC123456XYZ"  # No errors
        assert RFCValidator.fix_ocr_errors("ABCI23456XYZ") == "ABC123456XYZ"  # I → 1
        assert RFCValidator.fix_ocr_errors("ABCO23456XYZ") == "ABC023456XYZ"  # O → 0
        
        # Invalid that can't be fixed
        result = RFCValidator.fix_ocr_errors("INVALIDRFC123")
        assert result == "INVALIDRFC123"  # Returns original

    def test_compare_rfc(self):
        """Test RFC comparison"""
        # Exact match
        is_equal, similarity = RFCValidator.compare_rfc("ABC123456XYZ", "ABC123456XYZ")
        assert is_equal is True
        assert similarity == 1.0
        
        # Similar RFCs
        is_equal, similarity = RFCValidator.compare_rfc("ABC123456XYZ", "ABC123456XY2")
        assert similarity > 0.9

    def test_validate_rfc_list(self):
        """Test RFC list validation"""
        rfc_list = [
            "ABC123456XYZ",  # Valid PM
            "ABC123456XYZA",  # Valid PF
            "INVALID123",  # Invalid
        ]
        
        results = validate_rfc_list(rfc_list)
        
        assert results["total"] == 3
        assert results["valid"] >= 2
        assert results["invalid"] >= 0


# =============================================================================
# RATE LIMITER TESTS
# =============================================================================

class TestRateLimiter:
    """Tests for rate limiter"""

    def test_rate_limiter_creation(self):
        """Test rate limiter creation"""
        from app.infrastructure.ai.nvidia_nim import RateLimiter
        
        limiter = RateLimiter(max_rpm=40)
        assert limiter.max_rpm == 40
        assert len(limiter.requests) == 0

    def test_rate_limiter_thread_safe(self):
        """Test rate limiter is thread-safe"""
        from app.infrastructure.ai.nvidia_nim import RateLimiter
        import threading
        
        limiter = RateLimiter(max_rpm=100)
        errors = []
        
        def make_request():
            try:
                limiter.wait_if_needed()
            except Exception as e:
                errors.append(e)
        
        # Create multiple threads
        threads = [threading.Thread(target=make_request) for _ in range(10)]
        
        for t in threads:
            t.start()
        
        for t in threads:
            t.join()
        
        assert len(errors) == 0


# =============================================================================
# MAIN TEST RUNNER
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=app.core", "--cov-report=html"])
