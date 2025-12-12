"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Mail, Eye, Trash2, Clock, User, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Mesaj {
  id: number;
  ad: string;
  email: string;
  telefon?: string;
  konu: string;
  mesaj: string;
  durum: 'yeni' | 'okundu' | 'cevaplanmis' | 'kapandi';
  admin_notu?: string;
  ip_adresi?: string;
  created_at: string;
}

export default function IletisimMesajlari() {
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedDurum, setSelectedDurum] = useState<string>('');
  const [selectedMesaj, setSelectedMesaj] = useState<Mesaj | null>(null);

  useEffect(() => {
    fetchMesajlar();
  }, [selectedDurum]);

  const fetchMesajlar = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);
      
      const url = selectedDurum 
        ? `/api/admin/iletisim-mesajlari?durum=${selectedDurum}`
        : '/api/admin/iletisim-mesajlari';

      const response = await fetch(url, {
        headers: {
          'x-user-id': userData.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setMesajlar(data.data || []);
        setStats(data.stats || {});
      }
      setLoading(false);
    } catch (error) {
      console.error('Mesajlar yükleme hatası:', error);
      setLoading(false);
    }
  };

  const updateDurum = async (id: number, durum: string, admin_notu?: string) => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);

      const response = await fetch('/api/admin/iletisim-mesajlari', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userData.id.toString()
        },
        body: JSON.stringify({ id, durum, admin_notu })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchMesajlar();
        setSelectedMesaj(null);
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
    }
  };

  const deleteMesaj = async (id: number) => {
    if (!confirm('این پیام حذف شود؟')) return;

    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const userData = JSON.parse(user);

      const response = await fetch(`/api/admin/iletisim-mesajlari?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userData.id.toString()
        }
      });

      const data = await response.json();
      
      if (data.success) {
        fetchMesajlar();
        alert('پیام حذف شد');
      }
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
    }
  };

  const durumBadges: any = {
    yeni: { label: 'جدید', color: 'bg-blue-100 text-blue-700', icon: Mail },
    okundu: { label: 'خوانده شده', color: 'bg-gray-100 text-gray-700', icon: Eye },
    cevaplanmis: { label: 'پاسخ داده شده', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    kapandi: { label: 'بسته شده', color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between" dir="rtl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">پیام‌های تماس</h1>
            <p className="text-gray-600 mt-1">مدیریت پیام‌های دریافتی از کاربران</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4" dir="rtl">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.toplam || 0}</div>
            <div className="text-sm text-gray-600">کل پیام‌ها</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.yeni || 0}</div>
            <div className="text-sm text-blue-700">جدید</div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.okundu || 0}</div>
            <div className="text-sm text-gray-700">خوانده شده</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.cevaplanmis || 0}</div>
            <div className="text-sm text-green-700">پاسخ داده شده</div>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <div className="text-2xl font-bold text-red-600">{stats.kapandi || 0}</div>
            <div className="text-sm text-red-700">بسته شده</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4" dir="rtl">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDurum('')}
              className={`px-4 py-2 rounded-lg transition-colors ${!selectedDurum ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              همه
            </button>
            <button
              onClick={() => setSelectedDurum('yeni')}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedDurum === 'yeni' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              جدید
            </button>
            <button
              onClick={() => setSelectedDurum('okundu')}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedDurum === 'okundu' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              خوانده شده
            </button>
            <button
              onClick={() => setSelectedDurum('cevaplanmis')}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedDurum === 'cevaplanmis' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              پاسخ داده شده
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : mesajlar.length === 0 ? (
            <div className="p-12 text-center" dir="rtl">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">پیامی یافت نشد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {mesajlar.map((mesaj) => {
                const badge = durumBadges[mesaj.durum];
                const Icon = badge.icon;
                
                return (
                  <div key={mesaj.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4" dir="rtl">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{mesaj.ad}</h3>
                          <span className={`${badge.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                            <Icon className="h-3 w-3" />
                            {badge.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span dir="ltr">{mesaj.email}</span>
                          </div>
                          {mesaj.telefon && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span dir="ltr">{mesaj.telefon}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(mesaj.created_at)}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-semibold text-gray-700 mb-1">موضوع:</div>
                          <div className="text-gray-900">{mesaj.konu}</div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-semibold text-gray-700 mb-1">پیام:</div>
                          <div className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                            {mesaj.mesaj}
                          </div>
                        </div>

                        {mesaj.admin_notu && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-sm font-semibold text-yellow-700 mb-1">یادداشت مدیر:</div>
                            <div className="text-yellow-900 text-sm">{mesaj.admin_notu}</div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedMesaj(mesaj)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => deleteMesaj(mesaj.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedMesaj && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h2 className="text-2xl font-bold">ویرایش پیام</h2>
              <p className="text-blue-100 text-sm mt-1">وضعیت و یادداشت را به‌روزرسانی کنید</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  وضعیت پیام
                </label>
                <select
                  value={selectedMesaj.durum}
                  onChange={(e) => setSelectedMesaj({...selectedMesaj, durum: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yeni">جدید</option>
                  <option value="okundu">خوانده شده</option>
                  <option value="cevaplanmis">پاسخ داده شده</option>
                  <option value="kapandi">بسته شده</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  یادداشت مدیر
                </label>
                <textarea
                  value={selectedMesaj.admin_notu || ''}
                  onChange={(e) => setSelectedMesaj({...selectedMesaj, admin_notu: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="یادداشت خود را اینجا بنویسید..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => updateDurum(selectedMesaj.id, selectedMesaj.durum, selectedMesaj.admin_notu)}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  ذخیره تغییرات
                </button>
                <button
                  onClick={() => setSelectedMesaj(null)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}



