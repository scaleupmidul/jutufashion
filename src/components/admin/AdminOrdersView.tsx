import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Phone, 
  ChevronRight, 
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MessageCircle
} from 'lucide-react';
import { OrderDetails, OrderStatus, PaymentStatus } from '../../types';
import { formatTaka } from '../../utils/currency';
import { AdminPagination } from './AdminPagination';

interface AdminOrdersViewProps {
  orders: OrderDetails[];
  onSelectOrder: (order: OrderDetails) => void;
  onUpdateStatus: (orderNumber: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<any> | void;
  onAddNewManualOrder: () => void;
}

const ITEMS_PER_PAGE = 20;

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  onAddNewManualOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders.filter((ord) => {
    if (!ord) return false;
    const matchesStatus = statusFilter === 'all' || (ord.status || 'pending') === statusFilter;
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return matchesStatus;

    const customerName = `${ord.shippingAddress?.firstName || ord.customerName || (ord as any).customer?.name || ''} ${ord.shippingAddress?.lastName || ''}`.toLowerCase();
    const phone = (ord.shippingAddress?.phone || (ord as any).customer?.phone || '').toLowerCase();
    const orderNum = (ord.orderNumber || ord.id || '').toLowerCase();
    const city = (ord.shippingAddress?.city || (ord as any).customer?.city || '').toLowerCase();

    const matchesSearch = 
      customerName.includes(searchLower) ||
      phone.includes(searchLower) ||
      orderNum.includes(searchLower) ||
      city.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Ensure current page is valid when total changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Total', 'Payment Type', 'Status'];
    const rows = filteredOrders.map((ord) => [
      ord.orderNumber || ord.id || '',
      ord.date || (ord as any).createdAt || '',
      `"${ord.shippingAddress?.firstName || ord.customerName || (ord as any).customer?.name || ''} ${ord.shippingAddress?.lastName || ''}"`.trim(),
      ord.shippingAddress?.phone || (ord as any).customer?.phone || '',
      ord.shippingAddress?.city || (ord as any).customer?.city || '',
      ord.total || 0,
      ord.paymentMethod?.type || ord.paymentStatus || 'COD',
      ord.status || 'pending',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JUTU_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs: { id: 'all' | OrderStatus; label: string; count: number }[] = [
    { id: 'all', label: 'ALL ORDERS', count: orders.length },
    { id: 'pending', label: 'PENDING', count: orders.filter((o) => (o.status || 'pending') === 'pending').length },
    { id: 'confirmed', label: 'CONFIRMED', count: orders.filter((o) => o.status === 'confirmed').length },
    { id: 'processing', label: 'PROCESSING', count: orders.filter((o) => o.status === 'processing').length },
    { id: 'shipped', label: 'SHIPPED', count: orders.filter((o) => o.status === 'shipped').length },
    { id: 'delivered', label: 'DELIVERED', count: orders.filter((o) => o.status === 'delivered').length },
    { id: 'cancelled', label: 'CANCELLED', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 uppercase">
            Order Logistics Pipeline
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Real-time management for dispatch, advance payment verification, and customer delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone (e.g. 01900000000), or City..."
            className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Orders List Table */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3.5 bg-[#fbf9f6] border-b border-stone-200 text-[10px] font-bold tracking-[0.16em] uppercase text-stone-500">
          <div className="col-span-2">ORDER #</div>
          <div className="col-span-3">CUSTOMER / PHONE</div>
          <div className="col-span-3">LOCATION & ITEMS</div>
          <div className="col-span-2">VALUE / PAYMENT</div>
          <div className="col-span-2 text-right">STATUS / ACTION</div>
        </div>

        {/* Table Rows */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-2">
            <Filter className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">No orders found</p>
            <p className="text-xs text-stone-500">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {paginatedOrders.map((ord) => {
              const isPaidAdvance = ord.paymentStatus === 'paid_advance' || ord.paymentStatus === 'paid_full';
              const status = ord.status || 'pending';
              const customerFullName = `${ord.shippingAddress?.firstName || ord.customerName || (ord as any).customer?.name || ''} ${ord.shippingAddress?.lastName || ''}`.trim() || 'Valued Customer';
              const customerPhone = ord.shippingAddress?.phone || (ord as any).customer?.phone || '+880 1900-000000';
              const locationCity = ord.shippingAddress?.city || (ord as any).customer?.city || 'Dhaka';
              const locationAddress = ord.shippingAddress?.address || (ord as any).customer?.address || '';
              const itemsList = (ord.items || []).map((i) => {
                const name = i?.product?.name || (i as any)?.name || (i as any)?.productName || 'Footwear Model';
                const size = i?.selectedSize || (i as any)?.size;
                return size ? `${name} (Size: ${size})` : name;
              }).join(', ') || 'Footwear Item';

              return (
                <div
                  key={ord.id || ord.orderNumber}
                  className="p-4 sm:p-5 hover:bg-stone-50/90 transition-colors"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3 items-center">
                    
                    {/* Order ID & Date */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:block">
                      <div>
                        <span className="text-xs sm:text-sm font-mono font-bold text-stone-950 block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {ord.date}
                        </span>
                      </div>
                      
                      {/* Mobile Status Pill */}
                      <span className={`sm:hidden text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm border ${
                        status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : status === 'confirmed'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : status === 'shipped'
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                          : status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}>
                        {status}
                      </span>
                    </div>

                    {/* Customer & Phone */}
                    <div className="sm:col-span-3">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 block truncate uppercase">
                        {customerFullName}
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-stone-600 font-mono mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{customerPhone}</span>
                      </div>
                    </div>

                    {/* Location & Items */}
                    <div className="sm:col-span-3">
                      <span className="text-xs text-stone-800 font-medium block truncate">
                        {locationCity} {locationAddress ? `• ${locationAddress}` : ''}
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                        {itemsList}
                      </span>
                    </div>

                    {/* Value & Payment */}
                    <div className="sm:col-span-2">
                      <span className="text-xs sm:text-sm font-extrabold font-mono text-stone-950 block">
                        {formatTaka(ord.total)}
                      </span>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.2 rounded-xs uppercase ${
                          isPaidAdvance
                            ? 'bg-stone-100 text-stone-800 border border-stone-300'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {isPaidAdvance ? 'ADVANCE PAID' : 'COD'}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 uppercase">
                          {ord.paymentMethod?.type || ord.paymentStatus || 'COD'}
                        </span>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="sm:col-span-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onSelectOrder(ord)}
                        className="bg-stone-900 hover:bg-black text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>VIEW</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Pagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        itemLabel="orders"
      />

    </div>
  );
};
