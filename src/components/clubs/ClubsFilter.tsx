
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClubsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: string[];
  activeFilters: string[];
  toggleFilter: (category: string) => void;
  clearFilters: () => void;
}

const ClubsFilter = ({
  searchTerm,
  setSearchTerm,
  categories,
  activeFilters,
  toggleFilter,
  clearFilters
}: ClubsFilterProps) => {
  return (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Search clubs and communities..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter UI */}
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-foreground">Filter by category:</h2>
            {activeFilters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 px-2 text-xs"
              >
                <X size={14} className="mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={activeFilters.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ClubsFilter;
