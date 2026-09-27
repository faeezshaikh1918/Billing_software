import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSales, fetchSalesSummary } from "../api/sales.jsion";
import type { ListQuery } from "../../../shared/types";

export const salesKeys = {
  all: ["sales"] as const,
  list: (query: ListQuery) => ["sales", "list", query] as const,
  summary: ["sales", "summary"] as const,
};

export function useSalesList(query: ListQuery) {
  return useQuery({
    queryKey: salesKeys.list(query),
    queryFn: () => fetchSales(query),
    placeholderData: keepPreviousData,
  });
}

export function useSalesSummary() {
  return useQuery({
    queryKey: salesKeys.summary,
    queryFn: fetchSalesSummary,
    staleTime: 60_000,
  });
}
