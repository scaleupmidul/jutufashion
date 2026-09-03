import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { PageView } from '../types';
import { trackContact } from '../utils/metaTracker';
import { saveMessage } from '../data/adminStore';

interface ContactUsPageProps {
  onNavigate: (view: PageView) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;
    
    // Save to admin messages
    saveMessage({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    setIsSubmitted(true);
    trackContact(formData);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-16 sm:pb-24 animate-fadeIn">
      
      {/* Breadcrumb Bar */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto pt-6 sm:pt-8 pb-4">
        <div className="flex items-center justify-between">
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
            <span className="font-semibold text-stone-800">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Contact Content Grid */}
      <div className="w-[94%] sm:w-[90%] lg:w-[85%] max-w-6xl mx-auto mt-2 sm:mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Direct Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Showroom & Atelier */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block mb-1">
                    Showroom & Atelier
                  </span>
                  <h3 className="font-serif text-lg text-stone-900 font-normal">
                    Banani Experience Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    Road 27, Banani R/A, Dhaka 1213, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Lines */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block mb-1">
                    Phone & WhatsApp
                  </span>
                  <a
                    href="tel:+8801909000000"
                    className="font-serif text-lg text-stone-900 font-normal hover:underline block"
                  >
                    +880 1909 XXX XXX
                  </a>
                  <p className="text-xs text-stone-500 mt-1">
                    Instant support via WhatsApp for quick size recommendation
                  </p>
                </div>
              </div>
            </div>

            {/* Email Contact */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block mb-1">
                    Email Correspondence
                  </span>
                  <a
                    href="mailto:hello@JUTU.com"
                    className="font-serif text-lg text-stone-900 font-normal hover:underline block"
                  >
                    hello@JUTU.com
                  </a>
                  <p className="text-xs text-stone-500 mt-1">
                    Expect a response within 12 business hours
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#f3eee7] border border-stone-300/80 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start space-x-3 text-stone-800">
                <Clock className="w-4 h-4 mt-0.5 text-stone-600 shrink-0" />
                <div className="text-xs space-y-1">
                  <div className="font-bold uppercase tracking-wider text-stone-900">
                    Operating Hours
                  </div>
                  <div className="text-stone-600">
                    Saturday – Thursday: 10:00 AM – 8:00 PM
                  </div>
                  <div className="text-stone-500">
                    Friday: 2:00 PM – 8:00 PM
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs h-full flex flex-col justify-between">
              
              {isSubmitted ? (
                <div className="my-auto py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 font-normal">
                    Thank You for Reaching Out
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    We have received your message. A dedicated footwear specialist will contact you via phone or email shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
                      }}
                      className="text-xs font-bold uppercase tracking-wider text-stone-900 underline hover:text-stone-700 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block mb-1">
                      Direct Message
                    </span>
                    <h2 className="font-serif text-2xl text-stone-900 font-normal">
                      Leave a Message
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-900 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400/40 placeholder:font-normal focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-900 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400/40 placeholder:font-normal focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-900 mb-1.5">
                        Email Address <span className="text-stone-400 font-normal normal-case">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="tanvir@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400/40 placeholder:font-normal focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-900 mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Size Consultation">Size & Fit Consultation</option>
                        <option value="Order Tracking">Order Tracking</option>
                        <option value="Exchange & Return">Exchange & Return</option>
                        <option value="Corporate / Bulk Order">Corporate / Bulk Order</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-wider uppercase text-stone-900 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we assist you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400/40 placeholder:font-normal focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-0 transition-all font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-800 active:scale-99 text-white py-3.5 px-6 rounded-xl sm:rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}

              {/* Bottom Quick Help notice */}
              <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                  <span>Immediate assistance via WhatsApp</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('shop-all')}
                  className="font-semibold text-stone-900 hover:underline cursor-pointer"
                >
                  Browse Store
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactUsPage;
