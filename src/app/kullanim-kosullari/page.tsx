"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function KullanimKosullari() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Kullanım Koşulları</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Son güncelleme: 24 Kasım 2025</p>

            <h2>1. Hizmet Kullanımı</h2>
            <p>
              Bu platformu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız:
            </p>
            <ul>
              <li>18 yaşından büyük olduğunuzu</li>
              <li>Verdiğiniz bilgilerin doğru ve güncel olduğunu</li>
              <li>Yasal düzenlemelere uygun hareket edeceğinizi</li>
            </ul>

            <h2>2. İlan Verme Kuralları</h2>
            <p>
              İlan verirken aşağıdaki kurallara uymalısınız:
            </p>
            <ul>
              <li>Yalnızca yasal ürün ve hizmetler için ilan verebilirsiniz</li>
              <li>Yanıltıcı veya yanlış bilgi içeren ilanlar yasaktır</li>
              <li>Başkalarına ait görseller kullanılamaz</li>
              <li>Müstehcen veya uygunsuz içerik yasaktır</li>
              <li>Her ilan için doğru kategori seçilmelidir</li>
            </ul>

            <h2>3. Hesap Sorumluluğu</h2>
            <p>
              Kullanıcı hesabınız ve şifrenizin güvenliğinden siz sorumlusunuz.
              Hesabınızdan gerçekleştirilen tüm işlemlerden sorumlusunuz.
            </p>

            <h2>4. Yasak Faaliyetler</h2>
            <p>
              Aşağıdaki faaliyetler kesinlikle yasaktır:
            </p>
            <ul>
              <li>Sahte veya aldatıcı ilanlar vermek</li>
              <li>Spam veya toplu mesaj göndermek</li>
              <li>Başkalarının hesaplarına yetkisiz erişim</li>
              <li>Site güvenliğini tehdit eden faaliyetler</li>
              <li>Telif hakkı ihlali</li>
            </ul>

            <h2>5. Ücretler ve Ödemeler</h2>
            <p>
              Temel ilan verme hizmeti ücretsizdir. Premium özellikler için ücret alınabilir.
              Ödeme koşulları ve iade politikası ayrıca belirtilir.
            </p>

            <h2>6. İçerik Sahipliği</h2>
            <p>
              Verdiğiniz ilanlar ve içerikler size aittir. Ancak platformda yayınladığınız
              içeriği kullanma, gösterme ve dağıtma hakkını bize vermiş olursunuz.
            </p>

            <h2>7. Hizmet Değişiklikleri</h2>
            <p>
              Platformumuzda ve kullanım koşullarında değişiklik yapma hakkını saklı tutarız.
              Önemli değişiklikler kullanıcılara bildirilir.
            </p>

            <h2>8. Sorumluluk Reddi</h2>
            <p>
              Platform sadece alıcı ve satıcıları bir araya getiren bir aracıdır.
              İşlemlerden doğan sorumluluğu kabul etmiyoruz.
            </p>

            <h2>9. Hesap Askıya Alma</h2>
            <p>
              Kurallara uymayan kullanıcıların hesapları uyarı vermeksizin askıya alınabilir
              veya silinebilir.
            </p>

            <h2>10. İletişim</h2>
            <p>
              Kullanım koşulları hakkında sorularınız için:<br />
              E-posta: info@afganistan-ilanlar.com<br />
              Telefon: +93 700 000 000
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

