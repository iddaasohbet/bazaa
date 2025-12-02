"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  UserX,
  UserCheck
} from "lucide-react";

interface Kullanici {
  id: number;
  ad: string;
  email: string;
  telefon?: string;
  rol: 'user' | 'admin';
  profil_resmi?: string;
  aktif: boolean;
  created_at: string;
}

export default function KullanicilarPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("all");

  useEffect(() => {
    fetchKullanicilar();
  }, [filterRol]);

  const fetchKullanicilar = async () => {
    setLoading(true);
    try {
      const rol = filterRol === 'all' ? '' : filterRol;
      const response = await fetch(`/api/admin/kullanicilar?limit=100&rol=${rol}`);
      const data = await response.json();
      
      if (data.success) {
        setKullanicilar(data.data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === 1) {
      alert('نمی‌توانید کاربر اصلی مدیر را حذف کنید');
      return;
    }

    if (!confirm('این کاربر را حذف کنید؟')) return;

    try {
      const response = await fetch(`/api/admin/kullanicilar?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('کاربر با موفقیت حذف شد');
        fetchKullanicilar();
      } else {
        alert(data.message || 'خطا در حذف کاربر');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('خطا در حذف کاربر');
    }
  };

  const toggleAktif = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/kullanicilar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          aktif: !currentStatus
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchKullanicilar();
      } else {
        alert(data.message || 'خطا در به‌روزرسانی');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('خطا در به‌روزرسانی وضعیت');
    }
  };

  const filteredKullanicilar = kullanicilar.filter(kullanici =>
    kullanici.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kullanici.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
            <p className="text-gray-600 mt-1">
              مجموع {filteredKullanicilar.length} کاربر
            </p>
          </div>
          <Link
            href="/admin/kullanicilar/yeni"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>کاربر جدید</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی کاربر (نام یا ایمیل)..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه کاربران</option>
                <option value="admin">مدیران</option>
                <option value="user">کاربران عادی</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <User className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{kullanicilar.length}</div>
            <div className="text-sm opacity-90">کل کاربران</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {kullanicilar.filter(k => k.aktif).length}
            </div>
            <div className="text-sm opacity-90">فعال</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {kullanicilar.filter(k => k.rol === 'admin').length}
            </div>
            <div className="text-sm opacity-90">مدیران</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <UserX className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {kullanicilar.filter(k => !k.aktif).length}
            </div>
            <div className="text-sm opacity-90">غیرفعال</div>
          </div>
        </div>

        {/* Kullanıcılar Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            </div>
          ) : filteredKullanicilar.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">کاربری یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      کاربر
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ایمیل
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      تلفن
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      نقش
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      تاریخ ثبت
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredKullanicilar.map((kullanici) => (
                    <tr key={kullanici.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {kullanici.profil_resmi ? (
                            <img
                              src={kullanici.profil_resmi}
                              alt={kullanici.ad}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-gray-200">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{kullanici.ad}</div>
                            <div className="text-xs text-gray-500">ID: {kullanici.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                          <Mail className="w-4 h-4" />
                          {kullanici.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {kullanici.telefon ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                            <Phone className="w-4 h-4" />
                            {kullanici.telefon}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          kullanici.rol === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          <Shield className="w-3 h-3" />
                          {kullanici.rol === 'admin' ? 'مدیر' : 'کاربر'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAktif(kullanici.id, kullanici.aktif)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            kullanici.aktif 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {kullanici.aktif ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              فعال
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              غیرفعال
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(kullanici.created_at).toLocaleDateString('fa-AF')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/kullanicilar/${kullanici.id}/duzenle`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(kullanici.id)}
                            disabled={kullanici.id === 1}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={kullanici.id === 1 ? 'نمی‌توانید مدیر اصلی را حذف کنید' : 'حذف'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
















