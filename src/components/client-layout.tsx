'use client';

import { SessionManager } from './session-manager';
import ChatbotModal from './ai/chatbot';
import { ThemeProvider } from './providers/theme-provider';
import { LastVisitedTracker } from './last-visited';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that includes session management and global components
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <SessionManager />
      <LastVisitedTracker />
      {children}
      <ChatbotModal />
    </ThemeProvider>
  );
}