"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import {
  ArrowLeft,
  Upload,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function YeniKullaniciPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");

  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    telefon: "",
    sifre: "",
    sifre_tekrar: "",
    rol: "user",
    aktif: true
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.ad || !formData.email || !formData.sifre) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    if (formData.sifre !== formData.sifre_tekrar) {
      alert('رمزهای عبور مطابقت ندارند');
      return;
    }

    if (formData.sifre.length < 6) {
      alert('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('فرمت ایمیل نامعتبر است');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/kullanicilar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profil_resmi: profileImage || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('کاربر با موفقیت ایجاد شد');
        router.push('/admin/kullanicilar');
      } else {
        alert(data.message || 'خطا در ایجاد کاربر');
      }
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      alert('خطا در ایجاد کاربر');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">کاربر جدید</h1>
            <p className="text-gray-600 mt-1">ایجاد حساب کاربری جدید در سیستم</p>
          </div>
          <Link
            href="/admin/kullanicilar"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>بازگشت</span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="space-y-6">
            {/* Profil Resmi */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">تصویر پروفایل</h2>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-4 border-gray-200">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer">
                  <div className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    انتخاب تصویر
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {profileImage && (
                  <button
                    type="button"
                    onClick={() => setProfileImage("")}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    حذف تصویر
                  </button>
                )}
              </div>
            </div>

            {/* Temel Bilgiler */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                اطلاعات اصلی
              </h2>

              <div className="space-y-5">
                {/* Ad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="ad"
                      value={formData.ad}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="احمد احمدی"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    آدرس ایمیل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="example@email.com"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    شماره تلفن (اختیاری)
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+93 700 000 000"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Şifre ve Güvenlik */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                امنیت و رمز عبور
              </h2>

              <div className="space-y-5">
                {/* Şifre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رمز عبور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="sifre"
                      value={formData.sifre}
                      onChange={handleChange}
                      className="w-full pr-12 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="حداقل ۶ کاراکتر"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Şifre Tekrar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    تکرار رمز عبور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="sifre_tekrar"
                      value={formData.sifre_tekrar}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="رمز عبور را دوباره وارد کنید"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نقش کاربر <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="user">کاربر عادی</option>
                      <option value="admin">مدیر سیستم</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    مدیران دسترسی کامل به پنل ادمین دارند
                  </p>
                </div>

                {/* Aktif */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    name="aktif"
                    id="aktif"
                    checked={formData.aktif}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="aktif" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    حساب کاربری فعال باشد
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>در حال ایجاد...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>ایجاد کاربر</span>
                  </>
                )}
              </button>

              <Link
                href="/admin/kullanicilar"
                className="px-6 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                لغو
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}











