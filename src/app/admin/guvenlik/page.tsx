"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  FileText,
  User,
  Mail,
  Calendar
} from "lucide-react";

interface GuvenlikLog {
  id: number;
  olay: string;
  detay: string;
  ip_adresi: string;
  tarih: string;
}

interface UserInfo {
  id: number;
  email: string;
  ad: string;
  soyad: string;
  rol: string;
  kayit_tarihi: string;
}

export default function GuvenlikPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [logs, setLogs] = useState<GuvenlikLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [eskiSifre, setEskiSifre] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('');
  const [showEskiSifre, setShowEskiSifre] = useState(false);
  const [showYeniSifre, setShowYeniSifre] = useState(false);

  useEffect(() => {
    fetchGuvenlikBilgileri();
  }, []);

  const fetchGuvenlikBilgileri = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        window.location.href = '/admin/giris';
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch('/api/admin/guvenlik', {
        headers: {
          'x-user-id': user.id.toString()
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data.user);
        setLogs(data.data.logs);
      }
    } catch (error) {
      console.error('Güvenlik bilgileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSifreDegistir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eskiSifre || !yeniSifre || !yeniSifreTekrar) {
      setMessage({ type: 'error', text: 'Tüm alanları doldurun' });
      return;
    }
    
    if (yeniSifre !== yeniSifreTekrar) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' });
      return;
    }
    
    if (yeniSifre.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);

      const response = await fetch('/api/admin/guvenlik', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          eskiSifre,
          yeniSifre
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi!' });
        setEskiSifre('');
        setYeniSifre('');
        setYeniSifreTekrar('');
        setTimeout(() => {
          fetchGuvenlikBilgileri();
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Şifre değiştirilirken hata oluştu' });
    } finally {
      setSaving(false);
    }
  };

  const getOlayIcon = (olay: string) => {
    if (olay.includes('giris')) return '🔑';
    if (olay.includes('sifre')) return '🔒';
    if (olay.includes('basarisiz')) return '❌';
    if (olay.includes('basarili')) return '✅';
    return '📋';
  };

  const getOlayRenk = (olay: string) => {
    if (olay.includes('basarisiz')) return 'text-red-600 bg-red-50';
    if (olay.includes('basarili') || olay.includes('degisti')) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">امنیت</h1>
            <p className="text-gray-600">د حساب امنیت او پټنوم مدیریت</p>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Kullanıcı Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">د کارونکي معلومات</h2>
          </div>
          
          {user && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">نوم</div>
                  <div className="font-medium text-gray-900">{user.ad} {user.soyad}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">بریښنالیک</div>
                  <div className="font-medium text-gray-900">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">رول</div>
                  <div className="font-medium text-gray-900">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {user.rol}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">د ګډون نیټه</div>
                  <div className="font-medium text-gray-900">
                    {new Date(user.kayit_tarihi).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Şifre Değiştir */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">پټنوم بدلول</h2>
          </div>
          
          <form onSubmit={handleSifreDegistir} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                زوړ پټنوم
              </label>
              <div className="relative">
                <input
                  type={showEskiSifre ? "text" : "password"}
                  value={eskiSifre}
                  onChange={(e) => setEskiSifre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="زوړ پټنوم دننه کړئ"
                />
                <button
                  type="button"
                  onClick={() => setShowEskiSifre(!showEskiSifre)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showEskiSifre ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوی پټنوم
              </label>
              <div className="relative">
                <input
                  type={showYeniSifre ? "text" : "password"}
                  value={yeniSifre}
                  onChange={(e) => setYeniSifre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="نوی پټنوم دننه کړئ"
                />
                <button
                  type="button"
                  onClick={() => setShowYeniSifre(!showYeniSifre)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showYeniSifre ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوی پټنوم تکرار
              </label>
              <input
                type="password"
                value={yeniSifreTekrar}
                onChange={(e) => setYeniSifreTekrar(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="نوی پټنوم بیا دننه کړئ"
              />
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>ثبتول...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>پټنوم بدل کړئ</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Güvenlik Logları */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">د امنیت فعالیتونه</h2>
            <span className="ml-auto text-sm text-gray-500">
              وروستی {logs.length} فعالیتونه
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div 
                  key={log.id}
                  className={`p-4 rounded-lg border ${getOlayRenk(log.olay)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getOlayIcon(log.olay)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {log.olay.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{log.detay}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.tarih).toLocaleString('tr-TR')}
                        </span>
                        {log.ip_adresi && (
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            IP: {log.ip_adresi}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>هیڅ امنیتي فعالیت ندی ثبت شوی</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}










