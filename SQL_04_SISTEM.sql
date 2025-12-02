-- سیستم (Sistem)
-- Sistem ayarları

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('ilan_onay_gerektir', '1', 'sistem', 'اعلانات تایید ته اړتیا لري؟ (0: نه 1: هو)'),
('kayit_aktif', '1', 'sistem', 'د کارونکو ثبت فعال دی؟ (0: نه 1: هو)'),
('magaza_acma_aktif', '1', 'sistem', 'دوکان جوړول فعال دی؟ (0: نه 1: هو)'),
('varsayilan_ilan_suresi', '30', 'sistem', 'د اعلان اعتبار موده (ورځې)'),
('maksimum_resim_sayisi', '10', 'sistem', 'د اعلان لپاره اعظمي عکسونه'),
('bakim_modu', '0', 'sistem', 'د ساتنې حالت فعال دی؟ (0: نه 1: هو)'),
('bakim_mesaji', 'سایت د ساتنې لاندې دی. لطفاً وروسته بیا هڅه وکړئ.', 'sistem', 'د ساتنې پیغام')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);




