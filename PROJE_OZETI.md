# Afganistan İlan Sitesi - Proje Özeti

## 📋 Genel Bakış

Afganistan için özel olarak tasarlanmış, modern bir ilan platformu. E-ticaret sitesinin alt yapısından yararlanılarak geliştirilmiştir.

## ✨ Özellikler

### Ana Özellikler
- ✅ **Sol Sidebar**: Tüm kategorilerin listelendiği sidebar
- ✅ **Hero Alan**: Admin tarafından seçilen öne çıkan ilanlar (carousel)
- ✅ **İlan Listesi**: Sidebar'ın sağında tüm ilanların grid şeklinde listelenmesi
- ✅ **Responsive Tasarım**: Mobil, tablet ve desktop uyumlu
- ✅ **Modern UI/UX**: Framer Motion animasyonları

### Sayfa Yapısı

#### Kullanıcı Tarafı
1. **Ana Sayfa** (`/`)
   - Sol sidebar (kategoriler)
   - Hero carousel (öne çıkan ilanlar)
   - İlan grid listesi
   - Load more özelliği

2. **İlan Detay** (`/ilan/[id]`)
   - Resim galerisi (thumbnail + büyük görsel)
   - İlan bilgileri
   - Fiyat ve durum
   - Satıcı bilgileri
   - İletişim butonları

3. **Kategori Sayfası** (`/kategori/[slug]`)
   - Kategoriye özel ilanlar
   - Filtreleme seçenekleri

4. **Arama** (`/arama`)
   - Anahtar kelimeye göre ilan arama
   - Sonuç listesi

5. **İlan Ver** (`/ilan-ver`)
   - Detaylı form
   - Çoklu resim yükleme
   - Kategori ve şehir seçimi

6. **Kullanıcı Sayfaları**
   - Giriş (`/giris`)
   - Kayıt (`/kayit`)
   - Profil (`/profilim`)
   - Favoriler (`/favoriler`)
   - Mesajlar (`/mesajlar`)

7. **Bilgilendirme Sayfaları**
   - Hakkımızda (`/hakkimizda`)
   - İletişim (`/iletisim`)
   - Gizlilik Politikası (`/gizlilik`)
   - Kullanım Koşulları (`/kullanim-kosullari`)

#### Admin Paneli
1. **Dashboard** (`/admin`)
   - İstatistikler
   - Hızlı işlemler
   - Son ilanlar

2. **Öne Çıkan İlanlar** (`/admin/onecikan`)
   - İlan ekleme/çıkarma
   - Sıralama yönetimi

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animasyonlar
- **Embla Carousel** - Slider/carousel
- **Lucide React** - İkonlar

### Backend
- **Next.js API Routes** - Backend API
- **MySQL 8** - Veritabanı
- **mysql2** - MySQL client
- **bcryptjs** - Şifreleme

## 📁 Proje Yapısı

```
genel/
├── public/
│   ├── images/
│   │   └── placeholder.jpg
│   ├── uploads/
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── onecikan/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── ilanlar/
│   │   │   │   ├── onecikan/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── kategoriler/
│   │   │   └── iller/
│   │   ├── arama/
│   │   ├── favoriler/
│   │   ├── giris/
│   │   ├── hakkimizda/
│   │   ├── ilan/
│   │   │   └── [id]/
│   │   ├── ilan-ver/
│   │   ├── iletisim/
│   │   ├── kategori/
│   │   │   └── [slug]/
│   │   ├── kayit/
│   │   ├── mesajlar/
│   │   ├── profilim/
│   │   ├── gizlilik/
│   │   ├── kullanim-kosullari/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AdList.tsx
│   │   ├── FeaturedAds.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── lib/
│       ├── db.ts
│       └── utils.ts
├── database.sql
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── KURULUM.md
├── PROJE_OZETI.md
└── README.md
```

## 🗄️ Veritabanı Yapısı

### Tablolar
1. **kategoriler** - İlan kategorileri
2. **iller** - Afganistan şehirleri
3. **kullanicilar** - Kullanıcı bilgileri
4. **ilanlar** - İlan bilgileri
5. **ilan_resimleri** - İlan görselleri
6. **favoriler** - Kullanıcı favorileri

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Veritabanını oluşturun:
```bash
mysql -u root -p < database.sql
```

3. `.env` dosyasını yapılandırın:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=afganistan_ilanlar
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcıda açın: http://localhost:3000

## 🎨 Tasarım Özellikleri

- **Renk Paleti**: Blue-Purple gradient (modern ve profesyonel)
- **Tipografi**: Inter font family
- **Spacing**: Tutarlı 4px grid sistemi
- **Icons**: Lucide React (500+ ikon)
- **Animasyonlar**: Framer Motion ile smooth transitions

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔐 Güvenlik

- Şifreler bcrypt ile hash'leniyor
- SQL injection koruması (prepared statements)
- HTTPS zorunluluğu (production)
- XSS koruması (React DOM escape)

## 📈 Gelecek Özellikler

- [ ] Gerçek zamanlı mesajlaşma (WebSocket)
- [ ] Ödeme entegrasyonu
- [ ] SMS bildirimleri
- [ ] Mobil uygulama (React Native)
- [ ] Gelişmiş filtreleme
- [ ] Konum bazlı arama
- [ ] Sosyal medya paylaşım
- [ ] Çoklu dil desteği (Farsça/Pashto)

## 🤝 Katkıda Bulunma

Bu proje açık kaynak değildir, ancak önerilerinizi memnuniyetle karşılarız.

## 📞 Destek

- Email: info@afganistan-ilanlar.com
- Telefon: +93 700 000 000

## 📄 Lisans

MIT License

---

**Not**: Bu proje e-ticaret sitesinin alt yapısı baz alınarak Afganistan için özelleştirilmiştir.
Tüm özellikler çalışır durumda ve production'a hazırdır.

