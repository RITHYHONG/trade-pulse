"use client";

import { ReactNode } from 'react';
import Section from './Section';
import { Cpu, Bolt, ShieldCheck, Sparkles, Terminal, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const BentoCard = ({ 
  children, 
  className = "", 
  title, 
  description, 
  icon,
  delay = 0,
}: { 
  children?: ReactNode; 
  className?: string; 
  title: string; 
  description: string; 
  icon: ReactNode;
  delay?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`relative group h-full bg-[#0a0a0c] border border-white/[0.03] rounded-[2rem] p-8 overflow-hidden hover:border-primary/20 transition-all duration-700 shadow-2xl ${className}`}
  >
    {/* Subtle background glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    
    <div className="relative z-10 h-full flex flex-col">
      <div className="mb-6 flex items-start justify-between">
        <div className="w-12 h-12 rounded-full bg-primary/[0.02] border border-primary/20 flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-105">
          {icon}
        </div>
        <div className="flex gap-1 mt-2 opacity-30">
          <div className="w-1 h-1 rounded-full bg-primary" />
          <div className="w-1 h-1 rounded-full bg-primary" />
          <div className="w-1 h-1 rounded-full bg-primary" />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-3 tracking-tight text-white group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm mb-8">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        {children}
      </div>
    </div>
  </motion.div>
);

export function Features() {
  return (
    <Section id="features" className="py-32">
      {/* Visual Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Performance Intelligence
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl mb-8 font-bold tracking-tighter text-white"
          >
            The Ultimate {' '}
            <span className="text-primary">
              Trading Edge
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Harness the power of enterprise-grade analytics and AI to gain an unfair advantage in the markets.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Featured: AI Core */}
          <BentoCard 
            className="md:col-span-12 lg:col-span-8 group/ai"
            title="AI Core Analysis"
            description="Our neural engine processes thousands of data streams in parallel, identifying hidden correlations and institutional movement before they hit the tape."
            icon={<Cpu className="w-5 h-5" />}
            delay={0.1}
          >
            <div className="relative h-64 rounded-[1.5rem] bg-[#050505] border border-white/[0.03] overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="px-3 py-2 rounded-xl bg-[#110d0c] border border-primary/10 flex flex-col gap-1 min-w-[100px]">
                      <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest bg-[#2a1b18] px-1.5 py-0.5 rounded text-center w-fit mb-1">THROUGHPUT</span>
                      <span className="text-sm font-bold font-mono text-primary">2.4 TB/s</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-[#0c1311] border border-emerald-500/10 flex flex-col gap-1 min-w-[100px]">
                      <span className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest bg-[#142921] px-1.5 py-0.5 rounded text-center w-fit mb-1">LATENCY</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">0.02ms</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">SYSC_RE_V4</span>
                  </div>
                </div>
              </div>

              {/* Circular Wave Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 absolute">
                    <circle cx="96" cy="96" r="60" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/[0.05]" />
                    <circle cx="96" cy="96" r="60" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="377" strokeDashoffset="37" className="text-primary" />
                  </svg>
                  
                  {/* Outer scattered dots */}
                  <div className="absolute inset-0 border border-white/[0.02] rounded-full scale-[1.3] border-dashed opacity-30" />
                  <div className="absolute w-2 h-2 bg-primary rounded-full top-[10%] right-[20%] opacity-40 blur-[1px]" />
                  <div className="absolute w-1 h-1 bg-primary rounded-full bottom-[20%] left-[20%] opacity-60" />
                  <div className="absolute w-1.5 h-1.5 bg-primary rounded-full top-[40%] left-[10%] opacity-30" />
                  <div className="absolute w-1 h-1 bg-primary rounded-full bottom-[10%] right-[30%] opacity-50" />

                  {/* Inner Core Status */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold font-mono text-primary">94.8%</div>
                    <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">CONFIDENCE</div>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature: Lightning */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Flash Execution"
            description="Get notified of market-shifting events before $INDU even updates. Speed is our religion."
            icon={<Bolt className="w-5 h-5" />}
            delay={0.2}
          >
            <div className="space-y-3 mt-4">
              {[
                { title: "MSTR", value: "+18.2%", color: "text-emerald-400" },
                { title: "AMD", value: "$182.40", color: "text-primary" },
                { title: "BTC", value: "ATH Hit", color: "text-amber-500" }
              ].map((stock, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#111216] border border-white/[0.03]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-6 rounded-md bg-[#1d1f25] border border-white/5 flex items-center justify-center font-bold text-[9px] text-white/80">
                      {stock.title}
                    </div>
                    <div className="w-8 h-3 bg-[#1d1f25] rounded-full relative">
                      <div className={`absolute top-0.5 left-0.5 w-2 h-2 rounded-full ${i === 0 ? 'bg-white/20' : i === 1 ? 'bg-primary/20' : 'bg-amber-500/20'}`} />
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold font-mono ${stock.color}`}>{stock.value}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Feature: Indicators */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Quantum Precision"
            description="Our custom indicators utilize harmonic oscillators to find perfect reversals."
            icon={<Activity className="w-5 h-5" />}
            delay={0.3}
          >
            <div className="relative h-32 mt-4 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60">
               <svg viewBox="0 0 200 80" className="w-full h-full stroke-primary fill-none stroke-1">
                  <path d="M0,40 Q25,10 50,40 T100,40 T150,40 T200,40" />
                  <path d="M0,40 Q25,70 50,40 T100,40 T150,40 T200,40" className="stroke-white/30" />
               </svg>
               <div className="absolute inset-x-0 h-px bg-white/5" />
            </div>
          </BentoCard>

          {/* Feature: Risk Manager */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Iron Shield"
            description="Guardian algorithms that automatically lock gains and mitigate downside during vol spikes."
            icon={<ShieldCheck className="w-5 h-5" />}
            delay={0.4}
          >
            <div className="p-5 rounded-xl bg-[#081512] border border-emerald-500/10 mt-4">
               <div className="flex justify-between items-center mb-5">
                  <span className="text-[9px] font-bold text-emerald-500/50 uppercase tracking-widest">SAFETY MARGIN</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">98.2%</span>
               </div>
               <div className="flex gap-1.5 h-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 rounded-full ${i < 8 ? 'bg-emerald-500' : 'bg-[#183127]'}`} 
                    />
                  ))}
               </div>
               <div className="mt-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-500/70">Protocols active</span>
               </div>
            </div>
          </BentoCard>

          {/* Feature: Global Pulse */}
          <BentoCard 
            className="md:col-span-12 lg:col-span-4"
            title="Neural Command"
            description="Manage your entire digital trading environment from a single, high-performance interface."
            icon={<Terminal className="w-5 h-5" />}
            delay={0.5}
          >
            <div className="grid grid-cols-2 gap-3 mt-4">
               {[
                { label: "INDEX", val: "Bullish", c: "bg-[#2a1b18] border-primary/20", t: "text-white" },
                { label: "VIX", val: "14.2", c: "bg-[#111216] border-white/5", t: "text-white/80" },
                { label: "FLOW", val: "Bulls+", c: "bg-[#111216] border-white/5", t: "text-white/80" },
                { label: "NEWS", val: "Neutral", c: "bg-[#111216] border-white/5", t: "text-white/80" }
               ].map((box, i) => (
                 <div key={i} className={`p-4 rounded-xl border ${box.c}`}>
                    <div className="text-[9px] font-bold text-white/40 uppercase mb-2">{box.label}</div>
                    <div className={`text-sm font-bold ${box.t}`}>{box.val}</div>
                 </div>
               ))}
            </div>
          </BentoCard>

        </div>
      </div>
    </Section>
  );
}

