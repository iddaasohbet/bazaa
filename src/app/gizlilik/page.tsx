"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Gizlilik() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Gizlilik Politikası</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Son güncelleme: 24 Kasım 2025</p>

            <h2>1. Toplanan Bilgiler</h2>
            <p>
              Sitemizi kullanırken sizden aşağıdaki bilgileri topluyoruz:
            </p>
            <ul>
              <li>Ad, soyad ve iletişim bilgileri</li>
              <li>E-posta adresi ve telefon numarası</li>
              <li>İlan içerikleri ve görselleri</li>
              <li>Kullanım istatistikleri ve çerezler</li>
            </ul>

            <h2>2. Bilgilerin Kullanımı</h2>
            <p>
              Topladığımız bilgileri şu amaçlarla kullanırız:
            </p>
            <ul>
              <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
              <li>Kullanıcı hesaplarını yönetmek</li>
              <li>İlanları yayınlamak ve yönetmek</li>
              <li>Size önemli bildirimleri göndermek</li>
            </ul>

            <h2>3. Bilgi Güvenliği</h2>
            <p>
              Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri alıyoruz.
              Bilgileriniz şifreli bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır.
            </p>

            <h2>4. Üçüncü Taraflarla Paylaşım</h2>
            <p>
              Kişisel bilgilerinizi izniniz olmadan üçüncü taraflarla paylaşmıyoruz. 
              Yasal zorunluluklar dışında bilgileriniz gizli tutulur.
            </p>

            <h2>5. Çerezler</h2>
            <p>
              Sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır.
              Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>

            <h2>6. Haklarınız</h2>
            <p>
              Kişisel bilgilerinize erişme, düzeltme veya silme hakkına sahipsiniz.
              Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
            </p>

            <h2>7. İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız için:<br />
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

