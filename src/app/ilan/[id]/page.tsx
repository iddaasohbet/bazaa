"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Eye, 
  Clock, 
  Share2, 
  Heart, 
  Phone, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  User,
  Copy,
  Check,
  Store,
  Package,
  BadgeCheck,
  ShieldCheck
} from "lucide-react";
import { formatPriceWithBoth, formatDate, getImageUrl } from "@/lib/utils";
import PriceDisplay from "@/components/PriceDisplay";

interface Ilan {
  id: number;
  baslik: string;
  aciklama: string;
  fiyat: number;
  eski_fiyat?: number;
  indirim_yuzdesi?: number;
  fiyat_tipi: string;
  para_birimi?: 'AFN' | 'USD';
  fiyat_usd?: number | null;
  kategori_ad: string;
  kategori_slug: string;
  il_ad: string;
  durum: string;
  emlak_tipi?: string;
  goruntulenme: number;
  created_at: string;
  kullanici_ad: string;
  kullanici_telefon: string;
  kullanici_id: number;
  magaza_id?: number;
  magaza_ad?: string;
  store_level?: string;
  magaza_guvenilir_satici?: boolean;
  resimler: string[];
}

export default function IlanDetay({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [ilan, setIlan] = useState<Ilan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [benzerIlanlar, setBenzerIlanlar] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    fetchIlan();
  }, [resolvedParams.id]);

  const fetchIlan = async () => {
    try {
      const response = await fetch(`/api/ilanlar/${resolvedParams.id}`);
      const data = await response.json();
      if (data.success) {
        console.log('🔍 İlan Detay - İlan verisi:', data.data);
        console.log('🏪 İlan Detay - Mağaza ID:', data.data.magaza_id);
        console.log('⭐ İlan Detay - Store Level:', data.data.store_level);
        setIlan(data.data);
        // Benzer ilanları yükle
        fetchBenzerIlanlar(data.data.kategori_slug);
      }
    } catch (error) {
      console.error('خطا در بارگذاری آگهی:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBenzerIlanlar = async (kategoriSlug: string) => {
    try {
      // Tüm ilanlardan rastgele 6 tane getir
      const response = await fetch(`/api/ilanlar?limit=12`);
      const data = await response.json();
      if (data.success) {
        // Mevcut ilanı hariç tut ve karıştır
        const filtered = data.data.filter((i: any) => i.id.toString() !== resolvedParams.id);
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setBenzerIlanlar(shuffled.slice(0, 6));
      }
    } catch (error) {
      console.error('خطا در بارگذاری آگهی ها:', error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = ilan?.baslik || '';
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' - ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-96 border border-gray-200 rounded"></div>
              <div className="h-64 border border-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ilan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">آگهی یافت نشد</h1>
            <p className="text-gray-600 mb-6">آگهی مورد نظر شما حذف شده یا دیگر موجود نیست.</p>
            <Link href="/" className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const durumLabels: { [key: string]: string } = {
    'yeni': 'نو',
    'az_kullanilmis': 'کم استفاده',
    'kullanilmis': 'استفاده شده',
    'hasarli': 'آسیب دیده',
  };

  const emlakTipiLabels: { [key: string]: { label: string; icon: string; color: string } } = {
    'satilik': { label: 'فروشی', icon: '🏷️', color: 'bg-green-100 text-green-700' },
    'kiralik': { label: 'کرایی', icon: '🔑', color: 'bg-blue-100 text-blue-700' },
    'rehinli': { label: 'گروی', icon: '🏦', color: 'bg-purple-100 text-purple-700' },
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      alert('لطفا پیام خود را بنویسید');
      return;
    }

    // Mevcut kullanıcıyı kontrol et
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      alert('برای ارسال پیام باید وارد شوید');
      window.location.href = '/giris?redirect=/ilan/' + ilan?.id;
      return;
    }

    try {
      const user = JSON.parse(currentUser);
      
      const response = await fetch('/api/mesajlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString()
        },
        body: JSON.stringify({
          aliciId: ilan?.kullanici_id,
          mesaj: messageText,
          ilanId: ilan?.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Header'ı güncelle
        window.dispatchEvent(new Event('mesajGuncelle'));
        
        setMessageText("");
        setShowMessageModal(false);
        alert('پیام شما ارسال شد!');
      } else {
        alert('خطا در ارسال پیام');
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('خطا در ارسال پیام');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1 py-6 md:py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm" dir="rtl">
            <div className="flex items-center gap-2 text-gray-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">صفحه اصلی</Link>
              <ChevronLeft className="h-4 w-4" />
              <Link href={`/kategori/${ilan.kategori_slug}`} className="hover:text-blue-600 transition-colors">
                {ilan.kategori_ad}
              </Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-gray-900 font-medium line-clamp-1">{ilan.baslik}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery - Premium */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Main Image */}
                <div className="relative aspect-[4/3] md:aspect-video bg-gray-50">
                  {ilan.resimler && ilan.resimler.length > 0 ? (
                    <>
                      <Image
                        src={getImageUrl(ilan.resimler[selectedImageIndex])}
                        alt={ilan.baslik}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                      />
                      {ilan.resimler.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === 0 ? ilan.resimler.length - 1 : prev - 1
                            )}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 flex items-center justify-center transition-all shadow-lg border border-gray-100"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === ilan.resimler.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 flex items-center justify-center transition-all shadow-lg border border-gray-100"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          {/* Image Counter */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
                            {selectedImageIndex + 1} / {ilan.resimler.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>تصویری موجود نیست</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {ilan.resimler && ilan.resimler.length > 1 && (
                  <div className="p-3 md:p-4 flex gap-2 overflow-x-auto bg-gray-50/50">
                    {ilan.resimler.map((resim, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-blue-600 ring-2 ring-blue-200' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={getImageUrl(resim)}
                          alt={`${ilan.baslik} - ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Info - Premium */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{ilan.baslik}</h1>
                
                <div className="flex flex-wrap gap-4 md:gap-6 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <MapPin className={`h-4 w-4 ${ilan.store_level === 'elite' ? 'text-amber-500' : 'text-blue-500'}`} />
                    <span className="text-gray-700 font-medium text-sm">{ilan.il_ad}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Eye className={`h-4 w-4 ${ilan.store_level === 'elite' ? 'text-amber-500' : 'text-emerald-500'}`} />
                    <span className="text-gray-600 text-sm">{ilan.goruntulenme} بازدید</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock className={`h-4 w-4 ${ilan.store_level === 'elite' ? 'text-amber-500' : 'text-purple-500'}`} />
                    <span className="text-gray-600 text-sm">{formatDate(ilan.created_at)}</span>
                  </div>
                </div>

                <div className={`grid ${ilan.emlak_tipi ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'} gap-3 md:gap-4 mb-6`}>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1 font-medium">دسته بندی</div>
                    <Link href={`/kategori/${ilan.kategori_slug}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      {ilan.kategori_ad}
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-1 font-medium">وضعیت</div>
                    <div className="font-bold text-gray-900">{durumLabels[ilan.durum]}</div>
                  </div>
                  
                  {/* Emlak Tipi - Sadece emlak kategorisinde göster */}
                  {ilan.emlak_tipi && emlakTipiLabels[ilan.emlak_tipi] && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="text-xs text-purple-600 mb-1 font-medium">نوع ملک</div>
                      <div className={`inline-flex items-center gap-2 font-bold text-gray-900`}>
                        <span>{emlakTipiLabels[ilan.emlak_tipi].icon}</span>
                        <span>{emlakTipiLabels[ilan.emlak_tipi].label}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                    توضیحات
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">{ilan.aciklama}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Price and Contact */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Price - Premium */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                  <div className="text-sm text-gray-600 mb-3">قیمت</div>
                  
                  {/* İndirim Gösterimi - Sadece Pro ve Elite için */}
                  {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 && (ilan.store_level === 'pro' || ilan.store_level === 'elite') ? (
                    <div className="space-y-3">
                      {/* İndirim Badge */}
                      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                        <span className="text-2xl">🔥</span>
                        <span>{ilan.indirim_yuzdesi}% تخفیف ویژه</span>
                      </div>
                      
                      {/* Eski Fiyat */}
                      {ilan.eski_fiyat && (
                        <div className="line-through">
                          <PriceDisplay 
                            price={ilan.eski_fiyat}
                            currency={ilan.para_birimi as 'AFN' | 'USD' || 'AFN'}
                            className="text-xl text-gray-500"
                          />
                        </div>
                      )}
                      
                      {/* Yeni Fiyat */}
                      <div className="space-y-2">
                        {ilan.fiyat_usd && ilan.fiyat_usd > 0 ? (
                          <>
                            <PriceDisplay 
                              price={ilan.fiyat_usd}
                              currency="USD"
                              className="text-5xl font-bold text-red-600"
                            />
                            <PriceDisplay 
                              price={ilan.fiyat}
                              currency="AFN"
                              className="text-2xl font-semibold text-gray-700"
                            />
                          </>
                        ) : (
                          <PriceDisplay 
                            price={ilan.fiyat}
                            currency="AFN"
                            className="text-5xl font-bold text-red-600"
                          />
                        )}
                      </div>
                      
                      {/* Tasarruf */}
                      {ilan.eski_fiyat && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
                          <div className="text-sm text-green-700 font-medium">
                            شما صرفه‌جویی می‌کنید:
                          </div>
                          <PriceDisplay 
                            price={ilan.eski_fiyat - ilan.fiyat}
                            currency="AFN"
                            className="text-xl font-bold text-green-600"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ilan.fiyat_usd && ilan.fiyat_usd > 0 ? (
                        <>
                          <PriceDisplay 
                            price={ilan.fiyat_usd}
                            currency="USD"
                            className="text-4xl font-bold text-green-600"
                          />
                          <PriceDisplay 
                            price={ilan.fiyat}
                            currency="AFN"
                            className="text-2xl font-semibold text-gray-700"
                          />
                          <div className="text-xs text-gray-500 mt-1">قیمت در هر دو واحد پول</div>
                        </>
                      ) : (
                        <PriceDisplay 
                          price={ilan.fiyat}
                          currency="AFN"
                          className="text-4xl font-bold text-gray-900"
                        />
                      )}
                    </div>
                  )}
                  
                  {ilan.fiyat_tipi === 'negotiable' && (
                    <div className="text-sm text-green-600 font-medium mt-3">قابل چانه زنی</div>
                  )}
                </div>

                {/* Seller - Premium */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    صاحب آگهی
                  </h3>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 mb-0.5">
                        {ilan.kullanici_ad}
                      </div>
                      <div className="text-xs text-gray-500">فروشنده</div>
                    </div>
                  </div>
                  
                  {/* Mağaza Kartı */}
                  {ilan.magaza_id ? (
                    <div className="mb-3">
                      {/* Mağaza Bilgileri */}
                      <div className={`bg-gradient-to-r rounded-lg p-4 mb-3 border-2 ${
                        ilan.store_level === 'elite' 
                          ? 'from-amber-50 to-orange-50 border-amber-200'
                          : 'from-purple-50 to-pink-50 border-purple-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Link 
                            href={`/magaza/${ilan.magaza_id}`}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                          >
                            <Store className={`h-5 w-5 ${ilan.store_level === 'elite' ? 'text-amber-600' : 'text-purple-600'}`} />
                            <div className={`font-bold ${ilan.store_level === 'elite' ? 'text-amber-900' : 'text-purple-900'}`}>
                              {ilan.magaza_ad || 'مغازه رسمی'}
                            </div>
                          </Link>
                          {/* Doğrulama Rozeti - Sadece Ücretli Paketler */}
                          {(ilan.store_level === 'elite' || ilan.store_level === 'pro') && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                              ilan.store_level === 'elite'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}>
                              <BadgeCheck className="h-4 w-4 text-white fill-white" />
                              <span className="text-xs font-bold text-white">تأیید شده</span>
                            </div>
                          )}
                        </div>
                        {ilan.store_level && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              ilan.store_level === 'elite' 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-md'
                                : ilan.store_level === 'pro'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {ilan.store_level === 'elite' ? '⭐ پریمیوم' : ilan.store_level === 'pro' ? '💎 پرو' : 'عادی'}
                            </span>
                            {/* Güvenilir Satıcı Rozeti - Sadece Admin Açarsa */}
                            {ilan.magaza_guvenilir_satici && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                <ShieldCheck className="h-3 w-3" />
                                فروشنده معتبر
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Mağaza Butonu */}
                      <Link 
                        href={`/magaza/${ilan.magaza_id}`}
                        className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${
                          ilan.store_level === 'elite'
                            ? 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                            : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }`}
                      >
                        <Store className="h-5 w-5" />
                        مشاهده مغازه و سایر محصولات
                      </Link>
                    </div>
                  ) : (
                    <Link 
                      href={`/kullanici/${ilan.kullanici_id}`}
                      className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg mb-3"
                    >
                      <Package className="h-5 w-5" />
                      سایر آگهی‌های این کاربر
                    </Link>
                  )}
                  
                  <div className="space-y-3">
                    {showPhone ? (
                      <a
                        href={`tel:${ilan.kullanici_telefon}`}
                        className="flex items-center justify-center gap-2 w-full border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        {ilan.kullanici_telefon}
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowPhone(true)}
                        className="flex items-center justify-center gap-2 w-full border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        نمایش شماره تلفن
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setShowMessageModal(true)}
                      className="flex items-center justify-center gap-2 w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      ارسال پیام
                    </button>
                  </div>
                </div>

                {/* Actions - Premium */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={async () => {
                        const currentUser = localStorage.getItem('user');
                        if (!currentUser) {
                          alert('برای افزودن به علاقه مندی ها باید وارد شوید');
                          window.location.href = '/giris?redirect=/ilan/' + ilan?.id;
                          return;
                        }

                        try {
                          const user = JSON.parse(currentUser);
                          
                          // Favoriye ekle
                          const response = await fetch('/api/favoriler', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-user-id': user.id.toString()
                            },
                            body: JSON.stringify({ ilanId: ilan?.id })
                          });

                          const data = await response.json();
                          
                          if (data.success) {
                            window.dispatchEvent(new Event('favoriGuncelle'));
                            alert('به علاقه مندی ها اضافه شد');
                          }
                        } catch (error) {
                          console.error('Favori ekleme hatası:', error);
                          alert('خطا در افزودن به علاقه مندی ها');
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-3 rounded-xl transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium">علاقه‌مندی</span>
                    </button>
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-3 rounded-xl transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm font-medium">اشتراک</span>
                    </button>
                  </div>
                </div>

                {/* Safety - Premium */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">نکات امنیتی</h4>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      در مکان های امن ملاقات کنید
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      محصول را بررسی کنید
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      پیش پرداخت نکنید
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      آگهی های مشکوک را گزارش دهید
                    </li>
                  </ul>
                </div>

                {/* Ad Info - Premium */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">شماره آگهی</span>
                      <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">#{ilan.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">آخرین بروزرسانی</span>
                      <span className="font-medium text-gray-700">{formatDate(ilan.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diğer İlanlar - Premium */}
          {benzerIlanlar.length > 0 && (
            <div className="mt-10 md:mt-14">
              <div className="mb-6 md:mb-8" dir="rtl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
                  سایر آگهی ها
                </h2>
                <p className="text-gray-500 text-sm md:text-base">آگهی هایی که ممکن است به آنها علاقه‌مند باشید</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {benzerIlanlar.map((benzer: any) => (
                  <Link key={benzer.id} href={`/ilan/${benzer.id}`} className="group block h-full">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 h-full flex flex-col">
                      <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <Image
                          src={getImageUrl(
                            (benzer.resimler && benzer.resimler.length > 0 && benzer.resimler[0]) 
                              ? benzer.resimler[0] 
                              : benzer.ana_resim
                          )}
                          alt={benzer.baslik}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 16vw"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                            {benzer.kategori_ad}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                          {benzer.baslik}
                        </h3>
                        <div className="mb-3">
                          <PriceDisplay 
                            price={benzer.fiyat}
                            currency="AFN"
                            className="text-lg font-bold text-blue-600"
                          />
                        </div>
                        <div className="mt-auto space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                            <span className="truncate">{benzer.il_ad}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Mesaj Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">ارسال پیام</h3>
            <p className="text-sm text-gray-600 mb-4">
              شما پیامی به <span className="font-semibold">{ilan?.kullanici_ad}</span> ارسال می کنید
            </p>
            
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="پیام خود را اینجا بنویسید..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSendMessage}
                className="flex-1 border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                ارسال
              </button>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText("");
                }}
                className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paylaş Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">اشتراک گذاری آگهی</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {linkCopied ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <Copy className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-700">
                  {linkCopied ? 'کپی شد!' : 'کپی لینک'}
                </span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
