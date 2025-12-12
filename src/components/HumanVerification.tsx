"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle, Sparkles } from "lucide-react";

export default function HumanVerification({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Site key - test key kullanıyoruz (her zaman geçer)
  const siteKey = "1x00000000000000000000AA"; // Cloudflare test key - always passes

  useEffect(() => {
    // Daha önce doğrulanmış mı kontrol et (24 saat geçerli)
    const verifiedAt = localStorage.getItem("humanVerified");
    if (verifiedAt) {
      const verifiedTime = parseInt(verifiedAt);
      const now = Date.now();
      const hoursPassed = (now - verifiedTime) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        setIsVerified(true);
        setIsLoading(false);
        return;
      } else {
        localStorage.removeItem("humanVerified");
      }
    }

    setIsVerified(false);
    setIsLoading(false);

    // Turnstile script'i yükle
    if (!document.getElementById("turnstile-script")) {
      const script = document.createElement("script");
      script.id = "turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
      script.async = true;

      (window as any).onloadTurnstileCallback = () => {
        setTurnstileLoaded(true);
      };

      document.head.appendChild(script);
    } else if ((window as any).turnstile) {
      setTurnstileLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!turnstileLoaded || isVerified !== false) return;

    const container = document.getElementById("turnstile-container");
    if (!container || !(window as any).turnstile) return;

    // Turnstile widget'ı render et
    (window as any).turnstile.render(container, {
      sitekey: siteKey,
      callback: async (token: string) => {
        console.log("Turnstile doğrulandı:", token);
        localStorage.setItem("humanVerified", Date.now().toString());
        
        // Fade out animasyonu başlat
        setFadeOut(true);
        
        // Animasyon bitince verified yap
        setTimeout(() => {
          setIsVerified(true);
        }, 500);
      },
      "error-callback": () => {
        console.log("Turnstile hatası oluştu, yine de geçiliyor...");
        localStorage.setItem("humanVerified", Date.now().toString());
        setFadeOut(true);
        setTimeout(() => {
          setIsVerified(true);
        }, 500);
      },
      theme: "light",
      size: "normal",
    });
  }, [turnstileLoaded, isVerified, siteKey]);

  // Doğrulanmış - siteyi göster
  if (isVerified) {
    return <>{children}</>;
  }

  // Arka planda sayfayı render et, üstüne overlay koy
  return (
    <div className="relative">
      {/* Arka planda sayfa yüklensin */}
      <div className={`${isLoading || !isVerified ? 'opacity-0 pointer-events-none' : ''}`}>
        {children}
      </div>

      {/* Verification Overlay */}
      <div 
        className={`fixed inset-0 z-[9999] backdrop-blur-xl bg-white/80 flex items-center justify-center transition-all duration-500 ${
          fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        dir="rtl"
      >
        <div className={`relative transition-all duration-500 ${
          isLoading ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          {isLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          ) : (
            /* Verification Card */
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/60 p-8 md:p-10 max-w-md w-[90vw] md:w-full text-center">
              {/* Animated Shield Icon */}
              <div className="relative mx-auto mb-6 w-24 h-24 group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Icon Container */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500">
                  <Shield className="w-12 h-12 text-white stroke-[1.5] animate-pulse" />
                  
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-500 rounded-full"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                بررسی امنیتی
              </h1>
              
              {/* Subtitle */}
              <p className="text-sm md:text-base text-gray-600 mb-8 font-medium">
                لطفا تأیید کنید که ربات نیستید
              </p>

              {/* Turnstile Container */}
              <div className="mb-6 flex justify-center">
                <div id="turnstile-container" className="transform scale-100 hover:scale-105 transition-transform duration-300">
                  {!turnstileLoaded && (
                    <div className="h-[65px] w-[300px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-xl animate-pulse flex items-center justify-center border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-full text-green-700 text-xs md:text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>این بررسی فقط یک بار انجام می‌شود</span>
              </div>

              {/* Bottom Decoration */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-1 opacity-30">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}

