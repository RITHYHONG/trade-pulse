import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Cookie Policy',
  description: 'Trader Pulse Cookie Policy detailing how cookies and similar technologies are used on the site.',
  path: '/cookies',
});

export const dynamic = 'force-dynamic';

export default function CookiesPage() {
  return (
    <main className="container mx-auto px-8 py-16 prose prose-invert">
      <h1>Cookie Policy</h1>

      <p>Last updated: January 20, 2026</p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device to help the site provide a better user experience. They allow us to remember your preferences and understand site usage.
      </p>

      <h2>How we use cookies</h2>
      <ul>
        <li><strong>Essential:</strong> Required for core site functions.</li>
        <li><strong>Analytics:</strong> Help us understand how users interact with the site so we can improve it.</li>
        <li><strong>Marketing:</strong> Used to personalize content and measure campaign performance.</li>
      </ul>

      <h2>Third-party cookies</h2>
      <p>
        We may allow third parties (analytics and advertising providers) to set cookies. These third parties have their own cookie policies.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can control cookies through your browser settings or opt-out tools. Disabling non-essential cookies may limit site functionality.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about our Cookie Policy, contact <a href="mailto:privacy@traderpulse.com">privacy@traderpulse.com</a>.
      </p>
    </main>
  );
} 
