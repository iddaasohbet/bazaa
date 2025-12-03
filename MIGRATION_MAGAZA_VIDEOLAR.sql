-- Premium Mağaza Video Sistemi
CREATE TABLE IF NOT EXISTS magaza_videolar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    magaza_id INT NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    baslik VARCHAR(200),
    aciklama TEXT,
    sure INT NOT NULL COMMENT 'Video süresi saniye cinsinden (10 veya 30)',
    goruntulenme INT DEFAULT 0,
    durum ENUM('aktif', 'beklemede', 'reddedildi') DEFAULT 'aktif',
    sira INT DEFAULT 0 COMMENT 'Video gösterim sırası',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (magaza_id) REFERENCES magazalar(id) ON DELETE CASCADE,
    INDEX idx_magaza_aktif (magaza_id, durum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Premium mağazaların maksimum video sayısını kontrol etmek için
-- Elite paketler: 10 video, Pro paketler: 5 video, Basic: 0 video


















