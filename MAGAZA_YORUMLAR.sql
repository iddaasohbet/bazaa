-- Mağaza Yorumları Sistemi SQL

-- Mağaza yorumları tablosu
CREATE TABLE IF NOT EXISTS magaza_yorumlar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  magaza_id INT NOT NULL,
  kullanici_id INT NOT NULL,
  yorum TEXT NOT NULL,
  puan INT NOT NULL CHECK (puan >= 1 AND puan <= 5),
  aktif BOOLEAN DEFAULT TRUE,
  onaylandi BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (magaza_id) REFERENCES magazalar(id) ON DELETE CASCADE,
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
  INDEX idx_magaza (magaza_id),
  INDEX idx_kullanici (kullanici_id),
  INDEX idx_aktif (aktif),
  INDEX idx_onaylandi (onaylandi),
  INDEX idx_puan (puan),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mağazalar tablosuna ortalama puan ve yorum sayısı kolonları ekle
ALTER TABLE magazalar 
ADD COLUMN IF NOT EXISTS ortalama_puan DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS toplam_yorum INT DEFAULT 0,
ADD INDEX idx_ortalama_puan (ortalama_puan);

-- Mağaza puanını güncelleyen trigger
DELIMITER //

CREATE TRIGGER magaza_yorum_after_insert
AFTER INSERT ON magaza_yorumlar
FOR EACH ROW
BEGIN
  IF NEW.aktif = TRUE AND NEW.onaylandi = TRUE THEN
    UPDATE magazalar 
    SET 
      ortalama_puan = (
        SELECT COALESCE(AVG(puan), 0) 
        FROM magaza_yorumlar 
        WHERE magaza_id = NEW.magaza_id AND aktif = TRUE AND onaylandi = TRUE
      ),
      toplam_yorum = (
        SELECT COUNT(*) 
        FROM magaza_yorumlar 
        WHERE magaza_id = NEW.magaza_id AND aktif = TRUE AND onaylandi = TRUE
      )
    WHERE id = NEW.magaza_id;
  END IF;
END//

CREATE TRIGGER magaza_yorum_after_update
AFTER UPDATE ON magaza_yorumlar
FOR EACH ROW
BEGIN
  UPDATE magazalar 
  SET 
    ortalama_puan = (
      SELECT COALESCE(AVG(puan), 0) 
      FROM magaza_yorumlar 
      WHERE magaza_id = NEW.magaza_id AND aktif = TRUE AND onaylandi = TRUE
    ),
    toplam_yorum = (
      SELECT COUNT(*) 
      FROM magaza_yorumlar 
      WHERE magaza_id = NEW.magaza_id AND aktif = TRUE AND onaylandi = TRUE
    )
  WHERE id = NEW.magaza_id;
END//

CREATE TRIGGER magaza_yorum_after_delete
AFTER DELETE ON magaza_yorumlar
FOR EACH ROW
BEGIN
  UPDATE magazalar 
  SET 
    ortalama_puan = (
      SELECT COALESCE(AVG(puan), 0) 
      FROM magaza_yorumlar 
      WHERE magaza_id = OLD.magaza_id AND aktif = TRUE AND onaylandi = TRUE
    ),
    toplam_yorum = (
      SELECT COUNT(*) 
      FROM magaza_yorumlar 
      WHERE magaza_id = OLD.magaza_id AND aktif = TRUE AND onaylandi = TRUE
    )
  WHERE id = OLD.magaza_id;
END//

DELIMITER ;

-- Test verisi ekle (opsiyonel - silebilirsin)
-- INSERT INTO magaza_yorumlar (magaza_id, kullanici_id, yorum, puan, onaylandi) VALUES
-- (13, 1, 'عالی بود، خیلی راضی هستم', 5, TRUE),
-- (13, 2, 'خدمات خوب، کیفیت محصولات عالی', 4, TRUE),
-- (13, 3, 'مغازه خوبی است، توصیه می‌کنم', 5, TRUE);

