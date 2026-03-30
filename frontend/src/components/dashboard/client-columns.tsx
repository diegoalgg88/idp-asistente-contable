'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Client } from '@/types/client';
import { Badge } from '@/components/ui/badge';

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'rfc',
    header: 'RFC',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
  },
];
