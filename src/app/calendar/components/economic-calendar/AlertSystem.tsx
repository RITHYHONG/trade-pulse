'use client';

import { useState } from 'react';
import { Bell, Plus, X, AlertTriangle, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        icon: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        dot: 'bg-amber-500'
      },
      volatility: {
        icon: 'text-rose-500',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        dot: 'bg-rose-500'
      },
      correlation: {
        icon: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        dot: 'bg-blue-500'
      },
      keyword: {
        icon: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        dot: 'bg-violet-500'
      }
    }[type] || {
      icon: 'text-muted-foreground',
      bg: 'bg-muted',
      border: 'border-border',
      dot: 'bg-muted-foreground'
    };
  };

  return (
    <div className="bg-card/40 rounded-xl p-4 md:p-6 border border-border/40 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary relative">
            <Bell className="w-4 h-4" />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute inset-0 rounded-lg bg-primary/20"
            />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-tight">SMART ALERTS</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Real-time monitor</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowNewAlert(!showNewAlert)}
          className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 text-primary transition-all"
        >
          {showNewAlert ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
      </div>

      {/* New Alert Form - Responsive Stack */}
      {showNewAlert && (
        <div className="p-4 rounded-xl bg-secondary/30 border border-primary/20 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-widest">New Config</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Event Source</Label>
                <Input
                  placeholder="e.g. US NFP"
                  className="h-8 text-xs bg-background/50 border-border/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Alert Type</Label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs bg-background/50 border-border/40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consensus">Consensus</SelectItem>
                      <SelectItem value="volatility">Volatility</SelectItem>
                      <SelectItem value="correlation">Correlation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Threshold</Label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    className="h-8 text-xs bg-background/50 border-border/40"
                  />
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full h-8 text-xs font-bold bg-primary hover:bg-primary/90 transition-all shadow-sm"
              onClick={() => setShowNewAlert(false)}
            >
              ENABLE ALERT
            </Button>
          </div>
        </div>
      )}

      {/* Alert Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type);
            const styles = getAlertStyles(alert.type);

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group relative p-3 rounded-xl border transition-all duration-300 overflow-hidden",
                  alert.enabled ? `${styles.bg} ${styles.border}` : "bg-muted/10 border-border/20 grayscale opacity-50"
                )}
              >
                {/* Monitoring Aura */}
                {alert.enabled && (
                  <motion.div
                    animate={{
                      opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className={cn("absolute inset-0", styles.dot)}
                  />
                )}
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", styles.bg, styles.icon)}>
                    <AlertIcon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-foreground truncate">{alert.eventName}</span>
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => toggleAlert(alert.id)}
                        className="scale-75 data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium">{alert.condition}</span>
                      {alert.threshold && (
                        <Badge variant="outline" className="h-4 text-[9px] px-1 font-mono border-transparent bg-background/40">
                          {alert.threshold}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-border/20 rounded-xl">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No Alerts Set</span>
        </div>
      )}
    </div>
  );
}
