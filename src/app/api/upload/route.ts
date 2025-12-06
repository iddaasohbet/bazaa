import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'فایلی انتخاب نشده است' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'فقط فایل‌های JPG، PNG و WEBP مجاز هستند' },
        { status: 400 }
      );
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const ext = file.name.split('.').pop();
    const filename = `uploads/images/${timestamp}_${randomNum}.${ext}`;

    // Vercel Blob'a yükle
    const blob = await put(filename, file, {
      access: 'public',
    });

    console.log('✅ Resim Vercel Blob\'a yüklendi:', blob.url);

    return NextResponse.json({
      success: true,
      message: 'تصویر با موفقیت بارگذاری شد',
      data: {
        url: blob.url,
        filename: filename,
        size: file.size
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('❌ Resim yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری تصویر: ' + errorMessage },
      { status: 500 }
    );
  }
}
