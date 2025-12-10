"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle } from "lucide-react";

export default function HumanVerification({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

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
        // Token geldi = başarılı, direkt geç (API çağrısı yok)
        console.log("Turnstile doğrulandı:", token);
        localStorage.setItem("humanVerified", Date.now().toString());
        setIsVerified(true);
      },
      "error-callback": () => {
        // Hata olursa yine de geç (kullanıcı deneyimi için)
        console.log("Turnstile hatası oluştu, yine de geçiliyor...");
        localStorage.setItem("humanVerified", Date.now().toString());
        setIsVerified(true);
      },
      theme: "light",
      size: "normal",
    });
  }, [turnstileLoaded, isVerified, siteKey]);

  // Yükleniyor
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Doğrulanmış - siteyi göster
  if (isVerified) {
    return <>{children}</>;
  }

  // Doğrulama sayfası
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          بررسی امنیتی
        </h1>
        <p className="text-gray-500 mb-6">
          لطفا تأیید کنید که ربات نیستید
        </p>

        {/* Turnstile Container */}
        <div id="turnstile-container" className="flex justify-center mb-6">
          {!turnstileLoaded && (
            <div className="h-[65px] w-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-gray-400 text-sm">در حال بارگذاری...</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
          <CheckCircle className="w-4 h-4" />
          <span>این بررسی فقط یک بار انجام می‌شود</span>
        </div>
      </div>
    </div>
  );
}

