import { NextResponse } from 'next/server';

// Base ilanlar
const baseIlanlar = [
  {
    baslik: 'Toyota Corolla 2015 Model',
    fiyat: 50000,
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
    baslik: 'iPhone 13 Pro 256GB Mavi',
    fiyat: 25000,
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Herat',
    durum: 'az_kullanilmis',
    ana_resim: 'https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg',
    goruntulenme: 189,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e14d188e11_1763579089_6711.jpg'],
    resim_sayisi: 1,
  },
  {
    baslik: 'Samsung Smart TV 55"',
    fiyat: 30000,
    kategori_ad: 'Elektronik',
    kategori_slug: 'elektronik',
    il_ad: 'Kandahar',
    durum: 'yeni',
    ana_resim: 'https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg',
    goruntulenme: 312,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resimler: ['https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg'],
    resim_sayisi: 1,
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const kullaniciId = resolvedParams.id;

    // Kullanıcının ilanlarını döndür (mock - 3 ilan)
    const kullaniciIlanlari = baseIlanlar.map((ilan, index) => ({
      ...ilan,
      id: parseInt(kullaniciId) * 100 + index + 1,
      kullanici_id: parseInt(kullaniciId),
      fiyat_tipi: 'negotiable',
    }));

    return NextResponse.json({
      success: true,
      data: kullaniciIlanlari,
      kullanici: {
        id: kullaniciId,
        ad: 'İlan Sahibi',
      }
    });
  } catch (error: any) {
    console.error('Kullanıcı ilanları yüklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


