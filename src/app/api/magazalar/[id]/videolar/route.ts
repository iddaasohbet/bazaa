import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Videoları Getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Mağazanın videolarını çek
    const videolar = await query(
      `
      SELECT 
        v.*,
        m.store_level
      FROM magaza_videolar v
      LEFT JOIN magazalar m ON v.magaza_id = m.id
      WHERE v.magaza_id = ? AND v.durum = 'aktif'
      ORDER BY v.sira ASC, v.created_at DESC
      `,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: videolar
    });

  } catch (error: any) {
    console.error('Video getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Videolar yüklenemedi', data: [] },
      { status: 200 }
    );
  }
}

// Yeni Video Ekle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { video_url, thumbnail_url, baslik, aciklama, sure } = body;

    if (!video_url || !sure) {
      return NextResponse.json(
        { success: false, message: 'Video URL ve süre gereklidir' },
        { status: 400 }
      );
    }

    // Süre kontrolü (10 veya 30 saniye)
    if (sure !== 10 && sure !== 30) {
      return NextResponse.json(
        { success: false, message: 'Video süresi 10 veya 30 saniye olmalıdır' },
        { status: 400 }
      );
    }

    // Mağazanın paket seviyesini kontrol et
    const magazaResult: any = await query(
      'SELECT store_level FROM magazalar WHERE id = ?',
      [parseInt(id)]
    );

    if (!magazaResult || magazaResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Mağaza bulunamadı' },
        { status: 404 }
      );
    }

    const magaza = magazaResult[0];
    
    // Sadece Elite/Premium mağazalar video ekleyebilir
    if (magaza.store_level !== 'elite' && magaza.store_level !== 'pro') {
      return NextResponse.json(
        { success: false, message: 'Sadece Premium mağazalar video ekleyebilir' },
        { status: 403 }
      );
    }

    // Mevcut video sayısını kontrol et
    const videoCountResult: any = await query(
      'SELECT COUNT(*) as total FROM magaza_videolar WHERE magaza_id = ? AND durum = "aktif"',
      [parseInt(id)]
    );

    const videoCount = videoCountResult[0]?.total || 0;
    const maxVideos = magaza.store_level === 'elite' ? 10 : 5;

    if (videoCount >= maxVideos) {
      return NextResponse.json(
        { success: false, message: `Maksimum ${maxVideos} video yükleyebilirsiniz` },
        { status: 400 }
      );
    }

    // Videoyu kaydet
    await query(
      `INSERT INTO magaza_videolar (magaza_id, video_url, thumbnail_url, baslik, aciklama, sure, durum) 
       VALUES (?, ?, ?, ?, ?, ?, 'aktif')`,
      [parseInt(id), video_url, thumbnail_url || null, baslik || null, aciklama || null, sure]
    );

    return NextResponse.json({
      success: true,
      message: 'Video başarıyla eklendi'
    });

  } catch (error: any) {
    console.error('Video ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Video eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Video Sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('video_id');

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: 'Video ID gereklidir' },
        { status: 400 }
      );
    }

    await query('DELETE FROM magaza_videolar WHERE id = ?', [parseInt(videoId)]);

    return NextResponse.json({
      success: true,
      message: 'Video silindi'
    });

  } catch (error: any) {
    console.error('Video silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Video silinemedi' },
      { status: 500 }
    );
  }
}



















