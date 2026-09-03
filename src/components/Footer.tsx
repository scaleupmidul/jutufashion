import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Check 
} from 'lucide-react';
import { PageView } from '../types';
import { getStoredSettings, STORE_SYNC_EVENT } from '../data/adminStore';

interface FooterProps {
  onNavigate: (view: PageView, section?: 'refund' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState(() => getStoredSettings());

  useEffect(() => {
    const handleSync = () => {
      setSettings(getStoredSettings());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#191919] text-white pt-12 pb-8 border-t border-stone-800">
      <div className="w-full px-4 sm:px-6 md:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-stone-800/80">
          
          {/* Left Column: Email Newsletter & Socials */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Newsletter */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-white mb-2.5 sm:mb-3">
                SUBSCRIBE TO OUR EMAILS
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex items-center w-full max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full bg-white text-stone-900 placeholder:text-stone-400/50 placeholder:font-normal text-[13px] sm:text-xs h-9 sm:h-10 pl-3.5 sm:pl-4 pr-22 sm:pr-24 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:ring-0 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 sm:right-1.5 bg-[#191919] hover:bg-black active:bg-stone-800 text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-3.5 sm:px-4 h-7 sm:h-7.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  {subscribed ? (
                    <span className="flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>JOINED</span>
                    </span>
                  ) : (
                    'SIGN UP'
                  )}
                </button>
              </form>
              {subscribed && (
                <p className="text-emerald-400 text-xs mt-2 animate-fadeIn">
                  Thanks for subscribing! Check your inbox for updates.
                </p>
              )}
            </div>

            {/* Social Icons with 40px touch targets */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-white mb-2.5 sm:mb-3">
                FOLLOW US
              </h4>
              <div className="flex items-center space-x-3">
                <a
                  href={settings?.facebookUrl || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl border border-stone-600 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={settings?.instagramUrl || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl border border-stone-600 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings?.tiktokUrl || "https://tiktok.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl border border-stone-600 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors group relative"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg 
                    className="w-3.5 h-3.5 fill-current" 
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                  </svg>
                </a>
                <a
                  href={settings?.youtubeUrl || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl border border-stone-600 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Columns: SHOP, ABOUT, PRESENCE */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
            
            {/* Shop Column */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-3">
                SHOP
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li>
                  <button onClick={() => onNavigate('men')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Men's Footwear
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('women')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Women's Footwear
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('new-arrivals')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shop-all')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Best Sellers
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-3">
                ABOUT
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li>
                  <button onClick={() => onNavigate('our-story')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Our Story
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact-us')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shoe-care')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Shoe Care Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('legal-policies', 'refund')} className="hover:text-white transition-colors text-left cursor-pointer py-0.5">
                    Size Exchange
                  </button>
                </li>
              </ul>
            </div>

            {/* Presence Column */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-white mb-3">
                PRESENCE
              </h4>
              <div className="space-y-2 text-xs text-stone-400 leading-relaxed">
                <p>{settings?.showroomAddress || 'Road 27, Banani R/A, Dhaka, Bangladesh'}</p>
                <p>
                  <a href={`tel:${settings?.supportPhone || '+8801900000000'}`} className="hover:text-white transition-colors inline-block py-0.5">
                    {settings?.supportPhone || '+880 1900-000000'}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${settings?.supportEmail || 'care@jutufootwear.com'}`} className="hover:text-white transition-colors inline-block py-0.5">
                    {settings?.supportEmail || 'care@jutufootwear.com'}
                  </a>
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Policy & Copyright Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-400 gap-3">
          <div>
            <span>{settings?.copyrightText || '© 2026 JUTU Inc. All Rights Reserved.'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            <button onClick={() => onNavigate('legal-policies', 'refund')} className="hover:text-white transition-colors cursor-pointer">Refund policy</button>
            <button onClick={() => onNavigate('legal-policies', 'privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy policy</button>
            <button onClick={() => onNavigate('legal-policies', 'terms')} className="hover:text-white transition-colors cursor-pointer">Terms of service</button>
          </div>
        </div>

      </div>
    </footer>
  );
};

