
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          className={cn(
            "whitespace-nowrap",
            selectedCategory === category ? 
              "bg-primary text-primary-foreground hover:bg-accent shadow-[0_0_10px_rgba(255,193,7,0.3)]" : 
              "border-primary text-foreground hover:bg-primary/20 hover:text-primary"
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
