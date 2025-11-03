'use client';

import { SessionManager } from './session-manager';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that includes session management
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <SessionManager />
      {children}
    </>
  );
}