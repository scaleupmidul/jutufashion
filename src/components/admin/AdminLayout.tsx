import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ListOrdered, 
  MessageSquare, 
  CreditCard, 
  Layers, 
  Settings, 
  LogOut, 
  RefreshCw, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { AdminTab, PageView } from '../../types';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  activeOrdersCount: number;
  unreadMessagesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  activeOrdersCount,
  unreadMessagesCount,
  children,
}) => {
  const [syncTime, setSyncTime] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const updateSyncTimestamp = () => {
    const now = new Date();
    setSyncTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
  };

  useEffect(() => {
    updateSyncTimestamp();
    const interval = setInterval(updateSyncTimestamp, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    updateSyncTimestamp();
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'PRODUCTS', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'orders', label: 'ORDERS', icon: <ListOrdered className="w-4 h-4" />, badge: activeOrdersCount },
    { id: 'messages', label: 'MESSAGES', icon: <MessageSquare className="w-4 h-4" />, badge: unreadMessagesCount },
    { id: 'payment-info', label: 'PAYMENT INFO', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'pages-content', label: 'PAGES & CONTENT', icon: <Layers className="w-4 h-4" /> },
    { id: 'settings', label: 'SETTINGS', icon: <Settings className="w-4 h-4" /> },
  ];

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'ADMIN DASHBOARD';
      case 'products': return 'FOOTWEAR PRODUCTS';
      case 'orders': return 'LOGISTICS & ORDERS';
      case 'messages': return 'CUSTOMER INQUIRIES';
      case 'payment-info': return 'PAYMENT GATEWAYS';
      case 'pages-content': return 'BRANDED PAGES CMS';
      case 'settings': return 'STORE CONFIGURATION';
      default: return 'ADMIN DASHBOARD';
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f0ea] flex flex-col lg:flex-row text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#0d0d0d] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-stone-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-stone-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <span className="font-sans font-black tracking-[0.18em] text-white text-base block leading-none">
              JUTU ADMIN
            </span>
            <span className="text-[9px] tracking-[0.15em] text-stone-400 uppercase font-semibold">
              LOGISTICS MANAGEMENT
            </span>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="text-[11px] font-bold tracking-wider uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-stone-200"
        >
          <ExternalLink className="w-3 h-3" />
          <span>STORE</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 xl:w-72 bg-[#0c0c0c] text-white flex flex-col justify-between z-40 border-r border-stone-900 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand Block */}
        <div>
          <div className="p-6 border-b border-stone-900/90 hidden lg:block">
            <div className="flex items-baseline space-x-2">
              <span className="font-sans font-black text-xl tracking-[0.2em] text-white uppercase select-none">
                JUTU
              </span>
              <span className="font-sans font-bold text-xs tracking-[0.15em] text-stone-300 uppercase">
                ADMIN
              </span>
            </div>
            <span className="text-[9px] tracking-[0.22em] text-stone-400 uppercase font-bold block mt-1">
              LOGISTICS MANAGEMENT
            </span>
          </div>

          {/* Nav List */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] xl:text-xs font-bold tracking-[0.12em] uppercase transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-white' : 'text-stone-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-stone-950'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-900 space-y-1.5">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-[0.14em] uppercase text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-stone-400" />
            <span>VIEW STORE</span>
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                import('../../data/adminStore').then((mod) => {
                  mod.logoutAdmin();
                  onExitAdmin();
                });
              }
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-[11px] font-bold tracking-[0.14em] uppercase text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>LOG OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#faf8f5]">
        
        {/* Top Control Header */}
        <header className="px-4 sm:px-8 py-4.5 border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 uppercase font-sans">
                {getHeaderTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.18em] text-stone-500 uppercase">
                JUTU LOGISTICS & OPERATIONS HUB
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            {/* Sync Status */}
            <div className="flex items-center space-x-2 bg-stone-100/90 border border-stone-200 px-3 py-1.5 rounded-xl text-[11px] font-medium text-stone-700">
              <span className="text-stone-400 uppercase text-[9.5px] font-bold tracking-wider">SYNC</span>
              <span className="font-mono font-bold text-stone-900">{syncTime || 'LIVE'}</span>
              <button
                onClick={handleManualSync}
                className="p-0.5 text-stone-500 hover:text-stone-950 focus:outline-none cursor-pointer transition-colors"
                title="Refresh Store Data"
                aria-label="Refresh Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-stone-950' : ''}`} />
              </button>
            </div>

            {/* Quick Orders Button */}
            {currentTab !== 'orders' && (
              <button
                onClick={() => onSelectTab('orders')}
                className="bg-stone-950 hover:bg-stone-800 text-white text-[11px] font-bold tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center space-x-1.5"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>ORDERS</span>
                {activeOrdersCount > 0 && (
                  <span className="bg-white text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded-full ml-1">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Body View */}
        <div className="p-4 sm:p-7 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}
    </div>
  );
};
