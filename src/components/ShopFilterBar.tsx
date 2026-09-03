import React, { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, Check, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getStoredCategories, getStoredProducts, STORE_SYNC_EVENT } from '../data/adminStore';

export interface FilterState {
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
  category: string; // 'all' | custom category
  priceRange: 'all' | 'under-2500' | '2500-3000' | 'above-3000';
  size: number | null;
}

interface ShopFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  totalProductsCount: number;
  availableSizes?: number[];
}

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-2500', label: 'Under ৳2,500' },
  { id: '2500-3000', label: '৳2,500 – ৳3,000' },
  { id: 'above-3000', label: 'Over ৳3,000' },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export const ShopFilterBar: React.FC<ShopFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  totalProductsCount,
  availableSizes: propAvailableSizes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [storedCategories, setStoredCategories] = useState(() => getStoredCategories());
  const [storedProducts, setStoredProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleSync = () => {
      setStoredCategories(getStoredCategories());
      setStoredProducts(getStoredProducts());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Silhouettes' },
      ...storedCategories.map((c) => ({
        id: c.slug,
        label: c.name,
      })),
    ];
  }, [storedCategories]);

  // Aggregate all sizes from lowest to highest from all products / admin panel
  const allSizes = useMemo(() => {
    if (propAvailableSizes && propAvailableSizes.length > 0) {
      return [...propAvailableSizes].sort((a, b) => a - b);
    }
    const sizeSet = new Set<number>();
    storedProducts.forEach((p) => {
      if (Array.isArray(p.sizes)) {
        p.sizes.forEach((s) => sizeSet.add(s));
      }
    });
    const sorted = Array.from(sizeSet).sort((a, b) => a - b);
    return sorted.length > 0 ? sorted : [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
  }, [propAvailableSizes, storedProducts]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handlePriceRangeChange = (priceRange: FilterState['priceRange']) => {
    onFilterChange({ ...filters, priceRange });
  };

  const handleSizeToggle = (size: number) => {
    onFilterChange({
      ...filters,
      size: filters.size === size ? null : size,
    });
  };

  return (
    <div className="relative z-30" ref={dropdownRef}>
      {/* Right-aligned Minimalist & Premium Trigger Button */}
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={`group flex items-center space-x-2 text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs ${
            isOpen || activeFilterCount > 0
              ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
              : 'bg-white/95 backdrop-blur-xs text-stone-800 border-stone-200/90 hover:border-stone-900 hover:bg-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
          
          {activeFilterCount > 0 && (
            <span
              className={`w-4 h-4 rounded-md text-[10px] flex items-center justify-center font-bold ${
                isOpen || activeFilterCount > 0 ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'
              }`}
            >
              {activeFilterCount}
            </span>
          )}

          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : 'text-stone-500 group-hover:text-stone-900'
            }`}
          />
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            title="Reset Filters"
            className="flex items-center space-x-1 text-xs text-stone-600 hover:text-stone-900 font-semibold px-2.5 py-2 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Premium Minimalist Floating Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-28px)] max-w-[380px] sm:max-w-[420px] bg-[#faf8f5] border border-stone-200/90 rounded-2xl shadow-2xl p-4 sm:p-5 text-stone-900 z-50 divide-y divide-stone-200/80 max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                  Filters
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Showing {totalProductsCount} matching styles
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={onResetFilters}
                    className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sizes Section - Dynamic from lowest to highest size */}
            <div className="py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Size
                </span>
                {filters.size !== null && (
                  <span className="text-[11px] font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200/90 shadow-2xs">
                    Size {filters.size}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
                {allSizes.map((sz) => {
                  const isSelected = filters.size === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => handleSizeToggle(sz)}
                      className={`text-xs py-2 rounded-lg font-bold transition-all text-center cursor-pointer border ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50 active:scale-95'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Section */}
            <div className="py-3.5 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Sort By
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = filters.sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSortChange(opt.id as FilterState['sortBy'])}
                      className={`text-xs py-2 px-2.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-1.5 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Silhouette Category */}
            <div className="py-3.5 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const isSelected = filters.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-xs py-1.5 px-3 rounded-lg transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold border-stone-900 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="py-3.5 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Price Range
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_RANGES.map((range) => {
                  const isSelected = filters.priceRange === range.id;
                  return (
                    <button
                      key={range.id}
                      onClick={() => handlePriceRangeChange(range.id as FilterState['priceRange'])}
                      className={`text-xs py-2 px-2.5 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{range.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Action */}
            <div className="pt-3.5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Apply Filters ({totalProductsCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

