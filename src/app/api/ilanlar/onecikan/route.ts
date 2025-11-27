import { NextResponse } from 'next/server';

// Öne çıkan ilanlar - mock data
const mockOnecikanIlanlar = [
  {
    id: 1,
    baslik: 'Toyota Corolla 2015 - Muhteşem Fırsat!',
    aciklama: 'Temiz kullanılmış araç, full bakımlı. Sorunsuz, kazasız.',
    fiyat: 50000,
    kategori_ad: 'Araçlar',
    kategori_slug: 'araclar',
    il_ad: 'Kabil',
    ana_resim: 'https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg',
    goruntulenme: 245,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e1a347a648_1763580468_4652.jpg'],
    onecikan: true,
    onecikan_sira: 1,
  },
  {
    id: 2,
    baslik: 'iPhone 13 Pro 256GB - Sıfır Gibi',
    aciklama: 'Az kullanılmış, hiç çizik yok. Tüm aksesuarlar mevcut.',
    fiyat: 25000,
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Herat',
    ana_resim: 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
    goruntulenme: 189,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg'],
    onecikan: true,
    onecikan_sira: 2,
  },
  {
    id: 3,
    baslik: '3+1 Merkezi Daire - Acil Satılık',
    aciklama: 'Merkezi konumda, asansörlü binada 3. kat daire. Fırsat fiyatına!',
    fiyat: 120000,
    kategori_ad: 'Emlak',
    kategori_slug: 'emlak',
    il_ad: 'Kabil',
    ana_resim: 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
    goruntulenme: 456,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg'],
    onecikan: true,
    onecikan_sira: 3,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockOnecikanIlanlar,
    });
  } catch (error: any) {
    console.error('Öne çıkan ilanlar yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

