"use client";

import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/ui/scroll-based-velocity';

import { MarketSentimentWidget } from './MarketSentimentWidget';

export function Hero() {
  return (
    <section id="demo" className="scroll-mt-24 relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-card">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-24 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-6 md:space-y-8 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center md:justify-start"
            >
              <MarketSentimentWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight font-bold">
                See{' '}
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  the Pulse
                </span>
                <br />
                Make the Move
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              AI-powered pre-market intelligence. Cut through the noise and start every trading day ahead of the curve.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild size="lg" className="group px-6 md:px-8 w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Link href="#pricing">
                  Start Your Free Morning Routine
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-6 md:px-8 w-full sm:w-auto border-border border-2 hover:bg-card dark:hover:text-amber-50">
                <Link href="#demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch 90-Second Demo
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center gap-8 pt-6 md:pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ScrollVelocityContainer className="w-full opacity-60 relative">
                <ScrollVelocityRow baseVelocity={5} direction={-1}>
                  <div className="flex items-center">
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Goldman</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">JP Morgan</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Citadel</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Morgan Stanley</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Blackrock</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Vanguard</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Fidelity</div>
                    <div className="px-3 py-1 border border-border rounded text-xs md:text-sm mr-4 md:mr-6">Charles Schwab</div>
                  </div>
                </ScrollVelocityRow>
                <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
                <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
              </ScrollVelocityContainer>
            </motion.div>
          </motion.div>

          {/* Right Column - Dashboard Mockup */}
          <motion.div
            className="relative mt-8 md:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-card/50 rounded-2xl p-4 sm:p-6 md:p-8 border border-border backdrop-blur-sm">
              {/* Browser mockup header */}
              <div className="flex items-center gap-2 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-border">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center text-xs md:text-sm text-muted-foreground">
                  Trader Pulse Dashboard
                </div>
                <Badge variant="outline" className="text-[0.7rem] md:text-xs bg-success/10 border-success/30 text-success">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-success mr-1.5 md:mr-2 animate-pulse" />
                  Live Data
                </Badge>
              </div>

              {/* Dashboard content */}
              <div className="space-y-4 md:space-y-6">
                <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 relative rounded-lg border border-border overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1711637397406-0c5fe8165dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBkYXRhfGVufDF8fHx8MTc1OTIzMjE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Trading Dashboard"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Live data indicators */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-card/80 rounded-lg p-2 sm:p-3 md:p-4 border border-border">
                    <div className="text-xs md:text-sm text-muted-foreground">SPY</div>
                    <div className="text-base md:text-lg text-success">+2.3%</div>
                  </div>
                  <div className="bg-card/80 rounded-lg p-2 sm:p-3 md:p-4 border border-border">
                    <div className="text-xs md:text-sm text-muted-foreground">QQQ</div>
                    <div className="text-base md:text-lg text-success">+1.8%</div>
                  </div>
                  <div className="bg-card/80 rounded-lg p-2 sm:p-3 md:p-4 border border-border">
                    <div className="text-xs md:text-sm text-muted-foreground">IWM</div>
                    <div className="text-base md:text-lg text-destructive">-0.5%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-primary/20 rounded-full w-16 h-16 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 bg-success/20 rounded-full w-24 h-24 blur-xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}