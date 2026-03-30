import asyncio
import json
import logging
from app.services.langgraph_agents import ContableAgent

logging.basicConfig(level=logging.INFO)

async def run_test():
    print("Iniciando test de agente con tool calling nativo...")
    agent = ContableAgent(user_id=1)
    
    print("\n--- TEST 1: Buscar Clientes ---")
    response_data = agent.generate_response(
        message="¿Me puedes dar la lista de clientes activos?"
    )
        
    print("\n--- TEST 2: Saludo directo ---")
    response_data2 = agent.generate_response(
        message="Hola, ¿quién eres?"
    )
    
    results = {
        "test1": response_data,
        "test2": response_data2
    }
    
    with open("test_output.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        
    print("Test finalizado. Resultados en test_output.json")

if __name__ == "__main__":
    asyncio.run(run_test())
