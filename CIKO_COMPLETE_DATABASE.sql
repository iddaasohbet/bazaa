-- Bazaar Watan - Eksiksiz Veritabanı Kurulumu
-- Domain: cihatcengiz.com
-- Veritabanı: cihatcengiz_baza
-- NOT: Veritabanı cPanel'den önceden oluşturulmuştur

-- Veritabanını kullan
USE cihatcengiz_baza;

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS kategoriler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad VARCHAR(100) NOT NULL,
  ad_dari VARCHAR(100),
  slug VARCHAR(100) NOT NULL UNIQUE,
  aciklama TEXT,
  ikon VARCHAR(255),
  sira INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- İller tablosu (Afganistan şehirleri)
CREATE TABLE IF NOT EXISTS iller (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad VARCHAR(100) NOT NULL,
  ad_dari VARCHAR(100),
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS kullanicilar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefon VARCHAR(20),
  sifre VARCHAR(255) NOT NULL,
  rol ENUM('user', 'admin') DEFAULT 'user',
  profil_resmi VARCHAR(255),
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mağazalar tablosu (ilanlar tablosundan önce oluşturulmalı)
CREATE TABLE IF NOT EXISTS magazalar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kullanici_id INT NOT NULL,
  ad VARCHAR(255) NOT NULL,
  ad_dari VARCHAR(255),
  slug VARCHAR(255) NOT NULL UNIQUE,
  custom_url VARCHAR(255) UNIQUE,
  aciklama TEXT,
  logo VARCHAR(255),
  kapak_resmi VARCHAR(255),
  banner VARCHAR(255),
  tema_renk VARCHAR(50) DEFAULT '#3B82F6',
  telefon VARCHAR(20),
  adres TEXT,
  il_id INT,
  store_level ENUM('basic', 'pro', 'elite') DEFAULT 'basic',
  paket_baslangic TIMESTAMP NULL,
  paket_bitis TIMESTAMP NULL,
  product_limit INT DEFAULT 50,
  category_limit INT DEFAULT 1,
  listing_priority INT DEFAULT 0,
  search_weight DECIMAL(3,1) DEFAULT 1.0,
  analytics_access ENUM('basic', 'intermediate', 'advanced') DEFAULT 'basic',
  theme ENUM('default', 'customizable', 'premium') DEFAULT 'default',
  listing_discount INT DEFAULT 0,
  bulk_upload BOOLEAN DEFAULT FALSE,
  support_level ENUM('normal', 'fast', 'vip') DEFAULT 'normal',
  homepage_vip_slot BOOLEAN DEFAULT FALSE,
  weekly_auto_feature BOOLEAN DEFAULT FALSE,
  monthly_ad_credit DECIMAL(10,2) DEFAULT 0,
  video_upload BOOLEAN DEFAULT FALSE,
  custom_branding BOOLEAN DEFAULT FALSE,
  verification_status ENUM('none', 'basic', 'business') DEFAULT 'none',
  verification_badge BOOLEAN DEFAULT FALSE,
  aktif BOOLEAN DEFAULT TRUE,
  onay_durumu ENUM('beklemede', 'onaylandi', 'reddedildi') DEFAULT 'beklemede',
  goruntulenme INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  FOREIGN KEY (il_id) REFERENCES iller(id) ON DELETE SET NULL,
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_slug (slug),
  INDEX idx_store_level (store_level),
  INDEX idx_aktif (aktif, onay_durumu),
  INDEX idx_priority (listing_priority, search_weight)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- İlanlar tablosu
CREATE TABLE IF NOT EXISTS ilanlar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  baslik VARCHAR(255) NOT NULL,
  aciklama TEXT,
  fiyat DECIMAL(15, 2),
  eski_fiyat DECIMAL(15, 2) NULL,
  indirim_yuzdesi INT DEFAULT 0,
  fiyat_tipi ENUM('fixed', 'negotiable') DEFAULT 'negotiable',
  kategori_id INT NOT NULL,
  il_id INT,
  kullanici_id INT NOT NULL,
  magaza_id INT,
  durum ENUM('yeni', 'az_kullanilmis', 'kullanilmis', 'hasarli') DEFAULT 'kullanilmis',
  stok_miktari INT DEFAULT 1,
  video_url VARCHAR(500),
  ana_resim VARCHAR(255),
  goruntulenme INT DEFAULT 0,
  favoriler INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  onecikan BOOLEAN DEFAULT FALSE,
  onecikan_sira INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE RESTRICT,
  FOREIGN KEY (il_id) REFERENCES iller(id) ON DELETE SET NULL,
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  FOREIGN KEY (magaza_id) REFERENCES magazalar(id) ON DELETE SET NULL,
  INDEX idx_kategori (kategori_id),
  INDEX idx_il (il_id),
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_magaza (magaza_id),
  INDEX idx_aktif (aktif),
  INDEX idx_onecikan (onecikan, onecikan_sira),
  INDEX idx_created (created_at),
  INDEX idx_indirim (indirim_yuzdesi),
  FULLTEXT INDEX idx_fulltext (baslik, aciklama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- İlan resimleri tablosu
CREATE TABLE IF NOT EXISTS ilan_resimleri (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ilan_id INT NOT NULL,
  resim_url VARCHAR(255) NOT NULL,
  sira INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ilan_id) REFERENCES ilanlar(id) ON DELETE CASCADE,
  INDEX idx_ilan (ilan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Favoriler tablosu
CREATE TABLE IF NOT EXISTS favoriler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kullanici_id INT NOT NULL,
  ilan_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  FOREIGN KEY (ilan_id) REFERENCES ilanlar(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favori (kullanici_id, ilan_id),
  INDEX idx_kullanici (kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mağaza özellikleri tablosu
CREATE TABLE IF NOT EXISTS store_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  feature_key VARCHAR(100) NOT NULL,
  feature_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES magazalar(id) ON DELETE CASCADE,
  UNIQUE KEY unique_store_feature (store_id, feature_key),
  INDEX idx_store (store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mağaza analitik tablosu
CREATE TABLE IF NOT EXISTS store_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  date DATE NOT NULL,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  favorites INT DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  weekly_report JSON,
  monthly_report JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES magazalar(id) ON DELETE CASCADE,
  UNIQUE KEY unique_store_date (store_id, date),
  INDEX idx_store (store_id),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mağaza otomasyon tablosu
CREATE TABLE IF NOT EXISTS store_automation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  auto_feature_enabled BOOLEAN DEFAULT FALSE,
  auto_stock_alert BOOLEAN DEFAULT FALSE,
  auto_price_update BOOLEAN DEFAULT FALSE,
  auto_sort BOOLEAN DEFAULT FALSE,
  stock_alert_threshold INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES magazalar(id) ON DELETE CASCADE,
  UNIQUE KEY unique_store (store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paket tanımları tablosu
CREATE TABLE IF NOT EXISTS paketler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad VARCHAR(100) NOT NULL,
  ad_dari VARCHAR(100),
  store_level ENUM('basic', 'pro', 'elite') NOT NULL,
  sure_ay INT NOT NULL,
  fiyat DECIMAL(10, 2) NOT NULL,
  product_limit INT DEFAULT 50,
  category_limit INT DEFAULT 1,
  listing_priority INT DEFAULT 0,
  search_weight DECIMAL(3,1) DEFAULT 1.0,
  ozellikler JSON,
  analytics_access VARCHAR(50) DEFAULT 'basic',
  theme VARCHAR(50) DEFAULT 'default',
  listing_discount INT DEFAULT 0,
  bulk_upload BOOLEAN DEFAULT FALSE,
  support_level VARCHAR(50) DEFAULT 'normal',
  homepage_vip_slot BOOLEAN DEFAULT FALSE,
  weekly_auto_feature BOOLEAN DEFAULT FALSE,
  monthly_ad_credit DECIMAL(10,2) DEFAULT 0,
  video_upload BOOLEAN DEFAULT FALSE,
  custom_url BOOLEAN DEFAULT FALSE,
  custom_branding BOOLEAN DEFAULT FALSE,
  verification_badge BOOLEAN DEFAULT FALSE,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_store_level (store_level),
  INDEX idx_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vitrin tablosu
CREATE TABLE IF NOT EXISTS vitrinler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ilan_id INT NOT NULL,
  magaza_id INT,
  vitrin_turu ENUM('anasayfa', 'kategori', 'arama', 'magaza') NOT NULL,
  kategori_id INT,
  sira INT DEFAULT 0,
  baslangic_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bitis_tarihi TIMESTAMP NOT NULL,
  aktif BOOLEAN DEFAULT TRUE,
  goruntulenme INT DEFAULT 0,
  tiklanma INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ilan_id) REFERENCES ilanlar(id) ON DELETE CASCADE,
  FOREIGN KEY (magaza_id) REFERENCES magazalar(id) ON DELETE CASCADE,
  FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE SET NULL,
  INDEX idx_ilan (ilan_id),
  INDEX idx_magaza (magaza_id),
  INDEX idx_vitrin_turu (vitrin_turu),
  INDEX idx_kategori (kategori_id),
  INDEX idx_aktif (aktif, bitis_tarihi),
  INDEX idx_sira (sira)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reklamlar tablosu
CREATE TABLE IF NOT EXISTS reklamlar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  baslik VARCHAR(255) NOT NULL,
  aciklama TEXT,
  reklam_turu ENUM('banner_header', 'banner_kategori', 'banner_arama', 'sponsorlu_magaza', 'sponsorlu_urun') NOT NULL,
  banner_url VARCHAR(255),
  hedef_url VARCHAR(255),
  ilan_id INT,
  magaza_id INT,
  kategori_id INT,
  konum VARCHAR(100),
  boyut VARCHAR(50),
  baslangic_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bitis_tarihi TIMESTAMP NOT NULL,
  butce DECIMAL(10, 2),
  tiklanma INT DEFAULT 0,
  goruntulenme INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  onay_durumu ENUM('beklemede', 'onaylandi', 'reddedildi') DEFAULT 'beklemede',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ilan_id) REFERENCES ilanlar(id) ON DELETE SET NULL,
  FOREIGN KEY (magaza_id) REFERENCES magazalar(id) ON DELETE SET NULL,
  FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE SET NULL,
  INDEX idx_reklam_turu (reklam_turu),
  INDEX idx_kategori (kategori_id),
  INDEX idx_aktif (aktif, onay_durumu, bitis_tarihi),
  INDEX idx_konum (konum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ödemeler tablosu
CREATE TABLE IF NOT EXISTS odemeler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kullanici_id INT NOT NULL,
  odeme_turu ENUM('paket', 'vitrin', 'reklam', 'urun_yukseltme') NOT NULL,
  iliskili_id INT,
  tutar DECIMAL(10, 2) NOT NULL,
  para_birimi VARCHAR(10) DEFAULT 'AFN',
  odeme_yontemi VARCHAR(50),
  odeme_durumu ENUM('beklemede', 'tamamlandi', 'iptal', 'iade') DEFAULT 'beklemede',
  transaction_id VARCHAR(255),
  aciklama TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_odeme_turu (odeme_turu),
  INDEX idx_odeme_durumu (odeme_durumu),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ürün yükseltme geçmişi tablosu
CREATE TABLE IF NOT EXISTS urun_yukseltme_gecmisi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ilan_id INT NOT NULL,
  kullanici_id INT NOT NULL,
  yukseltme_turu ENUM('vitrin', 'onecikan', 'kategori_ust') NOT NULL,
  odeme_id INT,
  baslangic_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bitis_tarihi TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ilan_id) REFERENCES ilanlar(id) ON DELETE CASCADE,
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  FOREIGN KEY (odeme_id) REFERENCES odemeler(id) ON DELETE SET NULL,
  INDEX idx_ilan (ilan_id),
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_yukseltme_turu (yukseltme_turu),
  INDEX idx_tarih (bitis_tarihi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- VERİ EKLEME BÖLÜMLERİ
-- ================================================

-- Admin kullanıcısı oluştur
-- Şifre: admin123 (production'da değiştirilmeli!)
INSERT INTO kullanicilar (ad, email, sifre, rol, aktif) VALUES 
('Admin', 'admin@cihatcengiz.com', '$2a$10$6qYqH5ZN5g5z5g5z5g5z5.KjH5z5g5z5g5z5g5z5g5z5g5z5g5z5g5', 'admin', TRUE)
ON DUPLICATE KEY UPDATE ad=ad;

-- Örnek kategoriler
INSERT INTO kategoriler (ad, ad_dari, slug, aciklama, ikon, sira) VALUES
('Araçlar', 'وسایل نقلیه', 'araclar', 'Otomobil, motosiklet ve diğer araçlar', 'car', 1),
('Emlak', 'املاک', 'emlak', 'Ev, arsa ve ticari emlak', 'home', 2),
('Elektronik', 'الکترونیک', 'elektronik', 'Telefon, bilgisayar, TV ve elektronik eşyalar', 'smartphone', 3),
('Ev Eşyaları', 'لوازم منزل', 'ev-esyalari', 'Mobilya, beyaz eşya ve ev dekorasyonu', 'sofa', 4),
('Giyim', 'پوشاک', 'giyim', 'Erkek, kadın ve çocuk giyim', 'shirt', 5),
('Hobi', 'سرگرمی', 'hobi', 'Spor, müzik ve hobi ürünleri', 'music', 6),
('İş Makineleri', 'ماشین آلات', 'is-makineleri', 'İnşaat ve tarım makineleri', 'tractor', 7),
('Diğer', 'دیگر', 'diger', 'Diğer ilan kategorileri', 'grid', 8)
ON DUPLICATE KEY UPDATE ad=ad;

-- Örnek iller (Afganistan)
INSERT INTO iller (ad, ad_dari, slug) VALUES
('Kabil', 'کابل', 'kabil'),
('Herat', 'هرات', 'herat'),
('Kandahar', 'قندهار', 'kandahar'),
('Mazar-ı Şerif', 'مزار شریف', 'mazar-i-serif'),
('Celalabad', 'جلال آباد', 'celalabad'),
('Kunduz', 'قندوز', 'kunduz'),
('Bamiyan', 'بامیان', 'bamiyan'),
('Gazni', 'غزنی', 'gazni')
ON DUPLICATE KEY UPDATE ad=ad;

-- Paket tanımları ekle
INSERT INTO paketler (
  ad, ad_dari, store_level, sure_ay, fiyat,
  product_limit, category_limit, listing_priority, search_weight,
  analytics_access, theme, listing_discount, bulk_upload, support_level,
  homepage_vip_slot, weekly_auto_feature, monthly_ad_credit,
  video_upload, custom_url, custom_branding, verification_badge, ozellikler
) VALUES
-- BASIC STORE - FREE
('Basic Store', 'بسته عادی', 'basic', 1, 0.00,
 50, 1, 0, 1.0,
 'basic', 'default', 0, FALSE, 'normal',
 FALSE, FALSE, 0,
 FALSE, FALSE, FALSE, FALSE,
 '{"aciklama": "بسته عادی برای فروشندگان تازه‌کار و شروع سریع در بازار وطن طراحی شده است. با امکانات ضروری، محدودیت مناسب و مدیریت آسان، می‌توانید محصولات خود را بدون هزینه بالا به خریداران معرفی کنید.", "ozellikler": ["رایگان - بدون هزینه", "محدودیت ۵۰ محصول", "فقط ۱ دسته‌بندی", "لیست استاندارد", "تم پیش‌فرض", "آمار پایه", "پیام‌رسانی عادی"]}'),

-- PRO STORE - Monthly (350 AFN)
('Pro Store - Monthly', 'بسته پرو - ماهانه', 'pro', 1, 350.00,
 200, 3, 1, 1.5,
 'intermediate', 'customizable', 25, TRUE, 'fast',
 FALSE, FALSE, 0,
 FALSE, FALSE, FALSE, FALSE,
 '{"aciklama": "بسته پرو مخصوص فروشندگان حرفه‌ای است که می‌خواهند دیده‌شدن بیشتری داشته باشند. با محدودیت‌های بالاتر، ابزارهای تحلیل پیشرفته، طراحی قابل شخصی‌سازی و اولویت در نمایش محصولات، فروش شما به‌طور قابل توجهی افزایش می‌یابد.", "ozellikler": ["حداکثر ۲۰۰ محصول", "تا ۳ دسته‌بندی", "اولویت Pro در جستجو", "+۵۰٪ افزایش دیده شدن", "گزارشات پیشرفته", "سفارشی‌سازی قالب (کاور، بنر، رنگ)", "۲۵٪ تخفیف تبلیغات", "بارگذاری دسته‌ای (CSV/Excel)", "سیستم نظرات و امتیاز فعال", "نمایش تخفیف محصولات", "پشتیبانی سریع (۱۲ ساعت)"]}'),

-- PRO STORE - 3 Months (735 AFN = 30% OFF)
('Pro Store - 3 Months', 'بسته پرو - ۳ ماهه', 'pro', 3, 735.00,
 200, 3, 1, 1.5,
 'intermediate', 'customizable', 25, TRUE, 'fast',
 FALSE, FALSE, 0,
 FALSE, FALSE, FALSE, FALSE,
 '{"aciklama": "بسته پرو مخصوص فروشندگان حرفه‌ای است که می‌خواهند دیده‌شدن بیشتری داشته باشند. با محدودیت‌های بالاتر، ابزارهای تحلیل پیشرفته، طراحی قابل شخصی‌سازی و اولویت در نمایش محصولات، فروش شما به‌طور قابل توجهی افزایش می‌یابد.", "ozellikler": ["همه امکانات Pro", "۳۰٪ تخفیف قیمت", "صرفه‌جویی ۳۱۵ افغانی", "قیمت عادی: ۱٬۰۵۰ افغانی", "قیمت با تخفیف: ۷۳۵ افغانی"]}'),

-- ELITE STORE - Monthly (570 AFN)
('Elite Store - Monthly', 'بسته پریمیوم - ماهانه', 'elite', 1, 570.00,
 999999, 999, 2, 2.0,
 'advanced', 'premium', 0, TRUE, 'vip',
 TRUE, TRUE, 500,
 TRUE, TRUE, TRUE, TRUE,
 '{"aciklama": "بسته پریمیوم سطحی ویژه برای فروشندگان بزرگ و برندها است. با امکانات نامحدود، ویترین اختصاصی، تحلیل‌های پیشرفته، پشتیبانی VIP و ابزارهای حرفه‌ای، فروشگاه شما به یک فروشگاه واقعی و قدرتمند آنلاین تبدیل می‌شود.", "ozellikler": ["محصول نامحدود", "دسته‌بندی نامحدود", "ویترین ثابت صفحه اصلی", "بالاترین اولویت جستجو (x۲)", "تبلیغ هفتگی رایگان", "۵۰۰ افغانی اعتبار تبلیغاتی", "قالب اختصاصی Premium", "آدرس اختصاصی مغازه", "تحلیل‌های حرفه‌ای (Heatmap)", "ارسال پیام دسته‌ای", "اتوماسیون کامل (موجودی، قیمت)", "لوگو و برندینگ کامل", "نشان تأیید کسب‌وکار", "ویدیو نامحدود", "نمایش تخفیف محصولات", "پشتیبانی VIP (۲۴/۷)"]}'),

-- ELITE STORE - 3 Months (1197 AFN = 30% OFF)
('Elite Store - 3 Months', 'بسته پریمیوم - ۳ ماهه', 'elite', 3, 1197.00,
 999999, 999, 2, 2.0,
 'advanced', 'premium', 0, TRUE, 'vip',
 TRUE, TRUE, 1500,
 TRUE, TRUE, TRUE, TRUE,
 '{"aciklama": "بسته پریمیوم سطحی ویژه برای فروشندگان بزرگ و برندها است. با امکانات نامحدود، ویترین اختصاصی، تحلیل‌های پیشرفته، پشتیبانی VIP و ابزارهای حرفه‌ای، فروشگاه شما به یک فروشگاه واقعی و قدرتمند آنلاین تبدیل می‌شود.", "ozellikler": ["همه امکانات Elite", "۳۰٪ تخفیف قیمت", "صرفه‌جویی ۵۱۳ افغانی", "قیمت عادی: ۱٬۷۱۰ افغانی", "قیمت با تخفیف: ۱٬۱۹۷ افغانی", "۱٬۵۰۰ افغانی اعتبار تبلیغاتی"]}')
ON DUPLICATE KEY UPDATE ad=ad;
