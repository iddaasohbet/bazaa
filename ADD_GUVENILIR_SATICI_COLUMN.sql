-- مغازه‌ها جدول به اضافه فروشنده معتبر ستون
ALTER TABLE magazalar ADD COLUMN IF NOT EXISTS guvenilir_satici BOOLEAN DEFAULT FALSE;

-- موجود مغازه‌های برای ستون این به‌روزرسانی
UPDATE magazalar SET guvenilir_satici = FALSE WHERE guvenilir_satici IS NULL;

-- پایه‌ای مغازه‌های به فروشنده معتبر روزت دادن
-- (اختیاری - اگر میخواهید پریمیوم مغازه‌های را خودکار معتبر کنید)
-- UPDATE magazalar SET guvenilir_satici = TRUE WHERE store_level = 'elite';







