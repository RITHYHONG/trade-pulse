"use client";

import { motion } from 'motion/react';
import { Target, LineChart, Users, Sparkles, Zap, Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const PILLARS = [
      {
            icon: Sparkles,
            id: 'ai',
            title: "AI Intelligence",
            description: "Powered by Google Gemini 1.5 Flash for institutional-grade market reasoning.",
            detail: "Our neural engine processes thousands of data points across global markets in real-time, surfacing only the highest probability setups."
      },
      {
            icon: Zap,
            id: 'performance',
            title: "Performance",
            description: "Built on Next.js 15+ for sub-millisecond page transitions and safety.",
            detail: "Every component is optimized for speed, ensuring that you never miss a market move due to lag or technical friction."
      },
      {
            icon: Globe,
            id: 'global',
            title: "Global Reach",
            description: "Connects to major exchanges and data providers across the globe.",
            detail: "Our architecture bridges the gap between decentralized finance and traditional markets, providing a unified trading intelligence layer."
      }
];

export function AboutInteractiveVision() {
      const [activeTab, setActiveTab] = useState(PILLARS[0].id);

      return (
            <div className="space-y-12">
                  <div className="grid md:grid-cols-3 gap-6">
                        {PILLARS.map((pillar) => (
                              <motion.div
                                    key={pillar.id}
                                    whileHover={{ y: -5 }}
                                    className={cn(
                                          "p-6 rounded-3xl border transition-all duration-300 cursor-pointer text-left h-full flex flex-col justify-between",
                                          activeTab === pillar.id
                                                ? "bg-primary/10 border-primary/40 shadow-xl shadow-primary/5"
                                                : "bg-card/40 border-border/40 hover:bg-card/60"
                                    )}
                                    onClick={() => setActiveTab(pillar.id)}
                              >
                                    <div className="space-y-4">
                                          <div className={cn(
                                                "p-3 rounded-2xl w-fit",
                                                activeTab === pillar.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                                          )}>
                                                <pillar.icon className="w-6 h-6" />
                                          </div>
                                          <h4 className="text-xl font-bold">{pillar.title}</h4>
                                          <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                                    </div>
                              </motion.div>
                        ))}
                  </div>

                  <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 md:p-12 rounded-[40px] bg-secondary/30 border border-border/40 relative overflow-hidden"
                  >
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                              {(() => {
                                    const Icon = PILLARS.find(p => p.id === activeTab)?.icon || Sparkles;
                                    return <Icon className="w-64 h-64" />;
                              })()}
                        </div>

                        <div className="relative z-10 max-w-2xl space-y-6">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    Deep Dive: {PILLARS.find(p => p.id === activeTab)?.title}
                              </Badge>
                              <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
                                    {PILLARS.find(p => p.id === activeTab)?.detail}
                              </p>
                              <div className="flex items-center gap-4 text-primary font-bold text-sm uppercase tracking-widest pt-4">
                                    Explore our technology <Zap className="w-4 h-4 animate-pulse" />
                              </div>
                        </div>
                  </motion.div>
            </div>
      );
}

function Badge({ children, variant, className }: any) {
      return (
            <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  variant === 'outline' ? "border" : "bg-primary text-primary-foreground",
                  className
            )}>
                  {children}
            </span>
      );
}
