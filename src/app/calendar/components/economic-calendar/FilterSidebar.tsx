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
        dot: 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30',
        badge: 'bg-gradient-to-r from-red-500/15 to-rose-500/15 text-red-400 border-red-500/30',
        count: 7
      },
      medium: {
        dot: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30',
        badge: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-400 border-amber-500/30',
        count: 12
      },
      low: {
        dot: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30',
        badge: 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-400 border-emerald-500/30',
        count: 18
      }
    }[impact];
  };

  const getRegionStyles = (region: Region) => {
    return {
      US: {
        icon: 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
        badge: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
        count: 8
      },
      EU: {
        icon: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]',
        badge: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30',
        count: 6
      },
      UK: {
        icon: 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
        badge: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
        count: 4
      },
      Asia: {
        icon: 'text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]',
        badge: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
        count: 5
      },
      EM: {
        icon: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
        badge: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
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
      <div className="w-80 bg-card/80 backdrop-blur-xl border-r border-border/50">
        <div className="p-6 mb-16">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl dark:bg-primary/50 bg-primary text-primary">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Advanced Filters</h2>
              <p className="text-xs text-muted-foreground">Refine your market view</p>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Smart Filters
              </h3>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-rose-500/5 hover:border-rose-500/30 transition-all duration-200 group"
              >
                <Target className="w-4 h-4 mr-3 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Market Movers Only</span>
                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 ml-2">
                  12
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all duration-200 group"
              >
                <TrendingUp className="w-4 h-4 mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Volatility Focus</span>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 ml-2">
                  8
                </Badge>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all duration-200 group"
              >
                <ArrowUpCircle className="w-4 h-4 mr-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left">Directional Bias</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ml-2">
                  15
                </Badge>
              </Button>
            </div>
          </div>

          <Separator className="bg-border/30 my-6" />

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
                      className="flex items-center gap-3 cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${styles.dot} ring-2 ring-transparent group-hover:ring-muted-foreground/20 transition-all`} />
                      <span className="capitalize font-medium text-foreground">
                        {impact} Impact
                      </span>
                      <Badge className={`ml-auto ${styles.badge} text-xs`}>
                        {styles.count}
                      </Badge>
                    </Label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-border/30 my-6" />

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
                      className="flex items-center gap-3 cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Globe className={`w-4 h-4 ${styles.icon} group-hover:scale-110 transition-transform`} />
                      <span className="font-medium text-foreground">
                        {regionLabels[region]}
                      </span>
                      <Badge className={`ml-auto ${styles.badge} text-xs`}>
                        {styles.count}
                      </Badge>
                    </Label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-border/30 my-6" />

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
                    className="cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted/50 transition-colors font-medium text-foreground capitalize"
                  >
                    {category === 'centralBank' ? 'Central Bank' : category}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-border/30 my-6" />

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
                className="w-full justify-start border-border/50 hover:bg-muted/50 transition-all duration-200 group"
              >
                <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
                Asian Session
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-muted/50 transition-all duration-200 group"
              >
                <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
                London Open
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-muted/50 transition-all duration-200 group"
              >
                <Clock className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
                NY Power Hours
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full border-border/50 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive transition-all duration-200 group mt-6"
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


