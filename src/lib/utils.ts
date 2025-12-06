import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Türkçe karakterleri slug'a uygun hale getir
export function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'İ': 'I', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fiyat formatlama - İngilizce rakamlar ile
export function formatPrice(price: number, currency: 'AFN' | 'USD' = 'AFN'): string {
  if (currency === 'USD') {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    return `${formattedNumber} $`; // $ sağda
  }
  
  // AFN için - افغانی SOLDA (RTL için doğal)
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return `افغانی ${formattedNumber}`;
}

// Sadece sayıyı döndür (AFN olmadan)
export function formatPriceNumber(price: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Çift para birimi gösterimi (USD seçildiğinde hem USD hem AFN göster)
export function formatPriceWithBoth(priceAFN: number, priceUSD?: number | null, paraBirimi?: string): string {
  // Eğer para_birimi USD ise, önce USD göster
  if (paraBirimi === 'USD' && priceUSD && priceUSD > 0) {
    return `${formatPrice(priceUSD, 'USD')} (≈ ${formatPrice(priceAFN, 'AFN')})`;
  }
  return formatPrice(priceAFN, 'AFN');
}

// Tarih formatlama
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString('fa-AF', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (days > 0) {
    return `${days} روز پیش`;
  } else if (hours > 0) {
    return `${hours} ساعت پیش`;
  } else if (minutes > 0) {
    return `${minutes} دقیقه پیش`;
  } else {
    return 'همین الان';
  }
}

// cPanel sunucu IP adresi (eski resimler burada)
const CPANEL_BASE_URL = 'http://104.247.173.212';

// Resim URL'i oluştur
export function getImageUrl(path: string | null | undefined): string {
  // Boş veya geçersiz path için placeholder
  if (!path || path.trim() === '') return '/images/placeholder.jpg';
  
  // Base64 resimler için
  if (path.startsWith('data:image')) return path;
  
  // Vercel Blob URL'leri için (yeni sistem)
  if (path.includes('blob.vercel-storage.com')) return path;
  
  // HTTP/HTTPS URL'ler için (harici resimler - zaten tam URL)
  if (path.startsWith('http')) return path;
  
  // Eski yerel dosya sistemi URL'leri - cPanel'den çek
  // /uploads/ilanlar/xxx.jpg veya /uploads/images/xxx.jpg formatı
  if (path.startsWith('/uploads/')) {
    return `${CPANEL_BASE_URL}${path}`;
  }
  
  // UUID formatındaki eski dosya adları - cPanel'den çek
  // Örn: 4296e774-d9f2-4f54-aad6-85153976fa21.jpg
  if (path.match(/^[a-f0-9-]+\.(jpg|jpeg|png|webp)$/i)) {
    return `${CPANEL_BASE_URL}/uploads/ilanlar/${path}`;
  }
  
  // Sadece dosya adı varsa (timestamp_random.jpg formatı)
  if (!path.includes('/') && path.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return `${CPANEL_BASE_URL}/uploads/images/${path}`;
  }
  
  // Diğer durumlar için placeholder
  return '/images/placeholder.jpg';
}

// İndirim yüzdesi hesapla
export function calculateDiscount(eskiFiyat: number, yeniFiyat: number): number {
  if (!eskiFiyat || eskiFiyat <= yeniFiyat) return 0;
  return Math.round(((eskiFiyat - yeniFiyat) / eskiFiyat) * 100);
}

// Mağaza seviyesi kontrolü
export function canShowDiscount(storeLevel: string): boolean {
  return storeLevel === 'pro' || storeLevel === 'elite';
}

// Mağaza seviyesi badge'i
export function getStoreLevelBadge(storeLevel: string): {
  label: string;
  labelDari: string;
  color: string;
  icon: string;
} {
  const badges = {
    basic: {
      label: 'Basic',
      labelDari: 'پایه',
      color: 'bg-gray-100 text-gray-700',
      icon: '📦'
    },
    pro: {
      label: 'Pro',
      labelDari: 'حرفه‌ای',
      color: 'bg-blue-100 text-blue-700',
      icon: '⚡'
    },
    elite: {
      label: 'Elite',
      labelDari: 'ممتاز',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      icon: '👑'
    }
  };
  
  return badges[storeLevel as keyof typeof badges] || badges.basic;
}

