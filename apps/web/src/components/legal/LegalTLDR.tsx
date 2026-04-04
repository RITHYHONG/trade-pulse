"use client";

import React from 'react';

interface Props {
  title?: string;
  summary: string;
  bullets?: string[];
}

export default function LegalTLDR({ title = 'Quick Summary', summary, bullets = [] }: Props) {
  return (
    <div className="mb-20 p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white font-display">
            {title}
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl">
            {summary}
          </p>

          {bullets.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="hidden lg:flex w-32 h-32 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
