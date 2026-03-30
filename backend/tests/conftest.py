"""
Pytest Configuration
Configuración para pytest
"""

import pytest
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture(scope="session")
def anyio_backend():
    """Configure anyio backend for async tests"""
    return "asyncio"


@pytest.fixture
def test_db_url():
    """Test database URL"""
    return "postgresql://test_user:test_password@localhost:5432/idp_test"


@pytest.fixture
def test_settings():
    """Test settings override"""
    os.environ["DATABASE_URL"] = "postgresql://test_user:test_password@localhost:5432/idp_test"
    os.environ["NVIDIA_API_KEY"] = "nvapi-test-key"  # nosec
    os.environ["SECRET_KEY"] = "test-secret-key"
    os.environ["ENVIRONMENT"] = "testing"
    
    yield
    
    # Cleanup
    for key in ["DATABASE_URL", "NVIDIA_API_KEY", "SECRET_KEY", "ENVIRONMENT"]:
        if key in os.environ:
            del os.environ[key]
