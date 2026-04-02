"use client";

import { useState, useEffect } from 'react';
import LegalHeader from '@/components/legal/LegalHeader';
import LegalLayout from '@/components/legal/LegalLayout';
import {
  ChevronDown,
  FileText,
  Shield,
  Users,
  AlertCircle,
  Scale,
  Ban,
  Gavel,
  Mail,
  ExternalLink,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id: string;
}

function Accordion({ title, icon, children, defaultOpen = false, id }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-5 transition-all duration-300 hover:border-[#00F5FF]/30">
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-muted hover:bg-[#353B52] transition-colors"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <div className="flex items-center gap-4">
          <div className="text-primary">{icon}</div>
          <span className="text-xl font-semibold text-foreground text-left">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>
      {isOpen && (
        <div id={`${id}-content`} className="p-6 bg-card animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );
}

const navigationSections = [
  { id: 'acceptance', label: '1. Acceptance of Terms', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'services', label: '2. Services', icon: <Info className="w-4 h-4" /> },
  { id: 'accounts', label: '3. Accounts & Registration', icon: <Users className="w-4 h-4" /> },
  { id: 'conduct', label: '4. User Conduct', icon: <Ban className="w-4 h-4" /> },
  { id: 'ip', label: '5. Intellectual Property', icon: <Shield className="w-4 h-4" /> },
  { id: 'disclaimers', label: '6. Disclaimers', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'liability', label: '7. Limitation of Liability', icon: <Scale className="w-4 h-4" /> },
  { id: 'termination', label: '8. Termination', icon: <Ban className="w-4 h-4" /> },
  { id: 'governing-law', label: '9. Governing Law', icon: <Gavel className="w-4 h-4" /> },
  { id: 'contact', label: '10. Contact', icon: <Mail className="w-4 h-4" /> },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    const handleScroll = () => {
      for (const section of navigationSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDownload = () => {
    alert('Download functionality would generate a PDF version of these Terms of Service.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <LegalHeader
        title="Terms of Service"
        version="Version 1.2"
        effectiveDate="January 1, 2025 • Updated: March 1, 2025"
        onDownload={handleDownload}
        onPrint={handlePrint}
      />

      <LegalLayout>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-2">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Table of Contents
                </h2>
              </div>
              {navigationSections.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 justify-start ${
                    activeSection === section.id
                      ? 'bg-primary text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  aria-current={activeSection === section.id ? 'location' : undefined}
                >
                  {section.icon}
                  <span className="text-sm">{section.label}</span>
                </Button>
              ))}

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Related Documents
                </h3>
                <div className="space-y-2">
                  <Link href="/privacy" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Privacy Policy
                  </Link>
                  <Link href="/disclaimer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Disclaimer
                  </Link>
                  <Link href="/cookie-policy" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 max-w-4xl">
            <section id="acceptance" className="mb-5 scroll-mt-8">
              <Accordion id="acceptance" title="1. Acceptance of Terms" icon={<CheckCircle className="w-6 h-6" />} defaultOpen>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of{' '}
                    <strong className="text-foreground">Trade Pulse</strong> (&ldquo;Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
                    By accessing or using the Service, you confirm that you are at least 18 years old
                    and agree to be bound by these Terms.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you do not agree to these Terms, you must not access or use the Service. We
                    reserve the right to update these Terms at any time. Continued use after changes
                    constitutes acceptance of the revised Terms.
                  </p>
                  <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Last Updated:</strong> March 1, 2025.
                      Material changes will be communicated via email or an in-app notification at
                      least 14 days before they take effect.
                    </p>
                  </div>
                </div>
              </Accordion>
            </section>

            <section id="services" className="mb-5 scroll-mt-8">
              <Accordion id="services" title="2. Services" icon={<Info className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Trade Pulse provides market data, financial analysis tools, news aggregation,
                    educational content, and community features designed to assist individual
                    investors and traders in making informed decisions.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Real-time and delayed market data from third-party providers',
                      'AI-assisted analysis and research tools',
                      'Portfolio and watchlist tracking (no real funds handled)',
                      'Community discussion boards and news feeds',
                      'Educational articles, tutorials, and webinars',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Features may change over time. We reserve the right to modify, suspend, or
                    discontinue any part of the Service at any time without prior notice or
                    liability.
                  </p>
                </div>
              </Accordion>
            </section>

            <section id="accounts" className="mb-5 scroll-mt-8">
              <Accordion id="accounts" title="3. Accounts &amp; Registration" icon={<Users className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    To access certain features you must create an account. You agree to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Provide accurate, current, and complete registration information',
                      'Maintain the security of your account credentials',
                      'Accept responsibility for all activities occurring under your account',
                      'Notify us immediately of any unauthorized use at support@traderpulse.com',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">One account per person.</strong> Creating
                      multiple accounts to circumvent restrictions or bans is prohibited and will
                      result in permanent suspension.
                    </p>
                  </div>
                </div>
              </Accordion>
            </section>

            <section id="conduct" className="mb-5 scroll-mt-8">
              <Accordion id="conduct" title="4. User Conduct" icon={<Ban className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree not to use the Service to:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Violate any applicable local, state, national, or international law',
                      'Engage in market manipulation, spread false financial information, or conduct pump-and-dump schemes',
                      'Harass, threaten, or harm other users',
                      'Upload or transmit malware, viruses, or malicious code',
                      'Scrape, harvest, or systematically extract data without written consent',
                      'Impersonate Trade Pulse staff or other users',
                      'Attempt to gain unauthorized access to any part of the Service',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4 text-[#EF4444] mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Violation of these conduct rules may result in immediate suspension or permanent
                    termination of your account, and may be reported to relevant authorities.
                  </p>
                </div>
              </Accordion>
            </section>

            <section id="ip" className="mb-5 scroll-mt-8">
              <Accordion id="ip" title="5. Intellectual Property" icon={<Shield className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The Service and all its original content, features, and functionality—including
                    but not limited to text, graphics, logos, icons, images, audio clips, and
                    software—are the exclusive property of Trade Pulse Inc. and its licensors, and
                    are protected by applicable intellectual property laws.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You are granted a limited, non-exclusive, non-transferable, revocable license to
                    access and use the Service for personal, non-commercial purposes. You may not:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Copy, reproduce, or redistribute any Service content without written permission',
                      'Create derivative works based on the Service',
                      'Use Trade Pulse trademarks without prior written consent',
                      'Reverse-engineer or decompile any software component of the Service',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4 text-[#EF4444] mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Content you submit (comments, analysis, forum posts) remains yours, but you
                    grant us a worldwide, royalty-free license to display and distribute it within
                    the Service.
                  </p>
                </div>
              </Accordion>
            </section>

            <section id="disclaimers" className="mb-5 scroll-mt-8">
              <Accordion id="disclaimers" title="6. Disclaimers" icon={<AlertCircle className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-4">
                    <p className="text-[#EF4444] font-semibold mb-2">⚠ NOT FINANCIAL ADVICE</p>
                    <p className="text-muted-foreground text-sm">
                      Nothing on Trade Pulse constitutes investment, financial, legal, or tax advice.
                      All content is provided for informational and educational purposes only. Always
                      consult a qualified financial advisor before making investment decisions.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
                    of any kind, express or implied, including but not limited to warranties of
                    merchantability, fitness for a particular purpose, or non-infringement.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not warrant that the Service will be uninterrupted, error-free, or that
                    any defects will be corrected. Market data may be delayed and is not guaranteed
                    to be accurate, complete, or timely.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    See our full{' '}
                    <Link href="/disclaimer" className="text-primary hover:underline">
                      Risk Disclaimer
                    </Link>{' '}
                    for a detailed disclosure of trading risks.
                  </p>
                </div>
              </Accordion>
            </section>

            <section id="liability" className="mb-5 scroll-mt-8">
              <Accordion id="liability" title="7. Limitation of Liability" icon={<Scale className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    To the fullest extent permitted by law, Trade Pulse Inc. and its officers,
                    directors, employees, and agents shall not be liable for any:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Indirect, incidental, special, consequential, or punitive damages',
                      'Loss of profits, revenue, data, or goodwill',
                      'Trading losses or investment decisions made based on Service content',
                      'Damages arising from unauthorized access to or alteration of your data',
                      'Damages resulting from reliance on any information obtained through the Service',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <Scale className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Liability cap:</strong> Our total
                      liability to you for any claims under these Terms shall not exceed the greater
                      of (a) the amount you paid us in the 12 months preceding the claim or (b)
                      USD&nbsp;100.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Some jurisdictions do not allow the exclusion of certain warranties or the
                    limitation of liability for certain types of damages, so some of the above
                    limitations may not apply to you.
                  </p>
                </div>
              </Accordion>
            </section>

            <section id="termination" className="mb-5 scroll-mt-8">
              <Accordion id="termination" title="8. Termination" icon={<Ban className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We may suspend or terminate your access to the Service immediately, without
                    prior notice or liability, for any reason, including violation of these Terms.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You may close your account at any time from your account settings. Upon
                    termination:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Your right to access the Service ceases immediately',
                      'We may delete your account data per our retention policy (see Privacy Policy)',
                      'Active subscriptions are non-refundable except where required by law',
                      'Provisions of these Terms that by their nature should survive termination will survive',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion>
            </section>

            <section id="governing-law" className="mb-5 scroll-mt-8">
              <Accordion id="governing-law" title="9. Governing Law &amp; Disputes" icon={<Gavel className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms are governed by and construed in accordance with the laws of the
                    State of Delaware, United States, without regard to conflict of law principles.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Any dispute, claim, or controversy arising out of or relating to these Terms
                    shall first be resolved through good-faith negotiation. If unresolved after
                    30 days, disputes shall be submitted to binding arbitration administered by the
                    American Arbitration Association (AAA) in accordance with its Commercial
                    Arbitration Rules.
                  </p>
                  <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Class action waiver:</strong> You agree
                      that any arbitration or legal proceeding shall be conducted only on an
                      individual basis and not as part of a class, consolidated, or representative
                      action.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    If you are an EU consumer, mandatory consumer-protection laws of your country
                    of residence may apply alongside or instead of these provisions.
                  </p>
                </div>
              </Accordion>
            </section>

            <section id="contact" className="mb-5 scroll-mt-8">
              <Accordion id="contact" title="10. Contact Us" icon={<Mail className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions, concerns, or requests relating to these Terms, please
                    contact us:
                  </p>
                  <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4 space-y-2">
                    <p className="text-muted-foreground text-sm">
                      <strong className="text-foreground">Email:</strong>{' '}
                      <a href="mailto:legal@traderpulse.com" className="text-primary hover:underline">
                        legal@traderpulse.com
                      </a>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      <strong className="text-foreground">General Support:</strong>{' '}
                      <a href="mailto:support@traderpulse.com" className="text-primary hover:underline">
                        support@traderpulse.com
                      </a>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      <strong className="text-foreground">Response time:</strong> We aim to respond
                      to all legal inquiries within 5 business days.
                    </p>
                  </div>
                </div>
              </Accordion>
            </section>

            <div className="mt-12 p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-5">Related Legal Documents</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Disclaimer', href: '/disclaimer' },
                  { name: 'Cookie Policy', href: '/cookie-policy' },
                ].map((doc, idx) => (
                  <Link
                    key={idx}
                    href={doc.href}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-[#353B52] transition-colors"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{doc.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </LegalLayout>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
} 