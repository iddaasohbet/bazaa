"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
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
  ShieldCheck,
  Mail,
  CheckCircle2,
  Maximize2,
  X,
  Sparkles,
  Crown,
  Zap
} from "lucide-react";
import { formatDate, getImageUrl } from "@/lib/utils";

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
  const [showImageLightbox, setShowImageLightbox] = useState(false);
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
      const response = await fetch(`/api/ilanlar/${resolvedParams.id}`, {
        cache: 'force-cache',
      });
      const data = await response.json();
      if (data.success) {
        setIlan(data.data);
        fetch(`/api/ilanlar/${resolvedParams.id}/view`, { method: 'POST', keepalive: true }).catch(() => {});
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
      const response = await fetch(`/api/ilanlar?limit=12`, { cache: 'force-cache' });
      const data = await response.json();
      if (data.success) {
        const filtered = data.data.filter((i: any) => i.id.toString() !== resolvedParams.id);
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setBenzerIlanlar(shuffled.slice(0, 5));
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
      <div className="min-h-screen flex flex-col bg-[#e8f4f0]">
        <Header />
        <main className="flex-1 py-8">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="animate-pulse grid lg:grid-cols-[1fr_400px] gap-8">
              <div className="h-[500px] bg-white/50 rounded-3xl"></div>
              <div className="h-[600px] bg-white/50 rounded-3xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ilan) {
    return (
      <div className="min-h-screen flex flex-col bg-[#e8f4f0]">
        <Header />
        <main className="flex-1 py-8">
          <div className="mx-auto w-full max-w-6xl px-4 text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">آگهی یافت نشد</h1>
            <p className="text-gray-600 mb-6">آگهی مورد نظر شما حذف شده یا دیگر موجود نیست.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-white rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm">
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

  // Normal değişkenler (useMemo yerine - basit hesaplamalar)
  const features = [
    { label: `دسته‌بندی: ${ilan.kategori_ad}`, active: true },
    { label: `وضعیت: ${durumLabels[ilan.durum] || ilan.durum}`, active: true },
    { label: `موقعیت: ${ilan.il_ad}`, active: true },
    ...(ilan.emlak_tipi && emlakTipiLabels[ilan.emlak_tipi] ? [{ label: `نوع: ${emlakTipiLabels[ilan.emlak_tipi].label}`, active: true }] : []),
    ...(ilan.fiyat_tipi === 'negotiable' ? [{ label: 'قابل مذاکره', active: true }] : []),
  ];

  const currentImageUrl = (ilan.resimler && ilan.resimler.length > 0) 
    ? getImageUrl(ilan.resimler[selectedImageIndex] ?? ilan.resimler[0])
    : null;

  const storeBadge = (() => {
    if (!ilan.store_level) return null;
    if (ilan.store_level === "elite") return { text: "⭐ پریمیوم", className: "from-amber-500 to-orange-500" };
    if (ilan.store_level === "pro") return { text: "💎 پرو", className: "from-indigo-500 to-violet-500" };
    return { text: "عادی", className: "from-slate-500 to-slate-600" };
  })();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e3f0ec] via-[#edf5f2] to-[#e8f4f0]">
      <Header />
      
      <main className="flex-1 py-6 md:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 relative">
          {/* Background orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="pointer-events-none absolute top-16 -right-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

          {/* Header - Title & Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-6"
            dir="rtl"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-white/60 text-sm text-gray-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-teal-600" />
                جزئیات آگهی
              </span>
              <Link
                href={`/kategori/${ilan.kategori_slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-white/60 text-sm text-gray-700 hover:text-teal-700 hover:border-teal-200 transition-colors shadow-sm"
              >
                {ilan.kategori_ad}
              </Link>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-white/60 text-sm text-gray-700 shadow-sm">
                <MapPin className="h-4 w-4 text-emerald-600" />
                {ilan.il_ad}
              </span>
              {storeBadge && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${storeBadge.className} text-white text-sm font-semibold shadow-sm`}>
                  {storeBadge.text}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-snug">
              {ilan.baslik}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              الهام گرفته از طراحی‌های پریمیوم (نمایش بزرگ تصویر + کارت فروشنده)
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">
            
            {/* Left Column - Image Gallery */}
            <div className="space-y-6 order-1">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.18),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(16,185,129,0.16),transparent_45%)]" />

                <div className="relative aspect-[4/3] md:aspect-[16/10]">
                  {ilan.resimler && ilan.resimler.length > 0 ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedImageIndex}
                          initial={{ opacity: 0, scale: 1.01 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.99 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={getImageUrl(ilan.resimler[selectedImageIndex])}
                            alt={ilan.baslik}
                            fill
                            className="object-contain transition-transform duration-500 hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority
                          />
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Navigation Arrows */}
                      {ilan.resimler.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === 0 ? ilan.resimler.length - 1 : prev - 1
                            )}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === ilan.resimler.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}

                      {/* Top bar: count + fullscreen */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-white text-xs border border-white/10">
                          <span className="font-semibold">
                            {selectedImageIndex + 1} / {ilan.resimler.length}
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowImageLightbox(true)}
                        className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 text-white text-xs border border-white/20 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                        تمام صفحه
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 min-h-[300px]">
                      <span>تصویری موجود نیست</span>
                    </div>
                  )}
                </div>
                
                {/* Dot Indicators */}
                {ilan.resimler && ilan.resimler.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {ilan.resimler.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          selectedImageIndex === index 
                            ? 'bg-white w-8' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails strip (premium feel) */}
              {ilan.resimler && ilan.resimler.length > 1 && (
                <div className="rounded-2xl bg-white/60 backdrop-blur border border-white/70 shadow-sm p-3">
                  <div className="flex gap-2 overflow-x-auto">
                    {ilan.resimler.map((resim, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                          selectedImageIndex === idx ? "ring-teal-500" : "ring-transparent hover:ring-teal-200"
                        }`}
                        aria-label={`image-${idx + 1}`}
                      >
                        <Image
                          src={getImageUrl(resim)}
                          alt={`${ilan.baslik} - ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_55px_rgba(15,23,42,0.10)] border border-white/70" dir="rtl">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></span>
                  توضیحات محصول
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {ilan.aciklama}
                </p>

                {/* Meta Info */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{ilan.goruntulenme} بازدید</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(ilan.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">شماره آگهی:</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">#{ilan.id}</span>
                  </div>
                </div>
              </div>

              {/* Safety Tips - Corporate */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6" dir="rtl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">نکات امنیتی خرید</h3>
                    <p className="text-xs text-gray-500">برای یک معامله مطمئن</p>
                  </div>
                </div>
                
                {/* Tips Grid */}
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">در مکان های عمومی ملاقات کنید</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">محصول را قبل از خرید بررسی کنید</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">پیش پرداخت انجام ندهید</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-rose-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">آگهی های مشکوک را گزارش دهید</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info Card */}
            <div className="lg:sticky lg:top-4 lg:self-start space-y-4 order-2">
              {/* Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-[0_22px_70px_rgba(15,23,42,0.14)] border border-white/70 relative overflow-hidden"
                dir="rtl"
              >
                <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-teal-400/15 blur-3xl" />

                {/* Favorite Button */}
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
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center transition-colors group"
                >
                  <Heart className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">قیمت</div>
                  
                  {/* İndirim Gösterimi */}
                  {ilan.indirim_yuzdesi && ilan.indirim_yuzdesi > 0 && (ilan.store_level === 'pro' || ilan.store_level === 'elite') ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                        🔥 {ilan.indirim_yuzdesi}% تخفیف
                      </div>
                      {ilan.eski_fiyat && (
                        <div className="line-through text-gray-400 text-lg">
                          {ilan.eski_fiyat.toLocaleString('fa-IR')} ؋
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-red-600">
                          {ilan.fiyat.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-xl text-gray-500">؋</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      {ilan.fiyat_usd && ilan.fiyat_usd > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900">
                              {ilan.fiyat_usd.toLocaleString('en-US')}
                            </span>
                            <span className="text-xl text-gray-500">$</span>
                          </div>
                          <div className="text-lg text-gray-500">
                            ≈ {ilan.fiyat.toLocaleString('fa-IR')} ؋
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                            {ilan.fiyat.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-xl text-gray-500">؋</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {ilan.fiyat_tipi === 'negotiable' && (
                    <div className="text-sm text-emerald-600 font-medium mt-2">✓ قابل مذاکره</div>
                  )}
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-800 mb-3">ویژگی‌ها</div>
                  <ul className="space-y-2.5">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-teal-500 flex-shrink-0" />
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Store/Seller Dropdown */}
                {ilan.magaza_id ? (
                  <div className="mb-6">
                    <Link
                      href={`/magaza/${ilan.magaza_id}`}
                      className={`flex items-center justify-between w-full p-4 rounded-2xl border-2 transition-all ${
                        ilan.store_level === 'elite'
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300'
                          : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          ilan.store_level === 'elite' ? 'bg-amber-100' : 'bg-purple-100'
                        }`}>
                          <Store className={`h-5 w-5 ${ilan.store_level === 'elite' ? 'text-amber-600' : 'text-purple-600'}`} />
                        </div>
                        <div>
                          <div className={`font-bold ${ilan.store_level === 'elite' ? 'text-amber-900' : 'text-purple-900'}`}>
                            {ilan.magaza_ad || 'مغازه'}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              ilan.store_level === 'elite'
                                ? 'bg-amber-500 text-white'
                                : ilan.store_level === 'pro'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {ilan.store_level === 'elite' ? '⭐ پریمیوم' : ilan.store_level === 'pro' ? '💎 پرو' : 'عادی'}
                            </span>
                            {ilan.magaza_guvenilir_satici && (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <ShieldCheck className="h-3 w-3" />
                                معتبر
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </Link>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Link 
                      href={`/kullanici/${ilan.kullanici_id}`}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{ilan.kullanici_ad}</div>
                        <div className="text-sm text-gray-500">فروشنده عادی</div>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </Link>
                  </div>
                )}

                {/* Action Buttons - 3 Column */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {/* Telefon */}
                  {showPhone ? (
                    <a
                      href={`tel:${ilan.kullanici_telefon}`}
                      className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition-all"
                    >
                      <Phone className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 truncate w-full text-center">{ilan.kullanici_telefon}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setShowPhone(true)}
                      className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <Phone className="h-5 w-5 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">تماس</span>
                    </button>
                  )}
                  
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${ilan.kullanici_telefon?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('سلام، در مورد آگهی "' + ilan.baslik + '" سوال داشتم.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border border-green-500 bg-green-50 hover:bg-green-100 transition-all"
                  >
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-xs font-medium text-green-700">واتساپ</span>
                  </a>
                  
                  {/* Mesaj */}
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md"
                  >
                    <MessageSquare className="h-5 w-5 text-white" />
                    <span className="text-xs font-medium text-white">پیام</span>
                  </button>
                </div>

                {/* Secondary Actions */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full text-center text-sm text-gray-500 hover:text-teal-600 transition-colors py-2"
                >
                  اشتراک‌گذاری آگهی
                </button>
              </motion.div>

              {/* Quick Actions Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-center gap-6">
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
                      }
                    }}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <Heart className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-xs text-gray-500">ذخیره</span>
                  </button>
                  
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <MessageSquare className="h-6 w-6 text-gray-400 group-hover:text-teal-500 transition-colors" />
                    <span className="text-xs text-gray-500">پیام</span>
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <Mail className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs text-gray-500">ایمیل</span>
                  </button>
                  
                  <a
                    href={showPhone ? `tel:${ilan.kullanici_telefon}` : '#'}
                    onClick={(e) => {
                      if (!showPhone) {
                        e.preventDefault();
                        setShowPhone(true);
                      }
                    }}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <Phone className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                    <span className="text-xs text-gray-500">تماس</span>
                  </a>
                </div>
              </div>

              {/* Store Button */}
              {ilan.magaza_id && (
                <Link
                  href={`/magaza/${ilan.magaza_id}`}
                  className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                    ilan.store_level === 'elite'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/25'
                  }`}
                >
                  <Store className="h-5 w-5" />
                  مشاهده مغازه و سایر محصولات
                </Link>
              )}
            </div>
          </div>

          {/* Similar Ads - Ana sayfa ile aynı stil */}
          {benzerIlanlar.length > 0 && (
            <div className="mt-12 md:mt-16">
              <div className="mb-6 md:mb-8" dir="rtl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></span>
                  آگهی‌های مشابه
                </h2>
                <p className="text-gray-500 text-sm">آگهی هایی که ممکن است علاقه‌مند باشید</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {benzerIlanlar.map((benzer: any) => {
                  const isVIP = benzer.store_level === 'pro' || benzer.store_level === 'elite';
                  
                  return (
                    <Link key={benzer.id} href={`/ilan/${benzer.id}`} className="group block">
                      <div className="relative rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300">
                        
                        {/* Image Area - Top */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
                          <Image
                            src={getImageUrl(
                              (benzer.resimler && benzer.resimler.length > 0 && benzer.resimler[0])
                                ? benzer.resimler[0]
                                : benzer.ana_resim
                            )}
                            alt={benzer.baslik}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 200px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* VIP Badge - Top Left */}
                          {isVIP && (
                            <div className={`absolute top-0 left-0 ${
                              benzer.store_level === 'elite' 
                                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600' 
                                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
                            } text-white text-[10px] font-black px-3 py-1.5 rounded-br-xl shadow-lg`}>
                              <span className="flex items-center gap-1">
                                {benzer.store_level === 'elite' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                                VIP
                              </span>
                            </div>
                          )}

                          {/* Package Badge - Bottom Right */}
                          {isVIP && (
                            <div className={`absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg ${
                              benzer.store_level === 'elite' 
                                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600' 
                                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
                            }`}>
                              {benzer.store_level === 'elite' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                              <span>{benzer.store_level === 'elite' ? 'پریمیوم' : 'پرو'}</span>
                            </div>
                          )}
                        </div>

                        {/* Content Area - Bottom */}
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 text-xs mb-2 line-clamp-2 min-h-[32px] leading-tight">
                            {benzer.baslik}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-blue-600">
                              {benzer.fiyat?.toLocaleString('fa-IR')} ؋
                            </span>
                            
                            <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{benzer.goruntulenme || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Image Lightbox */}
      <AnimatePresence>
        {showImageLightbox && currentImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowImageLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-6xl aspect-[16/10] rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImageUrl}
                alt={ilan.baslik}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              <button
                type="button"
                onClick={() => setShowImageLightbox(false)}
                className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur transition-colors"
                aria-label="close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ارسال پیام</h3>
            <p className="text-sm text-gray-500 mb-4">
              پیام به <span className="font-semibold text-gray-700">{ilan?.kullanici_ad}</span>
            </p>
            
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-gray-50"
              rows={5}
              dir="rtl"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSendMessage}
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold transition-all"
              >
                ارسال پیام
              </button>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText("");
                }}
                className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6">اشتراک‌گذاری آگهی</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-gray-200 hover:border-sky-400 hover:bg-sky-50 transition-all"
              >
                <div className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
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
              className="w-full mt-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
