import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Fallback paketler (database çalışmazsa)
const mockPaketler = [
  {
    id: 1,
    ad: 'Normal Mağaza',
    ad_dari: 'مغازه عادی',
    tip: 'normal',
    sure_ay: 1,
    fiyat: 0,
    vitrin_limiti: 0,
    anasayfa_vitrini: false,
    kategori_vitrini: false,
    arama_oncelik: false,
    buyuk_logo: false,
    ozel_tema: false,
    aktif: true,
    ozellikler: {
      ozellikler: [
        'رایگان',
        'ترتیب معمولی',
        'محصول نامحدود'
      ]
    }
  },
  {
    id: 2,
    ad: 'Pro Mağaza - Aylık',
    ad_dari: 'مغازه حرفه‌ای - ماهانه',
    tip: 'pro',
    sure_ay: 1,
    fiyat: 350,
    vitrin_limiti: 1,
    anasayfa_vitrini: false,
    kategori_vitrini: true,
    arama_oncelik: true,
    buyuk_logo: false,
    ozel_tema: true,
    aktif: true,
    ozellikler: {
      ozellikler: [
        'ویترین دسته‌بندی',
        'اولویت جستجو',
        'قالب اختصاصی',
        '۱ محصول ویترین'
      ]
    }
  },
  {
    id: 3,
    ad: 'Pro Mağaza - 3 Aylık',
    ad_dari: 'مغازه حرفه‌ای - ۳ ماهه',
    tip: 'pro',
    sure_ay: 3,
    fiyat: 735,
    vitrin_limiti: 1,
    anasayfa_vitrini: false,
    kategori_vitrini: true,
    arama_oncelik: true,
    buyuk_logo: false,
    ozel_tema: true,
    aktif: true,
    ozellikler: {
      ozellikler: [
        'ویترین دسته‌بندی',
        'اولویت جستجو',
        'قالب اختصاصی',
        '۱ محصول ویترین',
        '%۳۰ تخفیف'
      ]
    }
  },
  {
    id: 4,
    ad: 'Premium Mağaza - Aylık',
    ad_dari: 'مغازه ممتاز - ماهانه',
    tip: 'premium',
    sure_ay: 1,
    fiyat: 570,
    vitrin_limiti: 5,
    anasayfa_vitrini: true,
    kategori_vitrini: true,
    arama_oncelik: true,
    buyuk_logo: true,
    ozel_tema: true,
    aktif: true,
    ozellikler: {
      ozellikler: [
        'ویترین صفحه اصلی',
        'ویترین دسته‌بندی',
        'جستجو در بالا',
        'لوگوی بزرگ',
        'قالب اختصاصی',
        '۵ محصول ویترین'
      ]
    }
  },
  {
    id: 5,
    ad: 'Premium Mağaza - 3 Aylık',
    ad_dari: 'مغازه ممتاز - ۳ ماهه',
    tip: 'premium',
    sure_ay: 3,
    fiyat: 1197,
    vitrin_limiti: 5,
    anasayfa_vitrini: true,
    kategori_vitrini: true,
    arama_oncelik: true,
    buyuk_logo: true,
    ozel_tema: true,
    aktif: true,
    ozellikler: {
      ozellikler: [
        'ویترین صفحه اصلی',
        'ویترین دسته‌بندی',
        'جستجو در بالا',
        'لوگوی بزرگ',
        'قالب اختصاصی',
        '۵ محصول ویترین',
        '%۳۰ تخفیف'
      ]
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const paketler = await query(`
      SELECT 
        id,
        ad,
        ad_dari,
        store_level,
        sure_ay,
        fiyat,
        product_limit,
        category_limit,
        listing_priority,
        search_weight,
        analytics_access,
        theme,
        listing_discount,
        bulk_upload,
        support_level,
        homepage_vip_slot,
        weekly_auto_feature,
        monthly_ad_credit,
        video_upload,
        custom_url,
        custom_branding,
        verification_badge,
        ozellikler,
        aktif
      FROM paketler
      WHERE aktif = TRUE
      ORDER BY 
        CASE store_level 
          WHEN 'basic' THEN 1
          WHEN 'pro' THEN 2
          WHEN 'elite' THEN 3
        END,
        sure_ay ASC
    `);

    return NextResponse.json({
      success: true,
      data: paketler
    });
  } catch (error: any) {
    console.error('Paket listesi hatası (fallback kullanılıyor):', error);
    // Database hatası varsa mock data döndür
    return NextResponse.json({
      success: true,
      data: mockPaketler
    });
  }
}


