"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Slider {
  id: number;
  baslik: string;
  aciklama: string;
  resim: string;
  link?: string;
  sira: number;
  ilan_id?: number;
  fiyat?: number;
  kategori_ad?: string;
  il_ad?: string;
}

export default function FeaturedAds() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      direction: "rtl",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/slider', {
        next: { revalidate: 60 }
      });
      const data = await response.json();
      if (data.success) {
        // Resmi olan slider'ları filtrele
        const validSliders = data.data.filter((s: Slider) => s.resim && s.resim.trim() !== '');
        setSliders(validSliders);
      }
    } catch (error) {
      console.error('خطا در بارگذاری اسلایدر:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (loading || sliders.length === 0) {
    return (
      <div className="space-y-3 md:space-y-0 md:flex md:flex-row-reverse md:gap-4 md:h-[200px]">
        {/* Slider Loading */}
        <div className="flex-1 h-[160px] md:h-full rounded-2xl bg-gray-50 border border-gray-100 animate-pulse"></div>
        {/* Ad Banner Loading */}
        <div className="md:w-[340px] h-[120px] md:h-full rounded-2xl bg-gray-50 border border-gray-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-0 md:flex md:flex-row-reverse md:gap-4 md:h-[200px]">
      {/* Main Slider - Modern & Minimal */}
      <div className="flex-1 relative h-[160px] md:h-full">
        <div className="relative h-full rounded-2xl overflow-hidden border border-gray-100" ref={emblaRef}>
          <div className="flex h-full">
            {sliders.map((slider, idx) => (
              <div
                key={slider.id}
                className="relative flex-[0_0_100%] min-w-0 h-full"
              >
                {/* Background Image - Clean */}
                <Image
                  src={slider.resim}
                  alt={slider.baslik}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                  quality={90}
                />
                
                {/* Minimal Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 md:p-4">
                  <div className="flex items-end justify-between">
                    <div className="text-right flex-1">
                      <h2 className="text-white font-semibold text-xs md:text-sm mb-0.5 line-clamp-1">
                        {slider.baslik}
                      </h2>
                      {slider.aciklama && (
                        <p className="text-white/70 text-[10px] md:text-[11px] line-clamp-1 hidden sm:block">
                          {slider.aciklama}
                        </p>
                      )}
                    </div>
                    {slider.link && (
                      <Link 
                        href={slider.link} 
                        className="bg-white text-gray-900 text-[10px] md:text-[11px] font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 mr-3 md:mr-4"
                      >
                        مشاهده
                        <ArrowLeft className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Slide Number Badge */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                  {idx + 1} / {sliders.length}
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator - Bottom Center Only */}
          <div className="absolute bottom-12 md:bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 md:gap-2">
            {sliders.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-5 md:w-6 h-1.5 md:h-2 bg-white"
                    : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reklam Banner Alanı */}
      <div className="md:w-[340px] h-[120px] md:h-full">
        <a 
          href="#" 
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center group hover:shadow-xl transition-all duration-300 block"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <div className="text-white/80 text-[10px] md:text-xs font-medium mb-1">تبلیغات</div>
            <h3 className="text-white font-bold text-sm md:text-lg mb-1">فضای تبلیغاتی شما</h3>
            <p className="text-white/70 text-[10px] md:text-xs">برای رزرو این فضا تماس بگیرید</p>
          </div>

          {/* Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/20 backdrop-blur-sm text-white text-[8px] md:text-[9px] font-medium px-2 py-0.5 rounded-full">
            AD
          </div>
        </a>
      </div>
    </div>
  );
}
