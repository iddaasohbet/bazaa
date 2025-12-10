"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

function GirisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [headerLogo, setHeaderLogo] = useState<string>("");

  // Logo yükle
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/api/admin/logo');
        const data = await response.json();
        if (data.success && data.data.header_logo) {
          setHeaderLogo(data.data.header_logo);
        }
      } catch (error) {
        console.error('Logo yüklenemedi:', error);
      }
    };
    loadLogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // reCAPTCHA kontrolü (production'da zorunlu)
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && !captchaToken) {
      alert('لطفا تأیید کنید که ربات نیستید');
      return;
    }
    
    setLoading(true);
    
    try {
      // Backend API'ye giriş isteği gönder
      const response = await fetch('/api/auth/giris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          sifre: password,
          captchaToken: captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'ایمیل یا رمز عبور اشتباه است');
        // reCAPTCHA'yı sıfırla
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        setLoading(false);
        return;
      }

      // Başarılı giriş - kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        ad: data.user.ad,
        rol: data.user.rol,
      }));
      
      // Token'ı da kaydet
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Event gönder (header'ı güncelle)
      window.dispatchEvent(new Event('userLogin'));
      
      // Yönlendir
      router.push(redirect);
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('خطا در ورود. لطفا دوباره تلاش کنید');
      // reCAPTCHA'yı sıfırla
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setLoading(false);
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" dir="rtl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6] animate-gradient-shift"></div>
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back to Home Button - Top Left */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">بازگشت به صفحه اصلی</span>
      </Link>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border-2 border-white/30 p-8 md:p-10 shadow-2xl">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            {headerLogo ? (
              <img src={headerLogo} alt="Logo" className="h-16 w-auto object-contain" />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">BV</span>
              </div>
            )}
          </div>

          {/* Site Name */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            بازار وطن
          </h2>

          {/* Title */}
          <h1 className="text-lg text-white/90 text-center mb-8 leading-relaxed">
            خوش آمدید به بزرگترین پلتفرم خرید و فروش آنلاین در افغانستان
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input - %50 şeffaf */}
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="ایمیل یا شماره تلفن"
                required
              />
            </div>

            {/* Password Input - %50 şeffaf */}
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-12 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="رمز عبور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors z-10"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/sifremi-unuttum" className="text-sm text-white/90 hover:text-white transition-colors font-medium">
                رمز عبور را فراموش کرده اید؟
              </Link>
            </div>

            {/* reCAPTCHA - Sadece key varsa göster */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={onCaptchaChange}
                  theme="light"
                  hl="fa"
                />
              </div>
            )}

            {/* Submit Button - Gradient */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-6 py-3.5 text-white font-bold text-base rounded-2xl">
                {loading ? 'در حال ورود...' : 'ورود'}
              </div>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => alert('Google گیری قابلیت به زودی اضافه خواهد شد')}
              className="relative w-full bg-white hover:bg-gray-50 text-gray-800 px-6 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border-2 border-white/50 hover:border-white group overflow-hidden shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>ادامه با Google</span>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-100 text-sm">حساب کاربری ندارید؟ </span>
            <Link href="/kayit" className="text-white font-bold hover:underline text-sm">
              ثبت نام کنید
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default function GirisYap() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <GirisContent />
    </Suspense>
  );
}
