"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import {
  ArrowLeft,
  Upload,
  Store,
  Save,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  MapPin,
  Phone,
  Award,
  Type,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { getCitiesList, getDistrictsList } from "@/lib/cities";

interface Kullanici {
  id: number;
  ad: string;
  email: string;
}

export default function MagazaDuzenlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [logo, setLogo] = useState<string>("");
  const [kapakResmi, setKapakResmi] = useState<string>("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [ilce, setIlce] = useState("");

  const [formData, setFormData] = useState({
    kullanici_id: "",
    ad: "",
    ad_dari: "",
    aciklama: "",
    telefon: "",
    adres: "",
    il_id: "",
    store_level: "basic",
    tema_renk: "#3B82F6",
    aktif: true,
    guvenilir_satici: false,
    onay_durumu: "onaylandi"
  });

  const cities = getCitiesList();

  useEffect(() => {
    fetchKullanicilar();
    fetchMagaza();
  }, [resolvedParams.id]);

  const fetchKullanicilar = async () => {
    try {
      const response = await fetch('/api/admin/kullanicilar?limit=1000');
      const data = await response.json();
      if (data.success) {
        setKullanicilar(data.data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    }
  };

  const fetchMagaza = async () => {
    try {
      const response = await fetch(`/api/magazalar/${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.success) {
        const magaza = data.data;
        setFormData({
          kullanici_id: magaza.kullanici_id?.toString() || "",
          ad: magaza.ad || "",
          ad_dari: magaza.ad_dari || "",
          aciklama: magaza.aciklama || "",
          telefon: magaza.telefon || "",
          adres: magaza.adres || "",
          il_id: magaza.il_id?.toString() || "",
          store_level: magaza.store_level || "basic",
          tema_renk: magaza.tema_renk || "#3B82F6",
          aktif: magaza.aktif !== false,
          guvenilir_satici: magaza.guvenilir_satici || false,
          onay_durumu: magaza.onay_durumu || "onaylandi"
        });
        
        if (magaza.logo) setLogo(magaza.logo);
        if (magaza.kapak_resmi) setKapakResmi(magaza.kapak_resmi);
        if (magaza.il_id) {
          setDistricts(getDistrictsList(magaza.il_id.toString()));
        }
      }
    } catch (error) {
      console.error('Mağaza yüklenemedi:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCityChange = (cityId: string) => {
    setFormData({ ...formData, il_id: cityId });
    setIlce("");
    setDistricts(getDistrictsList(cityId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'kapak') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogo(reader.result as string);
      } else {
        setKapakResmi(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kullanici_id || !formData.ad || !formData.il_id) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/magazalar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(resolvedParams.id),
          ...formData,
          kullanici_id: parseInt(formData.kullanici_id),
          il_id: parseInt(formData.il_id),
          logo: logo || null,
          kapak_resmi: kapakResmi || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('مغازه با موفقیت به‌روزرسانی شد');
        router.push('/admin/magazalar');
      } else {
        alert(data.message || 'خطا در به‌روزرسانی مغازه');
      }
    } catch (error) {
      console.error('Mağaza güncelleme hatası:', error);
      alert('خطا در به‌روزرسانی مغازه');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  if (dataLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ویرایش مغازه</h1>
            <p className="text-gray-600 mt-1">به‌روزرسانی اطلاعات مغازه</p>
          </div>
          <Link
            href="/admin/magazalar"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>بازگشت</span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
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
                      نام مغازه (انگلیسی) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="ad"
                        value={formData.ad}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="My Store"
                        required
                      />
                    </div>
                  </div>

                  {/* Ad Dari */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نام مغازه (دری)
                    </label>
                    <div className="relative">
                      <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="ad_dari"
                        value={formData.ad_dari}
                        onChange={handleChange}
                        className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="مغازه من"
                      />
                    </div>
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      توضیحات
                    </label>
                    <textarea
                      name="aciklama"
                      value={formData.aciklama}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="توضیحات مغازه را اینجا بنویسید..."
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تلفن
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

                  {/* Şehir ve İlçe */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        شهر (ولایت) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="il_id"
                          value={formData.il_id}
                          onChange={(e) => handleCityChange(e.target.value)}
                          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">شهر را انتخاب کنید...</option>
                          {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ناحیه (ولسوالی)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={ilce}
                          onChange={(e) => setIlce(e.target.value)}
                          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                          disabled={!formData.il_id}
                        >
                          <option value="">ناحیه را انتخاب کنید...</option>
                          {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Adres */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      آدرس
                    </label>
                    <input
                      type="text"
                      name="adres"
                      value={formData.adres}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="آدرس کامل مغازه"
                    />
                  </div>
                </div>
              </div>

              {/* Ayarlar */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">تنظیمات</h2>

                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Store Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        سطح مغازه <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Award className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="store_level"
                          value={formData.store_level}
                          onChange={handleChange}
                          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="basic">عادی (Basic)</option>
                          <option value="pro">حرفه‌ای (Pro)</option>
                          <option value="elite">ویژه (Elite)</option>
                        </select>
                      </div>
                    </div>

                    {/* Tema Renk */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        رنگ تم
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="tema_renk"
                          value={formData.tema_renk}
                          onChange={handleChange}
                          className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.tema_renk}
                          onChange={(e) => setFormData({...formData, tema_renk: e.target.value})}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="#3B82F6"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Onay Durumu */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وضعیت تأیید
                    </label>
                    <select
                      name="onay_durumu"
                      value={formData.onay_durumu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="beklemede">در انتظار تأیید</option>
                      <option value="onaylandi">تأیید شده</option>
                      <option value="reddedildi">رد شده</option>
                    </select>
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
                      مغازه فعال باشد
                    </label>
                  </div>

                  {/* Güvenilir Satıcı */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <input
                      type="checkbox"
                      name="guvenilir_satici"
                      id="guvenilir_satici"
                      checked={formData.guvenilir_satici}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="guvenilir_satici" className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      فروشنده معتبر (روزت سبز)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Images */}
            <div className="space-y-6">
              {/* Logo */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">لوگو</h2>
                
                <label className="block mb-4 cursor-pointer">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">بارگذاری لوگو</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                </label>

                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    حذف لوگو
                  </button>
                )}
              </div>

              {/* Kapak Resmi */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">تصویر کاور</h2>
                
                <label className="block mb-4 cursor-pointer">
                  {kapakResmi ? (
                    <img
                      src={kapakResmi}
                      alt="Kapak"
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">بارگذاری کاور</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'kapak')}
                    className="hidden"
                  />
                </label>

                {kapakResmi && (
                  <button
                    type="button"
                    onClick={() => setKapakResmi("")}
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    حذف کاور
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>در حال به‌روزرسانی...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>به‌روزرسانی مغازه</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}


