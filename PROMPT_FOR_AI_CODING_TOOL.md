# MASTER PROMPT — Smart Billing Software

You are a senior product designer, UX engineer, and senior React/TypeScript developer. Build a production-quality, scalable billing/POS web application.

## Product
Create a modern SaaS-style billing software for small and medium businesses. The UI must feel like a real commercial product, not a tutorial/demo.

## Required stack
- React 19+
- Vite
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui component architecture
- Lucide React icons
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios
- Zustand for client/global state
- date-fns where dates are needed
- Recharts for dashboard charts

Do not introduce unnecessary libraries.

## Design direction
Create a premium, clean, fast billing/POS dashboard:
- responsive desktop-first design
- excellent mobile/tablet fallback
- light and dark mode
- consistent spacing and typography
- subtle borders and shadows
- rounded cards, but do not overuse huge rounded containers
- attractive empty states
- skeleton loaders
- toast notifications
- confirmation dialogs
- keyboard-friendly forms
- accessible labels, focus states, contrast, and ARIA where appropriate
- no excessive gradients
- no fake stock photos
- use Lucide icons instead of manually drawn SVG icons
- avoid visual clutter
- use realistic billing/business data in mock mode

## BRANDING
Use placeholder brand name "BillPro" and make the branding easy to change from one config file.

## FIRST SCREEN: LOGIN
Build the first screen as a polished login page.

Login requirements:
- phone number input
- password input
- show/hide password button
- remember me checkbox
- forgot password link
- Login button
- form validation
- loading state inside button
- invalid credentials error state
- responsive layout

Phone validation:
- Indian mobile number format should be supported
- do not hard-code a real user's phone number
- normalize input before sending to API

Login visual:
- left side branded illustration/feature panel on desktop
- right side login form
- stacked single-column layout on mobile
- theme toggle
- subtle entrance animation
- professional SaaS appearance

## AUTH FLOW
Implement:
- AuthContext or Zustand auth store
- protected routes
- login API service abstraction
- logout
- token storage abstraction
- automatic redirect to /dashboard after successful login
- redirect authenticated users away from /login
- API error handling
- loading state while restoring an existing session

Do not put API calls directly inside UI components.

Use environment variables for API base URL:
VITE_API_BASE_URL

## LOADING EXPERIENCE
After successful login, show a short branded loading transition before opening the dashboard.

Create reusable:
- PageLoader
- FullScreenLoader
- ButtonLoader
- Skeleton components

Do not artificially delay the application for no reason. If a mock delay is needed for demo mode, isolate it in mock services.

## DASHBOARD
After login, open a professional dashboard.

Desktop layout:
- collapsible left sidebar
- top header
- main content
- user/profile menu
- notification button
- global search
- light/dark mode toggle

Dashboard cards:
- Today's Sales
- Today's Orders
- Total Products
- Low Stock Items
- Outstanding Payments
- Purchase Amount

Dashboard content:
- sales overview chart
- sales vs purchase chart
- top-selling products
- low-stock table
- recent invoices
- quick actions

Quick actions:
- New Sale
- Add Product
- New Purchase
- Add Customer

Use realistic mock data but clearly isolate it from real API services.

## MAIN ROUTES
Create route architecture for:
/
 /login
 /dashboard
 /sales
 /sales/new
 /sales/:id
 /purchases
 /purchases/new
 /products
 /products/new
 /products/:id
 /categories
 /customers
 /suppliers
 /stock
 /invoices
 /reports
 /expenses
 /users
 /settings

Initially, fully implement /login and /dashboard. Create clean placeholder pages for the remaining routes so navigation works.

## FILE STRUCTURE
Use a scalable feature-based architecture:

src/
  app/
    App.tsx
    router.tsx
    providers.tsx

  assets/

  components/
    common/
    layout/
    ui/

  config/
    app.config.ts
    navigation.config.ts

  features/
    auth/
      components/
      hooks/
      pages/
      services/
      schemas/
      store/
      types.ts

    dashboard/
      components/
      hooks/
      pages/
      services/
      types.ts

    products/
    categories/
    sales/
    purchases/
    customers/
    suppliers/
    stock/
    invoices/
    reports/
    expenses/
    users/
    settings/

  hooks/

  lib/
    api/
    utils/
    validations/

  services/

  store/

  types/

  routes/

  styles/
    globals.css

  main.tsx

Rules:
- Keep feature-specific code inside its feature folder.
- Keep reusable UI in components/ui.
- Keep API code in services/api layers.
- Never create one giant App.tsx.
- Never create one giant components folder containing the entire application.
- Use barrel exports only when they improve readability.
- Keep components small and composable.

## COMPONENT QUALITY
Create reusable components such as:
- AppSidebar
- AppHeader
- ThemeToggle
- MobileSidebar
- StatCard
- DataTable
- SearchInput
- EmptyState
- ErrorState
- PageHeader
- ConfirmDialog
- LoadingButton
- FormField
- PasswordInput
- PhoneInput
- StatusBadge

## THEME
Implement real light/dark theme support using Tailwind's class strategy.

Persist theme preference locally.

The UI must look intentionally designed in both themes. Do not simply invert colors.

## DATA LAYER
Create:
- Axios instance
- request/response error handling
- auth token interceptor abstraction
- query client
- mock API mode

Use:
VITE_USE_MOCK_API=true

When mock mode is enabled:
- login accepts a documented demo account
- dashboard uses realistic mock data
- no backend is required

When mock mode is disabled:
- all calls use VITE_API_BASE_URL

## SECURITY
Frontend security requirements:
- never hard-code secrets
- never expose private API keys
- never put passwords in localStorage
- keep authentication architecture ready for secure HttpOnly-cookie based sessions
- validate user input
- centralize API errors
- do not trust frontend authorization
- UI route guards are only for UX; backend must enforce authorization

## UX STATES
Every important screen must account for:
- loading
- success
- empty
- error
- disabled
- validation error

## CODE QUALITY
- TypeScript strict mode
- no any unless absolutely unavoidable
- no unused imports
- no duplicated constants
- semantic HTML
- reusable functions
- clear naming
- no placeholder lorem ipsum
- no console spam
- no fake API calls scattered throughout components

## DELIVERABLE
Generate the complete runnable project, not snippets.

Must include:
- package.json
- Vite configuration
- Tailwind configuration
- TypeScript configuration
- routing
- theme provider
- login page
- dashboard page
- reusable layout
- mock authentication
- mock dashboard data
- loading animation
- responsive design
- dark/light mode
- README with exact setup commands
- .env.example

Before finishing, verify:
1. npm install works
2. npm run dev works
3. login route renders
4. successful login reaches dashboard
5. protected dashboard redirects to login when unauthenticated
6. theme toggle works
7. logout works
8. mobile navigation works
9. TypeScript has no avoidable errors
10. no secret/API key is committed

Do not stop at a design mockup. Produce actual working React code with a clean architecture that can later connect to an Express/Node.js backend and SQL database.
