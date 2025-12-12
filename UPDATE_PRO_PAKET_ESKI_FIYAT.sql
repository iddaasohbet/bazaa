-- PRO پکیج‌های به قدیمی قیمت افزودن

-- مثال: اگر PRO پکیج فعلی 500 AFN است، قیمت قدیمی را 700 AFN قرار دهید (28٪ تخفیف)
-- شما می‌توانید این مقادیر را بر اساس استراتژی قیمت‌گذاری خود تغییر دهید

-- PRO پکیج 1 ماهه
UPDATE paketler 
SET eski_fiyat = 700 
WHERE store_level = 'pro' 
AND sure_ay = 1 
AND fiyat = 500;

-- PRO پکیج 3 ماهه
UPDATE paketler 
SET eski_fiyat = 1800 
WHERE store_level = 'pro' 
AND sure_ay = 3 
AND fiyat = 1350;

-- PRO پکیج 6 ماهه
UPDATE paketler 
SET eski_fiyat = 3300 
WHERE store_level = 'pro' 
AND sure_ay = 6 
AND fiyat = 2500;

-- PRO پکیج 12 ماهه
UPDATE paketler 
SET eski_fiyat = 6000 
WHERE store_level = 'pro' 
AND sure_ay = 12 
AND fiyat = 4500;

-- همه PRO پکیج‌ها را نمایش دهید تا نتیجه را ببینید
SELECT 
    id,
    ad_dari,
    store_level,
    sure_ay,
    eski_fiyat,
    fiyat,
    CASE 
        WHEN eski_fiyat IS NOT NULL AND eski_fiyat > fiyat 
        THEN ROUND(((eski_fiyat - fiyat) / eski_fiyat) * 100, 0)
        ELSE 0 
    END as تخفیف_درصد
FROM paketler 
WHERE store_level = 'pro'
ORDER BY sure_ay;
