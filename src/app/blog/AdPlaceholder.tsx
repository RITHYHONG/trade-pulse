import { ads } from '@config/ads';

interface AdPlaceholderProps {
  type: 'leaderboard' | 'skyscraper' | 'rectangle' | 'banner' | 'native';
  className?: string;
}

export function AdPlaceholder({ type, className = '' }: AdPlaceholderProps) {
  const ad = ads[type];

  if (!ad || !ad.html) {
    // Fallback to placeholder if no ad configured
    const getAdDimensions = () => {
      switch (type) {
        case 'leaderboard':
          return 'h-[90px] w-full max-w-[728px]';
        case 'skyscraper':
          return 'h-[600px] w-[300px]';
        case 'rectangle':
          return 'h-[250px] w-[300px]';
        case 'banner':
          return 'h-[90px] w-full max-w-[728px]';
        case 'native':
          return 'h-[120px] w-full';
        default:
          return 'h-[250px] w-[300px]';
      }
    };

    const getAdLabel = () => {
      switch (type) {
        case 'leaderboard':
          return 'Advertisement (728x90)';
        case 'skyscraper':
          return 'Advertisement (300x600)';
        case 'rectangle':
          return 'Advertisement (300x250)';
        case 'banner':
          return 'Advertisement (728x90)';
        case 'native':
          return 'Sponsored Content';
        default:
          return 'Advertisement';
      }
    };

    return (
      <div className={`bg-muted/30 border border-border/50 rounded-xl flex flex-col items-center justify-center p-6 text-center ${getAdDimensions()} ${className}`}>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
        <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold mb-1">
          {getAdLabel()}
        </div>
        <div className="text-muted-foreground/40 text-[10px] font-medium max-w-[200px]">
          Content failed to load. Please disable your AdBlocker to see this promotion.
        </div>
      </div>
    );
  }

  // Render actual ad HTML with error handling
  return (
    <div
      className={`relative flex items-center justify-center bg-card/50 ring-1 ring-border p-4 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:bg-card/80 ${className}`}
    >
      <div 
        className="w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: ad.html }} 
      />
      {/* Invisible overlay to detect if the inner content (like an image) failed to render or was blocked */}
      <div className="absolute inset-0 pointer-events-none opacity-0 flex items-center justify-center bg-background/50 group-data-[blocked=true]:opacity-100">
         <span className="text-[10px] text-muted-foreground">Promotion Blocked</span>
      </div>
    </div>
  );
}