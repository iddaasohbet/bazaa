-- ټولنیز رسنۍ (Sosyal Medya)
-- Sosyal medya linkleri

INSERT INTO `site_ayarlar` (`anahtar`, `deger`, `kategori`, `aciklama`) VALUES
('facebook_url', 'https://facebook.com/watanbazaare', 'sosyal_medya', 'فیسبوک لینک'),
('twitter_url', 'https://twitter.com/watanbazaare', 'sosyal_medya', 'توییتر لینک'),
('instagram_url', 'https://instagram.com/watanbazaare', 'sosyal_medya', 'انستاگرام لینک'),
('youtube_url', 'https://youtube.com/@watanbazaare', 'sosyal_medya', 'یوټیوب لینک')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`);

