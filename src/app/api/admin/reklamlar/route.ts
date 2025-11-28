import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Tüm reklamları getir
export async function GET() {
  try {
    const reklamlar: any = await query(
      `SELECT 
        id, baslik, aciklama, banner_url as resim, hedef_url as link,
        konum, goruntulenme, tiklanma, aktif, 
        baslangic_tarihi as baslangic, bitis_tarihi as bitis,
        created_at
       FROM reklamlar 
       ORDER BY created_at DESC`,
      []
    );

    return NextResponse.json({
      success: true,
      data: reklamlar
    });
  } catch (error: any) {
    console.error('Reklam yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni reklam ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baslik, aciklama, resim, link, konum, baslangic, bitis, aktif } = body;

    if (!baslik || !resim) {
      return NextResponse.json(
        { success: false, message: 'عنوان و تصویر الزامی است' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO reklamlar 
       (baslik, aciklama, banner_url, hedef_url, konum, reklam_turu, 
        baslangic_tarihi, bitis_tarihi, aktif, onay_durumu) 
       VALUES (?, ?, ?, ?, ?, 'banner_header', ?, ?, ?, 'onaylandi')`,
      [
        baslik, 
        aciklama || '', 
        resim, 
        link || '', 
        konum || 'header',
        baslangic || new Date(),
        bitis || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        aktif !== false ? 1 : 0
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'تبلیغ اضافه شد',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('Reklam ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Reklam güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, baslik, aciklama, resim, link, konum, baslangic, bitis, aktif } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه تبلیغ الزامی است' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE reklamlar 
       SET baslik = ?, aciklama = ?, banner_url = ?, hedef_url = ?, 
           konum = ?, baslangic_tarihi = ?, bitis_tarihi = ?, aktif = ?
       WHERE id = ?`,
      [
        baslik, 
        aciklama || '', 
        resim, 
        link || '', 
        konum || 'header',
        baslangic,
        bitis,
        aktif !== false ? 1 : 0,
        id
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'تبلیغ به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('Reklam güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Reklam sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه تبلیغ الزامی است' },
        { status: 400 }
      );
    }

    await query('DELETE FROM reklamlar WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'تبلیغ حذف شد'
    });
  } catch (error: any) {
    console.error('Reklam silme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
