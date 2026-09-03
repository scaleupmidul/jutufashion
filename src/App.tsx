import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { BestSellersCarousel } from './components/BestSellersCarousel';
import { LifestylePhotoStrip } from './components/LifestylePhotoStrip';
import { WhyUsSection } from './components/WhyUsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PurchaseSuccessPage } from './pages/PurchaseSuccessPage';
import { PageLoader } from './components/PageLoader';
import { PRODUCTS, findProductByIdOrSlug } from './data/products';
import { Product, ProductColor, CartItem, PageView, OrderDetails, AdminTab, StoreSettings } from './types';
import { 
  saveOrder, 
  getStoredProducts, 
  getStoredOrders, 
  getStoredSettings,
  isUserAdminAuthenticated, 
  logoutAdmin, 
  STORE_SYNC_EVENT,
  syncStoreWithCloud
} from './data/adminStore';
import { 
  trackPageView, 
  trackViewContent, 
  trackAddToCart, 
  trackInitiateCheckout, 
  trackPurchase,
  initAllTrackingPixels
} from './utils/metaTracker';
import { 
  getPathForView, 
  parseUrlPath, 
  navigateUrl 
} from './utils/urlRouter';

// Lazy load non-shop footer pages and Admin Panel on-demand for maximum customer performance
const LegalPoliciesPage = lazy(() => import('./components/LegalPoliciesPage'));
const OurStoryPage = lazy(() => import('./pages/OurStoryPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const ShoeCarePage = lazy(() => import('./pages/ShoeCarePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));

export default function App() {
  // Dynamic Footwear Catalog State
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());

  // Initialize navigation & route state from current URL
  const initialRoute = typeof window !== 'undefined' 
    ? parseUrlPath(window.location.pathname, window.location.search, window.location.hash) 
    : { view: 'home' as PageView };
  
  const [currentView, setCurrentView] = useState<PageView>(initialRoute.view || 'home');
  const [adminTab, setAdminTab] = useState<AdminTab>(initialRoute.adminTab || 'dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => isUserAdminAuthenticated());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    if (initialRoute.productId) {
      return findProductByIdOrSlug(initialRoute.productId) || getStoredProducts()[0] || PRODUCTS[0];
    }
    return null;
  });
  const [selectedProductColor, setSelectedProductColor] = useState<ProductColor | undefined>(() => {
    if (initialRoute.productId) {
      const prod = findProductByIdOrSlug(initialRoute.productId);
      return prod?.colors[0];
    }
    return undefined;
  });

  // Store Settings (Logo, Social, WhatsApp floating widget, etc.)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => getStoredSettings());

  // Initialize Tracking Pixels & Cloud Database Sync on Mount
  useEffect(() => {
    initAllTrackingPixels();
    syncStoreWithCloud();

    // Auto sync when window regains focus or becomes visible
    const handleFocus = () => {
      syncStoreWithCloud();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncStoreWithCloud();
      }
    };

    // Background sync interval every 15s to catch changes from other devices in real-time
    const syncInterval = setInterval(() => {
      syncStoreWithCloud();
    }, 15000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(syncInterval);
    };
  }, []);

  // Listen to Admin Store updates
  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredProducts();
      setProducts(updated);
      setStoreSettings(getStoredSettings());
      setIsAdminAuthenticated(isUserAdminAuthenticated());
      initAllTrackingPixels();
      setSelectedProduct((prev) => {
        if (!prev) return null;
        return updated.find((p) => p.id === prev.id) || prev;
      });
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  // Ensure fresh products & settings when switching views (e.g. exiting admin)
  useEffect(() => {
    const stored = getStoredProducts();
    setProducts(stored);
    setStoreSettings(getStoredSettings());
    setIsAdminAuthenticated(isUserAdminAuthenticated());
  }, [currentView]);

  // Legal Section Target
  const [legalTargetSection, setLegalTargetSection] = useState<'refund' | 'privacy' | 'terms'>(
    initialRoute.legalSection || 'refund'
  );

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jutu_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('jutu_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Promo Code State
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyDiscount = (code: string): boolean => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (code === 'SPRING20' || code === 'SAVE20') {
      setDiscountCode(code);
      setDiscountAmount(Math.round(subtotal * 0.2 * 100) / 100);
      return true;
    } else if (code === 'EARTH' || code === 'NATURE15') {
      setDiscountCode(code);
      setDiscountAmount(15);
      return true;
    } else if (code === 'FREESHIP') {
      setDiscountCode(code);
      setDiscountAmount(0);
      return true;
    }
    return false;
  };

  // Recalculate discount whenever cart items change
  useEffect(() => {
    if (discountCode) {
      handleApplyDiscount(discountCode);
    }
  }, [cartItems]);

  // Last Completed Order
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(() => {
    if (initialRoute.orderId) {
      try {
        const storedOrders = getStoredOrders();
        const found = storedOrders.find((o) => o.orderNumber === initialRoute.orderId || o.id === initialRoute.orderId);
        if (found) return found;
      } catch {
        // ignore
      }
    }
    try {
      const saved = sessionStorage.getItem('jutu_last_completed_order');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Persist current route to sessionStorage so refreshing in any context or iframe always preserves the exact page
  useEffect(() => {
    try {
      const routeData = {
        view: currentView,
        productId: currentView === 'product-detail' && selectedProduct ? selectedProduct.id : undefined,
        legalSection: currentView === 'legal-policies' ? legalTargetSection : undefined,
        orderId: currentView === 'confirmation' && completedOrder ? completedOrder.orderNumber : undefined,
        adminTab: currentView === 'admin' ? adminTab : undefined,
      };
      sessionStorage.setItem('jutu_current_route', JSON.stringify(routeData));
    } catch {
      // ignore
    }
  }, [currentView, selectedProduct, legalTargetSection, completedOrder, adminTab]);

  // Synchronize Browser History (popstate & hashchange)
  useEffect(() => {
    const handleRouteSync = () => {
      const route = parseUrlPath(window.location.pathname, window.location.search, window.location.hash);
      setCurrentView(route.view);
      if (route.adminTab) {
        setAdminTab(route.adminTab);
      }
      if (route.productId) {
        const prod = findProductByIdOrSlug(route.productId);
        if (prod) {
          setSelectedProduct(prod);
          setSelectedProductColor(prod.colors[0]);
        }
      }
      if (route.legalSection) {
        setLegalTargetSection(route.legalSection);
      }
      if (route.orderId) {
        const storedOrders = getStoredOrders();
        const found = storedOrders.find((o) => o.orderNumber === route.orderId || o.id === route.orderId);
        if (found) {
          setCompletedOrder(found);
        }
      }
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  // Update Page Title and Dispatch Meta PageView Tracking on Route Changes
  useEffect(() => {
    let pageTitle = 'JUTU Footwear — Sustainable Luxury & Ergonomic Comfort';
    
    switch (currentView) {
      case 'home':
        pageTitle = 'JUTU Footwear — Sustainable Luxury & Ergonomic Comfort';
        break;
      case 'shop-all':
        pageTitle = 'All Footwear Collection — JUTU';
        break;
      case 'men':
        pageTitle = "Men's Eco-Ergonomic Footwear — JUTU";
        break;
      case 'women':
        pageTitle = "Women's Eco-Ergonomic Footwear — JUTU";
        break;
      case 'new-arrivals':
        pageTitle = 'New Season Arrivals — JUTU';
        break;
      case 'best-sellers':
        pageTitle = 'Best Sellers Collection — JUTU';
        break;
      case 'product-detail':
        if (selectedProduct) {
          pageTitle = `${selectedProduct.name} | JUTU Bangladesh`;
        }
        break;
      case 'cart':
        pageTitle = 'Your Shopping Bag — JUTU';
        break;
      case 'checkout':
        pageTitle = 'Secure Checkout — JUTU';
        break;
      case 'confirmation':
        pageTitle = 'Order Confirmed — JUTU';
        break;
      case 'legal-policies':
        pageTitle = 'Customer Support & Exchange Policies — JUTU';
        break;
      case 'our-story':
        pageTitle = 'Our Story — JUTU Footwear';
        break;
      case 'contact-us':
        pageTitle = 'Contact Us — JUTU Dhaka';
        break;
      case 'shoe-care':
        pageTitle = 'Shoe Care & Longevity Guide — JUTU';
        break;
      case 'admin':
        pageTitle = `JUTU Admin — ${adminTab.toUpperCase()} | Logistics & Store Management`;
        break;
    }

    document.title = pageTitle;
    const currentPath = getPathForView(
      currentView, 
      selectedProduct, 
      legalTargetSection, 
      completedOrder?.orderNumber,
      currentView === 'admin' ? adminTab : undefined
    );
    trackPageView(pageTitle, currentPath);
  }, [currentView, selectedProduct, legalTargetSection, completedOrder, adminTab]);

  // Navigation Handler with URL sync
  const handleNavigate = (
    view: PageView, 
    extraSectionOrTab?: 'refund' | 'privacy' | 'terms' | AdminTab | string
  ) => {
    if (extraSectionOrTab && (extraSectionOrTab === 'refund' || extraSectionOrTab === 'privacy' || extraSectionOrTab === 'terms')) {
      setLegalTargetSection(extraSectionOrTab);
    }
    if (view === 'admin' && extraSectionOrTab && typeof extraSectionOrTab === 'string') {
      const validTabs: AdminTab[] = ['dashboard', 'products', 'orders', 'messages', 'payment-info', 'pages-content', 'settings'];
      if (validTabs.includes(extraSectionOrTab as AdminTab)) {
        setAdminTab(extraSectionOrTab as AdminTab);
      }
    }

    setCurrentView(view);

    const targetUrl = getPathForView(
      view,
      view === 'product-detail' ? selectedProduct : null,
      extraSectionOrTab && (extraSectionOrTab === 'refund' || extraSectionOrTab === 'privacy' || extraSectionOrTab === 'terms')
        ? extraSectionOrTab
        : (view === 'legal-policies' ? legalTargetSection : undefined),
      completedOrder?.orderNumber,
      view === 'admin' ? ((extraSectionOrTab as AdminTab) || adminTab) : undefined
    );
    navigateUrl(targetUrl);

    if (view === 'checkout') {
      const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      trackInitiateCheckout(cartItems, subtotal, discountAmount);
    }

    if (!extraSectionOrTab || extraSectionOrTab === 'refund' || extraSectionOrTab === 'privacy' || extraSectionOrTab === 'terms') {
      window.scrollTo(0, 0);
    }
  };

  // Open Product Detail with URL & Tracking
  const handleOpenProductDetail = (product: Product, color?: ProductColor) => {
    setSelectedProduct(product);
    const chosenColor = color || product.colors[0];
    setSelectedProductColor(chosenColor);
    setCurrentView('product-detail');

    const targetUrl = getPathForView('product-detail', product);
    navigateUrl(targetUrl);
    window.scrollTo(0, 0);

    // Track Meta ViewContent
    trackViewContent(product, chosenColor);
  };

  // Cart Handlers with Meta AddToCart Tracking
  const handleAddToCart = (product: Product, color: ProductColor, size: number, quantity = 1, openDrawer = true) => {
    const itemInstanceId = `${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemInstanceId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemInstanceId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemInstanceId,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity,
        },
      ];
    });

    if (openDrawer) {
      setCartDrawerOpen(true);
    } else {
      setCartDrawerOpen(false);
    }

    // Track Meta AddToCart Event
    trackAddToCart(product, color, size, quantity);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Order Completion with Meta Purchase Tracking
  const handleCompleteOrder = (order: OrderDetails) => {
    setCompletedOrder(order);
    try {
      sessionStorage.setItem('jutu_last_completed_order', JSON.stringify(order));
    } catch {
      // ignore
    }
    setCartItems([]);
    localStorage.removeItem('jutu_cart');
    localStorage.removeItem('allbirds_cart');

    // Persist in Admin Logistics & Pipeline
    saveOrder(order);

    // Track Meta Purchase Event with Customer Data & Value
    trackPurchase(order);

    handleNavigate('confirmation');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Intercept internal relative anchor links & keyboard shortcuts for smooth SPA navigation
  useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (
        !href ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        target.getAttribute('target') === '_blank' ||
        target.getAttribute('download') !== null
      ) {
        return;
      }

      if (href.startsWith('/') || href.startsWith('#')) {
        e.preventDefault();
        const route = parseUrlPath(
          href.startsWith('/') ? href : window.location.pathname,
          '',
          href.startsWith('#') ? href : ''
        );
        if (route.view === 'product-detail' && route.productId) {
          const prod = findProductByIdOrSlug(route.productId);
          if (prod) {
            handleOpenProductDetail(prod);
            return;
          }
        }
        handleNavigate(route.view, route.legalSection || route.adminTab);
      }
    };

    // Quick Admin keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A or Alt+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleNavigate('admin');
      } else if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleNavigate('admin');
      }
    };

    document.addEventListener('click', handleGlobalLinkClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalLinkClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dedicated Full-Screen Admin Panel Experience (Authenticated vs Login - Lazy Loaded)
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <Suspense fallback={<PageLoader />}>
          <AdminLoginPage
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
            }}
            onExitToStore={() => handleNavigate('home')}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<PageLoader />}>
        <AdminPage 
          initialTab={adminTab}
          onTabChange={(tab) => {
            setAdminTab(tab);
            navigateUrl(getPathForView('admin', null, undefined, undefined, tab));
          }}
          onExitAdmin={() => {
            setIsAdminAuthenticated(false);
            logoutAdmin();
            handleNavigate('home');
          }} 
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between selection:bg-stone-800 selection:text-white font-sans">
      
      {/* Sticky Brand Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="animate-fadeIn">
            {/* Split Hero Banner */}
            <HeroBanner onNavigate={handleNavigate} />

            {/* Category Grid Cards */}
            <CategoryGrid onNavigate={handleNavigate} />

            {/* Best Sellers Product Carousel */}
            <BestSellersCarousel
              products={products}
              onSelectProduct={handleOpenProductDetail}
              onQuickAdd={(p, c, s) => handleAddToCart(p, c, s)}
            />

            {/* Lifestyle Photo Strip */}
            <LifestylePhotoStrip onNavigate={handleNavigate} />

            {/* Why Us Section */}
            <WhyUsSection onNavigate={handleNavigate} />
          </div>
        )}

        {(currentView === 'shop-all' ||
          currentView === 'men' ||
          currentView === 'women' ||
          currentView === 'new-arrivals' ||
          currentView === 'best-sellers') && (
          <ShopPage
            currentView={currentView}
            products={products}
            onSelectProduct={handleOpenProductDetail}
            onQuickAdd={(p, c, s) => handleAddToCart(p, c, s)}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            selectedColor={selectedProductColor}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            discountAmount={discountAmount}
            onApplyDiscount={handleApplyDiscount}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            subtotal={subtotal}
            discount={discountAmount}
            discountCode={discountCode}
            onNavigate={handleNavigate}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {currentView === 'confirmation' && (
          <PurchaseSuccessPage
            order={completedOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'legal-policies' && (
          <Suspense fallback={<PageLoader />}>
            <LegalPoliciesPage 
              onNavigate={handleNavigate} 
              targetSection={legalTargetSection} 
            />
          </Suspense>
        )}

        {currentView === 'our-story' && (
          <Suspense fallback={<PageLoader />}>
            <OurStoryPage onNavigate={handleNavigate} />
          </Suspense>
        )}

        {currentView === 'contact-us' && (
          <Suspense fallback={<PageLoader />}>
            <ContactUsPage onNavigate={handleNavigate} />
          </Suspense>
        )}

        {currentView === 'shoe-care' && (
          <Suspense fallback={<PageLoader />}>
            <ShoeCarePage onNavigate={handleNavigate} />
          </Suspense>
        )}
      </main>

      {/* Dark Footer */}
      {currentView !== 'checkout' && (
        <Footer 
          onNavigate={handleNavigate} 
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNavigate={handleNavigate}
        onAddUpsell={(productId) => {
          const product = PRODUCTS.find((p) => p.id === productId);
          if (product) handleAddToCart(product, product.colors[0], 8);
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(p, c) => handleOpenProductDetail(p, c)}
      />

      {/* Floating WhatsApp Live Chat Widget (hidden on confirmation / thank you page) */}
      {currentView !== 'confirmation' && (
        <WhatsAppFloatingButton settings={storeSettings} currentView={currentView} />
      )}
    </div>
  );
}
