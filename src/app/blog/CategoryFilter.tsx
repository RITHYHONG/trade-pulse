import { categories } from '../../data/blogData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-md border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === category
                  ? 'bg-foreground text-background shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}