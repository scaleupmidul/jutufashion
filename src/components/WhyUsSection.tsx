import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  Layers, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Feather,
  HeartHandshake
} from 'lucide-react';
import { PageView } from '../types';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

interface WhyUsSectionProps {
  onNavigate?: (view: PageView) => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ onNavigate }) => {
  const [whyUsConfig, setWhyUsConfig] = useState(() => {
    const content = getStoredPagesContent();
    return content.whyUs || {
      badge: 'THE CRAFT & COMFORT',
      title: 'Why Choose Our Footwear',
      subtitle: 'We blend minimalist modern design with natural, breathable materials so your feet stay comfortable all day.',
      quote: 'Wildly comfortable from the very first step.',
      showcaseImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
      bottomCtaTitle: 'Ready to experience the comfort?',
      bottomCtaSubtitle: 'Explore our lightweight shoes and new arrivals.',
      bottomCtaBtn: 'Explore Collection',
      pillars: [
        {
          number: '01',
          title: 'Anatomic Cushioning',
          badge: 'ALL-DAY COMFORT',
          description: 'Contoured arch support and shock-absorbing soles for cloud-like comfort.',
          spec: 'High-density EVA',
          iconName: 'Sparkles',
        },
        {
          number: '02',
          title: 'Everyday Versatility',
          badge: 'DAILY ESSENTIALS',
          description: 'Easy slip-ons and lace-ups crafted for work, travel, and daily routines.',
          spec: 'Flexible Build',
          iconName: 'Compass',
        },
        {
          number: '03',
          title: 'Breathable & Durable',
          badge: 'CRAFTSMANSHIP',
          description: 'High-grade breathable uppers and non-slip outsoles engineered to last.',
          spec: 'Reinforced Weave',
          iconName: 'Layers',
        },
        {
          number: '04',
          title: 'Nationwide Delivery',
          badge: 'FAST SERVICE',
          description: 'Cash on Delivery across Bangladesh within 24–72 hours with sizing support.',
          spec: 'Fast Dispatch',
          iconName: 'Truck',
        },
      ],
    };
  });

  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredPagesContent();
      if (updated.whyUs) {
        setWhyUsConfig(updated.whyUs);
      }
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const getPillarIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'sparkles':
      case 'sparkle':
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />;
      case 'compass':
        return <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />;
      case 'layers':
      case 'feather':
        return <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />;
      case 'truck':
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />;
      case 'shield':
      case 'shieldcheck':
        return <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />;
      default:
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />;
    }
  };

  const showcaseImg = whyUsConfig.showcaseImage || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="w-full py-4 sm:py-10">
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] mx-auto">
        
        {/* Main Editorial Container */}
        <div className="w-full bg-white border border-stone-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
          
          {/* Top Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pt-1 sm:pt-2 pb-4 sm:pb-8 border-b border-stone-200 gap-2 sm:gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-stone-500 block pt-1 mb-1 sm:mb-2">
                {whyUsConfig.badge || 'THE CRAFT & COMFORT'}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight leading-tight">
                {whyUsConfig.title || 'Why Choose Our Footwear'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-stone-600 max-w-lg font-normal leading-relaxed">
              {whyUsConfig.subtitle || 'We blend minimalist modern design with natural, breathable materials so your feet stay comfortable all day.'}
            </p>
          </div>

          {/* Editorial Content Grid with Sticky Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-10 pt-4 sm:pt-10 items-start">
            
            {/* Left Lifestyle Visual Showcase - Sticky on scroll */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 z-10">
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-sm group bg-stone-100">
                <img
                  src={showcaseImg}
                  alt={whyUsConfig.title || 'Everyday Footwear Comfort in Motion'}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
                
                {/* Floating Bottom Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-transparent p-4 sm:p-5 text-white">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-stone-200">
                      Signature Promise
                    </span>
                  </div>
                  <p className="font-serif text-base sm:text-lg md:text-xl text-white font-medium leading-snug">
                    "{whyUsConfig.quote || 'Wildly comfortable from the very first step.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Pillars List - 1 column or 2 columns with generous vertical height to allow scrolling */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              {(whyUsConfig.pillars || []).map((item, idx) => (
                <div
                  key={item.number || idx}
                  className="bg-[#f8f6f3] border border-stone-200/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-[#f3efe8] hover:border-stone-300 transition-all duration-200 flex flex-col justify-between min-h-[160px] sm:min-h-[190px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="font-serif text-base sm:text-xl text-stone-400 font-normal">
                        {item.number || `0${idx + 1}`}
                      </span>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#faf8f5] flex items-center justify-center shadow-2xs">
                        {getPillarIcon(item.iconName)}
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                      {item.badge || item.title}
                    </span>
                    <h3 className="text-[13px] sm:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11.5px] sm:text-xs md:text-sm text-stone-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Call to Action Strip */}
      {onNavigate && (
        <div className="w-full bg-[#dfd9ce]/80 backdrop-blur-md border-y border-stone-300/80 py-3.5 sm:py-6 mt-4 sm:mt-8">
          <div className="w-[94%] sm:w-[90%] lg:w-[85%] mx-auto px-2 sm:px-0 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900">
                {whyUsConfig.bottomCtaTitle || 'Ready to experience the comfort?'}
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">
                {whyUsConfig.bottomCtaSubtitle || 'Explore our lightweight shoes and new arrivals.'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('shop-all')}
              className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 active:scale-98 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer shrink-0"
            >
              <span>{whyUsConfig.bottomCtaBtn || 'Explore Collection'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};



