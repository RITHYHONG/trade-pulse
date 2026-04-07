import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: LucideIcon;
  iconBackground: string;
  iconText: string;
}

const trendStyles: Record<StatCardProps['trend'], { bg: string; text: string }> = {
  up: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  down: { bg: 'bg-destructive/10', text: 'text-destructive' },
  neutral: { bg: 'bg-slate-500/10', text: 'text-slate-500' },
};

export function StatCard({ label, value, trend, trendValue, icon: Icon, iconBackground, iconText }: StatCardProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const styles = trendStyles[trend];

  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="card-interactive bg-card rounded-xl p-6 border border-border shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p id={`${id}-label`} className="text-sm text-muted-foreground font-medium mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBackground} ${iconText} bg-opacity-10 text-opacity-100`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
          {trendValue}
        </span>
        <span className="text-xs text-muted-foreground">vs yesterday</span>
      </div>
    </div>
  );
}

export function SectionFallback({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${label}`}
      className={`animate-pulse rounded-xl bg-muted/20 ${className}`}
    />
  );
}
