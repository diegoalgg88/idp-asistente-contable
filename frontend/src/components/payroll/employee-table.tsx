'use client';

import React from 'react';
import { useGetEmployees, Employee } from '@/hooks/use-payroll';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'rfc',
    header: 'RFC',
  },
  {
    accessorKey: 'position',
    header: 'Puesto',
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
  },
  {
    accessorKey: 'base_salary',
    header: 'Salario Base',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('base_salary'));
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      );
    },
  },
] as ColumnDef<Employee>[];

export function EmployeeTable() {
  const { data: employees, isLoading } = useGetEmployees();

  if (isLoading) {
    return <div className="text-center py-8">Cargando empleados...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Plantilla de Empleados</h2>
      </div>
      <DataTable
        columns={employeeColumns as unknown as ColumnDef<unknown>[]}
        data={employees || []}
        searchKey="name"
      />
    </div>
  );
}
