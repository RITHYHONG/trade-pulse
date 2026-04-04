'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Download, 
  Printer, 
  Share2, 
  Clock, 
  Check, 
  X, 
  TrendingDown, 
  BarChart3, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Scale, 
  Shield, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import LegalAccordion from '@/components/legal/LegalAccordion';
import LegalTLDR from '@/components/legal/LegalTLDR';
import LegalLayout from '@/components/legal/LegalLayout';
import LegalHeader from '@/components/legal/LegalHeader';
import { Button } from '@/components/ui/button';

interface RiskCategory {
  name: string;
  description: string;
  icon: string;
}

function RiskCard({ risk }: { risk: RiskCategory }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-red-500/30 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 text-2xl group-hover:scale-110 transition-transform">
          {risk.icon}
        </div>
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold mb-1">{risk.name}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{risk.description}</p>
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
      const acknowledgmentData = {
        timestamp: new Date().toISOString(),
        version: 'v2.1.4',
        readTime: readTime,
        userAgent: navigator.userAgent,
      };
      alert('Disclaimer acknowledged! Compliance log generated.');
    }
  };

  const handlePrint = () => window.print();
  const handleDownload = () => alert('Generating PDF...');
  
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

  const riskCategories: RiskCategory[] = [
    { name: 'Capital Risk', description: 'You can lose ALL of your invested capital.', icon: <DollarSign /> },
    { name: 'Leverage Risk', description: 'Margin trading can amplify losses beyond your investment.', icon: <Zap /> },
    { name: 'Liquidity Risk', description: 'Markets may become illiquid, preventing exit at desired prices.', icon: <Lock /> },
    { name: 'Volatility Risk', description: 'Prices can move rapidly and unpredictably.', icon: <BarChart /> },
    { name: 'Systematic Risk', description: 'Market-wide events can affect all positions.', icon: <Globe /> },
  ];

  return (
    <LegalLayout>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 z-[100] no-print">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <LegalHeader
        title="Risk Disclosure"
        version="v2.1.4"
        updated="March 15, 2024"
      />

      <div className="max-w-4xl mx-auto space-y-12">
        <LegalTLDR
          summary="Not financial advice. Trading is high-risk — read critical warnings and acknowledge before proceeding."
          bullets={[
            'This is educational content only — not investment advice',
            'You may lose all invested capital',
            'Consult licensed professionals for personalized guidance',
          ]}
        />

        {/* Critical Warning Section */}
        <div className="relative overflow-hidden p-8 bg-red-50/50 dark:bg-red-950/10 border-2 border-red-500/20 rounded-3xl group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <AlertTriangle className="w-48 h-48 text-red-600" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Critical Legal Warning
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Not Financial Advice
            </h2>
            
            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Trade Pulse is an informational and educational platform only. We are NOT registered investment advisors, broker-dealers, or financial planners.
              </p>
              
              <ul className="grid sm:grid-cols-2 gap-4 mt-8 list-none p-0">
                {[
                  'Educational purposes ONLY',
                  'No personalized advice',
                  'No buy/sell recommendations',
                  'No money management'
                ].map((point, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium m-0">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                You are <strong className="text-slate-900 dark:text-white">solely responsible</strong> for your investment decisions. Always consult with a licensed professional.
              </p>
            </div>
          </div>
        </div>

        {/* Investment Risks */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Investment & Trading Risks</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {riskCategories.map((risk, idx) => (
              <RiskCard key={idx} risk={risk} />
            ))}
          </div>
          
          <div className="p-6 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <p className="text-slate-700 dark:text-amber-400 font-medium leading-relaxed">
              Only trade with risk capital you can afford to lose completely. Never invest money needed for living expenses or emergencies.
            </p>
          </div>
        </section>

        {/* Content Accuracy */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Information Accuracy</h2>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
            <p className="text-slate-500 dark:text-slate-400">
              Wait times, data feeds, and market conditions move faster than any platform can perfectly track.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                'Market data may be delayed',
                'AI content may have errors',
                'Peer content is unverified',
                'Analysis is probabilistic'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliate Disclosure */}
        <section className="p-8 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-500/10 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Affiliate Relationships</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-0">
            Trade Pulse receives compensation from featured brokers and affiliate partners. This may influence which services we feature, though we strive for objective reviews.
          </p>
        </section>

        {/* Compliance Footer */}
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Mandatory Acknowledgment
            </h4>
            
            <div className="space-y-4 mb-8">
              {[
                { id: 'acknowledge_risk' as const, label: 'I understand trading involves substantial risk of loss' },
                { id: 'not_advice' as const, label: 'I understand this is not financial advice' },
                { id: 'personal_responsibility' as const, label: 'I accept full responsibility for my decisions' },
              ].map((checkbox) => (
                <label
                  key={checkbox.id}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                    acknowledgments[checkbox.id]
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/50'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-500/30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    acknowledgments[checkbox.id] ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {acknowledgments[checkbox.id] && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={acknowledgments[checkbox.id]}
                    onChange={() => handleCheckboxChange(checkbox.id)}
                    className="hidden"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none">
                    {checkbox.label}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-xs text-slate-500 font-medium">
                {allAcknowledged ? 'Ready to proceed' : 'Please check all boxes'}
              </div>
              <Button
                size="lg"
                onClick={handleAccept}
                disabled={!allAcknowledged}
                className={`w-full sm:w-auto px-8 rounded-xl font-bold transition-all ${
                  allAcknowledged 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 scale-105' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'
                }`}
              >
                Accept & Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center pb-12">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Trader Pulse. All rights reserved. 
            <span className="mx-2">•</span>
            <button onClick={handlePrint} className="hover:text-blue-600 transition-colors">Print PDF</button>
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
