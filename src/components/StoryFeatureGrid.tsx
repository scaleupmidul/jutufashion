import React from 'react';
import { PageView } from '../types';

interface StoryFeatureGridProps {
  onNavigate: (view: PageView) => void;
}

export const StoryFeatureGrid: React.FC<StoryFeatureGridProps> = ({ onNavigate }) => {
  return (
    <section className="w-full px-3 sm:px-4 md:px-5 py-4 sm:py-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Story Card 1: Summer Travel Essentials (Green slide sandals) */}
        <div className="group relative h-[440px] sm:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between p-6 sm:p-7">
          <img
            src="https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=85"
            alt="Summer Travel Essentials - Green JUTU Slides"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

          {/* Top Title */}
          <div className="relative z-10 text-center pt-2 sm:pt-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Summer Travel Essentials
            </h2>
          </div>

          {/* Bottom Action Buttons: Translucent Pill style with thin border */}
          <div className="relative z-10 flex items-center justify-center space-x-2.5 sm:space-x-3 w-full max-w-xs mx-auto pb-1">
            <button
              onClick={() => onNavigate('men')}
              className="flex-1 bg-black/40 hover:bg-black/60 active:scale-95 text-white border border-white/70 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 backdrop-blur-xs shadow-xs focus:outline-none cursor-pointer"
            >
              SHOP MEN
            </button>
            <button
              onClick={() => onNavigate('women')}
              className="flex-1 bg-black/40 hover:bg-black/60 active:scale-95 text-white border border-white/70 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 backdrop-blur-xs shadow-xs focus:outline-none cursor-pointer"
            >
              SHOP WOMEN
            </button>
          </div>
        </div>

        {/* Story Card 2: New Arrivals (Bridge model in white pants & red shoes) */}
        <div className="group relative h-[440px] sm:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between p-6 sm:p-7">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
            alt="New Arrivals on Rope Bridge"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

          {/* Top Title */}
          <div className="relative z-10 text-center pt-2 sm:pt-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              New Arrivals
            </h2>
          </div>

          {/* Bottom Action Buttons */}
          <div className="relative z-10 flex items-center justify-center space-x-2.5 sm:space-x-3 w-full max-w-xs mx-auto pb-1">
            <button
              onClick={() => onNavigate('men')}
              className="flex-1 bg-black/40 hover:bg-black/60 active:scale-95 text-white border border-white/70 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 backdrop-blur-xs shadow-xs focus:outline-none cursor-pointer"
            >
              SHOP MEN
            </button>
            <button
              onClick={() => onNavigate('women')}
              className="flex-1 bg-black/40 hover:bg-black/60 active:scale-95 text-white border border-white/70 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 backdrop-blur-xs shadow-xs focus:outline-none cursor-pointer"
            >
              SHOP WOMEN
            </button>
          </div>
        </div>

        {/* Story Card 3: Fresh Colors For Summer (Person with white socks by beach/rocks) */}
        <div className="group relative h-[440px] sm:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between p-6 sm:p-7">
          <img
            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85"
            alt="Fresh Colors For Summer by Seaside Rocks"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

          {/* Top Title */}
          <div className="relative z-10 text-center pt-2 sm:pt-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Fresh Colors For Summer
            </h2>
          </div>

          {/* Bottom Action Button: 1 Pill Button for Women */}
          <div className="relative z-10 flex items-center justify-center w-full max-w-[180px] mx-auto pb-1">
            <button
              onClick={() => onNavigate('women')}
              className="w-full bg-black/40 hover:bg-black/60 active:scale-95 text-white border border-white/70 py-2 sm:py-2.5 px-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 backdrop-blur-xs shadow-xs focus:outline-none cursor-pointer"
            >
              SHOP WOMEN
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
