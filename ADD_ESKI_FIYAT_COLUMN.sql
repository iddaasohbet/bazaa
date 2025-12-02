-- Paketler tablosuna eski_fiyat kolonu ekleme
-- İndirimli fiyat gösterimi için

-- 1. Eski fiyat kolonunu ekle
ALTER TABLE paketler 
ADD COLUMN IF NOT EXISTS eski_fiyat DECIMAL(10,2) DEFAULT NULL
COMMENT 'Eski fiyat (indirimden önceki fiyat) - üzeri çizili gösterilir';

-- 2. Mevcut 3 aylık paketlere eski fiyat ekle (otomatik hesaplama - %30 indirim)
UPDATE paketler 
SET eski_fiyat = ROUND(fiyat / 0.7, 2)
WHERE sure_ay = 3 AND eski_fiyat IS NULL AND fiyat > 0;

-- 3. Kontrol sorgusu
SELECT 
  id,
  ad_dari,
  fiyat as 'Güncel Fiyat',
  eski_fiyat as 'Eski Fiyat',
  CASE 
    WHEN eski_fiyat IS NOT NULL AND eski_fiyat > fiyat 
    THEN CONCAT(ROUND(((eski_fiyat - fiyat) / eski_fiyat) * 100), '%')
    ELSE 'İndirim Yok'
  END as 'İndirim Yüzdesi',
  sure_ay as 'Süre (Ay)',
  store_level as 'Level'
FROM paketler
ORDER BY store_level, sure_ay;

SELECT '✅ Eski fiyat kolonu başarıyla eklendi!' AS durum;







