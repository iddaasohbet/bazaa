import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Admin için ilan listeleme
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const durum = searchParams.get('durum');

    let sql = `
      SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.eski_fiyat,
        i.indirim_yuzdesi,
        i.fiyat_tipi,
        i.ana_resim,
        i.durum,
        i.aktif,
        i.onecikan,
        i.goruntulenme,
        i.created_at,
        k.ad as kategori_ad,
        il.ad as il_ad,
        u.ad as kullanici_ad,
        m.ad as magaza_ad
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      LEFT JOIN iller il ON i.il_id = il.id
      LEFT JOIN kullanicilar u ON i.kullanici_id = u.id
      LEFT JOIN magazalar m ON i.magaza_id = m.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (durum === 'beklemede') {
      sql += ' AND i.aktif = FALSE';
    } else if (durum === 'aktif') {
      sql += ' AND i.aktif = TRUE';
    }

    sql += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const ilanlar = await query(sql, params);

    // Toplam sayısını al
    const countResult = await query('SELECT COUNT(*) as total FROM ilanlar WHERE 1=1' + (durum === 'beklemede' ? ' AND aktif = FALSE' : durum === 'aktif' ? ' AND aktif = TRUE' : ''));
    const total = (countResult as any[])[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: ilanlar,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('❌ Admin ilanlar hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آگهی‌ها', error: error.message },
      { status: 500 }
    );
  }
}

// Admin için yeni ilan oluşturma
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      baslik, 
      aciklama, 
      fiyat, 
      eski_fiyat,
      fiyat_tipi, 
      kategori_id, 
      il_id, 
      durum,
      emlak_tipi,
      kullanici_id, 
      stok_miktari,
      video_url,
      resimler,
      aktif = true,
      onecikan = false,
      magaza_id = null
    } = body;

    console.log('📝 Admin: Yeni ilan oluşturuluyor:', { baslik, kullanici_id, resim_sayisi: resimler?.length || 0 });

    // Validasyon
    if (!baslik || !aciklama || !fiyat || !kategori_id || !il_id || !kullanici_id) {
      return NextResponse.json(
        { success: false, message: 'لطفاً تمام فیلدهای الزامی را پر کنید' },
        { status: 400 }
      );
    }

    if (!resimler || resimler.length === 0) {
      return NextResponse.json(
        { success: false, message: 'لطفاً حداقل یک تصویر بارگذاری کنید' },
        { status: 400 }
      );
    }

    // İlk resmi ana_resim olarak kullan
    const anaResim = resimler[0];

    // İndirim yüzdesini hesapla
    let indirimYuzdesi = 0;
    if (eski_fiyat && eski_fiyat > fiyat) {
      indirimYuzdesi = Math.round(((eski_fiyat - fiyat) / eski_fiyat) * 100);
    }

    // İlan oluştur
    const result = await query(
      `INSERT INTO ilanlar (
        baslik, aciklama, fiyat, eski_fiyat, indirim_yuzdesi, fiyat_tipi, 
        kategori_id, il_id, durum, emlak_tipi, kullanici_id, magaza_id, 
        stok_miktari, video_url, ana_resim, aktif, onecikan, goruntulenme
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        baslik, 
        aciklama, 
        fiyat, 
        eski_fiyat || null, 
        indirimYuzdesi,
        fiyat_tipi || 'negotiable', 
        kategori_id, 
        il_id, 
        durum || 'kullanilmis',
        emlak_tipi || null,
        kullanici_id, 
        magaza_id,
        stok_miktari || 1,
        video_url || null,
        anaResim,
        aktif ? 1 : 0,
        onecikan ? 1 : 0
      ]
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
    console.error('❌ Admin ilan oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

// Admin için ilan güncelleme
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id,
      baslik, 
      aciklama, 
      fiyat, 
      eski_fiyat,
      fiyat_tipi, 
      kategori_id, 
      il_id, 
      durum,
      stok_miktari,
      video_url,
      aktif,
      onecikan
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه آگهی الزامی است' },
        { status: 400 }
      );
    }

    // Esnek güncelleme - sadece gönderilen alanları güncelle
    let updateQuery = 'UPDATE ilanlar SET updated_at = NOW()';
    const params: any[] = [];

    if (baslik !== undefined) {
      updateQuery += ', baslik = ?';
      params.push(baslik);
    }
    if (aciklama !== undefined) {
      updateQuery += ', aciklama = ?';
      params.push(aciklama);
    }
    if (fiyat !== undefined) {
      updateQuery += ', fiyat = ?';
      params.push(fiyat);
    }
    if (eski_fiyat !== undefined) {
      updateQuery += ', eski_fiyat = ?';
      params.push(eski_fiyat || null);
      
      // İndirim yüzdesini hesapla
      if (eski_fiyat && fiyat && eski_fiyat > fiyat) {
        const indirimYuzdesi = Math.round(((eski_fiyat - fiyat) / eski_fiyat) * 100);
        updateQuery += ', indirim_yuzdesi = ?';
        params.push(indirimYuzdesi);
      }
    }
    if (fiyat_tipi !== undefined) {
      updateQuery += ', fiyat_tipi = ?';
      params.push(fiyat_tipi);
    }
    if (kategori_id !== undefined) {
      updateQuery += ', kategori_id = ?';
      params.push(kategori_id);
    }
    if (il_id !== undefined) {
      updateQuery += ', il_id = ?';
      params.push(il_id);
    }
    if (durum !== undefined) {
      updateQuery += ', durum = ?';
      params.push(durum);
    }
    if (stok_miktari !== undefined) {
      updateQuery += ', stok_miktari = ?';
      params.push(stok_miktari);
    }
    if (video_url !== undefined) {
      updateQuery += ', video_url = ?';
      params.push(video_url || null);
    }
    if (aktif !== undefined) {
      updateQuery += ', aktif = ?';
      params.push(aktif ? 1 : 0);
    }
    if (onecikan !== undefined) {
      updateQuery += ', onecikan = ?';
      params.push(onecikan ? 1 : 0);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await query(updateQuery, params);

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Admin ilan güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

// Admin için ilan silme
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه آگهی الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM ilanlar WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'آگهی با موفقیت حذف شد'
    });
  } catch (error: any) {
    console.error('❌ Admin ilan silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف آگهی: ' + error.message },
      { status: 500 }
    );
  }
}

