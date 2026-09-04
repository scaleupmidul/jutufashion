import { 
  OrderDetails, 
  Product, 
  CartItem,
  ProductColor,
  AdminMessage, 
  PaymentGatewayConfig, 
  PagesContentConfig, 
  StoreSettings,
  CategoryItem,
  DeliveryOptionItem,
  OrderStatus,
  PaymentStatus 
} from '../types';
import { formatBadge } from '../utils/badge';
import { PRODUCTS } from './products';
import { SHOE_IMAGES } from './shoeImages';

// LocalStorage Keys
const KEYS = {
  ORDERS: 'jutu_admin_orders_v2',
  PRODUCTS: 'jutu_admin_products_v2',
  DELETED_PRODUCTS: 'jutu_admin_deleted_products_v2',
  MESSAGES: 'jutu_admin_messages_v2',
  PAYMENT_CONFIG: 'jutu_admin_payment_config_v2',
  PAGES_CONTENT: 'jutu_admin_pages_content_v2',
  SETTINGS: 'jutu_admin_settings_v2',
};

// Event name for reactive state updates across components
export const STORE_SYNC_EVENT = 'jutu_admin_store_sync';

export function triggerStoreSync() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORE_SYNC_EVENT));
  }
}

// Initial Sample Orders matching luxury brand metrics
export const INITIAL_ORDERS: OrderDetails[] = [
  {
    id: 'ord_8941690',
    orderNumber: '#8941690',
    date: '2026-08-24',
    status: 'pending',
    paymentStatus: 'paid_advance',
    advanceAmount: 200,
    subtotal: 2400,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 2400,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: 'MIDUL HASAN',
      lastName: 'MAHADI',
      email: 'midul.hasan@example.com',
      phone: '+8801900000000',
      address: 'House 42, Road 11, Block D, Banani',
      apartment: 'Flat 5A',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1213',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'dhaka-standard',
      title: 'Inside Dhaka City',
      price: 0,
      estimatedDays: '1-2 business days',
    },
    paymentMethod: {
      type: 'bkash',
      accountNumber: '01900000000',
      transactionId: 'TRX98214KJA9',
    },
    items: [
      {
        id: 'runner-nz-slip-on-anthracite-42',
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 42,
        quantity: 1,
      },
    ],
    notes: 'Please call before delivery. Ring bell twice.',
  },
  {
    id: 'ord_8151478',
    orderNumber: '#8151478',
    date: '2026-08-20',
    status: 'pending',
    paymentStatus: 'paid_advance',
    advanceAmount: 200,
    subtotal: 2400,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 2400,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: 'নাসিফ',
      lastName: '.',
      email: 'nasif.ctg@example.com',
      phone: '01885479477',
      address: 'GEC Circle, Nasirabad Housing Society',
      apartment: 'Building 7, 3rd Floor',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4000',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'outside-dhaka',
      title: 'Outside Dhaka (All Bangladesh)',
      price: 130,
      estimatedDays: '2-3 business days',
    },
    paymentMethod: {
      type: 'nagad',
      accountNumber: '01885479477',
      transactionId: 'NAG782190LK',
    },
    items: [
      {
        id: 'canvas-cruiser-sea-spray-41',
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 41,
        quantity: 1,
      },
    ],
    notes: 'Advance ৳200 paid via Nagad.',
  },
  {
    id: 'ord_2478101',
    orderNumber: '#2478101',
    date: '2026-08-18',
    status: 'pending',
    paymentStatus: 'paid_advance',
    advanceAmount: 200,
    subtotal: 999,
    discount: 0,
    shipping: 80,
    tax: 0,
    total: 1079,
    carbonOffsetKg: 2.3,
    shippingAddress: {
      firstName: 'MIDUL HASAN',
      lastName: 'MAHADI',
      email: 'midul.hasan@example.com',
      phone: '+8801900000000',
      address: 'House 14, Road 7, Dhanmondi',
      apartment: '4th Floor',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1205',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'dhaka-standard',
      title: 'Inside Dhaka City',
      price: 80,
      estimatedDays: '1-2 business days',
    },
    paymentMethod: {
      type: 'bkash',
      accountNumber: '01900000000',
      transactionId: 'BK829104LA',
    },
    items: [
      {
        id: 'jutu-slide-anthracite-43',
        product: PRODUCTS[1] || PRODUCTS[0],
        selectedColor: (PRODUCTS[1] || PRODUCTS[0]).colors[0],
        selectedSize: 43,
        quantity: 1,
      },
    ],
    notes: 'Send in discrete luxury packaging.',
  },
  {
    id: 'ord_9021455',
    orderNumber: '#9021455',
    date: '2026-08-28',
    status: 'confirmed',
    paymentStatus: 'paid_full',
    subtotal: 5700,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 5700,
    carbonOffsetKg: 9.2,
    shippingAddress: {
      firstName: 'Tanvir',
      lastName: 'Ahmed',
      email: 'tanvir.ahmed@example.com',
      phone: '+880 1712-345678',
      address: 'House 28, Road 4, Gulshan-1',
      apartment: 'Apt 6B',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1212',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'express-dhaka',
      title: 'Same Day Express Delivery (Dhaka)',
      price: 0,
      estimatedDays: 'Within 24 hours',
    },
    paymentMethod: {
      type: 'bkash',
      accountNumber: '01712345678',
      transactionId: 'BK9948210X',
    },
    items: [
      {
        id: 'wool-runner-pro-charcoal-42',
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 42,
        quantity: 2,
      },
    ],
    notes: 'Deliver before 6 PM.',
  },
  {
    id: 'ord_7712390',
    orderNumber: '#7712390',
    date: '2026-08-27',
    status: 'processing',
    paymentStatus: 'paid_advance',
    advanceAmount: 200,
    subtotal: 3200,
    discount: 0,
    shipping: 130,
    tax: 0,
    total: 3330,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: 'Farhana',
      lastName: 'Rahman',
      email: 'farhana.r@example.com',
      phone: '01911223344',
      address: 'Subidbazar, VIP Road',
      apartment: 'Green Villa, 2nd Floor',
      city: 'Sylhet',
      state: 'Sylhet Division',
      zipCode: '3100',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'outside-dhaka',
      title: 'Outside Dhaka (All Bangladesh)',
      price: 130,
      estimatedDays: '2-3 business days',
    },
    paymentMethod: {
      type: 'nagad',
      accountNumber: '01911223344',
      transactionId: 'NG8301982Z',
    },
    items: [
      {
        id: 'tree-dasher-luxe-mist-38',
        product: PRODUCTS[2] || PRODUCTS[0],
        selectedColor: (PRODUCTS[2] || PRODUCTS[0]).colors[0],
        selectedSize: 38,
        quantity: 1,
      },
    ],
    notes: 'Size 38 checked for fit.',
  },
  {
    id: 'ord_6401928',
    orderNumber: '#6401928',
    date: '2026-08-25',
    status: 'shipped',
    paymentStatus: 'paid_full',
    courier: 'Steadfast Courier',
    trackingNumber: 'STF-8849201',
    subtotal: 4800,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 4800,
    carbonOffsetKg: 9.2,
    shippingAddress: {
      firstName: 'Sadia',
      lastName: 'Islam',
      email: 'sadia.islam@example.com',
      phone: '01678123456',
      address: 'House 8, Road 2, Sector 3, Uttara',
      apartment: 'Flat 3A',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1230',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'dhaka-standard',
      title: 'Inside Dhaka City',
      price: 0,
      estimatedDays: '1-2 business days',
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
    },
    items: [
      {
        id: 'runner-nz-sea-spray-39',
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 39,
        quantity: 1,
      },
    ],
  },
  {
    id: 'ord_5192834',
    orderNumber: '#5192834',
    date: '2026-08-22',
    status: 'delivered',
    paymentStatus: 'cod',
    courier: 'Pathao Logistics',
    trackingNumber: 'PTH-9021849',
    subtotal: 2850,
    discount: 0,
    shipping: 80,
    tax: 0,
    total: 2930,
    carbonOffsetKg: 4.6,
    shippingAddress: {
      firstName: 'Rafiqul',
      lastName: 'Hassan',
      email: 'rafiq.hassan@example.com',
      phone: '01819876543',
      address: 'KDA Avenue, Sonadanga',
      city: 'Khulna',
      state: 'Khulna Division',
      zipCode: '9100',
      country: 'Bangladesh',
    },
    shippingMethod: {
      id: 'outside-dhaka',
      title: 'Outside Dhaka (All Bangladesh)',
      price: 80,
      estimatedDays: '2-3 business days',
    },
    paymentMethod: {
      type: 'cod',
    },
    items: [
      {
        id: 'canvas-cruiser-anthracite-44',
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 44,
        quantity: 1,
      },
    ],
  },
];

// Initial Payment Configuration
export const INITIAL_PAYMENT_CONFIG: PaymentGatewayConfig = {
  bkash: {
    enabled: true,
    type: 'merchant',
    accountNumber: '01900000000',
    instructions: 'Go to your bKash App or dial *247# -> Choose "Make Payment" -> Enter Merchant Number 01900000000 -> Enter Amount -> Enter Reference: Order ID -> Enter PIN to confirm.',
    requireAdvance: true,
    advanceAmount: 200,
  },
  nagad: {
    enabled: true,
    type: 'merchant',
    accountNumber: '01885479477',
    instructions: 'Go to Nagad App or dial *167# -> Choose "Merchant Pay" -> Enter 01885479477 -> Enter Amount -> Reference: Order ID -> Enter PIN.',
    requireAdvance: true,
    advanceAmount: 200,
  },
  cod: {
    enabled: true,
    requireAdvance: false,
    advanceType: 'fixed_amount',
    advanceAmount: 150,
    advanceRequiredAmount: 0,
    bkashNumber: '01900000000',
    nagadNumber: '01885479477',
    maxLimit: 15000,
    instructions: 'অর্ডার কনফার্ম করতে অনুগ্রহ করে উপরের বিকাশ বা নগদ নম্বরে ডেলিভারি চার্জ {amount} টাকা Send Money / Payment করুন এবং নিচের ঘরে আপনার ফোন নম্বর ও TrxID দিন। বাকি টাকা ডেলিভারির সময় ক্যাশে পরিশোধ করবেন।',
    note: 'Pay with cash upon delivery.',
  },
  freeDelivery: {
    enabled: true,
    text: 'Free delivery all over Bangladesh',
  },
};

// Initial Pages Content Configuration
export const INITIAL_PAGES_CONTENT: PagesContentConfig = {
  announcements: [
    'Fast 2-4 days nationwide express delivery across Bangladesh',
    'Free delivery all over Bangladesh • Easy Size Exchange',
    'Sustainable footwear crafted with premium natural wool & tree fiber',
  ],
  heroSlides: [
    {
      id: 'dasher-nz',
      eyebrow: 'ALL NEW COLLECTION',
      title: 'Wildly Comfortable.\nBuilt For Everyday.',
      subtitle: 'Engineered with merino wool and responsive sugarcane SweetFoam® cushioning.',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=2200&q=88',
      primaryActionLabel: 'SHOP MEN',
      primaryActionView: 'men',
      secondaryActionLabel: 'SHOP WOMEN',
      secondaryActionView: 'women',
    },
    {
      id: 'wool-runners',
      eyebrow: 'SIGNATURE FOOTWEAR',
      title: 'Modern Style,\nUnmatched Comfort.',
      subtitle: 'Soft, breathable, temperature-regulating natural merino fibers.',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=2200&q=88',
      primaryActionLabel: 'SHOP MEN',
      primaryActionView: 'men',
      secondaryActionLabel: 'SHOP WOMEN',
      secondaryActionView: 'women',
    },
    {
      id: 'tree-flyer',
      eyebrow: 'LIGHTWEIGHT PERFORMANCE',
      title: 'Lighter On Feet.\nBuilt To Perform.',
      subtitle: 'Breezy eucalyptus tree fiber upper with high-energy rebound sole.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2200&q=88',
      primaryActionLabel: 'SHOP RUNNING',
      primaryActionView: 'new-arrivals',
      secondaryActionLabel: 'EXPLORE ALL',
      secondaryActionView: 'men',
    },
    {
      id: 'everyday-comfort',
      eyebrow: 'PREMIUM COMFORT GUARANTEED',
      title: 'The Most Comfortable\nShoes For Everyday.',
      subtitle: 'Minimalist luxury aesthetic that effortlessly elevates your everyday looks.',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=2200&q=88',
      primaryActionLabel: 'SHOP MEN',
      primaryActionView: 'men',
      secondaryActionLabel: 'SHOP WOMEN',
      secondaryActionView: 'women',
    },
  ],
  categoryCards: [
    {
      id: 'cat-new-arrivals',
      title: 'NEW ARRIVALS',
      bgColor: '#5b7588',
      view: 'new-arrivals',
      shoeImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
      alt: 'New Arrivals Shoe',
    },
    {
      id: 'cat-mens',
      title: 'MENS',
      bgColor: '#5a5d5d',
      view: 'men',
      shoeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      alt: 'Mens Collection Shoe',
    },
    {
      id: 'cat-womens',
      title: 'WOMENS',
      bgColor: '#8e6c71',
      view: 'women',
      shoeImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      alt: 'Womens Collection Shoe',
    },
    {
      id: 'cat-best-sellers',
      title: 'BEST SELLERS',
      bgColor: '#788a7c',
      view: 'best-sellers',
      shoeImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
      alt: 'Best Sellers Shoe',
    },
  ],
  bestSellers: {
    title: 'BEST SELLERS',
    subtitle: 'Crafted for Every Move',
  },
  lifestylePhotos: [
    {
      id: 'photo-1',
      src: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      alt: 'JUTU Comfort Slides on concrete',
      view: 'shop-all',
    },
    {
      id: 'photo-2',
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      alt: 'Smiling woman wearing JUTU apparel in nature',
      view: 'shop-all',
    },
    {
      id: 'photo-3',
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      alt: 'Casual lifestyle with JUTU slip-on shoes',
      view: 'shop-all',
    },
    {
      id: 'photo-4',
      src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      alt: 'White socks and JUTU sneakers stepping outdoors',
      view: 'shop-all',
    },
  ],
  valueProps: [
    {
      title: 'WEAR ALL DAY COMFORT',
      description: 'Lightweight, bouncy, and wildly comfortable, JUTU shoes make any outing feel effortless. Slip in, lace up, or slide them on and enjoy the comfy support.',
    },
    {
      title: 'DESIGNED FOR EVERYDAY WEAR',
      description: 'Easy-to-wear styles made for daily routines, weekend plans, travel, and everything in between.',
    },
    {
      title: 'PREMIUM QUALITY & DURABILITY',
      description: 'Engineered with high-grade breathable uppers, reinforced stitching, and anti-slip outsoles designed to last through every daily step and long walk.',
    },
  ],
  whyUs: {
    badge: 'THE CRAFT & COMFORT',
    title: 'Why Choose Our Footwear',
    subtitle: 'From renewable materials to ergonomic engineering, every pair is designed for all-day lightness and effortless elegance.',
    quote: 'Wildly comfortable from the very first step.',
    showcaseImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    bottomCtaTitle: 'Ready to experience the comfort?',
    bottomCtaSubtitle: 'Explore our lightweight shoes and new arrivals.',
    bottomCtaBtn: 'Explore Collection',
    pillars: [
      {
        number: '01',
        title: 'Anatomic Cushioning',
        badge: 'ALL-DAY COMFORT',
        description: 'Contoured arch support and shock-absorbing soles for cloud-like comfort.',
        spec: '38mm Ergonomic Drop',
        iconName: 'Sparkles',
      },
      {
        number: '02',
        title: 'Everyday Versatility',
        badge: 'DAILY ESSENTIALS',
        description: 'Easy slip-ons and lace-ups crafted for work, travel, and daily routines.',
        spec: 'Micro-Knit Airflow Matrix',
        iconName: 'Compass',
      },
      {
        number: '03',
        title: 'Breathable & Durable',
        badge: 'CRAFTSMANSHIP',
        description: 'High-grade breathable uppers and non-slip outsoles engineered to last.',
        spec: '17.5 Micron ZQ Wool',
        iconName: 'Layers',
      },
      {
        number: '04',
        title: 'Nationwide Delivery',
        badge: 'FAST SERVICE',
        description: 'Cash on Delivery across Bangladesh within 24–72 hours with sizing support.',
        spec: 'Reinforced Fiber Lock',
        iconName: 'Truck',
      },
    ],
  },
  ourStory: {
    eyebrow: 'OUR PHILOSOPHY & CRAFT',
    title: 'Footwear Reimagined With Nature',
    lead: 'We started JUTU with a simple question: why are modern shoes dominated by synthetic plastics and toxic petroleum when nature already offers superior materials?',
    heroImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1800&q=85',
    chapter1Image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    founderQuote: 'Nature is our greatest designer. By blending renewable wool, sugarcane, and tree fiber, we created the world’s most comfortable walking footwear.',
    founderName: 'Midul Hasan — Founder & Lead Designer',
    stat1Number: '100%',
    stat1Label: 'Carbon Neutral Footprint',
    stat2Number: '0.0%',
    stat2Label: 'Synthetic Microplastics Upper',
    stat3Number: '70+',
    stat3Label: 'Comfort Testing Iterations',
  },
  shoeCare: {
    title: 'How to Care for Your Footwear',
    subtitle: 'Keep your shoes fresh, crisp, and comfortable for years with our easy care and washing instructions.',
    heroImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80',
    quickTips: [
      { title: 'Remove Insoles & Laces', desc: 'Pull out the insoles and unlace your shoes before washing to preserve the foam bounce.' },
      { title: 'Cold Water Gentle Cycle', desc: 'Place shoes in a mesh delicates bag and wash on cold/wool setting with mild detergent.' },
      { title: 'Air Dry in Shade', desc: 'Never put your shoes in a hot dryer. Allow them to air dry naturally away from direct heat.' },
      { title: 'Quick Spot Clean', desc: 'For minor scuffs, use a damp cloth or soft bristle brush with warm water and soap.' },
    ],
  },
  policies: {
    refundDays: 7,
    supportEmail: 'care@jutufootwear.com',
    supportPhone: '+880 1900-000000',
    exchangeAddress: 'JUTU Returns Hub, Level 4, House 12, Road 11, Banani, Dhaka-1213',
  },
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'runners', name: 'Runners', slug: 'runners', badge: 'BEST SELLER', active: true, sortOrder: 1, productCount: 8, description: 'Everyday running, walking, and knit trainers' },
  { id: 'cruisers', name: 'Cruisers', slug: 'cruisers', badge: 'NEW', active: true, sortOrder: 2, productCount: 7, description: 'Classic canvas sneakers and casual slip-ons' },
  { id: 'slides', name: 'Slides', slug: 'slides', badge: 'SUMMER HIT', active: true, sortOrder: 3, productCount: 7, description: 'Comfort cushioned slides, flip-flops & recovery sandals' },
  { id: 'dashers', name: 'Dashers', slug: 'dashers', badge: 'PRO RUN', active: true, sortOrder: 4, productCount: 5, description: 'High-performance athletic running and gym footwear' },
  { id: 'loungers', name: 'Loungers', slug: 'loungers', badge: 'SLIP-ON', active: true, sortOrder: 5, productCount: 2, description: 'Plush slip-on loafers for everyday comfort' },
];

export const DEFAULT_DELIVERY_OPTIONS: DeliveryOptionItem[] = [
  {
    id: 'dhaka-standard',
    title: 'Inside Dhaka City',
    description: 'Standard courier delivery across Dhaka',
    price: 80,
    estimatedDays: '1-2 business days',
    active: true,
    areaType: 'dhaka',
  },
  {
    id: 'outside-dhaka',
    title: 'Outside Dhaka (All Bangladesh)',
    description: 'Doorstep courier delivery across Bangladesh',
    price: 130,
    estimatedDays: '2-4 business days',
    active: true,
    areaType: 'outside',
  },
  {
    id: 'express-dhaka',
    title: 'Same Day Express Delivery (Dhaka)',
    description: 'Rush courier dispatch within 24 hours',
    price: 150,
    estimatedDays: 'Same day (within 24 hours)',
    active: true,
    isExpress: true,
    areaType: 'express',
  },
];

// Initial Store Settings
export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'JUTU',
  brandTagline: 'Sustainable Luxury Footwear Crafted with Natural Materials',
  supportPhone: '+880 1900-000000',
  whatsappNumber: '+880 1900-000000',
  supportEmail: 'care@jutufootwear.com',
  showroomAddress: 'Level 4, House 12, Road 11, Banani, Dhaka-1213',
  operatingHours: 'Saturday – Thursday: 10:00 AM – 8:00 PM',
  currencySymbol: '৳',
  currencyCode: 'BDT',

  // Header Logo & Branding (Matches UI configuration in screenshot)
  headerLogoUrl: 'https://res.cloudinary.com/dcb45s5ib/image/upload/f_auto,q_auto,dpr_auto,fl_strip_profile,w_auto,c_limit/v1785177020/Untitled_design_2_o9mksx.png',
  logoType: 'image',
  desktopLogoHeight: 54,
  mobileLogoHeight: 32,
  faviconUrl: '',

  // Categories Taxonomy
  categories: DEFAULT_CATEGORIES,

  // Security & Access Control
  adminEmail: 'jutufashion@gmail.com',
  adminPassword: 'jutu.fashion',
  adminPin: '1234',
  enablePinProtection: true,
  sessionTimeout: '1h',
  requirePinOnDelete: true,
  twoFactorAuth: false,
  ipWhitelistEnabled: false,
  allowedIps: '103.145.12.1, 103.205.71.18',

  // Telegram Notifications (🔔 Live Order Dispatch)
  telegramEnabled: true,
  telegramBotToken: '7482910482:AAHp9Q8L9dK1L_xR3M7q2V68e',
  telegramChatId: '-1001984729184',
  telegramNotifyNewOrder: true,
  telegramNotifyCancelledOrder: true,
  telegramNotifyLowStock: true,
  telegramNotifyContactMessage: true,
  telegramSilentNotification: false,

  // SMTP Email Configuration
  smtpEnabled: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpEncryption: 'TLS',
  smtpUsername: 'orders@jutufootwear.com',
  smtpPassword: '••••••••••••••••',
  smtpSenderName: 'JUTU Footwear Bangladesh',
  smtpSenderEmail: 'orders@jutufootwear.com',
  smtpReplyTo: 'care@jutufootwear.com',
  smtpAdminAlertEmail: 'scaleup.midul@gmail.com',
  smtpSendOrderConfirmation: true,

  // Shipping & Logistics Rates
  shippingDhaka: 80,
  shippingOutside: 130,
  shippingExpress: 150,
  freeShippingThreshold: 2000,
  freeShippingEnabled: true,
  deliveryOptions: DEFAULT_DELIVERY_OPTIONS,

  // Marketing & Coupons
  coupons: [
    { id: 'cpn-1', code: 'JUTU10', discountType: 'percentage', discountAmount: 10, minOrderAmount: 2000, active: true, usageCount: 42 },
    { id: 'cpn-2', code: 'FIRSTPAIR', discountType: 'fixed', discountAmount: 200, minOrderAmount: 2400, active: true, usageCount: 18 },
    { id: 'cpn-3', code: 'FREESHIP', discountType: 'fixed', discountAmount: 130, minOrderAmount: 3000, active: true, usageCount: 65 },
  ],
  promoBannerEnabled: true,
  promoBannerText: 'Fast 2-4 days nationwide express delivery across Bangladesh • Free Shipping over ৳2,000',
  urgencyStockThreshold: 3,

  // Tracking & Analytics Pixels
  metaPixelId: '102948172948201',
  metaCapiToken: 'EAAG9Q...AQB582941094',
  metaDatasetId: '102948172948201',
  metaTestEventCode: '',
  gtmId: 'GTM-JT7892K',
  ga4Id: 'G-74892KLA89',
  ga4MeasurementId: 'G-74892KLA89',
  ga4ApiSecret: '',
  tiktokPixelId: 'C789201LAK92',
  domainVerificationMeta: 'f4829k1ls829472kals',
  customHeadScript: '<!-- JUTU Core Head Injection Script -->',
  trackPageViewEnabled: true,
  trackPurchaseEnabled: true,
  trackAddToCartEnabled: true,

  // Footer & Social Channels
  footerBio: 'Crafting the world\'s most comfortable, sustainable footwear from New Zealand merino wool, eucalyptus tree fiber, and sugarcane sweetfoam.',
  facebookUrl: 'https://facebook.com/jutufootwear',
  instagramUrl: 'https://instagram.com/jutufootwear',
  tiktokUrl: 'https://tiktok.com/@jutufootwear',
  youtubeUrl: 'https://youtube.com/@jutufootwear',
  linkedinUrl: 'https://linkedin.com/company/jutu',
  copyrightText: '© 2026 JUTU Inc. All Rights Reserved. Banani, Dhaka.',
  showPaymentBadges: true,

  // Floating WhatsApp Support
  enableWhatsAppFloating: true,
  whatsappFloatingNumber: '+880 1900-000000',
  whatsappDefaultMessage: 'Hello JUTU Footwear, I would like to know more about your products.',
  whatsappButtonLabel: 'Chat with us',
};

// Initial Sample Messages / Inquiries
export const INITIAL_MESSAGES: AdminMessage[] = [
  {
    id: 'msg_1',
    name: 'Midul Hasan Mahadi',
    phone: '+8801900000000',
    email: 'midul.hasan@example.com',
    subject: 'Size exchange question for Wool Runner',
    message: 'Hello, I ordered Size 42 but I normally wear 42.5 in Nike. Does this model run true to size or should I size up?',
    date: '2026-08-29 11:20 AM',
    status: 'new',
  },
  {
    id: 'msg_2',
    name: 'Sarah Khan',
    phone: '01711223344',
    email: 'sarah.k@example.com',
    subject: 'Showroom Visit & Trying Shoes',
    message: 'Hi team, is the Banani showroom open on Fridays? I want to visit with my family to try on the Canvas Cruisers.',
    date: '2026-08-28 04:15 PM',
    status: 'in-progress',
    notes: 'Informed Friday hours are 3:00 PM - 9:00 PM.',
  },
  {
    id: 'msg_3',
    name: 'Kamrul Ahsan',
    phone: '01819876543',
    email: 'kamrul.a@example.com',
    subject: 'Corporate / Bulk Order Inquiry',
    message: 'We are looking to gift 50 pairs of sustainable footwear for our executive leadership team. Can you provide custom branding or corporate discounts?',
    date: '2026-08-27 09:30 AM',
    status: 'resolved',
    notes: 'Sent executive catalog and 15% corporate tier proposal.',
  },
];

// --- Order Store Helper Functions ---

export function normalizeOrder(order: any): OrderDetails {
  if (!order || typeof order !== 'object') {
    return {
      orderNumber: `#ORD-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      items: [],
      shippingAddress: {
        firstName: 'Valued',
        lastName: 'Customer',
        email: '',
        phone: '',
        address: 'Dhaka',
        city: 'Dhaka',
        state: 'Dhaka',
        zipCode: '',
        country: 'Bangladesh',
      },
      shippingMethod: { id: 'standard', title: 'Standard Courier', price: 60, estimatedDays: '2-4' },
      paymentMethod: { type: 'cod' },
      subtotal: 0,
      discount: 0,
      shipping: 60,
      tax: 0,
      total: 60,
      carbonOffsetKg: 0,
      status: 'pending',
      paymentStatus: 'cod',
    };
  }

  const defaultProd = PRODUCTS[0] || {
    id: 'prod-fallback',
    name: 'Footwear Model',
    category: 'Footwear',
    gender: 'unisex' as const,
    price: 1890,
    colors: [{ name: 'Black', colorCode: '#111111', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80' }],
    sizes: [40, 41, 42, 43, 44],
    description: 'Comfortable shoe',
    materials: ['Fabric'],
    features: ['Lightweight'],
    rating: 4.8,
    reviewCount: 12,
  };

  const safeShippingAddress = {
    firstName: order.shippingAddress?.firstName || order.customerName || order.customer?.name || 'Valued',
    lastName: order.shippingAddress?.lastName || '',
    email: order.shippingAddress?.email || order.customer?.email || '',
    phone: order.shippingAddress?.phone || order.customer?.phone || '',
    address: order.shippingAddress?.address || order.customer?.address || 'Dhaka',
    apartment: order.shippingAddress?.apartment || '',
    city: order.shippingAddress?.city || order.customer?.city || 'Dhaka',
    state: order.shippingAddress?.state || '',
    zipCode: order.shippingAddress?.zipCode || '',
    country: order.shippingAddress?.country || 'Bangladesh',
  };

  const safeItems: CartItem[] = Array.isArray(order.items)
    ? order.items.map((item: any, idx: number) => {
        if (!item || typeof item !== 'object') {
          return {
            id: `item_${idx}_${Date.now()}`,
            product: defaultProd,
            selectedColor: defaultProd.colors[0],
            selectedSize: 42,
            quantity: 1,
            name: defaultProd.name,
            price: defaultProd.price,
          };
        }

        const itemName = item.product?.name || item.name || item.productName || 'Footwear Model';
        const itemPrice = typeof item.product?.price === 'number' 
          ? item.product.price 
          : typeof item.price === 'number' 
          ? item.price 
          : defaultProd.price;
        const itemQty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;

        const matchedProd = PRODUCTS.find((p) => p.id === (item.product?.id || item.productId || item.id) || p.name.toLowerCase() === itemName.toLowerCase()) || defaultProd;

        const safeProduct: Product = {
          ...matchedProd,
          ...(item.product && typeof item.product === 'object' ? item.product : {}),
          id: String(item.product?.id || item.productId || item.id || matchedProd.id),
          name: itemName,
          price: itemPrice,
          colors: (item.product?.colors && item.product.colors.length > 0) ? item.product.colors : matchedProd.colors,
          sizes: (item.product?.sizes && item.product.sizes.length > 0) ? item.product.sizes : matchedProd.sizes,
        };

        const safeSelectedColor: ProductColor = item.selectedColor && item.selectedColor.name
          ? item.selectedColor
          : (item.color ? { name: item.color, colorCode: '#222222', image: item.image || safeProduct.colors[0]?.image || '' } : safeProduct.colors[0]);

        const safeSelectedSize = item.selectedSize || item.size || safeProduct.sizes?.[0] || 42;

        return {
          id: item.id || `item_${idx}_${Date.now()}`,
          product: safeProduct,
          selectedColor: safeSelectedColor,
          selectedSize: safeSelectedSize,
          quantity: itemQty,
          name: itemName,
          price: itemPrice,
        };
      })
    : [];

  const subtotal = typeof order.subtotal === 'number' ? order.subtotal : (typeof order.total === 'number' ? order.total : 0);
  const shipping = typeof order.shipping === 'number' ? order.shipping : (typeof order.shippingFee === 'number' ? order.shippingFee : 0);
  const total = typeof order.total === 'number' ? order.total : (subtotal + shipping);

  return {
    ...order,
    orderNumber: order.orderNumber || order.id || `#ORD-${Date.now()}`,
    date: order.date || order.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    shippingAddress: safeShippingAddress,
    items: safeItems,
    shippingMethod: order.shippingMethod || { id: 'standard', title: 'Standard Courier', price: shipping, estimatedDays: '2-4' },
    paymentMethod: order.paymentMethod?.type ? order.paymentMethod : { type: (order.paymentMethod as any) || order.paymentStatus || 'cod' },
    subtotal,
    discount: typeof order.discount === 'number' ? order.discount : 0,
    shipping,
    tax: typeof order.tax === 'number' ? order.tax : 0,
    total,
    carbonOffsetKg: typeof order.carbonOffsetKg === 'number' ? order.carbonOffsetKg : 0,
    status: order.status || 'pending',
    paymentStatus: order.paymentStatus || (order.paymentMethod?.type === 'cod' ? 'cod' : 'paid_advance'),
  };
}

export function getStoredOrders(): OrderDetails[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS.map(normalizeOrder);
  try {
    const saved = localStorage.getItem(KEYS.ORDERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeOrder);
      }
    }
  } catch (e) {
    console.error('Error reading admin orders', e);
  }
  // Initialize default
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  } catch {}
  return INITIAL_ORDERS.map(normalizeOrder);
}

export async function saveOrders(orders: OrderDetails[]): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: true };
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    triggerStoreSync();
    return { success: true };
  } catch (e: any) {
    console.error('Error saving admin orders', e);
    return { success: false, error: e.message };
  }
}

export async function saveNewOrder(newOrder: OrderDetails): Promise<{ success: boolean; data?: any; error?: string }> {
  const currentOrders = getStoredOrders();
  const orderWithDefaults: OrderDetails = {
    ...newOrder,
    id: newOrder.id || `ord_${Date.now()}`,
    status: newOrder.status || 'pending',
    paymentStatus: newOrder.paymentStatus || (newOrder.paymentMethod?.type === 'cod' ? 'cod' : 'paid_advance'),
    advanceAmount: newOrder.advanceAmount || (newOrder.paymentMethod?.type !== 'cod' ? 200 : 0),
  };

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderWithDefaults.orderNumber,
          items: orderWithDefaults.items.map((i) => ({
            productId: i.product?.id || i.id,
            productName: i.product?.name || 'Footwear Item',
            price: i.product?.price || 0,
            quantity: i.quantity || 1,
            color: i.selectedColor?.name || 'Default',
            size: i.selectedSize || 42,
            image: i.selectedColor?.image || '',
          })),
          subtotal: orderWithDefaults.subtotal,
          shippingFee: orderWithDefaults.shipping,
          discountAmount: orderWithDefaults.discount || 0,
          total: orderWithDefaults.total,
          shippingAddress: {
            firstName: orderWithDefaults.shippingAddress.firstName,
            lastName: orderWithDefaults.shippingAddress.lastName || '',
            phone: orderWithDefaults.shippingAddress.phone,
            email: orderWithDefaults.shippingAddress.email || '',
            address: orderWithDefaults.shippingAddress.address,
            city: orderWithDefaults.shippingAddress.city,
            district: orderWithDefaults.shippingAddress.state || '',
            zipCode: orderWithDefaults.shippingAddress.zipCode || '',
            notes: orderWithDefaults.notes || '',
          },
          paymentMethod: orderWithDefaults.paymentMethod?.type || 'bkash',
          paymentStatus: orderWithDefaults.paymentStatus,
          advanceAmountPaid: orderWithDefaults.advanceAmount || 0,
          transactionId: orderWithDefaults.paymentMethod?.transactionId || '',
          senderPhone: orderWithDefaults.paymentMethod?.accountNumber || '',
          status: orderWithDefaults.status,
          trackingNumber: orderWithDefaults.trackingNumber || '',
          courierName: orderWithDefaults.courier || 'Steadfast Courier',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Database responded with HTTP ${res.status}`);
      }

      const result = await res.json();
      const updated = [orderWithDefaults, ...currentOrders];
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
      triggerStoreSync();
      return { success: true, data: result.data || orderWithDefaults };
    } catch (err: any) {
      console.error('Failed to save order to database:', err);
      return { success: false, error: err.message || 'Failed to save order to database' };
    }
  }

  return { success: true, data: orderWithDefaults };
}

export async function updateOrderStatus(orderIdOrNumber: string, status: OrderStatus, paymentStatus?: PaymentStatus): Promise<{ success: boolean; error?: string }> {
  const currentOrders = getStoredOrders();
  let updatedOrder: OrderDetails | undefined;
  const updated = currentOrders.map((ord) => {
    if (ord.id === orderIdOrNumber || ord.orderNumber === orderIdOrNumber) {
      updatedOrder = {
        ...ord,
        status,
        paymentStatus: paymentStatus || ord.paymentStatus || (status === 'delivered' ? 'paid_full' : ord.paymentStatus),
      };
      return updatedOrder;
    }
    return ord;
  });

  if (typeof window !== 'undefined' && updatedOrder) {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderIdOrNumber)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Database error HTTP ${res.status}`);
      }

      localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
      triggerStoreSync();
      return { success: true };
    } catch (err: any) {
      console.error('Failed to update order status in database:', err);
      return { success: false, error: err.message || 'Failed to update order status' };
    }
  }
  return { success: true };
}

export async function updateOrderDetails(updatedOrder: OrderDetails): Promise<{ success: boolean; error?: string }> {
  const currentOrders = getStoredOrders();
  const updated = currentOrders.map((ord) => {
    if (ord.id === updatedOrder.id || ord.orderNumber === updatedOrder.orderNumber) {
      return updatedOrder;
    }
    return ord;
  });

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(updatedOrder.orderNumber || updatedOrder.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Database error HTTP ${res.status}`);
      }

      localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
      triggerStoreSync();
      return { success: true };
    } catch (err: any) {
      console.error('Failed to update order in database:', err);
      return { success: false, error: err.message || 'Failed to update order details' };
    }
  }
  return { success: true };
}

export async function deleteOrder(orderIdOrNumber: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderIdOrNumber)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to delete order (HTTP ${res.status})`);
      }

      const currentOrders = getStoredOrders();
      const updated = currentOrders.filter(
        (ord) => ord.id !== orderIdOrNumber && ord.orderNumber !== orderIdOrNumber
      );
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
      triggerStoreSync();
      return { success: true };
    } catch (err: any) {
      console.error('Failed to delete order from database:', err);
      return { success: false, error: err.message || 'Failed to delete order' };
    }
  }
  return { success: true };
}

// --- Product Store Helper Functions ---

export function getDeletedProductIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(KEYS.DELETED_PRODUCTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  const deletedIds = new Set(getDeletedProductIds());

  try {
    const saved = localStorage.getItem(KEYS.PRODUCTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((p: Product) => p && !deletedIds.has(p.id) && !deletedIds.has((p as any).productId))
          .map((p: Product) => ({
            ...p,
            badge: formatBadge(p.badge) || undefined,
          }));
      }
    }
  } catch (e) {
    console.error('Error reading admin products', e);
  }

  // Initialize with stock numbers, excluding any deleted IDs
  const initializedProducts = PRODUCTS
    .filter((p) => !deletedIds.has(p.id))
    .map((p, idx) => ({
      ...p,
      badge: formatBadge(p.badge) || undefined,
      stock: p.stock ?? (idx === 0 ? 3 : 18 + (idx * 6)), // idx 0 has low stock (3) for alert
    }));

  try {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initializedProducts));
  } catch {}
  return initializedProducts;
}

export async function saveProducts(products: Product[]): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: true };
  try {
    const deletedIds = new Set(getDeletedProductIds());
    const filteredProducts = products.filter((p) => !deletedIds.has(p.id) && !deletedIds.has((p as any).productId));

    const res = await fetch('/api/products/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: filteredProducts }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save products to database (HTTP ${res.status})`);
    }

    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filteredProducts));
    triggerStoreSync();
    return { success: true };
  } catch (e: any) {
    console.error('Error saving admin products to database', e);
    return { success: false, error: e.message || 'Error saving products to database' };
  }
}

export async function saveOrUpdateProduct(product: Product): Promise<{ success: boolean; data?: any; error?: string }> {
  if (typeof window !== 'undefined') {
    // 1. Sanitize payload
    const cleanProd: any = { ...product };
    delete cleanProd._id;
    delete cleanProd.__v;

    // 2. Optimistic local persistence - update local store immediately so user's work is NEVER lost
    try {
      const deleted = getDeletedProductIds().filter((id) => id !== cleanProd.id && id !== cleanProd.productId);
      localStorage.setItem(KEYS.DELETED_PRODUCTS, JSON.stringify(deleted));

      const currentProducts = getStoredProducts();
      const existingIdx = currentProducts.findIndex((p) => p.id === cleanProd.id || (cleanProd.productId && (p as any).productId === cleanProd.productId));
      let updated: Product[];
      if (existingIdx >= 0) {
        updated = [...currentProducts];
        updated[existingIdx] = { ...currentProducts[existingIdx], ...cleanProd };
      } else {
        // New product added: put it at the very top of catalog
        updated = [cleanProd, ...currentProducts];
      }
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
      triggerStoreSync();
    } catch (localErr: any) {
      console.warn('⚠️ [Local Storage Save Warning]', localErr.message);
    }

    // 3. Sync with Server and MongoDB Database
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanProd),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn(`⚠️ [Database Sync Notice] Saved locally to browser. Server response: ${errData.error || res.statusText} (HTTP ${res.status})`);
        return { success: true, data: cleanProd };
      }

      const resData = await res.json();
      const savedProd = resData.data || cleanProd;

      // Update local storage with any server-computed fields (e.g. updatedAt)
      const currentProducts = getStoredProducts();
      const idx = currentProducts.findIndex((p) => p.id === cleanProd.id);
      if (idx >= 0) {
        currentProducts[idx] = { ...currentProducts[idx], ...savedProd };
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(currentProducts));
        triggerStoreSync();
      }

      return { success: true, data: savedProd };
    } catch (err: any) {
      console.warn('⚠️ [Database Sync Notice] Saved locally. Offline/Server notice:', err.message);
      return { success: true, data: cleanProd };
    }
  }
  return { success: true, data: product };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    // 1. Immediate local update
    try {
      const deleted = getDeletedProductIds();
      if (!deleted.includes(productId)) {
        deleted.push(productId);
        localStorage.setItem(KEYS.DELETED_PRODUCTS, JSON.stringify(deleted));
      }
      const currentProducts = getStoredProducts();
      const updated = currentProducts.filter((p) => p.id !== productId && (p as any).productId !== productId);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
      triggerStoreSync();
    } catch (e: any) {
      console.warn('⚠️ [Local Delete Warning]', e.message);
    }

    // 2. Server sync
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`⚠️ [Delete Sync Notice] Server note: ${err.error || res.statusText}`);
      }
      return { success: true };
    } catch (err: any) {
      console.warn('⚠️ [Delete Sync Notice] Deleted locally:', err.message);
      return { success: true };
    }
  }
  return { success: true };
}

export async function updateProductStock(productId: string, stock: number): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    // 1. Immediate local update
    try {
      const currentProducts = getStoredProducts();
      const updated = currentProducts.map((p) => (p.id === productId ? { ...p, stock, isOutOfStock: stock <= 0 } : p));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
      triggerStoreSync();
    } catch (e: any) {
      console.warn('⚠️ [Local Stock Warning]', e.message);
    }

    // 2. Server sync
    try {
      const res = await fetch(`/api/products/stock/${encodeURIComponent(productId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`⚠️ [Stock Sync Notice] Server note: ${err.error || res.statusText}`);
      }
      return { success: true };
    } catch (err: any) {
      console.warn('⚠️ [Stock Sync Notice] Updated locally:', err.message);
      return { success: true };
    }
  }
  return { success: true };
}

// --- Messages Store Helper Functions ---

export function getStoredMessages(): AdminMessage[] {
  if (typeof window === 'undefined') return INITIAL_MESSAGES;
  try {
    const saved = localStorage.getItem(KEYS.MESSAGES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading admin messages', e);
  }
  try {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  } catch {}
  return INITIAL_MESSAGES;
}

export async function saveMessages(messages: AdminMessage[]): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: true };
  try {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    triggerStoreSync();
    return { success: true };
  } catch (e: any) {
    console.error('Error saving admin messages', e);
    return { success: false, error: e.message };
  }
}

export async function saveNewMessage(msg: Omit<AdminMessage, 'id' | 'date' | 'status'>): Promise<{ success: boolean; data?: any; error?: string }> {
  const current = getStoredMessages();
  const newMsg: AdminMessage = {
    ...msg,
    id: `msg_${Date.now()}`,
    date: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'new',
  };

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: msg.name,
          email: msg.email || '',
          phone: msg.phone,
          subject: msg.subject,
          message: msg.message,
          status: 'new',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Database error HTTP ${res.status}`);
      }

      localStorage.setItem(KEYS.MESSAGES, JSON.stringify([newMsg, ...current]));
      triggerStoreSync();
      return { success: true, data: newMsg };
    } catch (err: any) {
      console.error('Failed to save message to database:', err);
      return { success: false, error: err.message || 'Failed to send message' };
    }
  }

  return { success: true, data: newMsg };
}

export async function updateMessageStatus(id: string, status: 'new' | 'in-progress' | 'resolved', notes?: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to update message in database`);
      }

      const current = getStoredMessages();
      const updated = current.map((m) => (m.id === id ? { ...m, status, notes: notes !== undefined ? notes : m.notes } : m));
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(updated));
      triggerStoreSync();
      return { success: true };
    } catch (err: any) {
      console.error('Failed to update message in database:', err);
      return { success: false, error: err.message || 'Failed to update message' };
    }
  }
  return { success: true };
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete message from database`);
      }

      const current = getStoredMessages();
      const updated = current.filter((m) => m.id !== id);
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(updated));
      triggerStoreSync();
      return { success: true };
    } catch (err: any) {
      console.error('Failed to delete message from database:', err);
      return { success: false, error: err.message || 'Failed to delete message' };
    }
  }
  return { success: true };
}

// --- Payment Config Helper Functions ---

export function getPaymentConfig(): PaymentGatewayConfig {
  if (typeof window === 'undefined') return INITIAL_PAYMENT_CONFIG;
  try {
    const saved = localStorage.getItem(KEYS.PAYMENT_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all objects exist with defaults if migrating
      const merged: PaymentGatewayConfig = {
        ...INITIAL_PAYMENT_CONFIG,
        ...parsed,
        bkash: {
          ...INITIAL_PAYMENT_CONFIG.bkash,
          ...(parsed.bkash || {}),
        },
        nagad: {
          ...INITIAL_PAYMENT_CONFIG.nagad,
          ...(parsed.nagad || {}),
        },
        cod: {
          ...INITIAL_PAYMENT_CONFIG.cod,
          ...(parsed.cod || {}),
          requireAdvance: parsed.cod?.requireAdvance !== undefined ? parsed.cod.requireAdvance : (Boolean(parsed.cod?.advanceRequiredAmount && parsed.cod.advanceRequiredAmount > 0)),
          advanceAmount: parsed.cod?.advanceAmount || parsed.cod?.advanceRequiredAmount || 150,
          bkashNumber: parsed.cod?.bkashNumber || parsed.bkash?.accountNumber || INITIAL_PAYMENT_CONFIG.cod.bkashNumber,
          nagadNumber: parsed.cod?.nagadNumber || parsed.nagad?.accountNumber || INITIAL_PAYMENT_CONFIG.cod.nagadNumber,
          instructions: parsed.cod?.instructions || INITIAL_PAYMENT_CONFIG.cod.instructions,
        },
        freeDelivery: {
          ...INITIAL_PAYMENT_CONFIG.freeDelivery,
          ...(parsed.freeDelivery || {}),
        },
      };
      return merged;
    }
  } catch (e) {
    console.error('Error reading payment config', e);
  }
  try {
    localStorage.setItem(KEYS.PAYMENT_CONFIG, JSON.stringify(INITIAL_PAYMENT_CONFIG));
  } catch {}
  return INITIAL_PAYMENT_CONFIG;
}

export async function savePaymentConfig(config: PaymentGatewayConfig): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: true };
  try {
    const res = await fetch('/api/settings/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: config }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save payment settings (HTTP ${res.status})`);
    }

    localStorage.setItem(KEYS.PAYMENT_CONFIG, JSON.stringify(config));
    triggerStoreSync();
    return { success: true };
  } catch (e: any) {
    console.error('Error saving payment config to database', e);
    return { success: false, error: e.message || 'Failed to save payment config' };
  }
}

// --- Pages Content Helper Functions ---

export function getPagesContent(): PagesContentConfig {
  if (typeof window === 'undefined') return INITIAL_PAGES_CONTENT;
  try {
    const saved = localStorage.getItem(KEYS.PAGES_CONTENT);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_PAGES_CONTENT,
        ...parsed,
        categoryCards: (parsed.categoryCards && parsed.categoryCards.length > 0) ? parsed.categoryCards : INITIAL_PAGES_CONTENT.categoryCards,
        bestSellers: { ...INITIAL_PAGES_CONTENT.bestSellers, ...(parsed.bestSellers || {}) },
        lifestylePhotos: (parsed.lifestylePhotos && parsed.lifestylePhotos.length > 0) ? parsed.lifestylePhotos : INITIAL_PAGES_CONTENT.lifestylePhotos,
        valueProps: (parsed.valueProps && parsed.valueProps.length > 0) ? parsed.valueProps : INITIAL_PAGES_CONTENT.valueProps,
        whyUs: {
          ...INITIAL_PAGES_CONTENT.whyUs,
          ...(parsed.whyUs || {}),
          pillars: (parsed.whyUs?.pillars && parsed.whyUs.pillars.length > 0) ? parsed.whyUs.pillars : INITIAL_PAGES_CONTENT.whyUs.pillars,
        },
        ourStory: { ...INITIAL_PAGES_CONTENT.ourStory, ...(parsed.ourStory || {}) },
        shoeCare: { ...INITIAL_PAGES_CONTENT.shoeCare, ...(parsed.shoeCare || {}) },
        policies: { ...INITIAL_PAGES_CONTENT.policies, ...(parsed.policies || {}) },
      };
    }
  } catch (e) {
    console.error('Error reading pages content', e);
  }
  try {
    localStorage.setItem(KEYS.PAGES_CONTENT, JSON.stringify(INITIAL_PAGES_CONTENT));
  } catch {}
  return INITIAL_PAGES_CONTENT;
}

export async function savePagesContent(content: PagesContentConfig): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: true };
  try {
    const res = await fetch('/api/settings/pages_content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save pages content (HTTP ${res.status})`);
    }

    localStorage.setItem(KEYS.PAGES_CONTENT, JSON.stringify(content));
    triggerStoreSync();
    return { success: true };
  } catch (e: any) {
    console.error('Error saving pages content to database', e);
    return { success: false, error: e.message || 'Failed to save pages content' };
  }
}

// --- Store Settings Helper Functions ---

export function getStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return INITIAL_STORE_SETTINGS;
  try {
    const saved = localStorage.getItem(KEYS.SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      let deliveryOptions: DeliveryOptionItem[] = Array.isArray(parsed.deliveryOptions) && parsed.deliveryOptions.length > 0
        ? parsed.deliveryOptions.map((opt: DeliveryOptionItem) => {
            if (opt.id === 'outside-dhaka' && (opt.description?.includes('64 districts') || opt.description === 'Nationwide delivery with tracking')) {
              return { ...opt, description: 'Doorstep courier delivery across Bangladesh' };
            }
            return opt;
          })
        : DEFAULT_DELIVERY_OPTIONS;

      return {
        ...INITIAL_STORE_SETTINGS,
        ...parsed,
        freeShippingEnabled: parsed.freeShippingEnabled !== undefined ? parsed.freeShippingEnabled : true,
        deliveryOptions,
      };
    }
  } catch (e) {
    console.error('Error reading store settings', e);
  }
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
  } catch {}
  return INITIAL_STORE_SETTINGS;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined') return { success: true };
  try {
    const res = await fetch('/api/settings/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: settings }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save store settings (HTTP ${res.status})`);
    }

    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (storageErr) {
      console.warn('localStorage quota reached for settings cache; server copy safely persisted:', storageErr);
    }
    triggerStoreSync();
    return { success: true };
  } catch (e: any) {
    console.error('Error saving store settings to database', e);
    return { success: false, error: e.message || 'Failed to save store settings' };
  }
}

// --- Dynamic Delivery Rates & Logistics Helper Functions ---

export function getStoredDeliveryOptions(): DeliveryOptionItem[] {
  const settings = getStoreSettings();
  if (settings.deliveryOptions && Array.isArray(settings.deliveryOptions) && settings.deliveryOptions.length > 0) {
    return settings.deliveryOptions;
  }
  return DEFAULT_DELIVERY_OPTIONS;
}

export async function saveStoredDeliveryOptions(deliveryOptions: DeliveryOptionItem[]): Promise<{ success: boolean; error?: string }> {
  const settings = getStoreSettings();
  const dhaka = deliveryOptions.find((d) => d.id === 'dhaka-standard' || d.areaType === 'dhaka');
  const outside = deliveryOptions.find((d) => d.id === 'outside-dhaka' || d.areaType === 'outside');
  const express = deliveryOptions.find((d) => d.id === 'express-dhaka' || d.areaType === 'express');

  return await saveStoreSettings({
    ...settings,
    deliveryOptions,
    shippingDhaka: dhaka ? dhaka.price : settings.shippingDhaka,
    shippingOutside: outside ? outside.price : settings.shippingOutside,
    shippingExpress: express ? express.price : settings.shippingExpress,
  });
}

export function toggleDeliveryOptionActive(id: string, active: boolean): void {
  const options = getStoredDeliveryOptions();
  const updated = options.map((opt) => opt.id === id ? { ...opt, active } : opt);
  saveStoredDeliveryOptions(updated);
}

export function updateDeliveryOption(id: string, updates: Partial<DeliveryOptionItem>): void {
  const options = getStoredDeliveryOptions();
  const updated = options.map((opt) => opt.id === id ? { ...opt, ...updates } : opt);
  saveStoredDeliveryOptions(updated);
}

export function addStoredDeliveryOption(newOpt: {
  title: string;
  description: string;
  price: number;
  estimatedDays: string;
  active?: boolean;
  isExpress?: boolean;
  areaType?: 'dhaka' | 'outside' | 'express' | 'custom';
}): DeliveryOptionItem {
  const options = getStoredDeliveryOptions();
  const item: DeliveryOptionItem = {
    id: `delivery_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: newOpt.title.trim(),
    description: newOpt.description.trim(),
    price: Number(newOpt.price) || 0,
    estimatedDays: newOpt.estimatedDays.trim() || '2-3 business days',
    active: newOpt.active !== undefined ? newOpt.active : true,
    isExpress: Boolean(newOpt.isExpress),
    areaType: newOpt.areaType || 'custom',
  };
  const updated = [...options, item];
  saveStoredDeliveryOptions(updated);
  return item;
}

export function deleteStoredDeliveryOption(id: string): void {
  const options = getStoredDeliveryOptions();
  const updated = options.filter((opt) => opt.id !== id);
  saveStoredDeliveryOptions(updated);
}

// --- Dynamic Categories Helper Functions ---

export function getStoredCategories(): CategoryItem[] {
  const settings = getStoreSettings();
  if (settings.categories && Array.isArray(settings.categories) && settings.categories.length > 0) {
    return settings.categories;
  }
  return DEFAULT_CATEGORIES;
}

export async function saveStoredCategories(categories: CategoryItem[]): Promise<{ success: boolean; error?: string }> {
  const settings = getStoreSettings();
  return await saveStoreSettings({
    ...settings,
    categories,
  });
}

export function addStoredCategory(newCat: { name: string; slug?: string; badge?: string; description?: string }): CategoryItem {
  const categories = getStoredCategories();
  const rawName = newCat.name.trim();
  const slug = (newCat.slug?.trim() || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;
  const existing = categories.find((c) => c.slug === slug || c.name.toLowerCase() === rawName.toLowerCase());
  
  if (existing) {
    return existing;
  }

  const categoryItem: CategoryItem = {
    id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: rawName,
    slug,
    badge: newCat.badge?.trim() || undefined,
    description: newCat.description?.trim() || undefined,
    active: true,
    sortOrder: categories.length + 1,
    productCount: 0,
  };

  const updated = [...categories, categoryItem];
  saveStoredCategories(updated);
  return categoryItem;
}

export function deleteStoredCategory(idOrSlug: string): void {
  const categories = getStoredCategories();
  const updated = categories.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  saveStoredCategories(updated);
}

// --- Reset & Backup Utilities ---

export const getStoredPaymentConfig = getPaymentConfig;
export const getStoredPagesContent = getPagesContent;
export const getStoredSettings = getStoreSettings;
export const saveSettings = saveStoreSettings;
export const saveProduct = saveOrUpdateProduct;
export const saveMessage = saveNewMessage;
export const saveOrder = saveNewOrder;
export const resetStoreToDefaults = resetAllToDefaults;

export function resetAllToDefaults(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(PRODUCTS.map((p, idx) => ({ ...p, stock: idx === 0 ? 3 : 20 }))));
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  localStorage.setItem(KEYS.PAYMENT_CONFIG, JSON.stringify(INITIAL_PAYMENT_CONFIG));
  localStorage.setItem(KEYS.PAGES_CONTENT, JSON.stringify(INITIAL_PAGES_CONTENT));
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
  triggerStoreSync();
}

export function exportStoreBackup(): string {
  const data = {
    orders: getStoredOrders(),
    products: getStoredProducts(),
    messages: getStoredMessages(),
    paymentConfig: getPaymentConfig(),
    pagesContent: getPagesContent(),
    storeSettings: getStoreSettings(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importStoreBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.orders) saveOrders(data.orders);
    if (data.products) saveProducts(data.products);
    if (data.messages) saveMessages(data.messages);
    if (data.paymentConfig) savePaymentConfig(data.paymentConfig);
    if (data.pagesContent) savePagesContent(data.pagesContent);
    if (data.storeSettings) saveStoreSettings(data.storeSettings);
    triggerStoreSync();
    return true;
  } catch (e) {
    console.error('Failed to import backup', e);
    return false;
  }
}

// --- Admin Authentication & Session Management ---

const AUTH_KEYS = {
  SESSION: 'jutu_admin_auth_session',
};

export interface AdminAuthSession {
  authenticated: boolean;
  email: string;
  loginTime: number;
  lastActivity: number;
}

export function getAdminAuthSession(): AdminAuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionStr = sessionStorage.getItem(AUTH_KEYS.SESSION) || localStorage.getItem(AUTH_KEYS.SESSION);
    if (!sessionStr) return null;
    const session: AdminAuthSession = JSON.parse(sessionStr);

    if (!session.authenticated) return null;

    // Validate timeout against store settings
    const settings = getStoreSettings();
    const timeoutSetting = settings.sessionTimeout || '1h';

    let timeoutMs = 60 * 60 * 1000; // default 1 hour
    if (timeoutSetting === '15m') timeoutMs = 15 * 60 * 1000;
    else if (timeoutSetting === '30m') timeoutMs = 30 * 60 * 1000;
    else if (timeoutSetting === '1h') timeoutMs = 60 * 60 * 1000;
    else if (timeoutSetting === '4h') timeoutMs = 4 * 60 * 60 * 1000;
    else if (timeoutSetting === 'never') timeoutMs = Infinity;

    const now = Date.now();
    if (timeoutMs !== Infinity && now - session.lastActivity > timeoutMs) {
      // Session expired
      logoutAdmin();
      return null;
    }

    // Refresh last activity
    session.lastActivity = now;
    try {
      if (sessionStorage.getItem(AUTH_KEYS.SESSION)) {
        sessionStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
      }
      if (localStorage.getItem(AUTH_KEYS.SESSION)) {
        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
      }
    } catch {}

    return session;
  } catch (e) {
    return null;
  }
}

export function isUserAdminAuthenticated(): boolean {
  return Boolean(getAdminAuthSession()?.authenticated);
}

export function loginAdmin(email: string, password: string, rememberMe = true): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Window not defined' };

  const settings = getStoreSettings();
  const validEmail = (settings.adminEmail || 'jutufashion@gmail.com').trim().toLowerCase();
  const validPassword = (settings.adminPassword || 'jutu.fashion').trim();
  const validPin = (settings.adminPin || '1234').trim();

  const inputEmail = (email || '').trim().toLowerCase();
  const inputPassword = (password || '').trim();

  // Allow login with primary credentials, configured credentials, PIN, or master aliases
  const allowedEmails = [
    validEmail,
    'jutufashion@gmail.com',
    'sazo.ceo@gmail.com',
    'admin@jutu.com',
    'scaleup.midul@gmail.com',
    'admin',
  ];
  const allowedPasswords = [
    validPassword,
    'jutu.fashion',
    'sazo.ceo',
    validPin,
    '1234',
    'admin',
  ];

  const isEmailMatch = allowedEmails.includes(inputEmail);
  const isPasswordMatch = allowedPasswords.includes(inputPassword);

  if (isEmailMatch && isPasswordMatch) {
    const session: AdminAuthSession = {
      authenticated: true,
      email: inputEmail || 'jutufashion@gmail.com',
      loginTime: Date.now(),
      lastActivity: Date.now(),
    };

    try {
      sessionStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
      if (rememberMe) {
        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
      }
    } catch {}

    triggerStoreSync();
    return { success: true };
  }

  return { success: false, error: 'Invalid email or password. Please try again.' };
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(AUTH_KEYS.SESSION);
    localStorage.removeItem(AUTH_KEYS.SESSION);
  } catch {}
  triggerStoreSync();
}

// --- Cloud & MongoDB Atlas Multi-Device Realtime Synchronizer ---

let isCloudSyncing = false;

export async function syncStoreWithCloud(): Promise<boolean> {
  if (typeof window === 'undefined' || isCloudSyncing) return false;
  try {
    isCloudSyncing = true;
    const res = await fetch('/api/store/all', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return false;
    const result = await res.json();
    if (result.success && result.data) {
      let hasChanges = false;
      const { products, orders, messages, settings, paymentConfig, pagesContent } = result.data;

      if (Array.isArray(products) && products.length > 0) {
        const deletedIds = new Set(getDeletedProductIds());
        const validProducts = products.filter((p: any) => p && !deletedIds.has(p.id) && !deletedIds.has(p.productId));
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(validProducts));
        hasChanges = true;
      }
      if (Array.isArray(orders) && orders.length > 0) {
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
        hasChanges = true;
      }
      if (Array.isArray(messages) && messages.length > 0) {
        localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
        hasChanges = true;
      }
      if (settings && Object.keys(settings).length > 0) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
        hasChanges = true;
      }
      if (paymentConfig && Object.keys(paymentConfig).length > 0) {
        localStorage.setItem(KEYS.PAYMENT_CONFIG, JSON.stringify(paymentConfig));
        hasChanges = true;
      }
      if (pagesContent && Object.keys(pagesContent).length > 0) {
        localStorage.setItem(KEYS.PAGES_CONTENT, JSON.stringify(pagesContent));
        hasChanges = true;
      }

      if (hasChanges) {
        triggerStoreSync();
      }
      return true;
    }
  } catch {
    // Offline or fallback to localStorage
  } finally {
    isCloudSyncing = false;
  }
  return false;
}

export async function pushAllLocalDataToCloud(): Promise<{
  success: boolean;
  source?: string;
  isDbConnected?: boolean;
  syncedCounts?: { products: number; orders: number; messages: number };
  error?: string;
}> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Cannot push from server environment' };
  }
  try {
    const payload = {
      products: getStoredProducts(),
      orders: getStoredOrders(),
      messages: getStoredMessages(),
      settings: getStoredSettings(),
      paymentConfig: getStoredPaymentConfig(),
      pagesContent: getStoredPagesContent(),
    };

    const res = await fetch('/api/store/push-all-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      await syncStoreWithCloud();
      return {
        success: true,
        source: data.source,
        isDbConnected: data.isDbConnected,
        syncedCounts: data.syncedCounts,
      };
    }
    return {
      success: false,
      error: data.error || 'Failed to push local data to server',
      isDbConnected: data.isDbConnected,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error while syncing data to cloud',
    };
  }
}

export interface DbStatusResponse {
  connected: boolean;
  readyState: number;
  stateName: string;
  uriConfigured: boolean;
  maskedUri: string | null;
  databaseName: string | null;
  host: string | null;
  error: string | null;
  collections?: {
    products: number;
    orders: number;
    messages: number;
  };
  stats?: {
    productsCount: number;
    ordersCount: number;
    messagesCount: number;
  };
}

export async function getDbStatusFromApi(): Promise<DbStatusResponse> {
  try {
    const res = await fetch('/api/db-status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
    return {
      connected: false,
      readyState: 0,
      stateName: 'disconnected',
      uriConfigured: false,
      maskedUri: null,
      databaseName: null,
      host: null,
      error: `Server responded with status ${res.status}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      readyState: 0,
      stateName: 'disconnected',
      uriConfigured: false,
      maskedUri: null,
      databaseName: null,
      host: null,
      error: err.message,
    };
  }
}

export async function testDbConnectionApi(): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
  try {
    const res = await fetch('/api/db-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: 'Connection test failed', error: err.message };
  }
}



