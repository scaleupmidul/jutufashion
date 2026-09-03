import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageView } from '../types';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

interface HeroBannerProps {
  onNavigate: (view: PageView) => void;
}

const AUTO_PLAY_INTERVAL = 5000; // Exact 5 seconds interval per slide

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  const [slides, setSlides] = useState(() => getStoredPagesContent().heroSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setSlides(getStoredPagesContent().heroSlides);
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  // Preload all slide images on mount for instant zero-lag rendering
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, AUTO_PLAY_INTERVAL);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      resetTimer();
    }
  }, [slides.length, resetTimer]);

  const prevSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      resetTimer();
    }
  }, [slides.length, resetTimer]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetTimer();
  };

  // Continuous uninterrupted 5-second auto-slide
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Touch & Mouse Drag Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setDragStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setDragStartX(null);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setDragStartX(null);
    setIsDragging(false);
  };

  if (!slides || !slides.length) return null;

  return (
    <section
      className="relative w-full p-0 m-0 select-none cursor-grab active:cursor-grabbing"
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Collection Carousel"
    >
      <div className="relative w-full h-[calc(100svh-56px)] sm:h-[calc(100vh-60px)] min-h-[500px] sm:min-h-[580px] bg-stone-100 overflow-hidden">
        
        {/* Slides Container */}
        {slides.map((slide, index) => {
          const isActive = index === (currentIndex % slides.length);
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* High-Resolution Background Image */}
              <img
                src={slide.image}
                alt={slide.title.replace('\n', ' ')}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding={index === 0 ? 'sync' : 'async'}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04]"
              />

              {/* Ambient Vignette & Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:bg-gradient-to-l sm:from-black/80 sm:via-black/35 sm:to-transparent pointer-events-none" />

              {/* Text & Action Buttons Overlay */}
              <div className="relative z-20 w-full h-full flex items-end justify-end">
                <div className="max-w-[540px] p-5 sm:p-10 md:p-14 text-right flex flex-col items-end pb-8 sm:pb-12">
                  
                  {/* Eyebrow Label */}
                  <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/95 uppercase mb-1.5 sm:mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {slide.eyebrow}
                  </p>

                  {/* Main Headline */}
                  <h1 className="font-serif text-[26px] sm:text-3xl md:text-[38px] lg:text-[42px] text-white font-normal leading-[1.14] tracking-tight mb-4 sm:mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-pre-line">
                    {slide.title}
                  </h1>

                  {/* Call to Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate((slide.primaryActionView as PageView) || 'men');
                      }}
                      className="bg-white text-stone-950 hover:bg-stone-100 active:scale-95 px-4.5 sm:px-6 py-2.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold tracking-[0.12em] uppercase transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none cursor-pointer min-h-[40px] flex items-center justify-center border border-white"
                    >
                      {slide.primaryActionLabel}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate((slide.secondaryActionView as PageView) || 'women');
                      }}
                      className="bg-white text-stone-950 hover:bg-stone-100 active:scale-95 px-4.5 sm:px-6 py-2.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold tracking-[0.12em] uppercase transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none cursor-pointer min-h-[40px] flex items-center justify-center border border-white"
                    >
                      {slide.secondaryActionLabel}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* Minimal Slide Progress Indicators (Hidden on mobile/phone) */}
        {slides.length > 1 && (
          <div className="hidden sm:flex absolute bottom-5 left-10 z-30 items-center space-x-2">
            {slides.map((slide, idx) => {
              const isActive = idx === (currentIndex % slides.length);
              return (
                <button
                  key={slide.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="py-2.5 px-0.5 focus:outline-none cursor-pointer"
                >
                  <div
                    className={`h-1.5 rounded-md transition-all duration-500 overflow-hidden ${
                      isActive ? 'w-7 sm:w-10 bg-white shadow-xs' : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
