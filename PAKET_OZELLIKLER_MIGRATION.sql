-- Paketler tablosuna ozellikler kolonu ekleme
-- Bu migration dosyasını veritabanında çalıştırın

-- 1. Ozellikler kolonunu ekle (eğer yoksa)
ALTER TABLE paketler 
ADD COLUMN IF NOT EXISTS ozellikler JSON DEFAULT NULL
COMMENT 'Paket özellikleri (açıklama ve özellik listesi)';

-- 2. Mevcut paketlere örnek özellikler ekle (opsiyonel)
UPDATE paketler 
SET ozellikler = JSON_OBJECT(
  'aciklama', 'پکیج پایه برای فروشندگان جدید و کسب‌وکارهای کوچک که می‌خواهند به سرعت شروع کنند.',
  'ozellikler', JSON_ARRAY(
    'تا 50 محصول',
    '1 دسته‌بندی',
    'پشتیبانی پایه',
    'بدون هزینه اضافی'
  )
)
WHERE store_level = 'basic' AND ozellikler IS NULL;

UPDATE paketler 
SET ozellikler = JSON_OBJECT(
  'aciklama', 'پکیج حرفه‌ای برای فروشندگان بزرگ و کسب‌وکارهای در حال رشد. با امکانات نامحدود، ویترین اختصاصی، تحلیل‌های پیشرفته و پشتیبانی VIP.',
  'ozellikler', JSON_ARRAY(
    'محصولات نامحدود',
    'دسته‌بندی نامحدود',
    'ویترین اختصاصی',
    'تحلیل پیشرفته',
    'پشتیبانی VIP',
    'به یک فروشگاه تبدیل می‌شود، فروش شما'
  )
)
WHERE store_level = 'pro' AND ozellikler IS NULL;

UPDATE paketler 
SET ozellikler = JSON_OBJECT(
  'aciklama', 'پکیج ویژه و حرفه‌ای برای فروشندگان بزرگ و کسب‌وکارهای حرفه‌ای. با امکانات حرفه‌ای، تحلیل پیشرفته و پشتیبانی اولویت‌دار.',
  'ozellikler', JSON_ARRAY(
    'محصولات نامحدود',
    'دسته‌بندی‌های متعدد',
    'ویترین ویژه',
    'آمار تفصیلی',
    'پشتیبانی اولویت‌دار'
  )
)
WHERE store_level = 'elite' AND ozellikler IS NULL;

-- 3. İndex ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_paketler_ozellikler 
ON paketler((CAST(ozellikler AS CHAR(255))));

SELECT 'Migration completed successfully!' AS status;

