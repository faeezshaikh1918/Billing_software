# Modules

Three modules, each a self-contained feature folder:
`src/features/<module>/{api,hooks,components,pages}`.

## 1. Dashboard — `/dashboard`
Matches the wireframe: a 3-column grid, two rows.

| Position | Component | Shows |
|---|---|---|
| Row 1, left (1 col) | `SalesByCategoryCard` | Today's sales, category-wise, with bars |
| Row 1, right (2 cols) | `SalesPurchaseChartCard` | Recharts area chart — sales vs purchases today |
| Row 2, left (1 col) | `CollectionCard` | Collections split by cash / UPI / card / credit |
| Row 2, right (2 cols) | `CategoryStockCard` | Category-wise stock + out-of-stock count |

## 2. Sales — `/sales`
Stat tiles (total, collected, outstanding, count), search, status filter
(all / paid / partial / unpaid), paginated invoice table.

## 3. Purchases — `/purchases`
Same structure, supplier-side: total, paid, payable, bill count.

Sales and Purchases share `DocumentsTable`, `ListToolbar`, `StatTile` and
`Pagination` from `src/shared/components/` — one table component, two modules.

## Layout & routing
`src/app/layout/AppLayout.tsx` holds the top nav (Dashboard · Sales · Purchases),
theme toggle and logout. `src/app/App.tsx` nests all three under one protected
layout route, so auth is checked once.

## Switching from mock data to your real API
Every module has an `api/` file with this shape:

```ts
if (USE_MOCK_API) { return delay(mockResult); }
const { data } = await api.get<ReturnType>("/endpoint");
return data;
```

Set `VITE_USE_MOCK_API=false` in `.env` and point `VITE_API_BASE_URL` at your
backend. Nothing in the components changes — they only talk to hooks.

Endpoints the API layer expects:

- `GET /dashboard/summary` → `DashboardSummary`
- `GET /sales?search=&status=&page=&pageSize=` → `Paginated<SaleInvoice>`
- `GET /sales/summary` → `SalesSummary`
- `GET /purchases?search=&status=&page=&pageSize=` → `Paginated<PurchaseBill>`
- `GET /purchases/summary` → `PurchasesSummary`

All types live in `src/shared/types.ts`.

## Run

```bash
npm install
npm run dev
```

Login is demo-only: any Indian mobile number (starting 6–9, 10 digits) and any
password of 6+ characters.
