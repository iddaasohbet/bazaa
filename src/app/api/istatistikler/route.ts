import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Aktif ilan sayısı
    const ilanlarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE aktif = TRUE'
    );
    const aktifIlanlar = ilanlarResult[0]?.toplam || 0;

    // Mağaza sayısı
    const magazalarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM magazalar WHERE aktif = TRUE'
    );
    const aktifMagazalar = magazalarResult[0]?.toplam || 0;

    // Bugün eklenen ilan sayısı
    const bugunResult: any = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE DATE(olusturma_tarihi) = CURDATE() AND aktif = TRUE'
    );
    const bugunEklenen = bugunResult[0]?.toplam || 0;

    // Kullanıcı sayısı
    const kullanicilarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM kullanicilar WHERE aktif = TRUE'
    );
    const toplamKullanicilar = kullanicilarResult[0]?.toplam || 0;

    return NextResponse.json({
      success: true,
      data: {
        aktifIlanlar,
        aktifMagazalar,
        bugunEklenen,
        toplamKullanicilar,
      },
    });
  } catch (error: any) {
    console.error('❌ İstatistik hatası:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'خطا در بارگذاری آمار',
        // Hata durumunda varsayılan değerler dön
        data: {
          aktifIlanlar: 0,
          aktifMagazalar: 0,
          bugunEklenen: 0,
          toplamKullanicilar: 0,
        },
      },
      { status: 200 } // 500 yerine 200 dön, frontend çalışmaya devam etsin
    );
  }
}

