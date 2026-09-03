export interface ProductColor {
  name: string;
  colorCode: string;
  image: string;
  altImages?: string[];
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: string; // 'runners' | 'cruisers' | 'dashers' | 'slides' | 'loungers' | 'apparel' or any custom category
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice?: number;
  badge?: 'New' | 'Best' | 'Limited' | 'Sale' | 'NEW' | 'BEST' | 'BEST SELLER' | 'LIMITED' | 'LIMITED EDITION' | 'SALE' | string;
  colors: ProductColor[];
  images?: string[];
  sizes: number[];
  description: string;
  materials: string[];
  features: string[];
  idealFor?: string;
  buildQuality?: string;
  rating: number;
  reviewCount: number;
  stock?: number;
  isOutOfStock?: boolean;
  isArchived?: boolean;
}

export interface CartItem {
  id: string; // unique item instance id (productId + color + size)
  product: Product;
  selectedColor: ProductColor;
  selectedSize: number;
  quantity: number;
  name?: string;
  price?: number;
}

export type PageView = 
  | 'home' 
  | 'shop-all' 
  | 'men' 
  | 'women' 
  | 'new-arrivals' 
  | 'best-sellers'
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'confirmation'
  | 'legal-policies'
  | 'our-story'
  | 'contact-us'
  | 'shoe-care'
  | 'admin';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid_advance' | 'paid_full' | 'cod' | 'unpaid';

export interface OrderDetails {
  id?: string;
  orderNumber: string;
  customerName?: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: {
    id: string;
    title: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: {
    type: 'bkash' | 'nagad' | 'rocket' | 'cod' | 'card' | 'apple_pay' | 'google_pay' | 'shop_pay';
    last4?: string;
    accountNumber?: string;
    transactionId?: string;
  };
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  tax: number;
  total: number;
  carbonOffsetKg: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  advanceAmount?: number;
  advancePaid?: number;
  deliveryCharge?: number;
  notes?: string;
  courier?: string;
  trackingNumber?: string;
}

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'messages' 
  | 'payment-info' 
  | 'pages-content' 
  | 'settings';

export interface AdminMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'in-progress' | 'resolved';
  notes?: string;
}

export interface PaymentGatewayConfig {
  bkash: {
    enabled: boolean;
    type: 'merchant' | 'personal';
    accountNumber: string;
    instructions: string;
    requireAdvance?: boolean;
    advanceAmount?: number;
  };
  nagad: {
    enabled: boolean;
    type: 'merchant' | 'personal';
    accountNumber: string;
    instructions: string;
    requireAdvance?: boolean;
    advanceAmount?: number;
  };
  cod: {
    enabled: boolean;
    requireAdvance: boolean;
    advanceType?: 'delivery_charge' | 'fixed_amount';
    advanceAmount: number;
    advanceRequiredAmount?: number;
    bkashNumber?: string;
    nagadNumber?: string;
    instructions?: string;
    maxLimit?: number;
    note: string;
  };
  freeDelivery: {
    enabled: boolean;
    text?: string;
  };
  rocket?: {
    enabled: boolean;
    accountNumber: string;
    instructions: string;
  };
  bank?: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchName: string;
    routingNumber?: string;
  };
}

export interface HeroSlideItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  primaryActionLabel: string;
  primaryActionView: PageView;
  secondaryActionLabel: string;
  secondaryActionView: PageView;
}

export interface PillarItem {
  number: string;
  title: string;
  badge: string;
  description: string;
  spec: string;
  iconName: string;
}

export interface CategoryCardItem {
  id: string;
  title: string;
  bgColor: string;
  view: PageView;
  shoeImage: string;
  alt: string;
}

export interface LifestylePhotoItem {
  id: string;
  src: string;
  alt: string;
  view?: PageView;
}

export interface ValuePropItem {
  title: string;
  description: string;
}

export interface PagesContentConfig {
  announcements: string[];
  heroSlides: HeroSlideItem[];
  categoryCards: CategoryCardItem[];
  bestSellers: {
    title: string;
    subtitle?: string;
  };
  lifestylePhotos: LifestylePhotoItem[];
  valueProps: ValuePropItem[];
  whyUs: {
    badge: string;
    title: string;
    subtitle: string;
    quote: string;
    showcaseImage?: string;
    bottomCtaTitle?: string;
    bottomCtaSubtitle?: string;
    bottomCtaBtn?: string;
    pillars: PillarItem[];
  };
  ourStory: {
    eyebrow: string;
    title: string;
    lead: string;
    heroImage?: string;
    chapter1Image?: string;
    founderQuote: string;
    founderName: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
  };
  shoeCare: {
    title: string;
    subtitle: string;
    heroImage?: string;
    quickTips: { title: string; desc: string }[];
  };
  policies: {
    refundDays: number;
    supportEmail: string;
    supportPhone: string;
    exchangeAddress: string;
  };
}

export type AdminSettingsSubTab = 
  | 'header-logo' 
  | 'categories' 
  | 'security' 
  | 'telegram' 
  | 'smtp-email' 
  | 'logistics' 
  | 'marketing' 
  | 'tracking' 
  | 'footer';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  badge?: string;
  image?: string;
  active: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minOrderAmount?: number;
  expiryDate?: string;
  active: boolean;
  usageCount?: number;
}

export interface DeliveryOptionItem {
  id: string;
  title: string;
  description: string;
  price: number;
  estimatedDays: string;
  active: boolean;
  isExpress?: boolean;
  areaType?: 'dhaka' | 'outside' | 'express' | 'custom';
}

export interface StoreSettings {
  storeName: string;
  brandTagline: string;
  supportPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  showroomAddress: string;
  operatingHours: string;
  currencySymbol: string;
  currencyCode: string;
  
  // Header Logo & Branding
  headerLogoUrl: string;
  logoType: 'image' | 'text';
  desktopLogoHeight: number; // in px e.g. 54
  mobileLogoHeight: number; // in px e.g. 32
  faviconUrl: string;

  // Categories
  categories: CategoryItem[];

  // Security & Access Control
  adminEmail?: string;
  adminPassword?: string;
  adminPin: string;
  enablePinProtection: boolean;
  sessionTimeout: '15m' | '30m' | '1h' | '4h' | 'never';
  requirePinOnDelete: boolean;
  twoFactorAuth: boolean;
  ipWhitelistEnabled: boolean;
  allowedIps: string;

  // Telegram Notifications
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  telegramNotifyNewOrder: boolean;
  telegramNotifyCancelledOrder: boolean;
  telegramNotifyLowStock: boolean;
  telegramNotifyContactMessage: boolean;
  telegramSilentNotification: boolean;

  // SMTP Email Configuration
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: 'TLS' | 'SSL' | 'NONE';
  smtpUsername: string;
  smtpPassword: string;
  smtpSenderName: string;
  smtpSenderEmail: string;
  smtpReplyTo: string;
  smtpAdminAlertEmail: string;
  smtpSendOrderConfirmation: boolean;

  // Shipping & Logistics Rates
  shippingDhaka: number;
  shippingOutside: number;
  shippingExpress: number;
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;
  deliveryOptions: DeliveryOptionItem[];

  // Marketing & Coupons
  coupons: CouponItem[];
  promoBannerEnabled: boolean;
  promoBannerText: string;
  urgencyStockThreshold: number;

  // Tracking & Analytics
  metaPixelId: string;
  metaCapiToken: string;
  metaDatasetId: string;
  metaTestEventCode: string;
  gtmId: string;
  ga4Id: string;
  ga4MeasurementId?: string;
  ga4ApiSecret?: string;
  tiktokPixelId: string;
  domainVerificationMeta: string;
  customHeadScript: string;
  trackPageViewEnabled: boolean;
  trackPurchaseEnabled: boolean;
  trackAddToCartEnabled: boolean;

  // Footer & Social Channels
  footerBio: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  copyrightText: string;
  showPaymentBadges: boolean;

  // Floating WhatsApp Support
  enableWhatsAppFloating: boolean;
  whatsappFloatingNumber?: string;
  whatsappDefaultMessage?: string;
  whatsappButtonLabel?: string;
}

