'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, Download, Printer, FileText, Shield, Globe, Info, Lock, Users, Database, Cookie, AlertCircle, Mail, ExternalLink, Check, BarChart3, TestTube, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LegalAccordion from '@/components/legal/LegalAccordion';
import LegalTLDR from '@/components/legal/LegalTLDR';
import LegalLayout from '@/components/legal/LegalLayout';
import LegalHeader from '@/components/legal/LegalHeader';

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

// Use the shared accessible LegalAccordion (Radix) for consistency

interface DataCategoryProps {
      name: string;
      items: string[];
      legalBasis: string[];
      specialNote?: string;
}

function DataCategory({ name, items, legalBasis, specialNote }: DataCategoryProps) {
      return (
            <div className="mb-8 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        {name}
                  </h4>
                  <ul className="space-y-4 mb-8">
                        {items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <div className="mt-1.5 flex-shrink-0 w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                          <Check className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium">{item}</span>
                              </li>
                        ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-4">
                        {legalBasis.map((basis, idx) => (
                              <span
                                    key={idx}
                                    className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-slate-200 dark:border-slate-700"
                              >
                                    {basis}
                              </span>
                        ))}
                  </div>
                  {specialNote && (
                        <div className="mt-6 p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl">
                              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 flex items-start gap-3 leading-relaxed">
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
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="mb-6 p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' }) : null}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
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
                  { id: 'children', label: 'Children’s Privacy', icon: <AlertCircle className="w-4 h-4" /> },
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
            <LegalLayout>
                  <LegalHeader
                        title="Privacy Policy"
                        version="Version 2.1"
                        updated="March 15, 2024"
                        badges={complianceBadges}
                        regions={regions}
                        selectedRegion={selectedRegion}
                        onRegionChange={(r: string) => setSelectedRegion(r)}
                        onDownload={handleDownload}
                        onPrint={handlePrint}
                        onRequest={handleDataRequest}
                  />

                  {/* Quick summary for traders */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                        <LegalTLDR
                              summary="Key points: we never collect trading account credentials, you control cookie preferences that affect charts and alerts, and you can request a data export."
                              bullets={[
                                    'No trading account credentials collected',
                                    'Cookie choices affect TradingView charts & alerts',
                                    'Request data export via privacy request',
                                    'Security incidents notified within 72 hours',
                              ]}
                        />
                  </div>

                  {/* Main Content */}
                  <div className="mt-20">
                        <div className="flex flex-col lg:flex-row gap-20">
                              {/* Sidebar Navigation */}
                              <aside className="lg:w-72 flex-shrink-0 lg:sticky lg:top-12 h-fit">
                                    <div className="space-y-12 no-print">
                                          <div>
                                                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">
                                                      On this page
                                                </h3>
                                                <div className="space-y-1">
                                                      {navigationSections.map((section) => (
                                                            <button
                                                                  key={section.id}
                                                                  onClick={() => scrollToSection(section.id)}
                                                                  className={`w-full group flex items-center gap-4 py-3 text-left transition-all duration-300 border-r-2 ${activeSection === section.id
                                                                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 font-bold'
                                                                        : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                                                                        }`}
                                                            >
                                                                  <span className={`transition-transform duration-300 ${activeSection === section.id ? 'scale-110 translate-x-1' : 'group-hover:translate-x-1'}`}>
                                                                        {React.isValidElement(section.icon) ? React.cloneElement(section.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' }) : section.icon}
                                                                  </span>
                                                                  <span className="text-sm font-medium leading-none">{section.label}</span>
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>

                                          {/* Quick Actions */}
                                          <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                                                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">
                                                      Related
                                                </h3>
                                                <div className="space-y-4">
                                                      <Link
                                                            href="/terms"
                                                            className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                                      >
                                                            <FileText className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
                                                            Terms of Service
                                                      </Link>
                                                      <Link
                                                            href="/disclaimer"
                                                            className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                                      >
                                                            <Shield className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
                                                            Risk Disclosure
                                                      </Link>
                                                </div>
                                          </div>
                                    </div>
                              </aside>

                              {/* Main Content Area */}
                              <main className="flex-1 max-w-4xl min-w-0">
                                    <div className="prose-h2:font-display prose-h2:text-4xl prose-h2:font-bold prose-h2:mb-10 prose-h2:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-500 dark:prose-p:text-slate-400">
                                    {/* Introduction */}
                                    <section id="introduction" className="mb-24 scroll-mt-24 group">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                1. Introduction
                                          </h2>
                                          <div className="space-y-8">
                                                <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400">
                                                      Welcome to <strong className="text-slate-900 dark:text-white font-bold">Trade Pulse.</strong> Your comprehensive financial intelligence platform. We are committed to protecting your privacy and ensuring transparency in how we collect, use, and safeguard your personal information.
                                                </p>
                                                <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400">
                                                      Our code of conduct and our pledge to be an upstanding member of the financial ecosystem are reflected in how we handle your data. This policy is written for clarity, not just compliance.
                                                </p>
                                                
                                                <div className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 my-12">
                                                      <h4 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6">Data Controller</h4>
                                                      <div className="grid sm:grid-cols-2 gap-10">
                                                            <div>
                                                                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Company</p>
                                                                  <p className="text-slate-900 dark:text-white font-bold text-lg">Trade Pulse Global Inc.</p>
                                                            </div>
                                                            <div>
                                                                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Support</p>
                                                                  <p className="text-slate-900 dark:text-white font-bold text-lg">privacy@tradepulse.io</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </section>

                                    {/* Data Collection */}
                                    <section id="data-collection" className="mb-24 scroll-mt-24">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                2. Data We Collect
                                          </h2>
                                          <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400 mb-12">
                                                We collect information in several ways, which together provide the tools to help the world is traders to create, develop and promote their trading strategies.
                                          </p>
                                          
                                          <div className="grid gap-6">
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
                                          </div>

                                    </section>

                                    {/* Data Use */}
                                    <section id="data-use" className="mb-24 scroll-mt-24">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                3. How We Use Your Data
                                          </h2>
                                          <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400 mb-12">
                                                Please ensure that your usage patterns are relevant to the theme of the platform. We use your data to power the features that make Trade Pulse awesome.
                                          </p>

                                          <div className="overflow-x-auto -mx-4 sm:mx-0">
                                                <table className="w-full text-left border-separate border-spacing-0">
                                                      <thead>
                                                            <tr>
                                                                  <th className="py-4 px-4 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 first:rounded-tl-2xl last:rounded-tr-2xl">Purpose</th>
                                                                  <th className="py-4 px-4 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">Legal Basis</th>
                                                                  <th className="py-4 px-4 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 last:rounded-tr-2xl">Retention</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                                                            {[
                                                                  {
                                                                        purpose: 'Provide core intelligence services',
                                                                        basis: 'Contract',
                                                                        retention: 'Active + 3 years',
                                                                  },
                                                                  {
                                                                        purpose: 'Personalize financial research',
                                                                        basis: 'Legitimate Interest',
                                                                        retention: 'While active',
                                                                  },
                                                                  {
                                                                        purpose: 'Send real-time market alerts',
                                                                        basis: 'Consent',
                                                                        retention: 'Until withdrawn',
                                                                  },
                                                                  {
                                                                        purpose: 'Platform optimization',
                                                                        basis: 'Legitimate Interest',
                                                                        retention: '2 years',
                                                                  },
                                                            ].map((row, idx) => (
                                                                  <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                                                        <td className="py-6 px-4 text-sm font-bold text-slate-900 dark:text-white">{row.purpose}</td>
                                                                        <td className="py-6 px-4">
                                                                              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100 dark:border-blue-800">
                                                                                    {row.basis}
                                                                              </span>
                                                                        </td>
                                                                        <td className="py-6 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">{row.retention}</td>
                                                                  </tr>
                                                            ))}
                                                      </tbody>
                                                </table>
                                          </div>
                                    </section>

                                    {/* Data Sharing */}
                                    <section id="data-sharing" className="mb-24 scroll-mt-24">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                4. Data Sharing & Third Parties
                                          </h2>
                                          <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400 mb-12">
                                                We put no restrictions on what you share. However, we have community guidelines that must be taken into consideration.
                                          </p>
                                          
                                          <div className="grid md:grid-cols-2 gap-8">
                                                {[
                                                      {
                                                            name: 'Service Providers',
                                                            description: 'Process data on our behalf for cloud hosting, storage, and payments.',
                                                            examples: ['AWS', 'Google Cloud', 'Stripe', 'SendGrid'],
                                                            protection: 'GDPR-compliant DPA contracts',
                                                      },
                                                      {
                                                            name: 'Legal & Regulatory',
                                                            description: 'When required by law to protect users or respond to legal processes.',
                                                            examples: ['Law enforcement', 'Regulatory bodies', 'Court orders'],
                                                            protection: 'Minimum necessary disclosure',
                                                      },
                                                ].map((category, idx) => (
                                                      <div key={idx} className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group">
                                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8">
                                                                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 italic">{category.name}</h4>
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed italic">{category.description}</p>
                                                            <div className="flex flex-wrap gap-2 mb-8">
                                                                  {category.examples.map((example, i) => (
                                                                        <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 rounded-lg">
                                                                              {example}
                                                                        </span>
                                                                  ))}
                                                            </div>
                                                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                                                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">🛡️ {category.protection}</p>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </section>

                                    {/* Cookies */}
                                    <section id="cookies" className="mb-24 scroll-mt-24">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                5. Cookies & Tracking
                                          </h2>
                                          <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400 mb-12">
                                                We use cookies to maintain your login session and remember your layout preferences for charts and indicators.
                                          </p>

                                          <div className="grid gap-6">
                                                {[
                                                      {
                                                            category: 'Essential',
                                                            description: 'Security & Auth',
                                                            examples: 'auth_token, session_id',
                                                            color: '#3B82F6',
                                                      },
                                                      {
                                                            category: 'Preferences',
                                                            description: 'Layout & Theme',
                                                            examples: 'theme_pref, indicator_settings',
                                                            color: '#0EA5E9',
                                                      },
                                                ].map((cookie, idx) => (
                                                      <div key={idx} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group">
                                                            <div className="flex items-center gap-6">
                                                                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                                                                        <Cookie className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                                  </div>
                                                                  <div>
                                                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{cookie.category}</h4>
                                                                        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">{cookie.description}</p>
                                                                  </div>
                                                            </div>
                                                            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-full">
                                                                  <p className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500">{cookie.examples}</p>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </section>

                                    {/* Security */}
                                    <section id="security" className="mb-24 scroll-mt-24">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                6. Data Security
                                          </h2>
                                          <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400 mb-12">
                                                Encryption is at the core of our platform architecture, protecting your data at rest and in transit.
                                          </p>

                                          <div className="grid md:grid-cols-2 gap-8 mb-12">
                                                {[
                                                      {
                                                            icon: <Lock />,
                                                            title: 'Encryption',
                                                            description: 'TLS 1.3 for data in transit, AES-256 for data at rest',
                                                      },
                                                      {
                                                            icon: <Shield />,
                                                            title: 'Access Control',
                                                            description: 'Role-based access, multi-factor authentication option',
                                                      },
                                                      {
                                                            icon: <BarChart3 />,
                                                            title: 'Monitoring',
                                                            description: '24/7 security monitoring, anomaly detection',
                                                      },
                                                      {
                                                            icon: <HardDrive />,
                                                            title: 'Backup',
                                                            description: 'Regular encrypted backups, disaster recovery plan',
                                                      },
                                                ].map((measure, idx) => (
                                                      <SecurityMeasure key={idx} {...measure} />
                                                ))}
                                          </div>

                                          <div className="p-10 bg-slate-900 dark:bg-black rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                                      <AlertCircle className="w-32 h-32 text-blue-500" />
                                                </div>
                                                <div className="relative z-10">
                                                      <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                            Incident Response
                                                      </h4>
                                                      <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl italic">
                                                            In the unlikely event of a data breach, we will notify affected users within 72 hours as required by GDPR and applicable laws.
                                                      </p>
                                                      <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                                                            Security Contact: <span className="text-blue-400">security@tradepulse.io</span>
                                                      </p>
                                                </div>
                                          </div>
                                    </section>

                                    {/* User Rights */}
                                    <section id="rights" className="mb-24 scroll-mt-24">
                                          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-display">
                                                7. Your Rights
                                          </h2>
                                          <p className="text-xl leading-[1.7] text-slate-500 dark:text-slate-400 mb-12">
                                                You have full control over your data. We provide the tools you need to access, export, or delete your information at any time.
                                          </p>

                                          <div className="grid md:grid-cols-2 gap-8 mb-12">
                                                <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                                      <div className="absolute top-0 right-0 p-8 opacity-5">
                                                            <Globe className="w-24 h-24 text-blue-500" />
                                                      </div>
                                                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">GDPR / LGPD</h4>
                                                      <ul className="space-y-4 mb-8">
                                                            {['Right to access', 'Right to erasure', 'Right to portability', 'Right to object'].map((r, i) => (
                                                                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                                        {r}
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                      <Button onClick={handleDataRequest} className="w-full rounded-2xl py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-black dark:hover:bg-slate-100 transition-all">
                                                            Access Data Portal
                                                      </Button>
                                                </div>

                                                <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                                      <div className="absolute top-0 right-0 p-8 opacity-5">
                                                            <Shield className="w-24 h-24 text-blue-500" />
                                                      </div>
                                                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">CCPA / VCDPA</h4>
                                                      <ul className="space-y-4 mb-8">
                                                            {['Right to know', 'Right to delete', 'Right to opt-out', 'Non-discrimination'].map((r, i) => (
                                                                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                                        {r}
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                      <Button variant="outline" className="w-full rounded-2xl py-6 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                                            Manage Preferences
                                                      </Button>
                                                </div>
                                          </div>
                                    </section>

                                    {/* Contact */}
                                    <section id="contact" className="mb-24 scroll-mt-24">
                                          <div className="p-12 sm:p-20 bg-blue-600 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                                      <Mail className="w-64 h-64 text-white" />
                                                </div>
                                                <div className="relative z-10">
                                                      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 font-display">
                                                            Still have questions?
                                                      </h2>
                                                      <p className="text-xl sm:text-2xl text-blue-100 max-w-xl leading-relaxed mb-12">
                                                            Our privacy team is here to help walk you through any concerns or data requests.
                                                      </p>
                                                      <div className="flex flex-col sm:flex-row gap-6">
                                                            <Button className="rounded-2xl px-10 py-8 bg-white text-blue-600 font-bold text-xl hover:bg-white/95 hover:scale-105 transition-all shadow-xl">
                                                                  Contact Support
                                                            </Button>
                                                            <div className="flex flex-col justify-center">
                                                                  <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Email directly</p>
                                                                  <p className="font-bold text-xl">privacy@tradepulse.io</p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </section>

                                    </div>

                              <div className="mt-40 pt-20 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                                          <div className="flex items-center gap-2 font-display text-xl font-bold text-slate-400 dark:text-slate-600">
                                                TradePulse.
                                          </div>
                                          <div className="flex flex-wrap justify-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                                                <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">Risk Disclosure</Link>
                                                <Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link>
                                          </div>
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
            </LegalLayout>
      );
}