-- Email Doğrulama Sistemi için Migration
-- Bu SQL'i veritabanında çalıştırın

-- Kullanıcılar tablosuna email_verified kolonu ekle
ALTER TABLE kullanicilar ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Doğrulama kodları tablosu
CREATE TABLE IF NOT EXISTS email_dogrulama (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    kod VARCHAR(6) NOT NULL,
    ad VARCHAR(255),
    sifre_hash VARCHAR(255),
    telefon VARCHAR(20),
    tip ENUM('kayit', 'sifre_sifirlama') DEFAULT 'kayit',
    kullanildi BOOLEAN DEFAULT FALSE,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    son_kullanma_tarihi TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE),
    INDEX idx_email (email),
    INDEX idx_kod (kod),
    INDEX idx_son_kullanma (son_kullanma_tarihi)
);

-- Eski doğrulama kodlarını temizlemek için event (opsiyonel)
-- CREATE EVENT IF NOT EXISTS temizle_eski_kodlar
-- ON SCHEDULE EVERY 1 HOUR
-- DO DELETE FROM email_dogrulama WHERE son_kullanma_tarihi < NOW();


