import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Phone, 
  MessageCircle, 
  Truck, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { OrderDetails, OrderStatus, PaymentStatus } from '../../types';
import { formatTaka } from '../../utils/currency';
import { AdminConfirmModal } from './AdminConfirmModal';

interface AdminOrderModalProps {
  order: OrderDetails | null;
  onClose: () => void;
  onUpdateStatus: (orderNumber: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<any> | void;
  onDeleteOrder: (orderNumber: string) => Promise<any> | void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onDeleteOrder,
}) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status || 'pending');
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<PaymentStatus>(order.paymentStatus || 'paid_advance');
  const [courierName, setCourierName] = useState(order.courier || 'Steadfast Courier');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleSaveStatus = async () => {
    setIsUpdating(true);
    setActionError(null);
    try {
      const res = await onUpdateStatus(order.orderNumber, currentStatus, currentPaymentStatus);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to update order in database');
      }
      setIsUpdating(false);
      onClose();
    } catch (err: any) {
      setIsUpdating(false);
      setActionError(err.message || 'Database error while updating order.');
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await onDeleteOrder(order.orderNumber);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to delete order from database');
      }
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (err: any) {
      setIsDeleting(false);
      setActionError(err.message || 'Database error while deleting order.');
      setIsDeleteConfirmOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = (order.shippingAddress?.phone || (order as any).customer?.phone || '').replace(/[^0-9]/g, '');
  const customerFirstName = order.shippingAddress?.firstName || order.customerName || (order as any).customer?.name || 'Customer';
  const customerLastName = order.shippingAddress?.lastName || '';
  const customerFullName = `${customerFirstName} ${customerLastName}`.trim();
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('880') ? cleanPhone : '880' + cleanPhone.replace(/^0+/, '')}?text=${encodeURIComponent(
    `Hello ${customerFirstName}, Greetings from JUTU Footwear! Regarding your order ${order.orderNumber} for ${formatTaka(order.total)}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto text-stone-900">
        
        {/* Header Bar */}
        <div className="bg-[#0c0c0c] text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-lg sm:text-xl font-bold font-mono tracking-tight">
                ORDER {order.orderNumber}
              </span>
              <span className={`text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase border ${
                order.status === 'delivered'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {order.status || 'PENDING'}
              </span>
            </div>
            <span className="text-xs text-stone-400 block mt-1">
              Placed on {order.date}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title="Print Order Invoice"
              aria-label="Print Invoice"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Box */}
            <div className="bg-[#faf8f5] border border-stone-200/80 rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-2">
                CUSTOMER DETAILS
              </span>
              <h3 className="font-bold text-base text-stone-950 uppercase">
                {customerFullName || 'Valued Customer'}
              </h3>
              <p className="text-xs text-stone-600 font-mono mt-1">
                {order.shippingAddress?.phone || (order as any).customer?.phone || 'No phone provided'}
              </p>
              {(order.shippingAddress?.email || (order as any).customer?.email) && (
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {order.shippingAddress?.email || (order as any).customer?.email}
                </p>
              )}

              {/* Quick Communication Actions */}
              <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-stone-200">
                <a
                  href={`tel:${cleanPhone || order.shippingAddress?.phone || ''}`}
                  className="flex-1 bg-stone-900 hover:bg-black text-white text-[11px] font-bold py-2 rounded-xl text-center flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold py-2 rounded-xl text-center flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Shipping Box */}
            <div className="bg-[#faf8f5] border border-stone-200/80 rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-2">
                SHIPPING DESTINATION
              </span>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {order.shippingAddress?.address || (order as any).customer?.address || 'Address not specified'}
                {order.shippingAddress?.apartment ? `, ${order.shippingAddress.apartment}` : ''}
              </p>
              <p className="text-xs text-stone-600 mt-1 font-bold">
                {order.shippingAddress?.city || (order as any).customer?.city || 'Dhaka'} {order.shippingAddress?.zipCode ? `- ${order.shippingAddress.zipCode}` : ''}
              </p>
              
              <div className="mt-3 pt-3 border-t border-stone-200 text-xs">
                <span className="text-stone-500 font-bold uppercase text-[10px] block">METHOD</span>
                <span className="text-stone-900 font-medium">{order.shippingMethod?.title || 'Standard Courier'}</span>
              </div>
            </div>

          </div>

          {/* Purchased Items List */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-3">
              ORDER ITEMS ({(order.items || []).length})
            </span>
            <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden bg-white">
              {(order.items || []).map((item, idx) => {
                const itemName = item?.product?.name || (item as any)?.name || (item as any)?.productName || 'Footwear Model';
                const itemImg = item?.selectedColor?.image || item?.product?.colors?.[0]?.image || (item as any)?.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80';
                const itemColor = item?.selectedColor?.name || (item as any)?.color;
                const itemSize = item?.selectedSize || (item as any)?.size;
                const itemPrice = item?.product?.price ?? (item as any)?.price ?? 0;
                const itemQty = item?.quantity || 1;

                return (
                  <div key={idx} className="p-3.5 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={itemImg}
                        alt={itemName}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase">
                          {itemName}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-stone-600 mt-0.5">
                          {itemColor && <span className="font-semibold">Color: {itemColor}</span>}
                          {itemColor && itemSize && <span>•</span>}
                          {itemSize && <span className="font-bold text-stone-900">Size: {itemSize}</span>}
                          {(itemColor || itemSize) && <span>•</span>}
                          <span>Qty: {itemQty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold font-mono text-stone-950">
                        {formatTaka(itemPrice * itemQty)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing & Payment Summary */}
          <div className="bg-[#f5f3ef] border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-stone-900">{formatTaka(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.discountCode || 'Promo'})</span>
                <span className="font-mono font-bold">-{formatTaka(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee</span>
              <span className="font-mono font-bold text-stone-900">
                {order.shipping === 0 ? 'FREE' : formatTaka(order.shipping)}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-300/80 flex justify-between text-sm font-bold text-stone-950">
              <span>Total Payable</span>
              <span className="font-mono text-base font-extrabold">{formatTaka(order.total)}</span>
            </div>

            {/* Payment Method Details */}
            <div className="pt-3 border-t border-stone-300/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase block">PAYMENT TYPE</span>
                <span className="font-bold text-stone-900 uppercase">{order.paymentMethod?.type}</span>
              </div>
              {order.paymentMethod?.transactionId && (
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">TRANSACTION ID</span>
                  <span className="font-mono font-bold text-stone-900">{order.paymentMethod.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Changer Controls */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block">
              UPDATE LOGISTICS STATUS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                  Order Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="pending">PENDING</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="processing">PROCESSING</option>
                  <option value="shipped">SHIPPED</option>
                  <option value="delivered">DELIVERED</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                  Payment Status
                </label>
                <select
                  value={currentPaymentStatus}
                  onChange={(e) => setCurrentPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="paid_advance">PAID ADVANCE (৳200)</option>
                  <option value="paid_full">PAID IN FULL</option>
                  <option value="cod">CASH ON DELIVERY (UNPAID)</option>
                  <option value="unpaid">UNPAID</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {actionError && (
                <div className="w-full mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={isUpdating || isDeleting}
                className="text-red-600 hover:text-red-800 disabled:opacity-40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUpdating || isDeleting}
                  className="bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={isUpdating || isDeleting}
                  className="bg-stone-950 hover:bg-black text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center space-x-2 disabled:opacity-60"
                >
                  {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUpdating ? 'Updating Database...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* In-App Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Order"
        message={`Are you sure you want to permanently delete order ${order.orderNumber} placed by ${customerFullName || 'the customer'}? This will remove it from all logistics metrics and order history.`}
        confirmLabel="Yes, Delete Order"
        cancelLabel="Keep Order"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !isDeleting && setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};
