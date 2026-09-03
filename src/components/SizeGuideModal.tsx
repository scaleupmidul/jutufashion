import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGender?: 'men' | 'women' | 'unisex';
  availableSizes?: number[];
  currentSelectedSize?: number;
  onSelectSize?: (size: number) => void;
}

// Precise standard foot length mapping (Heel to Toe) for each shoe size
const SIZE_TO_CM_MAP: Record<number, string> = {
  34: '21.5 cm',
  35: '22.0 cm',
  36: '22.5 cm',
  37: '23.5 cm',
  38: '24.0 cm',
  39: '25.0 cm',
  40: '25.5 cm',
  41: '26.0 cm',
  42: '26.5 cm',
  43: '27.5 cm',
  44: '28.5 cm',
  45: '29.5 cm',
  46: '30.0 cm',
  47: '30.5 cm',
  48: '31.0 cm',
  49: '31.5 cm',
  50: '32.0 cm',
};

function getFootLength(size: number): string {
  if (SIZE_TO_CM_MAP[size]) {
    return SIZE_TO_CM_MAP[size];
  }
  // Formula fallback for custom sizes outside standard range
  const approx = (22.0 + (size - 35) * 0.67).toFixed(1);
  return `${approx} cm`;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultGender = 'men',
  availableSizes,
  currentSelectedSize,
  onSelectSize,
}) => {
  const [gender, setGender] = useState<'men' | 'women'>(
    defaultGender === 'women' ? 'women' : 'men'
  );

  useEffect(() => {
    if (defaultGender === 'women') {
      setGender('women');
    } else {
      setGender('men');
    }
  }, [defaultGender]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // If availableSizes is passed (from product configured in admin), use it!
  // Otherwise fallback to standard default sizes by gender
  const fallbackSizes = gender === 'women' ? [36, 37, 38, 39, 40, 41] : [40, 41, 42, 43, 44, 45];
  const displaySizes = (availableSizes && availableSizes.length > 0)
    ? [...availableSizes].sort((a, b) => a - b)
    : fallbackSizes;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#faf8f5] rounded-2xl w-full max-w-sm flex flex-col shadow-2xl border border-stone-200/90 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-stone-200/80 bg-white">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight uppercase">
              Size Guide
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Select standard shoe size
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Measurement Explanation Note */}
          <div className="flex items-start space-x-2 p-2.5 bg-white rounded-xl border border-stone-200/90">
            <Info className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-stone-600">
              <span className="font-bold text-stone-900 block">সেন্টিমিটার (cm) মাপার নিয়ম:</span>
              পায়ের গোড়ালি থেকে দীর্ঘতম আঙুলের ডগা পর্যন্ত সোজা দৈর্ঘ্য (Heel to Toe Length)।
            </div>
          </div>

          {/* Size & Foot Length Grid (Dynamically rendered from backend/product sizes) */}
          <div className="grid grid-cols-3 gap-2 max-h-[260px] overflow-y-auto pr-0.5">
            {displaySizes.map((sizeNum) => {
              const isSelected = currentSelectedSize === sizeNum;
              const cmLength = getFootLength(sizeNum);
              return (
                <button
                  key={sizeNum}
                  type="button"
                  onClick={() => {
                    if (onSelectSize) {
                      onSelectSize(sizeNum);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[66px] ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-900 border-stone-200/90 hover:border-stone-400 active:scale-95'
                  }`}
                >
                  <span className="text-base font-extrabold leading-none">{sizeNum}</span>
                  <span
                    className={`text-[11px] font-semibold mt-1 ${
                      isSelected ? 'text-stone-300' : 'text-stone-600'
                    }`}
                  >
                    {cmLength}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white border-t border-stone-200/80 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">Tap to select size</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



