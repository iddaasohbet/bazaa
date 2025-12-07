# 🌟 BazaareWatan - بازار وطن

**Afganistan'ın Modern İlan ve E-Ticaret Platformu**

Tam kapsamlı, modern ve profesyonel ilan sitesi. Next.js 16, React 19, TypeScript, MySQL ve Tailwind CSS ile geliştirilmiştir.

---

## 🚀 Özellikler

### 🏪 3 Seviyeli Mağaza Sistemi
- **Basic Store** (رایگان) - Yeni başlayanlar için
- **Pro Store** (350-735 AFN) - Profesyonel satıcılar için
- **Elite Store** (570-1197 AFN) - Şirketler ve büyük satıcılar için

### 🎯 Temel Özellikler
- ✅ Tam responsive tasarım (mobil, tablet, desktop)
- ✅ RTL (Sağdan Sola) Dari dili desteği
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ Gelişmiş arama ve filtreleme
- ✅ Kategori bazlı listeleme
- ✅ Şehir bazlı filtreleme
- ✅ Favorilere ekleme
- ✅ Kullanıcı profilleri
- ✅ Mesajlaşma sistemi

### 💎 Premium Özellikler
- ✅ Vitrin sistemi (Ana sayfa, Kategori, Arama)
- ✅ Banner reklam sistemi
- ✅ Sponsorlu mağaza gösterimi
- ✅ İndirim sistemi (Pro & Elite için)
- ✅ Ürün yükseltme (Vitrin, Öne Çıkan)
- ✅ Paket satın alma
- ✅ Ödeme sistemi
- ✅ Gelişmiş analitik
- ✅ Otomasyonlar (Elite için)

### 🛡️ Admin Panel
- ✅ Modern dashboard (Dari dili)
- ✅ İlan yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Mağaza yönetimi
- ✅ Vitrin yönetimi
- ✅ Reklam yönetimi
- ✅ Ödeme yönetimi
- ✅ İstatistikler ve raporlar

---

## 📋 Kurulum

### 1. Gereksinimler
- Node.js 18+ 
- MySQL 8.0+
- npm veya yarn

### 2. Projeyi Klonlama
```bash
git clone https://github.com/username/bazaarewatan.git
cd bazaarewatan
```

### 3. Bağımlılıkları Yükleme
```bash
npm install
```

### 4. Veritabanı Kurulumu

#### a) Veritabanını Oluştur
```bash
mysql -u root -p
```
```sql
CREATE DATABASE afganistan_ilanlar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### b) Tabloları Oluştur
```bash
mysql -u root -p afganistan_ilanlar < database.sql
```

#### c) Paket Verilerini Ekle
```bash
mysql -u root -p afganistan_ilanlar < MIGRATION_PAKETLER.sql
```

### 5. Environment Variables
```bash
# env.example dosyasını kopyala
cp env.example .env.local

# .env.local dosyasını düzenle
# Veritabanı bilgilerini gir
```

### 6. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

Site şu adreste açılacak: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Veritabanı Yapısı

### Ana Tablolar
- `kullanicilar` - Kullanıcı hesapları
- `ilanlar` - Ürün ilanları (indirim desteği ile)
- `kategoriler` - Kategori yönetimi
- `iller` - Şehir listesi
- `magazalar` - Mağaza bilgileri (3 seviye)
- `paketler` - Paket tanımları

### Premium Tablolar
- `vitrinler` - Vitrin ilanları
- `reklamlar` - Banner reklamlar
- `odemeler` - Ödeme kayıtları
- `store_features` - Mağaza özellikleri
- `store_analytics` - Analitik veriler
- `store_automation` - Otomasyon ayarları
- `urun_yukseltme_gecmisi` - Yükseltme geçmişi

---

## 📱 Sayfa Yapısı

### Kullanıcı Sayfaları
- `/` - Ana sayfa (Slider + Vitrin + İlanlar)
- `/kategori/[slug]` - Kategori sayfası
- `/arama` - Arama sonuçları
- `/ilan/[id]` - İlan detay
- `/ilan-ver` - Yeni ilan ekleme
- `/magaza/[id]` - Mağaza profili
- `/magaza-paket` - Paket seçim sayfası
- `/giris` - Kullanıcı girişi
- `/kayit` - Kullanıcı kaydı
- `/profilim` - Profil ayarları
- `/ilanlarim` - İlanlarım
- `/favoriler` - Favorilerim
- `/mesajlar` - Mesajlar

### Admin Sayfaları
- `/admin/giris` - Admin girişi
- `/admin/dashboard` - Dashboard
- `/admin/ilanlar` - İlan yönetimi
- `/admin/kullanicilar` - Kullanıcı yönetimi
- `/admin/magazalar` - Mağaza yönetimi
- `/admin/vitrin` - Vitrin yönetimi
- `/admin/reklamlar` - Reklam yönetimi
- `/admin/odemeler` - Ödeme yönetimi
- `/admin/paketler` - Paket yönetimi

---

## 🔌 API Endpoints

### İlanlar
- `GET /api/ilanlar` - İlan listesi
- `GET /api/ilanlar/[id]` - İlan detayı
- `GET /api/ilanlar/onecikan` - Öne çıkan ilanlar

### Vitrin
- `GET /api/vitrin` - Vitrin ilanları
- `POST /api/vitrin` - Vitrine ekle
- `DELETE /api/vitrin` - Vitrinden kaldır

### Reklamlar
- `GET /api/reklamlar` - Reklam getir
- `POST /api/reklamlar` - Reklam ekle
- `POST /api/reklamlar/tikla/[id]` - Tıklama kaydet

### Paketler
- `GET /api/paketler` - Tüm paketler
- `GET /api/magazalar/[id]` - Mağaza detayı
- `GET /api/magazalar/sponsorlu` - Sponsorlu mağazalar

### Ödemeler
- `POST /api/odemeler` - Ödeme oluştur
- `PATCH /api/odemeler/[id]` - Ödeme durumu güncelle

### Admin
- `POST /api/admin/giris` - Admin girişi
- `GET /api/admin/dashboard/stats` - Dashboard istatistikleri
- `GET /api/admin/vitrin` - Vitrin yönetimi
- `GET /api/admin/reklamlar` - Reklam yönetimi

---

## 💰 Paket Fiyatlandırması

| Paket | Aylık | 3 Aylık | İndirim | Tasarruf |
|-------|-------|---------|---------|----------|
| **Basic** | 0 AFN | 0 AFN | - | - |
| **Pro** | 350 AFN | 735 AFN | 30% | 315 AFN |
| **Elite** | 570 AFN | 1,197 AFN | 30% | 513 AFN |

---

## 🛠️ Teknolojiler

- **Framework:** Next.js 16.0 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4
- **Database:** MySQL 8.0+ (mysql2)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Carousel:** Embla Carousel
- **Password:** bcryptjs

---

## 📂 Proje Yapısı

```
genel/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin panel sayfaları
│   │   ├── api/            # API routes
│   │   ├── magaza-paket/   # Paket seçim sayfası
│   │   ├── kategori/       # Kategori sayfaları
│   │   └── ...
│   ├── components/
│   │   ├── AdminLayout.tsx
│   │   ├── PaketCard.tsx
│   │   ├── VitrinAds.tsx
│   │   ├── BannerReklam.tsx
│   │   └── ...
│   └── lib/
│       ├── db.ts           # Database connection
│       └── utils.ts        # Utility functions
├── public/
│   ├── images/
│   └── uploads/
├── database.sql            # Ana veritabanı şeması
├── MIGRATION_PAKETLER.sql  # Paket verileri
├── README.md
├── env.example
└── package.json
```

---

## 🔐 Varsayılan Admin Girişi

**UYARI:** Production'da mutlaka değiştirin!

```
Email: admin@bazaarewatan.com
Şifre: admin123
```

---

## 📝 Deployment

### Vercel'e Deploy
```bash
# Vercel CLI kur
npm i -g vercel

# Deploy et
vercel
```

### Environment Variables (Vercel)
Vercel dashboard'da şu değişkenleri ekle:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL=true`

---

## 🧪 Test

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

---

## 📚 Dökümanlar

- `VITRIN_REKLAM_SISTEMI.md` - Vitrin ve reklam sistemi detayları
- `MAGAZA_PAKET_SISTEMI.md` - Mağaza paket sistemi detayları
- `PAKET_FIYATLARI.md` - Paket fiyatlandırması

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

---

## 📄 Lisans

MIT License - İsterseniz değiştirebilirsiniz

---

## 🆘 Destek

Sorunlarınız için:
- GitHub Issues açın
- Email: support@bazaarewatan.com

---

## 🎉 Teşekkürler

BazaareWatan'ı kullandığınız için teşekkürler!

**بازار وطن - مارکیت شماره یک افغانستان** 🇦🇫


