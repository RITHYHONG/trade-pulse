"use client";

import { ReactNode, useState, useEffect } from 'react';
import { Cpu, Bolt, Target, Clock, ShieldCheck, Sparkles, ChartBar, Terminal, Activity, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    className={`relative group h-full bg-slate-950/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 overflow-hidden hover:border-primary/40 transition-all duration-700 shadow-2xl ${className}`}
  >
    {/* Dynamic Background Glow */}
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <div className="relative z-10 h-full flex flex-col">
      <div className="mb-8 flex items-start justify-between">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl backdrop-blur-xl">
          {icon}
        </div>
        <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse delay-75" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-150" />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm mb-8 font-medium">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        {children}
      </div>
    </div>
  </motion.div>
);

const barClasses = [
  'h-[40%]', 'h-[70%]', 'h-[45%]', 'h-[90%]', 'h-[65%]',
  'h-[30%]', 'h-[85%]', 'h-[55%]', 'h-[75%]', 'h-[50%]',
  'h-[95%]', 'h-[60%]', 'h-[40%]', 'h-[80%]', 'h-[50%]',
  'h-[70%]', 'h-[40%]', 'h-[85%]', 'h-[60%]', 'h-[90%]',
];

export function Features() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="features" className="py-40 relative overflow-hidden bg-slate-950">
      {/* Visual Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Performance Intelligence
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl mb-10 font-bold tracking-tighter"
          >
            The Ultimate {' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-white via-primary to-primary bg-clip-text text-transparent">
                Trading Edge
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-primary/20 blur-[2px] rounded-full" />
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Harness the power of enterprise-grade analytics and AI to gain an unfair advantage in the markets.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Featured: AI Core */}
          <BentoCard 
            className="md:col-span-12 lg:col-span-8 group/ai"
            title="AI Core Analysis"
            description="Our neural engine processes thousands of data streams in parallel, identifying hidden correlations and institutional movement before they hit the tape."
            icon={<Cpu className="w-6 h-6" />}
            delay={0.1}
          >
            <div className="relative h-64 md:h-80 rounded-[2rem] bg-black/60 border border-white/[0.08] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)_0%,transparent_70%)]" />
              
              {/* AI Nodes Matrix */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 flex flex-col gap-1">
                      <span className="text-[10px] text-primary/50 font-bold uppercase tracking-wider">THROUGHPUT</span>
                      <span className="text-sm font-bold font-mono text-primary">2.4 TB/s</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1">
                      <span className="text-[10px] text-emerald-500/50 font-bold uppercase tracking-wider">LATENCY</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">0.02ms</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">SYSC_RE_V4</span>
                  </div>
                </div>

                {/* Circular Wave Visualization */}
                <div className="relative h-48 w-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
                        className="absolute w-40 h-40 border border-primary rounded-full"
                      />
                    ))}
                  </div>

                  {/* Dynamic Pulse Ring */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-white/[0.03]"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray="364"
                        animate={{ strokeDashoffset: [364, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="text-primary"
                      />
                    </svg>

                    {/* Inner Core Status */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xl font-bold font-mono text-primary"
                      >
                        94.8%
                      </motion.div>
                      <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Confidence</div>
                    </div>
                  </div>

                  {/* Satellite Data Particles */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 10 + i, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="absolute w-full h-full pointer-events-none"
                    >
                      <div 
                        className="absolute w-1 h-1 bg-primary/40 rounded-full"
                        style={{ 
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) translate(${70 + (i % 3) * 10}px, 0)`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature: Lightning */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Flash Execution"
            description="Get notified of market-shifting events before $INDU even updates. Speed is our religion."
            icon={<Bolt className="w-6 h-6" />}
            delay={0.2}
          >
            <div className="space-y-3">
              {[
                { title: "MSTR", value: "+18.2%", color: "text-emerald-400" },
                { title: "AMD", value: "$182.40", color: "text-primary" },
                { title: "BTC", value: "ATH Hit", color: "text-orange-400" }
              ].map((stock, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] group/item hover:bg-white/[0.06] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-[10px]">
                      {stock.title}
                    </div>
                    <div className="h-4 w-12 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        className="h-full bg-primary/20" 
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold font-mono ${stock.color}`}>{stock.value}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Feature: Indicators */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Quantum Precision"
            description="Our custom indicators utilize harmonic oscillators to find perfect reversals."
            icon={<Activity className="w-6 h-6" />}
            delay={0.3}
          >
            <div className="relative h-40 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
               <svg viewBox="0 0 200 100" className="w-full h-full stroke-primary fill-none stroke-2 opacity-50">
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    d="M0,50 Q25,0 50,50 T100,50 T150,50 T200,50"
                  />
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                    d="M0,50 Q25,100 50,50 T100,50 T150,50 T200,50"
                    className="stroke-emerald-500 opacity-30"
                  />
               </svg>
               <div className="absolute inset-x-0 h-px bg-white/5" />
            </div>
          </BentoCard>

          {/* Feature: Risk Manager */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Iron Shield"
            description="Guardian algorithms that automatically lock gains and mitigate downside during vol spikes."
            icon={<ShieldCheck className="w-6 h-6" />}
            delay={0.4}
          >
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Safety Margin</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">98.2%</span>
               </div>
               <div className="flex gap-1 h-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: i < 10 ? 1 : 0.1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-1 rounded-sm bg-emerald-500" 
                    />
                  ))}
               </div>
               <div className="mt-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium text-emerald-500/80">Protocols active</span>
               </div>
            </div>
          </BentoCard>

          {/* Feature: Global Pulse */}
          <BentoCard 
            className="md:col-span-12 lg:col-span-4"
            title="Neural Command"
            description="Manage your entire digital trading environment from a single, high-performance interface."
            icon={<Terminal className="w-6 h-6" />}
            delay={0.5}
          >
            <div className="grid grid-cols-2 gap-3">
               {[
                { label: "INDEX", val: "Bullish", c: "bg-primary/20" },
                { label: "VIX", val: "14.2", c: "bg-slate-900" },
                { label: "FLOW", val: "Bulls+", c: "bg-slate-900" },
                { label: "NEWS", val: "Neutral", c: "bg-slate-900" }
               ].map((box, i) => (
                 <div key={i} className={`p-3 rounded-xl border border-white/5 ${box.c}`}>
                    <div className="text-[9px] font-bold text-white/30 uppercase mb-1">{box.label}</div>
                    <div className="text-xs font-bold text-white/90">{box.val}</div>
                 </div>
               ))}
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
