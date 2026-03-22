"use client";

import { motion } from 'motion/react';
import { 
  HiCpuChip, 
  HiBolt, 
  HiViewfinderCircle, 
  HiClock, 
  HiShieldCheck,
  HiSparkles,
  HiChartBar
} from 'react-icons/hi2';
import { IconType } from 'react-icons';

const BentoCard = ({ 
  children, 
  className = "", 
  title, 
  description, 
  icon: Icon,
  delay = 0 
}: { 
  children?: React.ReactNode; 
  className?: string; 
  title: string; 
  description: string; 
  icon: IconType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`relative group h-full bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-2xl ${className}`}
  >
    {/* Background Glow */}
    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
    
    <div className="relative z-10 h-full flex flex-col">
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-primary/70">Engine Component</div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm mb-6 max-w-xs">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        {children}
      </div>
    </div>
  </motion.div>
);

export function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-background">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <HiSparkles className="w-3 h-3" />
            Performance Intelligence
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl mb-8 font-bold tracking-tight">
            The Digital {' '}
            <span className="bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent italic">
              Edge
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive suite of intelligence tools designed to elevate every aspect of your trading day.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Main Card - AI Intelligence */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-8 group/main"
            title="AI Market Intelligence"
            description="Advanced algorithms analyze 18,000+ data points per second to surface the highest probability opportunities."
            icon={HiCpuChip}
          >
            <div className="relative h-48 md:h-64 rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
              {/* Mock Data Visualization */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Real-time Stream</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">18.4k Data Points/s</div>
                  </div>
                  <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">ACTIVE</div>
                </div>
                
                {/* Simulated Chart Bars */}
                <div className="flex items-end gap-1.5 h-24">
                  {[40, 70, 45, 90, 65, 30, 85, 55, 75, 50, 95, 60, 40, 80, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: i * 0.05,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 2
                      }}
                      className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Vertical Card - Fast Alerts */}
          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Lightning Alerts"
            description="Sub-10ms delivery on personalized watchlist notifications."
            icon={HiBolt}
            delay={0.1}
          >
            <div className="space-y-4">
              {[
                { label: "SPY unusual vol", time: "2s ago", type: "success" },
                { label: "TSLA break-out", time: "12s ago", type: "primary" },
                { label: "Watchlist Sync", time: "Now", type: "muted" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-emerald-400' : item.type === 'primary' ? 'bg-primary' : 'bg-white/20'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-white/40 font-mono text-[10px]">{item.time}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Step 3 - Precision Entry */}
          <BentoCard 
            className="md:col-span-3 lg:col-span-4"
            title="Precision Edge"
            description="Probability-weighted entry levels for 1200+ assets."
            icon={HiViewfinderCircle}
            delay={0.2}
          >
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                />
                <div className="w-24 h-24 rounded-full border-2 border-primary/60 flex items-center justify-center">
                  <div className="text-2xl font-bold font-mono">99.4%</div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Grid Cards - Row 2 */}
          <div className="md:col-span-3 lg:col-span-4 h-full">
            <BentoCard 
              title="Risk Engine"
              description="Automated position sizing based on portfolio health."
              icon={HiShieldCheck}
              delay={0.3}
            >
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "70%" }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-white/40 font-mono">
                <span>RISK LEVEL</span>
                <span className="text-emerald-400 font-bold uppercase">Safe</span>
              </div>
            </BentoCard>
          </div>

          <BentoCard 
            className="md:col-span-6 lg:col-span-4"
            title="Market Pulse"
            description="Everything you need to know in a 5-minute pre-market brief."
            icon={HiChartBar}
            delay={0.4}
          >
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <HiClock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 font-bold font-mono text-primary italic">
                09:30 AM
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}