# Afganistan İlan Sitesi - Kurulum Talimatları

## Gereksinimler

- Node.js 18+ 
- MySQL 8.0+
- npm veya yarn

## Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Veritabanını Oluşturun

MySQL'de yeni bir veritabanı oluşturun:

```sql
CREATE DATABASE afganistan_ilanlar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Veritabanı Tablolarını Oluşturun

`database.sql` dosyasını MySQL'e import edin:

```bash
mysql -u root -p afganistan_ilanlar < database.sql
```

veya MySQL istemcisinde:

```sql
USE afganistan_ilanlar;
SOURCE database.sql;
```

### 4. Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Veritabanı Ayarları
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sizin_sifreniz
DB_NAME=afganistan_ilanlar

# Site Ayarları
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=افغانستان اعلانات
```

### 5. Admin Kullanıcısı Oluşturun

Admin şifresi için hash oluşturun (Node.js ile):

```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123'; // İstediğiniz şifreyi girin
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Veya online bcrypt generator kullanın: https://bcrypt-generator.com/

Çıkan hash'i `database.sql` dosyasındaki admin kullanıcı satırına yapıştırın:

```sql
INSERT INTO kullanicilar (ad, email, sifre, rol, aktif) VALUES 
('Admin', 'admin@afganistan-ilanlar.com', '$2a$10$YourHashedPasswordHere', 'admin', TRUE);
```

### 6. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Site şu adreste çalışacak: http://localhost:3000

### 7. Admin Paneline Erişim

Admin paneli: http://localhost:3000/admin

## Örnek İlan Ekleme

Test için veritabanına örnek ilanlar ekleyin:

```sql
-- Örnek kullanıcı
INSERT INTO kullanicilar (ad, email, telefon, sifre, rol) VALUES 
('Test Kullanıcı', 'test@test.com', '+93700000000', '$2a$10$hash', 'user');

-- Örnek ilan
INSERT INTO ilanlar (baslik, aciklama, fiyat, kategori_id, il_id, kullanici_id, durum, onecikan, onecikan_sira) VALUES 
('Toyota Corolla 2015', 'Temiz kullanılmış araç, bakımlı', 50000, 1, 1, 2, 'kullanilmis', TRUE, 1);

INSERT INTO ilanlar (baslik, aciklama, fiyat, kategori_id, il_id, kullanici_id, durum, onecikan, onecikan_sira) VALUES 
('iPhone 13 Pro', 'Az kullanılmış, 256GB', 25000, 3, 1, 2, 'az_kullanilmis', TRUE, 2);

INSERT INTO ilanlar (baslik, aciklama, fiyat, kategori_id, il_id, kullanici_id, durum) VALUES 
('Samsung Smart TV 55"', 'Sıfır kutusunda', 30000, 3, 2, 2, 'yeni');
```

## Production (Canlı) Ortam

### Build Alma

```bash
npm run build
```

### Çalıştırma

```bash
npm start
```

## Önemli Notlar

1. **Güvenlik**: Production ortamında mutlaka güçlü şifreler kullanın
2. **Resim Yükleme**: `/public/uploads` klasörüne yazma izni verin
3. **SSL**: Canlı ortamda HTTPS kullanın
4. **Veritabanı Yedekleme**: Düzenli olarak veritabanını yedekleyin
5. **Environment Variables**: `.env` dosyasını asla git'e eklemeyin

## Özellikler

✅ Sol sidebar ile kategori navigasyonu
✅ Hero alanında adminin seçtiği öne çıkan ilanlar
✅ Modern ve responsive tasarım
✅ İlan detay sayfası
✅ Kategori sayfaları
✅ Arama fonksiyonu
✅ Admin paneli
✅ MySQL veritabanı entegrasyonu

## Destek

Sorunlarla karşılaşırsanız:
1. Veritabanı bağlantısını kontrol edin
2. `.env` dosyasının doğru yapılandırıldığından emin olun
3. `npm install` komutunu tekrar çalıştırın
4. Node.js ve MySQL versiyonlarını kontrol edin

## Lisans

MIT

