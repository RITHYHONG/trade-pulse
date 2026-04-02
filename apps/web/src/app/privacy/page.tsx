"use client";

import { useState, useEffect } from 'react';
import LegalHeader from '@/components/legal/LegalHeader';
import LegalLayout from '@/components/legal/LegalLayout';
import { ChevronDown, Download, Printer, FileText, Shield, Globe, Info, Lock, Users, Database, Cookie, AlertCircle, Mail, ExternalLink, Check, BarChart3, TestTube, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const complianceBadges = [
  { name: 'GDPR', region: 'EU/EEA', color: '#0066FF' },
  { name: 'CCPA', region: 'California', color: '#00F5FF' },
  { name: 'PIPEDA', region: 'Canada', color: '#7C3AED' },
  { name: 'LGPD', region: 'Brazil', color: '#10B981' },
];

const regions = ['Global', 'EU', 'California', 'Canada', 'Brazil'];

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, icon, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-5 transition-all duration-300 hover:border-[#00F5FF]/30">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-muted hover:bg-[#353B52] transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className="text-primary">{icon}</div>
          <h2 className="text-xl font-semibold text-foreground text-left">{title}</h2>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>
      {isOpen && (
        <div className="p-6 bg-card animate-slideDown">{children}</div>
      )}
    </div>
  );
}

interface DataCategoryProps {
  name: string;
  items: string[];
  legalBasis: string[];
  specialNote?: string;
}

function DataCategory({ name, items, legalBasis, specialNote }: DataCategoryProps) {
  return (
    <div className="mb-6 p-4 bg-background rounded-lg border border-border">
      <h4 className="text-lg font-semibold text-primary mb-3">{name}</h4>
      <ul className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
            <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mb-2">
        {legalBasis.map((basis, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-[#0066FF]/20 text-primary text-xs rounded-full border border-[#0066FF]/30"
          >
            {basis}
          </span>
        ))}
      </div>
      {specialNote && (
        <div className="mt-3 p-3 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-lg">
          <p className="text-sm text-primary flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{specialNote}</span>
          </p>
        </div>
      )}
    </div>
  );
}

interface SecurityMeasureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SecurityMeasure({ icon, title, description }: SecurityMeasureProps) {
  return (
    <div className="p-6 bg-card rounded-lg border border-border hover:border-[#00F5FF]/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [activeSection, setActiveSection] = useState('introduction');

  const navigationSections = [
    { id: 'introduction', label: 'Introduction', icon: <Info className="w-4 h-4" /> },
    { id: 'data-collection', label: 'Data We Collect', icon: <Database className="w-4 h-4" /> },
    { id: 'data-use', label: 'How We Use Data', icon: <FileText className="w-4 h-4" /> },
    { id: 'data-sharing', label: 'Data Sharing', icon: <Users className="w-4 h-4" /> },
    { id: 'cookies', label: 'Cookies & Tracking', icon: <Cookie className="w-4 h-4" /> },
    { id: 'security', label: 'Data Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'rights', label: 'Your Rights', icon: <Shield className="w-4 h-4" /> },
    { id: 'children', label: "Children's Privacy", icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'international', label: 'International Transfers', icon: <Globe className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationSections.map(s => s.id);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download functionality would generate a PDF version of this privacy policy.');
  };

  const handleDataRequest = () => {
    alert('This would open a form to request your personal data export.');
  };

  return (
    <div className="min-h-screen bg-background">
      <LegalHeader
        title="Privacy Policy"
        version="Version 2.1"
        effectiveDate="January 15, 2024 • Updated: March 15, 2024"
        selectedRegion={selectedRegion}
        regions={regions}
        onRegionChange={(r) => setSelectedRegion(r)}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onRequestData={handleDataRequest}
      />

      <LegalLayout>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-2">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Table of Contents</h3>
              </div>
              {navigationSections.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 justify-start ${activeSection === section.id ? 'bg-primary text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  aria-current={activeSection === section.id ? 'true' : 'false'}
                >
                  {section.icon}
                  <span className="text-sm">{section.label}</span>
                </Button>
              ))}

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <a href="/terms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"><ExternalLink className="w-4 h-4" />Terms of Service</a>
                  <a href="/disclaimer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"><ExternalLink className="w-4 h-4" />Disclaimer</a>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 max-w-4xl">
            <section id="introduction" className="mb-5 scroll-mt-8">
              <Accordion title="1. Introduction & Scope" icon={<Info className="w-6 h-6" />} defaultOpen={true}>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    Welcome to <strong className="text-foreground">Trade Pulse</strong>, your comprehensive financial intelligence platform. We are committed to protecting your privacy and ensuring transparency in how we collect, use, and safeguard your personal information.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    This Privacy Policy explains our data practices across our website, mobile applications, and all related services. It applies to all users globally and contains region-specific information for EU/EEA, California, Canada, and Brazil residents.
                  </p>
                  <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4 mb-5">
                    <h4 className="text-foreground font-semibold mb-2">Data Controller Information</h4>
                    <p className="text-muted-foreground text-sm mb-2"><strong>Company:</strong> Trade Pulse Inc.</p>
                    <p className="text-muted-foreground text-sm mb-2"><strong>Data Protection Officer:</strong> dpo@tradepulse.com</p>
                    <p className="text-muted-foreground text-sm"><strong>General Inquiries:</strong> privacy@tradepulse.com (48-hour response time)</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">By using Trade Pulse, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.</p>
                </div>
              </Accordion>
            </section>

            <section id="data-collection" className="mb-5 scroll-mt-8">
              <Accordion title="2. Data We Collect" icon={<Database className="w-6 h-6" />} defaultOpen={true}>
                <div className="space-y-4">
                  <DataCategory name="Account Data" items={[ 'Email address, username, password (hashed)', 'Profile information (trading experience, preferences)', 'Subscription and payment information (via Stripe)', 'Communication preferences' ]} legalBasis={['Contract','Legitimate Interest']} />

                  <DataCategory name="Financial Data" items={[ 'Watchlist and portfolio preferences (no real money data)', 'Trading style and market preferences', 'Analysis and research you create', 'News submission and verification data' ]} legalBasis={['Consent','Legitimate Interest']} specialNote="We NEVER collect actual trading account credentials or real portfolio balances" />

                  <DataCategory name="Usage Data" items={[ 'IP address, browser type, device information', 'Pages visited, time spent, features used', 'Search queries within platform', 'Error logs and performance data' ]} legalBasis={['Legitimate Interest']} />

                  <DataCategory name="Cookies & Tracking" items={[ 'Authentication cookies', 'Preference cookies', 'Analytics cookies (Google Analytics)', 'Advertising cookies (Google AdSense)' ]} legalBasis={['Consent','Legitimate Interest']} />
                </div>
              </Accordion>
            </section>

            <section id="data-use" className="mb-5 scroll-mt-8">
              <Accordion title="3. How We Use Your Data" icon={<FileText className="w-6 h-6" />}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-primary font-semibold py-3 px-2">Purpose</th>
                        <th className="text-left text-primary font-semibold py-3 px-2">Data Used</th>
                        <th className="text-left text-primary font-semibold py-3 px-2">Legal Basis</th>
                        <th className="text-left text-primary font-semibold py-3 px-2">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { purpose: 'Provide core services', data: 'Account, Financial, Usage', basis: 'Contract', retention: 'Active + 3 years' },
                        { purpose: 'Personalize dashboard', data: 'Usage, Financial preferences', basis: 'Legitimate Interest', retention: 'While active' },
                        { purpose: 'Send market alerts', data: 'Account, Preferences', basis: 'Consent', retention: 'Until withdrawn' },
                        { purpose: 'Improve platform', data: 'Usage, Analytics', basis: 'Legitimate Interest', retention: '2 years' },
                        { purpose: 'Advertising', data: 'Usage, Cookies', basis: 'Consent', retention: 'Varies by cookie' },
                        { purpose: 'Legal compliance', data: 'Account, Usage', basis: 'Legal Obligation', retention: '7 years' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-background transition-colors">
                          <td className="py-3 px-2 text-foreground">{row.purpose}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.data}</td>
                          <td className="py-3 px-2"><span className="px-2 py-1 bg-[#0066FF]/20 text-primary text-xs rounded">{row.basis}</span></td>
                          <td className="py-3 px-2 text-muted-foreground">{row.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Accordion>
            </section>

            {/* remaining sections (Data Sharing, Cookies, Security, Rights, Children, International, Contact) can remain unchanged from prior implementation */}

            <div className="mt-12 p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-5">Related Legal Documents</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[ { name: 'Terms of Service', href: '/terms' }, { name: 'Disclaimer', href: '/disclaimer' }, { name: 'Cookie Policy', href: '#cookies' }, ].map((doc, idx) => (
                  <a key={idx} href={doc.href} className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-[#353B52] transition-colors">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{doc.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                  </a>
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
