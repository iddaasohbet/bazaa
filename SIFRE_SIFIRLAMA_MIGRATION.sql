-- ŞİFRE SIFIRLAMA KODLARI TABLOSU
-- Bu tablo şifre sıfırlama kodlarını saklar

CREATE TABLE IF NOT EXISTS sifre_sifirlama_kodlari (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kullanici_id INT NOT NULL,
  kod VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  kullanildi BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  UNIQUE KEY unique_kullanici (kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index ekle (IF NOT EXISTS yok, önce drop et)
CREATE INDEX IF NOT EXISTS idx_kod ON sifre_sifirlama_kodlari(kod);
CREATE INDEX IF NOT EXISTS idx_expires ON sifre_sifirlama_kodlari(expires_at);
CREATE INDEX IF NOT EXISTS idx_kullanildi ON sifre_sifirlama_kodlari(kullanildi);

-- Eski kodları temizle (30 gün öncesi)
DELETE FROM sifre_sifirlama_kodlari WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

SELECT '✅ Şifre sıfırlama tablosu başarıyla oluşturuldu!' as status;

