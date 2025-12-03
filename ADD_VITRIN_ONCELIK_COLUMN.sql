-- Magazalar tablosuna vitrin_oncelik kolonu ekle
ALTER TABLE `magazalar` 
ADD COLUMN `vitrin_oncelik` INT NULL DEFAULT NULL COMMENT 'Vitrin önceliği (NULL=vitrinde değil, 1-999=öncelik sırası)' 
AFTER `store_level`;

-- Index ekle (performans için)
CREATE INDEX `idx_vitrin_oncelik` ON `magazalar` (`vitrin_oncelik`);

-- Mevcut veritabanını güncelle
UPDATE `magazalar` SET `vitrin_oncelik` = NULL WHERE `vitrin_oncelik` IS NULL;





