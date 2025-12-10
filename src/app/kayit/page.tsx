"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, Eye, EyeOff, MapPin, ArrowLeft, FileText, ChevronDown } from "lucide-react";
import { getCitiesList, getDistrictsList } from "@/lib/cities";

export default function KayitOl() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    telefon: "",
    sifre: "",
    sifreTekrar: "",
    il: "",
    ilce: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'phone'>('email');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [headerLogo, setHeaderLogo] = useState<string>("");

  const cities = getCitiesList();

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

  // Şifre gücü hesapla
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(formData.sifre);

  const handleCityChange = (cityId: string) => {
    setFormData({ ...formData, il: cityId, ilce: "" });
    setDistricts(getDistrictsList(cityId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert('لطفا قوانین و مقررات را بپذیرید');
      return;
    }
    
    if (formData.sifre !== formData.sifreTekrar) {
      alert('رمزهای عبور مطابقت ندارند!');
      return;
    }
    
    if (formData.sifre.length < 6) {
      alert('رمز عبور باید حداقل 6 کاراکتر باشد!');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/kayit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad: formData.ad,
          email: formData.email,
          telefon: formData.telefon,
          sifre: formData.sifre,
          il: formData.il,
          ilce: formData.ilce || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'خطا در ثبت نام');
        setLoading(false);
        return;
      }

      // Başarılı kayıt
      localStorage.setItem('user', JSON.stringify({
        id: data.data.id,
        email: data.data.email,
        ad: data.data.ad,
      }));
      
      window.dispatchEvent(new Event('userLogin'));
      alert(data.message || 'ثبت نام با موفقیت انجام شد');
      router.push('/');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('خطا در ثبت نام. لطفا دوباره تلاش کنید');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" dir="rtl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6] animate-gradient-shift"></div>
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group z-10"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">بازگشت به صفحه اصلی</span>
      </Link>

      {/* Register Card */}
      <div className="relative w-full max-w-md my-8">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border-2 border-white/30 p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
          
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
          <h1 className="text-xl font-semibold text-white/90 text-center mb-6">
            ایجاد حساب کاربری
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - %50 şeffaf */}
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type="text"
                value={formData.ad}
                onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                className="w-full pr-12 pl-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="Full Name"
                required
              />
            </div>

            {/* Verification Method Selection */}
            <div className="flex gap-2 p-1 bg-white/30 rounded-2xl">
              <button
                type="button"
                onClick={() => setVerifyMethod('email')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  verifyMethod === 'email' 
                    ? 'bg-white text-gray-800 shadow-md' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Mail className="w-4 h-4 inline-block ml-1" />
                ایمیل
              </button>
              <button
                type="button"
                onClick={() => setVerifyMethod('phone')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  verifyMethod === 'phone' 
                    ? 'bg-white text-gray-800 shadow-md' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Phone className="w-4 h-4 inline-block ml-1" />
                شماره تلفن
              </button>
            </div>

            {/* Phone Number - %50 şeffaf */}
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type="tel"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                className="w-full pr-12 pl-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="Phone Number"
                required={verifyMethod === 'phone'}
              />
            </div>

            {/* Email - %50 şeffaf */}
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pr-12 pl-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="Email Address"
                required={verifyMethod === 'email'}
              />
            </div>

            {/* Password - %50 şeffaf */}
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.sifre}
                onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                className="w-full pr-12 pl-12 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="Password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors z-10"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password - %50 şeffaf */}
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.sifreTekrar}
                onChange={(e) => setFormData({ ...formData, sifreTekrar: e.target.value })}
                className="w-full pr-12 pl-12 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all placeholder:text-gray-500 text-gray-800"
                placeholder="Confirm Password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors z-10"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Bar - Segmented */}
            {formData.sifre && (
              <div className="flex gap-1.5">
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  passwordStrength >= 20 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-white/30'
                }`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  passwordStrength >= 40 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-white/30'
                }`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  passwordStrength >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-white/30'
                }`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  passwordStrength >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-white/30'
                }`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  passwordStrength >= 95 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-white/30'
                }`}></div>
              </div>
            )}

            {/* Select Country - %50 şeffaf */}
            <div className="relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
              <select
                value={formData.il}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full pr-12 pl-10 py-3.5 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:border-white focus:bg-white/70 transition-all text-gray-700 appearance-none cursor-pointer"
                required
              >
                <option value="">Select Country</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>

            {/* Terms & Conditions Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group p-3 bg-white/30 rounded-2xl border border-white/20">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-white/50 bg-white/30 checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 cursor-pointer transition-all appearance-none"
                  required
                />
                {acceptTerms && (
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <FileText className="w-4 h-4" />
                <span>
                  <Link href="/kullanim-kosullari" className="underline hover:text-white/80">قوانین و مقررات</Link>
                  {' '}را می‌پذیرم
                </span>
              </div>
            </label>

            {/* Submit Button - Gradient */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative px-6 py-3.5 text-white font-bold text-base rounded-2xl">
                {loading ? 'در حال ثبت نام...' : 'SIGN UP'}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-white/80 text-sm">حساب کاربری دارید؟ </span>
            <Link href="/giris" className="text-white font-bold hover:underline text-sm">
              وارد شوید
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
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
