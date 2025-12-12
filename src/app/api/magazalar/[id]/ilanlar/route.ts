import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 60;

type CacheEntry = { expiresAt: number; data: any[] };
const ilanCache = new Map<string, CacheEntry>();
const TTL_MS = 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    const magazaId = parseInt(id);
    if (!Number.isFinite(magazaId)) {
      return NextResponse.json({ success: false, message: 'Geçersiz mağaza id' }, { status: 400 });
    }

    const cacheKey = `${magazaId}:${Number.isFinite(limit) ? limit : 50}`;
    const cached = ilanCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      const res = NextResponse.json({ success: true, data: cached.data || [] });
      res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res;
    }

    // Mağaza sahibini bul
    const magazaData = await query(
      'SELECT id, kullanici_id FROM magazalar WHERE id = ?',
      [magazaId]
    );

    const magaza: any = Array.isArray(magazaData) && magazaData.length > 0 ? magazaData[0] : null;

    if (!magaza) {
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    // Mağazanın ilanlarını getir (magaza_id'ye göre)
    const ilanlar = await query(
      `SELECT 
        i.id,
        i.baslik,
        i.fiyat,
        i.eski_fiyat,
        i.indirim_yuzdesi,
        i.ana_resim,
        i.goruntulenme,
        i.aktif,
        i.created_at,
        k.ad as kategori_ad,
        EXISTS(
          SELECT 1 FROM vitrinler v 
          WHERE v.ilan_id = i.id 
            AND v.magaza_id = ? 
            AND v.aktif = TRUE 
            AND v.bitis_tarihi > NOW()
        ) as vitrin
      FROM ilanlar i
      LEFT JOIN kategoriler k ON i.kategori_id = k.id
      WHERE i.magaza_id = ? AND i.aktif = TRUE
      ORDER BY vitrin DESC, i.created_at DESC
      LIMIT ?`,
      [magazaId, magazaId, limit]
    );

    const response = NextResponse.json({
      success: true,
      data: ilanlar || []
    });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    ilanCache.set(cacheKey, { expiresAt: Date.now() + TTL_MS, data: (ilanlar as any[]) || [] });
    return response;
  } catch (error: any) {
    // Hata durumunda boş array dön
    return NextResponse.json(
      { success: true, data: [] }
    );
  }
}



