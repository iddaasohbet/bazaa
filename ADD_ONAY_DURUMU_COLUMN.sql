-- ONAY DURUMU KOLONLARI EKLE
-- İlanlar ve mağazalar için onay durumu takibi

-- İlanlar tablosuna onay_durumu ekle
ALTER TABLE ilanlar 
ADD COLUMN IF NOT EXISTS onay_durumu ENUM('beklemede', 'onaylandi', 'reddedildi') DEFAULT 'onaylandi' AFTER aktif;

-- Mevcut tüm ilanları onaylı yap
UPDATE ilanlar SET onay_durumu = 'onaylandi' WHERE onay_durumu IS NULL OR onay_durumu = '';

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_onay_durumu ON ilanlar(onay_durumu);

-- Mağazalar tablosuna onay_durumu ekle
ALTER TABLE magazalar 
ADD COLUMN IF NOT EXISTS onay_durumu ENUM('beklemede', 'onaylandi', 'reddedildi') DEFAULT 'onaylandi' AFTER aktif;

-- Mevcut tüm mağazaları onaylı yap
UPDATE magazalar SET onay_durumu = 'onaylandi' WHERE onay_durumu IS NULL OR onay_durumu = '';

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_magaza_onay ON magazalar(onay_durumu);

SELECT '✅ Onay durumu kolonları başarıyla eklendi!' as status;


