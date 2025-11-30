-- Para Birimi Sistemi - AFN ve USD Desteği
-- Bu migration ilanlar tablosuna para birimi alanlarını ekler

USE afganistan_ilanlar;

-- Para birimi alanlarını ekle
ALTER TABLE ilanlar
ADD COLUMN para_birimi ENUM('AFN', 'USD') DEFAULT 'AFN' AFTER fiyat_tipi,
ADD COLUMN fiyat_usd DECIMAL(15, 2) NULL AFTER para_birimi;

-- Index ekle
ALTER TABLE ilanlar ADD INDEX idx_para_birimi (para_birimi);

-- Mevcut ilanları güncelle (tümü AFN olarak ayarla)
UPDATE ilanlar SET para_birimi = 'AFN' WHERE para_birimi IS NULL;

SELECT 'Para birimi migration başarıyla tamamlandı!' as sonuc;


