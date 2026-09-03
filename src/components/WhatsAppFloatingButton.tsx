import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreSettings } from '../types';

interface WhatsAppFloatingButtonProps {
  settings?: StoreSettings;
  currentView?: string;
}

export function formatWhatsAppUrl(phoneNumber?: string, defaultMessage?: string): string {
  if (!phoneNumber) return '';
  const digits = phoneNumber.replace(/[^0-9]/g, '');
  if (!digits) return '';

  let formatted = digits;
  if (formatted.startsWith('880')) {
    // Already in 880 format
  } else if (formatted.startsWith('0')) {
    formatted = '88' + formatted;
  } else if (formatted.length === 10 || formatted.length === 11) {
    formatted = '880' + formatted.replace(/^0+/, '');
  }

  const textParam = defaultMessage ? `?text=${encodeURIComponent(defaultMessage)}` : '';
  return `https://wa.me/${formatted}${textParam}`;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings, currentView }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Check if enabled
  const isEnabled = settings?.enableWhatsAppFloating !== false;
  const phoneNumber = settings?.whatsappFloatingNumber || settings?.whatsappNumber || '+880 1900-000000';
  const defaultMessage = settings?.whatsappDefaultMessage || 'Hello JUTU Footwear, I would like to know more about your products.';
  const buttonLabel = settings?.whatsappButtonLabel || 'Chat with us';

  // Visibility logic:
  // If on confirmation / thank you page, do not show WhatsApp at all
  if (currentView === 'confirmation') {
    return null;
  }

  // On Home page ('home' / default): hide during hero section (window.scrollY <= 320px) and show when scrolled down.
  // On all other pages (shop, product detail, cart, checkout, legal, story, contact, etc.): show normally immediately (always visible).
  useEffect(() => {
    const isHomePage = currentView === 'home' || !currentView;

    if (!isHomePage) {
      // Non-home pages: always visible immediately
      setIsVisible(true);
      return;
    }

    // Home page: hide in hero section (top 320px), show smoothly when scrolled past hero
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  if (!isEnabled) {
    return null;
  }

  const targetUrl = formatWhatsAppUrl(phoneNumber, defaultMessage);
  if (!targetUrl) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="floating-whatsapp-container"
          initial={{ opacity: 0, scale: 0.7, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center group select-none"
          id="floating-whatsapp-container"
        >
          {/* Interactive Tooltip / Prompt bubble on Desktop */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex items-center mr-3 bg-white/95 backdrop-blur-xs text-stone-800 text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-lg border border-stone-200/90 space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{buttonLabel}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                  className="text-stone-400 hover:text-stone-700 ml-1 p-0.5 rounded-full hover:bg-stone-100 transition-colors"
                  title="Dismiss"
                  aria-label="Dismiss tooltip"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main WhatsApp Action Button with subtle, gentle icon pulse/vibration */}
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-whatsapp-btn"
            className="relative w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
            aria-label="Chat with us on WhatsApp"
            title="Chat with us on WhatsApp"
          >
            {/* Gentle, soft glowing outer aura (reduced scale, ultra-smooth) */}
            <span className="absolute -inset-0.5 rounded-full bg-[#25D366]/25 animate-pulse pointer-events-none"></span>

            {/* WhatsApp Vector Logo with smooth micro-vibration/nudge */}
            <motion.svg
              animate={{
                rotate: [0, -4, 4, -3, 3, 0],
                scale: [1, 1.04, 1, 1.03, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: 'easeInOut',
              }}
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 fill-white relative z-10 origin-center"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.31z" />
            </motion.svg>

            {/* Small live notification badge */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-white rounded-full"></span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

