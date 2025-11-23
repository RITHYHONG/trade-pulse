'use client';

import { SessionManager } from './session-manager';
import ChatbotModal from './ai/chatbot';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that includes session management and global components
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <SessionManager />
      {children}
      <ChatbotModal />
    </>
  );
}