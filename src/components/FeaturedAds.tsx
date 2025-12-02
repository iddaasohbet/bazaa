"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { formatPrice, getImageUrl } from "@/lib/utils";

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
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/slider', {
        next: { revalidate: 60 }, // Cache 60 saniye
      });
      const data = await response.json();
      if (data.success) {
        setSliders(data.data);
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
      <section className="relative h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </section>
    );
  }

  return (
    <section className="relative h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden bg-gray-900 rounded-lg">
      <div className="h-full w-full" ref={emblaRef} dir="ltr">
        <div className="flex h-full">
          {sliders.map((slider) => (
            <div
              key={slider.id}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={slider.resim}
                  alt={slider.baslik}
                  fill
                  priority={slider.id === sliders[0]?.id}
                  className="object-cover object-center"
                  sizes="100vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                <div className="absolute inset-0 flex items-center" dir="rtl">
                  <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="max-w-2xl"
                    >
                      <p className="mb-2 text-sm sm:text-base font-semibold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="inline-block w-12 h-0.5 bg-yellow-400"></span>
                        بازار وطن
                      </p>
                      <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                        {slider.baslik}
                      </h1>
                      <p className="mb-4 text-base sm:text-lg lg:text-xl text-gray-200 line-clamp-2">
                        {slider.aciklama}
                      </p>
                      
                      {/* Eğer ilan ise fiyat göster */}
                      {slider.ilan_id && slider.fiyat !== undefined && (
                        <div className="mb-6 flex items-baseline gap-3">
                          <span className="text-4xl sm:text-5xl font-bold text-white">
                            {formatPrice(slider.fiyat)}
                          </span>
                          {slider.kategori_ad && (
                            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {slider.kategori_ad}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {slider.link && (
                        <Link
                          href={slider.link}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:scale-105"
                        >
                          <span>{slider.ilan_id ? 'مشاهده آگهی' : 'مشاهده بیشتر'}</span>
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

