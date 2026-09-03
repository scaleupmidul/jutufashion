import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>(() => getStoredPagesContent().announcements);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleSync = () => {
      setAnnouncements(getStoredPagesContent().announcements);
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  if (!announcements.length) return null;

  return (
    <div className="bg-[#111111] text-white py-2 px-3 sm:px-6 text-[11px] sm:text-xs font-normal tracking-wide relative flex items-center justify-center select-none z-30">
      {announcements.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 p-1 text-stone-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="text-center truncate px-8 max-w-2xl">
        <span className="tracking-wider">{announcements[currentIndex % announcements.length]}</span>
      </div>

      {announcements.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 p-1 text-stone-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

