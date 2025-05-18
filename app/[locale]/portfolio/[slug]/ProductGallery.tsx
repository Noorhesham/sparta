"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

// Styles for swiper customization
import "./swiper-styles.css";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  // Filter out any undefined or empty image URLs
  const validImages = images.filter(img => img);
  
  // Create thumbnails array from valid images
  const thumbs = validImages.length > 1 ? validImages : [];
  
  // Main Swiper instance
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  // If no images are available, show placeholder
  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main Gallery */}
      <div className="relative mb-4">
        <Swiper
          spaceBetween={10}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          thumbs={{ 
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
          }}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
          className="main-swiper rounded-2xl overflow-hidden"
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={`main-${index}`}>
              <div className="relative w-full h-[500px]">
                <Image
                  src={image}
                  alt={`${name} - image ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev">
            <ChevronLeft className="h-6 w-6" />
          </div>
          <div className="swiper-button-next">
            <ChevronRight className="h-6 w-6" />
          </div>
        </Swiper>
      </div>

      {/* Thumbnails - Only show if we have multiple images */}
      {thumbs.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper"
        >
          {thumbs.map((thumb, index) => (
            <SwiperSlide key={`thumb-${index}`} className="w-24 h-24">
              <div className="relative w-full h-full cursor-pointer">
                <Image
                  src={thumb}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover rounded-lg border-2 border-transparent hover:border-fuchsia-500 transition-all"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
} 