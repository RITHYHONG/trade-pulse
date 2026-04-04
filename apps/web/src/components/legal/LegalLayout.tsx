import React from 'react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        {children}
      </div>
    </div>
  )
}
