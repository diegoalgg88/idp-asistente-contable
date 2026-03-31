"""
MCP Server implementation for IDP Asistente Contable.
Exposes backend tools to the Model Context Protocol.
"""

from typing import Dict, Any, List
import json
import asyncio
from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource

from app.infrastructure.orchestration.agent_tools import AGENT_TOOL_DEFINITIONS, execute_tool
from app.db.session import SessionLocal

# Initialize MCP Server
mcp = Server("idp-asistente-contable")

@mcp.list_tools()
async def list_tools() -> List[Tool]:
    """Lista las herramientas disponibles para el Agente Fiscal."""
    return [
        Tool(
            name=tool["name"],
            description=tool["description"],
            inputSchema=tool["parameters"]
        ) for tool in AGENT_TOOL_DEFINITIONS
    ]

@mcp.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent | ImageContent | EmbeddedResource]:
    # Changed back as the previous was actually correct for modern python, 
    # but I will add Union import just in case the linter prefers it.
    """Ejecuta una herramienta y retorna el resultado en formato MCP."""
    db = SessionLocal()
    try:
        # User ID is hardcoded for now or should be extracted from context
        user_id = 1 
        
        result = execute_tool(name, arguments, db, user_id)
        
        return [
            TextContent(
                type="text",
                text=json.dumps(result, indent=2, ensure_ascii=False)
            )
        ]
    except Exception as e:
        return [
            TextContent(
                type="text",
                text=f"Error ejecutando herramienta {name}: {str(e)}"
            )
        ]
    finally:
        db.close()
    
    return [] # Defensive return for linter

if __name__ == "__main__":
    asyncio.run(mcp.run_stdio())
