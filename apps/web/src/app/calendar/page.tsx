import { Metadata } from 'next';
import './index.css';
import App from './App';

export const metadata: Metadata = {
  title: 'Forex Economic Calendar & AI Market Intelligence | TradePulse',
  description: 'Track real-time economic events with TradePulse. Access AI-driven market verdicts, historical impact analysis, and central bank insights to stay ahead of volatility.',
  keywords: ['forex calendar', 'economic calendar', 'trading intelligence', 'market pulse', 'central bank watch', 'trading news'],
  openGraph: {
    title: 'Forex Economic Calendar & AI Market Intelligence | TradePulse',
    description: 'Real-time economic data and AI insights for serious traders.',
    type: 'website',
    url: 'https://tradepulse.com/calendar', // Replace with actual URL if known
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex Economic Calendar | TradePulse',
    description: 'Stay ahead of the market with real-time economic data.',
  }
};

export default function CalendarPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'TradePulse Economic Calendar',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Web',
    'description': 'Real-time economic calendar with AI-driven market intelligence and historical impact analysis.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <App />
    </>
  );
}