import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { CartItem, PageView } from '../types';
import { UPSELL_ACCESSORIES, PRODUCTS } from '../data/products';
import { formatTaka } from '../utils/currency';
import { getStoredSettings, getPaymentConfig, STORE_SYNC_EVENT } from '../data/adminStore';
import { FreeDeliveryProgressBar } from './FreeDeliveryProgressBar';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (view: PageView) => void;
  onAddUpsell: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
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

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isUnconditionalFree = Boolean(paymentConfig.freeDelivery?.enabled !== false);
  const isThresholdFree = Boolean(
    storeSettings.freeShippingEnabled !== false &&
    subtotal >= (storeSettings.freeShippingThreshold || 2000)
  );
  const isFreeDelivery = isUnconditionalFree || isThresholdFree;
  const freeDeliveryText = isUnconditionalFree
    ? (paymentConfig.freeDelivery?.text || 'Free delivery all over Bangladesh')
    : 'Free Delivery All Over Bangladesh';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 animate-slideLeft h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900">
                Your Bag
              </h2>
              <span className="text-[11px] sm:text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors focus:outline-none cursor-pointer -mr-1"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <FreeDeliveryProgressBar
            subtotal={subtotal}
            threshold={storeSettings.freeShippingThreshold || 2000}
            variant="drawer"
          />

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-stone-900 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                  Explore our sustainable shoes crafted with natural and recycled materials.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('shop-all');
                  }}
                  className="bg-stone-900 text-white hover:bg-stone-800 px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Shop Best Sellers
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3 pb-3.5 sm:pb-4 border-b border-stone-100 group"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 bg-stone-50 rounded-lg p-1.5 flex-shrink-0 border border-stone-200/70 flex items-center justify-center">
                    <img
                      src={item.selectedColor.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-stone-900 tracking-wide uppercase line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-xs font-bold text-stone-900 ml-2">
                          {formatTaka(item.product.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {item.selectedColor.name} • Size {item.selectedSize}
                      </p>
                    </div>

                    {/* Quantity Stepper & Delete with 36px touch targets */}
                    <div className="flex items-center justify-between pt-1.5">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors focus:outline-none cursor-pointer active:bg-stone-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2 text-stone-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors focus:outline-none cursor-pointer active:bg-stone-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-600 active:scale-95 transition-colors p-1.5 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/50 space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Subtotal</span>
                <span className="text-sm font-bold text-stone-950">{formatTaka(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>Delivery Fee</span>
                <span>{isFreeDelivery ? <strong className="text-emerald-700 font-bold">FREE</strong> : 'Calculated at checkout'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('cart');
                  }}
                  className="w-full bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 py-3 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors text-center cursor-pointer active:scale-95"
                >
                  View Bag
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('checkout');
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors text-center flex items-center justify-center space-x-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1 text-[10px] text-stone-500 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>100% Quality Checked • Easy Size Exchange Guarantee</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
