import { Banknote, CreditCard, Smartphone, Wallet } from "lucide-react";
import type { ComponentType } from "react";
import { Card, CardBody, CardHeader, Skeleton } from "../../../shared/components/ui";
import { formatMoney } from "../../../shared/lib/format";
import type { CollectionByMode, PaymentMode } from "../../../shared/types";

const MODE_META: Record<
  PaymentMode,
  { label: string; icon: ComponentType<{ className?: string }>; accent: string }
> = {
  cash: { label: "Cash", icon: Banknote, accent: "text-emerald-600 dark:text-emerald-400" },
  upi: { label: "UPI", icon: Smartphone, accent: "text-blue-600 dark:text-blue-400" },
  card: { label: "Card", icon: CreditCard, accent: "text-violet-600 dark:text-violet-400" },
  credit: { label: "Credit / due", icon: Wallet, accent: "text-amber-600 dark:text-amber-400" },
};

interface Props {
  data?: CollectionByMode[];
  loading: boolean;
}

export function CollectionCard({ data, loading }: Props) {
  const rows = data ?? [];
  const total = rows.reduce((a, b) => a + b.amount, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Collections by payment type"
        subtitle="Cash, UPI, card and credit"
        icon={<Wallet className="h-4 w-4" />}
      />
      <CardBody className="flex-1">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total collected today
              </p>
              <p className="text-2xl font-bold tabular-nums">{formatMoney(total)}</p>
            </div>
            <ul className="space-y-2">
              {rows.map((row) => {
                const meta = MODE_META[row.mode];
                const Icon = meta.icon;
                const share = total > 0 ? Math.round((row.amount / total) * 100) : 0;
                return (
                  <li
                    key={row.mode}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5 dark:border-slate-800"
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${meta.accent}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{meta.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {row.count} txn · {share}%
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatMoney(row.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardBody>
    </Card>
  );
}
