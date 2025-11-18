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
      color: '#EF4444',
    },
    {
      id: 'analysis' as const,
      icon: FileText,
      title: 'Analysis Piece',
      description: 'Full featured in-depth analysis',
      color: '#0066FF',
    },
    {
      id: 'trade' as const,
      icon: TrendingUp,
      title: 'Trade Idea',
      description: 'Structured trade recommendation',
      color: '#10B981',
    },
    {
      id: 'research' as const,
      icon: BookOpen,
      title: 'Research Note',
      description: 'Academic-style deep dive',
      color: '#F59E0B',
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
            className="h-auto py-6 flex-col gap-3 bg-[#1A1D28] border-[#2D3246] hover:bg-[#2D3246]/50 hover:border-[#00F5FF]/30"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mode.color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: mode.color }} />
            </div>
            <div className="text-center">
              <h4 className="mb-1">{mode.title}</h4>
              <p className="text-xs text-muted-foreground">{mode.description}</p>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
