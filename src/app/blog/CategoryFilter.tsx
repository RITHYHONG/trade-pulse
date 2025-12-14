import { Badge } from '@/components/ui/badge';
import { categories } from '../../data/blogData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-[#2D3246] py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-[#1A1D28] text-gray-300 border-[#2D3246] hover:bg-[#2D3246] hover:text-white hover:border-cyan-500/30'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}