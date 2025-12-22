import { ChevronDown, Filter, Target, Globe, Layers, Clock, TrendingUp, ArrowUpCircle, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterState, ImpactLevel, Region, EventCategory } from './types';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const getImpactStyles = (impact: ImpactLevel) => {
    return {
      high: {
        dot: 'bg-rose-500',
        badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
        count: 7
      },
      medium: {
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        count: 12
      },
      low: {
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        count: 18
      }
    }[impact];
  };

  const getRegionStyles = (region: Region) => {
    return {
      US: {
        icon: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
        count: 8
      },
      EU: {
        icon: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        count: 6
      },
      UK: {
        icon: 'text-purple-600 dark:text-purple-400',
        badge: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
        count: 4
      },
      Asia: {
        icon: 'text-pink-600 dark:text-pink-400',
        badge: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20',
        count: 5
      },
      EM: {
        icon: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        count: 3
      }
    }[region];
  };

  const regionLabels = {
    US: 'United States',
    EU: 'European Union',
    UK: 'United Kingdom',
    Asia: 'Asia Pacific',
    EM: 'Emerging Markets'
  };

  return (
    <ScrollArea className="h-full">
      <div className="w-80 bg-card border-r border-border">
        <div className="p-6 mb-16">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Advanced Filters</h2>
              <p className="text-sm text-muted-foreground">Refine your market view</p>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Smart Filters
              </h3>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/20 transition-all duration-200 group"
              >
                <Target className="w-4 h-4 mr-3 text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Market Movers Only</span>
                <Badge className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 ml-2">
                  12
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-200 dark:hover:border-amber-500/20 transition-all duration-200 group"
              >
                <TrendingUp className="w-4 h-4 mr-3 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Volatility Focus</span>
                <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 ml-2">
                  8
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all duration-200 group"
              >
                <ArrowUpCircle className="w-4 h-4 mr-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Directional Bias</span>
                <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 ml-2">
                  15
                </Badge>
              </Button>
            </div>
          </div>

          <Separator className="bg-border my-6" />

          {/* Impact Filters */}
          <Collapsible
            open={openSections.impact}
            onOpenChange={(open) => setOpenSections({ ...openSections, impact: open })}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-4 group">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Impact Level
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${openSections.impact ? 'rotate-180' : ''} group-hover:text-foreground`} />
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 mb-6">
              {(['high', 'medium', 'low'] as ImpactLevel[]).map((impact) => {
                const styles = getImpactStyles(impact);
                return (
                  <div key={impact} className="flex items-center gap-3 group">
                    <Checkbox
                      id={`impact-${impact}`}
                      checked={filters.impacts.includes(impact)}
                      onCheckedChange={() => toggleImpact(impact)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`impact-${impact}`}
                      className="flex items-center gap-3 cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                      <span className="capitalize font-medium text-foreground text-sm">
                        {impact} Impact
                      </span>
                      <Badge className={`ml-auto ${styles.badge} text-xs border`}>
                        {styles.count}
                      </Badge>
                    </Label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-border my-6" />

          {/* Region Filters */}
          <Collapsible
            open={openSections.regions}
            onOpenChange={(open) => setOpenSections({ ...openSections, regions: open })}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-4 group">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Regions
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${openSections.regions ? 'rotate-180' : ''} group-hover:text-foreground`} />
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 mb-6">
              {(['US', 'EU', 'UK', 'Asia', 'EM'] as Region[]).map((region) => {
                const styles = getRegionStyles(region);
                return (
                  <div key={region} className="flex items-center gap-3 group">
                    <Checkbox
                      id={`region-${region}`}
                      checked={filters.regions.includes(region)}
                      onCheckedChange={() => toggleRegion(region)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`region-${region}`}
                      className="flex items-center gap-3 cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Globe className={`w-4 h-4 ${styles.icon} transition-transform group-hover:scale-110`} />
                      <span className="font-medium text-foreground text-sm">
                        {regionLabels[region]}
                      </span>
                      <Badge className={`ml-auto ${styles.badge} text-xs border`}>
                        {styles.count}
                      </Badge>
                    </Label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-border my-6" />

          {/* Category Filters */}
          <Collapsible
            open={openSections.categories}
            onOpenChange={(open) => setOpenSections({ ...openSections, categories: open })}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-4 group">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Event Categories
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${openSections.categories ? 'rotate-180' : ''} group-hover:text-foreground`} />
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-2 mb-6">
              {(['inflation', 'employment', 'gdp', 'centralBank', 'trade', 'retail', 'manufacturing', 'housing'] as EventCategory[]).map(category => (
                <div key={category} className="flex items-center gap-3 group">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted transition-colors font-medium text-foreground text-sm capitalize"
                  >
                    {category === 'centralBank' ? 'Central Bank' : category}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-border my-6" />

          {/* Trading Sessions */}
          <Collapsible
            open={openSections.sessions}
            onOpenChange={(open) => setOpenSections({ ...openSections, sessions: open })}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-4 group">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Trading Sessions
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${openSections.sessions ? 'rotate-180' : ''} group-hover:text-foreground`} />
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-2 mb-6">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-muted transition-all duration-200 group"
              >
                <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-all" />
                Asian Session
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-muted transition-all duration-200 group"
              >
                <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-all" />
                London Open
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-muted transition-all duration-200 group"
              >
                <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-all" />
                NY Power Hours
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full border-border hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 group mt-6"
            onClick={() => onFiltersChange({
              impacts: ['high', 'medium', 'low'],
              regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
              categories: [],
              searchQuery: '',
              highImpactOnly: false
            })}
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Reset All Filters
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}


