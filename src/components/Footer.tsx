"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Download, Store } from "lucide-react";

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
  app_baslik: string;
  app_aciklama: string;
  app_google_play_link: string;
  app_qr_url: string;
  hizli_linkler: string;
  alt_linkler: string;
}

interface FooterLink {
  label: string;
  href: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [hizliLinkler, setHizliLinkler] = useState<FooterLink[]>([]);
  const [altLinkler, setAltLinkler] = useState<FooterLink[]>([]);

  useEffect(() => {
    fetchFooterSettings();
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
  const sosyalFacebook = settings?.sosyal_facebook || '#';
  const sosyalTwitter = settings?.sosyal_twitter || '#';
  const sosyalInstagram = settings?.sosyal_instagram || '#';
  const appBaslik = settings?.app_baslik || 'اپلیکیشن موبایل ما را دانلود کنید';
  const appAciklama = settings?.app_aciklama || 'آگهی ها را سریعتر کشف کنید، از هر جا دسترسی داشته باشید';
  const appGooglePlayLink = settings?.app_google_play_link || 'https://play.google.com/store';
  const appQrUrl = settings?.app_qr_url || 'https://cihatcengiz.com';

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      {/* Android App Download Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right" dir="rtl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {appBaslik}
              </h3>
              <p className="text-gray-600">
                {appAciklama}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* QR Code */}
              <div className="bg-white p-2 rounded-lg border border-gray-300 shadow-md">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(appQrUrl)}`}
                  alt="QR Code"
                  className="w-20 h-20"
                />
                <p className="text-center text-[10px] text-gray-500 mt-1">اسکن کنید</p>
              </div>
              
              {/* Download Button */}
              <a
                href={appGooglePlayLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-8 py-4 rounded-xl transition-all shadow-lg border-2 border-gray-700"
              >
                <Download className="h-6 w-6" />
                <div className="text-right">
                  <div className="text-xs text-gray-300">دانلود برای اندروید</div>
                  <div className="text-base font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              {/* Icon */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="h-7 w-7 text-white" />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">Bazaare</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Watan</span>
                </div>
                <span className="text-xs text-gray-500">بازار وطن</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              {siteAciklama}
            </p>
            <div className="flex gap-3">
              {sosyalFacebook && sosyalFacebook !== '#' && (
                <a href={sosyalFacebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {sosyalTwitter && sosyalTwitter !== '#' && (
                <a href={sosyalTwitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {sosyalInstagram && sosyalInstagram !== '#' && (
                <a href={sosyalInstagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
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
              <li>
                <Link href="/kategori/araclar" className="text-gray-600 hover:text-blue-600 transition-colors">
                  خودرو
                </Link>
              </li>
              <li>
                <Link href="/kategori/emlak" className="text-gray-600 hover:text-blue-600 transition-colors">
                  املاک
                </Link>
              </li>
              <li>
                <Link href="/kategori/elektronik" className="text-gray-600 hover:text-blue-600 transition-colors">
                  لوازم الکترونیکی
                </Link>
              </li>
              <li>
                <Link href="/kategori/ev-esyalari" className="text-gray-600 hover:text-blue-600 transition-colors">
                  لوازم خانه
                </Link>
              </li>
              <li>
                <Link href="/kategori/giyim" className="text-gray-600 hover:text-blue-600 transition-colors">
                  پوشاک
                </Link>
              </li>
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
              &copy; {new Date().getFullYear()} {copyrightMetni}
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
