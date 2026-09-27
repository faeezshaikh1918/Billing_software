import { PackageSearch } from "lucide-react";
import { Badge, Card, CardBody, CardHeader, Skeleton } from "../../../shared/components/ui";
import { formatNumber } from "../../../shared/lib/format";
import type { CategoryStock } from "../../../shared/types";

interface Props {
  data?: CategoryStock[];
  loading: boolean;
}

export function CategoryStockCard({ data, loading }: Props) {
  const rows = data ?? [];
  const outTotal = rows.reduce((a, b) => a + b.outOfStock, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Category-wise stock"
        subtitle="Available, low and out-of-stock items"
        icon={<PackageSearch className="h-4 w-4" />}
        action={
          !loading && outTotal > 0 ? (
            <Badge tone="danger">{outTotal} out of stock</Badge>
          ) : undefined
        }
      />
      <CardBody className="flex-1 p-0">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th scope="col" className="px-5 py-3 font-medium">Category</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">In stock</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Low</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Out</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const tone =
                    row.outOfStock > 0 ? "danger" : row.lowStock > 6 ? "warning" : "success";
                  const label =
                    row.outOfStock > 0 ? "Restock now" : row.lowStock > 6 ? "Running low" : "Healthy";
                  return (
                    <tr
                      key={row.category}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                    >
                      <td className="px-5 py-3 font-medium">{row.category}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {formatNumber(row.inStock)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-amber-600 dark:text-amber-400">
                        {row.lowStock}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-red-600 dark:text-red-400">
                        {row.outOfStock}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Badge tone={tone}>{label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
