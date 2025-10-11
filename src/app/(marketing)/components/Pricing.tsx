"use client";

import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with basic market insights",
    features: [
      "Daily market overview",
      "3 watchlist alerts per day",
      "Basic trend analysis",
      "Email support"
    ],
    limitations: [
      "No pre-market intelligence",
      "No AI-powered signals",
      "No precision entry points",
      "No advanced risk management"
    ],
    cta: "Start Free",
    popular: false,
    ctaVariant: "outline" as const
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "Everything you need to trade with confidence and consistency",
    features: [
      "Complete AI market intelligence",
      "Unlimited smart alerts",
      "5-minute morning brief",
      "Precision entry & exit points",
      "Advanced risk management",
      "Real-time data feeds",
      "Custom watchlist management",
      "Premium support",
      "Mobile app access",
      "API access for automation"
    ],
    limitations: [],
    cta: "Start Your Free Trial",
    popular: true,
    ctaVariant: "default" as const,
    savings: "Save $108 annually"
  }
];

export function Pricing() {
  return (
  <section id="pricing" className="scroll-mt-24 py-24 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-50" />
      
      <div className="container mx-auto px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl mb-6 font-bold">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Trading Edge
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, upgrade when you&apos;re ready to unlock your full potential
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card 
                className={`p-8 h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-lg shadow-primary/10' 
                    : 'bg-card/50 border-border hover:bg-card/80'
                }`}
              >
                {plan.popular && (
                  <>
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1">
                      <Zap className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl" />
                  </>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-sm text-success">{plan.savings}</div>
                  )}
                  <p className="text-muted-foreground mt-4">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted/20 flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm line-through text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  variant={plan.ctaVariant}
                  size="lg" 
                  className={`w-full group ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' 
                      : ''
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {plan.popular && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    14-day free trial • No credit card required • Cancel anytime
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl mb-4 font-bold">
              Ready to Transform Your Trading?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of profitable traders who start their day with confidence.
              Try Pro free for 14 days - no commitment, no risk.
            </p>
            <Button size="lg" className="px-12 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group">
              Start Your Free 14-Day Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            No setup fees
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            30-day money back
          </div>
        </motion.div>
      </div>
    </section>
  );
}