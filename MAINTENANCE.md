# 🛠️ Guía de Mantenimiento y Escalabilidad

## 🏗️ Cómo añadir un Nuevo Módulo (Ej: Inventarios)
Para extender la plataforma, siga el patrón arquitectónico establecido:

1.  **Definir el Schema**: Cree `src/validators/inventory.schema.ts` usando Zod.
2.  **Crear el Hook**: Desarrolle `src/hooks/use-inventory.ts` usando TanStack Query.
    *   Use `projectKeys` como referencia para la gestión de cache.
3.  **Componente de Tabla**: Utilice `src/components/ui/table.tsx` para crear a `inventory-table.tsx`.
4.  **Componente de Formulario**: Use React Hook Form + el schema de Zod.
5.  **Ruta**: Añada la página en `src/app/dashboard/inventory/page.tsx`.

## 🤖 Ajuste de Prompts de IA (Tuning)
La lógica de respuesta del asistente se controla principalmente en el Backend:
- **System Prompt**: Localizado en `backend/app/services/langgraph_agents.py`. Busca las variables `system_prompt` dentro de los métodos `_classify_intent`, `_reason_with_context` y `_generate_response`.
- **Contexto RAG**: El frontend envía el `doc_id` en la query; asegúrese de que el servicio de Chat en el backend filtre los vectores por este metadata.

## 🧾 Actualización de Plantillas Fiscales
Si las regulaciones del SAT cambian:
1.  **PDF/XML**: Modifique `src/lib/invoice-generator.ts`.
2.  **Lógica**: El método `downloadInvoicePDF` contiene el HTML/CSS. Puede ajustar los campos de emisor/receptor y los sellos digitales en el template literal.

## 📡 Infraestructura Recomendada (Stack PROD)
- **Frontend**: **Vercel** (Optimización nativa de Next.js, Edge Functions para Middleware).
- **Backend**: **FastAPI** en AWS App Runner o Google Cloud Run (Escale horizontalmente).
- **Base de Datos**: **PostgreSQL** (Managed via Supabase o RDS) + **Redis** para el cache de sesiones.
- **Observabilidad**: **Sentry** integrado en `layout.tsx` para tracking de errores en tiempo real.

## 🔒 Monitoreo de Seguridad
- Revise periódicamente `src/lib/security.ts`.
- Mantenga las cabeceras de seguridad en `next.config.js` actualizadas según las recomendaciones de OWASP.
