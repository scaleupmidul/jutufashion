import React, { useState, useEffect } from 'react';
import { AdminTab, OrderDetails, Product, OrderStatus, PaymentStatus } from '../types';
import { 
  getStoredOrders, 
  getStoredProducts, 
  getStoredMessages, 
  getStoredPaymentConfig, 
  getStoredPagesContent, 
  getStoredSettings,
  updateOrderStatus,
  deleteOrder,
  saveProduct,
  deleteProduct,
  updateProductStock,
  updateMessageStatus,
  deleteMessage,
  savePaymentConfig,
  savePagesContent,
  saveSettings,
  resetStoreToDefaults,
  STORE_SYNC_EVENT,
  syncStoreWithCloud
} from '../data/adminStore';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboardView } from '../components/admin/AdminDashboardView';
import { AdminOrdersView } from '../components/admin/AdminOrdersView';
import { AdminOrderModal } from '../components/admin/AdminOrderModal';
import { AdminProductsView } from '../components/admin/AdminProductsView';
import { AdminProductModal } from '../components/admin/AdminProductModal';
import { AdminMessagesView } from '../components/admin/AdminMessagesView';
import { AdminPaymentInfoView } from '../components/admin/AdminPaymentInfoView';
import { AdminPagesContentView } from '../components/admin/AdminPagesContentView';
import { AdminSettingsView } from '../components/admin/AdminSettingsView';

interface AdminPageProps {
  initialTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  onExitAdmin: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ 
  initialTab = 'dashboard', 
  onTabChange, 
  onExitAdmin 
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);

  useEffect(() => {
    if (initialTab && initialTab !== currentTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };
  
  // Store Data States
  const [orders, setOrders] = useState<OrderDetails[]>(getStoredOrders());
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [messages, setMessages] = useState(getStoredMessages());
  const [paymentConfig, setPaymentConfig] = useState(getStoredPaymentConfig());
  const [pagesContent, setPagesContent] = useState(getStoredPagesContent());
  const [settings, setSettings] = useState(getStoredSettings());

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Sync listener & initial fetch
  useEffect(() => {
    syncStoreWithCloud();

    const handleStoreSync = () => {
      setOrders(getStoredOrders());
      setProducts(getStoredProducts());
      setMessages(getStoredMessages());
      setPaymentConfig(getStoredPaymentConfig());
      setPagesContent(getStoredPagesContent());
      setSettings(getStoredSettings());
    };

    window.addEventListener(STORE_SYNC_EVENT, handleStoreSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleStoreSync);
  }, [currentTab]);

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'new').length;

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={handleSelectTab}
      onExitAdmin={onExitAdmin}
      activeOrdersCount={activeOrdersCount}
      unreadMessagesCount={unreadMessagesCount}
    >
      {/* 1. DASHBOARD OVERVIEW */}
      {currentTab === 'dashboard' && (
        <AdminDashboardView
          orders={orders}
          products={products}
          onSelectOrder={(order) => setSelectedOrder(order)}
          onUpdateStatus={(orderNumber, status) => updateOrderStatus(orderNumber, status)}
          onViewAllOrders={() => handleSelectTab('orders')}
          onViewAllProducts={() => handleSelectTab('products')}
          onAddNewProduct={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
            handleSelectTab('products');
          }}
          onNavigateTab={(tab) => handleSelectTab(tab)}
        />
      )}

      {/* 2. ORDERS MANAGEMENT */}
      {currentTab === 'orders' && (
        <AdminOrdersView
          orders={orders}
          onSelectOrder={(order) => setSelectedOrder(order)}
          onUpdateStatus={(orderNumber, status, paymentStatus) => updateOrderStatus(orderNumber, status, paymentStatus)}
          onAddNewManualOrder={() => {
            // Can open an order creation form if needed
            alert('Manual Phone Order feature ready. You can also view all web orders directly.');
          }}
        />
      )}

      {/* 3. PRODUCTS MANAGEMENT */}
      {currentTab === 'products' && (
        <AdminProductsView
          products={products}
          onAddNewProduct={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          onEditProduct={(product) => {
            setSelectedProduct(product);
            setIsProductModalOpen(true);
          }}
          onDuplicateProduct={async (productToDuplicate) => {
            const newId = `shoe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            const duplicated: Product = {
              ...productToDuplicate,
              id: newId,
              name: `${productToDuplicate.name} (COPY)`,
              colors: productToDuplicate.colors.map((c) => ({
                ...c,
                altImages: c.altImages ? [...c.altImages] : undefined,
              })),
              sizes: [...productToDuplicate.sizes],
              materials: [...(productToDuplicate.materials || [])],
              features: [...(productToDuplicate.features || [])],
            };
            const res = await saveProduct(duplicated);
            if (res.success) {
              setProducts(getStoredProducts());
            }
            return res;
          }}
          onDeleteProduct={async (productId) => {
            const res = await deleteProduct(productId);
            if (res.success) {
              setProducts(getStoredProducts());
            }
            return res;
          }}
          onUpdateStock={async (productId, stock) => {
            const res = await updateProductStock(productId, stock);
            if (res.success) {
              setProducts(getStoredProducts());
            }
            return res;
          }}
        />
      )}

      {/* 4. MESSAGES & INQUIRIES */}
      {currentTab === 'messages' && (
        <AdminMessagesView
          messages={messages}
          onUpdateStatus={async (id, status, notes) => {
            const res = await updateMessageStatus(id, status, notes);
            if (res.success) {
              setMessages(getStoredMessages());
            }
            return res;
          }}
          onDeleteMessage={async (id) => {
            const res = await deleteMessage(id);
            if (res.success) {
              setMessages(getStoredMessages());
            }
            return res;
          }}
        />
      )}

      {/* 5. PAYMENT GATEWAYS */}
      {currentTab === 'payment-info' && (
        <AdminPaymentInfoView
          paymentConfig={paymentConfig}
          onSaveConfig={async (cfg) => {
            const res = await savePaymentConfig(cfg);
            if (res.success) {
              setPaymentConfig(getStoredPaymentConfig());
            }
            return res;
          }}
        />
      )}

      {/* 6. BRANDED PAGES CMS */}
      {currentTab === 'pages-content' && (
        <AdminPagesContentView
          pagesContent={pagesContent}
          onSaveContent={async (content) => {
            const res = await savePagesContent(content);
            if (res.success) {
              setPagesContent(getStoredPagesContent());
            }
            return res;
          }}
          onExitAdmin={onExitAdmin}
        />
      )}

      {/* 7. STORE SETTINGS */}
      {currentTab === 'settings' && (
        <AdminSettingsView
          settings={settings}
          onSaveSettings={async (st) => {
            const res = await saveSettings(st);
            if (res.success) {
              setSettings(getStoredSettings());
            }
            return res;
          }}
          onResetStoreData={async () => {
            await resetStoreToDefaults();
            setProducts(getStoredProducts());
            setOrders(getStoredOrders());
            setMessages(getStoredMessages());
            setSettings(getStoredSettings());
          }}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <AdminOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={async (orderNumber, status, paymentStatus) => {
            const res = await updateOrderStatus(orderNumber, status, paymentStatus);
            if (res.success) {
              setOrders(getStoredOrders());
            }
            return res;
          }}
          onDeleteOrder={async (orderNumber) => {
            const res = await deleteOrder(orderNumber);
            if (res.success) {
              setOrders(getStoredOrders());
            }
            return res;
          }}
        />
      )}

      {/* Product Edit / Add Modal */}
      {isProductModalOpen && (
        <AdminProductModal
          product={selectedProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={async (prod) => {
            const res = await saveProduct(prod);
            if (res.success) {
              setProducts(getStoredProducts());
            }
            return res;
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPage;
