import { Product, ProductColor, CartItem, OrderDetails } from '../types';

// Declare standard window tracking globals
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    gtag?: any;
    dataLayer?: any[];
    ttq?: any;
  }
}

// Cookie Helpers
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 90) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

// Retrieve or Initialize _fbp (Facebook Browser ID)
export function getOrCreateFbp(): string {
  let fbp = getCookie('_fbp');
  if (!fbp) {
    try {
      fbp = localStorage.getItem('_fbp');
    } catch {
      // ignore
    }
  }

  if (!fbp) {
    const creationTime = Date.now();
    const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
    fbp = `fb.1.${creationTime}.${randomNum}`;
    setCookie('_fbp', fbp, 90);
    try {
      localStorage.setItem('_fbp', fbp);
    } catch {
      // ignore
    }
  }
  return fbp;
}

// Retrieve or Initialize _fbc (Facebook Click ID)
export function getOrCreateFbc(): string | undefined {
  let fbc = getCookie('_fbc');
  if (!fbc) {
    try {
      fbc = localStorage.getItem('_fbc') || undefined;
    } catch {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      const creationTime = Date.now();
      fbc = `fb.1.${creationTime}.${fbclid}`;
      setCookie('_fbc', fbc, 90);
      try {
        localStorage.setItem('_fbc', fbc);
      } catch {
        // ignore
      }
    }
  }
  return fbc || undefined;
}

// Generate Unique Event ID for Deduplication between Browser Pixel & Server CAPI
export function generateEventId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `evt_${timestamp}_${random}`;
}

export interface UserDataPayload {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  street?: string;
  address?: string;
  city?: string;
  state?: string;
  division?: string;
  zipCode?: string;
  zip?: string;
  country?: string;
  external_id?: string | string[];
  fbp?: string;
  fbc?: string;
  client_ip_address?: string;
  client_user_agent?: string;
}

export interface CustomDataPayload {
  currency?: string;
  value?: number;
  content_type?: 'product' | 'product_group';
  contents?: Array<{
    id: string;
    quantity: number;
    item_price: number;
    title?: string;
    category?: string;
  }>;
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  num_items?: number;
  order_id?: string;
  transaction_id?: string;
  shipping?: number;
  tax?: number;
  coupon?: string;
  payment_type?: string;
  search_string?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Dynamically initialize pixel tags (Meta, GA4, GTM, TikTok) based on saved settings
 */
export function initAllTrackingPixels(settings?: {
  metaPixelId?: string;
  gtmId?: string;
  ga4MeasurementId?: string;
  tiktokPixelId?: string;
  domainVerificationMeta?: string;
}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Retrieve settings if not passed
  let cfg = settings;
  if (!cfg) {
    try {
      const saved = localStorage.getItem('jutu_store_settings');
      if (saved) cfg = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const metaPixelId = cfg?.metaPixelId || '3708855832582899';
  const gtmId = cfg?.gtmId;
  const ga4Id = cfg?.ga4MeasurementId;
  const tiktokPixelId = cfg?.tiktokPixelId;
  const domainMeta = cfg?.domainVerificationMeta;

  // 1. Meta Pixel Base Injection
  if (metaPixelId && !window.fbq) {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        b.head.appendChild(t);
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    if (window.fbq) {
      window.fbq('init', metaPixelId);
    }
  }

  // 2. Google Tag Manager Data Layer
  window.dataLayer = window.dataLayer || [];

  // 3. Domain Verification Meta Tag
  if (domainMeta && !document.querySelector('meta[name="facebook-domain-verification"]')) {
    const meta = document.createElement('meta');
    meta.name = 'facebook-domain-verification';
    meta.content = domainMeta;
    document.head.appendChild(meta);
  }
}

/**
 * Dispatch tracking event simultaneously across:
 * 1. Browser Meta Pixel (window.fbq)
 * 2. Backend Meta Conversions API (/api/tracking/meta-event)
 * 3. Google Tag Manager (window.dataLayer.push)
 * 4. Google Analytics 4 (window.gtag)
 * 5. TikTok Pixel (window.ttq)
 */
export async function trackMetaEvent(
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Contact' | 'Search' | 'CustomizeProduct',
  options: {
    userData?: UserDataPayload;
    customData?: CustomDataPayload;
    eventId?: string;
  } = {}
) {
  const eventId = options.eventId || generateEventId();
  const fbp = getOrCreateFbp();
  const fbc = getOrCreateFbc();

  const mergedUserData: UserDataPayload = {
    ...options.userData,
    fbp,
    fbc,
  };

  const customData = options.customData || {};
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://jutu.com';

  // 1. Browser Pixel Dispatch (window.fbq)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      // Pass Advanced Matching properties if customer data exists
      if (mergedUserData.email || mergedUserData.phone || mergedUserData.first_name) {
        window.fbq('setUserProperties', {
          em: mergedUserData.email,
          ph: mergedUserData.phone,
          fn: mergedUserData.first_name, // Full Name sent under first_name (fn)
          ct: mergedUserData.city,
          st: mergedUserData.state || mergedUserData.division,
          country: 'bd',
          external_id: Array.isArray(mergedUserData.external_id) ? mergedUserData.external_id[0] : mergedUserData.external_id,
        });
      }
      window.fbq('track', eventName, customData, { eventID: eventId });
    } catch (e) {
      console.debug('[Meta Pixel Browser]', e);
    }
  }

  // 2. Google Tag Manager & DataLayer Push
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    try {
      window.dataLayer.push({
        event: eventName,
        event_id: eventId,
        ecommerce: {
          transaction_id: customData.order_id || customData.transaction_id,
          currency: customData.currency || 'BDT',
          value: customData.value,
          shipping: customData.shipping,
          tax: customData.tax,
          coupon: customData.coupon,
          items: customData.contents?.map((c) => ({
            item_id: c.id,
            item_name: c.title,
            price: c.item_price,
            quantity: c.quantity,
            item_category: c.category,
          })),
        },
        user_data: {
          email: mergedUserData.email,
          phone_number: mergedUserData.phone,
          first_name: mergedUserData.first_name, // Full Name passed as first_name
          address: {
            street: mergedUserData.street || mergedUserData.address,
            city: mergedUserData.city,
            region: mergedUserData.state || mergedUserData.division,
            country: 'BD',
          },
          external_id: Array.isArray(mergedUserData.external_id) ? mergedUserData.external_id[0] : mergedUserData.external_id,
        },
      });
    } catch (e) {
      console.debug('[GTM DataLayer]', e);
    }
  }

  // 3. Google Analytics 4 (window.gtag)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      let gaEventName = 'view_item';
      if (eventName === 'PageView') gaEventName = 'page_view';
      else if (eventName === 'AddToCart') gaEventName = 'add_to_cart';
      else if (eventName === 'InitiateCheckout') gaEventName = 'begin_checkout';
      else if (eventName === 'Purchase') gaEventName = 'purchase';
      else if (eventName === 'Search') gaEventName = 'search';
      else if (eventName === 'Contact') gaEventName = 'generate_lead';

      window.gtag('event', gaEventName, {
        transaction_id: customData.order_id || customData.transaction_id,
        value: customData.value,
        currency: customData.currency || 'BDT',
        shipping: customData.shipping,
        tax: customData.tax,
        coupon: customData.coupon,
        items: customData.contents?.map((c) => ({
          item_id: c.id,
          item_name: c.title,
          price: c.item_price,
          quantity: c.quantity,
        })),
        user_data: {
          email: mergedUserData.email,
          phone_number: mergedUserData.phone,
        },
      });
    } catch (e) {
      console.debug('[GA4 gtag]', e);
    }
  }

  // 4. TikTok Pixel Dispatch (if configured)
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
    try {
      let ttEvent: string = eventName;
      if (eventName === 'ViewContent') ttEvent = 'ViewContent';
      else if (eventName === 'AddToCart') ttEvent = 'AddToCart';
      else if (eventName === 'InitiateCheckout') ttEvent = 'InitiateCheckout';
      else if (eventName === 'Purchase') ttEvent = 'CompletePayment';
      window.ttq.track(ttEvent, {
        content_id: customData.content_ids?.[0],
        content_type: 'product',
        value: customData.value,
        currency: customData.currency || 'BDT',
        event_id: eventId,
      });
    } catch (e) {
      console.debug('[TikTok Pixel]', e);
    }
  }

  // 4. Server-side Conversions API & GA4 MP Dispatch via /api/tracking/meta-event
  try {
    let settingsCredentials: any = {};
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('jutu_store_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          settingsCredentials = {
            dataset_id: parsed.metaPixelId,
            access_token: parsed.metaCapiToken,
            test_event_code: parsed.metaTestEventCode,
            ga4_measurement_id: parsed.ga4MeasurementId || parsed.ga4Id,
            ga4_api_secret: parsed.ga4ApiSecret,
          };
        }
      } catch {
        // ignore
      }
    }

    const res = await fetch('/api/tracking/meta-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: currentUrl,
        action_source: 'website',
        user_data: mergedUserData,
        custom_data: customData,
        ...settingsCredentials,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.debug('[Server Tracking Request Failed]', err);
    return null;
  }
}

// ----------------------------------------------------
// Specialized Meta Standard Event Helpers
// ----------------------------------------------------

/**
 * 1. PageView Event
 */
export function trackPageView(pageTitle?: string, path?: string) {
  return trackMetaEvent('PageView', {
    customData: {
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : 'JUTU Footwear'),
      page_path: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    },
  });
}

/**
 * 2. ViewContent Event (Product Detail View)
 */
export function trackViewContent(product: Product, color?: ProductColor) {
  const colorName = color ? color.name : product.colors[0]?.name || '';
  return trackMetaEvent('ViewContent', {
    customData: {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'BDT',
      contents: [
        {
          id: product.id,
          quantity: 1,
          item_price: product.price,
          title: `${product.name} - ${colorName}`,
          category: product.category,
        },
      ],
    },
  });
}

/**
 * 3. AddToCart Event
 */
export function trackAddToCart(product: Product, color: ProductColor, size: number, quantity = 1) {
  const variantId = `${product.id}-${color.name.toLowerCase().replace(/\s+/g, '-')}-${size}`;
  const totalValue = product.price * quantity;

  return trackMetaEvent('AddToCart', {
    customData: {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id, variantId],
      content_type: 'product',
      value: totalValue,
      currency: 'BDT',
      num_items: quantity,
      contents: [
        {
          id: product.id,
          quantity,
          item_price: product.price,
          title: `${product.name} (${color.name}, Size ${size})`,
          category: product.category,
        },
      ],
    },
  });
}

/**
 * 4. InitiateCheckout Event
 */
export function trackInitiateCheckout(items: CartItem[], subtotal: number, discount = 0) {
  const total = Math.max(0, subtotal - discount);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return trackMetaEvent('InitiateCheckout', {
    customData: {
      content_ids: items.map((i) => i.product.id),
      content_type: 'product',
      value: total,
      currency: 'BDT',
      num_items: totalQuantity,
      contents: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
        title: item.product.name,
        category: item.product.category,
      })),
    },
  });
}

/**
 * 5. Purchase Event (Matches exactly the fields present on the website checkout form)
 * Website Checkout Fields:
 * - Full Name (passed under first_name / fn as requested)
 * - Phone Number
 * - Email Address (optional)
 * - Full Delivery Address (address)
 * - City / District (city)
 * - Division (derived from selected district)
 * - Order Note (optional)
 */
export function trackPurchase(order: OrderDetails) {
  const items = order.items || [];
  const address = order.shippingAddress;

  // Website uses a single "Full Name" input field
  const fullName = (address.firstName || '').trim();
  const deliveryAddress = (address.address || '').trim();
  const districtCity = (address.city || '').trim();
  const division = (address.state || '').trim();
  const email = (address.email || '').trim();
  const phone = (address.phone || '').trim();

  const userData: UserDataPayload = {
    email: email || undefined,
    phone: phone || undefined,
    // Send the customer's Full Name directly under first_name (fn)
    first_name: fullName || undefined,
    full_name: fullName || undefined,
    address: deliveryAddress || undefined,
    street: deliveryAddress || undefined,
    city: districtCity || undefined,
    state: division || undefined,
    division: division || undefined,
    country: 'Bangladesh',
    external_id: order.orderNumber,
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return trackMetaEvent('Purchase', {
    userData,
    customData: {
      order_id: order.orderNumber,
      transaction_id: order.orderNumber,
      value: order.total,
      currency: 'BDT',
      shipping: order.shipping,
      tax: order.tax || 0,
      coupon: order.discountCode,
      payment_type: order.paymentMethod?.type,
      order_note: order.notes,
      num_items: totalQuantity,
      content_type: 'product',
      content_ids: items.map((i) => i.product.id),
      contents: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
        title: item.product.name,
        category: item.product.category,
      })),
    },
  });
}

/**
 * 6. Contact Event
 */
export function trackContact(formData: { name?: string; phone?: string; email?: string; subject?: string }) {
  const nameParts = (formData.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return trackMetaEvent('Contact', {
    userData: {
      first_name: firstName,
      last_name: lastName,
      email: formData.email,
      phone: formData.phone,
    },
    customData: {
      content_name: formData.subject || 'Contact Inquiry',
      status: 'submitted',
    },
  });
}

/**
 * 7. Search Event
 */
export function trackSearch(searchQuery: string, resultCount: number) {
  return trackMetaEvent('Search', {
    customData: {
      search_string: searchQuery,
      num_items: resultCount,
    },
  });
}
