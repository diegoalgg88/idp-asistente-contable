import requests
import json

BASE_URL = "http://localhost:8000/v1"

def test_audit():
    print("\n--- Probando Módulo de Auditoría (Fase 12) ---")
    payload = {"period": "2026-03", "scope": "full"}
    try:
        response = requests.post(f"{BASE_URL}/audit/run-audit", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

def test_payroll():
    print("\n--- Probando Módulo de Nómina (Fase 11) ---")
    payload = {"employee_id": "EMP-001", "period": "2026-03", "days_worked": 15}
    try:
        response = requests.post(f"{BASE_URL}/payroll/calculate-draft", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

def test_predictive():
    print("\n--- Probando Dashboard Predictivo (Fase 10) ---")
    payload = {
        "history": [
            {"ds": "2026-01-01", "y": 10000},
            {"ds": "2026-02-01", "y": 12000}
        ],
        "months_ahead": 3
    }
    try:
        response = requests.post(f"{BASE_URL}/predictive/tax-forecast", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

def test_risks():
    print("\n--- Probando Gestión de Riesgos (Fase 10/12) ---")
    payload = {
        "transactions": [
            {"rfc_emisor": "BAD880808ABC", "monto": 50000, "fecha": "2026-03-01"}
        ],
        "efos_list": ["BAD880808ABC"]
    }
    try:
        response = requests.post(f"{BASE_URL}/risks/efo-risks", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_audit()
    test_payroll()
    test_predictive()
    test_risks()
