"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Menu, X, TrendingUp, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';

const navItems = [
  // { label: 'Demo', href: '#demo', isAnchor: true },
  // { label: 'Features', href: '#features', isAnchor: true },
  // { label: 'Testimonials', href: '#testimonials', isAnchor: true },
  // { label: 'Pricing', href: '/pricing', isAnchor: false },
  { label: 'Blog', href: '/blog', isAnchor: false },
  { label: 'Calendar', href: '/calendar', isAnchor: false, isComingSoon: true },
  { label: 'About', href: '/about', isAnchor: false, isComingSoon: true },
  { label: 'Contact', href: '/contact', isAnchor: false, isComingSoon: true },
];

export function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState<string>('#demo');
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const ids = ['demo', 'features', 'testimonials', 'pricing'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target && (visible.target as HTMLElement).id) {
          setActive('#' + (visible.target as HTMLElement).id);
        }
      },
      { root: null, rootMargin: '0px 0px -40% 0px', threshold: [0.15, 0.5, 0.75] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Trader Pulse</div>
                <div className="text-xs text-muted-foreground -mt-1">Pre-Market Intelligence</div>
              </div>
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.isAnchor && active === item.href);
              
              if (item.isComingSoon) {
                return (
                  <motion.div
                    key={index}
                    className="relative text-muted-foreground cursor-not-allowed group"
                  >
                    {item.label}
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Coming Soon
                    </span>
                  </motion.div>
                );
              } else if (item.isAnchor) {
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    onClick={() => setActive(item.href)}
                    className={`relative transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.a>
                );
              } else {
                return (
                  <Link key={index} href={item.href}>
                    <motion.div
                      className={`relative transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                );
              }
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="text-foreground">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                  disabled={loading}
                  className="hover:bg-card"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-card">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="container mx-auto px-8 py-6">
              <nav className="flex flex-col gap-4 mb-6">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.isAnchor && active === item.href);
                  
                  if (item.isComingSoon) {
                    return (
                      <motion.div
                        key={index}
                        className="py-2 text-muted-foreground cursor-not-allowed relative group"
                      >
                        {item.label}
                        <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          Coming Soon
                        </span>
                      </motion.div>
                    );
                  } else if (item.isAnchor) {
                    return (
                      <motion.a
                        key={index}
                        href={item.href}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActive(item.href);
                        }}
                        className={`py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                      >
                        {item.label}
                      </motion.a>
                    );
                  } else {
                    return (
                      <Link key={index} href={item.href}>
                        <motion.div
                          onClick={() => setIsMenuOpen(false)}
                          className={`py-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    );
                  }
                })}
              </nav>
              
              <div className="flex flex-col gap-3">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                      <User className="w-4 h-4" />
                      <span className="text-sm text-foreground">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      disabled={loading}
                      className="justify-start hover:bg-card w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start hover:bg-card w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-primary hover:bg-primary/90 w-full">
                        Start Free Trial
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}