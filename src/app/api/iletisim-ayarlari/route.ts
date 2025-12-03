import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - İletişim ayarlarını getir (Public)
export async function GET() {
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };
  
  try {
    const ayarlar = await query(
      'SELECT * FROM iletisim_ayarlari ORDER BY id DESC LIMIT 1',
      []
    ) as any[];

    if (ayarlar.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'İletişim ayarları bulunamadı'
      }, { status: 404, headers });
    }

    const ayar = ayarlar[0];

    // JSON alanlarını parse et
    const data = {
      ...ayar,
      calisma_saatleri: ayar.calisma_saatleri ? JSON.parse(ayar.calisma_saatleri) : [],
      sosyal_medya: ayar.sosyal_medya ? JSON.parse(ayar.sosyal_medya) : {},
      istatistikler: ayar.istatistikler ? JSON.parse(ayar.istatistikler) : {}
    };

    return NextResponse.json({
      success: true,
      data
    }, { headers });
  } catch (error: any) {
    console.error('❌ İletişim ayarları hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

