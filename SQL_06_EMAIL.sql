-- بریښنالیک (Email)
-- Email/SMTP ayarları

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('smtp_host', 'smtp.gmail.com', 'email', 'SMTP هوست'),
('smtp_port', '587', 'email', 'SMTP پورت'),
('smtp_kullanici', '', 'email', 'SMTP کارونکی'),
('smtp_sifre', '', 'email', 'SMTP رمز')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

