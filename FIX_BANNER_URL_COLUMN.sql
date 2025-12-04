-- Reklamlar tablosundaki banner_url kolonunu LONGTEXT'e çevir
-- Base64 resimleri için VARCHAR(255) yeterli değil

ALTER TABLE `reklamlar` 
MODIFY COLUMN `banner_url` LONGTEXT NULL COMMENT 'Reklam banner resmi (base64 veya URL)';

-- Aynı şekilde hedef_url için de
ALTER TABLE `reklamlar` 
MODIFY COLUMN `hedef_url` TEXT NULL COMMENT 'Reklam hedef linki';






