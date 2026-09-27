import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Moon, Sun, LockKeyhole, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("demo_auth", "true");
      navigate("/dashboard");
    }, 700);
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="absolute right-5 top-5">
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Toggle theme"
        >
          <Sun className="hidden h-5 w-5 dark:block" />
          <Moon className="h-5 w-5 dark:hidden" />
        </button>
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <section className="hidden flex-col justify-center px-12 lg:flex">
          <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white dark:bg-white dark:text-slate-900">
            B
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Smart billing
          </p>
          <h1 className="max-w-lg text-5xl font-bold leading-tight">
            Run your business from one simple dashboard.
          </h1>
          <p className="mt-5 max-w-lg text-slate-600 dark:text-slate-400">
            Sales, purchases, inventory and reports — organized for fast everyday billing.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500">Welcome back</p>
              <h2 className="mt-2 text-3xl font-bold">Sign in to BillPro</h2>
              <p className="mt-2 text-sm text-slate-500">
                Use your registered phone number and password.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Phone number</span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
                  <Phone className="mr-2 h-4 w-4 text-slate-400" />
                  <span className="mr-2 text-sm text-slate-400">+91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full bg-transparent py-3.5 outline-none"
                    placeholder="9876543210"
                    inputMode="numeric"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Password</span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
                  <LockKeyhole className="mr-2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3.5 outline-none"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="p-1 text-slate-400"
                    aria-label="Show or hide password"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  Remember me
                </label>
                <button type="button" className="font-medium underline underline-offset-4">
                  Forgot password?
                </button>
              </div>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-slate-900"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
