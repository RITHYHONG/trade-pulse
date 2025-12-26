import { ChevronDown, Filter, Target, Globe, Layers, TrendingUp, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterState, ImpactLevel, Region, EventCategory } from './types';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
      high: { dot: 'bg-rose-500', count: 7 },
      medium: { dot: 'bg-amber-500', count: 12 },
      low: { dot: 'bg-emerald-500', count: 18 }
    }[impact];
  };

  const regionLabels: Record<Region, string> = {
    US: 'United States',
    EU: 'European Union',
    UK: 'United Kingdom',
    Asia: 'Asia Pacific',
    EM: 'Emerging Markets'
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-8">

        {/* Smart Filters */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Smart View
          </h3>

          <div className="grid gap-2">
            {[
              { label: 'Market Movers', icon: Target, count: 12 },
              { label: 'Volatility Focus', icon: TrendingUp, count: 8 },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 hover:bg-primary/5 font-normal text-sm group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                  <item.icon className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors relative z-10" />
                  <span className="flex-1 text-left relative z-10">{item.label}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground relative z-10">{item.count}</span>

                  {/* Subtle active indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"
                  />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Filters */}
        <Collapsible
          open={openSections.impact}
          onOpenChange={(open) => setOpenSections({ ...openSections, impact: open })}
          className="space-y-3"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full group py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              Impact
            </h3>
            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", openSections.impact && "rotate-180")} />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 pt-1">
            {(['high', 'medium', 'low'] as ImpactLevel[]).map((impact) => {
              const styles = getImpactStyles(impact);
              return (
                <div key={impact} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/40 transition-colors group">
                  <Checkbox
                    id={`impact-${impact}`}
                    checked={filters.impacts.includes(impact)}
                    onCheckedChange={() => toggleImpact(impact)}
                    className="w-4 h-4 border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`impact-${impact}`}
                    className="flex items-center gap-3 cursor-pointer flex-1 font-normal"
                  >
                    <div className={cn("w-2 h-2 rounded-full", styles.dot)} />
                    <span className="capitalize text-sm text-foreground/90">
                      {impact}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{styles.count}</span>
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Region Filters */}
        <Collapsible
          open={openSections.regions}
          onOpenChange={(open) => setOpenSections({ ...openSections, regions: open })}
          className="space-y-3"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full group py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Regions
            </h3>
            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", openSections.regions && "rotate-180")} />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 pt-1">
            {(['US', 'EU', 'UK', 'Asia', 'EM'] as Region[]).map((region) => (
              <div key={region} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/40 transition-colors">
                <Checkbox
                  id={`region-${region}`}
                  checked={filters.regions.includes(region)}
                  onCheckedChange={() => toggleRegion(region)}
                  className="w-4 h-4 border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`region-${region}`}
                  className="flex-1 cursor-pointer text-sm font-normal text-foreground/90"
                >
                  {regionLabels[region]}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Category Filters */}
        <Collapsible
          open={openSections.categories}
          onOpenChange={(open) => setOpenSections({ ...openSections, categories: open })}
          className="space-y-3"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full group py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              Categories
            </h3>
            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", openSections.categories && "rotate-180")} />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 pt-1">
            {(['inflation', 'employment', 'gdp', 'centralBank', 'trade', 'retail', 'manufacturing', 'housing'] as EventCategory[]).map(category => (
              <div key={category} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/40 transition-colors">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  className="w-4 h-4 border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="flex-1 cursor-pointer text-sm font-normal text-foreground/90 capitalize"
                >
                  {category === 'centralBank' ? 'Central Bank' : category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Reset Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-dashed border-border text-muted-foreground hover:text-foreground"
            onClick={() => onFiltersChange({
              impacts: ['high', 'medium', 'low'],
              regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
              categories: [],
              searchQuery: '',
              highImpactOnly: false
            })}
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset All Filters
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
