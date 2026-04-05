"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, ChevronRight } from 'lucide-react';

type AcknowledgmentKey = 'acknowledge_risk' | 'not_advice' | 'personal_responsibility';

const acknowledgmentItems: Array<{ id: AcknowledgmentKey; label: string }> = [
  { id: 'acknowledge_risk', label: 'I understand trading involves substantial risk of loss' },
  { id: 'not_advice', label: 'I understand this is not financial advice' },
  { id: 'personal_responsibility', label: 'I accept full responsibility for my decisions' },
];

const initialAcknowledgments: Record<AcknowledgmentKey, boolean> = {
  acknowledge_risk: false,
  not_advice: false,
  personal_responsibility: false,
};

export default function DisclaimerAcknowledgment() {
  const [acknowledgments, setAcknowledgments] = useState(initialAcknowledgments);
  const [startTime] = useState(() => Date.now());

  const allAcknowledged = Object.values(acknowledgments).every(Boolean);

  const handleCheckboxChange = (id: AcknowledgmentKey) => {
    setAcknowledgments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAccept = () => {
    if (!allAcknowledged) return;

    const acknowledgmentData = {
      timestamp: new Date().toISOString(),
      version: 'v2.1.4',
      readTime: Math.round((Date.now() - startTime) / 1000),
      userAgent: navigator.userAgent,
    };

    console.log('Disclaimer acknowledgement', acknowledgmentData);
    alert('Disclaimer acknowledged! Compliance log generated.');
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

  return (
    <>
      <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Mandatory Acknowledgment
          </h4>

          <div className="space-y-4 mb-8">
            {acknowledgmentItems.map((checkbox) => (
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

        <div className="text-center pb-12 mt-10">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Trader Pulse. All rights reserved.
            <span className="mx-2">•</span>
            <button onClick={handlePrint} className="hover:text-blue-600 transition-colors">
              Print PDF
            </button>
            <span className="mx-2">•</span>
            <button onClick={handleDownload} className="hover:text-blue-600 transition-colors">
              Download
            </button>
            <span className="mx-2">•</span>
            <button onClick={handleShare} className="hover:text-blue-600 transition-colors">
              Share
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
