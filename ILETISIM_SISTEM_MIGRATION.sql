-- İLETİŞİM SİSTEMİ TABLOLARI
-- Admin panelden iletişim sayfası yönetimi ve mesaj takibi

-- 1. İletişim Ayarları Tablosu
CREATE TABLE IF NOT EXISTS iletisim_ayarlari (
  id INT PRIMARY KEY AUTO_INCREMENT,
  telefon VARCHAR(50),
  telefon2 VARCHAR(50),
  email VARCHAR(100),
  email2 VARCHAR(100),
  adres_tr TEXT,
  adres_dari TEXT,
  calisma_saatleri JSON, -- [{"gun": "شنبه - پنج‌شنبه", "saat": "08:00 - 20:00"}, ...]
  sosyal_medya JSON, -- {"facebook": "url", "instagram": "url", ...}
  harita_embed TEXT,
  istatistikler JSON, -- {"kullanicilar": "100K+", "ilanlar": "50K+", ...}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan kayıt ekle
INSERT INTO iletisim_ayarlari (
  telefon, 
  email, 
  adres_tr, 
  adres_dari,
  calisma_saatleri,
  istatistikler
) VALUES (
  '+93 700 000 000',
  'info@bazaarewatan.com',
  'Kabil, Afganistan',
  'کابل، افغانستان',
  '[{"gun":"شنبه - پنج‌شنبه","saat":"08:00 - 20:00"},{"gun":"جمعه","saat":"10:00 - 18:00"},{"gun":"تعطیلات رسمی","saat":"بسته"}]',
  '{"kullanicilar":"100K+","ilanlar":"50K+","destek":"24/7","cevap_suresi":"< 2 ساعت"}'
) ON DUPLICATE KEY UPDATE id=id;

-- 2. İletişim Mesajları Tablosu
CREATE TABLE IF NOT EXISTS iletisim_mesajlari (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ad VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefon VARCHAR(50),
  konu VARCHAR(200) NOT NULL,
  mesaj TEXT NOT NULL,
  durum ENUM('yeni', 'okundu', 'cevaplanmis', 'kapandi') DEFAULT 'yeni',
  admin_notu TEXT,
  ip_adresi VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_durum (durum),
  INDEX idx_email (email),
  INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. FAQ Tablosu (Sık Sorulan Sorular)
CREATE TABLE IF NOT EXISTS iletisim_faq (
  id INT PRIMARY KEY AUTO_INCREMENT,
  soru_tr TEXT NOT NULL,
  soru_dari TEXT NOT NULL,
  cevap_tr TEXT NOT NULL,
  cevap_dari TEXT NOT NULL,
  sira INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_sira (sira),
  INDEX idx_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan FAQ'ler
INSERT INTO iletisim_faq (soru_tr, soru_dari, cevap_tr, cevap_dari, sira) VALUES
('Nasıl ilan veririm?', 'چگونه آگهی ثبت کنم؟', 
 'İlan Ver butonuna tıklayın, formu doldurun ve fotoğraflarınızı yükleyin.', 
 'روی دکمه "ثبت آگهی" کلیک کنید، فرم را پر کنید و عکس‌ها را آپلود کنید. آگهی شما پس از تایید منتشر می‌شود.',
 1),
('İlan vermek ücretsiz mi?', 'آیا ثبت آگهی رایگان است؟',
 'Evet! İlan vermek tamamen ücretsizdir. Premium paketlerle ilanınızı öne çıkarabilirsiniz.',
 'بله! ثبت آگهی کاملاً رایگان است. اما می‌توانید با پکیج‌های پریمیوم، آگهی خود را ویژه کنید.',
 2),
('Nasıl mağaza açarım?', 'چگونه مغازه باز کنم؟',
 'Mağaza Aç bölümüne gidin, bilgilerinizi girin ve paket seçin. Basic paket ücretsizdir!',
 'روی "افتتاح مغازه" کلیک کنید، اطلاعات را وارد کنید و پکیج مناسب را انتخاب کنید. مغازه Basic رایگان است!',
 3),
('Ne kadar sürede cevap alırım?', 'چند وقت طول می‌کشد تا پاسخ بگیرم؟',
 'Destek ekibimiz genellikle 2 saat içinde (çalışma saatlerinde) yanıt verir.',
 'تیم پشتیبانی ما معمولاً در کمتر از ۲ ساعت (در ساعات کاری) پاسخ می‌دهد. در مواقع اضطراری تماس بگیرید.',
 4);

SELECT '✅ İletişim sistem tabloları başarıyla oluşturuldu!' as status;

