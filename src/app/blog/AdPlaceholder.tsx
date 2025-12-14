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
      <div className={`bg-muted border border-border rounded-lg flex items-center justify-center ${getAdDimensions()} ${className}`}>
        <div className="text-center">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
            {getAdLabel()}
          </div>
          <div className="text-muted-foreground/60 text-xs">
            AdSense Placement
          </div>
        </div>
      </div>
    );
  }

  // Render actual ad HTML
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: ad.html }}
    />
  );
}