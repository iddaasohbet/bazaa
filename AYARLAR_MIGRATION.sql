-- Site Ayarlari Tablosu
CREATE TABLE IF NOT EXISTS site_ayarlar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  anahtar VARCHAR(100) UNIQUE NOT NULL,
  deger TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  kategori VARCHAR(50) DEFAULT 'genel',
  aciklama TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayilan ayarlari ekle
INSERT INTO site_ayarlar (anahtar, deger, kategori, aciklama) VALUES
('site_adi', 'WatanBazaare', 'genel', 'Site adi'),
('site_slogan', 'بازار وطن - افغانستان کې د اعلاناتو او خرید و فروخت ويب ساېټ', 'genel', 'Site slogani'),
('site_aciklama', 'افغانستان کې د اعلاناتو، خرید و فروخت او خدماتو لپاره غوره ويب ساېټ', 'genel', 'Site aciklamasi'),
('site_anahtar_kelimeler', 'افغانستان, اعلانات, خرید و فروخت, بازار', 'genel', 'SEO anahtar kelimeler'),
('site_email', 'info@watanbazaare.com', 'iletisim', 'Iletisim e-posta'),
('site_telefon', '+93 700 000 000', 'iletisim', 'Iletisim telefon'),
('site_adres', 'کابل، افغانستان', 'iletisim', 'Sirket adresi'),
('facebook_url', '', 'sosyal_medya', 'Facebook sayfa linki'),
('twitter_url', '', 'sosyal_medya', 'Twitter profil linki'),
('instagram_url', '', 'sosyal_medya', 'Instagram profil linki'),
('youtube_url', '', 'sosyal_medya', 'YouTube kanal linki'),
('ilan_onay_gerektir', '0', 'sistem', 'Ilanlar yayinlanmadan once onay gerektirsin mi? (0: Hayir, 1: Evet)'),
('kayit_aktif', '1', 'sistem', 'Kullanici kaydi acik mi? (0: Hayir, 1: Evet)'),
('magaza_acma_aktif', '1', 'sistem', 'Magaza acma aktif mi? (0: Hayir, 1: Evet)'),
('varsayilan_ilan_suresi', '30', 'sistem', 'Ilanlarin varsayilan yayin suresi (gun)'),
('maksimum_resim_sayisi', '10', 'sistem', 'Ilan basina maksimum resim sayisi'),
('google_analytics_id', '', 'entegrasyon', 'Google Analytics ID'),
('google_maps_api_key', '', 'entegrasyon', 'Google Maps API Key'),
('smtp_host', '', 'email', 'SMTP sunucu adresi'),
('smtp_port', '587', 'email', 'SMTP port'),
('smtp_kullanici', '', 'email', 'SMTP kullanici adi'),
('smtp_sifre', '', 'email', 'SMTP sifre'),
('bakim_modu', '0', 'sistem', 'Bakim modu aktif mi? (0: Hayir, 1: Evet)'),
('bakim_mesaji', 'Sistem bakimda. Lutfen daha sonra tekrar deneyin.', 'sistem', 'Bakim modu mesaji')
ON DUPLICATE KEY UPDATE deger=deger;

