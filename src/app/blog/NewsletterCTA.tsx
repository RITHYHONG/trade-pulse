"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, TrendingUp } from 'lucide-react';


export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      // Here you would typically integrate with your email service
      console.log('Newsletter signup:', email);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#1A1D28] border border-[#2D3246] rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Welcome to Trader Puls!
        </h3>
        <p className="text-gray-400">
          You'll receive our next market insight directly in your inbox.
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-[#0F1116] border-[#2D3246] text-white placeholder:text-gray-500 focus:border-cyan-500"
            required
          />
          <Button 
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-6"
          >
            Subscribe
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Join 15,000+ traders • Free insights • Unsubscribe anytime</span>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-[#2D3246]">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>What you'll get:</span>
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