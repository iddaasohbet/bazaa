import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { aktif, sira } = body;

    let updateFields = [];
    let values = [];

    if (typeof aktif !== 'undefined') {
      updateFields.push('aktif = ?');
      values.push(aktif);
    }

    if (typeof sira !== 'undefined') {
      updateFields.push('sira = ?');
      values.push(sira);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      );
    }

    values.push(parseInt(id));

    await query(
      `UPDATE vitrinler SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Vitrin güncellendi'
    });
  } catch (error: any) {
    console.error('Vitrin güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Vitrin güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}



