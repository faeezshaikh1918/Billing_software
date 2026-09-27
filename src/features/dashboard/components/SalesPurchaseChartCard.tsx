import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader, Skeleton } from "../../../shared/components/ui";
import { formatMoney } from "../../../shared/lib/format";
import type { HourlyFlowPoint } from "../../../shared/types";

interface Props {
  data?: HourlyFlowPoint[];
  sales: number;
  purchases: number;
  loading: boolean;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-1.5 font-semibold">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="capitalize text-slate-500">{entry.dataKey}</span>
          <span className="ml-auto font-medium tabular-nums">
            {formatMoney(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function SalesPurchaseChartCard({ data, sales, purchases, loading }: Props) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Sales vs purchases — today"
        subtitle="How much you sold and bought through the day"
        icon={<TrendingUp className="h-4 w-4" />}
        action={
          <div className="flex gap-5 text-right">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sales</p>
              <p className="text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                {loading ? "—" : formatMoney(sales)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Purchases</p>
              <p className="text-sm font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {loading ? "—" : formatMoney(purchases)}
              </p>
            </div>
          </div>
        }
      />
      <CardBody className="flex-1">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  className="text-slate-500"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  tick={{ fontSize: 12, fill: "currentColor" }}
                  className="text-slate-500"
                  tickFormatter={(v) => formatMoney(Number(v), true)}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#gSales)"
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#gPurchases)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
