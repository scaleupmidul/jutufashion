import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Sparkles, Droplets, Sun, Wind, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

interface ShoeCarePageProps {
  onNavigate: (view: PageView) => void;
}

export const ShoeCarePage: React.FC<ShoeCarePageProps> = ({ onNavigate }) => {
  const [shoeCareContent, setShoeCareContent] = useState(() => {
    const content = getStoredPagesContent();
    return content.shoeCare || {
      title: 'Shoe Care & Longevity',
      subtitle: 'Essential rituals to keep your premium footwear looking fresh, breathable, and supportive for years to come.',
      heroImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80',
      quickTips: [
        { title: 'Gentle Surface Cleaning', desc: 'Use a soft damp microfiber cloth or a horsehair brush to remove loose surface dirt and road dust after daily wear. Avoid machine washing leather models.' },
        { title: 'Natural Air Drying', desc: 'If shoes get wet in rain or damp weather, air dry them naturally at room temperature. Never place them directly under hair dryers or heaters.' },
        { title: 'Leather Conditioning', desc: 'Apply a neutral leather balm or cream once every 2–3 months to nourish suppleness, prevent crease cracking, and preserve water-repellent qualities.' },
      ],
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleSync = () => {
      const updated = getStoredPagesContent();
      if (updated.shoeCare) {
        setShoeCareContent(updated.shoeCare);
      }
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const getTipIcon = (index: number) => {
    if (index === 0) return <Droplets className="w-5 h-5" />;
    if (index === 1) return <Wind className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-16 sm:pb-24 animate-fadeIn">
      
      {/* Breadcrumb Bar */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto pt-6 sm:pt-8 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <span className="cursor-pointer hover:underline" onClick={() => onNavigate('home')}>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-stone-800">Shoe Care Guide</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-3">
        <div className="bg-[#f3eee7] border border-stone-300/80 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-stone-500 block mb-2">
              LONGEVITY & MAINTENANCE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight">
              {shoeCareContent.title || 'Shoe Care & Longevity'}
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-stone-600 font-normal leading-relaxed">
              {shoeCareContent.subtitle || 'Essential rituals to keep your premium footwear looking fresh, breathable, and supportive for years to come.'}
            </p>
          </div>
          {shoeCareContent.heroImage && (
            <div className="mt-6 rounded-2xl overflow-hidden aspect-[21/9] max-h-64 sm:max-h-80 w-full bg-stone-200">
              <img
                src={shoeCareContent.heroImage}
                alt="Shoe Care and Longevity"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Care Grid */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-8 sm:mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {(shoeCareContent.quickTips || []).map((tip, idx) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-stone-400 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 mb-5">
                {getTipIcon(idx)}
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-normal mb-2">
                {tip.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-12 bg-[#dfd9ce] border border-stone-300/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-stone-800 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              Need personalized care advice for your specific shoe material?
            </span>
          </div>
          <button
            onClick={() => onNavigate('contact-us')}
            className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            Ask Our Atelier
          </button>
        </div>
      </div>

    </div>
  );
};

export default ShoeCarePage;

