"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Download, Store, QrCode, Zap, Shield, Bell, Star, ChevronLeft } from "lucide-react";

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
        const aktifKategoriler = data.data.filter((k: any) => k.aktif).slice(0, 5);
        setKategoriler(aktifKategoriler);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const loadLogo = async () => {
    try {
      setLogoLoading(true);
      const response = await fetch('/api/admin/logo?t=' + Date.now(), { cache: 'no-store' });
      const data = await response.json();
      if (data.success && data.data.footer_logo && data.data.footer_logo.trim() !== '') {
        setFooterLogo(data.data.footer_logo);
      } else {
        setFooterLogo('');
      }
    } catch (error) {
      console.error('Footer logo yüklenemedi:', error);
      setFooterLogo('');
    } finally {
      setLogoLoading(false);
    }
  };

  useEffect(() => {
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
  const androidAktif = settings?.android_aktif === undefined || settings?.android_aktif === '' || settings?.android_aktif !== '0';
  const iosAktif = settings?.ios_aktif === undefined || settings?.ios_aktif === '' || settings?.ios_aktif !== '0';
  const appBaslik = settings?.app_baslik || 'اپلیکیشن موبایل ما را دانلود کنید';
  const appAciklama = settings?.app_aciklama || 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید';
  const appGooglePlayLink = settings?.app_google_play_link || 'https://play.google.com/store';
  const appAppStoreLink = settings?.app_app_store_link || 'https://apps.apple.com';
  const appQrUrl = settings?.app_qr_url || 'https://cihatcengiz.com';

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* App Download Section */}
      {(androidAktif || iosAktif) && (
        <div className="relative" style={{ backgroundColor: '#111827', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12" dir="rtl">
              
              {/* Phone Mockup */}
              <div className="relative flex-shrink-0 hidden md:block">
                <div className="relative w-40">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 320'%3E%3Crect x='0' y='0' width='160' height='320' rx='32' fill='%231f2937'/%3E%3Crect x='4' y='4' width='152' height='312' rx='28' fill='%23111827'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6'/%3E%3Cstop offset='50%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%238b5cf6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='12' y='12' width='136' height='296' rx='20' fill='url(%23g)'/%3E%3Crect x='50' y='16' width='60' height='20' rx='10' fill='%23111827'/%3E%3Crect x='24' y='48' width='112' height='40' rx='8' fill='rgba(255,255,255,0.2)'/%3E%3Crect x='32' y='56' width='60' height='8' rx='4' fill='rgba(255,255,255,0.3)'/%3E%3Crect x='32' y='70' width='40' height='6' rx='3' fill='rgba(255,255,255,0.2)'/%3E%3Crect x='24' y='100' width='52' height='52' rx='8' fill='rgba(255,255,255,0.2)'/%3E%3Crect x='84' y='100' width='52' height='52' rx='8' fill='rgba(255,255,255,0.2)'/%3E%3Crect x='24' y='160' width='52' height='52' rx='8' fill='rgba(255,255,255,0.2)'/%3E%3Crect x='84' y='160' width='52' height='52' rx='8' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E"
                    alt="Mobile App"
                    className="w-full h-auto"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    رایگان
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-white/10 h-8 px-4 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">نسخه جدید</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {appBaslik}
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto lg:mx-0">
                  {appAciklama}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                  <div className="flex items-center gap-2 h-10 px-4 bg-white/5 rounded-lg text-gray-300 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>سریع</span>
                  </div>
                  <div className="flex items-center gap-2 h-10 px-4 bg-white/5 rounded-lg text-gray-300 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>امن</span>
                  </div>
                  <div className="flex items-center gap-2 h-10 px-4 bg-white/5 rounded-lg text-gray-300 text-sm">
                    <Bell className="h-4 w-4" />
                    <span>اعلان آنی</span>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  {androidAktif && (
                    <a
                      href={appGooglePlayLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 h-12 px-5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 leading-none">دانلود از</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </a>
                  )}

                  {iosAktif && (
                    <a
                      href={appAppStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 h-12 px-5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 leading-none">دانلود از</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 justify-center lg:justify-start mt-6 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">۱۰K+</div>
                    <div className="text-[10px] text-gray-500">دانلود</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">۴.۸</div>
                    <div className="text-[10px] text-gray-500">امتیاز</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">۵۰۰+</div>
                    <div className="text-[10px] text-gray-500">نظر مثبت</div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="hidden lg:flex flex-col items-center gap-2">
                <div className="bg-white p-3 rounded-xl">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(appQrUrl)}&bgcolor=ffffff&color=111827&margin=0`}
                    alt="QR Code"
                    className="w-24 h-24"
                  />
                </div>
                <p className="text-gray-500 text-[10px]">اسکن کنید</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" dir="rtl">
          {/* About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              {logoLoading ? (
                <div className="h-10 w-28 bg-gray-100 animate-pulse rounded-lg"></div>
              ) : footerLogo ? (
                <img 
                  src={footerLogo} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">بازار وطن</span>
              )}
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {siteAciklama}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {sosyalFacebook && sosyalFacebook.trim() !== '' && (
                <a href={sosyalFacebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {sosyalTwitter && sosyalTwitter.trim() !== '' && (
                <a href={sosyalTwitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {sosyalInstagram && sosyalInstagram.trim() !== '' && (
                <a href={sosyalInstagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {sosyalYoutube && sosyalYoutube.trim() !== '' && (
                <a href={sosyalYoutube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {sosyalTiktok && sosyalTiktok.trim() !== '' && (
                <a href={sosyalTiktok} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
              لینک های سریع
            </h4>
            <ul className="space-y-1">
              {hizliLinkler.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="flex items-center h-10 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
              دسته بندی‌ها
            </h4>
            <ul className="space-y-1">
              {kategoriler.map((kat) => (
                <li key={kat.id}>
                  <Link 
                    href={`/kategori/${kat.slug}`} 
                    className="flex items-center h-10 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {kat.ad_dari || kat.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
              تماس با ما
            </h4>
            <ul className="space-y-2">
              <li>
                <div className="flex items-center gap-3 h-10 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <span>{iletisimAdres}</span>
                </div>
              </li>
              <li>
                <a 
                  href={`tel:${iletisimTelefon.replace(/\s/g, '')}`} 
                  className="flex items-center gap-3 h-10 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <span dir="ltr">{iletisimTelefon}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${iletisimEmail}`} 
                  className="flex items-center gap-3 h-10 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="truncate">{iletisimEmail}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4" dir="rtl">
            <p className="text-sm text-gray-500">
              {copyrightMetni}
            </p>
            <div className="flex items-center gap-1">
              {altLinkler.map((link, index) => (
                <React.Fragment key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    {link.label}
                  </Link>
                  {index < altLinkler.length - 1 && (
                    <span className="text-gray-300">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
