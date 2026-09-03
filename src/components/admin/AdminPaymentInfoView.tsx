import React, { useState } from 'react';
import { 
  Check, 
  Banknote, 
  Truck, 
  Save, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PaymentGatewayConfig } from '../../types';
import { BkashIcon, NagadIcon } from '../PaymentLogos';

interface AdminPaymentInfoViewProps {
  paymentConfig: PaymentGatewayConfig;
  onSaveConfig: (config: PaymentGatewayConfig) => Promise<any> | void;
}

export const AdminPaymentInfoView: React.FC<AdminPaymentInfoViewProps> = ({
  paymentConfig,
  onSaveConfig,
}) => {
  const [config, setConfig] = useState<PaymentGatewayConfig>({
    ...paymentConfig,
    cod: {
      ...paymentConfig.cod,
      requireAdvance: paymentConfig.cod?.requireAdvance ?? false,
      advanceAmount: paymentConfig.cod?.advanceAmount ?? 150,
      bkashNumber: paymentConfig.cod?.bkashNumber || paymentConfig.bkash?.accountNumber || '01900000000',
      nagadNumber: paymentConfig.cod?.nagadNumber || paymentConfig.nagad?.accountNumber || '01885479477',
      maxLimit: paymentConfig.cod?.maxLimit ?? 15000,
      note: paymentConfig.cod?.note ?? 'Pay with cash upon delivery.',
    },
    freeDelivery: paymentConfig.freeDelivery || {
      enabled: true,
      text: 'Free delivery all over Bangladesh',
    },
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await onSaveConfig(config);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to commit payment settings to database');
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || 'Database error while saving payment settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 uppercase">
            Payment Gateways & Accounts
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Configure bKash, Nagad, Cash on Delivery (with optional advance payment), and Free Delivery rules for your store.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-stone-950 hover:bg-black disabled:opacity-75 text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-2 shadow-xs self-start sm:self-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>SAVING TO DB...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>SAVED TO DATABASE</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>SAVE CONFIGURATION</span>
            </>
          )}
        </button>
      </div>

      {saveError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Payment accounts and gateway instructions successfully synchronized with database!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. bKash Payment Gateway */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2136E]/10 flex items-center justify-center p-2 shadow-2xs border border-[#E2136E]/20">
                <BkashIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-950 uppercase">bKash Payment</h3>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Mobile Financial Service (MFS)</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.bkash.enabled}
                onChange={(e) => setConfig({ ...config, bkash: { ...config.bkash, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-950"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Account Type
                </label>
                <select
                  value={config.bkash.type}
                  onChange={(e) => setConfig({ ...config, bkash: { ...config.bkash, type: e.target.value as 'merchant' | 'personal' } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="merchant">Merchant (Make Payment)</option>
                  <option value="personal">Personal (Send Money)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  bKash Number *
                </label>
                <input
                  type="text"
                  value={config.bkash.accountNumber}
                  onChange={(e) => setConfig({ ...config, bkash: { ...config.bkash, accountNumber: e.target.value } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Checkout Instructions & Terms
              </label>
              <textarea
                value={config.bkash.instructions}
                onChange={(e) => setConfig({ ...config, bkash: { ...config.bkash, instructions: e.target.value } })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Nagad Payment Gateway */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F7941D]/10 to-[#ED1C24]/10 flex items-center justify-center p-2 shadow-2xs border border-[#F7941D]/20">
                <NagadIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-950 uppercase">Nagad Payment</h3>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Mobile Financial Service (MFS)</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.nagad.enabled}
                onChange={(e) => setConfig({ ...config, nagad: { ...config.nagad, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-950"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Account Type
                </label>
                <select
                  value={config.nagad.type}
                  onChange={(e) => setConfig({ ...config, nagad: { ...config.nagad, type: e.target.value as 'merchant' | 'personal' } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="merchant">Merchant (Merchant Pay)</option>
                  <option value="personal">Personal (Send Money)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Nagad Number *
                </label>
                <input
                  type="text"
                  value={config.nagad.accountNumber}
                  onChange={(e) => setConfig({ ...config, nagad: { ...config.nagad, accountNumber: e.target.value } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Checkout Instructions & Terms
              </label>
              <textarea
                value={config.nagad.instructions}
                onChange={(e) => setConfig({ ...config, nagad: { ...config.nagad, instructions: e.target.value } })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Cash On Delivery (COD) Rules */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-950 uppercase">Cash on Delivery (COD)</h3>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Advance or Zero Advance Options</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.cod.enabled}
                onChange={(e) => setConfig({ ...config, cod: { ...config.cod, enabled: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-950"></div>
            </label>
          </div>

          <div className="space-y-4">
            
            {/* Advance Requirement Mode Toggle Card (Website Theme: Clean Stone/Neutral) */}
            <div className="p-4 rounded-xl border bg-stone-50/80 border-stone-200 text-stone-900 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Require Advance Payment for COD
                    </span>
                    {config.cod.requireAdvance ? (
                      <span className="text-[9px] font-extrabold uppercase bg-stone-900 text-white px-2 py-0.5 rounded">
                        Advance Enabled
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold uppercase bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                        Zero Advance
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {config.cod.requireAdvance
                      ? 'Customers must pay delivery charge / advance via bKash or Nagad to confirm COD orders.'
                      : 'Zero advance needed — customers place orders and pay 100% cash upon delivery.'}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={config.cod.requireAdvance}
                    onChange={(e) => setConfig({
                      ...config,
                      cod: {
                        ...config.cod,
                        requireAdvance: e.target.checked,
                        advanceRequiredAmount: e.target.checked ? (config.cod.advanceAmount || 150) : 0,
                      },
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-950"></div>
                </label>
              </div>

              {/* Advance Amount & Phone Numbers Configuration (Shown when Require Advance is Enabled) */}
              {config.cod.requireAdvance && (
                <div className="mt-3.5 pt-3.5 border-t border-stone-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold tracking-wider uppercase text-stone-700 block mb-1">
                        Advance Amount (৳) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={config.cod.advanceAmount || 150}
                        onChange={(e) => setConfig({
                          ...config,
                          cod: {
                            ...config.cod,
                            advanceAmount: Number(e.target.value),
                            advanceRequiredAmount: Number(e.target.value),
                          },
                        })}
                        className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-wider uppercase text-stone-700 block mb-1 flex items-center space-x-1">
                        <BkashIcon className="w-3 h-3" />
                        <span>Advance bKash Number</span>
                      </label>
                      <input
                        type="text"
                        value={config.cod.bkashNumber || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          cod: {
                            ...config.cod,
                            bkashNumber: e.target.value,
                          },
                        })}
                        placeholder={config.bkash.accountNumber || '01900000000'}
                        className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-wider uppercase text-stone-700 block mb-1 flex items-center space-x-1">
                        <NagadIcon className="w-3 h-3" />
                        <span>Advance Nagad Number</span>
                      </label>
                      <input
                        type="text"
                        value={config.cod.nagadNumber || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          cod: {
                            ...config.cod,
                            nagadNumber: e.target.value,
                          },
                        })}
                        placeholder={config.nagad.accountNumber || '01885479477'}
                        className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-wider uppercase text-stone-700 block mb-1">
                      COD Advance Instruction (নির্দেশনা বার্তা)
                    </label>
                    <textarea
                      rows={3}
                      value={config.cod.instructions ?? 'অর্ডার কনফার্ম করতে অনুগ্রহ করে উপরের বিকাশ বা নগদ নম্বরে ডেলিভারি চার্জ {amount} টাকা Send Money / Payment করুন এবং নিচের ঘরে আপনার ফোন নম্বর ও TrxID দিন। বাকি টাকা ডেলিভারির সময় ক্যাশে পরিশোধ করবেন।'}
                      onChange={(e) => setConfig({
                        ...config,
                        cod: {
                          ...config.cod,
                          instructions: e.target.value,
                        },
                      })}
                      placeholder="অর্ডার কনফার্ম করতে অনুগ্রহ করে..."
                      className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-normal rounded-lg p-2.5 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 leading-relaxed"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      টিপ: ডেলিভারি চার্জের ডাইনামিক অ্যামাউন্টের জন্য <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-900 font-mono font-bold">{"{amount}"}</code> ব্যবহার করতে পারেন।
                    </p>
                  </div>

                  <p className="text-[10.5px] text-stone-600 bg-stone-100/80 p-2.5 rounded-lg border border-stone-200/80 leading-relaxed flex items-start space-x-1.5">
                    <Info className="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Checkout Notice:</strong> When enabled, checkout instructs the customer to send ৳{config.cod.advanceAmount || 150} to either the bKash or Nagad number and provide their TrxID.
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Max Order Limit (৳)
                </label>
                <input
                  type="number"
                  value={config.cod.maxLimit ?? 15000}
                  onChange={(e) => setConfig({ ...config, cod: { ...config.cod, maxLimit: Number(e.target.value) } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono font-bold rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  General COD Note
                </label>
                <input
                  type="text"
                  value={config.cod.note}
                  onChange={(e) => setConfig({ ...config, cod: { ...config.cod, note: e.target.value } })}
                  placeholder="Pay with cash upon delivery."
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 4. Free Delivery Rules */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-950 uppercase">Free Delivery</h3>
                <span className="text-[10px] text-stone-500 uppercase font-semibold">100% Free Delivery All Over Bangladesh</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.freeDelivery?.enabled ?? true}
                onChange={(e) => setConfig({
                  ...config,
                  freeDelivery: {
                    ...(config.freeDelivery || {
                      enabled: true,
                      text: 'Free delivery all over Bangladesh',
                    }),
                    enabled: e.target.checked,
                  },
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-950"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Notice Label (Minimal)
              </label>
              <input
                type="text"
                value={config.freeDelivery?.text ?? 'Free delivery all over Bangladesh'}
                onChange={(e) => setConfig({
                  ...config,
                  freeDelivery: {
                    ...(config.freeDelivery || {
                      enabled: true,
                      text: 'Free delivery all over Bangladesh',
                    }),
                    text: e.target.value,
                  },
                })}
                placeholder="Free delivery all over Bangladesh"
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-medium rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Delivery Charges Everywhere</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                When enabled, delivery is 100% FREE across all locations in Bangladesh without any condition or minimum cart amount. Delivery labels on the store simply show &ldquo;Free Delivery&rdquo; or &ldquo;Free&rdquo;.
              </p>
            </div>
          </div>
        </div>

      </div>

    </form>
  );
};
