'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProjects } from '@/hooks/use-projects';
import { useGetCashFlow } from '@/hooks/use-finance';
import { Skeleton } from '@/components/ui/skeleton';
import * as Recharts from 'recharts';

export function ProjectsByStatusChart() {
  const { data: projects, isLoading } = useGetProjects();

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;

  const statusCounts = (projects || []).reduce((acc: any, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Proyectos por Estado</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Recharts.ResponsiveContainer width="100%" height="100%">
          <Recharts.PieChart>
            <Recharts.Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Recharts.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Recharts.Pie>
            <Recharts.Tooltip />
            <Recharts.Legend />
          </Recharts.PieChart>
        </Recharts.ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CashFlowChart() {
  const { data: cashFlow, isLoading } = useGetCashFlow();

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;

  const data = (cashFlow?.breakdown || []).map((item) => ({
    name: item.month,
    income: item.inflow,
    expense: item.outflow,
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Flujo de Efectivo</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Recharts.ResponsiveContainer width="100%" height="100%">
          <Recharts.LineChart data={data}>
            <Recharts.CartesianGrid strokeDasharray="3 3" />
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.Tooltip />
            <Recharts.Legend />
            <Recharts.Line type="monotone" dataKey="income" stroke="#8884d8" name="Ingresos" />
            <Recharts.Line type="monotone" dataKey="expense" stroke="#82ca9d" name="Egresos" />
          </Recharts.LineChart>
        </Recharts.ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
