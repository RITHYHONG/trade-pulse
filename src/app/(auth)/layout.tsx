import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <aside className="relative hidden w-1/2 items-center justify-center overflow-hidden p-12 text-white lg:flex">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-teal-500/20"></div>
          
          {/* Background Image */}
          <Image
            src="/images/dashboard-preview.png"
            alt="Trade Pulse dashboard preview"
            width={1400}
            height={900}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          
          {/* Content */}
          <div className="relative z-10 max-w-lg space-y-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500"></div>
                <span className="text-2xl font-bold">Trade Pulse</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Accelerate your 
                <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"> trading workflow</span>
              </h1>
              
              <p className="text-lg text-slate-200 leading-relaxed">
                Trade Pulse keeps your team aligned with live market intelligence, actionable AI insights, and programmable alerts.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-200">Real-time market data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-teal-400"></div>
                <span className="text-slate-200">AI-powered insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span className="text-slate-200">Smart alerts & notifications</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side - Auth Form */}
        <main className="flex w-full flex-1 items-center justify-center p-6 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            {/* Back to Home Link */}
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to home</span>
            </Link>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
