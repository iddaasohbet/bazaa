"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Headphones, Clock, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'call'>('message');

  const handleSendWhatsApp = (phoneNumber: string) => {
    if (!message.trim()) {
      alert('لطفاً پیام خود را بنویسید');
      return;
    }

    setSending(true);

    const text = `پیام از سایت بازار وطن:\n\nنام: ${name || 'ناشناس'}\nپیام: ${message}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setMessage("");
      setName("");
      setSending(false);
      setIsOpen(false);
      alert('✅ از تماس شما متشکریم!');
    }, 1000);
  };

  return (
    <>
      {/* Modern Floating Button - Kurumsal */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Main Button */}
          <div className="bg-gray-900 text-white pl-4 pr-3 py-4 rounded-l-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl">
            <div className="flex items-center gap-3">
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Headphones className="h-5 w-5" />
              </div>
              {/* Text */}
              <div className="text-right">
                <div className="text-[10px] text-gray-400 leading-none mb-0.5">پشتیبانی</div>
                <div className="text-sm font-bold leading-none">آنلاین</div>
              </div>
              {/* Arrow */}
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </div>
          {/* Online Indicator */}
          <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </motion.button>
      </div>

      {/* Slide Panel - Kurumsal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
              dir="rtl"
            >
              {/* Header - Minimal */}
              <div className="bg-gray-900 text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">پشتیبانی</h2>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>آنلاین - پاسخ سریع</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('message')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'message' 
                      ? 'text-gray-900 border-b-2 border-gray-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  ارسال پیام
                </button>
                <button
                  onClick={() => setActiveTab('call')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'call' 
                      ? 'text-gray-900 border-b-2 border-gray-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  تماس مستقیم
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 overflow-y-auto">
                {activeTab === 'message' ? (
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        نام شما
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder="اختیاری"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        پیام شما
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                        placeholder="سوال، پیشنهاد یا مشکل خود را بنویسید..."
                      />
                    </div>

                    {/* Send Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleSendWhatsApp('+93782416263')}
                        disabled={!message.trim() || sending}
                        className="w-full px-5 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>در حال ارسال...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>ارسال به پشتیبانی</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleSendWhatsApp('+4915210585633')}
                        disabled={!message.trim() || sending}
                        className="w-full px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>ارسال به همکار ریگان</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Call Options */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm">شماره‌های تماس</h4>
                      <div className="space-y-3">
                        <a
                          href="tel:+93782416263"
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">پشتیبانی اصلی</div>
                              <div className="font-medium text-gray-900" dir="ltr">+93 782 416 263</div>
                            </div>
                          </div>
                          <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </a>

                        <a
                          href="tel:+4915210585633"
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">همکار ریگان</div>
                              <div className="font-medium text-gray-900" dir="ltr">+49 152 105 85633</div>
                            </div>
                          </div>
                          <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </a>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        ساعات کاری
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">شنبه - پنجشنبه</span>
                          <span className="text-gray-900 font-medium">۹:۰۰ - ۱۸:۰۰</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">جمعه</span>
                          <span className="text-gray-900 font-medium">۱۰:۰۰ - ۱۴:۰۰</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>پاسخ سریع</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span>پشتیبانی ۲۴/۷</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

