"use client";

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShareButton } from './ShareButton';

interface BlogPostEngagementProps {
  postId: string;
  title: string;
  excerpt?: string;
  helpfulCount: number;
}

export function BlogPostEngagement({ postId, title, excerpt, helpfulCount }: BlogPostEngagementProps) {
  const [currentHelpfulCount, setCurrentHelpfulCount] = useState(helpfulCount);
  const [helpfulSelected, setHelpfulSelected] = useState(false);
  const [helpfulState, setHelpfulState] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    const stored = window.localStorage.getItem(`post_helpful_feedback_${postId}`);
    setHelpfulSelected(stored === 'true');
  }, [postId]);

  useEffect(() => {
    const key = `post_view_${postId}`;
    const lastViewed = window.localStorage.getItem(key);
    const now = Date.now();

    if (lastViewed) {
      const lastTs = Number(lastViewed);
      if (!Number.isNaN(lastTs) && (now - lastTs) / (1000 * 60 * 60) < 1) {
        return;
      }
    }

    window.localStorage.setItem(key, String(now));

    fetch('/api/blog/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => undefined);
  }, [postId]);

  const handleHelpfulClick = async () => {
    if (helpfulState !== 'idle') return;

    const nextSelected = !helpfulSelected;
    const delta = nextSelected ? 1 : -1;
    const storageKey = `post_helpful_feedback_${postId}`;
    const previousCount = currentHelpfulCount;
    const previousSelected = helpfulSelected;

    setHelpfulSelected(nextSelected);
    setCurrentHelpfulCount((count) => Math.max(0, count + delta));
    setHelpfulState('saving');

    if (nextSelected) {
      window.localStorage.setItem(storageKey, 'true');
    } else {
      window.localStorage.removeItem(storageKey);
    }

    try {
      const response = await fetch('/api/blog/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, delta }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to submit feedback');
      }

      setCurrentHelpfulCount(typeof data.helpfulCount === 'number' ? data.helpfulCount : currentHelpfulCount);
      toast.success(nextSelected ? 'Marked helpful.' : 'Removed helpful vote.');
    } catch (error) {
      console.error('Helpful feedback error:', error);
      toast.error('Failed to update helpful feedback.');
      setHelpfulSelected(previousSelected);
      setCurrentHelpfulCount(previousCount);

      if (previousSelected) {
        window.localStorage.setItem(storageKey, 'true');
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } finally {
      setHelpfulState('idle');
    }
  };

  return (
    <div className="relative flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          onClick={handleHelpfulClick}
          disabled={helpfulState !== 'idle'}
          aria-pressed={helpfulSelected}
          className={`h-12 rounded-xl border border-white/10 px-6 transition-all duration-300 ${helpfulSelected ? 'border-emerald-400/20 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20' : 'bg-white/5 text-white/70 hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-400'} disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/40`}
        >
          <ThumbsUp className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-bold tracking-tight">{helpfulSelected ? 'Helpful' : 'Helpful Insight'}</span>
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentHelpfulCount} {currentHelpfulCount === 1 ? 'helpful vote' : 'helpful votes'}
        </span>
      </div>

      <ShareButton
        variant="ghost"
        size="default"
        className="h-12 rounded-xl border border-white/10 bg-white/5 px-6 text-white/70 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-400"
        showText
        title={title}
        excerpt={excerpt}
      />
    </div>
  );
}
