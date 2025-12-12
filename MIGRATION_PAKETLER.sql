-- Mağaza Paket Sistemi - Güncelleme ve Veri Ekleme
-- Bu SQL'i çalıştırarak tüm paketleri ekleyebilirsiniz

USE afganistan_ilanlar;

-- Önce mevcut paketler tablosunu kaldır (eğer varsa)
DROP TABLE IF EXISTS paketler;

-- Yeni paketler tablosunu oluştur
CREATE TABLE paketler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad VARCHAR(100) NOT NULL,
  ad_dari VARCHAR(100),
  store_level ENUM('basic', 'pro', 'elite') NOT NULL,
  sure_ay INT NOT NULL,
  fiyat DECIMAL(10, 2) NOT NULL,
  
  -- Limitler
  product_limit INT DEFAULT 50,
  category_limit INT DEFAULT 1,
  
  -- Öncelik
  listing_priority INT DEFAULT 0,
  search_weight DECIMAL(3,1) DEFAULT 1.0,
  
  -- Özellikler
  ozellikler JSON,
  analytics_access VARCHAR(50) DEFAULT 'basic',
  theme VARCHAR(50) DEFAULT 'default',
  listing_discount INT DEFAULT 0,
  bulk_upload BOOLEAN DEFAULT FALSE,
  support_level VARCHAR(50) DEFAULT 'normal',
  
  -- Vitrin
  homepage_vip_slot BOOLEAN DEFAULT FALSE,
  weekly_auto_feature BOOLEAN DEFAULT FALSE,
  monthly_ad_credit DECIMAL(10,2) DEFAULT 0,
  
  -- Ekstra
  video_upload BOOLEAN DEFAULT FALSE,
  custom_url BOOLEAN DEFAULT FALSE,
  custom_branding BOOLEAN DEFAULT FALSE,
  verification_badge BOOLEAN DEFAULT FALSE,
  
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_store_level (store_level),
  INDEX idx_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paket verilerini ekle
INSERT INTO paketler (
  ad, ad_dari, store_level, sure_ay, fiyat,
  product_limit, category_limit, listing_priority, search_weight,
  analytics_access, theme, listing_discount, bulk_upload, support_level,
  homepage_vip_slot, weekly_auto_feature, monthly_ad_credit,
  video_upload, custom_url, custom_branding, verification_badge, ozellikler
) VALUES
-- BASIC STORE - FREE
('Basic Store', 'بسته عادی', 'basic', 1, 0.00,
 50, 1, 0, 1.0,
 'basic', 'default', 0, 0, 'normal',
 0, 0, 0,
 0, 0, 0, 0,
 JSON_OBJECT(
   'aciklama', 'بسته عادی برای فروشندگان تازه‌کار و شروع سریع در بازار وطن طراحی شده است. با امکانات ضروری، محدودیت مناسب و مدیریت آسان، می‌توانید محصولات خود را بدون هزینه بالا به خریداران معرفی کنید.',
   'ozellikler', JSON_ARRAY(
     'رایگان - بدون هزینه',
     'محدودیت ۵۰ محصول',
     'فقط ۱ دسته‌بندی',
     'لیست استاندارد',
     'تم پیش‌فرض',
     'آمار پایه',
     'پیام‌رسانی عادی'
   )
 )),

-- PRO STORE - Monthly (350 AFN)
('Pro Store - Monthly', 'بسته پرو - ماهانه', 'pro', 1, 350.00,
 200, 3, 1, 1.5,
 'intermediate', 'customizable', 25, 1, 'fast',
 0, 0, 0,
 0, 0, 0, 0,
 JSON_OBJECT(
   'aciklama', 'بسته پرو مخصوص فروشندگان حرفه‌ای است که می‌خواهند دیده‌شدن بیشتری داشته باشند. با محدودیت‌های بالاتر، ابزارهای تحلیل پیشرفته، طراحی قابل شخصی‌سازی و اولویت در نمایش محصولات، فروش شما به‌طور قابل توجهی افزایش می‌یابد.',
   'ozellikler', JSON_ARRAY(
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
     'پشتیبانی سریع (۱۲ ساعت)'
   )
 )),

-- PRO STORE - 3 Months (735 AFN = 30% OFF)
('Pro Store - 3 Months', 'بسته پرو - ۳ ماهه', 'pro', 3, 735.00,
 200, 3, 1, 1.5,
 'intermediate', 'customizable', 25, 1, 'fast',
 0, 0, 0,
 0, 0, 0, 0,
 JSON_OBJECT(
   'aciklama', 'بسته پرو مخصوص فروشندگان حرفه‌ای است که می‌خواهند دیده‌شدن بیشتری داشته باشند. با محدودیت‌های بالاتر، ابزارهای تحلیل پیشرفته، طراحی قابل شخصی‌سازی و اولویت در نمایش محصولات، فروش شما به‌طور قابل توجهی افزایش می‌یابد.',
   'ozellikler', JSON_ARRAY(
     'همه امکانات Pro',
     '۳۰٪ تخفیف قیمت',
     'صرفه‌جویی ۳۱۵ افغانی',
     'قیمت عادی: ۱٬۰۵۰ افغانی',
     'قیمت با تخفیف: ۷۳۵ افغانی'
   )
 )),

-- ELITE STORE - Monthly (570 AFN)
('Elite Store - Monthly', 'بسته پریمیوم - ماهانه', 'elite', 1, 570.00,
 999999, 999, 2, 2.0,
 'advanced', 'premium', 0, 1, 'vip',
 1, 1, 500,
 1, 1, 1, 1,
 JSON_OBJECT(
   'aciklama', 'بسته پریمیوم سطحی ویژه برای فروشندگان بزرگ و برندها است. با امکانات نامحدود، ویترین اختصاصی، تحلیل‌های پیشرفته، پشتیبانی VIP و ابزارهای حرفه‌ای، فروشگاه شما به یک فروشگاه واقعی و قدرتمند آنلاین تبدیل می‌شود.',
   'ozellikler', JSON_ARRAY(
     'محصول نامحدود',
     'دسته‌بندی نامحدود',
     'ویترین ثابت صفحه اصلی',
     'بالاترین اولویت جستجو (x۲)',
     'تبلیغ هفتگی رایگان',
     '۵۰۰ افغانی اعتبار تبلیغاتی',
     'قالب اختصاصی Premium',
     'آدرس اختصاصی مغازه',
     'تحلیل‌های حرفه‌ای (Heatmap)',
     'ارسال پیام دسته‌ای',
     'اتوماسیون کامل (موجودی، قیمت)',
     'لوگو و برندینگ کامل',
     'نشان تأیید کسب‌وکار',
     'ویدیو نامحدود',
     'نمایش تخفیف محصولات',
     'پشتیبانی VIP (۲۴/۷)'
   )
 )),

-- ELITE STORE - 3 Months (1197 AFN = 30% OFF)
('Elite Store - 3 Months', 'بسته پریمیوم - ۳ ماهه', 'elite', 3, 1197.00,
 999999, 999, 2, 2.0,
 'advanced', 'premium', 0, 1, 'vip',
 1, 1, 1500,
 1, 1, 1, 1,
 JSON_OBJECT(
   'aciklama', 'بسته پریمیوم سطحی ویژه برای فروشندگان بزرگ و برندها است. با امکانات نامحدود، ویترین اختصاصی، تحلیل‌های پیشرفته، پشتیبانی VIP و ابزارهای حرفه‌ای، فروشگاه شما به یک فروشگاه واقعی و قدرتمند آنلاین تبدیل می‌شود.',
   'ozellikler', JSON_ARRAY(
     'همه امکانات Elite',
     '۳۰٪ تخفیف قیمت',
     'صرفه‌جویی ۵۱۳ افغانی',
     'قیمت عادی: ۱٬۷۱۰ افغانی',
     'قیمت با تخفیف: ۱٬۱۹۷ افغانی',
     '۱٬۵۰۰ افغانی اعتبار تبلیغاتی'
   )
 ));

-- Paketleri kontrol et
SELECT 
  id,
  ad_dari,
  store_level,
  sure_ay,
  fiyat,
  product_limit,
  category_limit
FROM paketler
ORDER BY 
  CASE store_level 
    WHEN 'basic' THEN 1
    WHEN 'pro' THEN 2
    WHEN 'elite' THEN 3
  END,
  sure_ay;


