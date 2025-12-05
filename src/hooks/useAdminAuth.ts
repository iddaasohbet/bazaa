import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('user');

    if (!token) {
      router.push('/admin/giris');
      return;
    }

    // Kullanıcı admin mi kontrol et
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.rol !== 'admin') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('user');
          router.push('/admin/giris');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        router.push('/admin/giris');
      }
    }
  }, [router]);
}











