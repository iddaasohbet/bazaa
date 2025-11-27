import { NextResponse } from 'next/server';

// Mock data - veritabanı olmadan çalışması için
const baseIlanlar = [
  {
    id: 1,
    baslik: 'Toyota Corolla 2015 Model',
    aciklama: 'Temiz kullanılmış araç, full bakımlı. Sorunsuz, kazasız.',
    fiyat: 50000,
    fiyat_tipi: 'negotiable',
    kategori_id: 1,
    kategori_ad: 'Araçlar',
    kategori_slug: 'araclar',
    il_ad: 'Kabil',
    durum: 'kullanilmis',
    ana_resim: 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg',
    goruntulenme: 245,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg'],
    resim_sayisi: 1,
  },
  {
    id: 2,
    baslik: 'iPhone 13 Pro 256GB Mavi',
    aciklama: 'Az kullanılmış, hiç çizik yok. Tüm aksesuarlar mevcut.',
    fiyat: 21250,
    eski_fiyat: 25000,
    indirim_yuzdesi: 15,
    fiyat_tipi: 'negotiable',
    kategori_id: 3,
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Herat',
    durum: 'az_kullanilmis',
    ana_resim: 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
    goruntulenme: 189,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg'],
    resim_sayisi: 1,
    store_level: 'pro',
    magaza_ad: 'مغازه موبایل هرات',
  },
  {
    id: 3,
    baslik: 'Samsung Smart TV 55"',
    aciklama: 'Sıfır kutusunda, faturalı. 4K Ultra HD.',
    fiyat: 24000,
    eski_fiyat: 30000,
    indirim_yuzdesi: 20,
    fiyat_tipi: 'fixed',
    kategori_id: 3,
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Kandahar',
    durum: 'yeni',
    ana_resim: 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
    goruntulenme: 312,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg'],
    resim_sayisi: 1,
    store_level: 'elite',
    magaza_ad: 'فروشگاه الکترونیک احمد',
  },
  {
    id: 4,
    baslik: '3+1 Daire Satılık - Merkez',
    aciklama: 'Merkezi konumda, asansörlü binada 3. kat daire.',
    fiyat: 120000,
    fiyat_tipi: 'negotiable',
    kategori_id: 2,
    kategori_ad: 'Emlak',
    kategori_slug: 'emlak',
    il_ad: 'Kabil',
    durum: 'kullanilmis',
    ana_resim: 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg',
    goruntulenme: 456,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg'],
    resim_sayisi: 1,
  },
  {
    id: 5,
    baslik: 'Koltuk Takımı - 3+2+1',
    aciklama: 'Modern tasarım, temiz ve bakımlı.',
    fiyat: 15000,
    fiyat_tipi: 'negotiable',
    kategori_id: 4,
    kategori_ad: 'Ev Eşyaları',
    kategori_slug: 'ev-esyalari',
    il_ad: 'Mazar-ı Şerif',
    durum: 'kullanilmis',
    ana_resim: 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
    goruntulenme: 178,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg'],
    resim_sayisi: 1,
  },
  {
    id: 6,
    baslik: 'MacBook Pro M1 2021',
    aciklama: '16GB RAM, 512GB SSD. Çok temiz.',
    fiyat: 36000,
    eski_fiyat: 45000,
    indirim_yuzdesi: 20,
    fiyat_tipi: 'negotiable',
    kategori_id: 3,
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Kabil',
    durum: 'az_kullanilmis',
    ana_resim: 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
    goruntulenme: 523,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg'],
    resim_sayisi: 1,
    store_level: 'elite',
    magaza_ad: 'مغازه تکنولوژی کابل',
  },
];

// 4 satır (24 ilan) oluştur
const mockIlanlar = Array.from({ length: 4 }, (_, rowIndex) => 
  baseIlanlar.map((ilan, colIndex) => ({
    ...ilan,
    id: rowIndex * 6 + colIndex + 1,
  }))
).flat();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const kategori = searchParams.get('kategori');
    const aramaSorgusu = searchParams.get('q');

    let filteredIlanlar = [...mockIlanlar];

    if (kategori) {
      filteredIlanlar = filteredIlanlar.filter(i => i.kategori_slug === kategori);
    }

    if (aramaSorgusu) {
      const query = aramaSorgusu.toLowerCase();
      filteredIlanlar = filteredIlanlar.filter(i => 
        i.baslik.toLowerCase().includes(query) || 
        i.aciklama.toLowerCase().includes(query)
      );
    }

    // Limit uygula
    filteredIlanlar = filteredIlanlar.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: filteredIlanlar,
    });
  } catch (error: any) {
    console.error('İlanlar yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

