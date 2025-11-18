"use client";

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Day Trader",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkyMzIxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: "This platform completely transformed my morning routine. I went from spending 2 hours researching to getting everything I need in 5 minutes. My win rate improved by 40%.",
    rating: 5,
    pnl: "+$127K this year"
  },
  {
    name: "Marcus Rodriguez",
    role: "Swing Trader",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkyMzIxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: "The AI alerts are incredibly accurate. I caught three major breakouts last month that I would have completely missed. The precision entry points are spot on.",
    rating: 5,
    pnl: "+$89K this quarter"
  },
  {
    name: "Jennifer Park",
    role: "Crypto Trader",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkyMzIxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: "Finally, a tool that understands crypto volatility. The risk management features saved me from several bad trades. Worth every penny of the premium subscription.",
    rating: 5,
    pnl: "+245% portfolio return"
  }
];

const stats = [
  { value: "50,000+", label: "Active Traders" },
  { value: "94%", label: "Win Rate Improvement" },
  { value: "$2.3B+", label: "Total Profits Generated" },
  { value: "4.9/5", label: "Average Rating" }
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