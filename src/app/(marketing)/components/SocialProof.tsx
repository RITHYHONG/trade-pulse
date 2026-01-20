"use client";

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Day Trader",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    content: "Trader Pulse helped me streamline my morning prep—now I spend under 20 minutes reviewing key opportunities before the open.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Swing Trader",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    content: "The alerts and curated news help me identify high-probability setups faster. The tools are practical and easy to act on.",
    rating: 5,
  },
  {
    name: "Jennifer Park",
    role: "Crypto Trader",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    content: "The platform's risk-management signals are useful for volatile markets—I can react quickly and preserve capital.",
    rating: 5,
  }
];

const stats = [
  { value: "25,000+", label: "Subscribers" },
  { value: "20+", label: "Markets Covered" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "1,200+", label: "Daily Signals Delivered" }
];

const logos = [
  "Bloomberg", "Reuters", "TradingView", "Interactive Brokers", "E*TRADE", "TD Ameritrade"
];

export function SocialProof() {
  return (
  <section id="testimonials" className="scroll-mt-24 py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-8">
        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl lg:text-4xl text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl mb-6 font-bold">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              Professional Traders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how traders are using our platform to consistently outperform the market
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full bg-card/50 border-border hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-8 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* PnL Badge */}
                {/* <div className="inline-block bg-success/10 border border-success/20 text-success px-3 py-1 rounded-full text-sm mb-6">
                  {testimonial.pnl}
                </div> */}

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <p className="text-muted-foreground">Integrated with leading financial platforms</p>
          </div>
          
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            {logos.map((logo, index) => (
              <motion.div 
                key={index}
                className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ opacity: 1 }}
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}