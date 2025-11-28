import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kullaniciId = searchParams.get('kullanici_id');

    // Eğer kullanıcı ID'si varsa, kullanıcıya özel istatistikleri dön
    if (kullaniciId) {
      console.log('📊 Kullanıcı istatistikleri yükleniyor - ID:', kullaniciId);
      
      try {
        // Aktif ilan sayısı ve toplam görüntülenme (kullanici_id VE magaza_id'ye göre)
        const ilanlarResult: any = await query(
          `SELECT COUNT(*) as toplam, COALESCE(SUM(goruntulenme), 0) as toplamGoruntulenme 
           FROM ilanlar 
           WHERE (kullanici_id = ? OR magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?))
           AND aktif = 1`,
          [kullaniciId, kullaniciId]
        );
        const aktifIlanlar = Array.isArray(ilanlarResult) && ilanlarResult.length > 0 ? (ilanlarResult[0]?.toplam || 0) : 0;
        const toplamGoruntulenme = Array.isArray(ilanlarResult) && ilanlarResult.length > 0 ? (ilanlarResult[0]?.toplamGoruntulenme || 0) : 0;
        
        console.log('✅ İlan stats:', { aktifIlanlar, toplamGoruntulenme, kullaniciId });

        // Favori sayısı (kullanıcının ilanlarına eklenen favoriler)
        const favorilerResult: any = await query(
          `SELECT COUNT(*) as toplam 
           FROM favoriler f 
           JOIN ilanlar i ON f.ilan_id = i.id 
           WHERE (i.kullanici_id = ? OR i.magaza_id IN (SELECT id FROM magazalar WHERE kullanici_id = ?))`,
          [kullaniciId, kullaniciId]
        );
        const toplamFavoriler = Array.isArray(favorilerResult) && favorilerResult.length > 0 ? (favorilerResult[0]?.toplam || 0) : 0;
        
        console.log('✅ Favori stats:', { toplamFavoriler, kullaniciId });

        // Mesaj sayısı (gelen mesajlar - okunmamış)
        const mesajlarResult: any = await query(
          'SELECT COUNT(*) as toplam FROM mesajlar WHERE alici_id = ?',
          [kullaniciId]
        );
        const toplamMesajlar = Array.isArray(mesajlarResult) && mesajlarResult.length > 0 ? (mesajlarResult[0]?.toplam || 0) : 0;
        
        console.log('✅ Mesaj stats:', { toplamMesajlar, kullaniciId });

        const statsData = {
          aktifIlanlar,
          toplamGoruntulenme,
          toplamFavoriler,
          toplamMesajlar,
        };
        
        console.log('📊 Final stats:', statsData);

        return NextResponse.json({
          success: true,
          data: statsData,
        });
      } catch (dbError) {
        console.error('❌ Database hatası, fallback kullanılıyor:', dbError);
        
        // Database hatası varsa fallback
        return NextResponse.json({
          success: true,
          data: {
            aktifIlanlar: 0,
            toplamGoruntulenme: 0,
            toplamFavoriler: 0,
            toplamMesajlar: 0,
          },
        });
      }
    }

    // Genel istatistikler
    // Aktif ilan sayısı
    const ilanlarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE aktif = 1'
    );
    const aktifIlanlar = ilanlarResult[0]?.toplam || 0;

    // Mağaza sayısı
    const magazalarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM magazalar WHERE aktif = 1'
    );
    const aktifMagazalar = magazalarResult[0]?.toplam || 0;

    // Bugün eklenen ilan sayısı
    const bugunResult: any = await query(
      'SELECT COUNT(*) as toplam FROM ilanlar WHERE DATE(created_at) = CURDATE() AND aktif = 1'
    );
    const bugunEklenen = bugunResult[0]?.toplam || 0;

    // Kullanıcı sayısı
    const kullanicilarResult: any = await query(
      'SELECT COUNT(*) as toplam FROM kullanicilar WHERE aktif = 1'
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
          toplamGoruntulenme: 0,
          toplamFavoriler: 0,
          toplamMesajlar: 0,
          aktifMagazalar: 0,
          bugunEklenen: 0,
          toplamKullanicilar: 0,
        },
      },
      { status: 200 } // 500 yerine 200 dön, frontend çalışmaya devam etsin
    );
  }
}

