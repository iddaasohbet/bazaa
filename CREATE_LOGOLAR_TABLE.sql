-- Logo tablosu oluştur
CREATE TABLE IF NOT EXISTS `logolar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tip` enum('header','footer') NOT NULL COMMENT 'Logo tipi: header veya footer',
  `logo_data` longtext NOT NULL COMMENT 'Base64 encoded logo data',
  `guncelleme_tarihi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tip` (`tip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eğer site_ayarlar'dan logo varsa, logolar tablosuna taşı
INSERT INTO `logolar` (`tip`, `logo_data`)
SELECT 
  CASE 
    WHEN `anahtar` = 'site_header_logo' THEN 'header'
    WHEN `anahtar` = 'site_footer_logo' THEN 'footer'
  END as `tip`,
  `deger` as `logo_data`
FROM `site_ayarlar`
WHERE `anahtar` IN ('site_header_logo', 'site_footer_logo')
  AND `deger` IS NOT NULL 
  AND `deger` != ''
  AND LENGTH(`deger`) > 0
ON DUPLICATE KEY UPDATE `logo_data` = VALUES(`logo_data`);






