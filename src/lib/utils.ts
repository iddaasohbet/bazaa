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

// Fiyat formatlama
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-AF', {
    style: 'currency',
    currency: 'AFN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
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
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (days > 0) {
    return `${days} gün önce`;
  } else if (hours > 0) {
    return `${hours} saat önce`;
  } else if (minutes > 0) {
    return `${minutes} dakika önce`;
  } else {
    return 'Az önce';
  }
}

// Resim URL'i oluştur
export function getImageUrl(path: string | null): string {
  if (!path) return '/images/placeholder.jpg';
  // Base64 resimler için
  if (path.startsWith('data:image')) return path;
  // HTTP/HTTPS URL'ler için
  if (path.startsWith('http')) return path;
  // Local dosyalar için
  return `/uploads/${path}`;
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

