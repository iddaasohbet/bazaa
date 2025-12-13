import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 60;

type CacheEntry = { expiresAt: number; data: any };
const magazaCache = new Map<number, CacheEntry>();
const TTL_MS = 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const magazaId = parseInt(id);
    if (!Number.isFinite(magazaId)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz mağaza id' },
        { status: 400 }
      );
    }

    // Cache devre dışı - güncellemeler hemen yansısın
    // const cached = magazaCache.get(magazaId);
    // if (cached && cached.expiresAt > Date.now()) {
    //   return NextResponse.json({ success: true, data: cached.data });
    // }
    
    // Önce basit sorgu - hata varsa görelim
    let magazaData;
    try {
      magazaData = await query(
        `SELECT m.* FROM magazalar m WHERE m.id = ? AND m.aktif = TRUE LIMIT 1`,
        [magazaId]
      );
    } catch (err: any) {
      throw err;
    }

    // Şimdi ilan sayısını ayrı çekelim
    let ilan_sayisi = 0;
    if (magazaData && Array.isArray(magazaData) && magazaData.length > 0) {
      try {
        const ilanCount: any = await query(
          `SELECT COUNT(*) as total FROM ilanlar WHERE kullanici_id = ? AND aktif = TRUE`,
          [(magazaData[0] as any).kullanici_id]
        );
        ilan_sayisi = ilanCount[0]?.total || 0;
      } catch (err) {
        console.log('⚠️ İlan sayısı alınamadı, 0 kabul ediliyor');
      }
    }

    // Şehir adını ayrı çekelim
    let il_ad = null;
    if (magazaData && Array.isArray(magazaData) && magazaData.length > 0) {
      const magaza: any = magazaData[0];
      if (magaza.il_id) {
        try {
          const ilData: any = await query(`SELECT ad FROM iller WHERE id = ?`, [magaza.il_id]);
          il_ad = ilData[0]?.ad || null;
        } catch (err) {
          console.log('⚠️ Şehir adı alınamadı');
        }
      }
    }
    
    console.log('📦 API /magazalar/[id] - Query tamamlandı');

    let magaza: any = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    console.log('✅ API /magazalar/[id] - Mağaza bulundu:', magaza ? 'Evet' : 'Hayır');
    
    if (!magaza) {
      return NextResponse.json(
        { success: false, message: 'این مغازه موجود نیست یا غیرفعال شده است' },
        { status: 404 }
      );
    }

    // İlan sayısı ve şehir adını ekle
    magaza.ilan_sayisi = ilan_sayisi;
    magaza.il_ad = il_ad;

    console.log('📊 API /magazalar/[id] - İstatistikler:', {
      ilan_sayisi: magaza.ilan_sayisi,
      goruntulenme: magaza.goruntulenme,
      il_ad: magaza.il_ad,
      tema_renk: magaza.tema_renk
    });

    // Görüntülenme sayısını artır (hata olsa bile devam et)
    try {
      await query(
        'UPDATE magazalar SET goruntulenme = goruntulenme + 1 WHERE id = ?',
        [magazaId]
      );
    } catch (err) {
    }

    const response = NextResponse.json({
      success: true,
      data: magaza
    });

    // Cache kaldırıldı - tema rengi güncellemelerinin hemen yansıması için
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;
  } catch (error: any) {
    // Artık mock döndürme, hata döndür
    return NextResponse.json({
      success: false,
      message: 'Mağaza yüklenirken hata oluştu: ' + error.message
    }, { status: 500 });
  }
}

// Mağaza güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('✏️ Mağaza güncelleme - ID:', id);
    console.log('📝 Güncelleme verileri:', body);
    
    const {
      ad,
      ad_dari,
      aciklama,
      telefon,
      adres,
      il_id,
      logo,
      kapak_resmi,
      banner,
      tema_renk
    } = body;

    // Güncelleme sorgusu
    let updateQuery = 'UPDATE magazalar SET updated_at = NOW()';
    const params_list: any[] = [];

    if (ad !== undefined) {
      updateQuery += ', ad = ?';
      params_list.push(ad);
    }
    if (ad_dari !== undefined) {
      updateQuery += ', ad_dari = ?';
      params_list.push(ad_dari);
    }
    if (aciklama !== undefined) {
      updateQuery += ', aciklama = ?';
      params_list.push(aciklama);
    }
    if (telefon !== undefined) {
      updateQuery += ', telefon = ?';
      params_list.push(telefon);
    }
    if (adres !== undefined) {
      updateQuery += ', adres = ?';
      params_list.push(adres);
    }
    if (il_id !== undefined) {
      updateQuery += ', il_id = ?';
      params_list.push(il_id);
    }
    if (logo !== undefined) {
      updateQuery += ', logo = ?';
      params_list.push(logo);
    }
    if (kapak_resmi !== undefined) {
      updateQuery += ', kapak_resmi = ?';
      params_list.push(kapak_resmi);
    }
    if (banner !== undefined) {
      updateQuery += ', banner = ?';
      params_list.push(banner);
    }
    if (tema_renk !== undefined) {
      updateQuery += ', tema_renk = ?';
      params_list.push(tema_renk);
    }

    updateQuery += ' WHERE id = ?';
    params_list.push(parseInt(id));

    console.log('🔄 SQL Query:', updateQuery);
    
    await query(updateQuery, params_list);

    // Cache'i temizle
    const magazaId = parseInt(id);
    magazaCache.delete(magazaId);
    
    console.log('✅ Mağaza güncellendi! Cache temizlendi.');

    return NextResponse.json({
      success: true,
      message: 'مغازه با موفقیت به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('❌ Mağaza güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی مغازه: ' + error.message },
      { status: 500 }
    );
  }
}



