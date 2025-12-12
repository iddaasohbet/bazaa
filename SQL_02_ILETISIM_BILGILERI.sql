-- د اړیکو معلومات (İletişim Bilgileri)
-- Site iletişim bilgileri

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('site_email', 'info@watanbazaare.com', 'iletisim', 'بریښنالیک ایمیل'),
('site_telefon', '+93 700 000 000', 'iletisim', 'تلیفون شمیره'),
('site_adres', 'کابل، افغانستان', 'iletisim', 'آدرس')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);







