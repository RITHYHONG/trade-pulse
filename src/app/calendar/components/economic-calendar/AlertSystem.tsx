import { useState } from 'react';
import { Bell, Plus, X, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

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

  const getAlertColor = (type: string) => {
    return {
      consensus: 'text-orange-400',
      volatility: 'text-red-400',
      correlation: 'text-blue-400',
      keyword: 'text-purple-400'
    }[type] || 'text-slate-400';
  };

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg text-white">Smart Alerts</h3>
          <Badge variant="outline" className="border-green-700 text-green-400">
            {alerts.filter(a => a.enabled).length} Active
          </Badge>
        </div>
        <Button 
          size="sm"
          onClick={() => setShowNewAlert(!showNewAlert)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Alert
        </Button>
      </div>

      {showNewAlert && (
        <Card className="bg-slate-950 border-slate-800 p-4 mb-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-slate-400 mb-2">Alert Type</Label>
              <Select>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consensus">Consensus Deviation</SelectItem>
                  <SelectItem value="volatility">Volatility Threshold</SelectItem>
                  <SelectItem value="correlation">Correlation Break</SelectItem>
                  <SelectItem value="keyword">Keyword Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-slate-400 mb-2">Event</Label>
              <Input 
                placeholder="Search events..."
                className="bg-slate-900 border-slate-700"
              />
            </div>

            <div>
              <Label className="text-sm text-slate-400 mb-2">Condition</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select>
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt">Greater than</SelectItem>
                    <SelectItem value="lt">Less than</SelectItem>
                    <SelectItem value="eq">Equal to</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="number"
                  placeholder="Threshold"
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Create Alert
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-slate-700"
                onClick={() => setShowNewAlert(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {alerts.map(alert => {
          const AlertIcon = getAlertIcon(alert.type);
          const iconColor = getAlertColor(alert.type);

          return (
            <Card 
              key={alert.id} 
              className={`bg-slate-950 border-slate-800 p-4 transition-all ${
                alert.enabled ? 'border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`${iconColor} mt-1`}>
                  <AlertIcon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{alert.eventName}</span>
                      <Badge variant="outline" className="text-xs border-slate-700">
                        {alert.type}
                      </Badge>
                    </div>
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    {alert.condition}
                    {alert.threshold && ` by ${alert.threshold}${alert.type === 'consensus' ? '%' : ''}`}
                  </div>

                  {alert.enabled && (
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span>Active - Monitoring</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 hover:bg-slate-900"
                  onClick={() => deleteAlert(alert.id)}
                  aria-label="Delete alert"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Separator className="bg-slate-800 my-4" />

      <div className="text-xs text-slate-500">
        Alerts will be triggered via browser notifications and email. Configure notification preferences in settings.
      </div>
    </div>
  );
}
