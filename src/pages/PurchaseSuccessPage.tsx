import React, { useEffect } from 'react';
import { 
  Check,
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  Printer, 
  ArrowRight, 
  Share2, 
  Calendar 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderDetails, PageView } from '../types';
import { formatTaka } from '../utils/currency';

interface PurchaseSuccessPageProps {
  order: OrderDetails | null;
  onNavigate: (view: PageView) => void;
}

export const PurchaseSuccessPage: React.FC<PurchaseSuccessPageProps> = ({
  order,
  onNavigate,
}) => {
  useEffect(() => {
    // Launch joyful celebratory eco-confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2d4a3e', '#5d7589', '#8f6f71', '#d1be9b'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order || typeof order !== 'object' || !order.orderNumber) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <div className="w-14 h-14 bg-stone-100 text-stone-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-200">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">No recent order found</h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          You haven't placed an order yet in this session, or the order details have expired.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const shippingAddress = order.shippingAddress || {} as any;
  const customerEmail = (shippingAddress.email || (order as any).customer?.email || '').trim();

  // Clean, short delivery formatting to prevent awkward wrapping on mobile phones
  const rawTitle = order.shippingMethod?.title || (order.shipping === 0 ? 'Free Shipping' : 'Standard Delivery');
  const shortZone = rawTitle
    .replace(/\s*\(All Bangladesh\)/i, '')
    .replace(/\s*City/i, '')
    .trim();

  const rawDays = order.shippingMethod?.estimatedDays || '2-4 business days';
  const cleanDays = rawDays
    .replace(/[()]/g, '')
    .replace(/business days/i, 'Days')
    .replace(/days/i, 'Days')
    .trim();

  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fadeIn">
      {/* Thank you banner */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-stone-800 border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800 stroke-[2.2]" />
        </div>
        <span className="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-stone-700 uppercase bg-stone-100/90 px-3.5 py-1 rounded-full border border-stone-200/70">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 mt-3 mb-2 font-normal">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          We have received your order <span className="font-bold text-stone-900 font-mono">{order.orderNumber}</span>
          {customerEmail ? (
            <> and sent a confirmation receipt to <span className="font-semibold text-stone-900">{customerEmail}</span>.</>
          ) : (
            <>. Our team will verify and dispatch your order shortly.</>
          )}
        </p>
      </div>

      {/* Interactive Delivery Tracker */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 md:p-8 mb-10 shadow-xs">
        <div className="pb-4 sm:pb-5 border-b border-stone-100">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-stone-400">
              Estimated Delivery
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full shrink-0">
              Tracked Courier
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-stone-900 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-stone-600 shrink-0" />
            <span>{cleanDays}</span>
            <span className="text-stone-300 font-normal">•</span>
            <span className="text-xs sm:text-sm font-medium text-stone-600">{shortZone}</span>
          </p>
        </div>

        {/* Progress Step Nodes */}
        <div className="grid grid-cols-4 gap-2 pt-6 relative">
          <div className="text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center mb-2 z-10 shadow-xs">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-stone-900">Confirmed</span>
            <span className="text-[10px] text-stone-400">Today</span>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mb-2 z-10">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-stone-600">Packing</span>
            <span className="text-[10px] text-stone-400">Natural Kraft Box</span>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-2 z-10">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-normal text-stone-500">Shipped</span>
            <span className="text-[10px] text-stone-400">Courier Handover</span>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-2 z-10">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-normal text-stone-500">Delivered</span>
            <span className="text-[10px] text-stone-400">At Your Door</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        
        {/* Left: Itemized Receipt (7 cols) */}
        <div className="md:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold tracking-wider uppercase text-stone-900 pb-3 border-b border-stone-100">
            Order Items ({orderItems.length})
          </h3>

          <div className="space-y-3.5">
            {orderItems.map((item, idx) => {
              const itemImage = item.selectedColor?.image || item.product?.colors?.[0]?.image || '';
              const itemName = item.product?.name || (item as any).productName || 'JUTU Footwear';
              const itemColor = item.selectedColor?.name || (item as any).color || 'Standard';
              const itemSize = item.selectedSize || (item as any).size || '42';
              const itemQty = item.quantity || 1;
              const itemPrice = (item.product?.price || (item as any).price || 0) * itemQty;

              return (
                <div key={item.id || idx} className="flex items-center justify-between pb-3 border-b border-stone-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-stone-50 rounded-xl p-1 border border-stone-200 flex items-center justify-center flex-shrink-0">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-stone-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 uppercase">
                        {itemName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {itemColor} • Size {itemSize} • Qty {itemQty}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    {formatTaka(itemPrice)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing summary */}
          <div className="pt-2 space-y-2 text-xs border-t border-stone-100">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatTaka(order.subtotal || 0)}</span>
            </div>
            {(order.discount || 0) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount {order.discountCode ? `(${order.discountCode})` : ''}</span>
                <span>-{formatTaka(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee</span>
              <span>{order.shipping === 0 ? 'FREE' : formatTaka(order.shipping || 0)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
              <span>Total Paid</span>
              <span>{formatTaka(order.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & Eco Impact (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold tracking-wider uppercase text-stone-900 pb-2 border-b border-stone-100">
              Shipping Destination
            </h3>
            <p className="text-xs font-bold text-stone-900">
              {shippingAddress.firstName || 'Customer'} {shippingAddress.lastName || ''}
            </p>
            {shippingAddress.address && (
              <p className="text-xs text-stone-600">
                {shippingAddress.address}
                {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
              </p>
            )}
            <p className="text-xs text-stone-600">
              {shippingAddress.city || 'Bangladesh'}{shippingAddress.zipCode ? ` - ${shippingAddress.zipCode}` : ''}
            </p>
            {shippingAddress.phone && (
              <p className="text-xs text-stone-600">Phone: {shippingAddress.phone}</p>
            )}
          </div>
        </div>

      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 px-6 py-3.5 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
