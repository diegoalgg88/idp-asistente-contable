
import os
import sys
from dotenv import load_dotenv

# Añadir el directorio raíz del backend al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Cargar variables de entorno
load_dotenv()

from app.services.langgraph_agents import get_contable_agent

def test_autonomous_react_loop():
    print("=== TEST: Autonomous ReAct Agent Loop ===")
    agent = get_contable_agent()
    
    # Consulta que requiere al menos 2 pasos (ReAct)
    # 1. Buscar el cliente para obtener el RFC
    # 2. Validar el estatus del RFC en el SAT
    query = "Busca al cliente 'Empresa Ejemplo' en la lista, obtén su RFC y luego valida su estatus fiscal en el SAT."
    
    print(f"\nConsulta: {query}")
    print("\nEjecutando agente (esto puede tomar varios ciclos de pensamiento-acción)...")
    
    try:
        result = agent.generate_response(
            message=query,
            user_id=1
        )
        
        print("\n--- RESPUESTA FINAL ---")
        print(f"Contenido: {result.get('content')}")
        print(f"Confianza: {result.get('confidence')}")
        print(f"Latencia: {result.get('latency'):.2f}s")
        print(f"Modelo: {result.get('model_used')}")
        
        # Verificar si hubo rastro de herramientas en el contexto (si está disponible)
        # Nota: El resultado público no muestra los pasos intermedios por ahora, 
        # pero podemos ver los logs de la consola durante la ejecución.
        
    except Exception as e:
        print(f"\nError durante la ejecución del agente: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_autonomous_react_loop()
