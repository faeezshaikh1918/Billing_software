import { api, delay, USE_MOCK_API } from "../../../shared/api/client";
import {
  categoryStock,
  collectionsByMode,
  salesByCategory,
  todayFlow,
  todayTotals,
} from "../../../shared/api/mockDb";
import type { DashboardSummary } from "../../../shared/types";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCK_API) {
    return delay({
      salesByCategory: salesByCategory(),
      todayFlow: todayFlow(),
      collections: collectionsByMode(),
      stock: categoryStock(),
      totals: todayTotals(),
    });
  }
  const { data } = await api.get<DashboardSummary>("/dashboard/summary");
  return data;
}
