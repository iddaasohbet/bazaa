import { NextRequest, NextResponse } from 'next/server';
import { getIlanDetay } from '@/lib/ilan';
import { query } from '@/lib/db';

// Mock data - veritabanı olmadan çalışması için
const mockIlanlar = [
  {
    id: 1,
    baslik: 'Toyota Corolla 2015 Model',
    aciklama: 'Temiz kullanılmış araç, full bakımlı. Sorunsuz, kazasız. Motor ve şanzıman sorunsuz çalışmaktadır.',
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
    kullanici_ad: 'احمد محمدی',
    kullanici_telefon: '+93 700 123 456',
    kullanici_id: 1,
  },
  {
    id: 2,
    baslik: 'iPhone 13 Pro 256GB Mavi',
    aciklama: 'Az kullanılmış, hiç çizik yok. Tüm aksesuarlar mevcut. Batarya sağlığı %95.',
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
    kullanici_ad: 'علی رضایی',
    kullanici_telefon: '+93 700 234 567',
    kullanici_id: 2,
    store_level: 'pro',
    magaza_ad: 'مغازه موبایل هرات',
    magaza_id: 1,
  },
  {
    id: 3,
    baslik: 'Samsung Smart TV 55"',
    aciklama: 'Sıfır kutusunda, faturalı. 4K Ultra HD. Smart TV özellikleri mevcut.',
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
    kullanici_ad: 'محمد کریمی',
    kullanici_telefon: '+93 700 345 678',
    kullanici_id: 3,
    store_level: 'elite',
    magaza_ad: 'فروشگاه الکترونیک احمد',
    magaza_id: 2,
  },
  {
    id: 4,
    baslik: '3+1 Daire Satılık - Merkez',
    aciklama: 'Merkezi konumda, asansörlü binada 3. kat daire. 120m2, 3 yatak odası, 1 salon.',
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
    kullanici_ad: 'حسن احمدی',
    kullanici_telefon: '+93 700 456 789',
    kullanici_id: 4,
  },
  {
    id: 5,
    baslik: 'Koltuk Takımı - 3+2+1',
    aciklama: 'Modern tasarım, temiz ve bakımlı. Renk: Krem/Bej.',
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
    kullanici_ad: 'فاطمه زهرا',
    kullanici_telefon: '+93 700 567 890',
    kullanici_id: 5,
  },
  {
    id: 6,
    baslik: 'MacBook Pro M1 2021',
    aciklama: '16GB RAM, 512GB SSD. Çok temiz, kutulu.',
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
    kullanici_ad: 'رضا جعفری',
    kullanici_telefon: '+93 700 678 901',
    kullanici_id: 6,
    store_level: 'elite',
    magaza_ad: 'مغازه تکنولوژی کابل',
    magaza_id: 3,
  },
];

// 4 satır (24 ilan) oluştur - ID'leri tekrarla
const allMockIlanlar = Array.from({ length: 4 }, (_, rowIndex) => 
  mockIlanlar.map((ilan, colIndex) => ({
    ...ilan,
    id: rowIndex * 6 + colIndex + 1,
  }))
).flat();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ilanId = parseInt(id);

    const ilan = await getIlanDetay(ilanId);
    if (!ilan) {
      // DB'den bulunamadı, mock data'dan dene
      const mockIlan = allMockIlanlar.find(i => i.id === ilanId);
      if (mockIlan) {
        console.log('⚠️ İlan DB\'de yok, mock data kullanılıyor:', ilanId);
        return NextResponse.json({
          success: true,
          data: mockIlan
        });
      }
      return NextResponse.json({ success: false, message: 'آگهی یافت نشد' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      data: ilan
    });
    
    // Detay verisi cache'lenebilir olsun; görüntülenme sayısını ayrı endpoint ile artırıyoruz.
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error: any) {
    console.error('❌ İlan detay hatası:', error);
    
    // DB hatası varsa mock data'dan dene
    const { id } = await params;
    const ilanId = parseInt(id);
    const mockIlan = allMockIlanlar.find(i => i.id === ilanId);
    if (mockIlan) {
      console.log('⚠️ DB hatası, mock data kullanılıyor:', ilanId);
      return NextResponse.json({
        success: true,
        data: mockIlan
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - İlanı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Kullanıcı ID'sini header'dan al (frontend'den gönderilecek)
    const kullaniciId = request.headers.get('x-user-id');

    // İlanı kontrol et
    const ilanData = await query(
      'SELECT kullanici_id FROM ilanlar WHERE id = ?',
      [parseInt(id)]
    );

    if (!Array.isArray(ilanData) || ilanData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'آگهی یافت نشد' },
        { status: 404 }
      );
    }

    const ilan: any = ilanData[0];

    // Sadece ilan sahibi silebilir
    if (kullaniciId && ilan.kullanici_id.toString() !== kullaniciId) {
      return NextResponse.json(
        { success: false, message: 'شما مجاز به حذف این آگهی نیستید' },
        { status: 403 }
      );
    }

    // İlanı sil (CASCADE ile resimler de otomatik silinir)
    await query('DELETE FROM ilanlar WHERE id = ?', [parseInt(id)]);

    console.log(`✅ İlan silindi: ${id} by user: ${kullaniciId}`);

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ İlan silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف آگهی: ' + error.message },
      { status: 500 }
    );
  }
}
