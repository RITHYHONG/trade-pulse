import React from 'react';
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import LegalLayout from '@/components/legal/LegalLayout';
import LegalHeader from '@/components/legal/LegalHeader';
import LegalTLDR from '@/components/legal/LegalTLDR';
import { 
  Shield, 
  UserCheck, 
  Scale, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Globe, 
  Mail,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service',
  description:
    'Trader Pulse Terms of Service. Review site rules, user responsibilities, and legal agreements for using Trader Pulse.',
  path: '/terms',
});

interface TermSectionProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function TermSection({ number, title, icon, children }: TermSectionProps) {
  return (
    <section className="mb-20 last:mb-0 group">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:border-blue-500/30 transition-all duration-300 shadow-sm">
          {icon}
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
            Section {number}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>
      </div>
      
      <div className="pl-0 sm:pl-16">
        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-slate-500 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 no-underline hover:prose-a:underline">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <LegalLayout>
      <LegalHeader
        title="Terms of Service"
        version="v1.2.0"
        updated="January 1, 2025"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-24">
          <LegalTLDR
            summary="Short: know rules, account responsibilities, and jurisdictional limits — read before using the platform."
            bullets={[
              'Follow account security responsibilities',
              'Platform rules may change; check updates',
              'Jurisdictional law governs disputes',
            ]}
          />
        </div>

        <div className="space-y-4">
          <TermSection number="01" title="Acceptance of Terms" icon={<UserCheck className="w-6 h-6" />}>
            <p>
              These Terms of Service ("Terms") govern your access to and use of <strong>Trader Pulse</strong> ("Service"). By accessing or using the Service, you signify your agreement to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
            </p>
            <p>
              Your use of the Service is also subject to our <a href="/privacy">Privacy Policy</a>, which explains how we collect, use, and share your information.
            </p>
          </TermSection>

          <TermSection number="02" title="Services & Platform" icon={<Globe className="w-6 h-6" />}>
            <p>
              Trader Pulse provides market data, financial analysis tools, and educational content. We are constantly innovating to provide the best possible experience for our users.
            </p>
            <p>
              You acknowledge and agree that the form and nature of the Services which Trader Pulse provides may change from time to time without prior notice to you. We reserve the right to modify, suspend or discontinue the Service (or any part thereof) at any time.
            </p>
          </TermSection>

          <TermSection number="03" title="Accounts and Registration" icon={<Lock className="w-6 h-6" />}>
            <p>
              To access certain features of the Service, you may be required to register for an account. When you register, you agree to provide accurate, current, and complete information.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 mt-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Security Responsibilities
              </h4>
              <ul className="grid gap-3 list-none p-0 m-0">
                {[
                  'Maintain the confidentiality of your password',
                  'Notify us immediately of any unauthorized use',
                  'You are soleley responsible for any activity under your account'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TermSection>

          <TermSection number="04" title="User Conduct" icon={<Shield className="w-6 h-6" />}>
            <p>
              You agree not to use the Service for any purpose that is prohibited by these Terms. You are responsible for all of your activity in connection with the Service.
            </p>
            <p>
              Prohibited activities include, but are not limited to: 
              interfering with the proper working of the Service, 
              attempting to bypass any measures we may use to prevent or restrict access, 
              or using any manual or automated software to "crawl" or "spider" any page of the Service.
            </p>
          </TermSection>

          <TermSection number="05" title="Intellectual Property" icon={<FileText className="w-6 h-6" />}>
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Trader Pulse and its licensors. 
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Trader Pulse.
            </p>
          </TermSection>

          <TermSection number="06" title="Disclaimers" icon={<AlertTriangle className="w-6 h-6" />}>
            <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-8">
              <p className="text-amber-800 dark:text-amber-400 font-medium mb-4 italic">
                "The Service is provided on an 'AS IS' and 'AS AVAILABLE' basis."
              </p>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed mb-0">
                Trader Pulse does not provide financial, investment, legal, or tax advice. All information provided through the Service is for informational purposes only and should not be relied upon for making any investment decisions.
              </p>
            </div>
          </TermSection>

          <TermSection number="07" title="Limitation of Liability" icon={<Shield className="w-6 h-6" />}>
            <p>
              In no event shall Trader Pulse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </TermSection>

          <TermSection number="08" title="Governing Law" icon={<Scale className="w-6 h-6" />}>
            <p>
              These Terms shall be governed and construed in accordance with the laws of our operating jurisdiction, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </TermSection>

          <TermSection number="09" title="Contact Us" icon={<Mail className="w-6 h-6" />}>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-8 p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Mail className="w-32 h-32" />
              </div>
              <h4 className="text-xl font-bold mb-2 relative z-10">Have questions?</h4>
              <p className="text-blue-100 mb-6 relative z-10 max-w-sm">
                Our legal team is here to help you understand your rights and responsibilities.
              </p>
              <a 
                href="mailto:support@traderpulse.com" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors relative z-10"
              >
                support@traderpulse.com
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </TermSection>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Trader Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
 