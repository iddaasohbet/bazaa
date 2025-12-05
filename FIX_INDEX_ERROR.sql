-- Hata düzeltme scripti
-- Önceki hatalı index varsa kaldır

DROP INDEX IF EXISTS idx_paketler_ozellikler ON paketler;

-- Başarıyla tamamlandı mesajı
SELECT 'Index hatası düzeltildi! ✅' AS status;
SELECT COUNT(*) as toplam_paket FROM paketler;












