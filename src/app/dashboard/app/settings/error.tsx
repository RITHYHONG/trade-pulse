'use client';

interface SettingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
      <h2 className="text-lg font-semibold">Settings are temporarily unavailable</h2>
      <p className="mt-2 text-sm opacity-75">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-rose-500 px-4 text-sm font-semibold text-rose-50 transition hover:bg-rose-400"
      >
        Reload
      </button>
    </div>
  );
}
