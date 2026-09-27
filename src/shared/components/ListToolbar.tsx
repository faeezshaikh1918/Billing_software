import { Search } from "lucide-react";
import type { ComponentType } from "react";
import { Card } from "./ui";
import { formatMoney } from "../lib/format";
import type { DocumentStatus } from "../types";

const STATUSES: Array<DocumentStatus | "all"> = ["all", "paid", "partial", "unpaid"];

export function ListToolbar({
  search,
  onSearch,
  status,
  onStatus,
  placeholder,
}: {
  search: string;
  onSearch: (value: string) => void;
  status: DocumentStatus | "all";
  onStatus: (value: DocumentStatus | "all") => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
      <label className="relative flex-1 min-w-[220px]">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-white/10"
        />
      </label>

      <div
        role="tablist"
        aria-label="Filter by status"
        className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-800"
      >
        {STATUSES.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={status === value}
            onClick={() => onStatus(value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
              status === value
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
  money = true,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
  money?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <p className="text-2xl font-bold tabular-nums">
        {money ? formatMoney(value) : value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </Card>
  );
}
