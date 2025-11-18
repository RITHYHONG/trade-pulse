import { useState } from 'react';
import { Calendar, Search, TrendingUp, Clock, Globe2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterState } from './types';

interface HeaderProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  eventCount: number;
  highImpactCount: number;
}

export function Header({ filters, onFiltersChange, eventCount, highImpactCount }: HeaderProps) {
  const [marketStatus, setMarketStatus] = useState<{
    asia: 'open' | 'closed';
    london: 'open' | 'closed';
    newyork: 'open' | 'closed';
  }>({
    asia: 'closed',
    london: 'open',
    newyork: 'open'
  });

  return (
    <div className="border-b bg-slate-950 text-white sticky top-0 z-50">
      {/* Top Bar - Market Status */}
      <div className="border-b border-slate-800 px-6 py-2 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-400">Market Status:</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${marketStatus.asia === 'open' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm">Asia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${marketStatus.london === 'open' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm">London</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${marketStatus.newyork === 'open' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm">New York</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl">Economic Calendar Intelligence</h1>
              <p className="text-sm text-slate-400">
                {eventCount} events • {highImpactCount} high impact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filters.viewPreset} onValueChange={(value: any) => onFiltersChange({ viewPreset: value })}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700">
                <SelectValue placeholder="View Preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dayTrader">Day Trader</SelectItem>
                <SelectItem value="swingTrader">Swing Trader</SelectItem>
                <SelectItem value="forexFocus">Forex Focus</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          {/* Date Navigator */}
          <div className="flex items-center gap-2">
            <Button
              variant={filters.dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ dateRange: 'today' })}
              className={filters.dateRange === 'today' ? '' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}
            >
              Today
            </Button>
            <Button
              variant={filters.dateRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ dateRange: 'week' })}
              className={filters.dateRange === 'week' ? '' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}
            >
              Week
            </Button>
            <Button
              variant={filters.dateRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ dateRange: 'month' })}
              className={filters.dateRange === 'month' ? '' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-900 border-slate-700 hover:bg-slate-800"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search events, countries, tickers..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
              className="pl-10 bg-slate-900 border-slate-700"
            />
          </div>

          {/* High Impact Toggle */}
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
            <Switch
              id="high-impact"
              checked={filters.highImpactOnly}
              onCheckedChange={(checked) => onFiltersChange({ highImpactOnly: checked })}
            />
            <Label htmlFor="high-impact" className="cursor-pointer flex items-center gap-2">
              High Impact Only
              {filters.highImpactOnly && (
                <Badge variant="destructive" className="ml-1">
                  {highImpactCount}
                </Badge>
              )}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
