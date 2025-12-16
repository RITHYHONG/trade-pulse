'use client';

import { useState } from 'react';
import { Bell, Plus, X, AlertTriangle, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Alert {
  id: string;
  type: 'consensus' | 'volatility' | 'correlation' | 'keyword';
  condition: string;
  threshold?: number;
  enabled: boolean;
  eventName: string;
}

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'consensus',
      condition: 'Actual > Consensus',
      threshold: 0.3,
      enabled: true,
      eventName: 'US Non-Farm Payrolls'
    },
    {
      id: '2',
      type: 'volatility',
      condition: 'Expected Move',
      threshold: 1.5,
      enabled: true,
      eventName: 'All High Impact Events'
    },
    {
      id: '3',
      type: 'correlation',
      condition: 'Correlation Break',
      enabled: false,
      eventName: 'USD/JPY vs Nikkei'
    }
  ]);

  const [showNewAlert, setShowNewAlert] = useState(false);

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    return {
      consensus: AlertTriangle,
      volatility: Zap,
      correlation: TrendingUp,
      keyword: Bell
    }[type] || Bell;
  };

  const getAlertStyles = (type: string) => {
    return {
      consensus: {
        icon: 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]',
        bg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/15',
        border: 'border-amber-500/30',
        glow: 'shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20'
      },
      volatility: {
        icon: 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]',
        bg: 'bg-gradient-to-br from-rose-500/15 to-red-500/15',
        border: 'border-rose-500/30',
        glow: 'shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20'
      },
      correlation: {
        icon: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]',
        bg: 'bg-gradient-to-br from-cyan-500/15 to-blue-500/15',
        border: 'border-cyan-500/30',
        glow: 'shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20'
      },
      keyword: {
        icon: 'text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]',
        bg: 'bg-gradient-to-br from-violet-500/15 to-purple-500/15',
        border: 'border-violet-500/30',
        glow: 'shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20'
      }
    }[type] || {
      icon: 'text-muted-foreground',
      bg: 'bg-muted/50',
      border: 'border-border',
      glow: ''
    };
  };

  return (
    <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Smart Alerts</h3>
            <p className="text-xs text-muted-foreground">Real-time market monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-3 py-1"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse" />
            {alerts.filter(a => a.enabled).length} Active
          </Badge>
          <Button 
            size="sm"
            onClick={() => setShowNewAlert(!showNewAlert)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Alert
          </Button>
        </div>
      </div>

      {/* New Alert Form */}
      {showNewAlert && (
        <div className="relative mb-6 p-5 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Create New Alert</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alert Type</Label>
                <Select>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consensus">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Consensus Deviation
                      </span>
                    </SelectItem>
                    <SelectItem value="volatility">
                      <span className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-rose-400" />
                        Volatility Threshold
                      </span>
                    </SelectItem>
                    <SelectItem value="correlation">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        Correlation Break
                      </span>
                    </SelectItem>
                    <SelectItem value="keyword">
                      <span className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-violet-400" />
                        Keyword Alert
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Event</Label>
                <Input 
                  placeholder="Search events..."
                  className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Condition</Label>
                <Select>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt">Greater than</SelectItem>
                    <SelectItem value="lt">Less than</SelectItem>
                    <SelectItem value="eq">Equal to</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Threshold</Label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                size="sm" 
                className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-border/50 hover:bg-muted/50 transition-all duration-200"
                onClick={() => setShowNewAlert(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Cards */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          const styles = getAlertStyles(alert.type);

          return (
            <div 
              key={alert.id}
              className={`
                group relative p-4 rounded-xl border transition-all duration-300
                ${alert.enabled 
                  ? `${styles.bg} ${styles.border} shadow-lg ${styles.glow}` 
                  : 'bg-muted/20 border-border/30 opacity-60'
                }
                hover:scale-[1.01] hover:shadow-xl
              `}
            >
              {/* Active indicator bar */}
              {alert.enabled && (
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${styles.icon.replace('text-', 'bg-')}`} />
              )}

              <div className="flex items-start gap-4 pl-2">
                {/* Icon */}
                <div className={`
                  p-2.5 rounded-xl transition-all duration-200
                  ${alert.enabled ? `${styles.bg} ${styles.icon}` : 'bg-muted/50 text-muted-foreground'}
                `}>
                  <AlertIcon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-foreground truncate">
                        {alert.eventName}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`
                          text-[10px] uppercase tracking-wider font-medium shrink-0
                          ${alert.enabled ? styles.border : 'border-border/50'}
                        `}
                      >
                        {alert.type}
                      </Badge>
                    </div>
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={() => toggleAlert(alert.id)}
                      className="shrink-0 data-[state=checked]:bg-primary"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.condition}
                    {alert.threshold && (
                      <span className="text-foreground font-medium">
                        {' '}by {alert.threshold}{alert.type === 'consensus' ? '%' : ''}
                      </span>
                    )}
                  </p>

                  {alert.enabled && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        Monitoring
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  onClick={() => deleteAlert(alert.id)}
                  aria-label="Delete alert"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Bell className="w-3.5 h-3.5" />
          Alerts trigger via browser notifications and email. Configure in settings.
        </p>
      </div>
    </div>
  );
}
