-- Emlak Tipi Alanı Ekleme Migration
-- Bu script ilanlar tablosuna emlak_tipi alanını ekler

USE cihatcengiz_baza;

-- emlak_tipi alanını ekle
ALTER TABLE ilanlar 
ADD COLUMN emlak_tipi ENUM('satilik', 'kiralik', 'rehinli') NULL 
AFTER durum;

-- Index ekle (performans için)
ALTER TABLE ilanlar 
ADD INDEX idx_emlak_tipi (emlak_tipi);

-- Başarılı mesajı
SELECT 'emlak_tipi alanı başarıyla eklendi!' as message;











