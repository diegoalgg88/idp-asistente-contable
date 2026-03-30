'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { useGetProjects } from '@/hooks/use-projects';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileDown, FileJson, Stamp } from 'lucide-react';
import { downloadInvoicePDF, generateInvoiceXML, downloadFile } from '@/lib/invoice-generator';
import { toast } from 'sonner';

export const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Proyecto',
  },
  {
    accessorKey: 'client_name',
    header: 'Cliente',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variants: Record<string, string> = {
        active: 'default',
        completed: 'secondary',
        on_hold: 'outline',
        archived: 'destructive',
      };
      return (
        <Badge variant={(variants[status] || 'default') as any}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Fecha Inicio',
  },
];

export function ProjectTable() {
  const { data: projects, isLoading, error } = useGetProjects();

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-destructive">Error: {error.message}</div>;

  return (
    <DataTable
      columns={projectColumns}
      data={projects || []}
      searchKey="name"
    />
  );
}
