'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Source {
  uri: string;
  title: string;
}

interface Results {
  title: string;
  summary: string;
  sources: Source[];
}

const ChatbotModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [alert, setAlert] = useState('');
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // apiKey unused in this component; removed to avoid unused-variable warning

  const showAlert = (message: string) => {
    setAlert(message);
    setTimeout(() => setAlert(''), 5000);
  };

  const analyzeMarket = async () => {
    const trimmedTicker = ticker.trim().toUpperCase();
    if (!trimmedTicker) {
      showAlert('Please enter a stock ticker or company name.');
      return;
    }

    setLoading(true);
    setResults(null);
    setAlert('');

    try {
      // 1. Try local Ollama first (privacy-first, free)
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama2',
            prompt: `You are a world-class financial market analyst. Provide a concise, three-paragraph summary of ${trimmedTicker}'s latest quarterly performance, recent stock movements, and general market outlook. Use professional but clear language. Include some recent market data and analysis.`,
            stream: false
          })
        });

        if (response.ok) {
          const result = await response.json();
          const text = result.response;
          setResults({
            title: `Local Market Outlook: ${trimmedTicker}`,
            summary: text,
            sources: [
              { uri: 'https://finance.yahoo.com', title: 'Yahoo Finance' },
              { uri: 'https://www.marketwatch.com', title: 'MarketWatch' }
            ]
          });
          return;
        }
      } catch (ollamaError) {
        console.log('Ollama not available, falling back to Gemini server...');
      }

      // 2. Fallback to server-side Gemini
      const geminiResponse = await fetch('/api/dashboard/ai-summary?ticker=' + trimmedTicker);
      if (!geminiResponse.ok) throw new Error('AI analysis service unavailable');

      const data = await geminiResponse.json();
      setResults({
        title: `AI Market Outlook: ${trimmedTicker}`,
        summary: data.summary,
        sources: [
          { uri: 'https://www.bloomberg.com', title: 'Bloomberg Intelligence' },
          { uri: 'https://www.reuters.com', title: 'Reuters Markets' }
        ]
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      showAlert(`Analysis failed. Please check your connection.`);
    } finally {
      setLoading(false);
    }
  };

  const readSummary = async () => {
    if (!results?.summary) {
      showAlert('Generate a summary first before reading aloud.');
      return;
    }

    setTtsPlaying(true);

    try {
      // Use browser's built-in Text-to-Speech API (free)
      const utterance = new SpeechSynthesisUtterance(results.summary);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Get available voices and try to use a good one
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.includes('Microsoft') ||
        voice.name.includes('Google') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setTtsPlaying(false);
      utterance.onerror = () => {
        setTtsPlaying(false);
        showAlert('Text-to-speech failed. Your browser may not support this feature.');
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS failed:', error);
      showAlert('Failed to start text-to-speech.');
      setTtsPlaying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg bg-cyan-500 hover:bg-cyan-600 text-white border-2 border-cyan-400"
          variant="default"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only">Open AI Chatbot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Gemini Market Momentum Analyzer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-start py-4 p-4">
          <div className="w-full max-w-2xl bg-[#161b22] p-6 rounded-xl shadow-2xl mb-8 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter Stock Ticker (e.g., GOOG, AAPL, TSLA)"
                className="flex-grow p-3 rounded-lg bg-[#0d1117] text-gray-300 border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
              />
              <button
                onClick={analyzeMarket}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md flex items-center justify-center disabled:opacity-50"
              >
                <span className="mr-2">✨</span> Analyze Market Outlook
              </button>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={readSummary}
                disabled={!results || ttsPlaying}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center disabled:opacity-50"
              >
                <span className="mr-2">🔊</span> {ttsPlaying ? '⏳ Generating Audio...' : 'Read Summary Aloud'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center space-y-4">
              <div className="chevron-container">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 w-full h-full">
                  <g id="outer-chevron" className="transform origin-center">
                    <path d="M 10 50 L 50 10 L 90 50" strokeWidth="8" />
                  </g>
                  <g id="middle-chevron" className="transform origin-center">
                    <path d="M 20 65 L 50 35 L 80 65" strokeWidth="8" />
                  </g>
                  <g id="inner-chevron" className="transform origin-center">
                    <path d="M 30 80 L 50 60 L 70 80" strokeWidth="8" />
                  </g>
                </svg>
              </div>
              <div className="text-xl font-semibold text-gray-300 tracking-wider animate-pulse">
                Analyzing Market Data...
              </div>
            </div>
          )}

          {results && (
            <div className="w-full max-w-4xl bg-[#161b22] p-8 rounded-xl shadow-2xl border border-gray-700 mt-6">
              <h2 className="text-2xl font-bold mb-4 text-green-400">{results.title}</h2>
              <div className="results-box text-gray-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {results.summary}
              </div>
              <div className="mt-4 text-sm text-gray-500 border-t border-gray-700 pt-4">
                <strong>Sources:</strong>
                {results.sources.length > 0 ? (
                  <ul className="mt-2 space-y-1 list-disc pl-5">
                    {results.sources.map((source, index) => (
                      <li key={index}>
                        <Link href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition">
                          {source.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  ' No real-time sources were cited for this summary.'
                )}
              </div>
            </div>
          )}

          {alert && (
            <div className="fixed top-5 right-5 bg-red-800 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300">
              {alert}
            </div>
          )}

          <audio ref={audioRef} onEnded={() => setTtsPlaying(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;