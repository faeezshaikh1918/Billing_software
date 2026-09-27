import type {
  CategorySales,
  CategoryStock,
  CollectionByMode,
  HourlyFlowPoint,
  LineItem,
  PaymentMode,
  PurchaseBill,
  SaleInvoice,
} from "../types";

export const CATEGORIES = [
  "Stationery",
  "Electronics",
  "Groceries",
  "Hardware",
  "Packaging",
] as const;

const CUSTOMERS = [
  "Rahul Traders",
  "Sunrise Enterprises",
  "Meera Stores",
  "Kiran Agencies",
  "Deccan Supplies",
  "Walk-in Customer",
];

const SUPPLIERS = [
  "Prime Distributors",
  "Anand Wholesale",
  "Vertex Papers Pvt Ltd",
  "Shakti Electricals",
  "Nova Packaging Co",
];

const PRODUCTS: Record<string, string[]> = {
  Stationery: ["A4 Paper Ream", "Blue Gel Pen", "File Folder", "Sticky Notes"],
  Electronics: ["USB-C Cable", "Power Adapter", "LED Bulb 9W", "Extension Board"],
  Groceries: ["Sugar 1kg", "Tea Powder 500g", "Refined Oil 1L", "Basmati Rice 5kg"],
  Hardware: ["Screw Pack 100", "Hinge Set", "PVC Pipe 1m", "Paint Brush"],
  Packaging: ["Carton Box M", "Bubble Wrap Roll", "Tape 2 inch", "Stretch Film"],
};

/** Deterministic pseudo-random so demo data is stable across reloads. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(20260920);

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)];
}

function round(value: number): number {
  return Math.round(value);
}

function buildItems(category: string, count: number): LineItem[] {
  const names = PRODUCTS[category] ?? PRODUCTS.Stationery;
  return Array.from({ length: count }, (_, i) => {
    const qty = 1 + Math.floor(rand() * 12);
    const rate = 40 + Math.floor(rand() * 900);
    return {
      id: `li_${i}_${Math.floor(rand() * 1e6)}`,
      name: names[i % names.length],
      qty,
      rate,
      gstRate: pick([5, 12, 18]),
    };
  });
}

function totalsOf(items: LineItem[]) {
  const subTotal = round(items.reduce((sum, it) => sum + it.qty * it.rate, 0));
  const tax = round(
    items.reduce((sum, it) => sum + (it.qty * it.rate * it.gstRate) / 100, 0),
  );
  return { subTotal, tax, total: subTotal + tax };
}

function makeDoc(index: number, kind: "sale" | "purchase") {
  const category = pick(CATEGORIES);
  const items = buildItems(category, 1 + Math.floor(rand() * 4));
  const { subTotal, tax, total } = totalsOf(items);
  const mode = pick<PaymentMode>(["cash", "upi", "card", "credit"]);
  const roll = rand();
  const status = roll > 0.78 ? "unpaid" : roll > 0.6 ? "partial" : "paid";
  const paid = status === "paid" ? total : status === "partial" ? round(total * 0.5) : 0;

  const created = new Date();
  created.setDate(created.getDate() - Math.floor(rand() * 20));
  created.setHours(9 + Math.floor(rand() * 11), Math.floor(rand() * 60), 0, 0);

  return {
    id: `${kind}_${index}`,
    number:
      kind === "sale"
        ? `INV-${String(1200 + index).padStart(4, "0")}`
        : `PUR-${String(800 + index).padStart(4, "0")}`,
    createdAt: created.toISOString(),
    category,
    mode,
    status: status as "paid" | "partial" | "unpaid",
    subTotal,
    tax,
    total,
    paid,
    items,
  };
}

export const SALES: SaleInvoice[] = Array.from({ length: 48 }, (_, i) => ({
  ...makeDoc(i, "sale"),
  customer: pick(CUSTOMERS),
})).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

export const PURCHASES: PurchaseBill[] = Array.from({ length: 36 }, (_, i) => ({
  ...makeDoc(i, "purchase"),
  supplier: pick(SUPPLIERS),
})).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

/** Today's sales grouped by product category. */
export function salesByCategory(): CategorySales[] {
  const map = new Map<string, CategorySales>();
  for (const category of CATEGORIES) {
    map.set(category, { category, amount: 0, invoices: 0 });
  }
  for (const inv of SALES) {
    if (!isToday(inv.createdAt)) continue;
    const row = map.get(inv.category)!;
    row.amount += inv.total;
    row.invoices += 1;
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

/** Hour-by-hour sales vs purchases for today's chart. */
export function todayFlow(): HourlyFlowPoint[] {
  const hours = [9, 11, 13, 15, 17, 19, 21];
  return hours.map((hour) => {
    const label = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? "PM" : "AM"}`;
    const inWindow = (iso: string) => {
      const d = new Date(iso);
      return isToday(iso) && d.getHours() >= hour - 1 && d.getHours() < hour + 1;
    };
    return {
      label,
      sales: round(SALES.filter((s) => inWindow(s.createdAt)).reduce((a, b) => a + b.total, 0)),
      purchases: round(
        PURCHASES.filter((p) => inWindow(p.createdAt)).reduce((a, b) => a + b.total, 0),
      ),
    };
  });
}

/** Today's collected money split by payment mode (cash / UPI / card / credit). */
export function collectionsByMode(): CollectionByMode[] {
  const modes: PaymentMode[] = ["cash", "upi", "card", "credit"];
  return modes.map((mode) => {
    const rows = SALES.filter((s) => isToday(s.createdAt) && s.mode === mode);
    return {
      mode,
      amount: round(rows.reduce((a, b) => a + b.paid, 0)),
      count: rows.length,
    };
  });
}

/** Category-wise stock health, including out-of-stock counts. */
export function categoryStock(): CategoryStock[] {
  const seed = seeded(77);
  return CATEGORIES.map((category) => {
    const inStock = 40 + Math.floor(seed() * 160);
    const lowStock = Math.floor(seed() * 14);
    const outOfStock = Math.floor(seed() * 7);
    return { category, inStock, lowStock, outOfStock };
  });
}

export function todayTotals() {
  const sales = round(
    SALES.filter((s) => isToday(s.createdAt)).reduce((a, b) => a + b.total, 0),
  );
  const purchases = round(
    PURCHASES.filter((p) => isToday(p.createdAt)).reduce((a, b) => a + b.total, 0),
  );
  const collected = round(collectionsByMode().reduce((a, b) => a + b.amount, 0));
  const outOfStock = categoryStock().reduce((a, b) => a + b.outOfStock, 0);
  return { sales, purchases, collected, outOfStock };
}
