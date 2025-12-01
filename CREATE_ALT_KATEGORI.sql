-- جدول زیر دسته‌بندی‌ها
CREATE TABLE IF NOT EXISTS alt_kategoriler (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kategori_id INT NOT NULL,
  ad VARCHAR(100) NOT NULL,
  ad_dari VARCHAR(100),
  slug VARCHAR(100) NOT NULL UNIQUE,
  aciklama TEXT,
  sira INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE CASCADE,
  INDEX idx_kategori_id (kategori_id),
  INDEX idx_slug (slug),
  INDEX idx_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ستون زیر دسته‌بندی را به جدول آگهی‌ها اضافه کنید
ALTER TABLE ilanlar 
ADD COLUMN IF NOT EXISTS alt_kategori_id INT NULL AFTER kategori_id,
ADD INDEX idx_alt_kategori_id (alt_kategori_id),
ADD FOREIGN KEY (alt_kategori_id) REFERENCES alt_kategoriler(id) ON DELETE SET NULL;

-- نمونه داده‌های زیر دسته‌بندی
-- فرض کنید دسته‌بندی "الکترونیک" دارای شناسه 1 است
INSERT INTO alt_kategoriler (kategori_id, ad, ad_dari, slug, sira, aktif) VALUES
(1, 'Telefonlar', 'موبایل‌ها', 'telefonlar', 1, TRUE),
(1, 'Bilgisayarlar', 'کامپیوترها', 'bilgisayarlar', 2, TRUE),
(1, 'Televizyonlar', 'تلویزیون‌ها', 'televizyonlar', 3, TRUE),
(1, 'Ses Sistemleri', 'سیستم‌های صوتی', 'ses-sistemleri', 4, TRUE);

-- الکترونیک kategorisi için örnek alt kategoriler (id=1 ise)
-- Araçlar kategorisi için (id=2 ise)
INSERT INTO alt_kategoriler (kategori_id, ad, ad_dari, slug, sira, aktif) VALUES
(2, 'Otomobil', 'اتومبیل', 'otomobil', 1, TRUE),
(2, 'Motosiklet', 'موتورسیکلت', 'motosiklet', 2, TRUE),
(2, 'Ticari Araçlar', 'وسایل تجاری', 'ticari-araclar', 3, TRUE);

-- Emlak kategorisi için (id=3 ise)
INSERT INTO alt_kategoriler (kategori_id, ad, ad_dari, slug, sira, aktif) VALUES
(3, 'Daire', 'آپارتمان', 'daire', 1, TRUE),
(3, 'Arsa', 'زمین', 'arsa', 2, TRUE),
(3, 'Villa', 'ویلا', 'villa', 3, TRUE),
(3, 'İşyeri', 'محل کار', 'isyeri', 4, TRUE);

-- Alt kategorileri kategoriye göre getir
SELECT 
  ak.id,
  ak.ad,
  ak.ad_dari,
  ak.slug,
  ak.sira,
  ak.aktif,
  k.ad as kategori_ad,
  COUNT(i.id) as ilan_sayisi
FROM alt_kategoriler ak
LEFT JOIN kategoriler k ON ak.kategori_id = k.id
LEFT JOIN ilanlar i ON ak.id = i.alt_kategori_id AND i.aktif = TRUE
WHERE ak.aktif = TRUE
GROUP BY ak.id
ORDER BY ak.kategori_id, ak.sira;

-- Belirli bir kategori için alt kategorileri getir
SELECT id, ad, ad_dari, slug, sira
FROM alt_kategoriler 
WHERE kategori_id = 1 AND aktif = TRUE 
ORDER BY sira;

