-- Guvenlik Loglari Tablosu
CREATE TABLE IF NOT EXISTS guvenlik_loglari (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kullanici_id INT NOT NULL,
  olay VARCHAR(100) NOT NULL,
  detay TEXT,
  ip_adresi VARCHAR(50),
  user_agent TEXT,
  tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_tarih (tarih),
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Oturum Yonetimi Tablosu
CREATE TABLE IF NOT EXISTS oturumlar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kullanici_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_adresi VARCHAR(50),
  user_agent TEXT,
  son_aktivite TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  aktif BOOLEAN DEFAULT TRUE,
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_token (token),
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Basarisiz Giris Denemeleri
CREATE TABLE IF NOT EXISTS basarisiz_girisler (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  ip_adresi VARCHAR(50),
  user_agent TEXT,
  deneme_sayisi INT DEFAULT 1,
  son_deneme TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_ip (ip_adresi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









