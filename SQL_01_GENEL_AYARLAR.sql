-- عمومی تنظیمات (Genel Ayarlar)
-- Site genel ayarları

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('site_adi', 'WatanBazaare', 'genel', 'د سایت نوم'),
('site_slogan', 'د افغانستان لوی بازار', 'genel', 'د سایت شعار'),
('site_aciklama', 'د افغانستان لوی آنلاین بازار چیرته تاسو کولی شئ هر ډول توکي وپیرئ او وپلورئ', 'genel', 'د سایت توضیحات'),
('site_anahtar_kelimeler', 'افغانستان, بازار, آنلاین, خرید, فروش, اعلانات', 'genel', 'SEO کلیدی کلمې')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

