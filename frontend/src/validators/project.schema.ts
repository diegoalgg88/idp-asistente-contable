import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  client_id: z.string().min(1, 'Debe seleccionar un cliente'),
  budget: z.number().min(0, 'El presupuesto debe ser positivo'),
  status: z.enum(['active', 'completed', 'on_hold', 'archived']),
  start_date: z.string().min(1, 'Fecha de inicio requerida'),
  end_date: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
