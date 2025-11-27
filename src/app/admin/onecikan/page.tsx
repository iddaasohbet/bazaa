"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Trash2, MoveUp, MoveDown } from "lucide-react";
import { getImageUrl, formatPrice } from "@/lib/utils";

interface Ilan {
  id: number;
  baslik: string;
  fiyat: number;
  ana_resim: string;
  kategori_ad: string;
  onecikan: boolean;
  onecikan_sira: number;
}

export default function OnecikanIlanlar() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIlanlar();
  }, []);

  const fetchIlanlar = async () => {
    try {
      const response = await fetch('/api/ilanlar/onecikan');
      const data = await response.json();
      if (data.success) {
        setIlanlar(data.data);
      }
    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFeatured = async (id: number) => {
    if (confirm('Bu ilanı öne çıkanlardan kaldırmak istediğinize emin misiniz?')) {
      // API çağrısı yapılacak
      alert('Bu özellik yakında aktif olacak');
    }
  };

  const handleMoveUp = async (id: number, currentSira: number) => {
    // API çağrısı yapılacak
    alert('Bu özellik yakında aktif olacak');
  };

  const handleMoveDown = async (id: number, currentSira: number) => {
    // API çağrısı yapılacak
    alert('Bu özellik yakında aktif olacak');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Öne Çıkan İlanlar</h1>
            </div>
            <Link href="/admin/ilanlar" className="btn-primary">
              İlan Ekle
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : ilanlar.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz Öne Çıkan İlan Yok</h3>
            <p className="text-gray-600 mb-6">İlanları öne çıkan olarak işaretleyin</p>
            <Link href="/admin/ilanlar" className="btn-primary inline-block">
              İlanlara Git
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">Öne Çıkan İlanlar</span>
              </div>
              <p className="text-sm text-gray-600">
                Bu ilanlar ana sayfada hero alanında gösterilir. Sıralamayı değiştirebilirsiniz.
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {ilanlar.map((ilan, index) => (
                <div key={ilan.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Sıra Numarası */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(ilan.id, ilan.onecikan_sira)}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <button
                        onClick={() => handleMoveDown(ilan.id, ilan.onecikan_sira)}
                        disabled={index === ilanlar.length - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Resim */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(ilan.ana_resim)}
                        alt={ilan.baslik}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Bilgiler */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {ilan.baslik}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                          {ilan.kategori_ad}
                        </span>
                        <span className="font-semibold text-blue-600">
                          {formatPrice(ilan.fiyat)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ilan/${ilan.id}`}
                        target="_blank"
                        className="btn-secondary"
                      >
                        Görüntüle
                      </Link>
                      <button
                        onClick={() => handleRemoveFromFeatured(ilan.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Öne Çıkanlardan Kaldır"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

