-- ============================================
-- TÜM AYARLAR - Tek seferde yüklemek için
-- ============================================

-- 1. عمومی تنظیمات (Genel Ayarlar)
INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('site_adi', 'WatanBazaare', 'genel', 'د سایت نوم'),
('site_slogan', 'د افغانستان لوی بازار', 'genel', 'د سایت شعار'),
('site_aciklama', 'د افغانستان لوی آنلاین بازار چیرته تاسو کولی شئ هر ډول توکي وپیرئ او وپلورئ', 'genel', 'د سایت توضیحات'),
('site_anahtar_kelimeler', 'افغانستان, بازار, آنلاین, خرید, فروش, اعلانات', 'genel', 'SEO کلیدی کلمې')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

-- 2. د اړیکو معلومات (İletişim Bilgileri)
INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('site_email', 'info@watanbazaare.com', 'iletisim', 'بریښنالیک ایمیل'),
('site_telefon', '+93 700 000 000', 'iletisim', 'تلیفون شمیره'),
('site_adres', 'کابل، افغانستان', 'iletisim', 'آدرس')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

-- 3. ټولنیز رسنۍ (Sosyal Medya)
INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('facebook_url', 'https://facebook.com/watanbazaare', 'sosyal_medya', 'فیسبوک لینک'),
('twitter_url', 'https://twitter.com/watanbazaare', 'sosyal_medya', 'توییتر لینک'),
('instagram_url', 'https://instagram.com/watanbazaare', 'sosyal_medya', 'انستاگرام لینک'),
('youtube_url', 'https://youtube.com/@watanbazaare', 'sosyal_medya', 'یوټیوب لینک')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

-- 4. سیستم (Sistem)
INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('ilan_onay_gerektir', '1', 'sistem', 'اعلانات تایید ته اړتیا لري؟ (0: نه 1: هو)'),
('kayit_aktif', '1', 'sistem', 'د کارونکو ثبت فعال دی؟ (0: نه 1: هو)'),
('magaza_acma_aktif', '1', 'sistem', 'دوکان جوړول فعال دی؟ (0: نه 1: هو)'),
('varsayilan_ilan_suresi', '30', 'sistem', 'د اعلان اعتبار موده (ورځې)'),
('maksimum_resim_sayisi', '10', 'sistem', 'د اعلان لپاره اعظمي عکسونه'),
('bakim_modu', '0', 'sistem', 'د ساتنې حالت فعال دی؟ (0: نه 1: هو)'),
('bakim_mesaji', 'سایت د ساتنې لاندې دی. لطفاً وروسته بیا هڅه وکړئ.', 'sistem', 'د ساتنې پیغام')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

-- 5. ادغام (Entegrasyon)
INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('google_analytics_id', '', 'entegrasyon', 'Google Analytics ID'),
('google_maps_api_key', '', 'entegrasyon', 'Google Maps API Key')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

-- 6. بریښنالیک (Email)
INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('smtp_host', 'smtp.gmail.com', 'email', 'SMTP هوست'),
('smtp_port', '587', 'email', 'SMTP پورت'),
('smtp_kullanici', '', 'email', 'SMTP کارونکی'),
('smtp_sifre', '', 'email', 'SMTP رمز')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);






