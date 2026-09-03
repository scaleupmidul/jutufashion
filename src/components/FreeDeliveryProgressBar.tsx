import React, { useState, useEffect } from 'react';
import { Truck, Check } from 'lucide-react';
import { formatTaka } from '../utils/currency';
import { getPaymentConfig, getStoredSettings, STORE_SYNC_EVENT } from '../data/adminStore';

interface FreeDeliveryProgressBarProps {
  subtotal: number;
  threshold?: number;
  className?: string;
  variant?: 'drawer' | 'card';
}

export const FreeDeliveryProgressBar: React.FC<FreeDeliveryProgressBarProps> = ({
  subtotal,
  threshold,
  className = '',
  variant = 'drawer',
}) => {
  const [storeSettings, setStoreSettings] = useState(getStoredSettings());
  const [paymentConfig, setPaymentConfig] = useState(getPaymentConfig());

  useEffect(() => {
    const handleSync = () => {
      setStoreSettings(getStoredSettings());
      setPaymentConfig(getPaymentConfig());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const isFreeDeliveryAll = Boolean(paymentConfig.freeDelivery?.enabled !== false);
  const isFreeShippingRuleEnabled = storeSettings.freeShippingEnabled !== false;

  const targetThreshold = (threshold !== undefined && threshold > 0)
    ? threshold
    : (storeSettings.freeShippingThreshold > 0 ? storeSettings.freeShippingThreshold : 2000);

  const remaining = Math.max(0, targetThreshold - subtotal);
  const progress = Math.min(100, Math.max(0, (subtotal / targetThreshold) * 100));
  const isUnlocked = isFreeDeliveryAll || (isFreeShippingRuleEnabled && remaining === 0);

  // If Payment Info free delivery is NOT active, and Free Shipping Rule in Logistics & Rates is DISABLED, hide bar
  if (!isFreeDeliveryAll && !isFreeShippingRuleEnabled) {
    return null;
  }

  const containerClasses =
    variant === 'drawer'
      ? `bg-white/80 backdrop-blur-xs border-b border-[#e5e0d8] px-4 sm:px-6 py-3 sm:py-3.5 select-none ${className}`
      : `bg-white border border-[#e5e0d8] rounded-2xl p-4 sm:p-5 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`;

  if (isFreeDeliveryAll) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-emerald-100/80 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-800 stroke-[2.5]" />
            </div>
            <p className="text-[12px] sm:text-[12.5px] font-semibold text-stone-900 leading-none truncate">
              {paymentConfig.freeDelivery?.text || 'Free Delivery All Over Bangladesh'}
            </p>
          </div>
          <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/80 shrink-0">
            FREE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Top Row: Minimal Luxury Typography */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-[#f4f0eb] text-stone-800'}`}>
            {isUnlocked ? (
              <Check className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <Truck className="w-3 h-3 stroke-[1.8]" />
            )}
          </div>

          <p className="text-[12px] sm:text-[12.5px] text-stone-600 font-normal leading-none truncate">
            {isUnlocked ? (
              <span className="font-semibold text-emerald-900">
                🎉 Free Delivery Unlocked (All Over Bangladesh)
              </span>
            ) : (
              <>
                Add <span className="font-semibold text-stone-900">{formatTaka(remaining)}</span> for{' '}
                <span className="font-medium text-stone-900">Free Delivery</span>
              </>
            )}
          </p>
        </div>

        {/* Target goal text */}
        <span className="text-[11px] font-medium text-stone-400 tabular-nums shrink-0 tracking-wider uppercase">
          {isUnlocked ? 'FREE' : `Goal: ${formatTaka(targetThreshold)}`}
        </span>
      </div>

      {/* Sleek Ultra-Thin Minimal Progress Track */}
      <div className="w-full h-1.5 bg-[#f0ebe3] rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${isUnlocked ? 'bg-emerald-600' : 'bg-stone-900'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

