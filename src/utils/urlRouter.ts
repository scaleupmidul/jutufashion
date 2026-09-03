import { PageView, Product, AdminTab } from '../types';

export interface ParsedRoute {
  view: PageView;
  productId?: string;
  legalSection?: 'refund' | 'privacy' | 'terms';
  orderId?: string;
  adminTab?: AdminTab;
}

/**
 * Maps a PageView and optional parameters to a clean, canonical URL path
 */
export function getPathForView(
  view: PageView,
  product?: Product | null | string,
  legalSection?: 'refund' | 'privacy' | 'terms',
  orderId?: string,
  adminTab?: AdminTab
): string {
  switch (view) {
    case 'home':
      return '/';
    case 'shop-all':
      return '/shop';
    case 'men':
      return '/men';
    case 'women':
      return '/women';
    case 'new-arrivals':
      return '/new-arrivals';
    case 'best-sellers':
      return '/best-sellers';
    case 'product-detail': {
      if (typeof product === 'string' && product) {
        return `/product/${product}`;
      }
      if (product && typeof product === 'object' && product.id) {
        return `/product/${product.id}`;
      }
      return '/shop';
    }
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    case 'confirmation':
      return orderId ? `/order-confirmation/${orderId}` : '/order-confirmation';
    case 'legal-policies':
      return legalSection ? `/policies/${legalSection}` : '/policies';
    case 'our-story':
      return '/our-story';
    case 'contact-us':
      return '/contact-us';
    case 'shoe-care':
      return '/shoe-care';
    case 'admin':
      if (adminTab && adminTab !== 'dashboard') {
        return `/admin/${adminTab}`;
      }
      return '/admin';
    default:
      return '/';
  }
}

/**
 * Parses the current pathname into a structured PageView state
 */
export function parseUrlPath(
  pathname = typeof window !== 'undefined' ? window.location.pathname : '/',
  search = typeof window !== 'undefined' ? window.location.search : '',
  hash = typeof window !== 'undefined' ? window.location.hash : ''
): ParsedRoute {
  let cleanPath = (pathname || '/').trim();

  // Support Hash routing fallback (e.g. /#/shop or #/men or #shop)
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '/').trim();
    if (cleanHash && cleanHash !== '/') {
      cleanPath = cleanHash;
    }
  }

  // Remove trailing slashes (except root '/')
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.replace(/\/+$/, '');
  }

  // Case-insensitive clean comparison
  const lowerPath = cleanPath.toLowerCase();

  // Also check query param fallback ?view=shop or ?page=men or ?view=product-detail&id=123
  if (search) {
    try {
      const params = new URLSearchParams(search);
      const viewParam = (params.get('view') || params.get('page'))?.toLowerCase();
      const idParam = params.get('id') || params.get('productId');
      const legalParam = (params.get('legal') || params.get('section'))?.toLowerCase() as 'refund' | 'privacy' | 'terms' | null;
      const tabParam = params.get('tab') as AdminTab | null;
      const orderParam = params.get('order') || params.get('orderId');

      // Direct admin / login query triggers
      if (params.has('admin') || params.has('login') || params.has('dashboard')) {
        return { view: 'admin', adminTab: (tabParam || 'dashboard') as AdminTab };
      }

      if (viewParam) {
        if (viewParam === 'product-detail' || viewParam === 'product') {
          return { view: 'product-detail', productId: idParam || undefined };
        }
        if (viewParam === 'legal-policies' || viewParam === 'policies' || viewParam === 'policy') {
          return { view: 'legal-policies', legalSection: legalParam || 'refund' };
        }
        if (viewParam === 'admin' || viewParam === 'login' || viewParam === 'dashboard') {
          return { view: 'admin', adminTab: tabParam || 'dashboard' };
        }
        if (viewParam === 'confirmation' || viewParam === 'order-confirmation') {
          return { view: 'confirmation', orderId: orderParam || undefined };
        }
        if (['home', 'shop-all', 'men', 'women', 'new-arrivals', 'best-sellers', 'cart', 'checkout', 'our-story', 'contact-us', 'shoe-care'].includes(viewParam)) {
          return { view: viewParam as PageView };
        }
      }
    } catch {
      // ignore
    }
  }

  // Check localStorage session fallback if still on root / (e.g., in nested iframes where pathname doesn't propagate)
  if (cleanPath === '/' && typeof window !== 'undefined') {
    try {
      const savedRouteStr = sessionStorage.getItem('jutu_current_route');
      if (savedRouteStr) {
        const parsed = JSON.parse(savedRouteStr);
        if (parsed && parsed.view && parsed.view !== 'home') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  // 1. Home
  if (lowerPath === '/' || lowerPath === '/home' || lowerPath === '/index.html') {
    return { view: 'home' };
  }

  // 2. Shop Collections
  if (lowerPath === '/shop' || lowerPath === '/shop-all' || lowerPath === '/catalog' || lowerPath === '/collection' || lowerPath === '/products') {
    return { view: 'shop-all' };
  }

  if (lowerPath === '/men' || lowerPath === '/mens' || lowerPath === '/men-footwear') {
    return { view: 'men' };
  }

  if (lowerPath === '/women' || lowerPath === '/womens' || lowerPath === '/women-footwear') {
    return { view: 'women' };
  }

  if (lowerPath === '/new-arrivals' || lowerPath === '/new' || lowerPath === '/latest') {
    return { view: 'new-arrivals' };
  }

  if (lowerPath === '/best-sellers' || lowerPath === '/bestsellers' || lowerPath === '/trending') {
    return { view: 'best-sellers' };
  }

  // 3. Product Details
  if (lowerPath.startsWith('/product/') || lowerPath.startsWith('/shoes/') || lowerPath.startsWith('/footwear/')) {
    const rawId = cleanPath.split('/')[2] || '';
    return { view: 'product-detail', productId: decodeURIComponent(rawId) };
  }

  // 4. Cart & Checkout
  if (lowerPath === '/cart' || lowerPath === '/bag') {
    return { view: 'cart' };
  }

  if (lowerPath === '/checkout') {
    return { view: 'checkout' };
  }

  // 5. Order Confirmation
  if (lowerPath.startsWith('/order-confirmation') || lowerPath.startsWith('/confirmation') || lowerPath.startsWith('/order-success')) {
    const parts = cleanPath.split('/');
    const orderId = parts[2] ? decodeURIComponent(parts[2]) : undefined;
    return { view: 'confirmation', orderId };
  }

  // 6. Legal & Policies
  if (lowerPath.startsWith('/policies') || lowerPath.startsWith('/policy')) {
    const parts = lowerPath.split('/');
    const section = (parts[2] as 'refund' | 'privacy' | 'terms') || 'refund';
    return { view: 'legal-policies', legalSection: section };
  }

  if (lowerPath === '/refund-policy' || lowerPath === '/exchange' || lowerPath === '/refund') {
    return { view: 'legal-policies', legalSection: 'refund' };
  }

  if (lowerPath === '/privacy-policy' || lowerPath === '/privacy') {
    return { view: 'legal-policies', legalSection: 'privacy' };
  }

  if (lowerPath === '/terms-of-service' || lowerPath === '/terms' || lowerPath === '/tos') {
    return { view: 'legal-policies', legalSection: 'terms' };
  }

  // 7. Informational Pages
  if (lowerPath === '/our-story' || lowerPath === '/about' || lowerPath === '/about-us' || lowerPath === '/story') {
    return { view: 'our-story' };
  }

  if (lowerPath === '/contact' || lowerPath === '/contact-us' || lowerPath === '/support') {
    return { view: 'contact-us' };
  }

  if (lowerPath === '/shoe-care' || lowerPath === '/care-guide' || lowerPath === '/shoe-care-guide' || lowerPath === '/care') {
    return { view: 'shoe-care' };
  }

  // 8. Admin Portal & Sub-Tabs
  if (
    lowerPath === '/admin' || 
    lowerPath.startsWith('/admin/') || 
    lowerPath === '/login' || 
    lowerPath === '/admin-login' ||
    lowerPath === '/portal' ||
    lowerPath === '/admin-portal'
  ) {
    const subPath = lowerPath.replace(/^\/(admin-login|admin-portal|portal|admin|login)/, '').replace(/^\//, '');
    let adminTab: AdminTab = 'dashboard';

    if (subPath === 'products' || subPath === 'inventory') {
      adminTab = 'products';
    } else if (subPath === 'orders' || subPath === 'logistics') {
      adminTab = 'orders';
    } else if (subPath === 'messages' || subPath === 'inbox' || subPath === 'inquiries') {
      adminTab = 'messages';
    } else if (subPath === 'payment-info' || subPath === 'payments' || subPath === 'payment' || subPath === 'gateway') {
      adminTab = 'payment-info';
    } else if (subPath === 'pages-content' || subPath === 'pages' || subPath === 'content') {
      adminTab = 'pages-content';
    } else if (subPath === 'settings' || subPath === 'store-settings' || subPath === 'config') {
      adminTab = 'settings';
    }

    return { view: 'admin', adminTab };
  }

  return { view: 'home' };
}

/**
 * Updates the browser address bar cleanly without page reloading
 */
export function navigateUrl(path: string, replace = false) {
  if (typeof window === 'undefined') return;

  try {
    const currentPath = window.location.pathname;
    if (currentPath === path && !window.location.hash) return;

    if (replace) {
      window.history.replaceState({ path }, '', path);
    } else {
      window.history.pushState({ path }, '', path);
    }
  } catch {
    // In strict cross-origin iframe security fallback, update hash
    try {
      if (path !== '/') {
        window.location.hash = path;
      }
    } catch {
      // ignore
    }
  }
}
