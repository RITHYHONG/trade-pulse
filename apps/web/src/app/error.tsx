'use client';

import Link from "next/link";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-100 m-24">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-sm opacity-80">{error.message}</p>
      <div className="mt-6 flex items-center justify-center gap-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-full bg-rose-500 px-6 font-semibold text-rose-50 transition hover:bg-rose-400"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full border border-rose-400 px-6 font-semibold text-rose-200 transition hover:border-rose-300"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}