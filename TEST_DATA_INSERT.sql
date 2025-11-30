-- Test Verileri - BazaareWatan
-- 40 İlan + Mağazalar + Kullanıcılar
USE cihatcengiz_baza;

-- Kullanıcılar ekle (şifre: test123)
INSERT INTO kullanicilar (ad, email, telefon, sifre, rol, aktif) VALUES
('احمد رضایی', 'ahmad@test.com', '+93 700 111 111', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', TRUE),
('محمد کریمی', 'mohammad@test.com', '+93 700 222 222', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', TRUE),
('فاطمه احمدی', 'fatima@test.com', '+93 700 333 333', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', TRUE),
('علی حسینی', 'ali@test.com', '+93 700 444 444', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', TRUE),
('زهرا نوری', 'zahra@test.com', '+93 700 555 555', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', TRUE),
('رضا محمدی', 'reza@test.com', '+93 700 666 666', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user', TRUE)
ON DUPLICATE KEY UPDATE ad=ad;

-- Mağazalar ekle
INSERT INTO magazalar (kullanici_id, ad, ad_dari, slug, aciklama, telefon, il_id, store_level, paket_baslangic, paket_bitis, aktif, onay_durumu) VALUES
(1, 'Tech Store Kabul', 'مغازه تکنولوژی کابل', 'tech-store-kabul', 'بهترین محصولات الکترونیکی را از ما بخواهید. گارانتی و خدمات پس از فروش', '+93 700 111 111', 1, 'elite', NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH), TRUE, 'onaylandi'),
(2, 'Mobile Shop Herat', 'مغازه موبایل هرات', 'mobile-shop-herat', 'انواع موبایل و لوازم جانبی با قیمت مناسب', '+93 700 222 222', 2, 'pro', NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH), TRUE, 'onaylandi'),
(3, 'Home Furniture', 'فروشگاه لوازم خانه', 'home-furniture', 'مبلمان و لوازم منزل با کیفیت عالی', '+93 700 333 333', 1, 'basic', NOW(), DATE_ADD(NOW(), INTERVAL 12 MONTH), TRUE, 'onaylandi')
ON DUPLICATE KEY UPDATE ad=ad;

-- 40 İlan ekle (Elite, Pro ve Basic mağazalardan)
INSERT INTO ilanlar (baslik, aciklama, fiyat, eski_fiyat, indirim_yuzdesi, kategori_id, il_id, kullanici_id, magaza_id, durum, ana_resim, aktif) VALUES
-- Elite Mağaza İlanları (15 ilan)
('iPhone 14 Pro Max 256GB', 'کاملاً نو، با تمام لوازم جانبی و گارانتی', 42500, 50000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('MacBook Pro M2 2023', 'لپ‌تاپ حرفه‌ای با عملکرد فوق‌العاده', 72000, 90000, 20, 3, 1, 1, 1, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Samsung Galaxy S23 Ultra', 'گوشی پرچم‌دار سامسونگ با دوربین عالی', 38250, 45000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('iPad Pro 12.9 inch', 'تبلت حرفه‌ای اپل با قلم', 45900, 54000, 15, 3, 1, 1, 1, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('Sony PlayStation 5', 'کنسول بازی نسل جدید با بازی‌های رایگان', 34000, 40000, 15, 6, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Apple Watch Series 8', 'ساعت هوشمند با تمام قابلیت‌ها', 21250, 25000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Samsung Smart TV 65"', 'تلویزیون ۴K با کیفیت تصویر عالی', 51000, 60000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('Canon EOS R6 Camera', 'دوربین حرفه‌ای برای عکاسان', 76500, 90000, 15, 3, 1, 1, 1, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Dell XPS 15 Laptop', 'لپ‌تاپ قدرتمند برای کار و بازی', 59500, 70000, 15, 3, 1, 1, 1, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Bose Headphones', 'هدفون با کیفیت صدای استثنایی', 12750, 15000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('AirPods Pro 2', 'ایرپاد پرو نسل دوم با حذف نویز', 14450, 17000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('iPad Air 5th Gen', 'تبلت سبک و قدرتمند اپل', 38250, 45000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Nintendo Switch OLED', 'کنسول قابل حمل با صفحه OLED', 25500, 30000, 15, 6, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('Samsung Galaxy Tab S8', 'تبلت اندرویدی پرقدرت', 29750, 35000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Xiaomi Mi Band 7', 'مچ‌بند هوشمند با عمر باتری طولانی', 3400, 4000, 15, 3, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),

-- Pro Mağaza İlanları (10 ilan)
('iPhone 13 256GB', 'موبایل اپل با حافظه ۲۵۶ گیگابایت', 31875, 37500, 15, 3, 2, 2, 2, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('Samsung Galaxy A54', 'گوشی میان‌رده عالی سامسونگ', 17000, 20000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Xiaomi Redmi Note 12', 'گوشی شیائومی با باتری قوی', 12750, 15000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Huawei P50 Pro', 'گوشی هوشمند با دوربین قدرتمند', 25500, 30000, 15, 3, 2, 2, 2, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('OnePlus 11', 'گوشی پرسرعت با شارژ سریع', 29750, 35000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Google Pixel 7', 'گوشی هوشمند گوگل با اندروید خالص', 27200, 32000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Oppo Find X5', 'طراحی زیبا و عملکرد عالی', 21250, 25000, 15, 3, 2, 2, 2, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('Vivo V25 Pro', 'گوشی با دوربین سلفی عالی', 19125, 22500, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Realme GT 3', 'گوشی گیمینگ با قیمت مناسب', 17850, 21000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Poco F4 GT', 'پرچم‌دار ارزان با امکانات بالا', 23800, 28000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),

-- Basic Mağaza ve Kullanıcı İlanları (15 ilan)
('Toyota Corolla 2015', 'خودروی تمیز و بدون تصادف', 48000, NULL, 0, 1, 1, 4, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Honda Civic 2018', 'ماشین در حالت عالی، کم‌کارکرد', 65000, NULL, 0, 1, 1, 4, NULL, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('دفتر اداری - ۱۵۰ متر', 'دفتر تجاری در موقعیت عالی', 180000, NULL, 0, 2, 1, 5, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('آپارتمان ۳ خوابه', 'آپارتمان نوساز با امکانات کامل', 250000, NULL, 0, 2, 1, 5, NULL, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('مبل راحتی ۷ نفره', 'مبل تمیز و شیک برای خانه', 15000, NULL, 0, 4, 1, 6, 3, 'kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('یخچال سامسونگ', 'یخچال دو درب در حالت عالی', 25000, NULL, 0, 4, 2, 6, 3, 'kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('لباسشویی ال‌جی', 'ماشین لباسشویی ۸ کیلویی', 18000, NULL, 0, 4, 2, 3, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('کت و شلوار مردانه', 'لباس مجلسی مردانه سایز ۵۰', 8000, NULL, 0, 5, 1, 3, NULL, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('کفش ورزشی نایک', 'کفش اصل نایک سایز ۴۲', 12000, NULL, 0, 5, 1, 4, NULL, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('دوچرخه کوهستان', 'دوچرخه ۲۱ دنده در حالت عالی', 9500, NULL, 0, 6, 3, 4, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('گیتار آکوستیک', 'گیتار برای مبتدی و حرفه‌ای', 5500, NULL, 0, 6, 1, 5, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('موتور هوندا ۱۲۵', 'موتور کم‌کارکرد و تمیز', 22000, NULL, 0, 1, 2, 5, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('تراکتور کشاورزی', 'تراکتور آماده کار با لوازم', 95000, NULL, 0, 7, 3, 6, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('دستگاه جوش', 'دستگاه جوش صنعتی ۲۰۰ آمپر', 12000, NULL, 0, 7, 1, 6, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('میز تحریر چوبی', 'میز مطالعه با کشو و قفسه', 6500, NULL, 0, 4, 1, 3, 3, 'kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),

-- Elite Mağaza - Devam (5 ilan daha)
('سامسونگ فریزر', 'فریزر بزرگ برای مغازه یا خانه', 29750, 35000, 15, 4, 1, 1, 1, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('کولر گازی ال‌جی', 'کولر ۲۴۰۰۰ سرد و گرم', 38250, 45000, 15, 4, 1, 1, 1, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('ماشین ظرفشویی بوش', 'ماشین ظرفشویی ۱۴ نفره', 34000, 40000, 15, 4, 1, 1, 1, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('اجاق گاز اخوان', 'اجاق ۵ شعله با فر بزرگ', 17000, 20000, 15, 4, 1, 1, 1, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('جاروبرقی سامسونگ', 'جارو قوی با فیلتر HEPA', 8500, 10000, 15, 4, 1, 1, 1, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),

-- Pro Mağaza - Devam (5 ilan daha)
('Nokia G50', 'گوشی نوکیا با ۵G', 12750, 15000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Motorola Edge 30', 'گوشی موتورولا با صفحه ۱۴۴Hz', 17000, 20000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('Asus ROG Phone 6', 'گوشی گیمینگ حرفه‌ای', 42500, 50000, 15, 3, 2, 2, 2, 'az_kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('Sony Xperia 5 IV', 'گوشی کامپکت سونی با دوربین عالی', 38250, 45000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('Nothing Phone 2', 'طراحی منحصر به فرد با LED پشتی', 25500, 30000, 15, 3, 2, 2, 2, 'yeni', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),

-- Basic ve Karışık (5 ilan)
('چمدان مسافرتی', 'چمدان بزرگ و محکم', 4500, NULL, 0, 8, 1, 3, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('کتاب‌های درسی', 'کتاب‌های دبیرستان کلاس ۱۲', 2000, NULL, 0, 8, 1, 4, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE),
('دستگاه تولید نان', 'دستگاه نانوایی صنعتی', 150000, NULL, 0, 7, 1, 6, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg', TRUE),
('پمپ آب کشاورزی', 'پمپ قوی برای مزرعه', 35000, NULL, 0, 7, 3, 6, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg', TRUE),
('ژنراتور برق ۱۰ کیلووات', 'ژنراتور بنزینی قدرتمند', 45000, NULL, 0, 7, 1, 6, NULL, 'kullanilmis', 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg', TRUE)
ON DUPLICATE KEY UPDATE baslik=baslik;

SELECT '✅ Test verileri başarıyla eklendi!' AS Mesaj;
SELECT COUNT(*) as 'Toplam İlan' FROM ilanlar WHERE aktif = TRUE;
SELECT COUNT(*) as 'Toplam Mağaza' FROM magazalar WHERE aktif = TRUE;
SELECT COUNT(*) as 'Toplam Kullanıcı' FROM kullanicilar WHERE aktif = TRUE;















