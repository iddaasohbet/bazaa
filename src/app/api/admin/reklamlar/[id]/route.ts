import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { onay_durumu, aktif } = body;

    let updateFields = [];
    let values = [];

    if (onay_durumu) {
      updateFields.push('onay_durumu = ?');
      values.push(onay_durumu);
    }

    if (typeof aktif !== 'undefined') {
      updateFields.push('aktif = ?');
      values.push(aktif);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      );
    }

    values.push(parseInt(id));

    await query(
      `UPDATE reklamlar SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Reklam güncellendi'
    });
  } catch (error: any) {
    console.error('Reklam güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Reklam güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await query('DELETE FROM reklamlar WHERE id = ?', [parseInt(id)]);

    return NextResponse.json({
      success: true,
      message: 'Reklam silindi'
    });
  } catch (error: any) {
    console.error('Reklam silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Reklam silinirken hata oluştu' },
      { status: 500 }
    );
  }
}



