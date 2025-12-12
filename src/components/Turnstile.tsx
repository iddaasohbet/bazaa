"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback: () => void;
  }
}

export default function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "light",
  size = "normal",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Turnstile script'i yükle
    const loadScript = () => {
      if (document.getElementById("turnstile-script")) {
        if (window.turnstile) {
          setIsLoaded(true);
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
      script.async = true;
      script.defer = true;

      window.onloadTurnstileCallback = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      // Cleanup widget
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) return;

    // Önceki widget'ı temizle
    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    // Yeni widget render et
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      "error-callback": onError,
      "expired-callback": onExpire,
      theme,
      size,
    });
  }, [isLoaded, siteKey, onVerify, onError, onExpire, theme, size]);

  return (
    <div ref={containerRef} className="flex justify-center my-4">
      {!isLoaded && (
        <div className="h-[65px] w-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">در حال بارگذاری...</span>
        </div>
      )}
    </div>
  );
}





