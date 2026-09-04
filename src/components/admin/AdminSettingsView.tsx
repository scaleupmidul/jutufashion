import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  Tag, 
  Shield, 
  MessageSquare, 
  Mail, 
  CreditCard, 
  Layout, 
  Gift, 
  Globe, 
  Columns, 
  Save, 
  Check, 
  ChevronRight, 
  Upload, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Smartphone, 
  Monitor, 
  Send, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Sliders, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  Truck,
  MapPin,
  Zap,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { uploadImageToServer } from '../../utils/imageUpload';
import { 
  StoreSettings, 
  AdminSettingsSubTab, 
  CategoryItem, 
  CouponItem, 
  HeroSlideItem,
  DeliveryOptionItem 
} from '../../types';
import { 
  getStoredPagesContent, 
  savePagesContent, 
  getPaymentConfig, 
  savePaymentConfig, 
  getStoredProducts, 
  DEFAULT_DELIVERY_OPTIONS
} from '../../data/adminStore';

interface AdminSettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => Promise<{ success: boolean; error?: string }> | void;
  onResetStoreData: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetStoreData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSettingsSubTab>('header-logo');
  const [formSettings, setFormSettings] = useState<StoreSettings>(settings);
  const [pagesContent, setPagesContentState] = useState(getStoredPagesContent());
  const [paymentConfig, setPaymentConfigState] = useState(getPaymentConfig());
  
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [testActionStatus, setTestActionStatus] = useState<string | null>(null);

  // Security credentials state
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [confirmSecurityText, setConfirmSecurityText] = useState('');
  const [securityNotice, setSecurityNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Logo input mode: 'url' (default) or 'upload'
  const [logoInputMode, setLogoInputMode] = useState<'url' | 'upload'>('url');
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [logoNotice, setLogoNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoImageError, setLogoImageError] = useState(false);

  // Telegram states
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isVerifyingTelegram, setIsVerifyingTelegram] = useState(false);
  const [verifiedBot, setVerifiedBot] = useState<{ username?: string; first_name: string } | null>(null);
  const [telegramNotice, setTelegramNotice] = useState<{
    type: 'success' | 'error' | 'info';
    title?: string;
    message: string;
    botInfo?: any;
  } | null>(null);

  useEffect(() => {
    setLogoImageError(false);
  }, [formSettings.headerLogoUrl]);

  const processLogoFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      setLogoNotice({
        type: 'error',
        text: 'Please select an image file (PNG, SVG, WebP, JPG).',
      });
      return;
    }

    setIsUploadingLogo(true);
    setLogoNotice(null);
    setLogoImageError(false);

    try {
      const uploadRes = await uploadImageToServer(file, {
        maxWidth: 900,
        maxHeight: 450,
        quality: 0.95,
        format: 'image/png',
        preferDataUrl: true,
      });

      if (!uploadRes.success || !uploadRes.url) {
        throw new Error(uploadRes.error || 'Failed to process logo image.');
      }

      const newLogoUrl = uploadRes.url;
      updateSetting('headerLogoUrl', newLogoUrl);

      // Auto-save to database so the logo updates everywhere instantly
      setIsSavingLogo(true);
      const updated = { ...formSettings, headerLogoUrl: newLogoUrl };
      const saveRes = await onSaveSettings(updated);
      setIsSavingLogo(false);

      if (saveRes && saveRes.success === false) {
        setLogoNotice({
          type: 'success',
          text: 'Logo uploaded. Click "SAVE SETTINGS" above to finalize.',
        });
      } else {
        setLogoNotice({
          type: 'success',
          text: 'Logo uploaded & saved to store successfully!',
        });
      }

      setTimeout(() => {
        setLogoNotice(null);
      }, 5000);
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setLogoNotice({
        type: 'error',
        text: err.message || 'Error processing logo upload. Please try another image.',
      });
    } finally {
      setIsUploadingLogo(false);
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleRemoveLogo = async () => {
    updateSetting('headerLogoUrl', '');
    setIsSavingLogo(true);
    await onSaveSettings({ ...formSettings, headerLogoUrl: '' });
    setIsSavingLogo(false);
    setLogoNotice({
      type: 'success',
      text: 'Logo removed. Brand text will be displayed in the header.',
    });
    setTimeout(() => setLogoNotice(null), 4000);
  };

  const handleDirectSaveLogo = async () => {
    setIsSavingLogo(true);
    setLogoNotice(null);
    try {
      const res = await onSaveSettings(formSettings);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to save settings');
      }
      setLogoNotice({ type: 'success', text: 'Logo settings saved to store successfully!' });
      setIsSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => {
        setIsSaved(false);
        setLogoNotice(null);
      }, 4000);
    } catch (err: any) {
      setLogoNotice({ type: 'error', text: err.message || 'Failed to save logo' });
    } finally {
      setIsSavingLogo(false);
    }
  };

  // Category modal
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatBadge, setNewCatBadge] = useState('');

  // Coupon modal
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponAmount, setNewCouponAmount] = useState<number>(10);
  const [newCouponMin, setNewCouponMin] = useState<number>(2000);

  // Sync with prop changes
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setFormSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePushChanges = async () => {
    setSecurityNotice(null);
    setSaveError(null);
    let updatedSettings = { ...formSettings };

    // If changing password or email in security tab
    if (newPassword || verifyPassword) {
      if (newPassword !== verifyPassword) {
        setSecurityNotice({ type: 'error', text: 'New password and Verify password do not match.' });
        return;
      }
      if (confirmSecurityText.trim().toUpperCase() !== 'CONFIRM') {
        setSecurityNotice({ type: 'error', text: 'Please type "CONFIRM" in the box below to authorize changing security credentials.' });
        return;
      }
      updatedSettings.adminPassword = newPassword;
      setNewPassword('');
      setVerifyPassword('');
      setConfirmSecurityText('');
    }

    setIsSaving(true);

    try {
      // 1. Commit Store Settings to Database
      const resSettings = await onSaveSettings(updatedSettings);
      if (resSettings && resSettings.success === false) {
        throw new Error(resSettings.error || 'Failed to save store settings in database');
      }

      // 2. Commit Pages Content to Database
      const resPages = await savePagesContent(pagesContent);
      if (resPages && resPages.success === false) {
        throw new Error(resPages.error || 'Failed to save pages content in database');
      }

      // 3. Commit Payment Config to Database
      const resPayment = await savePaymentConfig(paymentConfig);
      if (resPayment && resPayment.success === false) {
        throw new Error(resPayment.error || 'Failed to save payment settings in database');
      }

      setFormSettings(updatedSettings);
      if (newPassword) {
        setSecurityNotice({ type: 'success', text: 'Security credentials updated and activated in database successfully.' });
      }
      setIsSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => {
        setIsSaved(false);
        setSecurityNotice(null);
      }, 4000);
    } catch (err: any) {
      console.error('Database save error:', err);
      setSaveError(err.message || 'Database error: Could not commit changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      badge: newCatBadge.trim() || undefined,
      active: true,
      sortOrder: formSettings.categories.length + 1,
      productCount: 0,
    };
    updateSetting('categories', [...formSettings.categories, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatBadge('');
  };

  const handleDeleteCategory = (catId: string) => {
    updateSetting('categories', formSettings.categories.filter((c) => c.id !== catId));
  };

  const handleAddCoupon = () => {
    if (!newCouponCode.trim()) return;
    const newCpn: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountAmount: Number(newCouponAmount),
      minOrderAmount: Number(newCouponMin) || 0,
      active: true,
      usageCount: 0,
    };
    updateSetting('coupons', [...(formSettings.coupons || []), newCpn]);
    setNewCouponCode('');
    setNewCouponAmount(10);
    setNewCouponMin(2000);
  };

  const handleDeleteCoupon = (cpnId: string) => {
    updateSetting('coupons', (formSettings.coupons || []).filter((c) => c.id !== cpnId));
  };

  // Delivery & Logistics state
  const [isAddingDeliveryOption, setIsAddingDeliveryOption] = useState(false);
  const [newDeliveryTitle, setNewDeliveryTitle] = useState('');
  const [newDeliveryPrice, setNewDeliveryPrice] = useState<number>(100);
  const [newDeliveryEstimatedDays, setNewDeliveryEstimatedDays] = useState('2-3 business days');
  const [newDeliveryDescription, setNewDeliveryDescription] = useState('');
  const [newDeliveryIsExpress, setNewDeliveryIsExpress] = useState(false);
  const [newDeliveryAreaType, setNewDeliveryAreaType] = useState<'dhaka' | 'outside' | 'express' | 'custom'>('custom');

  // Delivery options list safe getter
  const deliveryOptionsList: DeliveryOptionItem[] = (formSettings.deliveryOptions && Array.isArray(formSettings.deliveryOptions) && formSettings.deliveryOptions.length > 0)
    ? formSettings.deliveryOptions
    : DEFAULT_DELIVERY_OPTIONS;

  const handleToggleDeliveryOption = (optId: string) => {
    const updated = deliveryOptionsList.map((opt) => opt.id === optId ? { ...opt, active: !opt.active } : opt);
    updateSetting('deliveryOptions', updated);
  };

  const handleUpdateDeliveryOption = (optId: string, field: keyof DeliveryOptionItem, value: any) => {
    const updated = deliveryOptionsList.map((opt) => {
      if (opt.id === optId) {
        return { ...opt, [field]: value };
      }
      return opt;
    });
    updateSetting('deliveryOptions', updated);

    // Sync root scalar charges if standard IDs
    if (field === 'price') {
      const numVal = Number(value) || 0;
      if (optId === 'dhaka-standard') updateSetting('shippingDhaka', numVal);
      if (optId === 'outside-dhaka') updateSetting('shippingOutside', numVal);
      if (optId === 'express-dhaka') updateSetting('shippingExpress', numVal);
    }
  };

  const handleAddDeliveryOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeliveryTitle.trim()) return;
    const newItem: DeliveryOptionItem = {
      id: `delivery-${Date.now()}`,
      title: newDeliveryTitle.trim(),
      description: newDeliveryDescription.trim() || 'Custom zone courier delivery',
      price: Number(newDeliveryPrice) || 0,
      estimatedDays: newDeliveryEstimatedDays.trim() || '2-3 business days',
      active: true,
      isExpress: newDeliveryIsExpress,
      areaType: newDeliveryAreaType,
    };
    updateSetting('deliveryOptions', [...deliveryOptionsList, newItem]);
    setNewDeliveryTitle('');
    setNewDeliveryPrice(100);
    setNewDeliveryEstimatedDays('2-3 business days');
    setNewDeliveryDescription('');
    setNewDeliveryIsExpress(false);
    setNewDeliveryAreaType('custom');
    setIsAddingDeliveryOption(false);
  };

  const handleDeleteDeliveryOption = (optId: string) => {
    const updated = deliveryOptionsList.filter((opt) => opt.id !== optId);
    updateSetting('deliveryOptions', updated);
  };

  const handleVerifyBotToken = async () => {
    const token = formSettings.telegramBotToken?.trim();
    if (!token) {
      setTelegramNotice({
        type: 'error',
        title: 'Empty Bot Token',
        message: 'Please paste your Telegram Bot Token from @BotFather first.',
      });
      return;
    }

    setIsVerifyingTelegram(true);
    setTelegramNotice(null);

    try {
      const res = await fetch('/api/telegram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.bot) {
        setVerifiedBot(data.bot);
        setTelegramNotice({
          type: 'success',
          title: 'Bot Token Verified!',
          message: `Connected to @${data.bot.username || data.bot.first_name} (${data.bot.first_name}). Token is active and recognized by Telegram.`,
          botInfo: data.bot,
        });
      } else {
        setVerifiedBot(null);
        setTelegramNotice({
          type: 'error',
          title: data.code === 401 ? 'Invalid Token (401 Unauthorized)' : 'Verification Failed',
          message: data.error || 'Telegram rejected this bot token.',
        });
      }
    } catch (err: any) {
      setTelegramNotice({
        type: 'error',
        title: 'Network Error',
        message: err.message || 'Failed to verify bot token.',
      });
    } finally {
      setIsVerifyingTelegram(false);
    }
  };

  const handleTestTelegram = async () => {
    const token = formSettings.telegramBotToken?.trim();
    const chatId = formSettings.telegramChatId?.trim();

    if (!token) {
      setTelegramNotice({
        type: 'error',
        title: 'Missing Bot Token',
        message: 'Please enter your Telegram Bot Token obtained from @BotFather.',
      });
      return;
    }

    if (!chatId) {
      setTelegramNotice({
        type: 'error',
        title: 'Missing Chat ID',
        message: 'Please enter your numeric Telegram Chat ID (e.g. from @userinfobot) or Channel ID.',
      });
      return;
    }

    setIsTestingTelegram(true);
    setTelegramNotice({
      type: 'info',
      title: 'Testing Telegram Dispatch...',
      message: 'Connecting to Telegram servers and sending test notification payload...',
    });

    try {
      // 1. First save current settings so backend disk/db has the latest token and chatId
      if (onSaveSettings) {
        await onSaveSettings(formSettings);
      }

      // 2. Call real backend test route
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: token,
          chatId: chatId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.bot) setVerifiedBot(data.bot);
        setTelegramNotice({
          type: 'success',
          title: 'Test Alert Delivered Successfully! 🚀',
          message: `A live notification was sent to your Telegram chat. Check your Telegram app to see the notification! (Bot: @${data.bot?.username || data.bot?.first_name || 'Bot'})`,
          botInfo: data.bot,
        });
      } else {
        if (data.bot) setVerifiedBot(data.bot);
        setTelegramNotice({
          type: 'error',
          title: data.code === 401 ? 'Bot Token Unauthorized (401)' : 'Telegram Delivery Failed',
          message: data.error || 'Failed to dispatch Telegram message.',
          botInfo: data.bot,
        });
      }
    } catch (err: any) {
      setTelegramNotice({
        type: 'error',
        title: 'Connection Error',
        message: err.message || 'Could not contact server to dispatch Telegram test.',
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleTestSMTP = () => {
    setTestActionStatus('Connecting to SMTP Host ' + formSettings.smtpHost + '...');
    setTimeout(() => {
      setTestActionStatus('✅ Success! Test order confirmation email sent to ' + (formSettings.smtpAdminAlertEmail || formSettings.smtpSenderEmail));
      setTimeout(() => setTestActionStatus(null), 4000);
    }, 1000);
  };

  // Nav list without redundant tabs
  const subNavItems: { id: AdminSettingsSubTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'header-logo', label: 'HEADER LOGO', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'categories', label: 'CATEGORIES', icon: <Tag className="w-4 h-4" /> },
    { id: 'security', label: 'SECURITY', icon: <Shield className="w-4 h-4" /> },
    { id: 'telegram', label: 'TELEGRAM 🔔', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'smtp-email', label: 'SMTP EMAIL', icon: <Mail className="w-4 h-4" /> },
    { id: 'logistics', label: 'LOGISTICS & RATES', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'marketing', label: 'MARKETING', icon: <Gift className="w-4 h-4" /> },
    { id: 'tracking', label: 'TRACKING', icon: <Globe className="w-4 h-4" /> },
    { id: 'footer', label: 'FOOTER', icon: <Columns className="w-4 h-4" /> },
  ];

  return (
    <div className="relative pb-24 animate-fadeIn font-sans">
      
      {/* Outer Card Container */}
      <div className="bg-[#f0ece5] rounded-3xl p-4 sm:p-7 md:p-9 shadow-sm border border-stone-300/80">
        
        {/* Top Header matching exact screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-5 border-b border-stone-300/60">
          
          <div className="flex items-center space-x-3.5">
            {/* Gear Icon in rounded white box */}
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-200/80 text-stone-900">
              <SettingsIcon className="w-5 h-5" />
            </div>

            <div>
              <h1 className="font-serif tracking-[0.14em] text-lg sm:text-xl md:text-2xl font-bold text-stone-950 uppercase leading-none">
                CORE <span className="font-normal text-stone-600 font-sans tracking-[0.1em]">CONFIGURATIONS</span>
              </h1>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-xs bg-emerald-600 inline-block animate-pulse"></span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-stone-600">
                  SYSTEM SYNCHRONIZED
                </span>
              </div>
            </div>
          </div>

          {/* Right Meta Info */}
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono tracking-wider font-semibold text-stone-500 block uppercase">
              SYNC KEY: 1X-48Y
            </span>
            <span className="text-[10px] font-mono tracking-wider font-semibold text-stone-500 block uppercase">
              CORE V2.5.0-COMPACT
            </span>
          </div>

        </div>

        {/* Action Status Toast Banner */}
        {testActionStatus && (
          <div className="mb-6 bg-stone-950 text-white px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fadeIn border border-stone-700 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{testActionStatus}</span>
          </div>
        )}

        {/* Main 2-Column Split matching the screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SUB-NAVIGATION MENU (4 Cols on LG, 3 on XL) */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-stone-200/90 space-y-1">
            {subNavItems.map((item) => {
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100/80 hover:text-stone-950'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-white' : 'text-stone-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-stone-300" />}
                </button>
              );
            })}
          </div>

          {/* RIGHT CONFIGURATION CONTENT PANEL (8 Cols on LG, 9 on XL) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl p-5 sm:p-7 md:p-8 shadow-xs border border-stone-200/90 min-h-[560px]">
            
            {/* Top Quick Save Action Bar */}
            <div className="mb-6 pb-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isSaved ? 'bg-emerald-500' : hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-stone-400'}`} />
                <span className="text-[11px] font-bold tracking-wider uppercase text-stone-600">
                  {isSaved ? 'All Settings Saved' : hasUnsavedChanges ? 'Unsaved Changes' : 'Configurations Synchronized'}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePushChanges}
                className="bg-stone-950 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 shadow-xs"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SAVED</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE SETTINGS</span>
                  </>
                )}
              </button>
            </div>

            {/* ======================================================== */}
            {/* 1. HEADER LOGO & BRANDING (Exact match to screenshot)     */}
            {/* ======================================================== */}
            {activeSubTab === 'header-logo' && (
              <div className="space-y-6 sm:space-y-7 animate-fadeIn">
                
                {/* Header Title */}
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 rounded-xl text-stone-800 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      HEADER LOGO & BRANDING
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      CONFIGURE HEADER LOGO IMAGE ASSET AND DIMENSIONS
                    </p>
                  </div>
                </div>

                {/* Header Logo Image Asset Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-700">
                      HEADER LOGO IMAGE ASSET
                    </label>

                    {/* URL / UPLOAD Toggle Buttons */}
                    <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[10px] font-bold uppercase">
                      <button
                        type="button"
                        onClick={() => setLogoInputMode('url')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          logoInputMode === 'url' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
                        }`}
                      >
                        IMAGE URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoInputMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          logoInputMode === 'upload' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
                        }`}
                      >
                        UPLOAD FILE
                      </button>
                    </div>
                  </div>

                  {/* Logo Notification Toast / Banner */}
                  {logoNotice && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        logoNotice.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {logoNotice.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{logoNotice.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLogoNotice(null)}
                        className="text-stone-400 hover:text-stone-700 ml-2 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Hidden File Input for Direct Triggering */}
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/*"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />

                  {/* Image Input Controls */}
                  {logoInputMode === 'url' ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <LinkIcon className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={formSettings.headerLogoUrl}
                          onChange={(e) => {
                            updateSetting('headerLogoUrl', e.target.value);
                            setLogoImageError(false);
                          }}
                          placeholder="https://... or direct image url"
                          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl pl-9 pr-24 py-2.5 focus:outline-none focus:border-stone-800 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={handleDirectSaveLogo}
                          disabled={isSavingLogo}
                          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-stone-900 hover:bg-black text-white text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                        >
                          {isSavingLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          <span>Apply</span>
                        </button>
                      </div>

                      {/* Quick Presets / Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5 text-[10px]">
                        <div className="flex items-center space-x-1 text-stone-500 font-medium">
                          <span>Tip: Enter any HTTPS image link or use Upload File for local logos.</span>
                        </div>
                        {formSettings.headerLogoUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="text-stone-600 hover:text-stone-900 underline font-semibold cursor-pointer"
                          >
                            Clear to text logo
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingLogo(true);
                      }}
                      onDragLeave={() => setIsDraggingLogo(false)}
                      onDrop={handleLogoDrop}
                      onClick={() => !isUploadingLogo && logoFileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2.5 ${
                        isDraggingLogo
                          ? 'border-stone-900 bg-stone-100 scale-[1.01]'
                          : isUploadingLogo
                          ? 'border-stone-400 bg-stone-50 pointer-events-none'
                          : 'border-stone-300 bg-stone-50/70 hover:border-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      {isUploadingLogo ? (
                        <div className="flex flex-col items-center justify-center space-y-2 py-3">
                          <Loader2 className="w-7 h-7 text-stone-900 animate-spin" />
                          <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                            Uploading & Saving Logo...
                          </p>
                          <p className="text-[10px] text-stone-500">Optimizing image for retina displays</p>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-white rounded-full border border-stone-200 shadow-2xs text-stone-700">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
                              Click to choose or Drag & Drop Logo
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              Supports PNG (transparent recommended), SVG, WebP, JPG
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              logoFileInputRef.current?.click();
                            }}
                            className="bg-stone-950 hover:bg-black text-white text-[11px] font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
                          >
                            Browse Image File
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Image Asset Preview & Management Box */}
                  <div className="bg-stone-50/80 border border-stone-200/90 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      <span>CURRENT HEADER LOGO ASSET</span>
                      {formSettings.headerLogoUrl ? (
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-extrabold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>IMAGE ASSET ACTIVE</span>
                        </span>
                      ) : (
                        <span className="text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded-md font-semibold">
                          USING TEXT BRAND NAME
                        </span>
                      )}
                    </div>

                    {/* Visual Asset Canvas Display */}
                    <div className="p-5 bg-white border border-stone-200 rounded-xl flex items-center justify-center min-h-[95px] relative overflow-hidden shadow-2xs">
                      {formSettings.headerLogoUrl && !logoImageError ? (
                        <img
                          src={formSettings.headerLogoUrl}
                          alt="Header Logo Asset"
                          onError={() => setLogoImageError(true)}
                          className="max-h-[75px] max-w-full object-contain filter contrast-125"
                        />
                      ) : formSettings.headerLogoUrl && logoImageError ? (
                        <div className="flex flex-col items-center justify-center text-center p-2 text-stone-700">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mb-1" />
                          <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                            Image Could Not Be Loaded
                          </p>
                          <p className="text-[10px] text-stone-500 max-w-sm mt-0.5">
                            The provided URL is unreachable or broken in this browser. Please check the URL or use "Upload File".
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="text-[10px] font-bold uppercase text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Reset to Text Brand
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLogoInputMode('upload');
                                logoFileInputRef.current?.click();
                              }}
                              className="text-[10px] font-bold uppercase text-white bg-stone-900 hover:bg-black px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload File</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="font-sans font-black text-2xl tracking-[0.2em] text-stone-900 uppercase">
                          {formSettings.storeName || 'JUTU'}
                        </span>
                      )}
                    </div>

                    {/* Action Controls for Logo */}
                    {formSettings.headerLogoUrl && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="text-[11px] font-bold uppercase text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Change Logo</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            disabled={isSavingLogo}
                            className="text-[11px] font-bold uppercase text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Logo</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleDirectSaveLogo}
                          disabled={isSavingLogo}
                          className="text-[11px] font-bold uppercase text-white bg-stone-950 hover:bg-black px-4 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                        >
                          {isSavingLogo ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Save Logo to Store</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <p className="text-[10px] text-stone-500 font-medium">
                      Upload a transparent PNG, SVG, or WebP logo file. The logo will automatically scale cleanly across both PC and mobile headers.
                    </p>
                  </div>
                </div>

                {/* Dimension Sliders Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* PC / Desktop Slider */}
                  <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-stone-800">
                        <Monitor className="w-4 h-4" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider">
                          PC / DESKTOP LOGO HEIGHT
                        </span>
                      </div>
                      <span className="bg-white border border-stone-300 text-stone-900 font-mono text-xs font-bold px-2 py-0.5 rounded-lg shadow-2xs">
                        {formSettings.desktopLogoHeight}px
                      </span>
                    </div>

                    <input
                      type="range"
                      min={30}
                      max={150}
                      value={formSettings.desktopLogoHeight}
                      onChange={(e) => updateSetting('desktopLogoHeight', Number(e.target.value))}
                      className="w-full accent-stone-950 cursor-pointer"
                    />

                    <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase font-semibold">
                      <span>30PX</span>
                      <span>60PX (DEFAULT)</span>
                      <span>150PX</span>
                    </div>
                  </div>

                  {/* Phone / Mobile Slider */}
                  <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-stone-800">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider">
                          PHONE / MOBILE LOGO HEIGHT
                        </span>
                      </div>
                      <span className="bg-white border border-stone-300 text-stone-900 font-mono text-xs font-bold px-2 py-0.5 rounded-lg shadow-2xs">
                        {formSettings.mobileLogoHeight}px
                      </span>
                    </div>

                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={formSettings.mobileLogoHeight}
                      onChange={(e) => updateSetting('mobileLogoHeight', Number(e.target.value))}
                      className="w-full accent-stone-950 cursor-pointer"
                    />

                    <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase font-semibold">
                      <span>20PX</span>
                      <span>32PX (DEFAULT)</span>
                      <span>100PX</span>
                    </div>
                  </div>

                </div>

                {/* Header Live Preview Matching Screenshot */}
                <div className="space-y-2.5 pt-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-700 block">
                    HEADER LIVE PREVIEW
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* PC / Laptop View */}
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center space-x-1.5 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>PC / LAPTOP VIEW</span>
                      </div>
                      <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center justify-between shadow-2xs">
                        {formSettings.headerLogoUrl && !logoImageError ? (
                          <img
                            src={formSettings.headerLogoUrl}
                            alt="Logo preview"
                            onError={() => setLogoImageError(true)}
                            style={{ height: `${formSettings.desktopLogoHeight * 0.75}px` }}
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-sans font-black tracking-[0.18em] text-stone-950 uppercase" style={{ fontSize: `${formSettings.desktopLogoHeight * 0.45}px` }}>
                            {formSettings.storeName}
                          </span>
                        )}
                        <div className="hidden sm:flex space-x-3 text-[10px] font-bold text-stone-400 uppercase">
                          <span>SHOP</span>
                          <span>MEN</span>
                          <span>WOMEN</span>
                        </div>
                      </div>
                    </div>

                    {/* Phone / Mobile View */}
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center space-x-1.5 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>PHONE / MOBILE VIEW</span>
                      </div>
                      <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center justify-center shadow-2xs">
                        {formSettings.headerLogoUrl && !logoImageError ? (
                          <img
                            src={formSettings.headerLogoUrl}
                            alt="Logo preview mobile"
                            onError={() => setLogoImageError(true)}
                            style={{ height: `${formSettings.mobileLogoHeight * 0.9}px` }}
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-sans font-black tracking-[0.18em] text-stone-950 uppercase" style={{ fontSize: `${formSettings.mobileLogoHeight * 0.65}px` }}>
                            {formSettings.storeName}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* 2. CATEGORIES                                            */}
            {/* ======================================================== */}
            {activeSubTab === 'categories' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 rounded-xl text-stone-800 shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      PRODUCT CATEGORIES & SILHOUETTES
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      MANAGE FOOTWEAR MODELS, TAXONOMY, SLUGS & BADGES
                    </p>
                  </div>
                </div>

                {/* Add Category Form */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                    Add New Category
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Wool Runners)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      placeholder="Slug (e.g. wool-runners)"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      className="bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 font-mono"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Badge (e.g. BEST SELLER)"
                        value={newCatBadge}
                        onChange={(e) => setNewCatBadge(e.target.value)}
                        className="bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 uppercase flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-stone-950 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-black transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                      Active Categories ({formSettings.categories.length})
                    </span>
                    <span className="text-[10px] font-semibold text-stone-400">
                      Live Store Synchronization
                    </span>
                  </div>

                  {formSettings.categories.map((cat, idx) => {
                    const allProds = getStoredProducts();
                    const count = allProds.filter((p) => p.category?.toLowerCase() === cat.slug?.toLowerCase() || p.category?.toLowerCase() === cat.name?.toLowerCase()).length;

                    return (
                      <div
                        key={cat.id || idx}
                        className="flex items-center justify-between p-3.5 bg-stone-50/80 hover:bg-white border border-stone-200 rounded-xl transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono font-bold text-stone-400 w-5">#{idx + 1}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-stone-900">{cat.name}</span>
                              {cat.badge && (
                                <span className="bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {cat.badge}
                                </span>
                              )}
                              <span className="bg-stone-200 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                {count} {count === 1 ? 'Product' : 'Products'}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-stone-500">Slug: /{cat.slug}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-stone-600">
                            <input
                              type="checkbox"
                              checked={cat.active}
                              onChange={(e) => {
                                const updated = formSettings.categories.map((c) =>
                                  c.id === cat.id ? { ...c, active: e.target.checked } : c
                                );
                                updateSetting('categories', updated);
                              }}
                              className="rounded-xs accent-stone-900 cursor-pointer"
                            />
                            <span className="text-[10px] uppercase">Active</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Delete category "${cat.name}"`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 3. SECURITY & ACCESS CONTROL (Exact match to Sazo screenshot) */}
            {/* ======================================================== */}
            {activeSubTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2.5 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      DASHBOARD SECURITY
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      ADMIN ACCESS CONTROL
                    </p>
                  </div>
                </div>

                {/* Security Feedback if any */}
                {securityNotice && (
                  <div className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2.5 animate-fadeIn ${
                    securityNotice.type === 'error'
                      ? 'bg-rose-50 border border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-bold">{securityNotice.text}</span>
                  </div>
                )}

                {/* Admin Primary Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
                    <span>ADMIN PRIMARY EMAIL</span>
                    <Lock className="w-3.5 h-3.5 text-stone-600 inline" />
                  </label>
                  <input
                    type="email"
                    value={formSettings.adminEmail || 'jutufashion@gmail.com'}
                    onChange={(e) => updateSetting('adminEmail', e.target.value)}
                    placeholder="jutufashion@gmail.com"
                    className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 outline-none transition-all font-mono"
                  />
                </div>

                {/* Password Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Secure Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                      NEW SECURE PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 pr-10 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 focus:outline-none cursor-pointer"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Verify New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                      VERIFY NEW PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showVerifyPassword ? 'text' : 'password'}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 pr-10 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 focus:outline-none cursor-pointer"
                        title={showVerifyPassword ? 'Hide password' : 'Show password'}
                      >
                        {showVerifyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important Amber Notice */}
                <div className="bg-amber-50/90 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-start space-x-3">
                  <span className="text-sm shrink-0">⚠️</span>
                  <p className="text-xs font-bold leading-relaxed tracking-wide uppercase">
                    IMPORTANT: CHANGING SECURITY CREDENTIALS REQUIRES TYPED CONFIRMATION BELOW "PUSH UPDATES" TO ACTIVATE.
                  </p>
                </div>

                {/* Confirm Activation Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-stone-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black uppercase tracking-widest font-sans">
                        TYPE CONFIRM TO ACTIVATE
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Type <strong className="font-mono text-stone-900">CONFIRM</strong> in the box to authorize security credential updates.
                    </p>
                  </div>

                  <div className="w-full sm:w-48">
                    <input
                      type="text"
                      value={confirmSecurityText}
                      onChange={(e) => setConfirmSecurityText(e.target.value)}
                      placeholder="CONFIRM"
                      className="w-full bg-white border border-stone-300 focus:border-stone-950 focus:ring-1 focus:ring-stone-950 text-stone-950 text-xs font-mono font-bold tracking-widest text-center rounded-xl p-2.5 uppercase outline-none"
                    />
                  </div>
                </div>

                {/* Secondary Session & PIN Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-stone-800">
                      <KeyRound className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Quick Access PIN</span>
                    </div>
                    <input
                      type="password"
                      maxLength={8}
                      value={formSettings.adminPin}
                      onChange={(e) => updateSetting('adminPin', e.target.value)}
                      placeholder="1234"
                      className="w-full bg-white border border-stone-300 text-stone-900 text-base font-mono font-bold tracking-widest rounded-xl p-2 text-center"
                    />
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-stone-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Session Auto-Logout</span>
                    </div>
                    <select
                      value={formSettings.sessionTimeout || '1h'}
                      onChange={(e) => updateSetting('sessionTimeout', e.target.value as any)}
                      className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5"
                    >
                      <option value="15m">15 Minutes Inactivity</option>
                      <option value="30m">30 Minutes Inactivity</option>
                      <option value="1h">1 Hour (Recommended)</option>
                      <option value="4h">4 Hours</option>
                      <option value="never">Never (Stay Logged In)</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* 4. TELEGRAM 🔔 NOTIFICATIONS                             */}
            {/* ======================================================== */}
            {activeSubTab === 'telegram' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 rounded-xl text-stone-800 shrink-0">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase flex items-center space-x-1.5">
                      <span>TELEGRAM BOT NOTIFICATIONS</span>
                      <span className="text-xs">🔔</span>
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      REAL-TIME INSTANT TELEGRAM ALERTS FOR ORDERS & INQUIRIES
                    </p>
                  </div>
                </div>

                {/* Master Switch */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase text-stone-900 block">
                        Telegram Dispatch Gateway
                      </span>
                      {formSettings.telegramEnabled ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-200 text-stone-600">
                          DISABLED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500">
                      Forward customer order notifications and critical store alerts instantly to your Telegram chat or group.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSettings.telegramEnabled}
                      onChange={(e) => updateSetting('telegramEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-950"></div>
                  </label>
                </div>

                {/* Status / Feedback Banner */}
                {telegramNotice && (
                  <div
                    className={`p-4 rounded-2xl border text-xs animate-fadeIn ${
                      telegramNotice.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : telegramNotice.type === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : 'bg-stone-100 border-stone-300 text-stone-900'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {telegramNotice.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : telegramNotice.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-stone-700 shrink-0 animate-spin mt-0.5" />
                      )}
                      <div className="flex-1">
                        {telegramNotice.title && (
                          <div className="font-bold uppercase tracking-wider text-xs mb-1">
                            {telegramNotice.title}
                          </div>
                        )}
                        <p className="leading-relaxed">{telegramNotice.message}</p>
                        {telegramNotice.botInfo && (
                          <div className="mt-2 pt-2 border-t border-emerald-200/50 flex items-center space-x-3 text-[11px] font-mono">
                            <span>Bot: <b>@{telegramNotice.botInfo.username || telegramNotice.botInfo.first_name}</b></span>
                            <span>ID: <code>{telegramNotice.botInfo.id}</code></span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setTelegramNotice(null)}
                        className="text-stone-400 hover:text-stone-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                        Telegram Bot Token
                      </label>
                      {verifiedBot && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>@{verifiedBot.username || verifiedBot.first_name}</span>
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formSettings.telegramBotToken}
                        onChange={(e) => {
                          updateSetting('telegramBotToken', e.target.value);
                          setVerifiedBot(null);
                        }}
                        placeholder="e.g. 7482910482:AAHp9Q8L9dK1L..."
                        className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5 pr-20 focus:outline-none focus:border-stone-800"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyBotToken}
                        disabled={isVerifyingTelegram || !formSettings.telegramBotToken?.trim()}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 text-[10px] font-bold uppercase rounded-lg text-stone-800 transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        {isVerifyingTelegram ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span>Verify</span>
                        )}
                      </button>
                    </div>
                    <span className="text-[9px] text-stone-400 block mt-1">
                      Obtain from @BotFather on Telegram (e.g. 123456789:ABCdef...)
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                      Telegram Chat ID / Channel ID
                    </label>
                    <input
                      type="text"
                      value={formSettings.telegramChatId}
                      onChange={(e) => updateSetting('telegramChatId', e.target.value)}
                      placeholder="e.g. 1955363878 or -1001984729184"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5 focus:outline-none focus:border-stone-800"
                    />
                    <span className="text-[9px] text-stone-400 block mt-1">
                      Your numeric user Chat ID (from @userinfobot) or group/channel ID
                    </span>
                  </div>
                </div>

                {/* Triggers */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                    Active Alert Triggers
                  </span>

                  <label className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-stone-300 transition-colors">
                    <span className="text-xs font-bold text-stone-800">📦 New Order Placed (Instant Order Notification with items & total)</span>
                    <input
                      type="checkbox"
                      checked={formSettings.telegramNotifyNewOrder}
                      onChange={(e) => updateSetting('telegramNotifyNewOrder', e.target.checked)}
                      className="rounded-xs accent-stone-950"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-stone-300 transition-colors">
                    <span className="text-xs font-bold text-stone-800">⚠️ Low Stock Warning (Inventory &lt; 3 pairs)</span>
                    <input
                      type="checkbox"
                      checked={formSettings.telegramNotifyLowStock}
                      onChange={(e) => updateSetting('telegramNotifyLowStock', e.target.checked)}
                      className="rounded-xs accent-stone-950"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-stone-300 transition-colors">
                    <span className="text-xs font-bold text-stone-800">💬 Customer Inquiry Received from Contact Page</span>
                    <input
                      type="checkbox"
                      checked={formSettings.telegramNotifyContactMessage}
                      onChange={(e) => updateSetting('telegramNotifyContactMessage', e.target.checked)}
                      className="rounded-xs accent-stone-950"
                    />
                  </label>
                </div>

                {/* Setup Instructions Helper Box */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-stone-700 space-y-2">
                  <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-stone-900 text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>How to connect your Telegram Bot (বট চালু করার নিয়ম):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-600 leading-relaxed">
                    <li>
                      Telegram-এ <b>@BotFather</b> লিখে সার্চ করুন এবং <code>/newbot</code> কমান্ড দিয়ে একটি বট বানিয়ে <b>API Token</b> কপি করুন।
                    </li>
                    <li className="font-semibold text-stone-800">
                      <b>জরুরি ধাপ (Start Bot):</b> আপনার নতুন তৈরি করা বটে Telegram-এ যান এবং <b>START</b> বা <code>/start</code> বাটনে চাপ দিন। (বটে /start না দিলে টেলিগ্রাম থেকে মেসেজ পাঠানো যায় না)।
                    </li>
                    <li>
                      আপনার Chat ID পেতে টেলিগ্রামে <b>@userinfobot</b> বা <b>@raw_data_bot</b>-এ যেকোনো মেসেজ দিন এবং প্রাপ্ত <code>Id</code> টি উপরে <b>Telegram Chat ID</b> ঘরে পেস্ট করুন।
                    </li>
                    <li>
                      নিচের <b>SEND TEST TELEGRAM MESSAGE</b> বাটনে চাপ দিয়ে সরাসরি টেস্ট নোটিফিকেশন চেক করুন।
                    </li>
                  </ol>
                </div>

                {/* Test Action */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={isTestingTelegram}
                    className="bg-stone-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    {isTestingTelegram ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isTestingTelegram ? 'DISPATCHING TEST MESSAGE...' : 'SEND TEST TELEGRAM MESSAGE'}</span>
                  </button>

                  {formSettings.telegramBotToken && formSettings.telegramChatId && (
                    <span className="text-[11px] text-stone-500 font-mono">
                      Target: Chat #{formSettings.telegramChatId}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. SMTP EMAIL                                            */}
            {/* ======================================================== */}
            {activeSubTab === 'smtp-email' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 rounded-xl text-stone-800 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      SMTP EMAIL CONFIGURATION
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      AUTOMATED ORDER CONFIRMATIONS & ADMIN EMAIL ALERTS
                    </p>
                  </div>
                </div>

                {/* Master Switch */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-stone-900 block">
                      SMTP Mail Server Gateway
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Send transactional email receipts to customers upon order confirmation.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSettings.smtpEnabled}
                      onChange={(e) => updateSetting('smtpEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-950"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={formSettings.smtpHost}
                      onChange={(e) => updateSetting('smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Port
                    </label>
                    <input
                      type="number"
                      value={formSettings.smtpPort}
                      onChange={(e) => updateSetting('smtpPort', Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Encryption
                    </label>
                    <select
                      value={formSettings.smtpEncryption}
                      onChange={(e) => updateSetting('smtpEncryption', e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5"
                    >
                      <option value="TLS">TLS (Port 587)</option>
                      <option value="SSL">SSL (Port 465)</option>
                      <option value="NONE">None (Port 25)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Username / Email
                    </label>
                    <input
                      type="text"
                      value={formSettings.smtpUsername}
                      onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                      placeholder="orders@jutufootwear.com"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Password / App Password
                    </label>
                    <input
                      type="password"
                      value={formSettings.smtpPassword}
                      onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.smtpSenderName}
                      onChange={(e) => updateSetting('smtpSenderName', e.target.value)}
                      placeholder="JUTU Footwear Bangladesh"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Admin Alert Forwarding Email
                    </label>
                    <input
                      type="email"
                      value={formSettings.smtpAdminAlertEmail}
                      onChange={(e) => updateSetting('smtpAdminAlertEmail', e.target.value)}
                      placeholder="admin@jutu.com.bd"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTestSMTP}
                    className="bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND TEST EMAIL CONFIRMATION</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 6. LOGISTICS & RATES                                     */}
            {/* ======================================================== */}
            {activeSubTab === 'logistics' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-stone-900 rounded-xl text-white shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                          DELIVERY RATES & LOGISTICS
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {deliveryOptionsList.filter((o) => o.active).length} Active
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                        CONFIGURE NATIONWIDE SHIPPING CHARGES AND FREE DELIVERY RULES
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingDeliveryOption(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer self-start sm:self-auto active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Method</span>
                  </button>
                </div>

                {/* 1. Free Delivery Rule & Threshold */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formSettings.freeShippingEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-400'}`}>
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wide">
                          Free Shipping Rule
                        </h3>
                        <p className="text-[11px] text-stone-500">
                          Offer ৳0 free delivery on all orders exceeding minimum cart threshold
                        </p>
                      </div>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors">
                      <span className="text-[11px] font-bold text-stone-800 uppercase">
                        {formSettings.freeShippingEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <input
                        type="checkbox"
                        checked={formSettings.freeShippingEnabled}
                        onChange={(e) => updateSetting('freeShippingEnabled', e.target.checked)}
                        className="w-4 h-4 rounded-xs accent-stone-950 cursor-pointer"
                      />
                    </label>
                  </div>

                  {formSettings.freeShippingEnabled && (
                    <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center gap-3 animate-fadeIn">
                      <label className="text-xs font-bold text-stone-700 shrink-0">
                        Minimum Cart Value for Free Delivery:
                      </label>
                      <div className="relative w-full sm:w-48">
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={formSettings.freeShippingThreshold}
                          onChange={(e) => updateSetting('freeShippingThreshold', Number(e.target.value))}
                          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2 pl-6 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                        <span className="absolute left-2 top-2 text-xs font-bold text-stone-500">৳</span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        (Orders above ৳{formSettings.freeShippingThreshold.toLocaleString()} get free shipping)
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Add New Custom Delivery Method Form (Expandable) */}
                {isAddingDeliveryOption && (
                  <form onSubmit={handleAddDeliveryOption} className="bg-stone-50 border border-stone-300/80 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <span className="text-xs font-bold uppercase text-stone-950">Add New Delivery Method</span>
                      <button
                        type="button"
                        onClick={() => setIsAddingDeliveryOption(false)}
                        className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-700 block mb-1">
                          Zone / Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newDeliveryTitle}
                          onChange={(e) => setNewDeliveryTitle(e.target.value)}
                          placeholder="e.g. Chittagong Division"
                          className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-700 block mb-1">
                          Charge (৳) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="0"
                            value={newDeliveryPrice}
                            onChange={(e) => setNewDeliveryPrice(Number(e.target.value))}
                            className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 pl-6 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                          <span className="absolute left-2 top-2.5 text-xs font-bold text-stone-500">৳</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-700 block mb-1">
                          Timeline *
                        </label>
                        <input
                          type="text"
                          required
                          value={newDeliveryEstimatedDays}
                          onChange={(e) => setNewDeliveryEstimatedDays(e.target.value)}
                          placeholder="e.g. 2-3 business days"
                          className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase text-stone-700 block mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={newDeliveryDescription}
                          onChange={(e) => setNewDeliveryDescription(e.target.value)}
                          placeholder="e.g. Door-to-door courier delivery"
                          className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-5">
                        <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-stone-800">
                          <input
                            type="checkbox"
                            checked={newDeliveryIsExpress}
                            onChange={(e) => setNewDeliveryIsExpress(e.target.checked)}
                            className="rounded-xs accent-stone-950"
                          />
                          <span className="text-[11px] uppercase">Mark as Express ⚡</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setIsAddingDeliveryOption(false)}
                        className="px-4 py-2 bg-white hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                      >
                        Save Method
                      </button>
                    </div>
                  </form>
                )}

                {/* 3. Minimal Delivery Methods List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-900 tracking-wider">
                      Delivery Methods ({deliveryOptionsList.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {deliveryOptionsList.map((method) => {
                      const isStandard = ['dhaka-standard', 'outside-dhaka', 'express-dhaka'].includes(method.id);
                      return (
                        <div
                          key={method.id}
                          className={`border rounded-xl p-3.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            method.active
                              ? 'bg-white border-stone-200'
                              : 'bg-stone-50 border-stone-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              method.active 
                                ? method.isExpress || method.areaType === 'express'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-stone-900 text-white'
                                : 'bg-stone-200 text-stone-400'
                            }`}>
                              {method.isExpress || method.areaType === 'express' ? (
                                <Zap className="w-3.5 h-3.5" />
                              ) : method.areaType === 'outside' ? (
                                <MapPin className="w-3.5 h-3.5" />
                              ) : (
                                <Truck className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <span className="text-xs font-bold text-stone-950">
                                  {method.title || 'Untitled Method'}
                                </span>
                                {method.isExpress && (
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    EXPRESS
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500 block truncate">
                                {method.estimatedDays} • {method.description || 'Standard courier'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end space-x-3 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 shrink-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-stone-400">৳</span>
                              <input
                                type="number"
                                min="0"
                                value={method.price}
                                onChange={(e) => handleUpdateDeliveryOption(method.id, 'price', Number(e.target.value))}
                                className="w-20 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg px-2 py-1.5 text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                              />
                            </div>

                            <label className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                              method.active 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-stone-100 border-stone-200 text-stone-500'
                            }`}>
                              <span>{method.active ? 'Active' : 'Hidden'}</span>
                              <input
                                type="checkbox"
                                checked={method.active}
                                onChange={() => handleToggleDeliveryOption(method.id)}
                                className="w-3.5 h-3.5 rounded-xs accent-stone-950 cursor-pointer"
                              />
                            </label>

                            {!isStandard && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDeliveryOption(method.id)}
                                title="Delete"
                                className="p-1 text-stone-400 hover:text-red-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 7. MARKETING & PROMOTIONS                                */}
            {/* ======================================================== */}
            {activeSubTab === 'marketing' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 rounded-xl text-stone-800 shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      MARKETING & PROMOTIONS
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      DISCOUNT COUPONS, URGENCY TRIGGERS & PROMO BANNER
                    </p>
                  </div>
                </div>

                {/* Promo Banner Text */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 uppercase">Promo Banner Text</span>
                    <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-stone-700">
                      <input
                        type="checkbox"
                        checked={formSettings.promoBannerEnabled}
                        onChange={(e) => updateSetting('promoBannerEnabled', e.target.checked)}
                        className="rounded-xs accent-stone-950"
                      />
                      <span className="text-[10px] uppercase">Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formSettings.promoBannerText}
                    onChange={(e) => updateSetting('promoBannerText', e.target.value)}
                    placeholder="e.g. Free nationwide shipping on orders over ৳2,000"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5"
                  />
                </div>

                {/* Urgency Stock Threshold */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2">
                  <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                    Urgency Badge Stock Threshold (Pairs Left)
                  </label>
                  <input
                    type="number"
                    value={formSettings.urgencyStockThreshold}
                    onChange={(e) => updateSetting('urgencyStockThreshold', Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5"
                  />
                  <span className="text-[9px] text-stone-400 block">Show "Only X pairs left" banner on product page when stock reaches this level</span>
                </div>

                {/* Discount Coupons */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <span className="font-bold text-xs text-stone-900 uppercase block">
                    Active Promo Discount Codes
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="CODE (e.g. SAVE10)"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="bg-white border border-stone-300 text-stone-900 text-xs uppercase font-mono font-bold rounded-xl p-2.5"
                    />
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (৳)</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Discount Amount"
                      value={newCouponAmount}
                      onChange={(e) => setNewCouponAmount(Number(e.target.value))}
                      className="bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5"
                    />
                    <button
                      type="button"
                      onClick={handleAddCoupon}
                      className="bg-stone-950 text-white rounded-xl text-xs font-bold uppercase px-3 py-2.5 hover:bg-black transition-colors cursor-pointer"
                    >
                      Create Code
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {(formSettings.coupons || []).map((cpn) => (
                      <div
                        key={cpn.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                            {cpn.code}
                          </span>
                          <span className="text-xs text-stone-600 font-semibold">
                            {cpn.discountType === 'percentage' ? `${cpn.discountAmount}% OFF` : `৳${cpn.discountAmount} FLAT OFF`}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            (Min: ৳{cpn.minOrderAmount})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(cpn.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 9. TRACKING (Exact match to Sazo screenshot 2)           */}
            {/* ======================================================== */}
            {activeSubTab === 'tracking' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2.5 bg-stone-100 rounded-xl text-stone-900 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      SERVER-SIDE TRACKING
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      GA4 MEASUREMENT PROTOCOL
                    </p>
                  </div>
                </div>

                {/* Guide Box (HOW TO GET THESE?) */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-2">
                  <span className="text-xs font-black tracking-wider uppercase text-stone-900 block font-sans">
                    HOW TO GET THESE?
                  </span>
                  <div className="space-y-1.5 text-xs text-stone-600 font-medium">
                    <p className="flex items-start space-x-2">
                      <span className="text-stone-400 font-bold">•</span>
                      <span><strong>Measurement ID:</strong> Admin &gt; Data Streams &gt; Select Stream &gt; Measurement ID (G-XXXXXXXX)</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <span className="text-stone-400 font-bold">•</span>
                      <span><strong>API Secret:</strong> Admin &gt; Data Streams &gt; Select Stream &gt; Measurement Protocol API secrets (Create new)</span>
                    </p>
                  </div>
                </div>

                {/* Sub-Section 1: GOOGLE ANALYTICS 4 */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#993333] font-sans">
                      GOOGLE ANALYTICS 4
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                        GA4 MEASUREMENT ID
                      </label>
                      <input
                        type="text"
                        value={formSettings.ga4MeasurementId || formSettings.ga4Id || ''}
                        onChange={(e) => {
                          updateSetting('ga4MeasurementId', e.target.value);
                          updateSetting('ga4Id', e.target.value);
                        }}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 font-mono outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                        GA4 API SECRET
                      </label>
                      <input
                        type="text"
                        value={formSettings.ga4ApiSecret || ''}
                        onChange={(e) => updateSetting('ga4ApiSecret', e.target.value)}
                        placeholder="API Secret Key"
                        className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 font-mono outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-Section 2: META (FACEBOOK) CAPI */}
                <div className="space-y-3 pt-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#993333] font-sans">
                      META (FACEBOOK) CAPI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                        PIXEL ID
                      </label>
                      <input
                        type="text"
                        value={formSettings.metaPixelId || ''}
                        onChange={(e) => {
                          updateSetting('metaPixelId', e.target.value);
                          updateSetting('metaDatasetId', e.target.value);
                        }}
                        placeholder="3708855832582899"
                        className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 font-mono outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                        CAPI ACCESS TOKEN
                      </label>
                      <input
                        type="text"
                        value={formSettings.metaCapiToken || ''}
                        onChange={(e) => updateSetting('metaCapiToken', e.target.value)}
                        placeholder="EACEzcEnL6ugBSFCrCcKXa8xf7caBmt7Eve7f54l..."
                        className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 font-mono outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Meta Test Event Code */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                      META TEST EVENT CODE
                    </label>
                    <input
                      type="text"
                      value={formSettings.metaTestEventCode || ''}
                      onChange={(e) => updateSetting('metaTestEventCode', e.target.value)}
                      placeholder="TEST76382"
                      className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 font-mono outline-none transition-all"
                    />
                    <p className="text-[11px] text-stone-500 font-medium">
                      Only for testing. Remove this code when you're done testing to avoid issues.
                    </p>
                  </div>
                </div>

                {/* Sub-Section 3: GOOGLE TAG MANAGER */}
                <div className="space-y-3 pt-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#993333] font-sans">
                      GOOGLE TAG MANAGER
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                      GTM ID
                    </label>
                    <input
                      type="text"
                      value={formSettings.gtmId || ''}
                      onChange={(e) => updateSetting('gtmId', e.target.value)}
                      placeholder="GTM-WZ278GBR"
                      className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 font-mono outline-none transition-all"
                    />
                  </div>
                </div>

                {/* TikTok & Domain Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                      TikTok Pixel ID
                    </label>
                    <input
                      type="text"
                      value={formSettings.tiktokPixelId || ''}
                      onChange={(e) => updateSetting('tiktokPixelId', e.target.value)}
                      placeholder="C789201LAK92"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 block">
                      Domain Verification Meta Content
                    </label>
                    <input
                      type="text"
                      value={formSettings.domainVerificationMeta || ''}
                      onChange={(e) => updateSetting('domainVerificationMeta', e.target.value)}
                      placeholder="f4829k1ls829472kals"
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5 outline-none"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* 10. FOOTER & BRAND CHANNELS                              */}
            {/* ======================================================== */}
            {activeSubTab === 'footer' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start space-x-3 pb-4 border-b border-stone-100">
                  <div className="p-2 bg-stone-100 rounded-xl text-stone-800 shrink-0">
                    <Columns className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-[0.14em] text-stone-950 uppercase">
                      FOOTER & BRAND IDENTITY
                    </h2>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                      FOOTER CONTENT, SOCIAL CHANNELS, CONTACT & LEGAL NOTICES
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Footer Brand Bio & Mission
                    </label>
                    <textarea
                      rows={3}
                      value={formSettings.footerBio}
                      onChange={(e) => updateSetting('footerBio', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                        Facebook Page URL
                      </label>
                      <input
                        type="text"
                        value={formSettings.facebookUrl}
                        onChange={(e) => updateSetting('facebookUrl', e.target.value)}
                        placeholder="https://facebook.com/jutufootwear"
                        className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                        Instagram Profile URL
                      </label>
                      <input
                        type="text"
                        value={formSettings.instagramUrl}
                        onChange={(e) => updateSetting('instagramUrl', e.target.value)}
                        placeholder="https://instagram.com/jutufootwear"
                        className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                        TikTok Channel URL
                      </label>
                      <input
                        type="text"
                        value={formSettings.tiktokUrl}
                        onChange={(e) => updateSetting('tiktokUrl', e.target.value)}
                        placeholder="https://tiktok.com/@jutufootwear"
                        className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                        WhatsApp Hotline Link
                      </label>
                      <input
                        type="text"
                        value={formSettings.whatsappNumber}
                        onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
                        placeholder="+880 1900-000000"
                        className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Copyright & Trademark Notice
                    </label>
                    <input
                      type="text"
                      value={formSettings.copyrightText}
                      onChange={(e) => updateSetting('copyrightText', e.target.value)}
                      placeholder="© 2026 JUTU Inc. All Rights Reserved."
                      className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5"
                    />
                  </div>

                  {/* Floating WhatsApp Chat Widget Controls */}
                  <div className="bg-stone-100/90 border border-stone-300/80 rounded-2xl p-4 sm:p-5 mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.31z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wide">
                            Floating WhatsApp Widget
                          </h3>
                          <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                            Website Corner Live WhatsApp Chat Button & Direct Redirection
                          </p>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer select-none self-start sm:self-auto">
                        <input
                          type="checkbox"
                          checked={formSettings.enableWhatsAppFloating !== false}
                          onChange={(e) => updateSetting('enableWhatsAppFloating', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        <span className="ml-2.5 text-xs font-bold uppercase tracking-wider text-stone-800">
                          {formSettings.enableWhatsAppFloating !== false ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                          WhatsApp Phone Number
                        </label>
                        <input
                          type="text"
                          value={formSettings.whatsappFloatingNumber || formSettings.whatsappNumber || ''}
                          onChange={(e) => {
                            updateSetting('whatsappFloatingNumber', e.target.value);
                            updateSetting('whatsappNumber', e.target.value);
                          }}
                          placeholder="+880 1900-000000 / 017XXXXXXXX"
                          className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-mono rounded-xl p-2.5 outline-none focus:border-stone-800"
                        />
                        <span className="text-[10px] text-stone-500 mt-1 block">
                          Clicking will directly open WhatsApp chat with this number.
                        </span>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                          Widget Prompt / Label
                        </label>
                        <input
                          type="text"
                          value={formSettings.whatsappButtonLabel || ''}
                          onChange={(e) => updateSetting('whatsappButtonLabel', e.target.value)}
                          placeholder="Chat with us"
                          className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 outline-none focus:border-stone-800"
                        />
                        <span className="text-[10px] text-stone-500 mt-1 block">
                          Notification badge label displayed on desktop.
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                        Default Greeting Message
                      </label>
                      <textarea
                        rows={2}
                        value={formSettings.whatsappDefaultMessage || ''}
                        onChange={(e) => updateSetting('whatsappDefaultMessage', e.target.value)}
                        placeholder="Hello JUTU Footwear, I would like to know more about your products."
                        className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 outline-none focus:border-stone-800"
                      />
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        Pre-filled message automatically typed when customer clicks the WhatsApp button.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* FLOATING PUSH / SAVE ACTION DOCK (Exact match to bottom-right button in screenshot) */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end space-y-2">
        {saveError && (
          <div className="bg-rose-900 text-white border border-rose-700 shadow-xl px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn max-w-sm">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handlePushChanges}
          disabled={isSaving}
          className="group bg-stone-950 hover:bg-black disabled:opacity-70 text-white px-5 sm:px-6 py-3.5 rounded-2xl shadow-2xl border border-stone-800 transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-3.5"
          title="Save and Push all Core Configurations live to database"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
            {isSaving ? (
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            ) : isSaved ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Save className="w-4 h-4 text-stone-200" />
            )}
          </div>

          <div className="text-left">
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-bold text-stone-400 block leading-none flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                isSaving 
                  ? 'bg-amber-400 animate-ping' 
                  : isSaved 
                  ? 'bg-emerald-400' 
                  : hasUnsavedChanges 
                  ? 'bg-amber-400 animate-pulse' 
                  : 'bg-stone-500'
              }`}></span>
              <span>
                {isSaving ? 'SAVING DB...' : isSaved ? 'COMMITTED' : hasUnsavedChanges ? 'UNSAVED' : 'READY'}
              </span>
            </span>
            <span className="font-sans font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-white block mt-0.5">
              {isSaving ? 'SYNCING' : 'PUSH'}
            </span>
          </div>
        </button>
      </div>

    </div>
  );
};
