//calendar
'use client';

import './index.css';
import App from './App';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}