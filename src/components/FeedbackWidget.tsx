"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

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

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <>
      {/* Sticky Button - Sağ taraf */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-6 rounded-l-2xl shadow-2xl hover:shadow-blue-500/50 transition-all">
          <div className="flex flex-col items-center gap-2">
            <MessageCircle className="h-6 w-6 animate-pulse" />
            <div className="writing-mode-vertical text-sm font-bold tracking-wider" style={{ writingMode: 'vertical-rl' }}>
              ارتباط
            </div>
          </div>
        </div>
      </motion.button>

      {/* Slide Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
              dir="rtl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">ارتباط</h2>
                      <p className="text-blue-100 text-sm">نظر خود را با ما به اشتراک بگذارید</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 leading-relaxed">
                      سوالات، پیشنهادات یا مشکلات خود را با ما در میان بگذارید. ما همیشه مشتاق شنیدن نظرات شما هستیم!
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      نام شما (اختیاری)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      پیام شما *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="پیام، نظر یا پیشنهاد خود را بنویسید..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {message.length} کاراکتر
                    </div>
                  </div>

                  {/* Quick Contact - Two Numbers */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4">
                    <div className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      تماس تلفنی
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">همکار ریگان</div>
                        <button
                          onClick={() => handleCall('+4915210585633')}
                          className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                          dir="ltr"
                        >
                          <Phone className="h-4 w-4" />
                          <span>+49 152 105 85633</span>
                        </button>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">نظریات</div>
                        <button
                          onClick={() => handleCall('+93782416263')}
                          className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                          dir="ltr"
                        >
                          <Phone className="h-4 w-4" />
                          <span>+93 782 416 263</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Send Buttons - Two WhatsApp Options */}
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-gray-700 mb-2">ارسال از طریق WhatsApp:</div>
                    
                    {/* همکار ریگان */}
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        همکار ریگان
                      </div>
                      <button
                        onClick={() => handleSendWhatsApp('+4915210585633')}
                        disabled={!message.trim() || sending}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        dir="ltr"
                      >
                        {sending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>در حال ارسال...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>+49 152 105 85633</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* نظریات */}
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        نظریات
                      </div>
                      <button
                        onClick={() => handleSendWhatsApp('+93782416263')}
                        disabled={!message.trim() || sending}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        dir="ltr"
                      >
                        {sending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>در حال ارسال...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>+93 782 416 263</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Privacy Note */}
                  <p className="text-center text-xs text-gray-500">
                    با ارسال این پیام، شما به WhatsApp هدایت می‌شوید
                  </p>
                </div>
              </div>

              {/* Footer Info */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="text-center text-xs text-gray-600">
                  <p>پاسخگویی: ۲۴/۷</p>
                  <p className="mt-1">زمان پاسخ: کمتر از ۲ ساعت</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

