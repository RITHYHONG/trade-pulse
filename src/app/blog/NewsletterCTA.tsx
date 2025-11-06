"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, TrendingUp } from 'lucide-react';
import { showSuccess, showError, validation } from '@/lib/toast';


export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      validation.required('Email');
      return;
    }

    // Trim whitespace
    const trimmedEmail = email.trim();

    // Check if email contains @
    if (!trimmedEmail.includes('@')) {
      showError('Invalid Email', {
        description: 'Email address must include an "@" symbol',
      });
      return;
    }

    // Check if email has text before @
    const parts = trimmedEmail.split('@');
    if (parts[0].length === 0) {
      showError('Invalid Email', {
        description: 'Please enter a username before the "@" symbol',
      });
      return;
    }

    // Check if email has domain after @
    if (parts.length < 2 || parts[1].length === 0) {
      showError('', {
        description: 'Please enter a domain after the "@" symbol (e.g., gmail.com)',
      });
      return;
    }

    // Check if domain has a period
    if (!parts[1].includes('.')) {
      showError('Invalid Email', {
        description: 'Domain must include a period (e.g., @gmail.com)',
      });
      return;
    }

    // Check if there's text after the period
    const domainParts = parts[1].split('.');
    if (domainParts[domainParts.length - 1].length === 0) {
      showError('Invalid Email', {
        description: 'Please enter a valid domain extension (e.g., .com, .org)',
      });
      return;
    }

    // Check minimum length for domain extension
    if (domainParts[domainParts.length - 1].length < 2) {
      showError('Invalid Email', {
        description: 'Domain extension must be at least 2 characters (e.g., .com, .io)',
      });
      return;
    }

    // Final regex validation for overall format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showError('Invalid Email Format', {
        description: 'Please enter a valid email address (e.g., name@example.com)',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual email service integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setEmail('');
      
      showSuccess('Successfully Subscribed!', {
        description: 'Welcome to Trader Pulse! Check your inbox for exclusive market insights.',
        duration: 5000,
      });
      
      // Here you would typically integrate with your email service
      console.log('Newsletter signup:', email);
    } catch (error) {
      showError('Subscription Failed', {
        description: 'Unable to subscribe at the moment. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#1A1D28] border border-[#2D3246] rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Welcome to Trader Pulse!
        </h3>
        <p className="text-gray-400">
          You&apos;ll receive our next market insight directly in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1D28] border border-[#2D3246] rounded-xl p-8 pl-32 pr-32">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Daily Market Edge
          </h3>
          <p className="text-gray-400 text-sm">
            Get exclusive trading insights delivered to your inbox
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-[#0F1116] border-[#2D3246] text-white placeholder:text-gray-500 focus:border-cyan-500"
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-6 h-12 hover:text-amber-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Join 15,000+ traders • Free insights • Unsubscribe anytime</span>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-[#2D3246]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>What you&apos;ll get:</span>
          <div className="flex gap-4">
            <span>• Daily recaps</span>
            <span>• Market alerts</span>
            <span>• Exclusive analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
}