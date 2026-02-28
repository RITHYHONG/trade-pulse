'use client';

interface AlertsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AlertsError({ error, reset }: AlertsErrorProps) {
  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
      <h2 className="text-lg font-semibold">Alerts failed to load</h2>
      <p className="mt-2 text-sm opacity-80">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-rose-500 px-4 text-sm font-semibold text-rose-50 transition hover:bg-rose-400"
      >
        Retry
      </button>
    </div>
  );
}
