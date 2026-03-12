'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, Download, Printer, Share2, Clock, Check, X, TrendingDown, BarChart3, Users, CreditCard, TrendingUp, Scale, Shield, AlertCircle, FileText, ExternalLink } from 'lucide-react';

interface RiskCategory {
  name: string;
  description: string;
  icon: string;
}

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isWarning?: boolean;
}

function AccordionSection({ id, title, icon, children, defaultOpen = false, isWarning = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      id={id}
      className={`border rounded-lg overflow-hidden mb-4 transition-all duration-300 ${isWarning
          ? 'border-[#EF4444] bg-[#EF4444]/10'
          : 'border-[#2D3246] hover:border-[#00F5FF]/30'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 transition-colors ${isWarning
            ? 'bg-[#EF4444]/20 hover:bg-[#EF4444]/30'
            : 'bg-[#2D3246] hover:bg-[#353B52]'
          }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className={isWarning ? 'text-[#EF4444]' : 'text-[#00F5FF]'}>{icon}</div>
          <h2 className={`text-xl font-semibold text-left ${isWarning ? 'text-[#EF4444]' : 'text-white'}`}>
            {title}
          </h2>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
            } ${isWarning ? 'text-[#EF4444]' : 'text-[#00F5FF]'}`}
        />
      </button>
      {isOpen && (
        <div className="p-6 bg-[#1A1D28] animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskCategory }) {
  return (
    <div className="p-4 bg-[#0F1116] rounded-lg border border-[#EF4444]/30 hover:border-[#EF4444]/50 transition-all">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{risk.icon}</span>
        <div>
          <h4 className="text-white font-semibold mb-1">{risk.name}</h4>
          <p className="text-[#A0A0A0] text-sm">{risk.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function DisclaimerPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [acknowledgments, setAcknowledgments] = useState({
    acknowledge_risk: false,
    not_advice: false,
    personal_responsibility: false,
  });

  const allAcknowledged = Object.values(acknowledgments).every(value => value);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckboxChange = (id: keyof typeof acknowledgments) => {
    setAcknowledgments(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAccept = () => {
    if (allAcknowledged) {
      // Log acknowledgment with timestamp
      const acknowledgmentData = {
        timestamp: new Date().toISOString(),
        version: 'v2.1.4',
        readTime: readTime,
        userAgent: navigator.userAgent,
      };

      // In production, this would send to backend
      alert('Disclaimer acknowledged! In production, this would be logged and you would be redirected to the dashboard.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download PDF functionality would generate a PDF version of this disclaimer.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Trade Pulse Disclaimer',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const riskCategories: RiskCategory[] = [
    {
      name: 'Capital Risk',
      description: 'You can lose ALL of your invested capital. Trading involves substantial risk of loss.',
      icon: '💸',
    },
    {
      name: 'Leverage Risk',
      description: 'Margin trading can amplify losses beyond your initial investment.',
      icon: '⚡',
    },
    {
      name: 'Liquidity Risk',
      description: 'Markets may become illiquid, preventing exit at desired prices.',
      icon: '🔒',
    },
    {
      name: 'Volatility Risk',
      description: 'Prices can move rapidly and unpredictably, especially in crypto markets.',
      icon: '📊',
    },
    {
      name: 'Systematic Risk',
      description: 'Market-wide events can affect all positions regardless of quality.',
      icon: '🌍',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F1116]">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#2D3246] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Warning Banner */}
      <div className="sticky top-0 bg-[#EF4444] text-black py-4 px-4 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-pulse" />
            <p className="font-bold text-lg">
              ⚠️ IMPORTANT LEGAL DISCLAIMER - READ CAREFULLY
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(readTime)}</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold">{Math.round(scrollProgress)}%</span> Complete
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-[#2D3246] bg-[#1A1D28]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-4">
            <a href="/" className="hover:text-[#00F5FF] transition-colors">Home</a>
            <span>→</span>
            <span>Legal</span>
            <span>→</span>
            <span className="text-[#00F5FF]">Disclaimer</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-3">
              Trade Pulse Disclaimer & Risk Disclosure Statement
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-[#EF4444]/20 text-[#EF4444] text-sm rounded-full border border-[#EF4444]/30 font-semibold">
                v2.1.4
              </span>
              <span className="text-[#A0A0A0] text-sm">
                Last Updated: March 15, 2024
              </span>
              <span className="text-[#A0A0A0] text-sm">
                • Est. Read Time: 8-10 minutes
              </span>
            </div>
          </div>

          {/* Document Tools */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
              aria-label="Print disclaimer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
              aria-label="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-[#2D3246] text-white rounded-lg hover:bg-[#353B52] transition-colors"
              aria-label="Share disclaimer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <a
              href="/privacy"
              className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy Policy</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Critical Warning Section - Always Visible */}
        <div
          id="critical_warning"
          className="mb-8 border-4 border-[#EF4444] rounded-lg overflow-hidden animate-pulse-border"
        >
          <div className="bg-[#EF4444]/20 p-6">
            <div className="flex items-start gap-4">
              <div className="text-[#EF4444]">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#EF4444] mb-4">
                  ❗ CRITICAL WARNING: NOT FINANCIAL ADVICE
                </h2>
                <div className="bg-[#1A1D28] p-5 rounded-lg border border-[#EF4444]/30 mb-4">
                  <p className="text-white text-lg font-semibold mb-4">
                    Trade Pulse is an informational and educational platform only. We are NOT registered investment advisors, broker-dealers, or financial planners.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'All content is for informational purposes ONLY',
                      'No content constitutes personalized investment advice',
                      'We do not provide buy/sell recommendations',
                      'We do not manage money or execute trades',
                    ].map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[#A0A0A0]">
                        <X className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/50 rounded-lg p-4">
                  <p className="text-[#EF4444] font-bold text-sm">
                    🚨 YOU ARE SOLELY RESPONSIBLE FOR YOUR INVESTMENT DECISIONS. Always consult with a licensed financial professional before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Risks Section */}
        <AccordionSection
          id="investment_risks"
          title="Investment & Trading Risks"
          icon={<TrendingDown className="w-6 h-6" />}
          defaultOpen={true}
          isWarning={true}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {riskCategories.map((risk, idx) => (
                <RiskCard key={idx} risk={risk} />
              ))}
            </div>

            <div className="mt-6 p-5 bg-[#EF4444]/10 border-2 border-[#EF4444] rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#EF4444] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#EF4444] font-bold text-lg mb-2">
                    CRITICAL WARNING
                  </h4>
                  <p className="text-white font-semibold">
                    Only trade with risk capital you can afford to lose completely. Never invest money you need for living expenses, emergency funds, or retirement.
                  </p>
                </div>
              </div>
            </div>

            {/* Regulatory Statements */}
            <div className="mt-4 p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#00F5FF]" />
                Regulatory Disclosures
              </h4>
              <div className="space-y-2 text-sm text-[#A0A0A0] font-mono">
                <p>• SEC Rule 17b: This material is for informational purposes only.</p>
                <p>• FINRA Rule 2210: All investments involve risk.</p>
                <p>• CFTC Rule 4.41: Hypothetical performance has inherent limitations.</p>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Information Accuracy Disclaimer */}
        <AccordionSection
          id="content_accuracy"
          title="Information Accuracy Disclaimer"
          icon={<BarChart3 className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <p className="text-[#A0A0A0] leading-relaxed">
              While we strive for accuracy, financial markets move rapidly and information can become outdated or incorrect.
            </p>

            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3">Accuracy Limitations</h4>
              <ul className="space-y-2">
                {[
                  'Market data may be delayed or inaccurate',
                  'AI-generated content may contain errors',
                  'User-submitted content is not verified in real-time',
                  'Technical analysis is probabilistic, not predictive',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                    <AlertCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
              <p className="text-[#F59E0B] font-semibold">
                ⚠️ Always verify information through multiple primary sources before making trading decisions. Do your own research (DYOR).
              </p>
            </div>

            <p className="text-sm text-[#666666]">
              All content has publication timestamps, but markets move continuously. Information may be outdated immediately after publication.
            </p>
          </div>
        </AccordionSection>

        {/* Community Content & User Submissions */}
        <AccordionSection
          id="user_content_disclaimer"
          title="Community Content & User Submissions"
          icon={<Users className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <p className="text-[#A0A0A0] leading-relaxed">
              Trade Pulse features user-submitted news, analysis, and trade ideas. This content represents individual opinions and should not be considered investment advice.
            </p>

            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3">Important Clarifications</h4>
              <div className="space-y-3">
                {[
                  { label: 'AI verification', note: 'accuracy guarantee' },
                  { label: 'Community consensus', note: 'investment recommendation' },
                  { label: 'Expert badges', note: 'endorsement of content accuracy' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[#A0A0A0]">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="text-[#EF4444]">≠</span>
                    <span>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Moderation Policy</h4>
              <p className="text-[#A0A0A0] text-sm">
                We moderate for spam, abuse, and violations of our terms of service. We do NOT moderate for investment quality, accuracy, or suitability. All user content should be independently verified.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Affiliate Disclosures */}
        <AccordionSection
          id="affiliate_disclosures"
          title="Affiliate Relationships & Compensation"
          icon={<CreditCard className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4">
              <h4 className="text-[#F59E0B] font-bold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Full Disclosure Required
              </h4>
              <p className="text-[#A0A0A0]">
                Trade Pulse receives compensation from featured brokers, service providers, and affiliate partners. This may influence which products and services we feature.
              </p>
            </div>

            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3">Compensation Disclosure</h4>
              <ul className="space-y-2">
                {[
                  'We receive compensation from featured brokers (affiliate links)',
                  'This may influence which brokers we feature',
                  'We strive to maintain objective reviews despite compensation',
                  'We disclose affiliate links with clear labeling',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                    <Check className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[#A0A0A0] text-sm">
              <strong className="text-white">Your Responsibility:</strong> You are responsible for conducting due diligence on any service provider, broker, or product before making a purchase or opening an account.
            </p>
          </div>
        </AccordionSection>

        {/* Past Performance & Backtesting */}
        <AccordionSection
          id="performance_disclaimer"
          title="Past Performance & Backtesting"
          icon={<TrendingUp className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <div className="bg-[#EF4444]/10 border-2 border-[#EF4444] rounded-lg p-5">
              <h4 className="text-[#EF4444] font-bold text-lg mb-3">
                PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS
              </h4>
              <p className="text-[#A0A0A0]">
                Any historical returns, expected returns, or probability projections are hypothetical and may not reflect actual future performance.
              </p>
            </div>

            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3">Limitations & Disclaimers</h4>
              <ul className="space-y-2">
                {[
                  'Past performance does NOT guarantee future results',
                  'Backtested results have inherent limitations',
                  'Paper trading results differ from live trading',
                  'Hypothetical performance has many limitations',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                    <X className="w-4 h-4 text-[#EF4444] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
              <p className="text-sm text-[#666666] font-mono">
                <strong className="text-white">CFTC Rule 4.41:</strong> Hypothetical or simulated performance results have certain limitations. Unlike an actual performance record, simulated results do not represent actual trading. Also, because the trades have not actually been executed, the results may have under- or over-compensated for the impact, if any, of certain market factors, such as lack of liquidity.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Jurisdiction & Governing Law */}
        <AccordionSection
          id="jurisdiction_governing_law"
          title="Jurisdiction & Regulatory Compliance"
          icon={<Scale className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <p className="text-[#A0A0A0] leading-relaxed">
              Trade Pulse operates subject to applicable U.S. securities laws and regulations. Users in other jurisdictions must comply with their local laws.
            </p>

            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3">Applicable Laws</h4>
              <ul className="space-y-2">
                {[
                  'U.S. securities laws apply to U.S. persons',
                  'Local regulations apply based on user residence',
                  'Platform not available in prohibited jurisdictions',
                  'Users must be 18+ (21+ in some jurisdictions)',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                    <Check className="w-4 h-4 text-[#00F5FF] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Your Responsibility</h4>
              <p className="text-[#A0A0A0] text-sm">
                You are responsible for compliance with all applicable laws and regulations in your jurisdiction. Legal questions should be directed to licensed professionals in your jurisdiction.
              </p>
            </div>

            <div className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-2">Prohibited Jurisdictions</h4>
              <p className="text-[#A0A0A0] text-sm">
                This platform is not available to residents of certain jurisdictions where such services are prohibited by law. By using this platform, you represent that you are not located in a prohibited jurisdiction.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Limitation of Liability */}
        <AccordionSection
          id="limitation_of_liability"
          title="Limitation of Liability"
          icon={<Shield className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-4">
              <h4 className="text-[#EF4444] font-bold mb-2">Liability Cap</h4>
              <p className="text-white font-semibold mb-2">
                To the maximum extent permitted by law, Trade Pulse's total liability to you is limited to the subscription fees you paid in the last 12 months.
              </p>
              <p className="text-[#A0A0A0] text-sm">
                This limitation applies to all claims, whether based on warranty, contract, tort, or any other legal theory.
              </p>
            </div>

            <div className="bg-[#0F1116] p-4 rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-3">Exclusions of Liability</h4>
              <ul className="space-y-2">
                {[
                  'No liability for trading losses',
                  'No liability for consequential damages',
                  'No liability for third-party content',
                  'No liability for system outages or data errors',
                  'No liability for missed opportunities',
                  'No liability for broker or exchange failures',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#A0A0A0]">
                    <X className="w-4 h-4 text-[#EF4444] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#0F1116] rounded-lg border border-[#2D3246]">
              <h4 className="text-white font-semibold mb-2">Indemnification</h4>
              <p className="text-[#A0A0A0] text-sm">
                You agree to indemnify, defend, and hold harmless Trade Pulse, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the platform or violation of these terms.
              </p>
            </div>

            <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
              <p className="text-[#F59E0B] font-semibold text-sm">
                ⚠️ USE AT YOUR OWN RISK: The platform is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Mandatory Acknowledgment Section */}
        <div className="mt-12 p-8 bg-[#1A1D28] rounded-lg border-2 border-[#0066FF]">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertCircle className="w-7 h-7 text-[#0066FF]" />
            Mandatory Acknowledgment
          </h3>

          <p className="text-[#A0A0A0] mb-6 leading-relaxed">
            Before proceeding, you must read and acknowledge the disclaimers above. By checking these boxes, you confirm that you have read, understood, and agree to the terms outlined in this disclaimer.
          </p>

          <div className="space-y-4 mb-6">
            {[
              {
                id: 'acknowledge_risk' as const,
                label: 'I understand that trading involves substantial risk of loss and I may lose all of my invested capital',
              },
              {
                id: 'not_advice' as const,
                label: 'I understand that Trade Pulse does not provide financial advice and all content is for informational purposes only',
              },
              {
                id: 'personal_responsibility' as const,
                label: 'I accept full responsibility for my trading decisions and will not hold Trade Pulse liable for any losses',
              },
            ].map((checkbox) => (
              <label
                key={checkbox.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${acknowledgments[checkbox.id]
                    ? 'bg-[#0066FF]/10 border-[#0066FF]'
                    : 'bg-[#0F1116] border-[#2D3246] hover:border-[#0066FF]/50'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={acknowledgments[checkbox.id]}
                  onChange={() => handleCheckboxChange(checkbox.id)}
                  className="mt-1 w-5 h-5 rounded border-[#2D3246] text-[#0066FF] focus:ring-[#0066FF] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-white font-medium flex-1">{checkbox.label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#2D3246]">
            <div className="text-sm text-[#A0A0A0]">
              {allAcknowledged ? (
                <span className="flex items-center gap-2 text-[#10B981]">
                  <Check className="w-5 h-5" />
                  All acknowledgments completed
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                  Please check all boxes to proceed
                </span>
              )}
            </div>
            <button
              onClick={handleAccept}
              disabled={!allAcknowledged}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all transform ${allAcknowledged
                  ? 'bg-[#0066FF] text-white hover:bg-[#0052CC] hover:scale-105 cursor-pointer'
                  : 'bg-[#2D3246] text-[#666666] cursor-not-allowed opacity-50'
                }`}
            >
              I Accept & Acknowledge All Disclaimers
            </button>
          </div>

          <p className="text-xs text-[#666666] mt-4 text-center">
            By clicking the button above, your acknowledgment will be logged with a timestamp for compliance purposes.
          </p>
        </div>

        {/* Related Documents */}
        <div className="mt-8 p-6 bg-[#1A1D28] rounded-lg border border-[#2D3246]">
          <h3 className="text-lg font-semibold text-white mb-4">Related Legal Documents</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Terms of Service', href: '/terms' },
              { name: 'Cookie Policy', href: '/privacy#cookies' },
            ].map((doc, idx) => (
              <a
                key={idx}
                href={doc.href}
                className="flex items-center gap-2 p-3 bg-[#2D3246] rounded-lg hover:bg-[#353B52] transition-colors group"
              >
                <FileText className="w-4 h-4 text-[#00F5FF]" />
                <span className="text-sm text-white group-hover:text-[#00F5FF] transition-colors">{doc.name}</span>
                <ExternalLink className="w-3 h-3 text-[#A0A0A0] ml-auto" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Styles */}
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }

        .animate-pulse-border {
          animation: pulse-border 2s infinite;
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

        @media print {
          .no-print, button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}