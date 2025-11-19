import { ChevronDown, Filter, Target, Globe, Layers, Clock, TrendingUp, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterState, ImpactLevel, Region, EventCategory } from './types';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    impact: true,
    regions: true,
    categories: true,
    sessions: false
  });

  const toggleImpact = (impact: ImpactLevel) => {
    const newImpacts = filters.impacts.includes(impact)
      ? filters.impacts.filter(i => i !== impact)
      : [...filters.impacts, impact];
    onFiltersChange({ impacts: newImpacts });
  };

  const toggleRegion = (region: Region) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    onFiltersChange({ regions: newRegions });
  };

  const toggleCategory = (category: EventCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ categories: newCategories });
  };

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-950 text-white overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg">Advanced Filters</h2>
        </div>

        {/* Smart Filters */}
        <div className="space-y-2 mb-6">
          <h3 className="text-sm text-slate-400 mb-3">SMART FILTERS</h3>
          <Button variant="outline" className="w-full justify-start bg-slate-900 border-slate-700 hover:bg-slate-800">
            <Target className="w-4 h-4 mr-2 text-red-400" />
            Market Movers Only
            <Badge className="ml-auto bg-red-600">12</Badge>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-slate-900 border-slate-700 hover:bg-slate-800">
            <TrendingUp className="w-4 h-4 mr-2 text-orange-400" />
            Volatility Focus
            <Badge className="ml-auto bg-orange-600">8</Badge>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-slate-900 border-slate-700 hover:bg-slate-800">
            <ArrowUpCircle className="w-4 h-4 mr-2 text-green-400" />
            Directional Bias
            <Badge className="ml-auto bg-green-600">15</Badge>
          </Button>
        </div>

        <Separator className="bg-slate-800 my-6" />

        {/* Impact Filters */}
        <Collapsible
          open={openSections.impact}
          onOpenChange={(open) => setOpenSections({ ...openSections, impact: open })}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <h3 className="text-sm text-slate-400">IMPACT LEVEL</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.impact ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="impact-high"
                checked={filters.impacts.includes('high')}
                onCheckedChange={() => toggleImpact('high')}
              />
              <Label htmlFor="impact-high" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                High Impact
                <Badge className="ml-auto bg-red-600">7</Badge>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="impact-medium"
                checked={filters.impacts.includes('medium')}
                onCheckedChange={() => toggleImpact('medium')}
              />
              <Label htmlFor="impact-medium" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                Medium Impact
                <Badge className="ml-auto bg-orange-600">12</Badge>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="impact-low"
                checked={filters.impacts.includes('low')}
                onCheckedChange={() => toggleImpact('low')}
              />
              <Label htmlFor="impact-low" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Low Impact
                <Badge className="ml-auto bg-slate-600">18</Badge>
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-slate-800 my-6" />

        {/* Region Filters */}
        <Collapsible
          open={openSections.regions}
          onOpenChange={(open) => setOpenSections({ ...openSections, regions: open })}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <h3 className="text-sm text-slate-400">REGIONS</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.regions ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="region-us"
                checked={filters.regions.includes('US')}
                onCheckedChange={() => toggleRegion('US')}
              />
              <Label htmlFor="region-us" className="flex items-center gap-2 cursor-pointer flex-1">
                <Globe className="w-4 h-4 text-blue-400" />
                United States
                <Badge className="ml-auto">8</Badge>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="region-eu"
                checked={filters.regions.includes('EU')}
                onCheckedChange={() => toggleRegion('EU')}
              />
              <Label htmlFor="region-eu" className="flex items-center gap-2 cursor-pointer flex-1">
                <Globe className="w-4 h-4 text-yellow-400" />
                European Union
                <Badge className="ml-auto">6</Badge>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="region-uk"
                checked={filters.regions.includes('UK')}
                onCheckedChange={() => toggleRegion('UK')}
              />
              <Label htmlFor="region-uk" className="flex items-center gap-2 cursor-pointer flex-1">
                <Globe className="w-4 h-4 text-purple-400" />
                United Kingdom
                <Badge className="ml-auto">4</Badge>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="region-asia"
                checked={filters.regions.includes('Asia')}
                onCheckedChange={() => toggleRegion('Asia')}
              />
              <Label htmlFor="region-asia" className="flex items-center gap-2 cursor-pointer flex-1">
                <Globe className="w-4 h-4 text-red-400" />
                Asia Pacific
                <Badge className="ml-auto">5</Badge>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="region-em"
                checked={filters.regions.includes('EM')}
                onCheckedChange={() => toggleRegion('EM')}
              />
              <Label htmlFor="region-em" className="flex items-center gap-2 cursor-pointer flex-1">
                <Globe className="w-4 h-4 text-green-400" />
                Emerging Markets
                <Badge className="ml-auto">3</Badge>
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-slate-800 my-6" />

        {/* Category Filters */}
        <Collapsible
          open={openSections.categories}
          onOpenChange={(open) => setOpenSections({ ...openSections, categories: open })}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <h3 className="text-sm text-slate-400">EVENT CATEGORIES</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mb-6">
            {(['inflation', 'employment', 'gdp', 'centralBank', 'trade', 'retail', 'manufacturing', 'housing'] as EventCategory[]).map(category => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={`category-${category}`} className="cursor-pointer flex-1 capitalize">
                  {category === 'centralBank' ? 'Central Bank' : category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-slate-800 my-6" />

        {/* Trading Sessions */}
        <Collapsible
          open={openSections.sessions}
          onOpenChange={(open) => setOpenSections({ ...openSections, sessions: open })}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full mb-3">
            <h3 className="text-sm text-slate-400">TRADING SESSIONS</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.sessions ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mb-6">
            <Button variant="outline" className="w-full justify-start bg-slate-900 border-slate-700">
              <Clock className="w-4 h-4 mr-2" />
              Asian Session
            </Button>
            <Button variant="outline" className="w-full justify-start bg-slate-900 border-slate-700">
              <Clock className="w-4 h-4 mr-2" />
              London Open
            </Button>
            <Button variant="outline" className="w-full justify-start bg-slate-900 border-slate-700">
              <Clock className="w-4 h-4 mr-2" />
              NY Power Hours
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full bg-slate-900 border-slate-700 hover:bg-slate-800"
          onClick={() => onFiltersChange({
            impacts: ['high', 'medium', 'low'],
            regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
            categories: [],
            searchQuery: '',
            highImpactOnly: false
          })}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
}


