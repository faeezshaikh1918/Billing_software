import { useMemo, useState } from "react";
import { FileStack, Plus, ShoppingCart, TimerReset, Wallet } from "lucide-react";
import { Card, PageHeader } from "../../../shared/components/ui";
import { DocumentsTable, type DocumentRow } from "../../../shared/components/DocumentsTable";
import { ListToolbar, StatTile } from "../../../shared/components/ListToolbar";
import { Pagination } from "../../../shared/components/Pagination";
import { usePurchasesList, usePurchasesSummary } from "../hooks/usePurchases";
import type { DocumentStatus } from "../../../shared/types";

const PAGE_SIZE = 10;

export function PurchasesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DocumentStatus | "all">("all");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({ search, status, page, pageSize: PAGE_SIZE }),
    [search, status, page],
  );

  const { data, isPending } = usePurchasesList(query);
  const { data: summary, isPending: summaryPending } = usePurchasesSummary();

  const rows: DocumentRow[] = (data?.rows ?? []).map((bill) => ({
    id: bill.id,
    number: bill.number,
    party: bill.supplier,
    createdAt: bill.createdAt,
    category: bill.category,
    mode: bill.mode,
    status: bill.status,
    total: bill.total,
    paid: bill.paid,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Module"
        title="Purchases"
        description="Supplier bills, payments made and amounts still payable."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-slate-900">
            <Plus className="h-4 w-4" />
            New purchase
          </button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total purchases"
          value={summaryPending ? 0 : (summary?.total ?? 0)}
          icon={ShoppingCart}
          hint="All time"
        />
        <StatTile
          label="Paid to suppliers"
          value={summaryPending ? 0 : (summary?.paid ?? 0)}
          icon={Wallet}
          hint="Settled bills"
        />
        <StatTile
          label="Payable"
          value={summaryPending ? 0 : (summary?.payable ?? 0)}
          icon={TimerReset}
          hint="Still to be paid"
        />
        <StatTile
          label="Bills"
          value={summaryPending ? 0 : (summary?.count ?? 0)}
          icon={FileStack}
          money={false}
          hint="Total documents"
        />
      </div>

      <Card>
        <ListToolbar
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          status={status}
          onStatus={(value) => {
            setStatus(value);
            setPage(1);
          }}
          placeholder="Search bill no., supplier or category…"
        />
        <DocumentsTable
          rows={rows}
          loading={isPending}
          partyLabel="Supplier"
          numberLabel="Bill"
          emptyTitle="No purchase bills found"
        />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPage={setPage}
        />
      </Card>
    </>
  );
}
