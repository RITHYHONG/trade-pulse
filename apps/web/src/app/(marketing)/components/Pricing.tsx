import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, Zap } from 'lucide-react';
import Section from './Section';

const plans = [
  {
    name: "Starter",
    price: "$15",
    period: "per month (billed yearly)",
    description: "Perfect for retail day traders standardizing their morning prep routine.",
    features: [
      "Daily Pre-Market AI Briefings",
      "Pre-Market Sector Rotation Scans",
      "Up to 3 watchlist smart alerts",
      "Standard volatility filters",
      "Community support 24/7"
    ],
    limitations: [
      "Real-time options flow feeds",
      "API key access for algorithmic trading",
      "SLA-backed priority support"
    ],
    cta: "Start Free Trial",
    popular: false,
    ctaVariant: "outline" as const,
    trial: {
      days: 14,
      label: "free trial"
    }
  },
  {
    name: "Growth",
    tag: "best choice",
    price: "$39",
    period: "per month (billed yearly)",
    description: "Built for active day and swing traders scaling their market edge.",
    features: [
      "Everything in Starter",
      "Unlimited watchlists & smart alerts",
      "Real-Time Institutional Options Flow Scans",
      "AI Sentiment Correlation Engine Access",
      "Multi-Asset support (Equities, Forex, Futures)",
      "Priority customer support 24/7"
    ],
    limitations: [
      "Custom webhook API integrations",
      "Dedicated market analyst consultation"
    ],
    cta: "Start Free Trial",
    popular: true,
    ctaVariant: "default" as const,
    trial: {
      days: 14,
      label: "free trial"
    }
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Perfect for proprietary trading firms, fund managers, and developers.",
    features: [
      "Everything in Growth",
      "Dedicated account manager & analyst",
      "Direct API access (JSON & Webhooks)",
      "Institutional-grade SLA-backed support",
      "Multi-seat team workspace permissions",
      "Custom machine learning model fine-tuning"
    ],
    limitations: [],
    cta: "Contact Us",
    popular: false,
    ctaVariant: "outline" as const
  }
];

export function Pricing() {
  return (
  <Section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-50" />
      
      <div className="container mx-auto px-8 relative z-10">
        <div 
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl mb-6 font-bold">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Trading Edge
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, upgrade when you&apos;re ready to unlock your full potential
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative"
            >
              <Card 
                className={`p-8 h-full relative overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/40 shadow-2xl shadow-primary/20 ring-1 ring-primary/20' 
                    : 'bg-card/50 border-border hover:bg-card/80 shadow-xl'
                }`}
              >
                {plan.tag && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                      <Zap className="w-3 h-3 fill-current" />
                      {plan.tag}
                    </div>
                  </div>
                )}

                {plan.popular && !plan.tag && (
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
                  <h3 className="text-2xl mb-2 mt-3 font-bold">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-4">{plan.description}</p>
                  {plan.trial && (
                    <div className="mt-2 text-sm text-primary">
                      {plan.trial.days_remaining 
                        ? `${plan.trial.days_remaining} days ${plan.trial.label}`
                        : `${plan.trial.days} days ${plan.trial.label}`
                      }
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 flex-grow">
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
                <div className="mt-auto">
                  <Button 
                    variant={plan.ctaVariant}
                    size="lg" 
                    className={`w-full group h-12 rounded-4xl ${
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
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className="text-center mt-16"
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
              Start Your Free 14 Day Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div 
          className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground"
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
        </div>
      </div>
    </Section>
  );
}