import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPurchases, fetchPurchasesSummary } from "../api/purchasesApi";
import type { ListQuery } from "../../../shared/types";

export const purchaseKeys = {
  all: ["purchases"] as const,
  list: (query: ListQuery) => ["purchases", "list", query] as const,
  summary: ["purchases", "summary"] as const,
};

export function usePurchasesList(query: ListQuery) {
  return useQuery({
    queryKey: purchaseKeys.list(query),
    queryFn: () => fetchPurchases(query),
    placeholderData: keepPreviousData,
  });
}

export function usePurchasesSummary() {
  return useQuery({
    queryKey: purchaseKeys.summary,
    queryFn: fetchPurchasesSummary,
    staleTime: 60_000,
  });
}
