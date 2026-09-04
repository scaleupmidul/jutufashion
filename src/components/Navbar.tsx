import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageView } from '../types';
import { getStoredSettings, STORE_SYNC_EVENT } from '../data/adminStore';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [settings?.headerLogoUrl]);

  useEffect(() => {
    const handleSync = () => {
      setSettings(getStoredSettings());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks: { label: string; view: PageView }[] = [
    { label: 'NEW ARRIVALS', view: 'new-arrivals' },
    { label: 'SHOP ALL', view: 'shop-all' },
    { label: 'MEN', view: 'men' },
    { label: 'WOMEN', view: 'women' },
  ];

  const handleMobileNav = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const desktopLogoHeight = settings?.desktopLogoHeight || 36;
  const mobileLogoHeight = settings?.mobileLogoHeight || 28;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#e5e0d8] w-full">
        <div className="relative w-full px-4 sm:px-8 md:px-10 lg:px-12 h-14 sm:h-15 flex items-center justify-between">
          
          {/* Mobile menu trigger with 44px touch target */}
          <div className="flex items-center lg:hidden z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 -ml-2 flex items-center justify-center text-stone-900 hover:text-stone-600 active:scale-95 transition-transform focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Brand Logo - Centered on Phone & Tablet, Left on Desktop */}
          <div className="flex items-center absolute lg:static left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 z-0">
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center justify-center focus:outline-none text-center lg:text-left cursor-pointer"
            >
              {settings?.headerLogoUrl && !logoError ? (
                <>
                  {/* Desktop Logo */}
                  <img
                    src={settings.headerLogoUrl}
                    alt={settings.storeName || 'JUTU'}
                    style={{ maxHeight: `${desktopLogoHeight}px` }}
                    onError={() => setLogoError(true)}
                    className="hidden lg:block object-contain group-hover:opacity-85 transition-opacity"
                  />
                  {/* Mobile & Tablet Logo */}
                  <img
                    src={settings.headerLogoUrl}
                    alt={settings.storeName || 'JUTU'}
                    style={{ maxHeight: `${mobileLogoHeight}px` }}
                    onError={() => setLogoError(true)}
                    className="lg:hidden object-contain group-hover:opacity-85 transition-opacity"
                  />
                </>
              ) : (
                <span className="font-sans font-black text-[22px] sm:text-[26px] lg:text-[30px] tracking-[0.18em] text-[#111111] uppercase leading-none select-none hover:opacity-80 transition-opacity">
                  {settings?.storeName || 'JUTU'}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <nav className="hidden lg:flex items-center space-x-7 md:space-x-9">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.view)}
                  className={`text-[12px] font-bold tracking-[0.06em] uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-black font-bold'
                      : 'text-[#1a1a1a] hover:text-stone-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search & Cart with 44px touch targets */}
          <div className="flex items-center space-x-1 sm:space-x-2 -mr-1">
            <button
              onClick={onOpenSearch}
              className="w-10 h-10 flex items-center justify-center text-[#1a1a1a] hover:text-stone-600 active:scale-95 transition-all focus:outline-none cursor-pointer"
              aria-label="Search collection"
              title="Search products"
            >
              <Search className="w-[19px] h-[19px] stroke-[1.8]" />
            </button>

            <button
              onClick={onOpenCart}
              className="w-10 h-10 flex items-center justify-center text-[#1a1a1a] hover:text-stone-600 active:scale-95 transition-all relative focus:outline-none cursor-pointer"
              aria-label="View Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-[19px] h-[19px] stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-center leading-none shadow-xs select-none pointer-events-none tabular-nums">
                  <span className="flex items-center justify-center">{cartCount}</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 top-[56px] sm:top-[60px] z-40 bg-white flex flex-col justify-between px-5 sm:px-6 py-6 sm:py-8 lg:hidden w-full h-[calc(100dvh-56px)] sm:h-[calc(100dvh-60px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleMobileNav(link.view)}
                    className={`text-left text-[13px] font-bold tracking-[0.08em] py-3.5 border-b border-stone-100 flex items-center justify-between uppercase transition-colors active:bg-stone-50 rounded-lg px-2 ${
                      isActive ? 'text-black font-extrabold' : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 px-2">
              <button 
                onClick={() => handleMobileNav('cart')}
                className="hover:underline font-bold text-stone-900 py-2"
              >
                View Bag ({cartCount})
              </button>
              <span className="text-[11px] text-stone-400">100% Sustainable</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

