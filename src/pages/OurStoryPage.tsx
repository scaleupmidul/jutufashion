import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ArrowRight, Sparkles, Feather, ShieldCheck, HeartHandshake } from 'lucide-react';
import { PageView } from '../types';
import { getStoredPagesContent, STORE_SYNC_EVENT } from '../data/adminStore';

interface OurStoryPageProps {
  onNavigate: (view: PageView) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate }) => {
  const [storyContent, setStoryContent] = useState(() => {
    const content = getStoredPagesContent();
    return content.ourStory || {
      eyebrow: 'THE JUTU PHILOSOPHY',
      title: 'Crafted for Movement, Designed for Living.',
      lead: "We started with a simple belief: daily footwear shouldn't force you to choose between timeless sophistication and unrestrained, cloud-like comfort.",
      heroImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1800&q=85',
      chapter1Image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
      founderQuote: "We don't make shoes for runways. We make shoes for the 10,000 steps you take every day.",
      founderName: 'Midul Hasan — Founder & Lead Designer',
      stat1Number: '100%',
      stat1Label: 'Natural Comfort Priority',
      stat2Number: '0.0%',
      stat2Label: 'Break-in Discomfort',
      stat3Number: '70+',
      stat3Label: 'Comfort Testing Iterations',
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleSync = () => {
      const updated = getStoredPagesContent();
      if (updated.ourStory) {
        setStoryContent(updated.ourStory);
      }
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const heroImg = storyContent.heroImage || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1800&q=85';
  const chapter1Img = storyContent.chapter1Image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85';

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
            <span className="font-semibold text-stone-800">Our Story</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Editorial Headline & Visual Cover */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-3">
        <div className="bg-[#f3eee7] border border-stone-300/80 rounded-3xl p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden shadow-xs">
          
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-stone-500 block mb-3">
              {storyContent.eyebrow || 'THE JUTU PHILOSOPHY'}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-900 font-normal tracking-tight leading-[1.12]">
              {storyContent.title || 'Crafted for Movement, Designed for Living.'}
            </h1>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
              {storyContent.lead || "We started with a simple belief: daily footwear shouldn't force you to choose between timeless sophistication and unrestrained, cloud-like comfort."}
            </p>
          </div>

          <div className="mt-10 sm:mt-14 rounded-2xl overflow-hidden shadow-md aspect-[16/9] sm:aspect-[21/9] max-w-5xl mx-auto relative bg-stone-200">
            <img
              src={heroImg}
              alt="Footwear Artisanship & Precision Craft"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
          </div>

        </div>
      </div>

      {/* Chapter 01: The Genesis */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-12 sm:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#dfd9ce] text-stone-800 text-[11px] font-bold tracking-widest uppercase">
              <span>Chapter 01</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight leading-snug">
              Born from a frustration with stiff, unforgiving shoes.
            </h2>
            <div className="space-y-4 text-stone-600 text-xs sm:text-sm leading-relaxed">
              <p>
                In 2023, we looked around and realized a universal dilemma: traditional formal and casual footwear looked great in the box, but punished your feet by 2:00 PM. Meanwhile, athletic sneakers had cushion, but lacked the understated elegance needed for executive boardrooms, weekend brunches, and evening dinners.
              </p>
              <p>
                We set out to bridge this gap. Working closely with heritage master cobblers and ergonomic footwear designers, we developed proprietary cushioning footbeds wrapped in velvety supple leathers and breathable textiles.
              </p>
              <p className="font-medium text-stone-900">
                The result? Footwear that feels broken-in from minute one, without sacrificing an ounce of silhouette purity.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-stone-300/80 shadow-xs aspect-[4/4] bg-stone-200">
              <img
                src={chapter1Img}
                alt="Everyday Comfort and Style"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-1">
                  Zero Break-In Period
                </span>
                <p className="font-serif text-sm sm:text-base text-stone-900 italic">
                  "Step in and step out. No blister pads, no stiff leather trauma."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-16 sm:mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-stone-500 block mb-2">
            HOW WE BUILD
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Our Three Uncompromising Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bg-[#f3eee7] border border-stone-300/80 rounded-3xl p-8 flex flex-col justify-between hover:border-stone-400 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-900 mb-6 shadow-2xs">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 mb-3 font-normal">
                Ultralight Ergonomics
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Engineered with high-density EVA midsole layers and anatomical arch contouring that absorb shock and return kinetic energy with every stride.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-300/60 text-[11px] font-bold tracking-wider uppercase text-stone-500">
              01 / Cloud Cushioning
            </div>
          </div>

          <div className="bg-[#f3eee7] border border-stone-300/80 rounded-3xl p-8 flex flex-col justify-between hover:border-stone-400 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-900 mb-6 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 mb-3 font-normal">
                Mindful Selection
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Hand-inspected premium grade leathers, organic canvas linings, and durable anti-slip rubber outsoles built to withstand humid urban climates.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-300/60 text-[11px] font-bold tracking-wider uppercase text-stone-500">
              02 / Material Integrity
            </div>
          </div>

          <div className="bg-[#f3eee7] border border-stone-300/80 rounded-3xl p-8 flex flex-col justify-between hover:border-stone-400 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-900 mb-6 shadow-2xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 mb-3 font-normal">
                Direct to You
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                By designing in-house and delivering straight from our workshop to your doorstep, we eliminate distributor markups and pass pure value to you.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-300/60 text-[11px] font-bold tracking-wider uppercase text-stone-500">
              03 / Honest Value
            </div>
          </div>

        </div>
      </div>

      {/* Quote / Editorial Manifesto Block */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-16 sm:mt-24">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-14 lg:p-18 text-center relative overflow-hidden shadow-md">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-stone-400">
              OUR PROMISE
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-100 font-normal leading-snug">
              "{storyContent.founderQuote || "We don't make shoes for runways. We make shoes for the 10,000 steps you take every day."}"
            </blockquote>
            <div className="pt-4 text-xs font-semibold tracking-widest uppercase text-stone-400">
              — {storyContent.founderName || 'The Craft & Design Atelier, Dhaka'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-12 sm:mt-16">
        <div className="bg-[#dfd9ce] border border-stone-300/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">
              Experience the difference yourself.
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Explore our full collection with 7-day hassle-free size exchange and nationwide cash on delivery.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop-all')}
            className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 active:scale-98 text-white px-6 py-3.5 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default OurStoryPage;

