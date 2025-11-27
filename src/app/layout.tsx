import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-sans",
  subsets: ["arabic"],
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'آگهی های افغانستان';

export const metadata: Metadata = {
  title: {
    default: "سایت آگهی های افغانستان | خرید و فروش خودرو، املاک و کالای دست دوم",
    template: "%s | آگهی های افغانستان",
  },
  description:
    "بزرگترین پلتفرم آگهی در افغانستان. خرید و فروش خودرو، املاک، لوازم الکترونیکی و سایر اقلام دست دوم به صورت امن و آسان.",
  keywords: [
    "آگهی افغانستان",
    "کالای دست دوم",
    "خرید و فروش خودرو",
    "املاک افغانستان",
    "لوازم الکترونیکی",
    "آگهی کابل",
    "آگهی هرات",
    "آگهی قندهار",
  ],
  authors: [{ name: "آگهی های افغانستان" }],
  creator: "آگهی های افغانستان",
  publisher: "آگهی های افغانستان",
  openGraph: {
    title: "سایت آگهی های افغانستان",
    description:
      "بزرگترین پلتفرم آگهی در افغانستان. خرید و فروش خودرو، املاک و کالای دست دوم.",
    type: "website",
    locale: "fa_AF",
    siteName: siteName,
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

