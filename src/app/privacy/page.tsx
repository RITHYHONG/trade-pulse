'use client';

import { useState, useEffect } from 'react';
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
    <div className="border border-[#2D3246] rounded-lg overflow-hidden mb-5 transition-all duration-300 hover:border-[#00F5FF]/30">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-[#2D3246] hover:bg-[#353B52] transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className="text-[#00F5FF]">{icon}</div>
          <h2 className="text-xl font-semibold text-white text-left">{title}</h2>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#00F5FF] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </Button>
      {isOpen && (
        <div className="p-6 bg-[#1A1D28] animate-slideDown">
          {children}
        </div>
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
    <div className="mb-6 p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
      <h4 className="text-lg font-semibold text-[#00F5FF] mb-3">{name}</h4>
      <ul className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
            <Check className="w-4 h-4 text-[#00F5FF] mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mb-2">
        {legalBasis.map((basis, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-[#0066FF]/20 text-[#00F5FF] text-xs rounded-full border border-[#0066FF]/30"
          >
            {basis}
          </span>
        ))}
      </div>
      {specialNote && (
        <div className="mt-3 p-3 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-lg">
          <p className="text-sm text-[#00F5FF] flex items-start gap-2">
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
    <div className="p-6 bg-[#1A1D28] rounded-lg border border-[#2D3246] hover:border-[#00F5FF]/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-[#A0A0A0] text-sm">{description}</p>
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
    { id: 'children', label: 'Children\'s Privacy', icon: <AlertCircle className="w-4 h-4" /> },
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
    <div className="min-h-screen bg-[#0F1116]">
      {/* Header */}
      <div className="border-b border-[#2D3246] bg-[#1A1D28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">

          {/* Title & Version */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-[#0066FF]/20 text-[#00F5FF] text-sm rounded-full border border-[#0066FF]/30">
                  Version 2.1
                </span>
                <span className="text-[#A0A0A0] text-sm">
                  Effective: January 15, 2024 • Updated: March 15, 2024
                </span>
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-2">
              {complianceBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: `${badge.color}15`,
                    borderColor: `${badge.color}50`,
                  }}
                >
                  <div className="text-sm font-semibold" style={{ color: badge.color }}>
                    {badge.name}
                  </div>
                  <div className="text-xs text-[#A0A0A0]">{badge.region}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Region Selector & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#00F5FF]" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#2D3246] text-white px-4 py-2 rounded-lg border border-[#2D3246] hover:border-[#00F5FF]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/50"
                aria-label="Select your region"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
                aria-label="Download PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
              <Button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
                aria-label="Print"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                onClick={handleDataRequest}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#0052CC] transition-colors"
                aria-label="Request your data"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Request Data</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-2">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide mb-3">
                  Table of Contents
                </h3>
              </div>
              {navigationSections.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 justify-start ${activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-[#A0A0A0] hover:bg-[#2D3246] hover:text-white'
                    }`}
                  aria-current={activeSection === section.id ? 'true' : 'false'}
                >
                  {section.icon}
                  <span className="text-sm">{section.label}</span>
                </Button>
              ))}

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-[#2D3246]">
                <h3 className="text-sm font-semibold text-[#A0A0A0] uppercase tracking-wide mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <a
                    href="/terms"
                    className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-[#00F5FF] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Terms of Service
                  </a>
                  <a
                    href="/disclaimer"
                    className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-[#00F5FF] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Disclaimer
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 max-w-4xl">
            {/* Introduction */}
            <section id="introduction" className="mb-5 scroll-mt-8">
              <Accordion
                title="1. Introduction & Scope"
                icon={<Info className="w-6 h-6" />}
                defaultOpen={true}
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#A0A0A0] leading-relaxed mb-5">
                    Welcome to <strong className="text-white">Trade Pulse</strong>, your comprehensive financial intelligence platform. We are committed to protecting your privacy and ensuring transparency in how we collect, use, and safeguard your personal information.
                  </p>
                  <p className="text-[#A0A0A0] leading-relaxed mb-5">
                    This Privacy Policy explains our data practices across our website, mobile applications, and all related services. It applies to all users globally and contains region-specific information for EU/EEA, California, Canada, and Brazil residents.
                  </p>
                  <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4 mb-5">
                    <h4 className="text-white font-semibold mb-2">Data Controller Information</h4>
                    <p className="text-[#A0A0A0] text-sm mb-2">
                      <strong>Company:</strong> Trade Pulse Inc.
                    </p>
                    <p className="text-[#A0A0A0] text-sm mb-2">
                      <strong>Data Protection Officer:</strong> dpo@tradepulse.com
                    </p>
                    <p className="text-[#A0A0A0] text-sm">
                      <strong>General Inquiries:</strong> privacy@tradepulse.com (48-hour response time)
                    </p>
                  </div>
                  <p className="text-[#A0A0A0] leading-relaxed">
                    By using Trade Pulse, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                  </p>
                </div>
              </Accordion>
            </section>

            {/* Data Collection */}
            <section id="data-collection" className="mb-5 scroll-mt-8">
              <Accordion
                title="2. Data We Collect"
                icon={<Database className="w-6 h-6" />}
                defaultOpen={true}
              >
                <div className="space-y-4">
                  <DataCategory
                    name="Account Data"
                    items={[
                      'Email address, username, password (hashed)',
                      'Profile information (trading experience, preferences)',
                      'Subscription and payment information (via Stripe)',
                      'Communication preferences',
                    ]}
                    legalBasis={['Contract', 'Legitimate Interest']}
                  />

                  <DataCategory
                    name="Financial Data"
                    items={[
                      'Watchlist and portfolio preferences (no real money data)',
                      'Trading style and market preferences',
                      'Analysis and research you create',
                      'News submission and verification data',
                    ]}
                    legalBasis={['Consent', 'Legitimate Interest']}
                    specialNote="We NEVER collect actual trading account credentials or real portfolio balances"
                  />

                  <DataCategory
                    name="Usage Data"
                    items={[
                      'IP address, browser type, device information',
                      'Pages visited, time spent, features used',
                      'Search queries within platform',
                      'Error logs and performance data',
                    ]}
                    legalBasis={['Legitimate Interest']}
                  />

                  <DataCategory
                    name="Cookies & Tracking"
                    items={[
                      'Authentication cookies',
                      'Preference cookies',
                      'Analytics cookies (Google Analytics)',
                      'Advertising cookies (Google AdSense)',
                    ]}
                    legalBasis={['Consent', 'Legitimate Interest']}
                  />
                </div>
              </Accordion>
            </section>

            {/* Data Use */}
            <section id="data-use" className="mb-5 scroll-mt-8">
              <Accordion title="3. How We Use Your Data" icon={<FileText className="w-6 h-6" />}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2D3246]">
                        <th className="text-left text-[#00F5FF] font-semibold py-3 px-2">Purpose</th>
                        <th className="text-left text-[#00F5FF] font-semibold py-3 px-2">Data Used</th>
                        <th className="text-left text-[#00F5FF] font-semibold py-3 px-2">Legal Basis</th>
                        <th className="text-left text-[#00F5FF] font-semibold py-3 px-2">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          purpose: 'Provide core services',
                          data: 'Account, Financial, Usage',
                          basis: 'Contract',
                          retention: 'Active + 3 years',
                        },
                        {
                          purpose: 'Personalize dashboard',
                          data: 'Usage, Financial preferences',
                          basis: 'Legitimate Interest',
                          retention: 'While active',
                        },
                        {
                          purpose: 'Send market alerts',
                          data: 'Account, Preferences',
                          basis: 'Consent',
                          retention: 'Until withdrawn',
                        },
                        {
                          purpose: 'Improve platform',
                          data: 'Usage, Analytics',
                          basis: 'Legitimate Interest',
                          retention: '2 years',
                        },
                        {
                          purpose: 'Advertising',
                          data: 'Usage, Cookies',
                          basis: 'Consent',
                          retention: 'Varies by cookie',
                        },
                        {
                          purpose: 'Legal compliance',
                          data: 'Account, Usage',
                          basis: 'Legal Obligation',
                          retention: '7 years',
                        },
                      ].map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-[#2D3246]/50 hover:bg-[#0F1116] transition-colors"
                        >
                          <td className="py-3 px-2 text-white">{row.purpose}</td>
                          <td className="py-3 px-2 text-[#A0A0A0]">{row.data}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-1 bg-[#0066FF]/20 text-[#00F5FF] text-xs rounded">
                              {row.basis}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-[#A0A0A0]">{row.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Accordion>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing" className="mb-5 scroll-mt-8">
              <Accordion title="4. Data Sharing & Third Parties" icon={<Users className="w-6 h-6" />}>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Service Providers',
                      description: 'Process data on our behalf',
                      examples: ['Cloud hosting (AWS, Google Cloud)', 'Payment processors (Stripe)', 'Email services (SendGrid)', 'Analytics (Google Analytics, Mixpanel)'],
                      protection: 'GDPR-compliant contracts',
                    },
                    {
                      name: 'Advertising Partners',
                      description: 'Only with explicit consent',
                      examples: ['Google AdSense', 'Affiliate networks', 'Social media platforms', 'Email marketing platforms'],
                      protection: 'Cookie consent required',
                    },
                    {
                      name: 'Legal & Regulatory',
                      description: 'When required by law',
                      examples: ['Law enforcement requests', 'Regulatory bodies', 'Court orders'],
                      protection: 'Minimum necessary disclosure',
                    },
                    {
                      name: 'Business Transfers',
                      description: 'In case of merger/acquisition',
                      examples: ['Company sale', 'Asset transfer', 'Business restructuring'],
                      protection: 'Contractual protections',
                    },
                  ].map((category, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-[#0F1116] rounded-lg border border-[#2D3246] hover:border-[#00F5FF]/30 transition-all"
                    >
                      <h4 className="text-lg font-semibold text-[#00F5FF] mb-2">{category.name}</h4>
                      <p className="text-sm text-[#A0A0A0] mb-3">{category.description}</p>
                      <ul className="space-y-1 mb-3">
                        {category.examples.map((example, i) => (
                          <li key={i} className="text-xs text-[#A0A0A0] flex items-start gap-2">
                            <span className="text-[#00F5FF]">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-3 border-t border-[#2D3246]">
                        <p className="text-xs text-[#00F5FF]">🛡️ {category.protection}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>
            </section>

            {/* Cookies */}
            <section id="cookies" className="mb-5 scroll-mt-8">
              <Accordion title="5. Cookies & Tracking Technologies" icon={<Cookie className="w-6 h-6" />}>
                <div className="space-y-6">
                  <p className="text-[#A0A0A0]">
                    We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content and advertising.
                  </p>

                  {[
                    {
                      category: 'Essential',
                      description: 'Required for platform functionality',
                      manageable: false,
                      examples: 'auth_token, session_id',
                      color: '#10B981',
                    },
                    {
                      category: 'Preferences',
                      description: 'Remember your settings',
                      manageable: true,
                      examples: 'theme_pref, layout_settings',
                      color: '#0066FF',
                    },
                    {
                      category: 'Analytics',
                      description: 'Help us improve the platform',
                      manageable: true,
                      examples: 'Google Analytics, Hotjar',
                      color: '#7C3AED',
                    },
                    {
                      category: 'Marketing',
                      description: 'Show relevant ads',
                      manageable: true,
                      examples: 'Google AdSense, Facebook Pixel',
                      color: '#F59E0B',
                    },
                  ].map((cookie, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#0F1116] rounded-lg border"
                      style={{ borderColor: `${cookie.color}30` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{cookie.category}</h4>
                          <p className="text-sm text-[#A0A0A0]">{cookie.description}</p>
                        </div>
                        <span
                          className="px-3 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: `${cookie.color}20`,
                            color: cookie.color,
                          }}
                        >
                          {cookie.manageable ? 'Optional' : 'Required'}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] font-mono">{cookie.examples}</p>
                    </div>
                  ))}

                  <div className="mt-4 p-4 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg">
                    <p className="text-sm text-[#00F5FF]">
                      You can manage cookie preferences through your browser settings or our cookie consent manager. Note that disabling certain cookies may affect platform functionality.
                    </p>
                  </div>
                </div>
              </Accordion>
            </section>

            {/* Security */}
            <section id="security" className="mb-5 scroll-mt-8">
              <Accordion title="6. Data Security Measures" icon={<Lock className="w-6 h-6" />}>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      icon: <Lock className="w-6 h-6" />,
                      title: 'Encryption',
                      description: 'TLS 1.3 for data in transit, AES-256 for data at rest',
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: 'Access Control',
                      description: 'Role-based access, multi-factor authentication option',
                    },
                    {
                      icon: <BarChart3 className="w-6 h-6" />,
                      title: 'Monitoring',
                      description: '24/7 security monitoring, anomaly detection',
                    },
                    {
                      icon: <TestTube className="w-6 h-6" />,
                      title: 'Testing',
                      description: 'Regular penetration testing, vulnerability scans',
                    },
                    {
                      icon: <Users className="w-6 h-6" />,
                      title: 'Training',
                      description: 'Employee security awareness training',
                    },
                    {
                      icon: <HardDrive className="w-6 h-6" />,
                      title: 'Backup',
                      description: 'Regular encrypted backups, disaster recovery plan',
                    },
                  ].map((measure, idx) => (
                    <SecurityMeasure key={idx} {...measure} />
                  ))}
                </div>

                <div className="p-4 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                    Security Incident Response
                  </h4>
                  <p className="text-[#A0A0A0] text-sm mb-2">
                    In the unlikely event of a data breach, we will notify affected users within 72 hours as required by GDPR and applicable laws.
                  </p>
                  <p className="text-[#A0A0A0] text-sm">
                    <strong className="text-white">Report security concerns:</strong> security@tradepulse.com
                  </p>
                </div>
              </Accordion>
            </section>

            {/* User Rights */}
            <section id="rights" className="mb-5 scroll-mt-8">
              <Accordion title="7. Your Data Protection Rights" icon={<Shield className="w-6 h-6" />}>
                <div className="space-y-6">
                  {selectedRegion === 'EU' || selectedRegion === 'Global' ? (
                    <div className="p-5 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg">
                      <h4 className="text-lg font-semibold text-[#00F5FF] mb-3">
                        GDPR Rights (EU/EEA Residents)
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'Right to access your personal data',
                          'Right to rectification of inaccurate data',
                          'Right to erasure ("right to be forgotten")',
                          'Right to restriction of processing',
                          'Right to data portability',
                          'Right to object to processing',
                          'Right to withdraw consent at any time',
                        ].map((right, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                            <Check className="w-4 h-4 text-[#00F5FF] mt-1 flex-shrink-0" />
                            <span>{right}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-[#A0A0A0] mt-4">
                        <strong className="text-white">Response time:</strong> 30 days for access and deletion requests
                      </p>
                    </div>
                  ) : null}

                  {selectedRegion === 'California' || selectedRegion === 'Global' ? (
                    <div className="p-5 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-lg">
                      <h4 className="text-lg font-semibold text-[#00F5FF] mb-3">
                        CCPA Rights (California Residents)
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'Right to know what personal information is collected',
                          'Right to know whether personal information is sold or disclosed',
                          'Right to opt-out of the sale of personal information',
                          'Right to delete personal information',
                          'Right to non-discrimination for exercising CCPA rights',
                        ].map((right, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                            <Check className="w-4 h-4 text-[#00F5FF] mt-1 flex-shrink-0" />
                            <span>{right}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleDataRequest}
                      className="p-4 bg-primary h-24 flex-col text-white rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105"
                    >
                      <FileText className="w-8 h-8 mb-2" />
                      <h5 className="font-semibold">Request Data Export</h5>
                      <p className="text-xs opacity-90">Download all your personal data</p>
                    </Button>
                    <Button
                      onClick={() => alert('This would open the account deletion form')}
                      className="p-4 bg-[#2D3246] h-24 flex-col text-white rounded-lg hover:bg-[#353B52] transition-all transform hover:scale-105"
                    >
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <h5 className="font-semibold mb-1">Delete Account</h5>
                      <p className="text-xs opacity-90">Permanently delete your account</p>
                    </Button>
                  </div>
                </div>
              </Accordion>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="mb-5 scroll-mt-8">
              <Accordion title="8. Children's Privacy" icon={<AlertCircle className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#A0A0A0] leading-relaxed mb-5">
                    Trade Pulse is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
                  </p>
                  <div className="p-4 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Age Verification</h4>
                    <p className="text-[#A0A0A0] text-sm mb-2">
                      During account registration, users must confirm they are 18 years or older. We implement age verification checks to prevent underage access.
                    </p>
                    <p className="text-[#A0A0A0] text-sm">
                      If you believe we have inadvertently collected information from a child under 18, please contact us immediately at privacy@tradepulse.com, and we will delete such information promptly.
                    </p>
                  </div>
                </div>
              </Accordion>
            </section>

            {/* International Transfers */}
            <section id="international" className="mb-5 scroll-mt-8">
              <Accordion title="9. International Data Transfers" icon={<Globe className="w-6 h-6" />}>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#A0A0A0] leading-relaxed mb-5">
                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from those in your jurisdiction.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
                      <h4 className="text-white font-semibold mb-2">Transfer Mechanisms</h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-[#A0A0A0] flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                          <span>Standard Contractual Clauses (SCCs)</span>
                        </li>
                        <li className="text-sm text-[#A0A0A0] flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                          <span>EU-US Data Privacy Framework</span>
                        </li>
                        <li className="text-sm text-[#A0A0A0] flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                          <span>Adequacy Decisions</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
                      <h4 className="text-white font-semibold mb-2">Data Locations</h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-[#A0A0A0] flex items-start gap-2">
                          <Globe className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                          <span>United States</span>
                        </li>
                        <li className="text-sm text-[#A0A0A0] flex items-start gap-2">
                          <Globe className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                          <span>European Union</span>
                        </li>
                        <li className="text-sm text-[#A0A0A0] flex items-start gap-2">
                          <Globe className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                          <span>With adequate protection</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[#A0A0A0] text-sm">
                    We ensure that adequate safeguards are in place to protect your data wherever it is processed.
                  </p>
                </div>
              </Accordion>
            </section>

            {/* Contact */}
            <section id="contact" className="mb-5 scroll-mt-8">
              <Accordion title="10. Contact Us" icon={<Mail className="w-6 h-6" />}>
                <div className="space-y-4">
                  <p className="text-[#A0A0A0] leading-relaxed">
                    If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-[#0F1116] rounded-lg border border-[#2D3246]">
                      <h4 className="text-white font-semibold mb-3">General Privacy Inquiries</h4>
                      <p className="text-sm text-[#A0A0A0] mb-2">
                        <strong className="text-white">Email:</strong> privacy@tradepulse.com
                      </p>
                      <p className="text-sm text-[#A0A0A0]">
                        <strong className="text-white">Response Time:</strong> 48 hours
                      </p>
                    </div>

                    <div className="p-5 bg-[#0F1116] rounded-lg border border-[#2D3246]">
                      <h4 className="text-white font-semibold mb-3">Data Protection Officer</h4>
                      <p className="text-sm text-[#A0A0A0] mb-2">
                        <strong className="text-white">Email:</strong> dpo@tradepulse.com
                      </p>
                      <p className="text-sm text-[#A0A0A0]">
                        <strong className="text-white">For:</strong> GDPR requests
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Trade Pulse Inc.</h4>
                    <p className="text-sm text-[#A0A0A0] mb-2">
                      123 Financial District<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                    <p className="text-xs text-[#666666]">
                      Last updated: March 15, 2024 • Version 2.1
                    </p>
                  </div>

                  <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
                    <p className="text-sm text-[#10B981]">
                      <strong>Your privacy matters to us.</strong> We are committed to responding to all inquiries promptly and transparently.
                    </p>
                  </div>
                </div>
              </Accordion>
            </section>

            {/* Footer Related Documents */}
            <div className="mt-12 p-6 bg-[#1A1D28] rounded-lg border border-[#2D3246]">
              <h3 className="text-lg font-semibold text-white mb-5">Related Legal Documents</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Disclaimer', href: '/disclaimer' },
                  { name: 'Cookie Policy', href: '#cookies' },
                ].map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.href}
                    className="flex items-center gap-2 p-3 bg-[#2D3246] rounded-lg hover:bg-[#353B52] transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#00F5FF]" />
                    <span className="text-sm text-white">{doc.name}</span>
                    <ExternalLink className="w-3 h-3 text-[#A0A0A0] ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}