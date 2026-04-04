import React from 'react'
import { Globe, Download, Printer, Shield, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Badge { name: string; region: string; color: string }

export default function LegalHeader({
  title = 'Policy',
  version,
  updated,
  badges = [] as Badge[],
  regions = [],
  selectedRegion,
  onRegionChange,
  onDownload,
  onPrint,
  onRequest,
}: any) {
  return (
    <div className="mb-20">
      {/* Navigation & Actions */}
      <nav className="flex flex-col sm:flex-row items-center justify-between mb-24 gap-6 no-print">
        <div className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
          Legal
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resources</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-slate-900 dark:text-white font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600">Privacy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
        
        </div>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 font-display leading-[1.1]">
            {title}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
            Our code of conduct and our pledge to be an upstanding member of the financial ecosystem.
          </p>
          
          <div className="relative max-w-md no-print group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search policy content..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-6 mt-10 text-xs font-semibold uppercase tracking-widest text-slate-400 no-print">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              {version}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Updated: {updated}
            </div>
          </div>
        </div>

        <div className="relative group no-print hidden lg:block">
          <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-500" />
          <svg viewBox="0 0 200 200" className="relative w-full max-w-sm ml-auto animate-float">
             <path fill="#2563EB" d="M45,-78.2C58.3,-71.4,69.2,-58.5,76.5,-44.2C83.8,-29.9,87.4,-14.2,85.2,0.9C83.1,16.1,75.1,30.6,65.3,42.8C55.4,55,43.6,64.8,30.3,71.1C17,77.3,2.2,80,-13.4,78.2C-29,76.4,-45.3,70.1,-58.5,59.3C-71.7,48.5,-81.7,33.2,-84.9,17.1C-88.1,1,-84.5,-15.8,-76.4,-30.3C-68.3,-44.7,-55.6,-56.7,-41.8,-63.4C-28.1,-70.2,-13.2,-71.7,1.8,-74.8C16.8,-77.9,31.7,-85.1,45,-78.2Z" transform="translate(100 100)" className="fill-blue-600/10 dark:fill-blue-500/20" />
             <g transform="translate(40, 40) scale(0.6)">
                <circle cx="100" cy="100" r="80" className="fill-blue-600" />
                <path d="M100 50 L100 150 M50 100 L150 100" stroke="white" strokeWidth="4" />
                <circle cx="120" cy="80" r="15" fill="white" fillOpacity="0.2" />
             </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
