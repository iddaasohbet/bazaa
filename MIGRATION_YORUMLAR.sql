CREATE TABLE IF NOT EXISTS magaza_yorumlari (
    id INT AUTO_INCREMENT PRIMARY KEY,
    magaza_id INT NOT NULL,
    kullanici_id INT NOT NULL,
    puan TINYINT NOT NULL CHECK (puan BETWEEN 1 AND 5),
    yorum TEXT,
    durum ENUM('beklemede', 'onaylandi', 'reddedildi') DEFAULT 'onaylandi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (magaza_id) REFERENCES magazalar(id) ON DELETE CASCADE,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












