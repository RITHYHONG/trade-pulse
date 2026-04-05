import LegalTLDR from '@/components/legal/LegalTLDR';
import LegalHeader from '@/components/legal/LegalHeader';
import LegalLayout from '@/components/legal/LegalLayout';

interface ConsentPreferences {
      strictlyNecessary: boolean;
      performance: boolean;
      functionality: boolean;
      marketing: boolean;
      thirdParty: boolean;
}

const consentPreferences: ConsentPreferences = {
      strictlyNecessary: true,
      performance: false,
      functionality: false,
      marketing: false,
      thirdParty: false,
};

const getConsentLevel = (preferences: ConsentPreferences) => {
      const enabledCount = Object.values(preferences).filter(Boolean).length;
      const totalCount = Object.keys(preferences).length;

      if (enabledCount === 1) return { label: 'Minimum Essential', color: '#F59E0B' };
      if (enabledCount === totalCount) return { label: 'Full Personalization', color: '#10B981' };
      return { label: 'Enhanced Experience', color: '#0066FF' };
};

export default function CookiePolicyPage() {
      const consentLevel = getConsentLevel(consentPreferences);

      const consentColorClass = consentLevel.label === 'Minimum Essential'
            ? 'bg-amber-500'
            : consentLevel.label === 'Full Personalization'
                  ? 'bg-emerald-500'
                  : 'bg-blue-500';

      return (
            <LegalLayout>
                  <LegalHeader
                        title="Cookie Policy"
                        version="Version 2.1"
                        updated="March 15, 2024"
                  />

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
                                    <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                          <h2 className="text-xl font-bold text-white mb-4">Cookie Policy</h2>
                                          <p className="text-[#A0A0A0] leading-relaxed">
                                                This page provides information about how Trade Pulse uses cookies to enhance your trading experience.
                                                You can manage your cookie preferences using the controls in the sidebar.
                                          </p>
                                    </div>
                              </main>

                              <aside className="lg:w-[30%]">
                                    <div className="lg:sticky lg:top-8 space-y-6">
                                          <div className="bg-[#1A1D28] rounded-lg border border-[#2D3246] p-6">
                                                <h3 className="text-lg font-bold text-white mb-4">Consent Status</h3>
                                                <div className="flex items-center gap-3 mb-4">
                                                      <div className={`w-4 h-4 rounded-full ${consentColorClass}`}></div>
                                                      <span className="text-white font-semibold">{consentLevel.label}</span>
                                                </div>
                                          </div>
                                    </div>
                              </aside>
                        </div>
                  </div>
            </LegalLayout>
      );
}
