import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductColor, PageView } from '../types';
import { getStoredProducts, STORE_SYNC_EVENT } from '../data/adminStore';
import { formatTaka } from '../utils/currency';
import { formatBadge } from '../utils/badge';
import { ShopFilterBar, FilterState } from '../components/ShopFilterBar';

interface ShopPageProps {
  currentView: PageView;
  products?: Product[];
  onSelectProduct: (product: Product, color?: ProductColor) => void;
  onQuickAdd: (product: Product, color: ProductColor, size: number) => void;
}

const ITEMS_PER_PAGE = 16;

const INITIAL_FILTERS: FilterState = {
  sortBy: 'featured',
  category: 'all',
  priceRange: 'all',
  size: null,
};

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'Our latest silhouettes crafted from renewable & recycled materials',
  },
  'shop-all': {
    title: 'All Footwear',
    subtitle: 'Everyday sneakers, runners, cruisers, slip-ons, and slides',
  },
  men: {
    title: "Men's Collection",
    subtitle: 'Engineered for all-day comfort, breathability, and natural performance',
  },
  women: {
    title: "Women's Collection",
    subtitle: 'Lightweight styles crafted with natural wool and breezy tree fibers',
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Most-loved everyday icons and top-rated footwear',
  },
};

export const ShopPage: React.FC<ShopPageProps> = ({
  currentView,
  products: propProducts,
  onSelectProduct,
}) => {
  const [storeProducts, setStoreProducts] = useState<Product[]>(() => propProducts || getStoredProducts());
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync products when props change or admin store updates
  useEffect(() => {
    if (propProducts) {
      setStoreProducts(propProducts);
    }
  }, [propProducts]);

  useEffect(() => {
    const handleSync = () => {
      setStoreProducts(getStoredProducts());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  // Reset filters and page when changing category views
  useEffect(() => {
    window.scrollTo(0, 0);
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  }, [currentView]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sortBy !== 'featured') count += 1;
    if (filters.category !== 'all') count += 1;
    if (filters.priceRange !== 'all') count += 1;
    if (filters.size !== null) count += 1;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // Base list based on current page view
  const baseProducts = useMemo(() => {
    let list = [...storeProducts];

    if (currentView === 'men') {
      list = list.filter((p) => p.gender === 'men' || p.gender === 'unisex');
    } else if (currentView === 'women') {
      list = list.filter((p) => p.gender === 'women' || p.gender === 'unisex');
    } else if (currentView === 'new-arrivals') {
      list = list.filter((p) => formatBadge(p.badge) === 'New');
    } else if (currentView === 'best-sellers') {
      list = list.filter((p) => formatBadge(p.badge) === 'Best');
    }

    return list;
  }, [currentView, storeProducts]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Category / Silhouette filter
    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price Range filter
    if (filters.priceRange === 'under-2500') {
      result = result.filter((p) => p.price < 2500);
    } else if (filters.priceRange === '2500-3000') {
      result = result.filter((p) => p.price >= 2500 && p.price <= 3000);
    } else if (filters.priceRange === 'above-3000') {
      result = result.filter((p) => p.price > 3000);
    }

    // Size filter
    if (filters.size !== null) {
      result = result.filter((p) => p.sizes.includes(filters.size as number));
    }

    // Sort order
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [baseProducts, filters]);

  // Total pages and safe current page
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Paginated product slice (16 items per page)
  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const viewMeta = VIEW_TITLES[currentView] || {
    title: 'Footwear Collection',
    subtitle: 'Explore our sustainable footwear designs',
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] bg-[#faf8f5] px-3 sm:px-8 md:px-12 lg:px-14 xl:px-16 pt-4 sm:pt-6 pb-16">
      {/* Top Header Row with Page Title on Left & Minimal Filter on Right Corner */}
      <div className="flex flex-row items-center justify-between gap-2 pb-4 sm:pb-6 border-b border-stone-300/60 mb-4 sm:mb-6">
        <div>
          <h1 className="font-serif text-xl sm:text-3xl text-stone-900 tracking-tight font-normal">
            {viewMeta.title}
          </h1>
          <p className="hidden sm:block text-xs sm:text-[13px] text-stone-600 mt-1 max-w-xl">
            {viewMeta.subtitle}
          </p>
        </div>

        {/* Right Side Corner Filter & Sort Control */}
        <div className="flex-shrink-0">
          <ShopFilterBar
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
            totalProductsCount={filteredProducts.length}
          />
        </div>
      </div>

      {/* Active Filter Chips (if any) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
          <span className="text-[10px] sm:text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            Filters:
          </span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-white text-stone-800 px-2.5 sm:px-3 py-1 rounded-lg border border-stone-300 shadow-2xs">
              <span className="capitalize">{filters.category}</span>
              <button
                onClick={() => setFilters({ ...filters, category: 'all' })}
                className="hover:text-stone-950 ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {filters.priceRange !== 'all' && (
            <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-white text-stone-800 px-2.5 sm:px-3 py-1 rounded-lg border border-stone-300 shadow-2xs">
              <span>
                {filters.priceRange === 'under-2500' && '< ৳2,500'}
                {filters.priceRange === '2500-3000' && '৳2.5k–3k'}
                {filters.priceRange === 'above-3000' && '> ৳3,000'}
              </span>
              <button
                onClick={() => setFilters({ ...filters, priceRange: 'all' })}
                className="hover:text-stone-950 ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {filters.size !== null && (
            <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-white text-stone-800 px-2.5 sm:px-3 py-1 rounded-lg border border-stone-300 shadow-2xs">
              <span>Size {filters.size}</span>
              <button
                onClick={() => setFilters({ ...filters, size: null })}
                className="hover:text-stone-950 ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {filters.sortBy !== 'featured' && (
            <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-white text-stone-800 px-2.5 sm:px-3 py-1 rounded-lg border border-stone-300 shadow-2xs">
              <span className="capitalize">
                {filters.sortBy === 'price-low' && 'Low-High'}
                {filters.sortBy === 'price-high' && 'High-Low'}
                {filters.sortBy === 'rating' && 'Top Rated'}
              </span>
              <button
                onClick={() => setFilters({ ...filters, sortBy: 'featured' })}
                className="hover:text-stone-950 ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto my-12 border border-stone-300/80">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-2">
            No matching products
          </h3>
          <p className="text-xs text-stone-600 mb-5">
            We couldn't find any shoes matching your selected filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Products Grid: 2 columns on mobile, 4 columns on desktop with uniform card sizing */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 items-stretch auto-rows-fr">
            {paginatedProducts.map((product) => {
              const currentColor = product.colors[0];
              const displayBadge = formatBadge(product.badge);

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product, currentColor)}
                  className="group product-card bg-white border border-stone-200/90 rounded-[.666rem] flex flex-col justify-between cursor-pointer active:scale-[0.99] transition-all duration-200 select-none relative overflow-hidden"
                  style={{ borderRadius: '.666rem' }}
                >
                  {/* Minimal Luxury Badge in top-left overlaid */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-10 flex items-center justify-between pointer-events-none">
                    {displayBadge ? (
                      <span className="bg-[#e7e3d9]/90 backdrop-blur-xs text-stone-800 text-[10px] sm:text-[10.5px] font-bold tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg uppercase inline-block leading-none shadow-2xs">
                        {displayBadge}
                      </span>
                    ) : (
                      <span />
                    )}

                    {(product.isOutOfStock || (product.stock !== undefined && product.stock <= 0)) && (
                      <span className="bg-rose-600 text-white text-[9px] sm:text-[9.5px] font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg uppercase leading-none shadow-2xs">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Main Footwear Product Image - Full bleed on top, left, and right with zero gap/margin/padding */}
                  <div className="w-full aspect-square bg-[#faf8f5] flex items-center justify-center relative overflow-hidden">
                    <img
                      src={currentColor.image}
                      alt={`${product.name} - ${currentColor.name}`}
                      className={`w-full h-full object-cover select-none ${
                        (product.isOutOfStock || (product.stock !== undefined && product.stock <= 0))
                          ? 'opacity-70 grayscale-[25%]'
                          : ''
                      }`}
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info Block - only bottom space */}
                  <div className="flex flex-col text-left px-3 sm:px-4 pb-3.5 sm:pb-4 pt-2.5 sm:pt-3 mt-auto">
                    <h3
                      className="text-[11.5px] sm:text-[13.5px] md:text-[14px] font-bold tracking-wider text-stone-900 uppercase leading-snug truncate"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <p className="text-[10.5px] sm:text-[12px] text-stone-500 font-medium leading-snug mt-0.5 truncate">
                      {currentColor.name}
                    </p>

                    {/* Price Row */}
                    <div className="flex items-baseline mt-1 sm:mt-1.5">
                      <span className="text-[11.5px] sm:text-[13.5px] md:text-[14px] font-bold text-stone-900 leading-snug">
                        {formatTaka(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal & Premium Pagination Bar */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              {/* Product Counter / Page Status */}
              <div className="text-[11px] sm:text-[13px] font-medium tracking-[0.1em] uppercase text-stone-600">
                SHOWING{' '}
                <span className="font-bold text-stone-900">
                  {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                </span>{' '}
                OF{' '}
                <span className="font-bold text-stone-900">
                  {filteredProducts.length}
                </span>{' '}
                PRODUCTS
              </div>

              {/* Minimal Pagination Controls */}
              <div className="flex items-center space-x-1.5 sm:space-x-3">
                {/* PREVIOUS Button */}
                <button
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className="group inline-flex items-center space-x-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-stone-900 text-stone-900 bg-transparent hover:bg-stone-900 hover:text-white active:scale-95 transition-all duration-200 text-[11px] sm:text-[12px] font-bold tracking-[0.14em] uppercase disabled:opacity-30 disabled:border-stone-400 disabled:pointer-events-none cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                  <span>PREV</span>
                </button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center space-x-1 px-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={`page-btn-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-[12px] sm:text-[13px] font-bold tracking-tight flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-stone-900 text-white shadow-xs scale-105'
                            : 'text-stone-700 hover:text-stone-950 hover:bg-stone-300/50'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* NEXT Button */}
                <button
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className="group inline-flex items-center space-x-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-stone-900 text-stone-900 bg-transparent hover:bg-stone-900 hover:text-white active:scale-95 transition-all duration-200 text-[11px] sm:text-[12px] font-bold tracking-[0.14em] uppercase disabled:opacity-30 disabled:border-stone-400 disabled:pointer-events-none cursor-pointer"
                  aria-label="Next Page"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};



