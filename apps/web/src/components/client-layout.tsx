'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from './providers/theme-provider';
import { GlobalFetchCursor } from './global-fetch-cursor';

const SessionManager = dynamic(() => import('./session-manager').then((mod) => mod.SessionManager), { ssr: false });
const LastVisitedTracker = dynamic(() => import('./last-visited').then((mod) => mod.LastVisitedTracker), { ssr: false });

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that includes session management and global components
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <GlobalFetchCursor />
      <SessionManager />
      <LastVisitedTracker />
      {children}
      {/* <ChatbotModal /> */}
    </ThemeProvider>
  );
}