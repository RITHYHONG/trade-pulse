"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Menu, X, TrendingUp, User, LogOut, Settings, Search } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from '@/lib/firestore-service';
import { useAuthorProfile } from '@/hooks/use-author-profile';
import { BlogAuthor } from '@/types/blog';
import SearchModal from './SearchModal';
import LogoDark from '../../public/no-bg-logo.svg';
import LogoLight from '../../public/black-logo.svg';
import navItems from '@/config/navigation';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [active, setActive] = useState<string>('#demo');
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { theme } = useTheme();

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

  const fallbackAuthor: BlogAuthor = useMemo(() => ({
    name: user?.displayName || user?.email?.split('@')[0] || 'User',
    avatar: user?.photoURL ?? undefined,
    avatarUrl: user?.photoURL ?? undefined,
  }), [user?.displayName, user?.email, user?.photoURL]);

  const { authorProfile: headerProfile } = useAuthorProfile({ 
    authorId: user?.uid, 
    fallbackAuthor 
  });

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const cachedProfile = localStorage.getItem(`userProfile_${user.uid}`);
    if (cachedProfile) {
      try {
        setUserProfile(JSON.parse(cachedProfile));
      } catch (error) {
        console.error('Error parsing cached user profile:', error);
      }
    }

    if (!headerProfile) {
      return;
    }

    // Map fields to UserProfile
    const profile = {
      uid: user.uid,
      displayName: headerProfile.name,
      email: user.email || '',
      bio: headerProfile.bio,
      photoURL: headerProfile.avatarUrl ?? headerProfile.avatar,
    };

    setUserProfile(profile);
    localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profile));
  }, [headerProfile, user]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === '/')) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src={theme === 'light' ? LogoLight : LogoDark} 
                width={72} 
                height={72} 
                alt="Logo"
                priority
              />
            </Link>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.isAnchor && active === item.href);
              
              if (item.isComingSoon) {
                return (
                  <motion.a
                    key={index}
                    className="relative text-muted-foreground cursor-not-allowed group"
                  >
                    {item.label}
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Coming Soon
                    </span>
                  </motion.a>
                );
              } else if (item.isAnchor) {
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    onClick={() => setActive(item.href)}
                    className={`relative transition-colors ${isActive ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-foreground hover:text-primary'}`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.a>
                );
              } else {
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className={`relative transition-colors ${isActive ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-foreground hover:text-primary'}`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              }
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Button
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground border-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hover:text-foreground">
                <span className="text-xs text-primary">/</span>
              </kbd>
            </Button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button  className="flex items-center gap-2 bg-none">
                      <Avatar className="w-8 h-8">
                        {((userProfile?.photoURL ?? user.photoURL) as string | undefined) && (
                          <AvatarImage
                            src={(userProfile?.photoURL ?? user.photoURL) as string | undefined}
                            alt="Profile picture"
                          />
                        )}
                        <AvatarFallback>
                          {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be redirected to the login page and will need to sign in again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => signOut()}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sign out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                  <Button variant="ghost" className="hover:bg-card">
                    Login
                  </Button>
                </Link>
                <Link href={`/signup?redirect=${encodeURIComponent(pathname)}`}>
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
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 justify-start text-muted-foreground hover:text-foreground"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Button>
                
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || (item.isAnchor && active === item.href);
                  
                  if (item.isComingSoon) {
                    return (
                      <motion.a
                        key={index}
                        className="py-2 text-muted-foreground cursor-not-allowed relative group"
                      >
                        {item.label}
                        <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          Coming Soon
                        </span>
                      </motion.a>
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
                        className={`py-2 transition-colors ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'text-foreground hover:text-primary'}`}
                      >
                        {item.label}
                      </motion.a>
                    );
                  } else {
                    return (
                      <motion.div
                        key={index}
                        onClick={() => setIsMenuOpen(false)}
                        className={`py-2 transition-colors ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : 'text-foreground hover:text-primary'}`}
                      >
                        <Link href={item.href}>
                          {item.label}
                        </Link>
                      </motion.div>
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
                    <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start hover:bg-card w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href={`/signup?redirect=${encodeURIComponent(pathname)}`} onClick={() => setIsMenuOpen(false)}>
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

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </motion.header>
  );
}