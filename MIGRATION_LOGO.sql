-- Logo Ayarları Migration
-- Bu script'i database'de çalıştırın

-- Site header logo ayarı ekle (eğer yoksa)
INSERT INTO ayarlar (anahtar, deger, kategori, aciklama)
SELECT 'site_header_logo', '', 'logo', 'Header Logo (Base64)'
WHERE NOT EXISTS (
    SELECT 1 FROM ayarlar WHERE anahtar = 'site_header_logo'
);

-- Site footer logo ayarı ekle (eğer yoksa)
INSERT INTO ayarlar (anahtar, deger, kategori, aciklama)
SELECT 'site_footer_logo', '', 'logo', 'Footer Logo (Base64)'
WHERE NOT EXISTS (
    SELECT 1 FROM ayarlar WHERE anahtar = 'site_footer_logo'
);

-- Kontrol sorgusu
SELECT * FROM ayarlar WHERE kategori = 'logo';



