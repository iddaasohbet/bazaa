-- İl ve İlçe Alanları Ekleme
-- Kullanıcılar ve İlanlar tablolarına il/ilçe bilgisi ekler

-- Kullanıcılar tablosuna il ve ilçe ekle
ALTER TABLE kullanicilar
ADD COLUMN il VARCHAR(100) NULL AFTER telefon,
ADD COLUMN ilce VARCHAR(100) NULL AFTER il;

-- İlanlar tablosuna ilçe ekle (il_id zaten var)
ALTER TABLE ilanlar
ADD COLUMN ilce VARCHAR(100) NULL AFTER il_id;

-- Index ekle
ALTER TABLE kullanicilar ADD INDEX idx_il (il);
ALTER TABLE ilanlar ADD INDEX idx_ilce (ilce);

SELECT 'İl/İlçe alanları başarıyla eklendi!' as sonuc;





