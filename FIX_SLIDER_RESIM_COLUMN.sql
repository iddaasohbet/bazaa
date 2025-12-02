-- Slider tablosundaki resim kolonunu LONGTEXT'e çevir
-- Base64 resimleri için VARCHAR(500) yeterli değil

ALTER TABLE `slider` 
MODIFY COLUMN `resim` LONGTEXT NULL COMMENT 'Slider resmi (base64 veya URL)';

-- Link kolonu için de büyütme
ALTER TABLE `slider` 
MODIFY COLUMN `link` TEXT NULL COMMENT 'Slider hedef linki';




