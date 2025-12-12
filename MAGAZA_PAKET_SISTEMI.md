# 🏪 3 Seviyeli Mağaza Paketi Sistemi

## 📋 Genel Bakış

BazaareWatan için tam kapsamlı 3 seviyeli mağaza paketi sistemi:
- **Basic Store** (Temel)
- **Pro Store** (Orta Seviye)
- **Elite Store** (Premium)

---

## 🟦 BASIC STORE - Temel Paket

### Fiyat
- **Ücretsiz** (0 AFN)

### Limitler
- ✅ Maksimum 50 ürün
- ✅ Sadece 1 kategori
- ✅ Standart listeleme (öncelik yok)

### Özellikler
| Özellik | Durum |
|---------|-------|
| Ürün Limiti | 50 |
| Kategori Limiti | 1 |
| Listeleme Önceliği | Yok (priority=0) |
| Arama Ağırlığı | 1.0 (standart) |
| Analitik | Temel (görüntülenme, favori) |
| Mağaza Teması | Varsayılan |
| Özel URL | ❌ |
| Logo/Banner | ❌ |
| Toplu Yükleme | ❌ |
| Video | ❌ |
| İndirim Gösterimi | ❌ |
| Doğrulama Rozeti | ❌ |
| Destek | Normal |

### Veritabanı Ayarları
```sql
store_level = 'basic'
product_limit = 50
category_limit = 1
listing_priority = 0
search_weight = 1.0
analytics_access = 'basic'
theme = 'default'
```

---

## 🟩 PRO STORE - Orta Seviye Paket

### Fiyat
- **Aylık:** 350 AFN
- **3 Aylık:** 735 AFN (%30 indirim - 315 AFN tasarruf)

### Limitler
- ✅ Maksimum 200 ürün
- ✅ Maksimum 3 kategori
- ✅ Pro önceliği

### Özellikler
| Özellik | Durum |
|---------|-------|
| Ürün Limiti | 200 |
| Kategori Limiti | 3 |
| Listeleme Önceliği | +1 (priority=1) |
| Arama Ağırlığı | 1.5 (+50% görünürlük) |
| Analitik | Gelişmiş (günlük/haftalık raporlar) |
| Mağaza Teması | Özelleştirilebilir |
| Özel Tasarım | ✅ Kapak, Banner, Renk |
| Özel URL | ❌ |
| Logo/Banner | ✅ |
| Toplu Yükleme | ✅ CSV/Excel |
| Video | ❌ |
| **İndirim Gösterimi** | ✅ **Aktif** |
| Reklam İndirimi | %25 |
| Yorum Sistemi | ✅ |
| Doğrulama | Hızlı onay |
| Destek | Hızlı (12 saat) |

### Veritabanı Ayarları
```sql
store_level = 'pro'
product_limit = 200
category_limit = 3
listing_priority = 1
search_weight = 1.5
analytics_access = 'intermediate'
theme = 'customizable'
listing_discount = 25
bulk_upload = TRUE
support_level = 'fast'
```

### İndirim Gösterimi
Pro ve Elite mağazalarda ürün indirimdeyken:
- ✅ **Eski fiyat** (üstü çizili)
- ✅ **Yeni fiyat** (vurgulu)
- ✅ **% indirim badge** (otomatik hesaplama)

```tsx
// Örnek görünüm
<div>
  <span className="line-through text-gray-500">85,000 AFN</span>
  <span className="text-2xl font-bold text-red-600">59,500 AFN</span>
  <span className="bg-red-500 text-white px-2 py-1 rounded">-30%</span>
</div>
```

---

## 🟧 ELITE STORE - Premium Paket

### Fiyat
- **Aylık:** 570 AFN
- **3 Aylık:** 1,197 AFN (%30 indirim - 513 AFN tasarruf)

### Limitler
- ✅ **Sınırsız** ürün
- ✅ **Sınırsız** kategori
- ✅ En yüksek öncelik

### Özellikler
| Özellik | Durum |
|---------|-------|
| Ürün Limiti | ∞ Sınırsız |
| Kategori Limiti | ∞ Sınırsız |
| Listeleme Önceliği | +2 (priority=2 - En üst) |
| Arama Ağırlığı | 2.0 (x2 Boost) |
| Ana Sayfa Vitrini | ✅ Sabit slot |
| Haftalık Öne Çıkarma | ✅ Otomatik ücretsiz |
| Aylık Reklam Kredisi | 500 AFN (Aylık) / 1500 AFN (3 Aylık) |
| Analitik | Premium (saatlik, heatmap) |
| Mağaza Teması | Premium (özel tasarım) |
| **Özel URL** | ✅ `bazaarewatan.com/store/{ad}` |
| Logo/Banner | ✅ Tam özelleştirme |
| Toplu Yükleme | ✅ CSV/Excel |
| **Video Yükleme** | ✅ Sınırsız |
| **İndirim Gösterimi** | ✅ **Aktif** |
| **Doğrulama Rozeti** | ✅ İşletme rozeti |
| Toplu Mesaj | ✅ Kampanya duyurusu |
| Otomasyonlar | ✅ Stok, Fiyat, Sıralama |
| Destek | VIP 24/7 |

### Veritabanı Ayarları
```sql
store_level = 'elite'
product_limit = 999999
category_limit = 999
listing_priority = 2
search_weight = 2.0
analytics_access = 'advanced'
theme = 'premium'
homepage_vip_slot = TRUE
weekly_auto_feature = TRUE
monthly_ad_credit = 500.00
bulk_upload = TRUE
video_upload = TRUE
custom_url = TRUE
custom_branding = TRUE
verification_badge = TRUE
support_level = 'vip'
```

### Otomasyon Özellikleri
```json
{
  "auto_feature_enabled": true,
  "auto_stock_alert": true,
  "auto_price_update": true,
  "auto_sort": true
}
```

---

## 💰 İndirim Sistemi (Pro & Elite)

### Veritabanı Alanları
```sql
ALTER TABLE ilanlar ADD COLUMN eski_fiyat DECIMAL(15, 2) NULL;
ALTER TABLE ilanlar ADD COLUMN indirim_yuzdesi INT DEFAULT 0;
```

### Kullanım
```javascript
// Ürün eklerken
const eskiFiyat = 85000;
const yeniFiyat = 59500;
const indirimYuzdesi = calculateDiscount(eskiFiyat, yeniFiyat); // 30%

// Gösterimde
if (canShowDiscount(storeLevel) && eskiFiyat > yeniFiyat) {
  // İndirim göster
}
```

### Frontend Gösterimi
```tsx
{eski_fiyat && indirim_yuzdesi > 0 && (
  <div className="flex items-center gap-2">
    <span className="text-lg line-through text-gray-500">
      {formatPrice(eski_fiyat)}
    </span>
    <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">
      -{indirim_yuzdesi}%
    </span>
  </div>
)}
<div className="text-2xl font-bold text-red-600">
  {formatPrice(fiyat)}
</div>
```

---

## 🎯 Sıralama ve Görünürlük

### Ana Sayfa
1. **Elite** mağazalar → Sabit VIP slot (en üstte)
2. **Pro** mağazalar → Üst sıralarda (priority=1)
3. **Basic** mağazalar → Standart sıra (priority=0)

### Arama Sonuçları
```sql
ORDER BY 
  listing_priority DESC,
  (search_weight * relevance_score) DESC,
  created_at DESC
```

### Kategori Listeleme
```sql
SELECT * FROM ilanlar i
INNER JOIN magazalar m ON i.magaza_id = m.id
ORDER BY 
  m.listing_priority DESC,
  m.search_weight DESC,
  i.created_at DESC
```

---

## 📊 Analitik Seviyeleri

### Basic
- Görüntülenme sayısı
- Favori sayısı

### Intermediate (Pro)
- Günlük/haftalık raporlar
- Çok satan ürünler
- Tıklama-satış dönüşümü

### Advanced (Elite)
- Saatlik ziyaretçi akışı
- Reklam-dönüşüm analizi
- Kullanıcı davranış haritası (heatmap)
- Detaylı demografik bilgiler

---

## 🔧 Backend Kontroller

### Ürün Ekleme
```javascript
if (store.product_count >= store.product_limit) {
  throw new Error('Ürün limitine ulaştınız');
}
```

### Kategori Seçimi
```javascript
if (selected_categories > store.category_limit) {
  throw new Error('Kategori limitini aştınız');
}
```

### İndirim Gösterimi
```javascript
if (!canShowDiscount(store.store_level)) {
  // İndirim özelliği kullanılamaz
  eski_fiyat = null;
  indirim_yuzdesi = 0;
}
```

---

## 🎨 Frontend Farklılıkları

### Basic Mağaza Sayfası
```tsx
<div className="bg-white">
  <h1>{store.ad}</h1>
  <p>{store.aciklama}</p>
  {/* Basit liste */}
</div>
```

### Pro Mağaza Sayfası
```tsx
<div className="bg-white">
  <div className="relative">
    <img src={store.kapak_resmi} />
    <img src={store.banner} />
  </div>
  <h1 style={{ color: store.tema_renk }}>{store.ad}</h1>
  {/* Özelleştirilmiş tema */}
</div>
```

### Elite Mağaza Sayfası
```tsx
<div className="premium-theme">
  <div className="vip-header">
    <img src={store.logo} className="large-logo" />
    <span className="verification-badge">✓ Verified</span>
  </div>
  {/* Premium tasarım + özel URL */}
</div>
```

---

## ✅ Tamamlanan Özellikler

- [x] 3 seviyeli paket sistemi
- [x] Veritabanı yapısı
- [x] İndirim sistemi (Pro & Elite)
- [x] Öncelik ve ağırlık sistemi
- [x] Analitik seviyeleri
- [x] Otomasyon tablosu
- [x] Limit kontrolleri
- [x] Util fonksiyonları

---

## 🚀 Kurulum

1. SQL dosyasını çalıştır: `database.sql`
2. Paket verilerini kontrol et
3. API endpoint'lerini test et
4. Frontend komponentlerini kontrol et

Sistem hazır! 🎉


