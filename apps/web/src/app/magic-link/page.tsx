"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { completeMagicSignIn } from '@/lib/auth';
import { toast } from 'sonner';

export default function MagicLinkPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [needEmail, setNeedEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Try to complete sign-in using saved email
        const savedEmail = typeof window !== 'undefined' ? window.localStorage.getItem('magic_email') || undefined : undefined;
        const user = await completeMagicSignIn(savedEmail);

        // Exchange token for secure cookies via server-side verification endpoint
        const idToken = await user.getIdToken();
        await fetch('/api/auth/magic-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, email: user.email, displayName: user.displayName }),
        });

        toast.success('Signed in successfully');
        router.replace('/');
      } catch (e) {
        console.error(e);
        // If the error is about missing email, prompt the user to enter it (e.g., clicked link on a different device)
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.toLowerCase().includes('missing email') || msg.toLowerCase().includes('missing')) {
          setNeedEmail(true);
          setProcessing(false);
          return;
        }

        toast.error('Magic link sign-in failed. Please try signing in again.');
        router.replace('/login');
      } finally {
        if (!needEmail) setProcessing(false);
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        {processing && (
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Completing sign-in…</h1>
            <p className="text-slate-400 mt-2">This may take a moment. You will be redirected shortly.</p>
          </div>
        )}

        {needEmail && (
          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white">Enter your email</h2>
            <p className="text-slate-400 mt-2">It looks like you opened the sign-in link on a different device. Enter the email address you used to request the link.</p>

            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                setSubmittingEmail(true);
                try {
                  const user = await completeMagicSignIn(email || undefined);
                  const idToken = await user.getIdToken();
                  await fetch('/api/auth/magic-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken, email: user.email, displayName: user.displayName }),
                  });
                  toast.success('Signed in successfully');
                  router.replace('/');
                } catch (err) {
                  console.error(err);
                  toast.error('Failed to complete sign-in. Check the email and try again.');
                } finally {
                  setSubmittingEmail(false);
                }
              }}
              className="mt-4 space-y-4"
            >
              <label className="block">
                <span className="text-sm text-slate-300">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-white"
                  placeholder="you@example.com"
                  aria-label="Email address used to request magic link"
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-primary text-white rounded-md"
                  disabled={submittingEmail}
                >
                  {submittingEmail ? 'Signing in…' : 'Complete sign-in'}
                </button>
                <button
                  type="button"
                  className="h-10 px-4 rounded-md border border-slate-600 text-slate-300"
                  onClick={() => router.replace('/login')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
