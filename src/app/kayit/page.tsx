"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KayitOl() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    telefon: "",
    sifre: "",
    sifreTekrar: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email veya Telefon'dan en az biri zorunlu
    if (!formData.email && !formData.telefon) {
      alert('لطفا ایمیل یا شماره تلفن خود را وارد کنید');
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
      // Backend API'ye kayıt isteği gönder
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
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'خطا در ثبت نام');
        setLoading(false);
        return;
      }

      // Başarılı kayıt - kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify({
        id: data.data.id,
        email: data.data.email,
        ad: data.data.ad,
      }));
      
      // Event gönder (header'ı güncelle)
      window.dispatchEvent(new Event('userLogin'));
      
      // Başarı mesajı
      alert(data.message || 'ثبت نام با موفقیت انجام شد');
      
      // Ana sayfaya yönlendir
      router.push('/');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('خطا در ثبت نام. لطفا دوباره تلاش کنید');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/">
                <span className="text-4xl font-bold text-gray-900">Afghanistan</span>
                <span className="text-4xl font-bold text-blue-600">.</span>
              </Link>
              <p className="text-gray-600 mt-2">حساب کاربری ایجاد کنید</p>
            </div>

            {/* Register Form */}
            <div className="border border-gray-200 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">ثبت نام</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.ad}
                      onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                      className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="احمد احمدی"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آدرس ایمیل <span className="text-gray-500 text-xs">(اختیاری)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ایمیل یا شماره تلفن الزامی است</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تلفن <span className="text-gray-500 text-xs">(اختیاری)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.telefon}
                      onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                      className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+93 700 000 000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ایمیل یا شماره تلفن الزامی است</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.sifre}
                      onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                      className="w-full pr-11 pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تکرار رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.sifreTekrar}
                      onChange={(e) => setFormData({ ...formData, sifreTekrar: e.target.value })}
                      className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                    <span className="text-sm text-gray-600">
                      <Link href="/kullanim-kosullari" className="text-blue-600 hover:underline">
                        شرایط استفاده
                      </Link>
                      {' '}و{' '}
                      <Link href="/gizlilik" className="text-blue-600 hover:underline">
                        سیاست حفظ حریم خصوصی
                      </Link>
                      {' '}را می پذیرم
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-500">یا</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-gray-600">قبلا حساب کاربری دارید؟ </span>
                <Link href="/giris" className="text-blue-600 font-semibold hover:underline">
                  وارد شوید
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">
                → بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
