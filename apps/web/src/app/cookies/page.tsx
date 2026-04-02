"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CookiesPage() {
  const router = useRouter();

  useEffect(() => {
    // Preserve old URL but forward users to interactive cookie policy
    router.replace('/cookie-policy');
  }, [router]);

  return (
    <main className="container mx-auto px-8 py-16 prose prose-invert">
      <h1>Redirecting…</h1>
      <p>If you are not redirected automatically, <a href="/cookie-policy">click here to view the cookie policy</a>.</p>
    </main>
  );
}
