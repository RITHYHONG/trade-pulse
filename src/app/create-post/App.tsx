import { useState } from 'react';
import { NewsInputSection } from './components/NewsInputSection';
import { CategorizationSection } from './components/CategorizationSection';
import { AnalysisSection } from './components/AnalysisSection';
import { VerificationSection } from './components/VerificationSection';
import { PreviewSection } from './components/PreviewSection';
import { AIAssistantPanel } from './components/AIAssistantPanel';
import { ReputationDisplay } from './components/ReputationDisplay';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { QuickModeSelector } from './components/QuickModeSelector';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { ScrollArea } from './components/ui/scroll-area';
import { Send, ChevronRight, Lightbulb } from 'lucide-react';

export default function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(true);

  const handleModeSelect = (mode: 'breaking' | 'analysis' | 'trade' | 'research') => {
    setSelectedMode(mode);
    setShowModeSelector(false);
  };

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setShowModeSelector(true);
    setSelectedMode(null);
  };

  return (
    <div className="min-h-screen bg-[#0F1116] text-foreground">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Header */}
      <div className="relative border-b border-[#2D3246] bg-[#0F1116]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2">
                Submit Market News
                <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30">
                  Community Intelligence Hub
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Transform casual observations into professional-grade market intelligence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#10B981]/10 text-[#10B981] px-3 py-1">
                🔥 3 day streak
              </Badge>
              <Button
                variant="outline"
                className="border-[#2D3246] hover:bg-[#2D3246]/50"
              >
                View History
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Reputation */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-4">
              <ReputationDisplay />
              
              {/* Submission Tips */}
              <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                  <h4>Submission Tips</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-[#2D3246]/30">
                    <span className="text-muted-foreground">Add charts</span>
                    <Badge className="bg-[#10B981]/20 text-[#10B981] text-xs">+15</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#2D3246]/30">
                    <span className="text-muted-foreground">Multiple sources</span>
                    <Badge className="bg-[#10B981]/20 text-[#10B981] text-xs">+25</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#2D3246]/30">
                    <span className="text-muted-foreground">Historical context</span>
                    <Badge className="bg-[#10B981]/20 text-[#10B981] text-xs">+20</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#2D3246]/30">
                    <span className="text-muted-foreground">Position disclosure</span>
                    <Badge className="bg-[#10B981]/20 text-[#10B981] text-xs">+10</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-6">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="pr-4 space-y-6">
                {/* Quick Mode Selector */}
                {showModeSelector && (
                  <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="mb-2">Choose Your Submission Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Select the type of content you're submitting
                      </p>
                    </div>
                    <QuickModeSelector onModeSelect={handleModeSelect} />
                  </div>
                )}

                {!showModeSelector && (
                  <>
                    {/* Mode Badge */}
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#0066FF]/20 text-[#0066FF] px-3 py-1">
                        {selectedMode === 'breaking' && '⚡ Breaking News Mode'}
                        {selectedMode === 'analysis' && '📝 Analysis Mode'}
                        {selectedMode === 'trade' && '📈 Trade Idea Mode'}
                        {selectedMode === 'research' && '📚 Research Mode'}
                      </Badge>
                      <button
                        onClick={() => setShowModeSelector(true)}
                        className="text-xs text-[#00F5FF] hover:underline"
                      >
                        Change mode
                      </button>
                    </div>

                    {/* News Input Section */}
                    <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-6">
                      <NewsInputSection />
                    </div>

                    {/* Categorization Section */}
                    <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-6">
                      <CategorizationSection />
                    </div>

                    {/* Analysis Section - Only show in analysis/trade/research modes */}
                    {selectedMode !== 'breaking' && (
                      <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-6">
                        <AnalysisSection />
                      </div>
                    )}

                    {/* Verification Section */}
                    <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-6">
                      <VerificationSection />
                    </div>

                    {/* Preview Section */}
                    <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-6">
                      <PreviewSection />
                    </div>

                    {/* Submit Button */}
                    <div className="sticky bottom-0 bg-gradient-to-t from-[#0F1116] via-[#0F1116] to-transparent pt-8 pb-4">
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-[#0066FF] hover:bg-[#0066FF]/90 h-12"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Market Intelligence
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Your submission will be reviewed by our community
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Sidebar - AI Assistant */}
          <div className="col-span-3">
            <div className="sticky top-24">
              <AIAssistantPanel />
              
              {/* Live Context */}
              <div className="bg-[#1A1D28] border border-[#2D3246] rounded-lg p-4 mt-4">
                <h4 className="mb-3">📈 Live Market Context</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">AAPL</span>
                    <span className="text-[#10B981]">$182.45 (+2.3%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">TSLA</span>
                    <span className="text-[#EF4444]">$245.12 (-1.2%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tech Sector</span>
                    <span className="text-[#10B981]">+1.8%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#2D3246]">
                  <p className="text-xs text-muted-foreground mb-2">Related news (24h)</p>
                  <div className="space-y-2">
                    <div className="text-xs p-2 bg-[#2D3246]/30 rounded">
                      Apple supplier reports strong Q4
                    </div>
                    <div className="text-xs p-2 bg-[#2D3246]/30 rounded">
                      Tech sector rebounds on Fed comments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && <SubmissionSuccess onReset={handleReset} />}
    </div>
  );
}
