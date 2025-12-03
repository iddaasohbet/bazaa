-- ⚡ PERFORMANCE OPTIMIZATION - INDEX'LER
-- Bu indexler sorguları 10x-100x hızlandırır!

-- İlanlar tablosu indexleri
CREATE INDEX IF NOT EXISTS idx_ilanlar_aktif ON ilanlar(aktif);
CREATE INDEX IF NOT EXISTS idx_ilanlar_created_at ON ilanlar(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ilanlar_kategori ON ilanlar(kategori_id);
CREATE INDEX IF NOT EXISTS idx_ilanlar_il ON ilanlar(il_id);
CREATE INDEX IF NOT EXISTS idx_ilanlar_magaza ON ilanlar(magaza_id);
CREATE INDEX IF NOT EXISTS idx_ilanlar_aktif_created ON ilanlar(aktif, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ilanlar_store_level ON ilanlar(magaza_id, aktif);

-- İlan resimleri indexi - çok önemli!
CREATE INDEX IF NOT EXISTS idx_ilan_resimleri_ilan ON ilan_resimleri(ilan_id, sira);

-- Mağazalar indexleri
CREATE INDEX IF NOT EXISTS idx_magazalar_aktif ON magazalar(aktif);
CREATE INDEX IF NOT EXISTS idx_magazalar_kullanici ON magazalar(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_magazalar_store_level ON magazalar(store_level, aktif);

-- Slider indexi
CREATE INDEX IF NOT EXISTS idx_slider_aktif_sira ON slider(aktif, sira);

-- Favoriler indexi
CREATE INDEX IF NOT EXISTS idx_favoriler_kullanici ON favoriler(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_favoriler_ilan ON favoriler(ilan_id);

-- ANALYZE TABLE - İstatistikleri güncelle
ANALYZE TABLE ilanlar;
ANALYZE TABLE ilan_resimleri;
ANALYZE TABLE magazalar;
ANALYZE TABLE slider;
ANALYZE TABLE favoriler;

-- Başarı mesajı
SELECT '✅ Performans indexleri başarıyla oluşturuldu!' as status;

