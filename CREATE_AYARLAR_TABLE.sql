-- Ayarlar Tablosu Oluşturma (Logo Destekli)

-- Eğer eski site_ayarlar tablosu varsa, onu ayarlar olarak yeniden adlandır
-- Yoksa yeni ayarlar tablosu oluştur

-- Önce site_ayarlar varsa onu ayarlar'a çevir
RENAME TABLE IF EXISTS site_ayarlar TO ayarlar;

-- Ayarlar tablosu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS ayarlar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  anahtar VARCHAR(100) UNIQUE NOT NULL,
  deger LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  kategori VARCHAR(50) DEFAULT 'genel',
  aciklama TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan ayarları ekle
INSERT INTO ayarlar (anahtar, deger, kategori, aciklama) VALUES
('site_adi', 'بازارواتان', 'genel', 'نام سایت'),
('site_slogan', 'بازار وطن - بهترین سایت خرید و فروش در افغانستان', 'genel', 'شعار سایت'),
('site_aciklama', 'سایت اعلانات، خرید و فروش و خدمات در افغانستان', 'genel', 'توضیحات سایت'),
('site_anahtar_kelimeler', 'افغانستان, اعلانات, خرید و فروش, بازار', 'genel', 'کلمات کلیدی SEO'),
('site_email', 'info@bazaarwatan.com', 'iletisim', 'ایمیل تماس'),
('site_telefon', '+93 700 000 000', 'iletisim', 'تلفن تماس'),
('site_adres', 'کابل، افغانستان', 'iletisim', 'آدرس شرکت'),
('facebook_url', '', 'sosyal_medya', 'لینک صفحه فیسبوک'),
('twitter_url', '', 'sosyal_medya', 'لینک پروفایل توییتر'),
('instagram_url', '', 'sosyal_medya', 'لینک پروفایل اینستاگرام'),
('youtube_url', '', 'sosyal_medya', 'لینک کانال یوتیوب'),
('ilan_onay_gerektir', '0', 'sistem', 'آیا اعلانات نیاز به تایید دارند؟ (0: خیر، 1: بله)'),
('kayit_aktif', '1', 'sistem', 'آیا ثبت نام کاربر فعال است؟ (0: خیر، 1: بله)'),
('magaza_acma_aktif', '1', 'sistem', 'آیا باز کردن مغازه فعال است؟ (0: خیر، 1: بله)'),
('varsayilan_ilan_suresi', '30', 'sistem', 'مدت پیش فرض انتشار اعلانات (روز)'),
('maksimum_resim_sayisi', '10', 'sistem', 'حداکثر تعداد تصاویر برای هر اعلان'),
('google_analytics_id', '', 'entegrasyon', 'شناسه Google Analytics'),
('google_maps_api_key', '', 'entegrasyon', 'کلید API نقشه گوگل'),
('smtp_host', '', 'email', 'آدرس سرور SMTP'),
('smtp_port', '587', 'email', 'پورت SMTP'),
('smtp_kullanici', '', 'email', 'نام کاربری SMTP'),
('smtp_sifre', '', 'email', 'رمز عبور SMTP'),
('bakim_modu', '0', 'sistem', 'آیا حالت تعمیر فعال است؟ (0: خیر، 1: بله)'),
('bakim_mesaji', 'سیستم در حال تعمیر است. لطفاً بعداً دوباره تلاش کنید.', 'sistem', 'پیام حالت تعمیر'),
('site_header_logo', '', 'logo', 'لوگوی Header (Base64)'),
('site_footer_logo', '', 'logo', 'لوگوی Footer (Base64)')
ON DUPLICATE KEY UPDATE deger=deger;

-- Kontrol sorgusu
SELECT anahtar, kategori, aciklama FROM ayarlar ORDER BY kategori, anahtar;


