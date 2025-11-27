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
  Check
} from "lucide-react";
import { formatPrice, formatDate, getImageUrl } from "@/lib/utils";

interface Ilan {
  id: number;
  baslik: string;
  aciklama: string;
  fiyat: number;
  fiyat_tipi: string;
  kategori_ad: string;
  kategori_slug: string;
  il_ad: string;
  durum: string;
  goruntulenme: number;
  created_at: string;
  kullanici_ad: string;
  kullanici_telefon: string;
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

  const handleSendMessage = () => {
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

    // Mesajı kaydet
    const mesajlar = JSON.parse(localStorage.getItem('mesajlar') || '[]');
    const yeniMesaj = {
      id: Date.now(),
      ilanId: ilan?.id,
      ilanBaslik: ilan?.baslik,
      alici: ilan?.kullanici_ad,
      gonderen: JSON.parse(currentUser).name,
      mesaj: messageText,
      tarih: new Date().toISOString(),
      okundu: false,
    };
    
    mesajlar.push(yeniMesaj);
    localStorage.setItem('mesajlar', JSON.stringify(mesajlar));
    
    // Header'ı güncelle
    window.dispatchEvent(new Event('mesajGuncelle'));
    
    setMessageText("");
    setShowMessageModal(false);
    alert('پیام شما ارسال شد!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">صفحه اصلی</Link>
            <span className="mx-2">/</span>
            <Link href={`/kategori/${ilan.kategori_slug}`} className="hover:text-blue-600">
              {ilan.kategori_ad}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 line-clamp-1">{ilan.baslik}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Main Image */}
                <div className="relative aspect-video bg-white">
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 flex items-center justify-center transition-all shadow-sm"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev === ilan.resimler.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 flex items-center justify-center transition-all shadow-sm"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
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
                  <div className="p-4 flex gap-2 overflow-x-auto border-t border-gray-200">
                    {ilan.resimler.map((resim, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                          selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
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

              {/* Title & Info */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{ilan.baslik}</h1>
                
                <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">{ilan.il_ad}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{ilan.goruntulenme} بازدید</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{formatDate(ilan.created_at)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">دسته بندی</div>
                    <Link href={`/kategori/${ilan.kategori_slug}`} className="font-semibold text-blue-600 hover:underline">
                      {ilan.kategori_ad}
                    </Link>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">وضعیت</div>
                    <div className="font-semibold text-gray-900">{durumLabels[ilan.durum]}</div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">توضیحات</h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ilan.aciklama}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Price and Contact */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Price */}
                <div className="border border-gray-300 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">قیمت</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatPrice(ilan.fiyat)}
                  </div>
                  {ilan.fiyat_tipi === 'negotiable' && (
                    <div className="text-sm text-green-600 font-medium">قابل چانه زنی</div>
                  )}
                </div>

                {/* Seller */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">صاحب آگهی</h3>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {ilan.kullanici_ad}
                      </div>
                      <Link 
                        href={`/kullanici/1`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        مشاهده سایر آگهی ها
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
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

                {/* Actions */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        const favoriler = JSON.parse(localStorage.getItem('favoriler') || '[]');
                        const ilanIndex = favoriler.findIndex((f: any) => f.id === ilan.id);
                        
                        if (ilanIndex > -1) {
                          favoriler.splice(ilanIndex, 1);
                        } else {
                          favoriler.push({
                            id: ilan.id,
                            baslik: ilan.baslik,
                            fiyat: ilan.fiyat,
                            ana_resim: ilan.resimler[0],
                            kategori_ad: ilan.kategori_ad,
                            il_ad: ilan.il_ad,
                            goruntulenme: ilan.goruntulenme,
                            created_at: ilan.created_at,
                            resimler: ilan.resimler,
                            resim_sayisi: ilan.resimler.length,
                            fiyat_tipi: ilan.fiyat_tipi,
                          });
                        }
                        
                        localStorage.setItem('favoriler', JSON.stringify(favoriler));
                        window.dispatchEvent(new Event('favoriGuncelle'));
                      }}
                      className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">افزودن به علاقه مندی ها</span>
                    </button>
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">اشتراک گذاری</span>
                    </button>
                  </div>
                </div>

                {/* Safety */}
                <div className="border-2 border-yellow-400 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-bold text-gray-900 text-sm">نکات امنیتی</h4>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1.5">
                    <li>• در مکان های امن ملاقات کنید</li>
                    <li>• محصول را بررسی کنید</li>
                    <li>• پیش پرداخت نکنید</li>
                    <li>• آگهی های مشکوک را گزارش دهید</li>
                  </ul>
                </div>

                {/* Ad Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">شماره آگهی:</span>
                      <span className="font-semibold text-gray-900">#{ilan.id}</span>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">آخرین بروزرسانی:</span>
                      <span className="font-semibold text-gray-900">{formatDate(ilan.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diğer İlanlar */}
          {benzerIlanlar.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">سایر آگهی ها</h2>
                <p className="text-gray-600">آگهی هایی که برای شما انتخاب کرده ایم</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {benzerIlanlar.map((benzer: any) => (
                  <Link key={benzer.id} href={`/ilan/${benzer.id}`} className="group block h-full">
                    <div className="overflow-hidden rounded-xl border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 h-full flex flex-col">
                      <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <Image
                          src={getImageUrl(benzer.resimler?.[0] || benzer.ana_resim)}
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
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(benzer.fiyat)}
                          </span>
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
