import type { ReactNode } from 'react';
import { 
  AlertTriangle, 
  Check, 
  X, 
  TrendingDown, 
  BarChart3, 
  CreditCard, 
  AlertCircle, 
  Info,
  DollarSign,
  Zap,
  Lock,
  BarChart,
  Globe
} from 'lucide-react';
import DisclaimerAcknowledgment from '@/components/legal/DisclaimerAcknowledgment';
import LegalTLDR from '@/components/legal/LegalTLDR';
import LegalLayout from '@/components/legal/LegalLayout';
import LegalHeader from '@/components/legal/LegalHeader';

interface RiskCategory {
  name: string;
  description: string;
  icon: ReactNode;
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
  const riskCategories: RiskCategory[] = [
    { name: 'Capital Risk', description: 'You can lose ALL of your invested capital.', icon: <DollarSign /> },
    { name: 'Leverage Risk', description: 'Margin trading can amplify losses beyond your investment.', icon: <Zap /> },
    { name: 'Liquidity Risk', description: 'Markets may become illiquid, preventing exit at desired prices.', icon: <Lock /> },
    { name: 'Volatility Risk', description: 'Prices can move rapidly and unpredictably.', icon: <BarChart /> },
    { name: 'Systematic Risk', description: 'Market-wide events can affect all positions.', icon: <Globe /> },
  ];

  return (
    <LegalLayout>
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

        <DisclaimerAcknowledgment />
      </div>
    </LegalLayout>
  );
}
