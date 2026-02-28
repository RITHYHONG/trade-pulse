"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';
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
    } catch {
      showError('Subscription Failed', {
        description: 'Unable to subscribe at the moment. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Welcome to Trader Pulse!
            </h3>
            <p className="text-muted-foreground text-lg">
              You&apos;ll receive our next market insight directly in your inbox.
            </p>
          </div>
        </div>
      </section>
    );
  }


}