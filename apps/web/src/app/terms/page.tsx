import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service',
  description:
    'Trader Pulse Terms of Service. Review site rules, user responsibilities, and legal agreements for using Trader Pulse.',
  path: '/terms',
});

export default function Page() {
  return (
    <main className="container mx-auto px-8 py-16 prose prose-invert">
      <h1>Terms of Service</h1>

      <p>Effective date: January 1, 2025</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        These Terms of Service ("Terms") govern your access to and use of Trader Pulse ("Service"). By using the Service you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>2. Services</h2>
      <p>
        Trader Pulse provides market data, analysis, and educational content. Features may change over time and we reserve the right to modify or discontinue features without notice.
      </p>

      <h2>3. Accounts and Registration</h2>
      <p>
        You are responsible for maintaining the security of your account and for all activities that occur under your account.
      </p>

      <h2>4. User Conduct</h2>
      <p>
        You agree not to use the Service for illegal activities, to harm others, or to interfere with the Service's operation. You agree to comply with applicable laws and regulations.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        The Service and its original content, features and functionality are and will remain the exclusive property of Trader Pulse and its licensors.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        The Service is provided "as is" without warranties of any kind. Trader Pulse does not provide financial advice and the information provided is for informational purposes only.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the extent permitted by law, Trader Pulse (and its officers, directors, employees and agents) will not be liable for any indirect, incidental, special, consequential or punitive damages.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate your access for any reason, including violation of these Terms.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the state in which Trader Pulse is incorporated, without regard to conflict of law principles.
      </p>

      <h2>10. Contact</h2>
      <p>
        If you have questions, contact us at <a href="mailto:support@traderpulse.com">support@traderpulse.com</a>.
      </p>
    </main>
  );
} 