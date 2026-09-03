import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { loginAdmin, getStoreSettings } from '../data/adminStore';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onExitToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onExitToStore,
}) => {
  const storeSettings = getStoreSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(email, password, rememberMe);
      if (result.success) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex flex-col justify-between items-center p-4 sm:p-6 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* Top Header Link */}
      <div className="w-full max-w-md flex justify-start items-center pt-2">
        <button
          type="button"
          onClick={onExitToStore}
          className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            {storeSettings.headerLogoUrl && !logoError ? (
              <div className="flex justify-center mb-3">
                <img
                  src={storeSettings.headerLogoUrl}
                  alt={storeSettings.storeName || 'JUTU'}
                  onError={() => setLogoError(true)}
                  className="h-12 max-w-[180px] object-contain"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-black tracking-[0.2em] text-stone-950 uppercase font-sans mb-2">
                {storeSettings.storeName || 'JUTU'}
              </h1>
            )}

            <div className="inline-flex items-center space-x-1.5 bg-stone-100 px-3 py-1 rounded-full text-stone-800">
              <Lock className="w-3.5 h-3.5 text-stone-700" />
              <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase">
                ADMIN ACCESS CONTROL
              </span>
            </div>

            <p className="text-xs text-stone-500 font-medium">
              Please enter your authorized credentials to access logistics and store management.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-start space-x-2.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Access Denied</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Primary Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                Admin Primary Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                  Secure Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-stone-50 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-950 text-xs sm:text-sm rounded-xl p-3 pr-10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-xs accent-stone-900 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-stone-600">Keep session active</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-950 hover:bg-black text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-stone-950/20 active:scale-[0.99] cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-1 pb-4">
        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
          © 2026 {storeSettings.storeName || 'JUTU'} • All Rights Reserved
        </p>
      </div>

    </div>
  );
};

export default AdminLoginPage;
