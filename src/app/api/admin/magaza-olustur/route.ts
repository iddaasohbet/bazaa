import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'afghanistan_ilanlar'
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const body = await request.json();
    const {
      kullanici_id,
      magaza_adi,
      aciklama,
      adres,
      telefon,
      email,
      logo,
      kapak_resmi,
      paket_id,
      ucretsiz,
      aktif
    } = body;
    
    if (!kullanici_id || !magaza_adi) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı ve mağaza adı gerekli'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // Kullanıcının zaten mağazası var mı kontrol et
    const [existingStores]: any = await connection.execute(
      'SELECT id FROM magazalar WHERE kullanici_id = ?',
      [kullanici_id]
    );
    
    if (existingStores.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Bu kullanıcının zaten bir mağazası var'
      }, { status: 400 });
    }
    
    // Mağazayı oluştur
    const [result]: any = await connection.execute(
      `INSERT INTO magazalar (
        kullanici_id, 
        ad, 
        aciklama, 
        adres, 
        telefon, 
        email, 
        logo, 
        kapak_resmi,
        aktif,
        onay_durumu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kullanici_id,
        magaza_adi,
        aciklama || '',
        adres || '',
        telefon || '',
        email || '',
        logo || null,
        kapak_resmi || null,
        aktif ? 1 : 0,
        'onaylandi' // Admin oluşturduğu için direkt onaylı
      ]
    );
    
    const magazaId = result.insertId;
    
    // Eğer paket seçildiyse ve ücretsiz ise, paket ataması yap
    if (paket_id && ucretsiz) {
      // Paket bilgilerini al
      const [paketler]: any = await connection.execute(
        'SELECT * FROM paketler WHERE id = ?',
        [paket_id]
      );
      
      if (paketler.length > 0) {
        const paket = paketler[0];
        const baslangic = new Date();
        const bitis = new Date();
        bitis.setDate(bitis.getDate() + paket.sure);
        
        // Paket aboneliği oluştur
        await connection.execute(
          `INSERT INTO magaza_paketler (
            magaza_id,
            paket_id,
            baslangic_tarihi,
            bitis_tarihi,
            durum,
            ucret,
            odeme_durumu
          ) VALUES (?, ?, ?, ?, 'aktif', 0, 'ucretsiz')`,
          [
            magazaId,
            paket_id,
            baslangic.toISOString().slice(0, 19).replace('T', ' '),
            bitis.toISOString().slice(0, 19).replace('T', ' ')
          ]
        );
        
        // Ödeme kaydı oluştur (ücretsiz olarak)
        await connection.execute(
          `INSERT INTO odemeler (
            kullanici_id,
            magaza_id,
            paket_id,
            tutar,
            durum,
            odeme_yontemi,
            aciklama
          ) VALUES (?, ?, ?, 0, 'tamamlandi', 'admin', 'Admin tarafından ücretsiz tanımlandı')`,
          [kullanici_id, magazaId, paket_id]
        );
      }
    }
    
    // Başarı mesajı
    return NextResponse.json({
      success: true,
      message: 'Mağaza başarıyla oluşturuldu',
      data: {
        magaza_id: magazaId
      }
    });
    
  } catch (error: any) {
    console.error('Mağaza oluşturma hatası:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}


