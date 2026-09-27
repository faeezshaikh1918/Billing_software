import { Layers } from "lucide-react";
import { Card, CardBody, CardHeader, EmptyState, Skeleton } from "../../../shared/components/ui";
import { formatMoney } from "../../../shared/lib/format";
import type { CategorySales } from "../../../shared/types";

interface Props {
  data?: CategorySales[];
  loading: boolean;
}

export function SalesByCategoryCard({ data, loading }: Props) {
  const rows = data ?? [];
  const max = Math.max(1, ...rows.map((r) => r.amount));
  const total = rows.reduce((a, b) => a + b.amount, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Today's sales by category"
        subtitle="Category-wise breakdown"
        icon={<Layers className="h-4 w-4" />}
      />
      <CardBody className="flex-1">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : total === 0 ? (
          <EmptyState
            icon={<Layers className="h-8 w-8" />}
            title="No sales recorded today"
            description="Category totals appear here as soon as you bill your first invoice."
          />
        ) : (
          <ul className="space-y-4">
            {rows.map((row) => (
              <li key={row.category}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium">{row.category}</span>
                  <span className="shrink-0 text-sm tabular-nums">
                    {formatMoney(row.amount)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${(row.amount / max) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {row.invoices} invoice{row.invoices === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
      {!loading && total > 0 && (
        <footer className="border-t border-slate-100 px-5 py-3 text-sm dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Total </span>
          <span className="font-semibold tabular-nums">{formatMoney(total)}</span>
        </footer>
      )}
    </Card>
  );
}
