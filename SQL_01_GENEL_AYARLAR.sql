-- عمومی تنظیمات (Genel Ayarlar)
-- Site genel ayarları

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('site_adi', 'WatanBazaare', 'genel', 'د سایت نوم'),
('site_slogan', 'د افغانستان لوی بازار', 'genel', 'د سایت شعار'),
('site_aciklama', 'د افغانستان لوی آنلاین بازار چیرته تاسو کولی شئ هر ډول توکي وپیرئ او وپلورئ', 'genel', 'د سایت توضیحات'),
('site_anahtar_kelimeler', 'افغانستان, بازار, آنلاین, خرید, فروش, اعلانات', 'genel', 'SEO کلیدی کلمې'),
('android_aktif', '1', 'genel', 'اندروید دانلود فعال دی؟ (0: نه 1: هو)'),
('ios_aktif', '1', 'genel', 'iOS دانلود فعال دی؟ (0: نه 1: هو)'),
('app_app_store_link', 'https://apps.apple.com', 'genel', 'App Store لینک')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

