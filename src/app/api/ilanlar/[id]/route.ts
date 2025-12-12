import { NextRequest, NextResponse } from 'next/server';
import { getIlanDetay } from '@/lib/ilan';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ilan = await getIlanDetay(parseInt(id));
    if (!ilan) {
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
