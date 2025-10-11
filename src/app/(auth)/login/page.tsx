import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-8 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 text-slate-100">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Sign in to Trade Pulse</h1>
        <p className="text-sm text-slate-300/80">
          Welcome back. Securely access your dashboard and alerts.
        </p>
      </div>

      <form className="space-y-4">
        <label className="block text-left text-sm font-medium text-slate-200">
          Email
          <input
            type="email"
            name="email"
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block text-left text-sm font-medium text-slate-200">
          Password
          <input
            type="password"
            name="password"
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            placeholder="••••••••"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Continue
        </button>
      </form>

      <div className="text-center text-sm text-slate-400">
        <Link href="/forgot-password" className="text-sky-400 hover:text-sky-300">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}