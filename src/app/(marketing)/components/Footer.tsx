"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import LogoDark from '../../../../public/logo.svg';
import LogoLight from '../../../../public/logo-black.svg';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/#demo' },
    { label: 'API Access', href: '/#api' }
  ],
  Company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/#careers' },
    { label: 'Press', href: '/#press' }
  ],
  Support: [
    { label: 'Help Center', href: '/#help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'System Status', href: '/#status' },
    { label: 'Security', href: '/#security' }
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Disclaimer', href: '/disclaimer' }
  ]
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), source: 'footer' }),
      });

      if (res.ok) {
        toast.success('Thank you for subscribing! Check your inbox for confirmation.');
        setEmail('');
      } else if (res.status === 409) {
        toast('You are already subscribed.');
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Subscription error', err);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                className="flex-1 bg-card border-border h-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                className="bg-primary hover:bg-primary/90 px-8"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
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
            <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src={mounted ? (theme === 'light' ? LogoLight : LogoDark) : LogoDark} 
                width={65} 
                  height={65} 
                alt="Logo"
                priority
              />
            </Link>
          </motion.div>
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
                <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" width={20} height={20} alt="X" className="filter invert" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                <Linkedin className="w-5 h-5" width={20} height={20} />
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                <Mail className="w-5 h-5" width={20} height={20} />
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
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
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