import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}_${randomNum}.${ext}`;

    // Upload klasörünü oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Dosyayı kaydet
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Public URL oluştur
    const imageUrl = `/uploads/images/${filename}`;

    console.log('✅ Resim yüklendi:', imageUrl);

    return NextResponse.json({
      success: true,
      message: 'تصویر با موفقیت بارگذاری شد',
      data: {
        url: imageUrl,
        filename: filename,
        size: file.size
      }
    });
  } catch (error: any) {
    console.error('❌ Resim yükleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری تصویر: ' + error.message },
      { status: 500 }
    );
  }
}

