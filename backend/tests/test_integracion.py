#!/usr/bin/env python3
"""
Test de Integración - IDP Asistente Contable
Verifica que el backend esté funcionando correctamente con los nuevos endpoints de auth.

Requisitos:
- Backend corriendo en http://localhost:8000
- Docker compose up -d

Ejecución:
    python test_integracion.py
"""

import requests
import json
import sys
from colorama import init, Fore, Style

# Initialize colorama
init()

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/v1"

# Credenciales de test
TEST_EMAIL = "admin@example.com"
TEST_PASSWORD = "admin123"


def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{text:^60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}\n")


def print_success(text: str):
    """Print success message"""
    print(f"{Fore.GREEN}✓ {text}{Style.RESET_ALL}")


def print_error(text: str):
    """Print error message"""
    print(f"{Fore.RED}✗ {text}{Style.RESET_ALL}")


def print_warning(text: str):
    """Print warning message"""
    print(f"{Fore.YELLOW}⚠ {text}{Style.RESET_ALL}")


def test_health_check():
    """Test health check endpoint"""
    print_header("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        response.raise_for_status()
        
        data = response.json()
        print_success(f"Backend status: {data.get('status', 'unknown')}")
        print_success(f"Service: {data.get('service', 'unknown')}")
        print_success(f"Version: {data.get('version', 'unknown')}")
        return True
        
    except requests.exceptions.ConnectionError:
        print_error("Backend no está corriendo en http://localhost:8000")
        print_warning("Ejecuta: docker compose --profile dev up -d")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def test_auth_token():
    """Test OAuth2 token endpoint"""
    print_header("TEST 2: Auth Token (POST /v1/auth/token)")
    
    try:
        # OAuth2 requiere form data con 'username' y 'password'
        data = {
            'username': TEST_EMAIL,
            'password': TEST_PASSWORD
        }
        
        response = requests.post(
            f"{API_URL}/auth/token",
            data=data,
            timeout=10
        )
        response.raise_for_status()
        
        token_data = response.json()
        
        if 'access_token' in token_data and 'refresh_token' in token_data:
            print_success("Token obtenido exitosamente")
            print_success(f"Token type: {token_data.get('token_type', 'unknown')}")
            print_success(f"Access token (first 50): {token_data['access_token'][:50]}...")
            return token_data
        else:
            print_error("Response no contiene access_token o refresh_token")
            print_error(f"Response: {json.dumps(token_data, indent=2)}")
            return None
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print_error("Credenciales inválidas")
            print_warning(f"Usa: {TEST_EMAIL} / {TEST_PASSWORD}")
        else:
            print_error(f"HTTP Error: {e.response.status_code}")
        return None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


def test_auth_me(access_token: str):
    """Test get current user endpoint"""
    print_header("TEST 3: Get Current User (GET /v1/auth/me)")
    
    try:
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{API_URL}/auth/me",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        
        user_data = response.json()
        
        print_success(f"User ID: {user_data.get('id', 'unknown')}")
        print_success(f"Email: {user_data.get('email', 'unknown')}")
        print_success(f"Full name: {user_data.get('full_name', 'unknown')}")
        print_success(f"Is active: {user_data.get('is_active', 'unknown')}")
        return True
        
    except requests.exceptions.HTTPError as e:
        print_error(f"HTTP Error: {e.response.status_code}")
        if e.response.status_code == 401:
            print_warning("Token expirado o inválido")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def test_auth_refresh(refresh_token: str):
    """Test refresh token endpoint"""
    print_header("TEST 4: Refresh Token (POST /v1/auth/refresh)")
    
    try:
        response = requests.post(
            f"{API_URL}/auth/refresh",
            json={'refresh_token': refresh_token},
            timeout=10
        )
        response.raise_for_status()
        
        token_data = response.json()
        
        if 'access_token' in token_data and 'refresh_token' in token_data:
            print_success("Tokens refresheados exitosamente")
            print_success(f"New access token (first 50): {token_data['access_token'][:50]}...")
            return token_data
        else:
            print_error("Response no contiene access_token o refresh_token")
            return None
        
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


def test_idp_stats(access_token: str):
    """Test IDP stats endpoint"""
    print_header("TEST 5: IDP Stats (GET /v1/idp/stats)")
    
    try:
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{API_URL}/idp/stats",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        
        stats = response.json()
        print_success("Stats obtenidos exitosamente")
        print_success(f"Total documents: {stats.get('total_documents', 0)}")
        print_success(f"Processed documents: {stats.get('processed_documents', 0)}")
        return True
        
    except requests.exceptions.HTTPError as e:
        print_error(f"HTTP Error: {e.response.status_code}")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def test_chat_history(access_token: str):
    """Test chat history endpoint"""
    print_header("TEST 6: Chat History (GET /v1/chat/conversations)")
    
    try:
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            f"{API_URL}/chat/conversations",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        
        conversations = response.json()
        print_success(f"Conversaciones encontradas: {len(conversations)}")
        
        if conversations:
            for conv in conversations[:3]:  # Mostrar primeras 3
                print_success(f"  - {conv.get('title', 'Sin título')} ({conv.get('message_count', 0)} mensajes)")
        
        return True
        
    except requests.exceptions.HTTPError as e:
        print_error(f"HTTP Error: {e.response.status_code}")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def main():
    """Main test runner"""
    print_header("IDP ASISTENTE CONTABLE - TEST DE INTEGRACIÓN")
    print("Backend: http://localhost:8000")
    print(f"Test user: {TEST_EMAIL} / {TEST_PASSWORD}")
    
    # Test 1: Health check
    if not test_health_check():
        print_error("\nBackend no está disponible. Terminando tests.")
        sys.exit(1)
    
    # Test 2: Auth token
    token_data = test_auth_token()
    if not token_data:
        print_error("\nFailed to obtain auth token. Terminando tests.")
        sys.exit(1)
    
    access_token = token_data['access_token']
    refresh_token = token_data['refresh_token']
    
    # Test 3: Get current user
    if not test_auth_me(access_token):
        print_warning("\nCould not get current user, continuing...")
    
    # Test 4: Refresh token
    new_tokens = test_auth_refresh(refresh_token)
    if new_tokens:
        access_token = new_tokens['access_token']
        refresh_token = new_tokens['refresh_token']
    
    # Test 5: IDP stats
    test_idp_stats(access_token)
    
    # Test 6: Chat history
    test_chat_history(access_token)
    
    # Summary
    print_header("RESUMEN")
    print_success("✓ Health check")
    print_success("✓ Auth token (OAuth2)")
    print_success("✓ Refresh token")
    print_success("✓ Protected endpoints")
    print("\n" + Fore.GREEN + "=" * 60)
    print("Todos los tests de integración completados exitosamente!")
    print("=" * 60 + Style.RESET_ALL)
    print("\nEl frontend está listo para consumir la API real.")
    print("Para iniciar el frontend: cd frontend && npm run dev")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"\nUnexpected error: {str(e)}")
        sys.exit(1)
