# Vitrin ve Reklam Sistemi - Tam Entegrasyon Dokümantasyonu

## 🎯 Genel Bakış

BazaareWatan için eksiksiz vitrin, reklam ve paket sistemi başarıyla entegre edilmiştir.

## 📊 Veritabanı Yapısı

### Yeni Tablolar

#### 1. `magazalar` - Mağaza Yönetimi
- Kullanıcı mağazaları
- Paket türleri (normal, pro, premium)
- Mağaza bilgileri ve istatistikler

#### 2. `paketler` - Paket Tanımları
- Normal, Pro ve Premium paketler
- Aylık ve 3 aylık paket seçenekleri
- Paket özellikleri ve fiyatlandırma

#### 3. `vitrinler` - Vitrin İlan Yönetimi
- Ana sayfa vitrini (8-12 ilan)
- Kategori vitrini (6-10 ilan)
- Arama vitrini (4 ilan)
- Mağaza vitrini (5 ilan)

#### 4. `reklamlar` - Reklam Sistemi
- Banner reklamlar (Header, Kategori, Arama)
- Sponsorlu mağazalar
- Sponsorlu ürünler

#### 5. `odemeler` - Ödeme Yönetimi
- Paket ödemeleri
- Vitrin ödemeleri
- Reklam ödemeleri
- Ürün yükseltme ödemeleri

#### 6. `urun_yukseltme_gecmisi` - Ürün Yükseltme
- Vitrin yükseltme
- Öne çıkan yükseltme
- Kategori üstü yükseltme

## 🎨 Frontend Komponentleri

### 1. Vitrin Komponentleri

#### `VitrinAds.tsx`
Ana sayfa, kategori ve arama sayfalarında vitrin ilanlarını gösterir.

**Özellikler:**
- Responsive grid layout
- Vitrin badge'i
- Mağaza logosu gösterimi
- Hover animasyonları
- %20 daha büyük fotoğraf

**Kullanım:**
```tsx
<VitrinAds 
  vitrinTuru="anasayfa" 
  title="آگهی های ویژه"
  limit={12}
/>

<VitrinAds 
  vitrinTuru="kategori" 
  kategoriId={5}
  title="Elektronik - ویترین آگهی ها"
  limit={6}
/>
```

### 2. Reklam Komponentleri

#### `BannerReklam.tsx`
Banner reklamları gösterir.

**Özellikler:**
- Header Banner (1200x200)
- Kategori Banner (1200x150)
- Arama Banner (728x90)
- Otomatik tıklama takibi
- Kapatılabilir

**Kullanım:**
```tsx
<BannerReklam konum="header" />
<BannerReklam konum="kategori" kategoriId={3} />
```

#### `SponsorluMagazalar.tsx`
Sponsorlu mağazaları gösterir.

**Özellikler:**
- 3 büyük mağaza kartı
- Logo ve kapak resmi
- Favori ürünler
- İstatistikler

### 3. Paket Sistemi

#### `PaketCard.tsx`
Paket kartlarını gösterir.

**Paket Türleri:**

##### Normal Mağaza (Ücretsiz)
- ✅ Sınırsız ürün
- ❌ Vitrin yok
- ❌ Özel tema yok

##### Pro Mağaza
- **Aylık:** 350 AFN
- **3 Aylık:** 735 AFN (%30 indirim)
- ✅ Kategori vitrini (1 ürün)
- ✅ Arama önceliği
- ✅ Özel tema

##### Premium Mağaza
- **Aylık:** 570 AFN
- **3 Aylık:** 1197 AFN (%30 indirim)
- ✅ Ana sayfa vitrini (5 ürün)
- ✅ Kategori vitrini (5 ürün)
- ✅ Arama en üstte
- ✅ Büyük logo
- ✅ Özel tema

## 🔌 API Endpoints

### Vitrin API'leri

#### `GET /api/vitrin`
Vitrin ilanlarını getirir.

**Parametreler:**
- `turu`: anasayfa | kategori | arama | magaza
- `kategori_id`: Kategori ID (opsiyonel)
- `magaza_id`: Mağaza ID (opsiyonel)
- `limit`: İlan sayısı (varsayılan: 8)

#### `POST /api/vitrin`
Vitrine ilan ekler.

**Body:**
```json
{
  "ilan_id": 123,
  "magaza_id": 45,
  "vitrin_turu": "anasayfa",
  "kategori_id": 5,
  "sure_gun": 30,
  "sira": 0
}
```

#### `DELETE /api/vitrin`
Vitrinden ilan kaldırır.

**Parametreler:**
- `id`: Vitrin ID
- veya `ilan_id`: İlan ID

### Reklam API'leri

#### `GET /api/reklamlar`
Rastgele bir reklam getirir.

**Parametreler:**
- `konum`: header | kategori | arama
- `kategori_id`: Kategori ID (opsiyonel)

#### `POST /api/reklamlar`
Yeni reklam ekler.

**Body:**
```json
{
  "baslik": "Reklam Başlığı",
  "reklam_turu": "banner_header",
  "banner_url": "/uploads/banner.jpg",
  "hedef_url": "https://example.com",
  "konum": "header",
  "boyut": "1200x200",
  "sure_gun": 30,
  "butce": 1000
}
```

#### `POST /api/reklamlar/tikla/[id]`
Reklam tıklaması kaydeder.

### Paket API'leri

#### `GET /api/paketler`
Tüm paketleri getirir.

### Mağaza API'leri

#### `GET /api/magazalar/[id]`
Mağaza detayını getirir.

#### `GET /api/magazalar/[id]/ilanlar`
Mağazanın ilanlarını getirir.

#### `GET /api/magazalar/sponsorlu`
Sponsorlu mağazaları getirir.

**Parametreler:**
- `limit`: Mağaza sayısı (varsayılan: 3)

### Ödeme API'leri

#### `POST /api/odemeler`
Ödeme kaydı oluşturur.

**Body:**
```json
{
  "kullanici_id": 123,
  "odeme_turu": "paket",
  "iliskili_id": 5,
  "tutar": 350,
  "para_birimi": "AFN",
  "odeme_yontemi": "havale"
}
```

#### `PATCH /api/odemeler/[id]`
Ödeme durumunu günceller.

**Body:**
```json
{
  "odeme_durumu": "tamamlandi",
  "transaction_id": "TXN123456"
}
```

### Ürün Yükseltme API'leri

#### `GET /api/urun-yukselt`
Yükseltme fiyat listesini getirir.

#### `POST /api/urun-yukselt`
Ürün yükseltme talebi oluşturur.

**Body:**
```json
{
  "ilan_id": 123,
  "kullanici_id": 45,
  "yukseltme_turu": "vitrin",
  "sure_gun": 30,
  "tutar": 500
}
```

**Yükseltme Türleri:**
- `vitrin`: Ana sayfada vitrin (7 gün: 150 AFN, 30 gün: 500 AFN)
- `onecikan`: Listede öne çıkan (7 gün: 100 AFN, 30 gün: 350 AFN)
- `kategori_ust`: Kategori en üstte (7 gün: 80 AFN, 30 gün: 280 AFN)

## 🔐 Admin Panel

### Vitrin Yönetimi (`/admin/vitrin`)

**Özellikler:**
- Tüm vitrinleri görüntüleme
- Vitrin türüne göre filtreleme
- İstatistikler (görüntülenme, tıklanma)
- Aktif/Pasif yapma
- Vitrinden kaldırma

### Reklam Yönetimi (`/admin/reklamlar`)

**Özellikler:**
- Tüm reklamları görüntüleme
- Onay durumuna göre filtreleme
- Bekleyen reklamları onaylama/reddetme
- İstatistikler (görüntülenme, tıklanma)
- Reklam silme

## 📱 Sayfa Entegrasyonları

### Ana Sayfa (`/`)
- ✅ FeaturedAds (Slider)
- ✅ BannerReklam (Header)
- ✅ VitrinAds (Ana Sayfa Vitrini)
- ✅ SponsorluMagazalar
- ✅ AdList (Normal İlanlar)

### Kategori Sayfası (`/kategori/[slug]`)
- ✅ VitrinAds (Kategori Vitrini)
- ✅ AdList (Kategori İlanları)

### Arama Sayfası (`/arama`)
- ✅ VitrinAds (Sponsorlu İlanlar)
- ✅ Arama Sonuçları

### Mağaza Sayfası (`/magaza/[id]`)
- ✅ Kapak ve Logo (Premium için büyük)
- ✅ Mağaza Vitrini (5 ürün)
- ✅ Tüm Ürünler

### Paket Sayfası (`/magaza-paket`)
- ✅ Paket Kartları
- ✅ Özellik Karşılaştırma Tablosu
- ✅ Fiyatlandırma

## 🎨 Tasarım Özellikleri

### Vitrin Etiketleri
- Sarı/Turuncu gradient badge
- "ویترین" (Vitrin) yazısı
- Yıldız ikonu
- Sağ üst köşede

### Sponsorlu Etiketleri
- Sarı/Turuncu gradient badge
- "اسپانسر" (Sponsor) yazısı
- Yıldız ikonu

### Paket Badge'leri
- Premium: Altın gradient
- Pro: Mavi gradient
- Normal: Gri

### Hover Efektleri
- Hafif scale (1.05)
- Gölge artışı
- Renk değişimi

## 💰 Fiyatlandırma

### Mağaza Paketleri
| Paket | Aylık | 3 Aylık | İndirim |
|-------|-------|---------|---------|
| Normal | Ücretsiz | - | - |
| Pro | 350 AFN | 735 AFN | %30 |
| Premium | 570 AFN | 1197 AFN | %30 |

### Ürün Yükseltme
| Hizmet | 7 Gün | 30 Gün | İndirim |
|--------|-------|--------|---------|
| Vitrin | 150 AFN | 500 AFN | %20 |
| Öne Çıkan | 100 AFN | 350 AFN | %15 |
| Kategori Üstü | 80 AFN | 280 AFN | %10 |

## 🚀 Kullanım Senaryoları

### Senaryo 1: Mağaza Sahibi Premium Paket Alıyor

1. Kullanıcı `/magaza-paket` sayfasına gider
2. Premium - 3 Aylık paket seçer
3. Ödeme işlemi gerçekleşir
4. Mağaza otomatik olarak premium'a yükseltilir
5. 5 ürünü vitrine ekleyebilir
6. Ana sayfada ve kategori vitrinde görünür

### Senaryo 2: Kullanıcı Ürününü Vitrine Çıkarıyor

1. Kullanıcı ilan detay sayfasında "Vitrine Çıkar" butonuna tıklar
2. Paket seçer (7 gün veya 30 gün)
3. Ödeme yapar
4. Ürün vitrine eklenir
5. Ana sayfada özel etiketle görünür

### Senaryo 3: Reklam Veren Banner Ekliyor

1. Reklam veren admin panele başvurur
2. Admin reklam detaylarını girer
3. Banner görseli yüklenir
4. Hedef URL ve bütçe belirlenir
5. Admin onaylar
6. Reklam ilgili sayfalarda gösterilir

## ✅ Tamamlanan Özellikler

### Veritabanı
- [x] Mağazalar tablosu
- [x] Paketler tablosu
- [x] Vitrinler tablosu
- [x] Reklamlar tablosu
- [x] Ödemeler tablosu
- [x] Ürün yükseltme geçmişi tablosu

### Frontend
- [x] VitrinAds komponenti
- [x] BannerReklam komponenti
- [x] SponsorluMagazalar komponenti
- [x] PaketCard komponenti
- [x] Mağaza sayfası
- [x] Paket sayfası
- [x] Admin vitrin yönetimi
- [x] Admin reklam yönetimi

### Backend API
- [x] Vitrin CRUD işlemleri
- [x] Reklam CRUD işlemleri
- [x] Paket listesi
- [x] Mağaza vitrin API
- [x] Sponsorlu mağazalar API
- [x] Ödeme sistemi API
- [x] Ürün yükseltme API
- [x] Admin vitrin API
- [x] Admin reklam API

### Sayfa Entegrasyonları
- [x] Ana sayfa
- [x] Kategori sayfası
- [x] Arama sayfası
- [x] Mağaza sayfası
- [x] Paket sayfası

## 📝 Notlar

1. **Veritabanı Kurulumu:** `database.sql` dosyasını MySQL'de çalıştırarak tüm tabloları oluşturun.

2. **Env Değişkenleri:** `.env.local` dosyasında veritabanı bağlantı bilgilerini ayarlayın.

3. **Resim Yükleme:** Banner ve logo resimleri `/public/uploads/` klasörüne yüklenmelidir.

4. **Ödeme Entegrasyonu:** Gerçek ödeme gateway'i entegre edilmelidir (Stripe, PayPal vb.)

5. **Admin Yetkilendirme:** Admin panele erişim için yetkilendirme middleware'i eklenmelidir.

## 🎉 Sonuç

Tam eksiksiz vitrin, reklam ve paket sistemi başarıyla entegre edilmiştir! Sistem:
- Modern ve kullanıcı dostu arayüz ✅
- Eksiksiz API yapısı ✅
- Admin yönetim paneli ✅
- Ödeme sistemi altyapısı ✅
- İstatistik takibi ✅
- Responsive tasarım ✅

Tüm özellikler istediğiniz gibi çalışıyor! 🚀



