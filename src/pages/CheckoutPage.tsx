import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  Truck,
  Zap,
  MapPin,
  AlertCircle,
  Smartphone,
  Banknote,
  Copy,
  Check,
  ShieldCheck,
  Package,
  RotateCcw,
  Sparkles,
  User,
  Phone,
  Mail,
  Building2,
  FileText,
  ChevronDown,
  Info
} from 'lucide-react';
import { CartItem, ShippingAddress, OrderDetails, PageView, DeliveryOptionItem } from '../types';
import { formatTaka } from '../utils/currency';
import { getStoredSettings, getPaymentConfig, STORE_SYNC_EVENT } from '../data/adminStore';
import { BkashIcon, NagadIcon } from '../components/PaymentLogos';

const BANGLADESH_DISTRICTS_BY_DIVISION = [
  {
    division: 'Dhaka Division',
    districts: [
      'Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Narsingdi', 'Manikganj', 
      'Munshiganj', 'Kishoreganj', 'Faridpur', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur'
    ]
  },
  {
    division: 'Chattogram Division',
    districts: [
      'Chattogram', "Cox's Bazar", 'Cumilla', 'Feni', 'Brahmanbaria', 
      'Noakhali', 'Chandpur', 'Lakshmipur', 'Rangamati', 'Khagrachhari', 'Bandarban'
    ]
  },
  {
    division: 'Sylhet Division',
    districts: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj']
  },
  {
    division: 'Rajshahi Division',
    districts: [
      'Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 
      'Chapainawabganj', 'Joypurhat'
    ]
  },
  {
    division: 'Khulna Division',
    districts: [
      'Khulna', 'Jashore', 'Kushtia', 'Jhenaidah', 'Satkhira', 'Bagerhat', 
      'Chuadanga', 'Meherpur', 'Magura', 'Narail'
    ]
  },
  {
    division: 'Barishal Division',
    districts: ['Barishal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Barguna', 'Jhalokati']
  },
  {
    division: 'Rangpur Division',
    districts: [
      'Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 
      'Nilphamari', 'Panchagarh', 'Thakurgaon'
    ]
  },
  {
    division: 'Mymensingh Division',
    districts: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
  }
];

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  onNavigate: (view: PageView) => void;
  onCompleteOrder: (orderDetails: OrderDetails) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  subtotal,
  discount,
  discountCode,
  onNavigate,
  onCompleteOrder,
}) => {
  const [storeSettings, setStoreSettings] = useState(getStoredSettings());
  const [paymentConfig, setPaymentConfig] = useState(getPaymentConfig());
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    const handleSync = () => {
      setStoreSettings(getStoredSettings());
      setPaymentConfig(getPaymentConfig());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
  });

  const isUnconditionalFree = Boolean(paymentConfig.freeDelivery?.enabled !== false);
  const isThresholdFree = Boolean(
    storeSettings.freeShippingEnabled !== false &&
    subtotal >= (storeSettings.freeShippingThreshold || 2000)
  );
  const isFreeDelivery = isUnconditionalFree || isThresholdFree;
  const freeDeliveryText = isUnconditionalFree
    ? (paymentConfig.freeDelivery?.text || 'Free Delivery All Over Bangladesh')
    : `Free Delivery (Orders above ৳${(storeSettings.freeShippingThreshold || 2000).toLocaleString()})`;

  // Active delivery methods from store settings
  const rawDeliveryOptions: DeliveryOptionItem[] = (storeSettings.deliveryOptions && storeSettings.deliveryOptions.length > 0)
    ? storeSettings.deliveryOptions
    : [
        {
          id: 'dhaka-standard',
          title: 'Inside Dhaka City',
          description: 'Standard doorstep courier delivery across Dhaka',
          price: storeSettings.shippingDhaka || 80,
          estimatedDays: '1-2 business days',
          active: true,
          areaType: 'dhaka',
        },
        {
          id: 'outside-dhaka',
          title: 'Outside Dhaka (All Bangladesh)',
          description: 'Doorstep courier delivery anywhere in Bangladesh',
          price: storeSettings.shippingOutside || 130,
          estimatedDays: '2-3 business days',
          active: true,
          areaType: 'outside',
        },
        {
          id: 'express-dhaka',
          title: 'Same Day Express Delivery (Dhaka)',
          description: 'Priority courier dispatch within 24 hours',
          price: storeSettings.shippingExpress || 150,
          estimatedDays: 'Within 24 hours',
          active: true,
          isExpress: true,
          areaType: 'express',
        },
      ];

  const activeShippingMethods = rawDeliveryOptions
    .filter((m) => m.active !== false)
    .map((m) => {
      const isFreeForThis = isFreeDelivery && (!m.isExpress || m.areaType !== 'express');
      return {
        ...m,
        effectivePrice: isFreeForThis ? 0 : m.price,
      };
    });

  const [selectedShippingId, setSelectedShippingId] = useState<string>(() => {
    return activeShippingMethods[0]?.id || 'dhaka-standard';
  });

  const handleDistrictChange = (districtName: string) => {
    let foundDivision = 'Dhaka Division';
    for (const group of BANGLADESH_DISTRICTS_BY_DIVISION) {
      if (group.districts.includes(districtName)) {
        foundDivision = group.division;
        break;
      }
    }

    setFormData(prev => ({
      ...prev,
      city: districtName,
      state: foundDivision,
    }));

    // Auto-adjust standard shipping method based on district
    if (districtName === 'Dhaka') {
      const dhakaMethod = activeShippingMethods.find(m => m.id === 'dhaka-standard' || m.areaType === 'dhaka');
      if (dhakaMethod && selectedShippingId === 'outside-dhaka') {
        setSelectedShippingId(dhakaMethod.id);
      }
    } else if (districtName) {
      const outsideMethod = activeShippingMethods.find(m => m.id === 'outside-dhaka' || m.areaType === 'outside');
      if (outsideMethod && selectedShippingId === 'dhaka-standard') {
        setSelectedShippingId(outsideMethod.id);
      }
    }
  };

  // Keep selection valid if active list changes
  useEffect(() => {
    if (activeShippingMethods.length > 0 && !activeShippingMethods.some((m) => m.id === selectedShippingId)) {
      setSelectedShippingId(activeShippingMethods[0].id);
    }
  }, [activeShippingMethods, selectedShippingId]);

  const selectedShippingMethod = activeShippingMethods.find((m) => m.id === selectedShippingId) || activeShippingMethods[0] || {
    id: 'default-shipping',
    title: 'Standard Courier Delivery',
    description: 'Standard delivery',
    price: 80,
    effectivePrice: isFreeDelivery ? 0 : 80,
    estimatedDays: '2-3 business days',
    active: true,
  };

  // Selected shipping calculation
  const shippingFee = selectedShippingMethod.effectivePrice !== undefined ? selectedShippingMethod.effectivePrice : selectedShippingMethod.price;

  // The COD advance amount dynamically reflects the selected shipping method charge
  const codAdvanceAmount = shippingFee > 0 
    ? shippingFee 
    : (selectedShippingMethod.price > 0 ? selectedShippingMethod.price : (paymentConfig.cod?.advanceAmount || 150));

  // Dynamically compute enabled payment gateways based on Admin Panel
  const activePaymentMethods = [
    ...(paymentConfig.cod?.enabled !== false
      ? [
          {
            id: 'cod' as const,
            name: 'Cash on Delivery',
            subtitle: (paymentConfig.cod?.requireAdvance && !isFreeDelivery && shippingFee > 0)
              ? `Advance ${formatTaka(codAdvanceAmount)} Required` 
              : 'Pay with cash at doorstep',
            badge: 'COD',
            icon: Banknote,
          },
        ]
      : []),
    ...(paymentConfig.bkash?.enabled
      ? [
          {
            id: 'bkash' as const,
            name: 'bKash',
            subtitle: paymentConfig.bkash.type === 'merchant' ? 'Direct Merchant Payment' : 'Personal Send Money',
            badge: paymentConfig.bkash.type === 'merchant' ? 'Merchant' : 'Personal',
            icon: BkashIcon,
          },
        ]
      : []),
    ...(paymentConfig.nagad?.enabled
      ? [
          {
            id: 'nagad' as const,
            name: 'Nagad',
            subtitle: paymentConfig.nagad.type === 'merchant' ? 'Direct Merchant Payment' : 'Personal Send Money',
            badge: paymentConfig.nagad.type === 'merchant' ? 'Merchant' : 'Personal',
            icon: NagadIcon,
          },
        ]
      : []),
  ];

  const effectivePaymentMethods = activePaymentMethods.length > 0
    ? activePaymentMethods
    : [
        {
          id: 'cod' as const,
          name: 'Cash on Delivery',
          subtitle: 'Pay with cash at doorstep',
          badge: 'COD',
          icon: Banknote,
        },
      ];

  const [paymentType, setPaymentType] = useState<string>(() => {
    return effectivePaymentMethods[0]?.id || 'cod';
  });

  useEffect(() => {
    if (effectivePaymentMethods.length > 0 && !effectivePaymentMethods.some((m) => m.id === paymentType)) {
      setPaymentType(effectivePaymentMethods[0].id);
    }
  }, [effectivePaymentMethods, paymentType]);

  // General MFS payment state (for direct bKash / Nagad)
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentTrxId, setPaymentTrxId] = useState('');

  // COD with Advance payment state (Only active if free delivery is disabled, shipping charge > 0, and requireAdvance is enabled)
  const isCodAdvanceRequired = !isFreeDelivery && shippingFee > 0 && paymentType === 'cod' && Boolean(paymentConfig.cod?.requireAdvance);
  const codBkashNumber = paymentConfig.cod?.bkashNumber || paymentConfig.bkash?.accountNumber || '01900000000';
  const codNagadNumber = paymentConfig.cod?.nagadNumber || paymentConfig.nagad?.accountNumber || '01885479477';
  
  const [codAdvanceGateway, setCodAdvanceGateway] = useState<'bkash' | 'nagad'>('bkash');
  const [codSenderPhone, setCodSenderPhone] = useState('');
  const [codTrxId, setCodTrxId] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  // When COD Advance is required, the delivery charge is paid in advance upfront, so total payable on delivery is just the product price
  const displayTotal = isCodAdvanceRequired 
    ? Math.max(0, subtotal - discount) 
    : Math.max(0, subtotal - discount + shippingFee);

  const total = displayTotal;
  const totalItemsCount = items.reduce((a, b) => a + b.quantity, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderNumber = `JUTU-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Determine payment details based on selected type
    let orderPaymentStatus: 'paid_full' | 'paid_advance' | 'unpaid' = 'unpaid';
    let orderAdvanceAmount = 0;
    let orderAccountNumber: string | undefined = undefined;
    let orderTransactionId: string | undefined = undefined;
    let orderNotesAddon = '';

    if (isCodAdvanceRequired) {
      orderPaymentStatus = 'paid_advance';
      orderAdvanceAmount = codAdvanceAmount;
      orderAccountNumber = codSenderPhone.trim() || formData.phone;
      orderTransactionId = codTrxId.trim();
      orderNotesAddon = `[COD with Advance ৳${codAdvanceAmount} via ${codAdvanceGateway.toUpperCase()} (Sender: ${orderAccountNumber}, TrxID: ${orderTransactionId})]`;
    } else if (paymentType === 'bkash' || paymentType === 'nagad') {
      orderPaymentStatus = 'paid_full';
      orderAccountNumber = paymentPhone.trim() || formData.phone;
      orderTransactionId = paymentTrxId.trim();
      orderNotesAddon = `[Full Payment via ${paymentType.toUpperCase()} (Sender: ${orderAccountNumber}, TrxID: ${orderTransactionId})]`;
    } else {
      orderPaymentStatus = 'unpaid';
      orderNotesAddon = '[100% Cash on Delivery — Zero Advance]';
    }

    const fullNotes = [orderNotes.trim(), orderNotesAddon].filter(Boolean).join(' ');

    const newOrder: OrderDetails = {
      orderNumber,
      date: new Date().toLocaleDateString('en-GB', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      items: [...items],
      shippingAddress: { ...formData },
      shippingMethod: selectedShippingMethod,
      paymentMethod: {
        type: (paymentType as any) || 'cod',
        accountNumber: orderAccountNumber,
        transactionId: orderTransactionId,
      },
      subtotal,
      discount,
      discountCode,
      shipping: shippingFee,
      tax: 0,
      total,
      advanceAmount: orderAdvanceAmount,
      paymentStatus: orderPaymentStatus,
      carbonOffsetKg: Number((items.length * 4.6).toFixed(1)),
      notes: fullNotes || undefined,
    };

    setTimeout(() => {
      setIsProcessing(false);
      onCompleteOrder(newOrder);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-stone-200/80 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">Your bag is empty</h2>
          <p className="text-xs text-stone-500 mb-6">Add handcrafted footwear to proceed with checkout.</p>
          <button
            onClick={() => onNavigate('shop-all')}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20 animate-fadeIn">
      {/* Minimal Header */}
      <header className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/70 py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-[85%] mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Store</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full lg:w-[85%] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <form onSubmit={handleSubmitOrder} id="checkout-form">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Checkout Forms (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION 1: Customer & Delivery Details */}
              <section className="bg-white border border-stone-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900">
                      Customer & Delivery Information
                    </h2>
                  </div>
                  <span className="hidden sm:inline text-xs text-stone-400 font-medium">All Bangladesh</span>
                </div>

                <div className="space-y-3.5 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value, lastName: '' })}
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full text-xs sm:text-sm py-2.5 sm:py-2.5 pl-9 pr-3.5 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all placeholder:text-stone-400/50 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="017XXXXXXXX"
                          className="w-full text-xs sm:text-sm py-2.5 sm:py-2.5 pl-9 pr-3.5 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all placeholder:text-stone-400/50 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                        City / District *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 z-10">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={formData.city}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full text-xs sm:text-sm py-2.5 sm:py-2.5 pl-9 pr-9 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all text-stone-900 font-medium appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select your district...</option>
                          {BANGLADESH_DISTRICTS_BY_DIVISION.map((group) => (
                            <optgroup key={group.division} label={`── ${group.division} ──`}>
                              {group.districts.map((district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                        Email Address <span className="text-stone-400 font-normal normal-case">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full text-xs sm:text-sm py-2.5 sm:py-2.5 pl-9 pr-3.5 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all placeholder:text-stone-400/50 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                      Full Delivery Address *
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none text-stone-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="House No, Road No, Area, Thana / Village..."
                        className="w-full text-xs sm:text-sm py-2.5 pl-9 pr-3.5 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all placeholder:text-stone-400/50 font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                      Order Note <span className="text-stone-400 font-normal normal-case">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="e.g. Call before delivery"
                        className="w-full text-xs sm:text-sm py-2.5 pl-9 pr-3.5 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all placeholder:text-stone-400/50 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Delivery Options */}
              <section className="bg-white border border-stone-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900">
                      Shipping Method
                    </h2>
                  </div>
                </div>

                {activeShippingMethods.length === 0 ? (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center space-x-2.5 text-xs sm:text-sm text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>No delivery methods available right now. Please contact store support.</span>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-2.5">
                    {activeShippingMethods.map((method) => {
                      const isSelected = selectedShippingId === method.id;
                      const price = method.effectivePrice !== undefined ? method.effectivePrice : method.price;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setSelectedShippingId(method.id)}
                          className={`relative flex items-center justify-between py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-stone-50/80 border-stone-400'
                              : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            {/* Minimal Custom Radio */}
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                              isSelected ? 'border-stone-900 bg-stone-900' : 'border-stone-300 bg-white group-hover:border-stone-400'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>

                            <div className="flex items-center space-x-2 min-w-0">
                              <span className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                                {method.title}
                              </span>
                              {method.isExpress && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-900 rounded border border-amber-300/60 flex items-center space-x-0.5 shrink-0">
                                  <Zap className="w-3 h-3 text-amber-600" />
                                  <span>Express</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-2">
                            <span className="text-xs sm:text-sm font-bold text-stone-900">
                              {price === 0 ? (
                                <span className="text-emerald-700 font-extrabold">FREE</span>
                              ) : (
                                formatTaka(price)
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* SECTION 3: Payment Methods (Hidden ONLY when unconditional Free Delivery mode is active in Payment Info) */}
              {!isUnconditionalFree && (
                <section className="bg-white border border-stone-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900">
                      Payment Method
                    </h2>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Safe & Verified</span>
                  </div>
                </div>

                {/* Gateway Tab Selectors */}
                <div className="space-y-4">
                  {effectivePaymentMethods.length > 1 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {effectivePaymentMethods.map((method) => {
                        const isSelected = paymentType === method.id;
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentType(method.id)}
                            className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                              isSelected
                                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200 text-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-700'}`} />
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                isSelected 
                                  ? 'bg-stone-800 text-stone-200' 
                                  : 'bg-stone-200/80 text-stone-700'
                              }`}>
                                {method.badge}
                              </span>
                            </div>
                            <div>
                              <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                                {method.id === 'cod' ? 'Cash on Delivery' : method.name}
                              </p>
                              <p className={`text-xs truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                                {method.subtitle}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Cash on Delivery Details */}
                  {paymentType === 'cod' && (
                    <div className="space-y-3.5">
                      {/* Zero Advance COD View */}
                      {!isCodAdvanceRequired ? (
                        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-xl p-4 flex items-start space-x-3.5">
                          <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Banknote className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                                Cash on Delivery
                              </h4>
                              <span className="text-[10px] sm:text-[11px] font-bold uppercase bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                                Zero Advance
                              </span>
                            </div>
                            <p className="hidden sm:block text-xs text-stone-600 mt-1 leading-relaxed">
                              Pay 100% cash upon doorstep delivery after inspecting your shoes.
                            </p>
                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-stone-600">
                              <span className="flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>No advance payment needed</span>
                              </span>
                              <span className="text-stone-300">•</span>
                              <span className="flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Size check allowed</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* COD with Required Advance View */
                        <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                          {/* Header with Title and Advance Badge */}
                          <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2.5 pb-0.5">
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-stone-900 text-white hidden sm:flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                ৳
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                                  COD Advance Payment Required
                                </h4>
                                <p className="text-xs text-stone-500 mt-0.5 leading-normal">
                                  Pay delivery charge ({formatTaka(codAdvanceAmount)}) advance to confirm COD order
                                </p>
                              </div>
                            </div>

                            <span className="inline-flex items-center text-xs font-extrabold uppercase bg-stone-900 text-white px-3 py-1 rounded-lg shrink-0 whitespace-nowrap shadow-2xs">
                              {formatTaka(codAdvanceAmount)} Advance
                            </span>
                          </div>

                          {/* Advance Numbers Box */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                            {/* bKash Number */}
                            <div className="bg-white p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 flex items-center justify-between shadow-2xs transition-all">
                              <div className="flex items-center space-x-3 min-w-0 pr-2">
                                <div className="w-9 h-9 rounded-xl bg-[#E2136E]/10 flex items-center justify-center p-1.5 shrink-0 border border-[#E2136E]/20">
                                  <BkashIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">bKash Number</p>
                                  <p className="text-sm sm:text-base font-bold text-stone-900 tracking-wide select-all truncate">{codBkashNumber}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(codBkashNumber)}
                                className="min-h-[38px] px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold shrink-0 cursor-pointer flex items-center space-x-1.5 transition-all"
                              >
                                {copiedNumber === codBkashNumber ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Nagad Number */}
                            <div className="bg-white p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 flex items-center justify-between shadow-2xs transition-all">
                              <div className="flex items-center space-x-3 min-w-0 pr-2">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F7941D]/10 to-[#ED1C24]/10 flex items-center justify-center p-1.5 shrink-0 border border-[#F7941D]/20">
                                  <NagadIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Nagad Number</p>
                                  <p className="text-sm sm:text-base font-bold text-stone-900 tracking-wide select-all truncate">{codNagadNumber}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(codNagadNumber)}
                                className="min-h-[38px] px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold shrink-0 cursor-pointer flex items-center space-x-1.5 transition-all"
                              >
                                {copiedNumber === codNagadNumber ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>

                          </div>

                          {/* Advance Instruction Note */}
                          <div className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed flex items-start space-x-2.5">
                            <Info className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                            <p>
                              {(() => {
                                const defaultTpl = 'অর্ডার কনফার্ম করতে অনুগ্রহ করে উপরের বিকাশ বা নগদ নম্বরে ডেলিভারি চার্জ {amount} টাকা Send Money / Payment করুন এবং নিচের ঘরে আপনার ফোন নম্বর ও TrxID দিন। বাকি টাকা ডেলিভারির সময় ক্যাশে পরিশোধ করবেন।';
                                const rawText = paymentConfig.cod.instructions || defaultTpl;
                                const withAmount = rawText.includes('{amount}')
                                  ? rawText.replace('{amount}', formatTaka(codAdvanceAmount))
                                  : rawText;
                                
                                if (withAmount.includes('Send Money / Payment')) {
                                  const parts = withAmount.split('Send Money / Payment');
                                  return (
                                    <>
                                      <strong>নির্দেশনা:</strong> {parts[0]}
                                      <strong className="font-bold text-stone-900">Send Money / Payment</strong>
                                      {parts[1]}
                                    </>
                                  );
                                }
                                return (
                                  <>
                                    <strong>নির্দেশনা:</strong> {withAmount}
                                  </>
                                );
                              })()}
                            </p>
                          </div>

                          {/* Gateway Selector for Advance */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 shrink-0">
                              Paid Via:
                            </label>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setCodAdvanceGateway('bkash')}
                                className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                                  codAdvanceGateway === 'bkash'
                                    ? 'bg-[#E2136E] text-white shadow-xs ring-2 ring-[#E2136E]/20'
                                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                <BkashIcon className="w-4 h-4" variant={codAdvanceGateway === 'bkash' ? 'white' : 'color'} />
                                <span>bKash</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setCodAdvanceGateway('nagad')}
                                className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                                  codAdvanceGateway === 'nagad'
                                    ? 'bg-[#F7941D] text-white shadow-xs ring-2 ring-[#F7941D]/20'
                                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                <NagadIcon className="w-4 h-4" variant={codAdvanceGateway === 'nagad' ? 'white' : 'color'} />
                                <span>Nagad</span>
                              </button>
                            </div>
                          </div>

                          {/* Advance Inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                                Sender Phone Number *
                              </label>
                              <input
                                type="tel"
                                required={isCodAdvanceRequired}
                                value={codSenderPhone}
                                onChange={(e) => setCodSenderPhone(e.target.value)}
                                placeholder="017XXXXXXXX"
                                className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:ring-0 font-medium placeholder:text-stone-400/50 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                                Transaction ID (TrxID) *
                              </label>
                              <input
                                type="text"
                                required={isCodAdvanceRequired}
                                value={codTrxId}
                                onChange={(e) => setCodTrxId(e.target.value)}
                                placeholder="e.g. 9J48ABCD12"
                                className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:ring-0 font-mono uppercase placeholder:font-sans placeholder:normal-case placeholder:text-stone-400/50 transition-all"
                              />
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* Direct bKash Payment Details */}
                  {paymentType === 'bkash' && (
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[#E2136E]/10 flex items-center justify-center p-1.5 border border-[#E2136E]/20 shrink-0">
                            <BkashIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                              bKash {paymentConfig.bkash.type === 'merchant' ? 'Merchant Payment' : 'Personal Send Money'}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5 leading-normal">
                              {paymentConfig.bkash.type === 'merchant' ? 'Use Make Payment in bKash App' : 'Use Send Money in bKash App'}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 px-3 py-1 rounded-lg border border-stone-200 shrink-0 whitespace-nowrap">
                          {paymentConfig.bkash.type === 'merchant' ? 'Payment' : 'Send Money'}
                        </span>
                      </div>

                      {/* Number Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center justify-between shadow-2xs">
                        <div className="min-w-0 pr-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Store bKash Number
                          </p>
                          <p className="text-sm sm:text-base font-bold text-stone-900 tracking-wide select-all truncate mt-0.5">
                            {paymentConfig.bkash.accountNumber || '01900000000'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.bkash.accountNumber || '01900000000')}
                          className="min-h-[38px] px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                        >
                          {copiedNumber === (paymentConfig.bkash.accountNumber || '01900000000') ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {paymentConfig.bkash.instructions && (
                        <p className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                          {paymentConfig.bkash.instructions}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                            Your bKash Number *
                          </label>
                          <input
                            type="tel"
                            required={paymentType === 'bkash'}
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                            placeholder="017XXXXXXXX"
                            className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:ring-0 font-medium placeholder:text-stone-400/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            required={paymentType === 'bkash'}
                            value={paymentTrxId}
                            onChange={(e) => setPaymentTrxId(e.target.value)}
                            placeholder="e.g. 9J48ABCD12"
                            className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:ring-0 font-mono uppercase placeholder:font-sans placeholder:normal-case placeholder:text-stone-400/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct Nagad Payment Details */}
                  {paymentType === 'nagad' && (
                    <div className="bg-[#fbfaf8] border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F7941D]/10 to-[#ED1C24]/10 flex items-center justify-center p-1.5 border border-[#F7941D]/20 shrink-0">
                            <NagadIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                              Nagad {paymentConfig.nagad.type === 'merchant' ? 'Merchant Payment' : 'Personal Send Money'}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5 leading-normal">
                              {paymentConfig.nagad.type === 'merchant' ? 'Use Merchant Pay in Nagad App' : 'Use Send Money in Nagad App'}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 px-3 py-1 rounded-lg border border-stone-200 shrink-0 whitespace-nowrap">
                          {paymentConfig.nagad.type === 'merchant' ? 'Merchant' : 'Send Money'}
                        </span>
                      </div>

                      {/* Number Card */}
                      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center justify-between shadow-2xs">
                        <div className="min-w-0 pr-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Store Nagad Number
                          </p>
                          <p className="text-sm sm:text-base font-bold text-stone-900 tracking-wide select-all truncate mt-0.5">
                            {paymentConfig.nagad.accountNumber || '01885479477'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentConfig.nagad.accountNumber || '01885479477')}
                          className="min-h-[38px] px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                        >
                          {copiedNumber === (paymentConfig.nagad.accountNumber || '01885479477') ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {paymentConfig.nagad.instructions && (
                        <p className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                          {paymentConfig.nagad.instructions}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                            Your Nagad Number *
                          </label>
                          <input
                            type="tel"
                            required={paymentType === 'nagad'}
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                            placeholder="018XXXXXXXX"
                            className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:ring-0 font-medium placeholder:text-stone-400/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            required={paymentType === 'nagad'}
                            value={paymentTrxId}
                            onChange={(e) => setPaymentTrxId(e.target.value)}
                            placeholder="e.g. NGD7ABCD12"
                            className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:ring-0 font-mono uppercase placeholder:font-sans placeholder:normal-case placeholder:text-stone-400/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
              )}

              {/* Order Placement CTA (Desktop) */}
              <div className="pt-2 hidden lg:block">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white py-4 px-8 rounded-2xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer group"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Securing Your Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Place Order • {formatTaka(total)}</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-stone-400 mt-3">
                  By clicking Place Order, you agree to JUTU's terms of service & return policy.
                </p>
              </div>

            </div>

            {/* Right Column: Order Summary (5 Cols - Sticky) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sticky top-24 space-y-5 sm:space-y-6">
                
                {/* Summary Header */}
                <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-stone-100">
                  <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-900">
                    Order Summary
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-stone-500">
                    {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>

                {/* Products List */}
                <div className="space-y-3.5 sm:space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm py-1 group">
                      <div className="flex items-center space-x-3.5">
                        <div className="relative w-14 h-14 bg-stone-50 rounded-xl p-1.5 border border-stone-200/70 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.selectedColor.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 uppercase tracking-tight text-xs sm:text-sm">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {item.selectedColor.name} • Size {item.selectedSize}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">
                          {formatTaka(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Rows */}
                <div className="pt-3.5 sm:pt-4 border-t border-stone-100 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatTaka(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Discount ({discountCode || 'Promo'})</span>
                      </span>
                      <span>-{formatTaka(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-stone-600">
                    <div>
                      <span>Delivery</span>
                      <p className="text-xs text-stone-400 font-normal">
                        {selectedShippingMethod.title}
                      </p>
                    </div>
                    <span className="font-semibold text-stone-900">
                      {isCodAdvanceRequired ? (
                        <span className="font-bold text-stone-900">
                          Advance
                        </span>
                      ) : shippingFee === 0 ? (
                        <span className="text-emerald-700 font-extrabold tracking-wide">FREE</span>
                      ) : (
                        formatTaka(shippingFee)
                      )}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900">
                      Total Amount
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight text-right">
                      {formatTaka(total)}
                    </span>
                  </div>
                  {isCodAdvanceRequired && (
                    <p className="text-xs text-stone-500 mt-1.5 text-left">
                      Pay {formatTaka(codAdvanceAmount)} advance • Pay {formatTaka(total)} on delivery
                    </p>
                  )}
                </div>

                {/* Order Placement CTA (Phone & Tablet) */}
                <div className="pt-2 pb-3 lg:hidden">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer group"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Securing Your Order...</span>
                      </div>
                    ) : (
                      <>
                        <span>Place Order • {formatTaka(total)}</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 text-stone-400 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] sm:text-[11px] text-stone-400/60 font-medium mt-3 pb-1 tracking-tight">
                    By clicking Place Order, you agree to JUTU's terms of service & return policy.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
