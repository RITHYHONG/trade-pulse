"use client";

import { motion } from 'motion/react';
import { TrendingUp, Twitter, Linkedin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
    { label: 'API Access', href: '#api' }
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Careers', href: '#careers' },
    { label: 'Press', href: '#press' }
  ],
  Support: [
    { label: 'Help Center', href: '#help' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'System Status', href: '#status' },
    { label: 'Security', href: '#security' }
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Disclaimer', href: '#disclaimer' }
  ]
};

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-card/50 border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-8 py-16">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl mb-4 font-bold">
              Stay Ahead of the Markets
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Get weekly market insights and trading tips delivered to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="flex-1 bg-card border-border"
              />
              <Button className="bg-primary hover:bg-primary/90 px-8">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Join 50,000+ traders getting our weekly newsletter. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl">Trader Pulse</div>
                <div className="text-sm text-muted-foreground">Pre-Market Intelligence</div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Professional-grade pre-market intelligence platform designed for serious traders who demand an edge in today&apos;s competitive markets.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h4 className="font-semibold mb-6">{category}</h4>
              <ul className="space-y-4">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              © 2025 Trader Pulse. All rights reserved.
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                All systems operational
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                24/7 Support
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-card/30 border-t border-border">
        <div className="container mx-auto px-8 py-6">
          <motion.p 
            className="text-xs text-muted-foreground text-center leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <strong>Risk Disclaimer:</strong> Trading involves substantial risk and may not be suitable for all investors. 
            Past performance is not indicative of future results. All trading decisions should be made based on your own analysis and risk tolerance. 
            Trader Pulse is for informational purposes only and does not constitute investment advice.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}