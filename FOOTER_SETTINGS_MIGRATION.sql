-- Footer Ayarları Tablosu Migration
-- Bu script footer ayarları için gerekli tabloyu oluşturur

USE cihatcengiz_baza;

-- Site ayarları tablosu (Footer ve genel ayarlar için)
CREATE TABLE IF NOT EXISTS site_ayarlari (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ayar_key VARCHAR(100) NOT NULL UNIQUE,
  ayar_value TEXT,
  ayar_group VARCHAR(50) DEFAULT 'genel',
  aciklama TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (ayar_key),
  INDEX idx_group (ayar_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Footer ayarlarını ekle
INSERT INTO site_ayarlari (ayar_key, ayar_value, ayar_group, aciklama) VALUES
-- Genel Bilgiler
('site_baslik', 'BazaareWatan', 'footer', 'Site başlığı'),
('site_aciklama', 'معتبرترین پلتفرم آگهی در افغانستان. کالای دست دوم، خودرو، املاک و بیشتر.', 'footer', 'Site açıklaması'),
('copyright_metni', 'آگهی های افغانستان. تمامی حقوق محفوظ است.', 'footer', 'Copyright metni'),

-- İletişim Bilgileri
('iletisim_adres', 'کابل، افغانستان', 'footer', 'Adres bilgisi'),
('iletisim_telefon', '+93 700 000 000', 'footer', 'Telefon numarası'),
('iletisim_email', 'info@afghanistan-ilanlar.com', 'footer', 'Email adresi'),

-- Sosyal Medya
('sosyal_facebook', '#', 'footer', 'Facebook linki'),
('sosyal_twitter', '#', 'footer', 'Twitter linki'),
('sosyal_instagram', '#', 'footer', 'Instagram linki'),

-- Mobil Uygulama
('app_baslik', 'اپلیکیشن موبایل ما را دانلود کنید', 'footer', 'Uygulama başlığı'),
('app_aciklama', 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید', 'footer', 'Uygulama açıklaması'),
('app_google_play_link', 'https://play.google.com/store', 'footer', 'Google Play linki'),
('app_qr_url', 'https://cihatcengiz.com', 'footer', 'QR kod için URL'),

-- Hızlı Linkler (JSON formatında)
('hizli_linkler', '[
  {"label": "درباره ما", "href": "/hakkimizda"},
  {"label": "چگونه کار می کند؟", "href": "/nasil-calisir"},
  {"label": "خرید امن", "href": "/guvenli-alisveris"},
  {"label": "سوالات متداول", "href": "/sss"}
]', 'footer', 'Hızlı linkler listesi'),

-- Alt Bar Linkleri
('alt_linkler', '[
  {"label": "سیاست حفظ حریم خصوصی", "href": "/gizlilik"},
  {"label": "شرایط استفاده", "href": "/kullanim-kosullari"},
  {"label": "حریم خصوصی", "href": "/kvkk"}
]', 'footer', 'Alt bar linkleri')

ON DUPLICATE KEY UPDATE ayar_value=VALUES(ayar_value);

-- Başarılı mesajı
SELECT 'Footer ayarları tablosu başarıyla oluşturuldu!' as message;













