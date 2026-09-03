import React, { useEffect } from 'react';
import { ShieldCheck, RefreshCw, FileText, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { PageView } from '../types';

interface LegalPoliciesPageProps {
  onNavigate: (view: PageView, section?: 'refund' | 'privacy' | 'terms') => void;
  targetSection?: 'refund' | 'privacy' | 'terms';
}

export const LegalPoliciesPage: React.FC<LegalPoliciesPageProps> = ({
  onNavigate,
  targetSection = 'refund',
}) => {
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      refund: 'refund-policy',
      privacy: 'privacy-policy',
      terms: 'terms-of-service',
    };

    const targetId = sectionMap[targetSection] || 'refund-policy';
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [targetSection]);

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 sm:py-12 animate-fadeIn">
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-5xl mx-auto">
        
        {/* Back navigation & breadcrumb */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <span className="cursor-pointer hover:underline" onClick={() => onNavigate('home')}>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-stone-800">Legal & Policies</span>
          </div>
        </div>

        {/* 3 Sections in 1 Page */}
        <div className="space-y-8 sm:space-y-10">

          {/* SECTION 1: Refund Policy */}
          <section
            id="refund-policy"
            className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs scroll-mt-24"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">
                  SECTION 01
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  Refund & Exchange Policy
                </h2>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-600 leading-relaxed space-y-4">
              <p>
                At our store, your comfort and satisfaction are our primary focus. We want you to feel confident with every purchase.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="bg-[#f7f5f0] border border-stone-200/80 rounded-2xl p-4">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider block mb-1">
                    7 Days Exchange
                  </span>
                  <p className="text-xs text-stone-600">
                    Hassle-free size exchange within 7 days of receiving your parcel.
                  </p>
                </div>
                <div className="bg-[#f7f5f0] border border-stone-200/80 rounded-2xl p-4">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider block mb-1">
                    Unworn Condition
                  </span>
                  <p className="text-xs text-stone-600">
                    Shoes must be in original condition with intact box and tags.
                  </p>
                </div>
                <div className="bg-[#f7f5f0] border border-stone-200/80 rounded-2xl p-4">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider block mb-1">
                    Quick Processing
                  </span>
                  <p className="text-xs text-stone-600">
                    Refunds or replacement shoes dispatched within 24–48 hours of inspection.
                  </p>
                </div>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                1. Eligibility for Refunds & Returns
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Items must be unworn, undamaged, and returned in the original footwear box with all tags attached.</li>
                <li>Size mismatches can be exchanged seamlessly without any additional product fees (only standard courier delivery fee applies).</li>
                <li>In case of a manufacturing defect or wrong product delivery, we cover 100% of return shipping costs and provide an immediate replacement or full refund.</li>
              </ul>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                2. Refund Method & Timelines
              </h3>
              <p>
                Refunds are issued directly via the original payment method (bKash, Nagad, Rocket, or Bank Transfer) within 3–5 working days once the returned package is received and verified at our quality center.
              </p>
            </div>
          </section>

          {/* SECTION 2: Privacy Policy */}
          <section
            id="privacy-policy"
            className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs scroll-mt-24"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">
                  SECTION 02
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  Privacy Policy
                </h2>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-600 leading-relaxed space-y-4">
              <p>
                We respect your personal privacy. This Privacy Policy details how we collect, handle, and protect your information when using our website and placing orders.
              </p>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                1. Information We Collect
              </h3>
              <p>
                When you place an order or interact with our site, we collect essential details such as your name, phone number, shipping address, and optional email for order status alerts and delivery notifications.
              </p>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                2. How We Use Your Data
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Processing and fulfilling your orders accurately.</li>
                <li>Real-time SMS updates and courier delivery tracking.</li>
                <li>Customer support via phone and WhatsApp regarding size inquiries or exchanges.</li>
                <li>Improving store performance and catalog assortment. We never sell or lease your personal data to third parties.</li>
              </ul>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                3. Data Security & Payment Protection
              </h3>
              <p>
                All digital transactions are encrypted via SSL protocols. We do not store sensitive credit card PINs or mobile banking MPINs on our servers.
              </p>
            </div>
          </section>

          {/* SECTION 3: Terms of Service */}
          <section
            id="terms-of-service"
            className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs scroll-mt-24"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">
                  SECTION 03
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  Terms of Service
                </h2>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-600 leading-relaxed space-y-4">
              <p>
                By visiting our store and making a purchase, you agree to adhere to the standard terms and conditions detailed below.
              </p>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                1. Orders & Pricing
              </h3>
              <p>
                All prices listed on the store are in Bangladeshi Taka (৳ BDT) and inclusive of applicable VAT. We reserve the right to modify prices or discontinue items without prior notice.
              </p>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                2. Shipping & Delivery Terms
              </h3>
              <p>
                Orders are processed and handed over to courier partners within 24 hours. Standard delivery timeline is 24–48 hours inside Dhaka and 48–72 hours across other regions of Bangladesh. Cash on Delivery (COD) recipients are requested to verify package exterior seal upon receipt.
              </p>

              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 pt-2">
                3. Customer Support & Inquiries
              </h3>
              <p>
                For any questions regarding sizing, material durability, or order adjustments, our customer support team is reachable through WhatsApp or direct call during business hours.
              </p>
            </div>
          </section>

        </div>

        {/* Bottom Help & Contact Bar */}
        <div className="mt-8 sm:mt-10 bg-[#dfd9ce] border border-stone-300/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-stone-900">
            <HelpCircle className="w-5 h-5 text-stone-700 shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Have questions about our policies?
              </h4>
              <p className="text-xs text-stone-600">
                Our support team is available on WhatsApp to assist with sizes, exchanges, or order tracking.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('shop-all')}
            className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 active:scale-98 text-white px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalPoliciesPage;
