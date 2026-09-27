import { api, delay, USE_MOCK_API } from "../../../shared/api/client";
import { PURCHASES } from "../../../shared/api/mockDb";
import type { ListQuery, Paginated, PurchaseBill } from "../../../shared/types";

export interface PurchasesSummary {
  total: number;
  paid: number;
  payable: number;
  count: number;
}

export async function fetchPurchases(
  query: ListQuery,
): Promise<Paginated<PurchaseBill>> {
  const { search = "", status = "all", page = 1, pageSize = 10 } = query;

  if (USE_MOCK_API) {
    const term = search.trim().toLowerCase();
    const filtered = PURCHASES.filter((bill) => {
      const matchesTerm =
        !term ||
        bill.number.toLowerCase().includes(term) ||
        bill.supplier.toLowerCase().includes(term) ||
        bill.category.toLowerCase().includes(term);
      const matchesStatus = status === "all" || bill.status === status;
      return matchesTerm && matchesStatus;
    });

    const start = (page - 1) * pageSize;
    return delay({
      rows: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }

  const { data } = await api.get<Paginated<PurchaseBill>>("/purchases", {
    params: query,
  });
  return data;
}

export async function fetchPurchasesSummary(): Promise<PurchasesSummary> {
  if (USE_MOCK_API) {
    const total = PURCHASES.reduce((a, b) => a + b.total, 0);
    const paid = PURCHASES.reduce((a, b) => a + b.paid, 0);
    return delay({ total, paid, payable: total - paid, count: PURCHASES.length });
  }
  const { data } = await api.get<PurchasesSummary>("/purchases/summary");
  return data;
}
