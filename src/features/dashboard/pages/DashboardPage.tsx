import { AlertTriangle, RefreshCw } from "lucide-react";
import { PageHeader } from "../../../shared/components/ui";
import { CategoryStockCard } from "../components/CategoryStockCard";
import { CollectionCard } from "../components/CollectionCard";
import { SalesByCategoryCard } from "../components/SalesByCategoryCard";
import { SalesPurchaseChartCard } from "../components/SalesPurchaseChartCard";
import { useDashboardSummary } from "../hooks/useDashboard";

export function DashboardPage() {
  const { data, isPending, isError, refetch, isFetching } = useDashboardSummary();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <AlertTriangle className="mb-3 h-8 w-8 text-red-500" />
        <p className="font-medium">Could not load dashboard data</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
  

      {/* Row 1 — small card (1 col) + chart (2 cols), matching the wireframe */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SalesByCategoryCard data={data?.salesByCategory} loading={isPending} />
        </div>
        <div className="lg:col-span-2">
          <SalesPurchaseChartCard
            data={data?.todayFlow}
            sales={data?.totals.sales ?? 0}
            purchases={data?.totals.purchases ?? 0}
            loading={isPending}
          />
        </div>
      </div>

      {/* Row 2 — collections (1 col) + category stock (2 cols) */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CollectionCard data={data?.collections} loading={isPending} />
        </div>
        <div className="lg:col-span-2">
          <CategoryStockCard data={data?.stock} loading={isPending} />
        </div>
      </div>
    </>
  );
}
