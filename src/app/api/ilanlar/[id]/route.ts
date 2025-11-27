import { NextResponse } from 'next/server';

// Base ilan detayları
const baseIlanDetay = [
  {
    id: 1,
    baslik: 'Toyota Corolla 2015 Model',
    aciklama: 'Temiz kullanılmış araç, full bakımlı. Sorunsuz, kazasız. Motor ve şanzıman çok iyi durumda. 150.000 km\'de. İç döşeme tertemiz, dış boya orijinal. Tüm bakımları zamanında yapılmış.',
    fiyat: 50000,
    fiyat_tipi: 'negotiable',
    kategori_ad: 'Araçlar',
    kategori_slug: 'araclar',
    il_ad: 'Kabil',
    durum: 'kullanilmis',
    goruntulenme: 245,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    kullanici_ad: 'Ahmet Yılmaz',
    kullanici_id: 1,
    kullanici_telefon: '+93 700 123 456',
    magaza_id: undefined, // Mağazası yok
    resimler: [
      'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg',
      'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
      'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
    ],
  },
  {
    id: 2,
    baslik: 'iPhone 13 Pro 256GB Mavi',
    aciklama: 'Az kullanılmış, hiç çizik yok. Tüm aksesuarlar mevcut. Kutusunda, faturalı. Garantisi devam ediyor.',
    fiyat: 21250,
    eski_fiyat: 25000,
    indirim_yuzdesi: 15,
    fiyat_tipi: 'negotiable',
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Herat',
    durum: 'az_kullanilmis',
    goruntulenme: 189,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    kullanici_ad: 'Mehmet Demir',
    kullanici_id: 2,
    kullanici_telefon: '+93 700 234 567',
    magaza_id: 1, // Mağazası var
    store_level: 'pro',
    resimler: [
      'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
      'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg',
    ],
  },
  {
    id: 3,
    baslik: 'Samsung Smart TV 55"',
    aciklama: 'Sıfır kutusunda, faturalı. 4K Ultra HD. HDR destekli. Smart özellikler ile Youtube, Netflix izleyin.',
    fiyat: 24000,
    eski_fiyat: 30000,
    indirim_yuzdesi: 20,
    fiyat_tipi: 'fixed',
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Kandahar',
    durum: 'yeni',
    goruntulenme: 312,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    kullanici_ad: 'Ali Kaya',
    kullanici_id: 3,
    kullanici_telefon: '+93 700 345 678',
    magaza_id: 1, // Mağazası var
    store_level: 'elite',
    resimler: [
      'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
      'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg',
      'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
    ],
  },
  {
    id: 4,
    baslik: '3+1 Daire Satılık - Merkez',
    aciklama: 'Merkezi konumda, asansörlü binada 3. kat daire. 120m2, geniş balkonlu. Yapı kayıt belgeli.',
    fiyat: 120000,
    fiyat_tipi: 'negotiable',
    kategori_ad: 'Emlak',
    kategori_slug: 'emlak',
    il_ad: 'Kabil',
    durum: 'kullanilmis',
    goruntulenme: 456,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    kullanici_ad: 'Ayşe Demir',
    kullanici_id: 4,
    kullanici_telefon: '+93 700 456 789',
    magaza_id: 1, // Mağazası var
    resimler: ['https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg'],
  },
  {
    id: 5,
    baslik: 'Koltuk Takımı - 3+2+1',
    aciklama: 'Modern tasarım, temiz ve bakımlı. Leke ve yırtık yok. Az kullanılmış durumdadır.',
    fiyat: 15000,
    fiyat_tipi: 'negotiable',
    kategori_ad: 'Ev Eşyaları',
    kategori_slug: 'ev-esyalari',
    il_ad: 'Mazar-ı Şerif',
    durum: 'kullanilmis',
    goruntulenme: 178,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    kullanici_ad: 'Fatma Kaya',
    kullanici_id: 5,
    kullanici_telefon: '+93 700 567 890',
    magaza_id: undefined, // Mağazası yok
    resimler: ['https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg'],
  },
  {
    id: 6,
    baslik: 'MacBook Pro M1 2021',
    aciklama: '16GB RAM, 512GB SSD. Çok temiz. Hiç sorun yok, garantili. Faturalı.',
    fiyat: 36000,
    eski_fiyat: 45000,
    indirim_yuzdesi: 20,
    fiyat_tipi: 'negotiable',
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Kabil',
    durum: 'az_kullanilmis',
    goruntulenme: 523,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    kullanici_ad: 'Hasan Çelik',
    kullanici_id: 6,
    kullanici_telefon: '+93 700 678 901',
    magaza_id: 1, // Mağazası var
    store_level: 'elite',
    resimler: ['https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg'],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // ID'yi 6'ya böl, kalanı bul (0-5 arası)
    const baseIndex = ((id - 1) % 6);
    const baseIlan = baseIlanDetay[baseIndex];

    if (!baseIlan) {
      return NextResponse.json(
        { success: false, error: 'İlan bulunamadı' },
        { status: 404 }
      );
    }

    // İlan detayını ID ile döndür
    const ilan = {
      ...baseIlan,
      id: id,
    };

    return NextResponse.json({
      success: true,
      data: ilan,
    });
  } catch (error: any) {
    console.error('İlan detayı yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

