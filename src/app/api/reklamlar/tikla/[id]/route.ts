import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Tıklanma sayısını artır
    await query(
      'UPDATE reklamlar SET tiklanma = tiklanma + 1 WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      message: 'Tıklama kaydedildi'
    });
  } catch (error: any) {
    console.error('Tıklama kaydetme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Tıklama kaydedilemedi' },
      { status: 500 }
    );
  }
}



