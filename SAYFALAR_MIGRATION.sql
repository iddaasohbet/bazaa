-- Sayfalar Tablosu - SSS, Hakkımızda, Güvenli Alışveriş, Nasıl Çalışır
-- Admin panelden düzenlenebilir sayfalar için

USE afganistan_ilanlar;

-- Sayfalar tablosu
CREATE TABLE IF NOT EXISTS sayfalar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  baslik VARCHAR(255) NOT NULL,
  baslik_dari VARCHAR(255),
  icerik LONGTEXT,
  icerik_json JSON,
  aktif BOOLEAN DEFAULT TRUE,
  sira INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan sayfaları ekle
INSERT INTO sayfalar (slug, baslik, baslik_dari, icerik, aktif) VALUES
('sss', 'Sıkça Sorulan Sorular', 'سوالات متداول', '', TRUE),
('hakkimizda', 'Hakkımızda', 'درباره ما', '', TRUE),
('guvenli-alisveris', 'Güvenli Alışveriş', 'خرید امن', '', TRUE),
('nasil-calisir', 'Nasıl Çalışır', 'چگونه کار می‌کند', '', TRUE);

SELECT 'Sayfalar tablosu başarıyla oluşturuldu!' as sonuc;







