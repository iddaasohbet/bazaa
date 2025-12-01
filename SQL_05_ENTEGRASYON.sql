-- ادغام (Entegrasyon)
-- Harici servis entegrasyonları

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('google_analytics_id', '', 'entegrasyon', 'Google Analytics ID'),
('google_maps_api_key', '', 'entegrasyon', 'Google Maps API Key')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

