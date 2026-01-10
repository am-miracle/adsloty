"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterOptions {
  search: string;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  minSubscribers: number;
  minOpenRate: number;
  onlyAvailable: boolean;
}

interface NewsletterFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
}

export function NewsletterFilters({
  filters,
  onFiltersChange,
  categories,
}: NewsletterFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceRangeChange = (field: "min" | "max", value: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { ...filters.priceRange, [field]: value },
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      priceRange: { min: 0, max: 1000 },
      minSubscribers: 0,
      minOpenRate: 0,
      onlyAvailable: false,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000 ||
    filters.minSubscribers > 0 ||
    filters.minOpenRate > 0 ||
    filters.onlyAvailable;

  return (
    <div className="glass-strong rounded-xl p-6 border border-border space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search newsletters..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-border rounded-lg border border-border
              text-white placeholder:text-text-secondary
              focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleResetFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <label className="text-sm font-medium mb-2 block">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-surface-border text-text-secondary hover:bg-surface-border/70"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    handlePriceRangeChange("min", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-surface-border rounded-lg border border-border
                    text-white placeholder:text-text-secondary
                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <span className="text-text-secondary">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    handlePriceRangeChange("max", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-surface-border rounded-lg border border-border
                    text-white placeholder:text-text-secondary
                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min. Subscribers
              </label>
              <input
                type="number"
                placeholder="e.g., 10000"
                value={filters.minSubscribers || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minSubscribers: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-surface-border rounded-lg border border-border
                  text-white placeholder:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Min. Open Rate (%)
              </label>
              <input
                type="number"
                placeholder="e.g., 40"
                value={filters.minOpenRate || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minOpenRate: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-surface-border rounded-lg border border-border
                  text-white placeholder:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyAvailable}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      onlyAvailable: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-border bg-surface-border
                    checked:bg-primary checked:border-primary
                    focus:ring-2 focus:ring-primary/50"
                />
                <span className="text-sm font-medium">
                  Only show available slots
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
