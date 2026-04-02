"use client";

import React from 'react';
import { Download, Printer, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  version?: string;
  effectiveDate?: string;
  selectedRegion?: string;
  regions?: string[];
  onRegionChange?: (r: string) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onRequestData?: () => void;
}

export default function LegalHeader({
  title,
  version,
  effectiveDate,
  selectedRegion,
  regions,
  onRegionChange,
  onDownload,
  onPrint,
  onRequestData,
}: Props) {
  const showRegionSelector = regions && regions.length > 1 && onRegionChange;
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {version && (
                <span className="px-3 py-1 bg-[#0066FF]/20 text-primary text-sm rounded-full border border-[#0066FF]/30">
                  {version}
                </span>
              )}
              {effectiveDate && (
                <span className="text-muted-foreground text-sm">Effective: {effectiveDate}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {showRegionSelector && (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <select
                  value={selectedRegion}
                  onChange={(e) => onRegionChange?.(e.target.value)}
                  className="bg-muted text-foreground px-4 py-2 rounded-lg border border-border hover:border-[#00F5FF]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/50"
                  aria-label="Select your region"
                >
                  {regions!.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={onDownload} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-[#353B52] transition-colors" aria-label="Download PDF">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
              <Button onClick={onPrint} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-[#353B52] transition-colors" aria-label="Print">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              {onRequestData && (
                <Button onClick={onRequestData} className="flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-[#0052CC] transition-colors" aria-label="Request Data">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Request Data</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
