import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package, 
  AlertCircle, 
  Eye, 
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  Loader2,
  Copy
} from 'lucide-react';
import { Product } from '../../types';
import { formatTaka } from '../../utils/currency';
import { formatBadge } from '../../utils/badge';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminPagination } from './AdminPagination';
import { getStoredCategories, STORE_SYNC_EVENT } from '../../data/adminStore';

interface AdminProductsViewProps {
  products: Product[];
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDuplicateProduct?: (product: Product) => Promise<any> | void;
  onDeleteProduct: (productId: string) => Promise<any> | void;
  onUpdateStock: (productId: string, newStock: number) => Promise<any> | void;
}

const ITEMS_PER_PAGE = 20;

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({
  products,
  onAddNewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onUpdateStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Deletion Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [isDuplicatingId, setIsDuplicatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDuplicate = async (prod: Product) => {
    if (!onDuplicateProduct) return;
    setIsDuplicatingId(prod.id);
    try {
      const res = await onDuplicateProduct(prod);
      if (res && res.success === false) {
        showToast(res.error || 'Failed to duplicate product', 'error');
      } else {
        showToast(`Copied "${prod.name}" as a new product card! You can now edit it.`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error duplicating product', 'error');
    } finally {
      setIsDuplicatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await onDeleteProduct(productToDelete.id);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to delete from database');
      }
      showToast(`Deleted "${productToDelete.name}" from store catalog.`);
      setProductToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Database error while deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStockChange = async (productId: string, newStock: number) => {
    setUpdatingStockId(productId);
    try {
      const res = await onUpdateStock(productId, newStock);
      if (res && res.success === false) {
        showToast(res.error || 'Failed to update stock in database', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setUpdatingStockId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || p.gender === selectedGender || p.gender === 'unisex';
    const matchesSearch = !searchTerm.trim() || p.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesCategory && matchesGender && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedGender]);

  // Ensure current page is valid when count changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [storedCategories, setStoredCategories] = useState(() => getStoredCategories());

  useEffect(() => {
    const handleSync = () => {
      setStoredCategories(getStoredCategories());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const categories = [
    { id: 'all', label: 'ALL MODELS' },
    ...storedCategories.map((c) => ({
      id: c.slug,
      label: c.name.toUpperCase(),
    })),
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 uppercase">
            Footwear Catalog & Inventory
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Total {products.length} models live on your store. Edit pricing, stock levels, colorways, or remove items.
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="bg-stone-950 hover:bg-black text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-2 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ADD FOOTWEAR</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn border shadow-md ${
          toastType === 'error'
            ? 'bg-rose-900 text-white border-rose-700'
            : 'bg-stone-900 text-white border-stone-700'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by shoe name (e.g. Wool Runner, Cruiser)..."
              className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="all">ALL GENDERS</option>
              <option value="men">MEN</option>
              <option value="women">WOMEN</option>
              <option value="unisex">UNISEX</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Products Grid / Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-12 text-center text-stone-500 space-y-2">
          <Package className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-800">No footwear models found</p>
          <p className="text-xs text-stone-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <>
          {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 4 on small desktop, 5 on PC/large desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-2.5 sm:gap-3.5 lg:gap-4">
            {paginatedProducts.map((prod) => {
              const currentStock = prod.stock ?? 20;
              const isLowStock = currentStock < 5;

              return (
                <div
                  key={prod.id}
                  className="group product-card bg-white border border-stone-200/90 rounded-[.666rem] overflow-hidden shadow-xs hover:shadow-sm hover:border-stone-400 transition-all flex flex-col justify-between"
                  style={{ borderRadius: '.666rem' }}
                >
                  <div>
                    {/* Top Image Preview & Badges */}
                    <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 overflow-hidden">
                      <img
                        src={prod.colors[0]?.image || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80'}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {formatBadge(prod.badge) && (
                          <span className="bg-stone-950 text-white text-[8px] sm:text-[9px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                            {formatBadge(prod.badge)}
                          </span>
                        )}
                        {(prod.isOutOfStock || currentStock <= 0) && (
                          <span className="bg-rose-600 text-white text-[8px] sm:text-[8.5px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>

                      {/* Gender pill */}
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-stone-900 text-[8px] sm:text-[8.5px] font-bold tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
                        {prod.gender}
                      </span>

                      {/* Low Stock Warning Banner */}
                      {isLowStock && !prod.isOutOfStock && currentStock > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-amber-500/95 text-stone-950 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center justify-between shadow-xs">
                          <span className="truncate">Low Stock</span>
                          <span className="font-mono">{currentStock} left</span>
                        </div>
                      )}
                    </div>

                    {/* Content Block */}
                    <div className="p-2.5 sm:p-3.5 space-y-2">
                      <div>
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-stone-400 block truncate">
                          {prod.category}
                        </span>
                        <h3 className="font-bold text-xs sm:text-[13px] text-stone-950 uppercase tracking-tight truncate title-clamp-1" title={prod.name}>
                          {prod.name}
                        </h3>
                      </div>

                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-stone-950 block">
                          {formatTaka(prod.price)}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-[9px] sm:text-[10px] font-mono text-stone-400 line-through">
                            {formatTaka(prod.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Color Swatches and Sizes Count */}
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-100">
                        <div className="flex items-center space-x-1">
                          {prod.colors.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-stone-300 inline-block shadow-2xs shrink-0"
                              style={{ backgroundColor: c.colorCode }}
                              title={c.name}
                            />
                          ))}
                          {prod.colors.length > 3 && (
                            <span className="text-[8.5px] font-semibold text-stone-400">
                              +{prod.colors.length - 3}
                            </span>
                          )}
                        </div>

                        <span className="text-[9px] sm:text-[9.5px] font-semibold text-stone-500 truncate">
                          {prod.sizes.length > 0 ? `${prod.sizes[0]}-${prod.sizes[prod.sizes.length - 1]}` : ''}
                        </span>
                      </div>

                      {/* Inline Stock Counter */}
                      <div className="flex items-center justify-between bg-[#f8f6f3] border border-stone-200/90 rounded-lg px-2 py-1 text-xs">
                        <span className="text-[9px] font-bold text-stone-500 uppercase">Stock</span>
                        <div className="flex items-center space-x-1.5">
                          {updatingStockId === prod.id ? (
                            <div className="flex items-center space-x-1 py-0.5 text-stone-600">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span className="text-[10px] font-semibold">Updating...</span>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStockChange(prod.id, Math.max(0, currentStock - 1))}
                                className="w-5 h-5 rounded bg-white border border-stone-300 text-stone-800 font-bold hover:bg-stone-100 flex items-center justify-center cursor-pointer text-xs transition-colors"
                                title="Decrease Stock"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-stone-950 text-xs w-5 text-center">
                                {currentStock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStockChange(prod.id, currentStock + 1)}
                                className="w-5 h-5 rounded bg-white border border-stone-300 text-stone-800 font-bold hover:bg-stone-100 flex items-center justify-center cursor-pointer text-xs transition-colors"
                                title="Increase Stock"
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Card Actions */}
                  <div className="p-2.5 sm:p-3.5 pt-0 flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onEditProduct(prod)}
                      className="flex-1 bg-stone-900 hover:bg-black text-white text-[10px] sm:text-xs font-bold py-2 rounded-lg sm:rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>EDIT</span>
                    </button>

                    {onDuplicateProduct && (
                      <button
                        type="button"
                        onClick={() => handleDuplicate(prod)}
                        disabled={isDuplicatingId === prod.id}
                        className="px-2 sm:px-2.5 py-2 rounded-lg sm:rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-200 text-[10px] sm:text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                        title="Duplicate / Copy this product card"
                      >
                        {isDuplicatingId === prod.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Copy className="w-3 h-3 text-stone-600" />
                        )}
                        <span>COPY</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setProductToDelete(prod)}
                      className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-700 border border-stone-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Delete Footwear"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemLabel="footwear models"
          />
        </>
      )}

      {/* In-App Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Footwear Model"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}" from your footwear catalog? This will remove it from all store shop categories and detail views.`}
        confirmLabel="Yes, Delete Product"
        cancelLabel="Keep Product"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !isDeleting && setProductToDelete(null)}
      />

    </div>
  );
};
