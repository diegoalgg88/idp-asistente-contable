import { useGetClients } from '@/hooks/use-clients';
import { useGetDashboard } from '@/hooks/use-dashboard';
import { DataTable } from '@/components/ui/data-table';
import { clientColumns } from './client-columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CashFlowChart, ProjectsByStatusChart } from './overview-charts';
import { ProjectTable } from '../projects/project-table';
import { ComplianceCard } from '../fiscal/compliance-card';

export default function DashboardClient() {
  const { data: kpis, isLoading: isLoadingKpis } = useGetDashboard();
  const { data: clients, isLoading, error } = useGetClients();

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-destructive">
        Error al cargar los datos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-4">
        <ComplianceCard />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingKpis ? <Skeleton className="h-8 w-24" /> : `$${kpis?.monthly_revenue.toLocaleString()}`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Fiscal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
               {isLoadingKpis ? <Skeleton className="h-8 w-12" /> : kpis?.fiscal_score}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CashFlowChart />
        <ProjectsByStatusChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listado de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <DataTable columns={clientColumns} data={clients || []} searchKey="name" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
