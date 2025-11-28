import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT - Mağaza güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { vitrin_oncelik } = body;
    const { id: magazaId } = await params;

    if (!magazaId) {
      return NextResponse.json(
        { success: false, message: 'شناسه مغازه الزامی است' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE magazalar 
       SET vitrin_oncelik = ?
       WHERE id = ?`,
      [vitrin_oncelik, magazaId]
    );

    return NextResponse.json({
      success: true,
      message: 'مغازه به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('Mağaza güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

