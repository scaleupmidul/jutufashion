import React, { useState, useEffect } from 'react';
import { PageView, LifestylePhotoItem } from '../types';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

interface LifestylePhotoStripProps {
  onNavigate?: (view: PageView) => void;
}

export const LifestylePhotoStrip: React.FC<LifestylePhotoStripProps> = ({ onNavigate }) => {
  const [photos, setPhotos] = useState<LifestylePhotoItem[]>(() => {
    const content = getStoredPagesContent();
    return content.lifestylePhotos && content.lifestylePhotos.length > 0
      ? content.lifestylePhotos
      : [
          {
            id: 'photo-1',
            src: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
            alt: 'JUTU Comfort Slides on concrete',
            view: 'shop-all',
          },
          {
            id: 'photo-2',
            src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            alt: 'Smiling woman wearing JUTU apparel in nature',
            view: 'shop-all',
          },
          {
            id: 'photo-3',
            src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
            alt: 'Casual lifestyle with JUTU slip-on shoes',
            view: 'shop-all',
          },
          {
            id: 'photo-4',
            src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
            alt: 'White socks and JUTU sneakers stepping outdoors',
            view: 'shop-all',
          },
        ];
  });

  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredPagesContent();
      if (updated.lifestylePhotos && updated.lifestylePhotos.length > 0) {
        setPhotos(updated.lifestylePhotos);
      }
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  if (!photos || photos.length === 0) return null;

  // Determine grid columns dynamically based on item count
  const getGridColsClass = () => {
    if (photos.length === 1) return 'grid-cols-1 max-w-xl mx-auto';
    if (photos.length === 2) return 'grid-cols-2';
    if (photos.length === 3) return 'grid-cols-1 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4';
  };

  return (
    <section className="w-full px-3 sm:px-4 md:px-5 py-3 sm:py-5" aria-label="Lifestyle Photo Gallery">
      <div className={`grid ${getGridColsClass()} gap-3 sm:gap-4 rounded-2xl overflow-hidden`}>
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => onNavigate && onNavigate(photo.view || 'shop-all')}
            className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl bg-stone-100 cursor-pointer shadow-xs border border-stone-200/60"
          >
            <img
              src={photo.src}
              alt={photo.alt || 'JUTU Footwear Lifestyle'}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-end p-3">
              {photo.alt && (
                <span className="text-[10px] text-white font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate max-w-full">
                  {photo.alt}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

