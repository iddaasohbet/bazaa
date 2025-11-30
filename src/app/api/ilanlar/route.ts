import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    const offset = parseInt(searchParams.get('offset') || '0');
    const kategori = searchParams.get('kategori');
    const aramaSorgusu = searchParams.get('q');
    const storeLevel = searchParams.get('store_level');

    // Database'den gerçek ilanları çek
    let sql = `
      SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.eski_fiyat,
        i.indirim_yuzdesi,
        i.fiyat_tipi,
        i.para_birimi,
        i.fiyat_usd,
        i.ana_resim,
        i.durum,
        i.goruntulenme,
        i.created_at,
        k.ad as kategori_ad,
        k.slug as kategori_slug,
        il.ad as il_ad,
        m.store_level,
        m.ad as magaza_ad
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      LEFT JOIN iller il ON i.il_id = il.id
      LEFT JOIN magazalar m ON i.magaza_id = m.id
      WHERE i.aktif = TRUE
    `;

    const params: any[] = [];

    if (kategori) {
      sql += ' AND k.slug = ?';
      params.push(kategori);
    }

    if (storeLevel) {
      sql += ' AND m.store_level = ?';
      params.push(storeLevel);
    }

    if (aramaSorgusu) {
      sql += ' AND (i.baslik LIKE ? OR i.aciklama LIKE ?)';
      params.push(`%${aramaSorgusu}%`, `%${aramaSorgusu}%`);
    }

    sql += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const ilanlar = await query(sql, params);

    // Resimler için JOIN
    const ilanlarWithImages = await Promise.all(
      (ilanlar as any[]).map(async (ilan) => {
        const resimler = await query(
          'SELECT resim_url FROM ilan_resimleri WHERE ilan_id = ? ORDER BY sira',
          [ilan.id]
        ) as any[];
        
        return {
          ...ilan,
          resimler: resimler.map(r => r.resim_url),
          resim_sayisi: resimler.length
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: ilanlarWithImages,
    });
  } catch (error: any) {
    console.error('❌ İlanlar database hatası, fallback kullanılıyor:', error);
    
    // Database hatası varsa mock data döndür
    return NextResponse.json({
      success: true,
      data: mockIlanlar.slice(0, 20),
    });
  }
}

// POST - Yeni ilan oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { baslik, aciklama, fiyat, fiyat_tipi, para_birimi, fiyat_usd, kategori_id, il_id, durum, emlak_tipi, kullanici_id, resimler } = body;

    console.log('📝 Yeni ilan oluşturuluyor:', { baslik, kullanici_id, para_birimi, resim_sayisi: resimler?.length || 0 });

    // Validasyon
    if (!baslik || !aciklama || !fiyat || !kategori_id || !il_id || !kullanici_id) {
      return NextResponse.json(
        { success: false, message: 'لطفاً تمام فیلدهای الزامی را پر کنید' },
        { status: 400 }
      );
    }

    // Kullanıcının mağazasını kontrol et
    let magazaId = null;
    const magazalar = await query(
      'SELECT id FROM magazalar WHERE kullanici_id = ? AND aktif = TRUE LIMIT 1',
      [kullanici_id]
    );
    
    if (Array.isArray(magazalar) && magazalar.length > 0) {
      magazaId = (magazalar[0] as any).id;
      console.log('✅ Kullanıcının mağazası bulundu, ID:', magazaId);
    }

    // İlk resmi ana_resim olarak kullan
    const anaResim = resimler && resimler.length > 0 ? resimler[0] : null;

    // İlan oluştur
    const result = await query(
      `INSERT INTO ilanlar (
        baslik, aciklama, fiyat, fiyat_tipi, para_birimi, fiyat_usd, kategori_id, il_id, durum, emlak_tipi,
        kullanici_id, magaza_id, ana_resim, aktif, goruntulenme
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 0)`,
      [baslik, aciklama, fiyat, fiyat_tipi || 'negotiable', para_birimi || 'AFN', fiyat_usd || null, kategori_id, il_id, durum || 'kullanilmis', emlak_tipi || null, kullanici_id, magazaId, anaResim]
    );

    const ilanId = (result as any).insertId;
    console.log('✅ İlan oluşturuldu, ID:', ilanId);

    // Resimleri kaydet
    if (resimler && resimler.length > 0) {
      for (let i = 0; i < resimler.length; i++) {
        await query(
          'INSERT INTO ilan_resimleri (ilan_id, resim_url, sira) VALUES (?, ?, ?)',
          [ilanId, resimler[i], i + 1]
        );
      }
      console.log(`✅ ${resimler.length} resim kaydedildi`);
    }

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت ایجاد شد',
      data: { id: ilanId },
    });
  } catch (error: any) {
    console.error('❌ İlan oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

