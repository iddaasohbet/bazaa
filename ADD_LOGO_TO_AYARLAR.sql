-- Logo Ayarlarını Mevcut site_ayarlar Tablosuna Ekle

-- Header logo ayarı ekle (eğer yoksa)
INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama)
SELECT 'site_header_logo', '', 'logo', 'لوگوی Header (Base64)'
WHERE NOT EXISTS (
    SELECT 1 FROM site_ayarlar WHERE anahtar = 'site_header_logo'
);

-- Footer logo ayarı ekle (eğer yoksa)
INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama)
SELECT 'site_footer_logo', '', 'logo', 'لوگوی Footer (Base64)'
WHERE NOT EXISTS (
    SELECT 1 FROM site_ayarlar WHERE anahtar = 'site_footer_logo'
);

-- Kontrol sorgusu
SELECT * FROM site_ayarlar WHERE kategori = 'logo';


