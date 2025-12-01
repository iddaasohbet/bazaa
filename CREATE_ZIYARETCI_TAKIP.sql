-- جدول ردیابی بازدیدکنندگان سایت
CREATE TABLE IF NOT EXISTS site_ziyaretler (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ip_adresi VARCHAR(45),
  user_agent TEXT,
  sayfa_url VARCHAR(500),
  referrer VARCHAR(500),
  kullanici_id INT NULL,
  tarayici VARCHAR(100),
  isletim_sistemi VARCHAR(100),
  cihaz_tipi ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
  ulke VARCHAR(100),
  sehir VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_kullanici_id (kullanici_id),
  INDEX idx_ip_adresi (ip_adresi),
  FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- نمونه داده‌های تست (اختیاری)
INSERT INTO site_ziyaretler (ip_adresi, user_agent, sayfa_url, tarayici, isletim_sistemi, cihaz_tipi) VALUES
('192.168.1.1', 'Mozilla/5.0', '/', 'Chrome', 'Windows', 'desktop'),
('192.168.1.2', 'Mozilla/5.0', '/ilan-ver', 'Safari', 'iOS', 'mobile'),
('192.168.1.3', 'Mozilla/5.0', '/magaza/123', 'Firefox', 'Linux', 'desktop');

-- آمار بازدیدها را دریافت کنید
-- امروز
SELECT COUNT(*) as bugun_ziyaret, COUNT(DISTINCT ip_adresi) as benzersiz_ziyaretci
FROM site_ziyaretler 
WHERE DATE(created_at) = CURDATE();

-- این هفته
SELECT COUNT(*) as hafta_ziyaret, COUNT(DISTINCT ip_adresi) as benzersiz_ziyaretci
FROM site_ziyaretler 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- این ماه
SELECT COUNT(*) as ay_ziyaret, COUNT(DISTINCT ip_adresi) as benzersiz_ziyaretci
FROM site_ziyaretler 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- محبوب‌ترین صفحات
SELECT 
  sayfa_url, 
  COUNT(*) as ziyaret_sayisi,
  COUNT(DISTINCT ip_adresi) as benzersiz_ziyaretci
FROM site_ziyaretler 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY sayfa_url 
ORDER BY ziyaret_sayisi DESC 
LIMIT 10;

-- آمار دستگاه
SELECT 
  cihaz_tipi, 
  COUNT(*) as sayi,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM site_ziyaretler WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)), 2) as yuzde
FROM site_ziyaretler 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY cihaz_tipi;

