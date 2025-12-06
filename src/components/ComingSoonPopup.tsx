"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, Sparkles, Clock, CheckCircle } from "lucide-react";

export default function ComingSoonPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // localStorage'da popup gösterildi mi kontrol et
    const popupShown = localStorage.getItem("comingSoonPopupShown");
    const lastShown = localStorage.getItem("comingSoonPopupLastShown");
    const now = Date.now();
    
    // 24 saat geçmişse tekrar göster
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (!popupShown || (lastShown && now - parseInt(lastShown) > twentyFourHours)) {
      // 1.5 saniye sonra popup'ı göster
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("comingSoonPopupShown", "true");
    localStorage.setItem("comingSoonPopupLastShown", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto relative">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 opacity-10" />
              
              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 w-3 h-3 bg-orange-400 rounded-full opacity-60"
                />
                <motion.div
                  animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full opacity-60"
                />
                <motion.div
                  animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 right-20 w-4 h-4 bg-yellow-400 rounded-full opacity-40"
                />
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Content */}
              <div className="relative p-8 text-center" dir="rtl">
                {/* Icon Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="mb-6"
                >
                  <div className="relative inline-block">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-20 h-20 rounded-full border-4 border-dashed border-orange-200"
                    />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                      <Rocket className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="h-6 w-6 text-amber-500" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
                >
                  به زودی در خدمت شما! 🚀
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  ما با تمام توان در حال کار هستیم تا بهترین تجربه خرید و فروش آنلاین را برای شما فراهم کنیم.
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 mb-6"
                >
                  <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">پلتفرم امن و معتبر</span>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">خرید و فروش آسان</span>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">پشتیبانی ۲۴ ساعته</span>
                  </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      پیشرفت توسعه
                    </span>
                    <span className="font-bold text-orange-600">۸۵٪</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                  متوجه شدم، ادامه می‌دهم
                </motion.button>

                {/* Footer Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-xs text-gray-500"
                >
                  از صبر و شکیبایی شما سپاسگزاریم 🙏
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

