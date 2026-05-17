"use client";

import { Button } from '@/components/ui/button';
import { Zap, FileText, TrendingUp, BookOpen } from 'lucide-react';

interface QuickModeSelectorProps {
  onModeSelect: (mode: 'breaking' | 'analysis' | 'trade' | 'research') => void;
}

export function QuickModeSelector({ onModeSelect }: QuickModeSelectorProps) {
  const modes = [
    {
      id: 'breaking' as const,
      icon: Zap,
      title: 'Breaking News',
      description: 'Quick submission with minimal fields',
      colorClass: 'text-destructive bg-destructive/10 dark:text-red-400 dark:bg-red-500/10',
    },
    {
      id: 'analysis' as const,
      icon: FileText,
      title: 'Analysis Piece',
      description: 'Full featured in-depth analysis',
      colorClass: 'text-primary bg-primary/10 dark:text-blue-400 dark:bg-blue-500/10',
    },
    {
      id: 'trade' as const,
      icon: TrendingUp,
      title: 'Trade Idea',
      description: 'Structured trade recommendation',
      colorClass: 'text-success bg-success/10 dark:text-emerald-400 dark:bg-emerald-500/10',
    },
    {
      id: 'research' as const,
      icon: BookOpen,
      title: 'Research Note',
      description: 'Academic-style deep dive',
      colorClass: 'text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Button
            key={mode.id}
            variant="outline"
            onClick={() => onModeSelect(mode.id)}
            className="h-auto py-6 flex-col gap-3 bg-card border-border hover:bg-accent hover:border-primary/30 transition-all duration-300 cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${mode.colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="mb-1 text-card-foreground font-semibold">{mode.title}</h4>
              <p className="text-xs text-muted-foreground">{mode.description}</p>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
