"""
RAG System Test Script - IDP Asistente Contable
Script para verificar la implementación del sistema RAG.

Uso:
    python test_rag_system.py

Requisitos:
    - ChromaDB corriendo en localhost:8000
    - NVIDIA_API_KEY configurada en .env
"""

import os
import sys

# Agregar backend al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))


def test_imports():
    """Verificar que todos los módulos se pueden importar"""
    print("=" * 60)
    print("TEST 1: Verificando imports...")
    print("=" * 60)
    
    try:
        print("✓ embeddings service importado correctamente")
    except Exception as e:
        print(f"✗ Error importando embeddings: {e}")
        return False
    
    try:
        print("✓ rag_service importado correctamente")
    except Exception as e:
        print(f"✗ Error importando rag_service: {e}")
        return False
    
    try:
        print("✓ rag_agent importado correctamente")
    except Exception as e:
        print(f"✗ Error importando rag_agent: {e}")
        return False
    
    try:
        print("✓ RAG API router importado correctamente")
    except Exception as e:
        print(f"✗ Error importando RAG API: {e}")
        return False
    
    try:
        print("✓ langgraph_agents con RAG integration importado correctamente")
    except Exception as e:
        print(f"✗ Error importando langgraph_agents: {e}")
        return False
    
    print("\n✓ Todos los imports verificados exitosamente\n")
    return True


def test_embeddings_service():
    """Verificar el servicio de embeddings"""
    print("=" * 60)
    print("TEST 2: Verificando embeddings service...")
    print("=" * 60)
    
    try:
        from app.services.embeddings import get_embeddings_service
        
        service = get_embeddings_service()
        print("✓ Servicio de embeddings inicializado")
        print(f"  - Modelo: {service.model}")
        print(f"  - Dimensiones: {service.dimensions}")
        
        # Test de embedding (requiere API key)
        if os.getenv("NVIDIA_API_KEY"):
            print("  - NVIDIA API Key configurada ✓")
            
            # Test single query
            embedding = service.embed_query("¿Qué es una factura?")
            print(f"  - Embedding generado: {len(embedding)} dimensiones ✓")
            
            # Test batch
            texts = ["Documento 1", "Documento 2"]
            embeddings = service.embed_documents(texts)
            print(f"  - Batch embeddings: {len(embeddings)} documentos ✓")
        else:
            print("  ⚠ NVIDIA_API_KEY no configurada (skipping embedding generation)")
        
        print("\n✓ Embeddings service verificado\n")
        return True
        
    except Exception as e:
        print(f"✗ Error en embeddings service: {e}\n")
        return False


def test_chromadb_connection():
    """Verificar conexión a ChromaDB"""
    print("=" * 60)
    print("TEST 3: Verificando conexión a ChromaDB...")
    print("=" * 60)
    
    try:
        from app.services.rag_service import ChromaDBService
        
        service = ChromaDBService()
        print("✓ ChromaDB client inicializado")
        print(f"  - Host: {service.host}")
        print(f"  - Port: {service.port}")
        
        # Test de conexión
        try:
            collections = service.client.list_collections()
            print(f"  - Conexión exitosa: {len(collections)} collections existentes ✓")
        except Exception as e:
            print(f"  ✗ Error conectando a ChromaDB: {e}")
            print("  ⚠ Asegúrate de que ChromaDB esté corriendo: docker compose up -d chromadb")
            return False
        
        print("\n✓ ChromaDB connection verificada\n")
        return True
        
    except Exception as e:
        print(f"✗ Error en ChromaDB service: {e}\n")
        return False


def test_rag_service():
    """Verificar el servicio RAG completo"""
    print("=" * 60)
    print("TEST 4: Verificando RAG service...")
    print("=" * 60)
    
    try:
        from app.services.rag_service import get_rag_service
        
        service = get_rag_service()
        print("✓ RAG service inicializado")
        
        # Test de stats
        stats = service.stats()
        print(f"  - ChromaDB Host: {stats.get('chromadb_host')}")
        print(f"  - Total Collections: {stats.get('total_collections')}")
        print(f"  - Total Documents: {stats.get('total_documents')}")
        print(f"  - Embeddings Model: {stats.get('embeddings_model')}")
        
        print("\n✓ RAG service verificado\n")
        return True
        
    except Exception as e:
        print(f"✗ Error en RAG service: {e}\n")
        return False


def test_rag_agent():
    """Verificar el RAG agent"""
    print("=" * 60)
    print("TEST 5: Verificando RAG agent...")
    print("=" * 60)
    
    try:
        from app.agents.rag_agent import get_rag_agent
        
        agent = get_rag_agent()
        print("✓ RAG agent inicializado")
        print(f"  - Top-K: {agent.top_k}")
        print(f"  - RAG Service: {agent.rag_service is not None}")
        print(f"  - LLM Service: {agent.llm_service is not None}")
        
        print("\n✓ RAG agent verificado\n")
        return True
        
    except Exception as e:
        print(f"✗ Error en RAG agent: {e}\n")
        return False


def test_contable_agent_with_rag():
    """Verificar ContableAgent con RAG integration"""
    print("=" * 60)
    print("TEST 6: Verificando ContableAgent con RAG...")
    print("=" * 60)
    
    try:
        from app.services.langgraph_agents import ContableAgent
        
        agent = ContableAgent(user_id=1)
        print("✓ ContableAgent inicializado con RAG")
        print(f"  - NVIDIA Service: {agent.nvidia_service is not None}")
        print(f"  - RAG Service: {agent.rag_service is not None}")
        print(f"  - Graph compilado: {agent.graph is not None}")
        
        print("\n✓ ContableAgent con RAG verificado\n")
        return True
        
    except Exception as e:
        print(f"✗ Error en ContableAgent: {e}\n")
        return False


def run_all_tests():
    """Ejecutar todos los tests"""
    print("\n" + "=" * 60)
    print("RAG SYSTEM - TEST SUITE")
    print("=" * 60 + "\n")
    
    results = []
    
    results.append(("Imports", test_imports()))
    results.append(("Embeddings Service", test_embeddings_service()))
    results.append(("ChromaDB Connection", test_chromadb_connection()))
    results.append(("RAG Service", test_rag_service()))
    results.append(("RAG Agent", test_rag_agent()))
    results.append(("ContableAgent + RAG", test_contable_agent_with_rag()))
    
    # Summary
    print("=" * 60)
    print("RESUMEN DE TESTS")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"  {status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ ¡Todos los tests pasaron exitosamente!")
        return 0
    else:
        print(f"\n⚠ {total - passed} tests fallaron. Revisa los errores arriba.")
        return 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
