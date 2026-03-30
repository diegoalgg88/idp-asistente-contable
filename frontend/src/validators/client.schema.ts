import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  rfc: z.string().regex(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i, 'RFC inválido'),
  type: z.enum(['moral', 'fisica']),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
