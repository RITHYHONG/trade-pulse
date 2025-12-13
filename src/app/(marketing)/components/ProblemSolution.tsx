"use client";

import { motion } from 'motion/react';
import { X, Check, ArrowRight } from 'lucide-react';

const problems = [
  "Overwhelmed by market noise and conflicting signals",
  "Missing key pre-market moves while sleeping",
  "Spending hours on research with inconsistent results",
  "FOMO decisions based on incomplete information"
];

const solutions = [
  "AI filters signal from noise in seconds",
  "Smart alerts for your personalized watchlist",
  "5-minute morning brief with actionable insights",
  "Data-driven confidence for every trading decision"
];

export function ProblemSolution() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl mb-6 font-bold">
            Stop Trading in the{' '}
            <span className="text-destructive">Dark</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your morning routine from chaotic research to confident execution
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Problem Side */}
          <motion.div 
            className="relative bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl p-8 border border-destructive/20 flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-destructive/20 rounded-full blur-lg" />
            
            <div className="flex-grow">
              <h3 className="text-2xl mb-8 text-destructive/90 font-bold">
                The Daily Struggle
              </h3>
              
              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                      <X className="w-4 h-4 text-destructive" />
                    </div>
                    <p className="text-muted-foreground">{problem}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive/80">
                Result: Missed opportunities, emotional trading, and inconsistent profits
              </p>
            </div>
          </motion.div>

          {/* Arrow connecting both sides */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-primary rounded-full p-4 shadow-lg shadow-primary/25"
            >
              <ArrowRight className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          </div>

          {/* Solution Side */}
          <motion.div 
            className="relative bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-8 border border-success/20 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-success/20 rounded-full blur-lg" />
            
            <div className="flex-grow">
              <h3 className="text-2xl mb-8 text-green-400 font-bold">
                Your New Morning Edge
              </h3>
              
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <p className="text-foreground">{solution}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm text-success/80">
                Result: Confident decisions, better timing, and consistent profitable trading
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}