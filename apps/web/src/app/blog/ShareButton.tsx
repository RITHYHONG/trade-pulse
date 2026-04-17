"use client";

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Linkedin, Facebook, Send, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  url?: string;
  excerpt?: string;
  className?: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function ShareButton({ 
  title, 
  url, 
  excerpt, 
  className, 
  variant = "ghost", 
  size = "icon",
  showText = false
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  
  // Use provided URL or fallback to current window location
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: excerpt ? `${excerpt}\n\n${shareUrl}` : shareUrl,
      url: shareUrl,
    };

    // If Web Share API is available (primarily mobile), use it directly.
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    }

    // Fallback: copy to clipboard if Web Share is unavailable or share failed.
    copyToClipboard();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareToPlatform = (platform: 'twitter' | 'linkedin' | 'facebook' | 'telegram') => {
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title}${excerpt ? '\n\n' + excerpt : ''}`)}`
    };
    window.open(platforms[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`rounded-full hover:bg-primary/10 hover:text-primary transition-colors ${className}`}
          aria-label="Share article"
        >
          <Share2 className="w-5 h-5" />
          {showText && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-border bg-card/95 backdrop-blur-md">
        <DropdownMenuItem 
          onClick={handleShare}
          className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
        >
          <Share2 className="w-4 h-4" />
          <span>System Share</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={copyToClipboard}
          className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </DropdownMenuItem>
        
        <div className="h-px bg-border my-1" />
        
        <DropdownMenuItem 
          onClick={() => shareToPlatform('twitter')}
          className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
        >
          <Twitter className="w-4 h-4" />
          <span>Twitter / X</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => shareToPlatform('telegram')}
          className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
        >
          <Send className="w-4 h-4" />
          <span>Telegram</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => shareToPlatform('linkedin')}
          className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => shareToPlatform('facebook')}
          className="flex items-center gap-3 py-2.5 cursor-pointer rounded-lg focus:bg-primary/10 focus:text-primary"
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
