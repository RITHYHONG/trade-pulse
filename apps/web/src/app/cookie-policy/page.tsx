'use client';

import React, { useState } from 'react';
import {
      ChevronDown, 
      Download, 
      Printer, 
      FileText, 
      Cookie, 
      Search,
      Check, 
      Info, 
      Clock, 
      Shield, 
      Globe, 
      ExternalLink,
      Settings, 
      History, 
      AlertCircle, 
      RefreshCw, 
      Database,
      ChevronRight, 
      ChartNoAxesCombined,
      ChartSpline,
      BookHeart,
      ChartCandlestick,
      LockKeyhole,
      Handshake,
      Target,
      Blocks,
      Monitor,
      SearchCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LegalAccordion from '@/components/legal/LegalAccordion';
import LegalTLDR from '@/components/legal/LegalTLDR';
import LegalLayout from '@/components/legal/LegalLayout';
import LegalHeader from '@/components/legal/LegalHeader';

interface CookieData {
      name: string;
      provider: string;
      category: string;
      purpose: string;
      duration: string;
      data: string;
}

interface ConsentPreferences {
      strictlyNecessary: boolean;
      performance: boolean;
      functionality: boolean;
      marketing: boolean;
      thirdParty: boolean;
}

const cookieCategories = [
      {
            id: 'strictlyNecessary',
            name: 'Strictly Necessary',
            icon: <Shield className="w-6 h-6" />,
            purpose: 'Core platform functionality and security',
            description: 'These cookies are essential for the platform to function. They enable core features like login, security, and network management.',
            mandatory: true
      },
      {
            id: 'performance',
            name: 'Performance & Analytics',
            icon: <ChartSpline className="w-6 h-6" />,
            purpose: 'Optimization and bug tracking',
            description: 'Helps us understand how you interact with the platform, allowing us to improve performance and user experience.',
            mandatory: false
      },
      {
            id: 'functionality',
            name: 'Functionality & Personalization',
            icon: <Settings className="w-6 h-6" />,
            purpose: 'Remembering your preferences',
            description: 'Enables personalized features like watchlists, theme selection, and language preferences across sessions.',
            mandatory: false
      },
      {
            id: 'marketing',
            name: 'Marketing & Targeting',
            icon: <Target className="w-6 h-6" />,
            purpose: 'Relevant offers and content',
            description: 'Used to deliver personalized advertising and content recommendations based on your trading interests.',
            mandatory: false
      }
];

const sampleCookieData: CookieData[] = [
      {
            name: 'trade_session',
            provider: 'Trade Pulse (1st party)',
            category: 'Strictly Necessary',
            purpose: 'Maintains authentication state',
            duration: 'Session',
            data: 'Encrypted User ID'
      },
      {
            name: 'watchlist_prefs',
            provider: 'Trade Pulse (1st party)',
            category: 'Functionality',
            purpose: 'Stores watchlist symbols',
            duration: '1 Year',
            data: 'JSON symbols'
      },
      {
            name: '_ga',
            provider: 'Google Analytics',
            category: 'Performance',
            purpose: 'User analytics tracking',
            duration: '2 Years',
            data: 'Unique Client ID'
      },
      {
            name: 'tradingview_session',
            provider: 'TradingView',
            category: 'Third-Party',
            purpose: 'Interactive chart state',
            duration: 'Session',
            data: 'Preferences'
      }
];

export default function CookiePolicyPage() {
      const [consentPreferences, setConsentPreferences] = useState<ConsentPreferences>({
            strictlyNecessary: true,
            performance: false,
            functionality: false,
            marketing: false,
            thirdParty: false,
      });

      const [searchQuery, setSearchQuery] = useState('');
      const [filterCategory, setFilterCategory] = useState('All');
      const [sortColumn, setSortColumn] = useState<keyof CookieData | null>(null);
      const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
      const [consentHistory, setConsentHistory] = useState<{ timestamp: Date; action: string; preferences: ConsentPreferences }[]>([]);
      const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
      const [isScanning, setIsScanning] = useState(false);
      const [doNotSell, setDoNotSell] = useState(false);

      const handleToggle = (id: keyof ConsentPreferences) => {
            if (id === 'strictlyNecessary') return;
            setConsentPreferences((prev: ConsentPreferences) => ({ ...prev, [id]: !prev[id] }));
      };

      const handleSavePreferences = () => {
            const newHistoryEntry = {
                  timestamp: new Date(),
                  action: 'Preferences Updated',
                  preferences: { ...consentPreferences },
            };

            setConsentHistory((prev) => [newHistoryEntry, ...prev]);
            setLastUpdated(new Date());
            alert('Your cookie preferences have been saved successfully!');
      };

      return (
            <LegalLayout>
                  <LegalHeader 
                        title="Cookie Policy"
                        version="v1.4.2"
                        updated="February 20, 2025"
                  />

                  <div className="max-w-4xl mx-auto space-y-16 pb-24">
                        <LegalTLDR 
                              summary="We use cookies to ensure security, enhance performance, and personalize your trading experience. Control your preferences below."
                              bullets={[
                                    'Essential cookies are required for platform access',
                                    'Analytics help us improve trading tools',
                                    'You can update preferences at any time in settings'
                              ]}
                        />

                        {/* Consent Management Center */}
                        <section className="bg-slate-50 dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                    <Cookie className="w-48 h-48 text-blue-600" />
                              </div>
                              
                              <div className="relative z-10">
                                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-6">
                                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                                          Preference Center
                                    </div>
                                    
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                                          Manage Cookie Consent
                                    </h2>

                                    <div className="grid gap-4 mb-10">
                                          {cookieCategories.map((cat) => (
                                                <div 
                                                      key={cat.id}
                                                      className={`p-6 rounded-2xl border transition-all duration-300 ${
                                                            consentPreferences[cat.id as keyof ConsentPreferences] 
                                                                  ? 'bg-white dark:bg-slate-950 border-blue-200 dark:border-blue-900/50 shadow-md' 
                                                                  : 'bg-slate-100/50 dark:bg-slate-900/50 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                                                      }`}
                                                >
                                                      <div className="flex items-start justify-between gap-6">
                                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                                  {cat.icon}
                                                            </div>
                                                            <div className="flex-1">
                                                                  <div className="flex items-center gap-3 mb-1">
                                                                        <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                                                                        {cat.mandatory && (
                                                                              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase">Required</span>
                                                                        )}
                                                                  </div>
                                                                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                                                                        {cat.description}
                                                                  </p>
                                                            </div>
                                                            <button
                                                                  onClick={() => handleToggle(cat.id as keyof ConsentPreferences)}
                                                                  disabled={cat.mandatory}
                                                                  className={`w-14 h-8 rounded-full p-1 transition-colors relative ${
                                                                        consentPreferences[cat.id as keyof ConsentPreferences] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                                                                  } ${cat.mandatory ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            >
                                                                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${consentPreferences[cat.id as keyof ConsentPreferences] ? 'translate-x-6' : 'translate-x-0'}`} />
                                                            </button>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                                          <p className="text-xs text-slate-400 max-w-sm text-center sm:text-left">
                                                Your choices are saved as a "strictly necessary" cookie to remember your preferences for future visits.
                                          </p>
                                          <Button onClick={handleSavePreferences} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-12 font-bold shadow-lg shadow-blue-500/20 py-6">
                                                Save Preferences
                                          </Button>
                                    </div>
                              </div>
                        </section>

                        {/* Detailed Cookie Audit */}
                        <section>
                              <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600">
                                          <SearchCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Cookie Inventory</h2>
                                          <p className="text-sm text-slate-500">Live audit of cookies used on our platform</p>
                                    </div>
                              </div>

                              <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                          <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-950/50">
                                                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                                                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Provider</th>
                                                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Purpose</th>
                                                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {sampleCookieData.map((cookie, idx) => (
                                                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                  <span className="font-mono text-xs bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                        {cookie.name}
                                                                  </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                                  {cookie.provider}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                                                  {cookie.purpose}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                                                  {cookie.duration}
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              </div>
                        </section>

                        {/* Browser Control Section */}
                        <section className="grid md:grid-cols-2 gap-8">
                              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800">
                                    <Monitor className="w-8 h-8 text-blue-600 mb-6" />
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Manual Browser Controls</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                          You can also manage cookies through your browser settings. Each browser has different methods for blocking or deleting cookies.
                                    </p>
                                    <Link href="https://www.allaboutcookies.org/" target="_blank" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                                          Learn more about cookies
                                          <ExternalLink className="w-4 h-4" />
                                    </Link>
                              </div>
                              <div className="p-8 bg-blue-600 rounded-[32px] text-white">
                                    <LockKeyhole className="w-8 h-8 text-blue-100 mb-6" />
                                    <h3 className="text-xl font-bold mb-4">Privacy Commitment</h3>
                                    <p className="text-blue-100 leading-relaxed">
                                          We never sell your browsing data to third parties. Our cookies are strictly used to improve your user experience and platform security.
                                    </p>
                              </div>
                        </section>
                  </div>
            </LegalLayout>
      );
}

      const filteredCookies = sampleCookieData.filter(cookie => {
            const matchesSearch =
                  cookie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  cookie.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  cookie.provider.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = filterCategory === 'All' || cookie.category === filterCategory;

            return matchesSearch && matchesCategory;
      });

      const sortedCookies = [...filteredCookies].sort((a, b) => {
            if (!sortColumn) return 0;

            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
      });

      const handleSort = (column: keyof CookieData) => {
            if (sortColumn === column) {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                  setSortColumn(column);
                  setSortDirection('asc');
            }
      };

      const handleConsentToggle = (category: keyof ConsentPreferences) => {
            if (category === 'strictlyNecessary') return; // Can't disable necessary cookies

            setConsentPreferences(prev => ({
                  ...prev,
                  [category]: !prev[category]
            }));
      };

      const handleSavePreferences = () => {
            const newHistoryEntry = {
                  timestamp: new Date(),
                  action: 'Preferences Updated',
                  preferences: { ...consentPreferences },
            };

            setConsentHistory((prev) => [newHistoryEntry, ...prev]);
            setLastUpdated(new Date());
            alert('Your cookie preferences have been saved successfully!');
      };

      const handleSelectAll = () => {
            setConsentPreferences({
                  strictlyNecessary: true,
                  performance: true,
                  functionality: true,
                  marketing: true,
                  thirdParty: true,
            });
      };

      const handleSelectNone = () => {
            setConsentPreferences({
                  strictlyNecessary: true,
                  performance: false,
                  functionality: false,
                  marketing: false,
                  thirdParty: false,
            });
      };

      const handleResetToDefault = () => {
            setConsentPreferences({
                  strictlyNecessary: true,
                  performance: false,
                  functionality: false,
                  marketing: false,
                  thirdParty: false,
            });
      };

      const handleScanPage = () => {
            setIsScanning(true);
            // Simulate scanning
            setTimeout(() => {
                  setIsScanning(false);
                  alert(`Scan complete!\n\nFound ${sampleCookieData.length} cookies on this page.\nAll cookies are documented in the table below.`);
            }, 2000);
      };

      const handleDownloadCSV = () => {
            const headers = ['Cookie Name', 'Provider', 'Category', 'Purpose', 'Duration', 'Data Collected'];
            const rows = sampleCookieData.map(cookie => [
                  cookie.name,
                  cookie.provider,
                  cookie.category,
                  cookie.purpose,
                  cookie.duration,
                  cookie.data
            ]);

            const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'trade-pulse-cookie-inventory.csv';
            a.click();
      };

      const handlePrint = () => {
            window.print();
      };

      const getConsentLevel = () => {
            const enabledCount = Object.values(consentPreferences).filter(Boolean).length;
            const totalCount = Object.keys(consentPreferences).length;

            if (enabledCount === 1) return { label: 'Minimum Essential', color: '#F59E0B' };
            if (enabledCount === totalCount) return { label: 'Full Personalization', color: '#10B981' };
            return { label: 'Enhanced Experience', color: '#0066FF' };
      };

      const consentLevel = getConsentLevel();

      return (
            <div className="min-h-screen bg-[#0F1116]">
                  {/* Header */}
                  <div className="border-b border-[#2D3246] bg-[#1A1D28]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                              {/* Breadcrumb */}
                              <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-4">
                                    <Link href="/" className="hover:text-[#00F5FF] transition-colors">Home</Link>
                                    <span>→</span>
                                    <span>Legal</span>
                                    <span>→</span>
                                    <span className="text-[#00F5FF]">Cookie Policy</span>
                              </div>

                              {/* Title */}
                              <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-3">
                                          <Cookie className="w-10 h-10 text-[#F59E0B]" />
                                          <h1 className="text-4xl font-bold text-white">
                                                Cookie Policy & Consent Preferences
                                          </h1>
                                    </div>
                                    <p className="text-lg text-[#A0A0A0]">
                                          Transparency and control over your data privacy
                                    </p>
                              </div>

                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-[#0066FF]/20 text-[#00F5FF] text-sm rounded-full border border-[#0066FF]/30">
                                          Version 2.1
                                    </span>
                                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                                          <Clock className="w-4 h-4" />
                                          Last Updated: {lastUpdated.toLocaleDateString()}
                                    </span>
                                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                                          <Shield className="w-4 h-4" />
                                          GDPR, CCPA, ePrivacy Compliant
                                    </span>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-3">
                                    <button
                                          onClick={handlePrint}
                                          className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
                                    >
                                          <Printer className="w-4 h-4" />
                                          <span className="hidden sm:inline">Print</span>
                                    </button>
                                    <button
                                          onClick={handleDownloadCSV}
                                          className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
                                    >
                                          <Download className="w-4 h-4" />
                                          <span className="hidden sm:inline">Export CSV</span>
                                    </button>
                                    <button
                                          onClick={handleScanPage}
                                          disabled={isScanning}
                                          className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50"
                                    >
                                          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                                          <span className="hidden sm:inline">
                                                {isScanning ? 'Scanning...' : 'Scan This Page'}
                                          </span>
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Quick Summary for Traders */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LegalTLDR
                              summary="Quick: cookie choices affect charts, alerts, and personalized insights — accept all for full personalization or manage categories individually."
                              bullets={[
                                    'Cookie choices affect TradingView charts & alerts',
                                    'Rejecting analytics reduces personalized recommendations',
                                    'You can export cookie inventory or print this page',
                              ]}
                        />
                  </div>

                  {/* Main Content */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col lg:flex-row gap-8">
                              {/* Main Content Area (70%) */}
                              <main className="flex-1 lg:w-[70%]">
                                    {/* Introduction */}
                                    <section id="introduction" className="mb-12">
                                          <LegalAccordion
                                                title="What Are Cookies?"
                                                icon={<Info className="w-6 h-6" />}
                                                defaultOpen={true}
                                          >
                                                <div className="space-y-4">
                                                      <p className="text-[#A0A0A0] leading-relaxed">
                                                            Cookies are small text files stored on your device when you visit websites. Think of them as digital sticky notes that help websites remember your preferences and provide a personalized experience.
                                                      </p>

                                                      <div className="bg-[#0F1116] p-5 rounded-lg border border-[#2D3246]">
                                                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                                  <Cookie className="w-5 h-5 text-[#F59E0B]" />
                                                                  Why Traders Care About Cookies
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                  {[
                                                                        'Remember your watchlists and custom dashboard layouts',
                                                                        'Keep you logged in securely across sessions',
                                                                        'Track your trading preferences and alert settings',
                                                                        'Deliver personalized market insights and recommendations',
                                                                        'Improve platform performance based on usage patterns'
                                                                  ].map((item, idx) => (
                                                                        <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                                                                              <Check className="w-4 h-4 text-[#00F5FF] mt-1 flex-shrink-0" />
                                                                              <span>{item}</span>
                                                                        </li>
                                                                  ))}
                                                            </ul>
                                                      </div>

                                                      <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg p-4">
                                                            <p className="text-[#00F5FF] text-sm">
                                                                  💡 <strong>Simple Analogy:</strong> Cookies are like a hotel remembering your room preferences. When you return, they already know you prefer a quiet room on a high floor with extra pillows.
                                                            </p>
                                                      </div>
                                                </div>
                                          </LegalAccordion>
                                    </section>

                                    {/* Why We Use Cookies */}
                                    <section id="why-we-use" className="mb-12">
                                          <LegalAccordion
                                                title="Why Trade Pulse Uses Cookies"
                                                icon={<Settings className="w-6 h-6" />}
                                                defaultOpen={true}
                                          >
                                                <div className="grid md:grid-cols-2 gap-4">
                                                      {[
                                                            {
                                                                  title: 'Essential Platform Functionality',
                                                                  description: 'Maintain your login session, secure authentication, and core platform operations',
                                                                  icon: <ChartSpline className="w-8 h-8" />
                                                            },
                                                            {
                                                                  title: 'Personalized Trading Experience',
                                                                  description: 'Remember your watchlists, dashboard layouts, and custom alert preferences',
                                                                  icon: <BookHeart className="w-8 h-8" />
                                                            },
                                                            {
                                                                  title: 'Market Data Performance',
                                                                  description: 'Optimize real-time data delivery and reduce loading times for frequently accessed markets',
                                                                  icon: <ChartCandlestick className="w-8 h-8" />
                                                            },
                                                            {
                                                                  title: 'Security & Fraud Prevention',
                                                                  description: 'Detect suspicious activity, prevent unauthorized access, and protect your account',
                                                                  icon: <LockKeyhole className="w-8 h-8" />
                                                            },
                                                            {
                                                                  title: 'Analytics & Platform Improvement',
                                                                  description: 'Understand usage patterns to enhance features and fix bugs proactively',
                                                                  icon: <ChartNoAxesCombined className="w-8 h-8" />
                                                                  
                                                            },
                                                            {
                                                                  title: 'Relevant Content Delivery',
                                                                  description: 'Show you broker recommendations and trading tools relevant to your interests',
                                                                  icon: <Handshake className="w-8 h-8" />
                                                            }
                                                      ].map((item, idx) => (
                                                            <div
                                                                  key={idx}
                                                                  className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246] hover:border-[#00F5FF]/50 transition-all"
                                                            >
                                                                  <div className="text-3xl mb-2">{item.icon}</div>
                                                                  <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                                                                  <p className="text-[#A0A0A0] text-sm">{item.description}</p>
                                                            </div>
                                                      ))}
                                                </div>
                                          </LegalAccordion>
                                    </section>

                                    {/* Cookie Categories */}
                                    <section id="categories" className="mb-12">
                                          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <Database className="w-7 h-7 text-[#00F5FF]" />
                                                Cookie Categories on Trade Pulse
                                          </h2>

                                          {cookieCategories.map((category, idx) => (
                                                <LegalAccordion
                                                      key={idx}
                                                      title={category.name}
                                                      icon={<span className="text-2xl">{category.icon}</span>}
                                                >
                                                      <div className="space-y-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                  <span
                                                                        className="px-4 py-2 rounded-full text-sm font-semibold"
                                                                        style={{
                                                                              backgroundColor: `${category.color}20`,
                                                                              color: category.color
                                                                        }}
                                                                  >
                                                                        {category.mandatory ? 'Required' : 'Optional'}
                                                                  </span>
                                                            </div>

                                                            <p className="text-[#A0A0A0] leading-relaxed">{category.description}</p>

                                                            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
                                                                  <h4 className="text-white font-semibold mb-2">Purpose:</h4>
                                                                  <p className="text-[#A0A0A0] text-sm">{category.purpose}</p>
                                                            </div>

                                                            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
                                                                  <h4 className="text-white font-semibold mb-3">Examples:</h4>
                                                                  <div className="flex flex-wrap gap-2">
                                                                        {category.examples.map((example, i) => (
                                                                              <span
                                                                                    key={i}
                                                                                    className="px-3 py-1 bg-[#2D3246] text-[#A0A0A0] text-xs rounded-full"
                                                                              >
                                                                                    {example}
                                                                              </span>
                                                                        ))}
                                                                  </div>
                                                            </div>

                                                            {category.mandatory && (
                                                                  <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                                                                        <p className="text-[#F59E0B] text-sm flex items-start gap-2">
                                                                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                              <span>
                                                                                    These cookies cannot be disabled as they are essential for the platform to function.
                                                                              </span>
                                                                        </p>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </LegalAccordion>
                                          ))}
                                    </section>

                                    {/* Detailed Cookie Inventory */}
                                    <section id="cookie-table" className="mb-12">
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                                            <FileText className="w-7 h-7 text-[#00F5FF]" />
                                                            Detailed Cookie Inventory
                                                      </h2>
                                                </div>

                                                {/* Search and Filter Controls */}
                                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                                      <div className="flex-1 relative">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
                                                            <input
                                                                  type="text"
                                                                  placeholder="Search cookies by name, purpose, or provider..."
                                                                  value={searchQuery}
                                                                  onChange={(e) => setSearchQuery(e.target.value)}
                                                                  className="w-full pl-10 pr-4 py-3 bg-[#0F1116] border border-[#2D3246] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50"
                                                            />
                                                      </div>
                                                      <div className="relative">
                                                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
                                                            <select
                                                                  value={filterCategory}
                                                                  onChange={(e) => setFilterCategory(e.target.value)}
                                                                  className="pl-10 pr-8 py-3 bg-[#0F1116] border border-[#2D3246] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 appearance-none cursor-pointer"
                                                            >
                                                                  <option value="All">All Categories</option>
                                                                  <option value="Strictly Necessary">Strictly Necessary</option>
                                                                  <option value="Performance">Performance</option>
                                                                  <option value="Functionality">Functionality</option>
                                                                  <option value="Marketing">Marketing</option>
                                                                  <option value="Third-Party">Third-Party</option>
                                                            </select>
                                                      </div>
                                                </div>

                                                {/* Results Count */}
                                                <div className="text-sm text-[#A0A0A0] mb-4">
                                                      Showing {sortedCookies.length} of {sampleCookieData.length} cookies
                                                </div>

                                                {/* Cookie Table */}
                                                <div className="overflow-x-auto">
                                                      <table className="w-full text-sm">
                                                            <thead>
                                                                  <tr className="border-b border-[#2D3246]">
                                                                        {[
                                                                              { key: 'name' as keyof CookieData, label: 'Cookie Name' },
                                                                              { key: 'provider' as keyof CookieData, label: 'Provider' },
                                                                              { key: 'category' as keyof CookieData, label: 'Category' },
                                                                              { key: 'purpose' as keyof CookieData, label: 'Purpose' },
                                                                              { key: 'duration' as keyof CookieData, label: 'Duration' },
                                                                              { key: 'data' as keyof CookieData, label: 'Data Collected' }
                                                                        ].map((column) => (
                                                                              <th
                                                                                    key={column.key}
                                                                                    className="text-left text-[#00F5FF] font-semibold py-3 px-2 cursor-pointer hover:text-[#00CCFF] transition-colors"
                                                                                    onClick={() => handleSort(column.key)}
                                                                              >
                                                                                    <div className="flex items-center gap-2">
                                                                                          {column.label}
                                                                                          <ArrowUpDown className="w-4 h-4" />
                                                                                    </div>
                                                                              </th>
                                                                        ))}
                                                                  </tr>
                                                            </thead>
                                                            <tbody>
                                                                  {sortedCookies.map((cookie, idx) => (
                                                                        <tr
                                                                              key={idx}
                                                                              className="border-b border-[#2D3246]/50 hover:bg-[#0F1116] transition-colors"
                                                                        >
                                                                              <td className="py-3 px-2">
                                                                                    <code className="text-[#00F5FF] font-mono text-xs bg-[#0F1116] px-2 py-1 rounded">
                                                                                          {cookie.name}
                                                                                    </code>
                                                                              </td>
                                                                              <td className="py-3 px-2 text-[#A0A0A0]">{cookie.provider}</td>
                                                                              <td className="py-3 px-2">
                                                                                    <span className="px-2 py-1 bg-[#0066FF]/20 text-[#00F5FF] text-xs rounded">
                                                                                          {cookie.category}
                                                                                    </span>
                                                                              </td>
                                                                              <td className="py-3 px-2 text-[#A0A0A0] max-w-xs">
                                                                                    {cookie.purpose}
                                                                              </td>
                                                                              <td className="py-3 px-2 text-[#A0A0A0]">{cookie.duration}</td>
                                                                              <td className="py-3 px-2 text-[#666666] text-xs">{cookie.data}</td>
                                                                        </tr>
                                                                  ))}
                                                            </tbody>
                                                      </table>
                                                </div>

                                                {sortedCookies.length === 0 && (
                                                      <div className="text-center py-12">
                                                            <p className="text-[#A0A0A0]">No cookies found matching your search criteria.</p>
                                                      </div>
                                                )}
                                          </div>
                                    </section>

                                    {/* Third-Party Services */}
                                    <section id="third-party" className="mb-4">
                                          <LegalAccordion
                                                title="Third-Party Services & Cookies"
                                                icon={<Globe className="w-6 h-6" />}
                                          >
                                                <div className="space-y-4">
                                                      <p className="text-[#A0A0A0] leading-relaxed">
                                                            We integrate with trusted third-party services to enhance your experience. Each service may set its own cookies according to their privacy policies.
                                                      </p>

                                                      <div className="grid gap-4">
                                                            {thirdPartyServices.map((service, idx) => (
                                                                  <div
                                                                        key={idx}
                                                                        className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246] hover:border-[#00F5FF]/30 transition-all"
                                                                  >
                                                                        <div className="flex items-start justify-between mb-2">
                                                                              <h4 className="text-white font-semibold">{service.name}</h4>
                                                                              <a
                                                                                    href={service.policyUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-[#00F5FF] hover:text-[#00CCFF] transition-colors"
                                                                              >
                                                                                    <ExternalLink className="w-4 h-4" />
                                                                              </a>
                                                                        </div>
                                                                        <p className="text-[#A0A0A0] text-sm mb-3">{service.purpose}</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                              {service.cookies.map((cookie, i) => (
                                                                                    <code
                                                                                          key={i}
                                                                                          className="text-xs bg-[#2D3246] text-[#00F5FF] px-2 py-1 rounded"
                                                                                    >
                                                                                          {cookie}
                                                                                    </code>
                                                                              ))}
                                                                        </div>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                </div>
                                          </LegalAccordion>
                                    </section>

                                    {/* Browser Instructions */}
                                    <section id="browser-controls" className="mb-4">
                                          <LegalAccordion
                                                title="Browser-Level Cookie Controls"
                                                icon={<Monitor className="w-6 h-6" />}
                                          >
                                                <div className="space-y-6">
                                                      <p className="text-[#A0A0A0] leading-relaxed">
                                                            You can control and delete cookies through your browser settings. Here is how to manage cookies in popular browsers:
                                                      </p>

                                                      {browserInstructions.map((browser, idx) => (
                                                            <div
                                                                  key={idx}
                                                                  className="bg-[#0F1116] rounded-lg border border-[#2D3246] overflow-hidden"
                                                            >
                                                                  <div className="flex items-center gap-3 p-4 bg-[#2D3246]">
                                                                        <span className="text-2xl">{browser.icon}</span>
                                                                        <h4 className="text-white font-semibold">{browser.browser}</h4>
                                                                  </div>
                                                                  <div className="p-4">
                                                                        <ol className="space-y-2">
                                                                              {browser.steps.map((step, i) => (
                                                                                    <li key={i} className="flex items-start gap-3 text-[#A0A0A0]">
                                                                                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs flex items-center justify-center font-semibold">
                                                                                                {i + 1}
                                                                                          </span>
                                                                                          <span>{step}</span>
                                                                                    </li>
                                                                              ))}
                                                                        </ol>
                                                                  </div>
                                                            </div>
                                                      ))}

                                                      <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                                                            <p className="text-[#F59E0B] text-sm flex items-start gap-2">
                                                                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                  <span>
                                                                        <strong>Note:</strong> Disabling certain cookies may affect platform functionality and your user experience.
                                                                  </span>
                                                            </p>
                                                      </div>
                                                </div>
                                          </LegalAccordion>
                                    </section>

                                    {/* International Compliance */}
                                    <section id="compliance" className="mb-12">
                                          <LegalAccordion
                                                title="International Compliance"
                                                icon={<Shield className="w-6 h-6" />}
                                          >
                                                <div className="space-y-4">
                                                      <p className="text-[#A0A0A0] leading-relaxed">
                                                            Trade Pulse complies with international data protection and cookie regulations across multiple jurisdictions.
                                                      </p>

                                                      <div className="grid md:grid-cols-2 gap-4">
                                                            {[
                                                                  {
                                                                        region: 'European Union (GDPR)',
                                                                        flag: '🇪🇺',
                                                                        requirements: 'Explicit consent required for non-essential cookies. Right to withdraw consent at any time.'
                                                                  },
                                                                  {
                                                                        region: 'California (CCPA/CPRA)',
                                                                        flag: '🇺🇸',
                                                                        requirements: 'Right to opt-out of cookie-based tracking. Sale of personal information disclosure required.'
                                                                  },
                                                                  {
                                                                        region: 'Brazil (LGPD)',
                                                                        flag: '🇧🇷',
                                                                        requirements: 'Clear consent mechanisms and purpose limitation for cookie usage.'
                                                                  },
                                                                  {
                                                                        region: 'Canada (PIPEDA)',
                                                                        flag: '🇨🇦',
                                                                        requirements: 'Meaningful consent and accountability for cookie data collection.'
                                                                  }
                                                            ].map((item, idx) => (
                                                                  <div
                                                                        key={idx}
                                                                        className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]"
                                                                  >
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                              <span className="text-2xl">{item.flag}</span>
                                                                              <h4 className="text-white font-semibold">{item.region}</h4>
                                                                        </div>
                                                                        <p className="text-[#A0A0A0] text-sm">{item.requirements}</p>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                </div>
                                          </LegalAccordion>
                                    </section>
                              </main>

                              {/* Sidebar (30%) - Consent Management */}
                              <aside className="lg:w-[30%]">
                                    <div className="lg:sticky lg:top-8 space-y-6">
                                          {/* Consent Preferences Card */}
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                                      <Settings className="w-6 h-6 text-[#00F5FF]" />
                                                      Your Consent Preferences
                                                </h3>

                                                {/* Current Status */}
                                                <div className="mb-6 p-4 rounded-lg" style={{
                                                      backgroundColor: `${consentLevel.color}20`,
                                                      borderColor: `${consentLevel.color}50`
                                                }}>
                                                      <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm text-[#A0A0A0]">Current Status:</span>
                                                            <span
                                                                  className="px-3 py-1 rounded-full text-xs font-semibold"
                                                                  style={{
                                                                        backgroundColor: `${consentLevel.color}30`,
                                                                        color: consentLevel.color
                                                                  }}
                                                            >
                                                                  {consentLevel.label}
                                                            </span>
                                                      </div>
                                                      <div className="text-xs text-[#A0A0A0]">
                                                            Last updated: {lastUpdated.toLocaleString()}
                                                      </div>
                                                </div>

                                                {/* Consent Toggles */}
                                                <div className="space-y-4 mb-6">
                                                      {Object.entries(consentPreferences).map(([key, value]) => {
                                                            const category = cookieCategories.find(cat =>
                                                                  cat.name.toLowerCase().replace(/\s+/g, '').includes(key.toLowerCase())
                                                            );
                                                            const isRequired = key === 'strictlyNecessary';

                                                            return (
                                                                  <div
                                                                        key={key}
                                                                        // make it to center but not use flex
                                                                        className={`p-4 rounded-lg border flex flex-col justify-center  ${value
                                                                                    ? 'bg-[#0066FF]/10 border-[#0066FF]/50'
                                                                                    : 'bg-[#0F1116] border-[#2D3246]'
                                                                              }`}
                                                                  >
                                                                        <div className="flex items-start justify-between">
                                                                              <div className="flex-1">
                                                                                    <h4 className="text-white font-semibold text-sm mb-1">
                                                                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                                                    <span className='ml-2'>{isRequired && (
                                                                                          <span className="text-[#F59E0B] text-xs">Required</span>
                                                                                    )}</span></h4>
                                                                                    
                                                                                    
                                                                              </div>
                                                                              <Button
                                                                                    onClick={() => handleConsentToggle(key as keyof ConsentPreferences)}
                                                                                    disabled={isRequired}
                                                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-[#0066FF]' : 'bg-[#2D3246]'
                                                                                          } ${isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                              >
                                                                                    <span
                                                                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                                                                                }`}
                                                                                    />
                                                                              </Button>
                                                                        </div>
                                                                  </div>
                                                            );
                                                      })}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="space-y-3 mb-6">
                                                      <button
                                                            onClick={handleSelectAll}
                                                            className="w-full px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors text-sm font-semibold"
                                                      >
                                                            Accept All
                                                      </button>
                                                      <button
                                                            onClick={handleSelectNone}
                                                            className="w-full px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors text-sm font-semibold"
                                                      >
                                                            Reject All (Keep Essential)
                                                      </button>
                                                      <button
                                                            onClick={handleResetToDefault}
                                                            className="w-full px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors text-sm"
                                                      >
                                                            <RefreshCw className="w-4 h-4 inline mr-2" />
                                                            Reset to Default
                                                      </button>
                                                </div>

                                                {/* Save Button */}
                                                <button
                                                      onClick={handleSavePreferences}
                                                      className="w-full px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00F5FF] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
                                                >
                                                      <Check className="w-5 h-5 inline mr-2" />
                                                      Save Preferences
                                                </button>
                                          </div>

                                          {/* CCPA Do Not Sell */}
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                      <Shield className="w-5 h-5 text-[#F59E0B]" />
                                                      CCPA Rights
                                                </h3>

                                                <div className="mb-4">
                                                      <p className="text-sm text-[#A0A0A0] mb-4">
                                                            California residents can opt-out of the &quot;sale&quot; of personal information through cookies.
                                                      </p>

                                                      <div className={`p-4 rounded-lg border flex items-center justify-between ${doNotSell
                                                                  ? 'bg-[#10B981]/10 border-[#10B981]/50'
                                                                  : 'bg-[#0F1116] border-[#2D3246]'
                                                            }`}>
                                                            <div>
                                                                  <h4 className="text-white font-semibold text-sm mb-1">
                                                                        Do Not Sell My Personal Information
                                                                  </h4>
                                                                  <p className="text-xs text-[#A0A0A0]">
                                                                        {doNotSell ? 'Opted out' : 'Not opted out'}
                                                                  </p>
                                                            </div>
                                                            <Button
                                                                  onClick={() => setDoNotSell(!doNotSell)}
                                                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${doNotSell ? 'bg-[#10B981]' : 'bg-[#2D3246]'
                                                                        }`}
                                                            >
                                                                  <span
                                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${doNotSell ? 'translate-x-6' : 'translate-x-1'
                                                                              }`}
                                                            />
                                                            </Button>
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Consent History */}
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                      <History className="w-5 h-5 text-[#7C3AED]" />
                                                      Consent History
                                                </h3>

                                                {consentHistory.length === 0 ? (
                                                      <p className="text-sm text-[#A0A0A0]">
                                                            No consent changes recorded yet.
                                                      </p>
                                                ) : (
                                                      <div className="space-y-3 max-h-64 overflow-y-auto">
                                                            {consentHistory.slice(0, 5).map((entry, idx) => (
                                                                  <div
                                                                        key={idx}
                                                                        className="p-3 bg-[#0F1116] rounded-lg border border-[#2D3246]"
                                                                  >
                                                                        <div className="flex items-start justify-between mb-2">
                                                                              <span className="text-white font-semibold text-sm">
                                                                                    {entry.action}
                                                                              </span>
                                                                              <Clock className="w-4 h-4 text-[#A0A0A0]" />
                                                                        </div>
                                                                        <p className="text-xs text-[#A0A0A0]">
                                                                              {entry.timestamp.toLocaleString()}
                                                                        </p>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                )}

                                                {consentHistory.length > 0 && (
                                                      <button className="mt-4 w-full text-sm text-[#00F5FF] hover:text-[#00CCFF] transition-colors">
                                                            Download Full History
                                                      </button>
                                                )}
                                          </div>

                                          {/* Quick Links */}
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <h3 className="text-lg font-bold text-white mb-4">Related Documents</h3>
                                                <div className="space-y-2">
                                                      {[
                                                            { name: 'Privacy Policy', href: '/privacy' },
                                                            { name: 'Terms of Service', href: '/terms' },
                                                            { name: 'Disclaimer', href: '/disclaimer' },
                                                            { name: 'Data Processing Agreement', href: '/dpa' }
                                                      ].map((link, idx) => (
                                                            <a
                                                                  key={idx}
                                                                  href={link.href}
                                                                  className="flex items-center justify-between p-3 bg-[#0F1116] rounded-lg border border-[#2D3246] hover:border-[#00F5FF]/50 transition-all group"
                                                            >
                                                                  <span className="text-sm text-white group-hover:text-[#00F5FF] transition-colors">
                                                                        {link.name}
                                                                  </span>
                                                                  <ChevronRight className="w-4 h-4 text-[#A0A0A0] group-hover:text-[#00F5FF] transition-colors" />
                                                            </a>
                                                      ))}
                                                </div>
                                          </div>

                                          {/* Contact */}
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <h3 className="text-lg font-bold text-white mb-4">Questions?</h3>
                                                <p className="text-sm text-[#A0A0A0] mb-4">
                                                      Contact our Data Protection Officer for cookie-related inquiries.
                                                </p>
                                                <a
                                                      href="mailto:privacy@tradepulse.com"
                                                      className="text-sm text-[#00F5FF] hover:text-[#00CCFF] transition-colors"
                                                >
                                                      privacy@tradepulse.com
                                                </a>
                                          </div>
                                    </div>
                              </aside>
                        </div>
                  </div>

                  {/* Animated Styles */}
                  <style jsx>{`
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

        @media print {
          aside {
            display: none !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
            </div>
      );
}
