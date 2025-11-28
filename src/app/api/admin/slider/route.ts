import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Tüm slider'ları getir (admin için)
export async function GET() {
  try {
    const sliders = await query(
      `SELECT 
        s.*,
        i.baslik as ilan_baslik,
        i.ana_resim as ilan_resim
       FROM slider s
       LEFT JOIN ilanlar i ON s.ilan_id = i.id
       ORDER BY s.sira ASC`,
      []
    );

    return NextResponse.json({
      success: true,
      data: sliders
    });
  } catch (error: any) {
    console.error('Slider yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni slider ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ilan_id, baslik, aciklama, resim, link, sira, aktif } = body;

    // İlan seçilmişse ilan_id yeterli, değilse manuel bilgiler gerekli
    if (!ilan_id && (!baslik || !resim)) {
      return NextResponse.json(
        { success: false, message: 'لطفاً یا یک آگهی انتخاب کنید یا اطلاعات کامل وارد کنید' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO slider (ilan_id, baslik, aciklama, resim, link, sira, aktif) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        ilan_id || null,
        baslik || '', 
        aciklama || '', 
        resim || '', 
        link || '', 
        sira || 0, 
        aktif !== false
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'اسلایدر اضافه شد',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('Slider ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Slider güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ilan_id, baslik, aciklama, resim, link, sira, aktif } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه اسلایدر الزامی است' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE slider 
       SET ilan_id = ?, baslik = ?, aciklama = ?, resim = ?, link = ?, sira = ?, aktif = ?, 
           updated_at = NOW()
       WHERE id = ?`,
      [
        ilan_id || null,
        baslik || '', 
        aciklama || '', 
        resim || '', 
        link || '', 
        sira || 0, 
        aktif !== false, 
        id
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'اسلایدر به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('Slider güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Slider sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه اسلایدر الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM slider WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'اسلایدر حذف شد'
    });
  } catch (error: any) {
    console.error('Slider silme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

