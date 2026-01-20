"use client";

import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Brain, Zap, Target, Clock, TrendingUp, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: "AI Market Intelligence",
    description: "Advanced algorithms analyze thousands of data points to surface only the most relevant trading opportunities for your style.",
    image: "https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBkYXRhfGVufDF8fHx8MTc1OTIzMjE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reverse: false
  },
  {
    icon: Zap,
    title: "Lightning-Fast Alerts",
    description: "Get notified instantly when your watchlist stocks show unusual pre-market activity or meet your custom criteria.",
    image: "https://images.unsplash.com/photo-1711637397406-0c5fe8165dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBkYXRhfGVufDF8fHx8MTc1OTIzMjE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reverse: true
  },
  {
    icon: Target,
    title: "Precision Entry Points",
    description: "AI-calculated support and resistance levels with probability-weighted entry and exit strategies tailored to your risk tolerance.",
    image: "https://images.unsplash.com/photo-1744782211816-c5224434614f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBkYXRhfGVufDF8fHx8MTc1OTIzMjE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    reverse: false
  }
];

const additionalFeatures = [
  {
    icon: Clock,
    title: "5-Minute Morning Brief",
    description: "Everything you need to know delivered in a digestible format before market open."
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description: "Multi-timeframe analysis to identify the strongest trending opportunities."
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Built-in position sizing and risk assessment tools for every trade."
  }
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 pb-24 bg-gradient-to-b from-card/30 to-background">
      <div className="container mx-auto px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl mb-6 font-bold">
            Features That Give {' '}
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              You The Edge
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade tools designed specifically for the modern trader&apos;s workflow
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="space-y-32 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`grid lg:grid-cols-2 gap-16 items-center ${feature.reverse ? 'lg:grid-flow-col-dense' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Text Content */}
              <div className={`space-y-8 ${feature.reverse ? 'lg:col-start-2' : ''}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>

                <div>
                  <h3 className="text-3xl lg:text-4xl mb-6 font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed hover:text-primary translate-middle-y-1 duration-500">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="h-px bg-gradient-to-r from-primary to-transparent flex-1" />
                  <div className="text-sm text-primary">Professional Grade</div>
                </div>
              </div>

              {/* Image */}
              <div className={`relative ${feature.reverse ? 'lg:col-start-1' : ''}`}>
                <div className="relative bg-card/50 rounded-2xl p-6 border border-border backdrop-blur-sm">
                  <div className="w-full h-48 sm:h-64 md:h-80 relative rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Overlay badge */}
                  <div className="absolute top-8 right-8 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm z-20 shadow-lg flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    AI Powered
                  </div>

                  {/* Dynamic Status Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-10 left-10 right-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 z-20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                          {index === 0 && "Intelligence Engine"}
                          {index === 1 && "Alert Pipeline"}
                          {index === 2 && "Precision Engine"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-primary/80">LIVE</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          animate={{ width: ["20%", "70%", "40%", "90%", "60%"] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-medium text-white/40">
                        <span>{index === 0 ? "Analyzing Datapoints" : index === 1 ? "Scan In Progress" : "Calculating Risk"}</span>
                        <span className="font-mono">
                          {index === 0 && "18.4k/sec"}
                          {index === 1 && "12ms delay"}
                          {index === 2 && "99.4% Acc"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating decoration */}
                <motion.div
                  className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl text-center mb-12 font-bold">
            Plus Everything Else You Need
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full bg-card/50 border-border hover:bg-card/80 transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl mb-4">{feature.title}</h4>
                  <p className="text-muted-foreground hover:text-primary translate-middle-y-1 duration-500">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}