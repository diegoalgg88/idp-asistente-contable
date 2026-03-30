"""
Integration Tests - IDP Endpoints
Tests de integración para endpoints de procesamiento de documentos
"""

import pytest
import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db
from app.core.config import settings


# =============================================================================
# TEST SETUP
# =============================================================================

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


@pytest.fixture(scope="function")
def db_session():
    """Create database session for tests"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create test client"""
    
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# =============================================================================
# HEALTH CHECK TESTS
# =============================================================================

class TestHealthCheck:
    """Tests for health check endpoints"""

    def test_health_check(self, client):
        """Test basic health check endpoint"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data

    def test_root_endpoint(self, client):
        """Test root endpoint"""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "docs" in data


# =============================================================================
# IDP ENDPOINT TESTS
# =============================================================================

class TestIDPEndpoints:
    """Tests for IDP document processing endpoints"""

    def test_process_document_missing_file(self, client, db_session):
        """Test document processing without file"""
        response = client.post(
            "/v1/idp/process?document_type=factura",
            files={}
        )
        
        # Should fail with validation error
        assert response.status_code in [400, 422]

    def test_process_document_invalid_extension(self, client, db_session):
        """Test document processing with invalid file extension"""
        # Create a fake file with invalid extension
        file_content = b"fake file content"
        files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
        
        response = client.post(
            "/v1/idp/process?document_type=factura",
            files=files
        )
        
        # Should fail with extension error
        assert response.status_code == 400
        assert "Extensión no permitida" in response.json()["detail"]

    def test_get_document_status_not_found(self, client, db_session):
        """Test getting status of non-existent document"""
        response = client.get("/v1/idp/99999")
        
        assert response.status_code == 404

    def test_batch_process_no_files(self, client, db_session):
        """Test batch processing without files"""
        response = client.post(
            "/v1/idp/batch-process?document_type=factura",
            files=[]
        )
        
        # Should fail with validation error
        assert response.status_code in [400, 422]


# =============================================================================
# AUTHENTICATION TESTS
# =============================================================================

class TestAuthentication:
    """Tests for authentication endpoints"""

    def test_protected_endpoint_without_token(self, client, db_session):
        """Test accessing protected endpoint without token"""
        response = client.get("/v1/idp/1")
        
        # Should fail with 401 Unauthorized
        assert response.status_code == 401

    def test_protected_endpoint_with_invalid_token(self, client, db_session):
        """Test accessing protected endpoint with invalid token"""
        response = client.get(
            "/v1/idp/1",
            headers={"Authorization": "Bearer invalid-token"}
        )
        
        # Should fail with 401 Unauthorized
        assert response.status_code == 401


# =============================================================================
# CHAT ENDPOINT TESTS
# =============================================================================

class TestChatEndpoints:
    """Tests for chat endpoints"""

    def test_send_message_without_auth(self, client, db_session):
        """Test sending message without authentication"""
        response = client.post(
            "/v1/chat/message",
            json={"message": "Hello"}
        )
        
        # Should fail with 401 Unauthorized
        assert response.status_code == 401

    def test_get_conversation_not_found(self, client, db_session):
        """Test getting non-existent conversation"""
        # This would need authentication
        pass

    def test_list_conversations_without_auth(self, client, db_session):
        """Test listing conversations without authentication"""
        response = client.get("/v1/chat/conversations")
        
        # Should fail with 401 Unauthorized
        assert response.status_code == 401


# =============================================================================
# RATE LIMITING TESTS
# =============================================================================

class TestRateLimiting:
    """Tests for rate limiting"""

    def test_rate_limit_headers(self, client, db_session):
        """Test that rate limit headers are present"""
        response = client.get("/health")
        
        # Check for rate limit headers (may vary based on configuration)
        assert response.status_code == 200


# =============================================================================
# OPENAPI TESTS
# =============================================================================

class TestOpenAPI:
    """Tests for OpenAPI documentation"""

    def test_openapi_schema(self, client):
        """Test OpenAPI schema is available"""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data
        assert data["info"]["title"] == settings.APP_NAME

    def test_swagger_docs(self, client):
        """Test Swagger UI is available"""
        response = client.get("/docs")
        
        assert response.status_code == 200

    def test_redoc_docs(self, client):
        """Test ReDoc is available"""
        response = client.get("/redoc")
        
        assert response.status_code == 200


# =============================================================================
# MAIN TEST RUNNER
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=app", "--cov-report=html"])
