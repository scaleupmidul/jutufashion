import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { getStoredProducts, STORE_SYNC_EVENT } from '../data/adminStore';
import { formatTaka } from '../utils/currency';
import { trackSearch } from '../utils/metaTracker';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product, color?: ProductColor) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [productsList, setProductsList] = useState<Product[]>(() => getStoredProducts());

  useEffect(() => {
    const handleSync = () => {
      setProductsList(getStoredProducts());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const trendingTags = ['Runner NZ', 'Tree Dasher', 'Canvas Cruiser', 'Slides', 'Wool Lounger', 'Black Sneakers'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q))
    );
  }, [query, productsList]);

  // Track search with slight debounce
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;
    const timer = setTimeout(() => {
      trackSearch(query.trim(), results.length);
    }, 600);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-2 sm:pt-24 px-2 sm:px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scaleIn border border-stone-100 mt-2 sm:mt-0">
        
        {/* Search Header */}
        <div className="p-3.5 sm:p-5 border-b border-stone-200 flex items-center space-x-2.5 sm:space-x-3">
          <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shoes, materials, collections..."
            autoFocus
            className="w-full text-base sm:text-base text-stone-900 placeholder:text-stone-400/40 placeholder:font-normal focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Content */}
        <div className="p-4 sm:p-5 max-h-[75vh] sm:max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold tracking-wider uppercase text-stone-500 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="border-t border-stone-200/80 pt-3.5">
                <h4 className="text-xs font-bold tracking-wider uppercase text-stone-500 mb-2.5">
                  Popular Styles
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {productsList.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="group product-card flex items-center space-x-2.5 p-2.5 rounded-[.666rem] bg-white active:bg-stone-50 cursor-pointer transition-all border border-stone-200/90"
                        style={{ borderRadius: '.666rem' }}
                      >
                      <img
                        src={p.colors[0].image}
                        alt={p.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-white rounded-lg p-0.5"
                      />
                      <div className="overflow-hidden min-w-0">
                        <p className="text-[11px] sm:text-xs font-bold text-stone-900 truncate uppercase tracking-wider">
                          {p.name}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-stone-600 font-bold">{formatTaka(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <p className="text-sm font-semibold mb-1">No products found for "{query}"</p>
              <p className="text-xs">Try searching for "Runner", "Dasher", "Wool", or "Slip-On"</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs font-semibold text-stone-500 mb-2">
                {results.length} products found
              </p>
              {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-[.666rem] product-card bg-white active:bg-stone-50 cursor-pointer border border-stone-200/90 transition-all group"
                    style={{ borderRadius: '.666rem' }}
                  >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.colors[0].image}
                      alt={product.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain bg-white rounded-lg p-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider group-hover:text-stone-600 transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                        {product.colors.length} colorways • <span className="font-bold text-stone-900">{formatTaka(product.price)}</span>
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
