-- il_id kolonunu VARCHAR tipine çevir
-- Önce foreign key kısıtlamasını kaldır

-- 1. Foreign key'i kaldır
ALTER TABLE magazalar DROP FOREIGN KEY magazalar_ibfk_2;

-- 2. magazalar tablosundaki il_id kolonunu değiştir
ALTER TABLE magazalar MODIFY COLUMN il_id VARCHAR(100) NULL;

-- 3. ilanlar tablosunda da foreign key varsa kaldır ve değiştir
-- (Hata verirse bu satırları atla)
ALTER TABLE ilanlar DROP FOREIGN KEY IF EXISTS ilanlar_ibfk_2;
ALTER TABLE ilanlar MODIFY COLUMN il_id VARCHAR(100) NULL;

-- Başarılı
SELECT 'il_id kolonu VARCHAR(100) olarak güncellendi!' as sonuc;
