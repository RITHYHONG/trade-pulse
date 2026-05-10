"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, LogOut, Settings } from 'lucide-react';
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

// Constants for better maintainability
const OBSERVED_SECTIONS = ['demo', 'features', 'testimonials', 'pricing'];
const DEFAULT_ACTIVE = '#demo';

// Sub-components for readability and maintainability
function HeaderDesktopNav({ active, pathname, onAnchorClick }: { active: string; pathname: string; onAnchorClick: (href: string) => void }) {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || (item.isAnchor && active === item.href);

        if (item.isComingSoon) {
          return (
            <a
              key={index}
              className="relative px-4 py-2 text-sm text-muted-foreground cursor-not-allowed group rounded-lg"
            >
              {item.label}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Coming Soon
              </span>
            </a>
          );
        } else if (item.isAnchor) {
          return (
            <a
              key={index}
              href={item.href}
              onClick={() => onAnchorClick(item.href)}
              className={`relative px-4 py-2 text-sm transition-all duration-300 group ${
                isActive 
                  ? 'text-foreground font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
              )}
            </a>
          );
        } else {
          return (
            <Link
              key={index}
              href={item.href}
              className={`relative px-4 py-2 text-sm transition-all duration-300 group ${
                  isActive 
                    ? 'text-foreground font-semibold' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
              )}
            </Link>
          );
        }
      })}
    </nav>
  );
}

function HeaderMobileMenu({ isOpen, active, pathname, user, loading, signOut, onClose, onSearchOpen, theme }: {
  isOpen: boolean;
  active: string;
  pathname: string;
  user: any;
  loading: boolean;
  signOut: () => void;
  onClose: () => void;
  onSearchOpen: () => void;
  theme: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-card border-t border-border transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex flex-col gap-1 mb-4">
          <div className="flex items-center justify-between py-2 px-3 mb-2 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Appearance</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              onSearchOpen();
              onClose();
            }}
            className="flex items-center gap-2 justify-start text-muted-foreground hover:text-foreground h-10 px-3 rounded-lg"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>

          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.isAnchor && active === item.href);

            if (item.isComingSoon) {
              return (
                <a
                  key={index}
                  className="py-2 text-muted-foreground cursor-not-allowed relative group"
                >
                  {item.label}
                  <span className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10`}>
                    Coming Soon
                  </span>
                </a>
              );
            } else if (item.isAnchor) {
              return (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => {
                    onClose();
                    // onAnchorClick(item.href); // Assuming passed or handled
                  }}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-foreground font-medium border-l-4 border-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              );
            } else {
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-foreground font-medium border-l-4 border-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
          })}
        </nav>

        <div className="flex flex-col gap-3">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                <span className="text-sm text-foreground">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  signOut();
                  onClose();
                }}
                disabled={loading}
                className="justify-start hover:bg-card w-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} onClick={onClose}>
                <Button variant="ghost" className="justify-start hover:bg-card w-full">
                  Login
                </Button>
              </Link>
              <Link href={`/signup?redirect=${encodeURIComponent(pathname)}`} onClick={onClose}>
                <Button className="bg-primary hover:bg-primary/90 w-full">
                  Start Free Trial
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderUserMenu({ user, userProfile, signOut, loading }: { user: any; userProfile: UserProfile | null; signOut: () => void; loading: boolean }) {
  if (!user) {
    return (
      <>
        <Link href={`/login?redirect=${encodeURIComponent(usePathname())}`}>
          <Button variant="ghost" size="sm" className="h-9 px-4 hover:bg-muted rounded-full">
            Login
          </Button>
        </Link>
        <Link href={`/signup?redirect=${encodeURIComponent(usePathname())}`}>
          <Button size="sm" className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-sm hover:shadow-md transition-all">
            Start Free Trial
          </Button>
        </Link>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-muted rounded-full">
          <Avatar className="w-7 h-7">
            {((userProfile?.photoURL ?? user.photoURL) as string | undefined) && (
              <AvatarImage
                src={(userProfile?.photoURL ?? user.photoURL) as string | undefined}
                alt="Profile picture"
              />
            )}
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
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
                onClick={signOut}
                className="bg-red-600 hover:bg-red-700"
              >
                Sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [active, setActive] = useState<string>(DEFAULT_ACTIVE);
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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

    OBSERVED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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

  const memoizedProfile = useMemo(() => {
    if (!user || !headerProfile) return null;
    return {
      uid: user.uid,
      displayName: headerProfile.name,
      email: user.email || '',
      bio: headerProfile.bio,
      photoURL: headerProfile.avatarUrl ?? headerProfile.avatar,
    };
  }, [user, headerProfile]);

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

    if (memoizedProfile) {
      setUserProfile(memoizedProfile);
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(memoizedProfile));
    }
  }, [memoizedProfile, user]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if focused on input/textarea
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === '/') {
      event.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAnchorClick = useCallback((href: string) => setActive(href), []);
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), []);
  const handleSearchOpen = useCallback(() => setIsSearchOpen(true), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <Image
                src={mounted ? (theme === 'light' ? LogoLight : LogoDark) : LogoDark}
                width={64}
                height={64}
                alt="Logo"
                priority
              />
            </Link>
          </div>

          <HeaderDesktopNav active={active} pathname={pathname} onAnchorClick={handleAnchorClick} />

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearchOpen}
              className="flex items-center gap-2 h-9 px-4 text-muted-foreground hover:text-foreground bg-muted/50 border-border/50 rounded-full"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-md border bg-background px-1.5 font-mono text-[0.7rem] font-medium text-muted-foreground ml-1">
                <span className="text-xs">/</span>
              </kbd>
            </Button>

            <HeaderUserMenu user={user} userProfile={userProfile} signOut={signOut} loading={loading} />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <HeaderMobileMenu
        isOpen={isMenuOpen}
        active={active}
        pathname={pathname}
        user={user}
        loading={loading}
        signOut={signOut}
        onClose={handleMenuClose}
        onSearchOpen={handleSearchOpen}
        theme={theme || 'light'}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}