import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Fallback paketler (database çalışmazsa)
const mockPaketler = [
  {
    id: 1,
    ad: 'Basic Store',
    ad_dari: 'بسته عادی',
    store_level: 'basic',
    sure_ay: 1,
    fiyat: 0,
    product_limit: 50,
    category_limit: 1,
    aktif: true,
    ozellikler: {
      aciklama: 'بسته عادی برای فروشندگان تازه‌کار و شروع سریع در بازار وطن طراحی شده است. با امکانات ضروری، محدودیت مناسب و مدیریت آسان، می‌توانید محصولات خود را بدون هزینه بالا به خریداران معرفی کنید.',
      ozellikler: [
        'رایگان - بدون هزینه',
        'محدودیت ۵۰ محصول',
        'فقط ۱ دسته‌بندی',
        'لیست استاندارد',
        'تم پیش‌فرض',
        'آمار پایه',
        'پیام‌رسانی عادی'
      ]
    }
  },
  {
    id: 2,
    ad: 'Pro Store - 3 Months',
    ad_dari: 'بسته پرو - ۳ ماهه',
    store_level: 'pro',
    sure_ay: 3,
    fiyat: 735,
    product_limit: 200,
    category_limit: 3,
    aktif: true,
    ozellikler: {
      aciklama: 'بسته پرو مخصوص فروشندگان حرفه‌ای است که می‌خواهند دیده‌شدن بیشتری داشته باشند. با محدودیت‌های بالاتر، ابزارهای تحلیل پیشرفته، طراحی قابل شخصی‌سازی و اولویت در نمایش محصولات، فروش شما به‌طور قابل توجهی افزایش می‌یابد.',
      ozellikler: [
        'حداکثر ۲۰۰ محصول',
        'تا ۳ دسته‌بندی',
        'اولویت Pro در جستجو',
        '+۵۰٪ افزایش دیده شدن',
        'گزارشات پیشرفته',
        'سفارشی‌سازی قالب (کاور، بنر، رنگ)',
        '۲۵٪ تخفیف تبلیغات',
        'بارگذاری دسته‌ای (CSV/Excel)',
        'سیستم نظرات و امتیاز فعال',
        'نمایش تخفیف محصولات',
        'پشتیبانی سریع (۱۲ ساعت)',
        '۳۰٪ تخفیف (قیمت عادی: ۱٬۰۵۰ افغانی)'
      ]
    }
  },
  {
    id: 3,
    ad: 'Elite Store - 3 Months',
    ad_dari: 'بسته پریمیوم - ۳ ماهه',
    store_level: 'elite',
    sure_ay: 3,
    fiyat: 1197,
    product_limit: 999999,
    category_limit: 999,
    aktif: true,
    ozellikler: {
      aciklama: 'بسته پریمیوم سطحی ویژه برای فروشندگان بزرگ و برندها است. با امکانات نامحدود، ویترین اختصاصی، تحلیل‌های پیشرفته، پشتیبانی VIP و ابزارهای حرفه‌ای، فروشگاه شما به یک فروشگاه واقعی و قدرتمند آنلاین تبدیل می‌شود.',
      ozellikler: [
        'محصول نامحدود',
        'دسته‌بندی نامحدود',
        'ویترین ثابت صفحه اصلی',
        'بالاترین اولویت جستجو (x۲)',
        'تبلیغ هفتگی رایگان',
        '۱٬۵۰۰ افغانی اعتبار تبلیغاتی',
        'قالب اختصاصی Premium',
        'آدرس اختصاصی مغازه',
        'تحلیل‌های حرفه‌ای (Heatmap)',
        'ارسال پیام دسته‌ای',
        'اتوماسیون کامل (موجودی، قیمت)',
        'لوگو و برندینگ کامل',
        'نشان تأیید کسب‌وکار',
        'ویدیو نامحدود',
        'نمایش تخفیف محصولات',
        'پشتیبانی VIP (۲۴/۷)',
        '۳۰٪ تخفیف (قیمت عادی: ۱٬۷۱۰ افغانی)'
      ]
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // Localhost için mock data kullan
    if (process.env.NODE_ENV === 'development' || !process.env.DB_HOST) {
      return NextResponse.json({
        success: true,
        data: mockPaketler
      });
    }

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


