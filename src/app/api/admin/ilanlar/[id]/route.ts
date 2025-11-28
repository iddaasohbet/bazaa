import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT - İlan güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { onecikan } = body;
    const { id: ilanId } = await params;

    if (!ilanId) {
      return NextResponse.json(
        { success: false, message: 'شناسه آگهی الزامی است' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE ilanlar 
       SET onecikan = ?
       WHERE id = ?`,
      [onecikan ? 1 : 0, ilanId]
    );

    return NextResponse.json({
      success: true,
      message: 'آگهی به‌روزرسانی شد'
    });
  } catch (error: any) {
    console.error('İlan güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

