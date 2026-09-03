import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Tag, 
  Check, 
  Truck 
} from 'lucide-react';
import { CartItem, PageView } from '../types';
import { UPSELL_ACCESSORIES, PRODUCTS } from '../data/products';
import { formatTaka } from '../utils/currency';
import { getStoredSettings, getPaymentConfig, STORE_SYNC_EVENT } from '../data/adminStore';
import { FreeDeliveryProgressBar } from '../components/FreeDeliveryProgressBar';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (view: PageView) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountAmount: number;
  onApplyDiscount: (code: string) => boolean;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  discountCode,
  setDiscountCode,
  discountAmount,
  onApplyDiscount,
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

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(discountCode !== '');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isUnconditionalFree = Boolean(paymentConfig.freeDelivery?.enabled !== false);
  const isThresholdFree = Boolean(
    storeSettings.freeShippingEnabled !== false &&
    subtotal >= (storeSettings.freeShippingThreshold || 2000)
  );
  const isFreeShipping = isUnconditionalFree || isThresholdFree;
  const defaultShippingCost = storeSettings.shippingDhaka || 80;
  const shippingCost = isFreeShipping ? 0 : defaultShippingCost;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const success = onApplyDiscount(promoInput.trim().toUpperCase());
    if (success) {
      setPromoSuccess(true);
      setDiscountCode(promoInput.trim().toUpperCase());
    } else {
      setPromoError('Invalid promo code. Try "SPRING20" or "EARTH"');
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full lg:w-[85%] mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-5 text-stone-400 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-2">Your Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
          Find your next everyday staple crafted with Merino wool, tree fiber, and bouncy sugarcane soles.
        </p>
        <button
          onClick={() => onNavigate('shop-all')}
          className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[85%] mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-12 animate-fadeIn min-h-[calc(100vh-280px)] mb-16 sm:mb-24">
      {/* Title */}
      <div className="mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl text-stone-900 uppercase tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 sm:mt-1">
            {items.reduce((acc, item) => acc + item.quantity, 0)} items in your sustainable bag
          </p>
        </div>
        <button
          onClick={() => onNavigate('shop-all')}
          className="text-xs font-bold text-stone-900 underline hover:text-stone-600 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      {/* Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
        
        {/* Left Column: Items (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          
          {/* Free Shipping Progress Bar */}
          <FreeDeliveryProgressBar
            subtotal={subtotal}
            threshold={storeSettings.freeShippingThreshold || 2000}
            variant="card"
          />

          {/* Items table */}
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-2xs"
              >
                {/* Image & Main Info */}
                <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f7f7f7] rounded-xl p-1.5 sm:p-2 flex-shrink-0 border border-stone-100 flex items-center justify-center">
                    <img
                      src={item.selectedColor.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-[11.5px] sm:text-xs text-stone-500 mt-0.5 truncate">
                      Color: <span className="font-medium text-stone-700">{item.selectedColor.name}</span>
                    </p>
                    <p className="text-[11.5px] sm:text-xs text-stone-500">
                      Size: <span className="font-medium text-stone-700">{item.selectedSize}</span>
                    </p>
                    <p className="text-xs font-bold text-stone-900 mt-1 sm:hidden">
                      {formatTaka(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {/* Stepper, Delete, and Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Quantity Stepper with 36px touch targets */}
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors focus:outline-none cursor-pointer active:bg-stone-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2.5 text-stone-900 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors focus:outline-none cursor-pointer active:bg-stone-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Desktop Item Total */}
                  <span className="hidden sm:block text-sm font-bold text-stone-900 min-w-[60px] text-right">
                    {formatTaka(item.product.price * item.quantity)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-400 hover:text-red-600 active:scale-95 transition-colors p-2 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-stone-50 border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-7 sticky top-20 sm:top-24 shadow-2xs">
            <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900 pb-3 sm:pb-4 border-b border-stone-200">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="py-3.5 sm:py-4 space-y-2.5 sm:space-y-3 text-xs border-b border-stone-200">
              <div className="flex items-center justify-between text-stone-700">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-950">{formatTaka(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Discount ({discountCode})</span>
                  <span>-{formatTaka(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-stone-700">
                <span className="flex items-center space-x-1">
                  <span>Shipping</span>
                  {isFreeShipping && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">FREE</span>}
                </span>
                <span className="font-bold text-stone-950">
                  {isFreeShipping ? '৳0' : formatTaka(shippingCost)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="py-3 sm:py-4 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold uppercase text-stone-900">Total Amount</span>
              <span className="text-lg sm:text-xl font-bold text-stone-950">{formatTaka(total)}</span>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-1 pb-3 sm:pb-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo Code (e.g. SPRING20)"
                    className="w-full text-xs py-2.5 px-3 bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all uppercase placeholder:normal-case placeholder:text-stone-400/40 placeholder:font-normal font-medium"
                  />
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-red-600 mt-1.5">{promoError}</p>
              )}
              {promoSuccess && discountAmount > 0 && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Promo code {discountCode} applied successfully!</span>
                </p>
              )}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-stone-900 hover:bg-stone-800 active:scale-98 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 shadow-md mb-3 sm:mb-4 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-3 border-t border-stone-200 text-center space-y-1.5 text-[10px] sm:text-[11px] text-stone-500">
              <div className="flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>100% Quality Inspected • Easy Size Exchange Guarantee</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Encrypted 256-bit SSL Checkout
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
