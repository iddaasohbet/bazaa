"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SifremiUnuttum() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email gir, 2: Kod doğrula, 3: Yeni şifre

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/sifre-sifirlama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'خطا در ارسال کد تایید');
        setLoading(false);
        return;
      }

      alert('کد تایید به ایمیل شما ارسال شد');
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.error('Hata:', error);
      alert('خطا در ارسال کد. لطفا دوباره تلاش کنید');
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      alert('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/sifre-sifirlama/dogrula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          kod: verificationCode,
          yeniSifre: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'کد تایید اشتباه است');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      
      // 2 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        window.location.href = '/giris';
      }, 2000);
    } catch (error) {
      console.error('Hata:', error);
      alert('خطا در تغییر رمز عبور. لطفا دوباره تلاش کنید');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">موفق!</h2>
              <p className="text-green-700">رمز عبور شما با موفقیت تغییر یافت</p>
              <p className="text-green-600 text-sm mt-2">در حال انتقال به صفحه ورود...</p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">بازار وطن</span>
              </Link>
              <p className="text-gray-600 mt-2">بازیابی رمز عبور</p>
            </div>

            {/* Form */}
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="mb-6">
                <Link href="/giris" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-sm">بازگشت به ورود</span>
                </Link>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">فراموشی رمز عبور</h1>
              <p className="text-gray-600 mb-6 text-sm">
                {step === 1 ? 'ایمیل خود را وارد کنید تا کد تایید برایتان ارسال شود' : 
                 'کد تایید ارسال شده به ایمیل و رمز عبور جدید را وارد کنید'}
              </p>

              {step === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس ایمیل
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndReset} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد تایید (6 رقمی)
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="حداقل 6 کاراکتر"
                      minLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'در حال تایید...' : 'تایید و تغییر رمز عبور'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-blue-600 hover:text-blue-700 text-sm"
                  >
                    دوباره ارسال کد
                  </button>
                </form>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>حساب کاربری ندارید؟{' '}
                <Link href="/kayit" className="text-blue-600 hover:underline font-semibold">
                  ثبت نام کنید
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

