"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Iletisim() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    konu: "",
    mesaj: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // API çağrısı yapılacak
    setTimeout(() => {
      alert('Mesajınız alındı. En kısa sürede size dönüş yapacağız.');
      setFormData({ ad: "", email: "", konu: "", mesaj: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">İletişim</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                    className="input"
                    placeholder="Adınız"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    value={formData.konu}
                    onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
                    className="input"
                    placeholder="Mesajınızın konusu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    value={formData.mesaj}
                    onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                    className="input"
                    rows={6}
                    placeholder="Mesajınızı buraya yazın..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">İletişim Bilgileri</h2>
                <p className="text-blue-100 mb-6">
                  Size nasıl yardımcı olabiliriz? Sorularınız için bize ulaşın.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Adres</div>
                      <div className="text-blue-100">Kabil, Afganistan</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Telefon</div>
                      <a href="tel:+93700000000" className="text-blue-100 hover:text-white">
                        +93 700 000 000
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">E-posta</div>
                      <a href="mailto:info@afganistan-ilanlar.com" className="text-blue-100 hover:text-white">
                        info@afganistan-ilanlar.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Çalışma Saatleri</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Pazartesi - Cuma</span>
                    <span className="font-semibold">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumartesi</span>
                    <span className="font-semibold">09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar</span>
                    <span className="font-semibold text-red-600">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

