'use client';

import { useState } from 'react';
import {
      ChevronDown, Download, Printer, FileText, Cookie, Search, Filter,
      ArrowUpDown, Check, Info, Clock, Shield, Globe, ExternalLink,
      Settings, History, AlertCircle, RefreshCw, Database,
      ChevronRight, ChartNoAxesCombined,
      ChartSpline,
      BookHeart,
      ChartCandlestick,
      LockKeyhole,
      Handshake,
      Target,
      Blocks,
      Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Cookie data structure
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

interface AccordionProps {
      title: string;
      icon: React.ReactNode;
      children: React.ReactNode;
      defaultOpen?: boolean;
      color?: string;
}

function Accordion({ title, icon, children, defaultOpen = false, color = '#00F5FF' }: AccordionProps) {
      const [isOpen, setIsOpen] = useState(defaultOpen);

      return (
            <div className="border border-[#2D3246] rounded-lg overflow-hidden mb-4 transition-all duration-300 hover:border-[#00F5FF]/30">
                  <Button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-6 bg-[#2D3246] hover:bg-[#353B52] transition-colors"
                        aria-expanded={isOpen}
                  >
                        <div className="flex items-center gap-4">
                              <div style={{ color }}>{icon}</div>
                              <h2 className="text-xl font-semibold text-white text-left">{title}</h2>
                        </div>
                        <ChevronDown
                              className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                              style={{ color }}
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

const cookieCategories = [
      {
            name: 'Strictly Necessary',
            color: '#10B981',
            mandatory: true,
            icon: <Shield className="w-6 h-6" />,
            purpose: 'Core platform functionality, security, login sessions',
            examples: ['Session cookies', 'Authentication tokens', 'CSRF protection', 'Load balancing'],
            description: 'These cookies are essential for the platform to function properly. They enable core functionalities such as security, network management, and accessibility.'
      },
      {
            name: 'Performance & Analytics',
            color: '#00F5FF',
            mandatory: false,
            icon: <ChartNoAxesCombined className="w-6 h-6" />,
            purpose: 'Platform optimization, bug tracking, user behavior analytics',
            examples: ['Google Analytics', 'Error tracking', 'Performance metrics', 'User behavior analysis'],
            description: 'These cookies help us understand how you interact with the platform, allowing us to improve performance and user experience.'
      },
      {
            name: 'Functionality & Personalization',
            color: '#0066FF',
            mandatory: false,
            icon: <Settings className="w-6 h-6" />,
            purpose: 'Remember preferences, watchlists, dashboard layouts, alerts',
            examples: ['Layout preferences', 'Watchlist storage', 'Theme selection', 'Language preferences'],
            description: 'These cookies enable personalized features and remember your preferences across sessions.'
      },
      {
            name: 'Marketing & Targeting',
            color: '#F59E0B',
            mandatory: false,
            icon: <Target className="w-6 h-6" />,
            purpose: 'Relevant trading offers, broker recommendations, content suggestions',
            examples: ['Ad personalization', 'Retargeting pixels', 'Affiliate tracking', 'Conversion tracking'],
            description: 'These cookies track your activity to deliver personalized advertising and measure campaign effectiveness.'
      },
      {
            name: 'Third-Party Integrations',
            color: '#8B5CF6',
            mandatory: false,
            icon: <Blocks className="w-6 h-6" />,
            purpose: 'TradingView charts, news feeds, broker API connections',
            examples: ['TradingView widgets', 'News provider cookies', 'Payment processors', 'Social media embeds'],
            description: 'These cookies enable third-party services integrated into our platform to function properly.'
      }
];

const sampleCookieData: CookieData[] = [
      {
            name: 'trade_session',
            provider: 'Trade Pulse (First-party)',
            category: 'Strictly Necessary',
            purpose: 'Maintain user login session and authentication state',
            duration: 'Session',
            data: 'Encrypted user ID, session token'
      },
      {
            name: 'csrf_token',
            provider: 'Trade Pulse (First-party)',
            category: 'Strictly Necessary',
            purpose: 'Prevent cross-site request forgery attacks',
            duration: 'Session',
            data: 'Random token string'
      },
      {
            name: 'watchlist_prefs',
            provider: 'Trade Pulse (First-party)',
            category: 'Functionality',
            purpose: 'Store user watchlist preferences and symbols',
            duration: '1 year',
            data: 'Instrument symbols, sort preferences'
      },
      {
            name: 'dashboard_layout',
            provider: 'Trade Pulse (First-party)',
            category: 'Functionality',
            purpose: 'Remember custom dashboard widget arrangements',
            duration: '1 year',
            data: 'Widget positions, sizes, visibility'
      },
      {
            name: 'theme_preference',
            provider: 'Trade Pulse (First-party)',
            category: 'Functionality',
            purpose: 'Store dark/light mode preference',
            duration: '1 year',
            data: 'Theme selection (dark/light)'
      },
      {
            name: '_ga',
            provider: 'Google Analytics (Third-party)',
            category: 'Performance',
            purpose: 'Distinguish unique users for analytics',
            duration: '2 years',
            data: 'Client ID, timestamps'
      },
      {
            name: '_gid',
            provider: 'Google Analytics (Third-party)',
            category: 'Performance',
            purpose: 'Distinguish users for daily analytics',
            duration: '24 hours',
            data: 'Client ID, session data'
      },
      {
            name: 'tradingview_session',
            provider: 'TradingView (Third-party)',
            category: 'Third-Party',
            purpose: 'Enable TradingView chart functionality',
            duration: 'Session',
            data: 'Chart preferences, session state'
      },
      {
            name: 'stripe_sid',
            provider: 'Stripe (Third-party)',
            category: 'Strictly Necessary',
            purpose: 'Payment processing and fraud prevention',
            duration: '30 minutes',
            data: 'Session identifier for payment'
      },
      {
            name: 'ad_preferences',
            provider: 'Trade Pulse (First-party)',
            category: 'Marketing',
            purpose: 'Store advertising consent and preferences',
            duration: '1 year',
            data: 'Consent status, preference flags'
      },
      {
            name: '_fbp',
            provider: 'Facebook (Third-party)',
            category: 'Marketing',
            purpose: 'Track visits across websites for advertising',
            duration: '3 months',
            data: 'Browser ID, visit timestamps'
      },
      {
            name: 'affiliate_ref',
            provider: 'Trade Pulse (First-party)',
            category: 'Marketing',
            purpose: 'Track affiliate referrals and conversions',
            duration: '30 days',
            data: 'Referral source, campaign ID'
      }
];

const thirdPartyServices = [
      {
            name: 'Google Analytics',
            purpose: 'Website analytics and user behavior tracking',
            policyUrl: 'https://policies.google.com/privacy',
            cookies: ['_ga', '_gid', '_gat']
      },
      {
            name: 'TradingView',
            purpose: 'Interactive trading charts and market data visualization',
            policyUrl: 'https://www.tradingview.com/privacy-policy/',
            cookies: ['tradingview_session', 'tv_ecuid']
      },
      {
            name: 'Stripe',
            purpose: 'Payment processing and subscription management',
            policyUrl: 'https://stripe.com/privacy',
            cookies: ['stripe_sid', '__stripe_mid']
      },
      {
            name: 'Facebook Pixel',
            purpose: 'Advertising and conversion tracking',
            policyUrl: 'https://www.facebook.com/privacy/explanation',
            cookies: ['_fbp', 'fr']
      },
      {
            name: 'SendGrid',
            purpose: 'Email delivery and notification services',
            policyUrl: 'https://www.twilio.com/legal/privacy',
            cookies: ['sendgrid_session']
      }
];

const browserInstructions = [
      {
            browser: 'Chrome',
            icon: '🌐',
            steps: [
                  'Click the three dots menu → Settings',
                  'Click "Privacy and security" → "Cookies and other site data"',
                  'Choose your preferred cookie settings',
                  'Or click "See all cookies and site data" to manage individual cookies'
            ]
      },
      {
            browser: 'Firefox',
            icon: '🦊',
            steps: [
                  'Click the menu button → Settings',
                  'Select "Privacy & Security"',
                  'Under "Cookies and Site Data", click "Manage Data"',
                  'Search for "tradepulse.com" and remove cookies as needed'
            ]
      },
      {
            browser: 'Safari',
            icon: '🧭',
            steps: [
                  'Safari → Preferences → Privacy',
                  'Click "Manage Website Data"',
                  'Search for "tradepulse.com"',
                  'Click "Remove" or "Remove All"'
            ]
      },
      {
            browser: 'Edge',
            icon: '🌊',
            steps: [
                  'Click the three dots → Settings',
                  'Select "Cookies and site permissions"',
                  'Click "Manage and delete cookies and site data"',
                  'Click "See all cookies and site data"'
            ]
      },
      {
            browser: 'Brave',
            icon: '🦁',
            steps: [
                  'Click the menu → Settings',
                  'Go to "Privacy and security" → "Cookies and other site data"',
                  'Choose "Block third-party cookies" or custom settings',
                  'Manage site-specific settings as needed'
            ]
      }
];

export default function CookiePolicyPage() {
      const [searchQuery, setSearchQuery] = useState('');
      const [filterCategory, setFilterCategory] = useState('All');
      const [sortColumn, setSortColumn] = useState<keyof CookieData | null>(null);
      const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
      const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
      const [isScanning, setIsScanning] = useState(false);

      const [consentPreferences, setConsentPreferences] = useState<ConsentPreferences>({
            strictlyNecessary: true,
            performance: false,
            functionality: false,
            marketing: false,
            thirdParty: false,
      });

      const [consentHistory, setConsentHistory] = useState<Array<{
            timestamp: Date;
            action: string;
            preferences: ConsentPreferences;
      }>>([]);

      const [doNotSell, setDoNotSell] = useState(false);

      // Filter and sort cookie data
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
                  preferences: { ...consentPreferences }
            };

            setConsentHistory(prev => [newHistoryEntry, ...prev]);
            setLastUpdated(new Date());

            // In production, this would save to backend
            console.log('Saving consent preferences:', consentPreferences);
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

                  {/* Main Content */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col lg:flex-row gap-8">
                              {/* Main Content Area (70%) */}
                              <main className="flex-1 lg:w-[70%]">
                                    {/* Introduction */}
                                    <section id="introduction" className="mb-12">
                                          <Accordion
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
                                          </Accordion>
                                    </section>

                                    {/* Why We Use Cookies */}
                                    <section id="why-we-use" className="mb-12">
                                          <Accordion
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
                                          </Accordion>
                                    </section>

                                    {/* Cookie Categories */}
                                    <section id="categories" className="mb-12">
                                          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <Database className="w-7 h-7 text-[#00F5FF]" />
                                                Cookie Categories on Trade Pulse
                                          </h2>

                                          {cookieCategories.map((category, idx) => (
                                                <Accordion
                                                      key={idx}
                                                      title={category.name}
                                                      icon={<span className="text-2xl">{category.icon}</span>}
                                                      color={category.color}
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
                                                </Accordion>
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
                                          <Accordion
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
                                          </Accordion>
                                    </section>

                                    {/* Browser Instructions */}
                                    <section id="browser-controls" className="mb-4">
                                          <Accordion
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
                                          </Accordion>
                                    </section>

                                    {/* International Compliance */}
                                    <section id="compliance" className="mb-12">
                                          <Accordion
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
                                          </Accordion>
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
