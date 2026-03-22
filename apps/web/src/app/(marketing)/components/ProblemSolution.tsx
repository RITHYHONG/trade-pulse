"use client";

import { motion } from 'motion/react';
import { 
  HiXMark, 
  HiCheck, 
  HiArrowRight, 
  HiBolt, 
  HiExclamationCircle, 
  HiSparkles, 
  HiArrowTrendingUp, 
  HiMagnifyingGlass 
} from 'react-icons/hi2';
import { useRef } from 'react';

const problems = [
  { text: "Overwhelmed by market noise and conflicting signals", icon: HiExclamationCircle },
  { text: "Missing key pre-market moves while sleeping", icon: HiMagnifyingGlass },
  { text: "Spending hours on research with inconsistent results", icon: HiArrowTrendingUp },
  { text: "FOMO decisions based on incomplete information", icon: HiBolt }
];

const solutions = [
  { text: "AI filters signal from noise in seconds", icon: HiSparkles },
  { text: "Smart alerts for your personalized watchlist", icon: HiBolt },
  { text: "5-minute morning brief with actionable insights", icon: HiMagnifyingGlass },
  { text: "Data-driven confidence for every trading decision", icon: HiCheck }
];

export function ProblemSolution() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-background to-card/20">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-destructive/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <HiSparkles className="w-3 h-3" />
            The Transformation
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold tracking-tight">
            Stop Trading in the{' '}
            <span className="bg-gradient-to-r from-destructive to-destructive/50 bg-clip-text text-transparent">
              Dark
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your morning routine from chaotic, manual research to high-conviction, AI-powered execution in minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto relative">
          {/* Connector Arrow for Desktop */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-background border-4 border-card flex items-center justify-center shadow-2xl shadow-primary/20"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
                <HiArrowRight className="w-6 h-6 text-primary-foreground" />
              </div>
            </motion.div>
          </div>

          {/* Problem Side - "The Old Way" */}
          <motion.div 
            className="group relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-full bg-card/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-destructive/10 hover:border-destructive/20 transition-colors duration-500 overflow-hidden">
              {/* Subtle noise pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0%200%20200%20200'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter%20id='noiseFilter'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.65'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20">
                    <HiXMark className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">The Daily Struggle</h3>
                    <p className="text-sm text-muted-foreground">The manual, chaotic traditional approach</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {problems.map((problem, index) => (
                    <motion.div 
                      key={index}
                      className="p-4 rounded-2xl bg-destructive/5 border border-destructive/5 hover:border-destructive/10 transition-all duration-300 group/item"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <problem.icon className="w-3 h-3 text-destructive" />
                        </div>
                        <p className="text-muted-foreground group-hover/item:text-foreground transition-colors leading-snug">
                          {problem.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-destructive/10 space-y-2">
                  <div className="flex items-center gap-2 text-destructive/80 font-medium text-sm">
                    <HiExclamationCircle className="w-4 h-4" />
                    The Result
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    &quot;Fatigued decision-making, missed entries, and emotional trading cycles.&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solution Side - "The Pulse Way" */}
          <motion.div 
            className="group relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-full bg-primary/5 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-primary/20 hover:border-primary/40 transition-colors duration-500 overflow-hidden shadow-2xl shadow-primary/5">
              {/* Glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-inner">
                    <HiCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Your New Edge</h3>
                    <p className="text-sm text-primary/70">AI-optimized intelligence for modern traders</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {solutions.map((solution, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300 group/item shadow-sm hover:shadow-primary/5"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <solution.icon className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-foreground font-medium transition-colors leading-snug">
                          {solution.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-primary/10 space-y-2">
                  <div className="flex items-center gap-2 text-primary/80 font-medium text-sm">
                    <HiSparkles className="w-4 h-4" />
                    The Outcome
                  </div>
                  <p className="text-foreground text-sm font-medium italic">
                    &quot;Unshakeable confidence, data-backed timing, and professional-grade performance.&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}