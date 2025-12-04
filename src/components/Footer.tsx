"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Download, Store, QrCode } from "lucide-react";

interface FooterSettings {
  site_baslik: string;
  site_aciklama: string;
  copyright_metni: string;
  iletisim_adres: string;
  iletisim_telefon: string;
  iletisim_email: string;
  sosyal_facebook: string;
  sosyal_twitter: string;
  sosyal_instagram: string;
  sosyal_youtube: string;
  sosyal_tiktok: string;
  android_aktif: string;
  ios_aktif: string;
  app_baslik: string;
  app_aciklama: string;
  app_google_play_link: string;
  app_app_store_link: string;
  app_qr_url: string;
  hizli_linkler: string;
  alt_linkler: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface Kategori {
  id: number;
  ad: string;
  ad_dari?: string;
  slug: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [hizliLinkler, setHizliLinkler] = useState<FooterLink[]>([]);
  const [altLinkler, setAltLinkler] = useState<FooterLink[]>([]);
  const [footerLogo, setFooterLogo] = useState<string>("");
  const [logoLoading, setLogoLoading] = useState(true);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);

  useEffect(() => {
    fetchFooterSettings();
    loadLogo();
    fetchKategoriler();
  }, []);

  const fetchKategoriler = async () => {
    try {
      const response = await fetch('/api/kategoriler');
      const data = await response.json();
      if (data.success) {
        // Sadece aktif kategorilerden ilk 5'ini al
        const aktifKategoriler = data.data.filter((k: any) => k.aktif).slice(0, 5);
        setKategoriler(aktifKategoriler);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const loadLogo = async () => {
    try {
      console.log('📊 Footer: Logo yükleniyor...');
      setLogoLoading(true);
      
      const response = await fetch('/api/admin/logo?t=' + Date.now(), { cache: 'no-store' });
      const data = await response.json();
      
      console.log('📋 Footer: API Response:', data);
      
      if (data.success && data.data.footer_logo && data.data.footer_logo.trim() !== '') {
        console.log('✅ Footer: Logo bulundu, uzunluk:', data.data.footer_logo.length);
        setFooterLogo(data.data.footer_logo);
      } else {
        console.log('⚠️ Footer: Logo yok');
        setFooterLogo('');
      }
    } catch (error) {
      console.error('❌ Footer logo yüklenemedi:', error);
      setFooterLogo('');
    } finally {
      setLogoLoading(false);
    }
  };

  useEffect(() => {
    // Logo güncellendiğinde yeniden yükle
    const handleLogoUpdate = () => {
      loadLogo();
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch('/api/admin/footer-ayarlari');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        
        // JSON linklerini parse et
        try {
          const hizli = JSON.parse(data.data.hizli_linkler || '[]');
          setHizliLinkler(hizli);
        } catch (e) {
          setHizliLinkler([
            { label: "درباره ما", href: "/hakkimizda" },
            { label: "چگونه کار می کند؟", href: "/nasil-calisir" },
            { label: "خرید امن", href: "/guvenli-alisveris" },
            { label: "سوالات متداول", href: "/sss" }
          ]);
        }
        
        try {
          const alt = JSON.parse(data.data.alt_linkler || '[]');
          setAltLinkler(alt);
        } catch (e) {
          setAltLinkler([
            { label: "سیاست حفظ حریم خصوصی", href: "/gizlilik" },
            { label: "شرایط استفاده", href: "/kullanim-kosullari" },
            { label: "حریم خصوصی", href: "/kvkk" }
          ]);
        }
      }
    } catch (error) {
      console.error('Footer ayarları yüklenemedi:', error);
    }
  };

  // Default değerler (yüklenene kadar)
  const siteBaslik = settings?.site_baslik || 'BazaareWatan';
  const siteAciklama = settings?.site_aciklama || 'معتبرترین پلتفرم آگهی در افغانستان. کالای دست دوم، خودرو، املاک و بیشتر.';
  const copyrightMetni = settings?.copyright_metni || 'آگهی های افغانستان. تمامی حقوق محفوظ است.';
  const iletisimAdres = settings?.iletisim_adres || 'کابل، افغانستان';
  const iletisimTelefon = settings?.iletisim_telefon || '+93 700 000 000';
  const iletisimEmail = settings?.iletisim_email || 'info@afghanistan-ilanlar.com';
  const sosyalFacebook = settings?.sosyal_facebook || '';
  const sosyalTwitter = settings?.sosyal_twitter || '';
  const sosyalInstagram = settings?.sosyal_instagram || '';
  const sosyalYoutube = settings?.sosyal_youtube || '';
  const sosyalTiktok = settings?.sosyal_tiktok || '';
  // Varsayılan olarak açık, admin panelden kapatılabilir
  // Sadece açıkça '0' yazılmışsa kapalı, diğer tüm durumlarda açık
  const androidAktif = settings?.android_aktif === undefined || settings?.android_aktif === '' || settings?.android_aktif !== '0';
  const iosAktif = settings?.ios_aktif === undefined || settings?.ios_aktif === '' || settings?.ios_aktif !== '0';
  const appBaslik = settings?.app_baslik || 'اپلیکیشن موبایل ما را دانلود کنید';
  const appAciklama = settings?.app_aciklama || 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید';
  const appGooglePlayLink = settings?.app_google_play_link || 'https://play.google.com/store';
  const appAppStoreLink = settings?.app_app_store_link || 'https://apps.apple.com';
  const appQrUrl = settings?.app_qr_url || 'https://cihatcengiz.com';

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* Kurumsal Mobil Uygulama İndirme Alanı */}
      {(androidAktif || iosAktif) && (
        <div className="relative border-b border-gray-200 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Sol taraf - Başlık */}
              <div className="text-center lg:text-right" dir="rtl">
                <div className="inline-flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-blue-400" />
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {appBaslik}
                  </h3>
                </div>
                <p className="text-blue-200 text-sm">
                  {appAciklama}
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-end text-xs text-blue-300 mt-3">
                  <span>• دسترسی سریع</span>
                  <span>• امن و مطمئن</span>
                  <span>• رایگان</span>
                </div>
              </div>

              {/* Sağ taraf - Download butonları */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Android */}
                {androidAktif && (
                  <div className="flex flex-col items-center gap-2">
                    <a
                      href={appGooglePlayLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500">دانلود از</div>
                        <div className="text-sm font-bold">Google Play</div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </a>
                    <div className="bg-white p-2 rounded-lg shadow-md">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(appGooglePlayLink)}&bgcolor=ffffff&color=000000&margin=0`}
                        alt="Android QR"
                        className="w-16 h-16"
                      />
                      <p className="text-center text-[9px] text-gray-500 mt-1">اسکن برای دانلود</p>
                    </div>
                  </div>
                )}

                {/* iOS */}
                {iosAktif && (
                  <div className="flex flex-col items-center gap-2">
                    <a
                      href={appAppStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="h-8 w-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500">دانلود از</div>
                        <div className="text-sm font-bold">App Store</div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </a>
                    <div className="bg-white p-2 rounded-lg shadow-md">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(appAppStoreLink)}&bgcolor=ffffff&color=000000&margin=0`}
                        alt="iOS QR"
                        className="w-16 h-16"
                      />
                      <p className="text-center text-[9px] text-gray-500 mt-1">اسکن برای دانلود</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4 group">
                {logoLoading ? (
                  <div className="h-14 w-36 bg-gray-200 animate-pulse rounded"></div>
                ) : footerLogo ? (
                  <div className="relative h-14">
                    <img 
                      src={footerLogo} 
                      alt="Logo" 
                      className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-blue-600">
                    WatanBazaare
                  </div>
                )}
              </Link>
            <p className="text-sm text-gray-600 mb-4">
              {siteAciklama}
            </p>
            <div className="flex gap-3">
              {sosyalFacebook && sosyalFacebook.trim() !== '' && (
                <a href={sosyalFacebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {sosyalTwitter && sosyalTwitter.trim() !== '' && (
                <a href={sosyalTwitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {sosyalInstagram && sosyalInstagram.trim() !== '' && (
                <a href={sosyalInstagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {sosyalYoutube && sosyalYoutube.trim() !== '' && (
                <a href={sosyalYoutube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {sosyalTiktok && sosyalTiktok.trim() !== '' && (
                <a href={sosyalTiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">لینک های سریع</h4>
            <ul className="space-y-2 text-sm">
              {hizliLinkler.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">دسته بندی ها</h4>
            <ul className="space-y-2 text-sm">
              {kategoriler.map((kat) => (
                <li key={kat.id}>
                  <Link 
                    href={`/kategori/${kat.slug}`} 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {kat.ad_dari || kat.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{iletisimAdres}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href={`tel:${iletisimTelefon.replace(/\s/g, '')}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {iletisimTelefon}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${iletisimEmail}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {iletisimEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              {copyrightMetni}
            </div>
            <div className="flex gap-6">
              {altLinkler.map((link, index) => (
                <Link key={index} href={link.href} className="hover:text-blue-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
