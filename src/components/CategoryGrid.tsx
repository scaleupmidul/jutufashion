import React, { useState, useEffect } from 'react';
import { PageView, CategoryCardItem } from '../types';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

interface CategoryGridProps {
  onNavigate: (view: PageView) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<CategoryCardItem[]>(() => {
    const content = getStoredPagesContent();
    return content.categoryCards && content.categoryCards.length > 0
      ? content.categoryCards
      : [
          {
            id: 'cat-new-arrivals',
            title: 'NEW ARRIVALS',
            bgColor: '#5b7588',
            view: 'new-arrivals',
            shoeImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
            alt: 'New Arrivals Shoe',
          },
          {
            id: 'cat-mens',
            title: 'MENS',
            bgColor: '#5a5d5d',
            view: 'men',
            shoeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            alt: 'Mens Collection Shoe',
          },
          {
            id: 'cat-womens',
            title: 'WOMENS',
            bgColor: '#8e6c71',
            view: 'women',
            shoeImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
            alt: 'Womens Collection Shoe',
          },
          {
            id: 'cat-best-sellers',
            title: 'BEST SELLERS',
            bgColor: '#788a7c',
            view: 'best-sellers',
            shoeImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
            alt: 'Best Sellers Shoe',
          },
        ];
  });

  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredPagesContent();
      if (updated.categoryCards && updated.categoryCards.length > 0) {
        setCategories(updated.categoryCards);
      }
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full px-2.5 sm:px-4 md:px-5 py-3 sm:py-5" aria-label="Featured Category Navigation">
      <div className={`grid grid-cols-2 ${categories.length >= 4 ? 'lg:grid-cols-4' : categories.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-2 sm:gap-3.5`}>
        {categories.map((cat, idx) => (
          <div
            key={cat.id || idx}
            onClick={() => onNavigate(cat.view)}
            className="group relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98] transition-all duration-200 flex flex-col items-center justify-end p-3.5 sm:p-6 select-none bg-stone-100"
            style={{ backgroundColor: cat.bgColor || '#5b7588' }}
          >
            {/* Full div cover image */}
            <img
              src={cat.shoeImage}
              alt={cat.alt || cat.title}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Subtle Contrast Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />

            {/* Editorial Luxury Centerpiece */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 sm:p-5 text-center pointer-events-none">
              {/* Main Category Title matching website typography */}
              <h3 className="text-white text-[13px] sm:text-[15px] md:text-[16.5px] font-bold tracking-[0.16em] uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none">
                {cat.title}
              </h3>

              {/* Subtext and interactive arrow link */}
              <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-stone-200 text-[8.5px] sm:text-[10px] font-medium tracking-[0.16em] uppercase leading-none">
                  EXPLORE
                </span>
                <span className="text-white text-[9.5px] sm:text-[11px] transform group-hover:translate-x-1 transition-transform duration-300">
                  &rarr;
                </span>
              </div>

              {/* Bottom animated accent underline on hover */}
              <div className="w-0 group-hover:w-12 h-[1px] bg-white/90 mt-2 transition-all duration-300 ease-out" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

