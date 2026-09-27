import { FileText } from "lucide-react";
import { Badge, EmptyState, Skeleton } from "./ui";
import { formatDate, formatMoney, formatTime } from "../lib/format";
import type { DocumentStatus, PaymentMode } from "../types";

export interface DocumentRow {
  id: string;
  number: string;
  party: string;
  createdAt: string;
  category: string;
  mode: PaymentMode;
  status: DocumentStatus;
  total: number;
  paid: number;
}

const STATUS_TONE: Record<DocumentStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
};

const MODE_LABEL: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  credit: "Credit",
};

interface Props {
  rows: DocumentRow[];
  loading: boolean;
  partyLabel: string;
  numberLabel: string;
  emptyTitle: string;
  onRowClick?: (row: DocumentRow) => void;
}

export function DocumentsTable({
  rows,
  loading,
  partyLabel,
  numberLabel,
  emptyTitle,
  onRowClick,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-3 p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-8 w-8" />}
        title={emptyTitle}
        description="Try clearing the search box or changing the status filter."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th scope="col" className="px-5 py-3 font-medium">{numberLabel}</th>
            <th scope="col" className="px-3 py-3 font-medium">{partyLabel}</th>
            <th scope="col" className="px-3 py-3 font-medium">Date</th>
            <th scope="col" className="px-3 py-3 font-medium">Category</th>
            <th scope="col" className="px-3 py-3 font-medium">Mode</th>
            <th scope="col" className="px-3 py-3 text-right font-medium">Amount</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
            >
              <td className="px-5 py-3 font-medium tabular-nums">{row.number}</td>
              <td className="px-3 py-3">{row.party}</td>
              <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                <span className="block">{formatDate(row.createdAt)}</span>
                <span className="text-xs">{formatTime(row.createdAt)}</span>
              </td>
              <td className="px-3 py-3">{row.category}</td>
              <td className="px-3 py-3">{MODE_LABEL[row.mode]}</td>
              <td className="px-3 py-3 text-right font-medium tabular-nums">
                {formatMoney(row.total)}
                {row.status === "partial" && (
                  <span className="block text-xs font-normal text-slate-500">
                    paid {formatMoney(row.paid)}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right">
                <Badge tone={STATUS_TONE[row.status]}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
