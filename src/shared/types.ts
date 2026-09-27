export type PaymentMode = "cash" | "upi" | "card" | "credit";

export type DocumentStatus = "paid" | "partial" | "unpaid";

export interface CategorySales {
  category: string;
  amount: number;
  invoices: number;
}

export interface HourlyFlowPoint {
  /** e.g. "10 AM" */
  label: string;
  sales: number;
  purchases: number;
}

export interface CollectionByMode {
  mode: PaymentMode;
  amount: number;
  count: number;
}

export interface CategoryStock {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface DashboardSummary {
  salesByCategory: CategorySales[];
  todayFlow: HourlyFlowPoint[];
  collections: CollectionByMode[];
  stock: CategoryStock[];
  totals: {
    sales: number;
    purchases: number;
    collected: number;
    outOfStock: number;
  };
}

export interface LineItem {
  id: string;
  name: string;
  qty: number;
  rate: number;
  gstRate: number;
}

export interface SaleInvoice {
  id: string;
  number: string;
  customer: string;
  createdAt: string;
  category: string;
  mode: PaymentMode;
  status: DocumentStatus;
  subTotal: number;
  tax: number;
  total: number;
  paid: number;
  items: LineItem[];
}

export interface PurchaseBill {
  id: string;
  number: string;
  supplier: string;
  createdAt: string;
  category: string;
  mode: PaymentMode;
  status: DocumentStatus;
  subTotal: number;
  tax: number;
  total: number;
  paid: number;
  items: LineItem[];
}

export interface ListQuery {
  search?: string;
  status?: DocumentStatus | "all";
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}
