import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    magaza_ad: 'فروشگاه الکترونیک احمد',
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
    magaza_ad: 'مغازه تکنولوژی کابل',
    resimler: ['https://bazaarewatan.com/images/691e08c04adbd_1763576000_5572.jpg'],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let id = 0;
  try {
    const resolvedParams = await params;
    id = parseInt(resolvedParams.id);
    
    // Database'den ilan detayını çek
    const ilanData = await query(
      `SELECT 
        i.*,
        k.ad as kategori_ad,
        k.slug as kategori_slug,
        il.ad as il_ad,
        ku.ad as kullanici_ad,
        ku.telefon as kullanici_telefon,
        ku.id as kullanici_id,
        m.id as magaza_id,
        m.store_level,
        m.ad as magaza_ad
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      LEFT JOIN iller il ON i.il_id = il.id
      LEFT JOIN kullanicilar ku ON i.kullanici_id = ku.id
      LEFT JOIN magazalar m ON i.magaza_id = m.id
      WHERE i.id = ? AND i.aktif = TRUE`,
      [id]
    );

    const ilan: any = Array.isArray(ilanData) && ilanData.length > 0 ? ilanData[0] : null;

    if (!ilan) {
      return NextResponse.json(
        { success: false, error: 'آگهی یافت نشد' },
        { status: 404 }
      );
    }

    // Resimleri çek
    const resimlerData = await query(
      'SELECT resim_url FROM ilan_resimleri WHERE ilan_id = ? ORDER BY sira',
      [id]
    ) as any[];

    ilan.resimler = resimlerData.map(r => r.resim_url);
    if (ilan.resimler.length === 0 && ilan.ana_resim) {
      ilan.resimler = [ilan.ana_resim];
    }

    // Görüntülenme sayısını artır
    await query(
      'UPDATE ilanlar SET goruntulenme = goruntulenme + 1 WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: ilan,
    });
  } catch (error: any) {
    console.error('❌ İlan detay database hatası, fallback:', error);
    
    // Fallback: mock data
    const baseIndex = ((id - 1) % 6);
    const baseIlan = baseIlanDetay[baseIndex];
    
    return NextResponse.json({
      success: true,
      data: { ...baseIlan, id },
    });
  }
}

// DELETE - İlan sil
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const ilanId = parseInt(resolvedParams.id);
    
    console.log('🗑️ İlan siliniyor, ID:', ilanId);

    // İlan resimlerini sil
    await query('DELETE FROM ilan_resimleri WHERE ilan_id = ?', [ilanId]);
    
    // İlanı sil (soft delete yerine hard delete)
    await query('DELETE FROM ilanlar WHERE id = ?', [ilanId]);
    
    console.log('✅ İlan silindi');

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

// PUT - İlan düzenle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const ilanId = parseInt(resolvedParams.id);
    
    const body = await request.json();
    const { baslik, aciklama, fiyat, fiyat_tipi, kategori_id, il_id, durum, resimler } = body;

    console.log('✏️ İlan düzenleniyor, ID:', ilanId);

    // İlan bilgilerini güncelle
    const updates: string[] = [];
    const values: any[] = [];

    if (baslik) { updates.push('baslik = ?'); values.push(baslik); }
    if (aciklama) { updates.push('aciklama = ?'); values.push(aciklama); }
    if (fiyat) { updates.push('fiyat = ?'); values.push(fiyat); }
    if (fiyat_tipi) { updates.push('fiyat_tipi = ?'); values.push(fiyat_tipi); }
    if (kategori_id) { updates.push('kategori_id = ?'); values.push(kategori_id); }
    if (il_id) { updates.push('il_id = ?'); values.push(il_id); }
    if (durum) { updates.push('durum = ?'); values.push(durum); }

    if (updates.length > 0) {
      values.push(ilanId);
      await query(
        `UPDATE ilanlar SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Resimler güncellenmişse
    if (resimler && resimler.length > 0) {
      // Eski resimleri sil
      await query('DELETE FROM ilan_resimleri WHERE ilan_id = ?', [ilanId]);
      
      // İlk resmi ana_resim olarak güncelle
      await query('UPDATE ilanlar SET ana_resim = ? WHERE id = ?', [resimler[0], ilanId]);
      
      // Yeni resimleri ekle
      for (let i = 0; i < resimler.length; i++) {
        await query(
          'INSERT INTO ilan_resimleri (ilan_id, resim_url, sira) VALUES (?, ?, ?)',
          [ilanId, resimler[i], i + 1]
        );
      }
    }

    console.log('✅ İlan güncellendi');

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت به‌روزرسانی شد',
      data: { id: ilanId }
    });
  } catch (error: any) {
    console.error('❌ İlan güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

