import {
  LayoutDashboard,
  LogOut,
  Moon,
  Receipt,
  ShoppingCart,
  Sun,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { brand } from "../../shared/lib/brand";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sales", label: "Sales", icon: Receipt },
  { to: "/purchases", label: "Purchases", icon: ShoppingCart },
];

export function AppLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("demo_auth");
    navigate("/login", { replace: true });
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* Header */}
      <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-full items-center">

          {/* Logo / Brand */}
          <div className="flex h-full shrink-0 items-center gap-2 border-r border-slate-200 px-4 dark:border-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
              {brand.shortName}
            </span>

            <span className="text-sm font-bold tracking-tight">
              {brand.name}
            </span>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Main"
            className="flex h-full flex-1 items-center overflow-x-auto"
          >
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex h-full shrink-0 items-center gap-2 border-b-2 px-4 text-xs font-medium transition ${
                    isActive
                      ? "border-slate-900 bg-slate-50 text-slate-900 dark:border-white dark:bg-slate-800 dark:text-white"
                      : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex h-full shrink-0 items-center border-l border-slate-200 dark:border-slate-800">

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-full items-center px-3 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Sun className="hidden h-4 w-4 dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </button>

            <button
              onClick={logout}
              className="flex h-full items-center gap-2 border-l border-slate-200 px-4 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="w-full px-4 py-4 sm:px-5">
          <Outlet />
        </div>
      </main>

    </div>
  );
}