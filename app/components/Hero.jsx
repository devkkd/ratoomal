"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Hero = () => {
  const videoRefs = useRef([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videosPlaying, setVideosPlaying] = useState({});

  // Try to play the first video when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstVideo = videoRefs.current[0];
      if (firstVideo && typeof firstVideo.play === 'function') {
        firstVideo.play()
          .then(() => {
            console.log('First video started playing automatically');
            setVideosPlaying(prev => ({ ...prev, [0]: true }));
          })
          .catch(error => {
            console.warn('Autoplay failed for first video:', error);
          });
      }
    }, 1000); // Wait 1 second for videos to load

    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      id: 1,
      video: "/images/hero/41396-429396744_small.mp4",
      poster: "/images/placeholder.png",
      fallbackImage: "/images/hero/image-70.svg",
      title: "Discover Premium Fragrances",
      subtitle:
        "Experience luxury perfumes crafted for timeless elegance and lasting impressions.",
      ctaText: "Shop Now",
    },
    {
      id: 2,
      video: "/images/hero/128564-741747704_small.mp4",
      poster: "/images/placeholder.png",
      fallbackImage: "/images/hero/Group-277.svg",
      title: "The Art of Gifting",
      subtitle:
        "Exquisite collectibles and divine figures for your loved ones.",
      ctaText: "Explore More",
    },
    {
      id: 3,
      video: "/images/hero/143323-782178554_small.mp4",
      poster: "/images/placeholder.png",
      fallbackImage: "/images/hero/image-70.svg",
      title: "Exclusive Collections",
      subtitle: "Curated selections for the discerning connoisseur.",
      ctaText: "View Collection",
    },
  ];

  const handleVideoError = (index, slide) => {
    console.warn(`Video failed to load: ${slide.video}, using fallback image`);
    // Hide video and show fallback image
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.style.display = 'none';
    }
  };

  const handleSlideChange = (swiper) => {
    console.log(`Slide changed to: ${swiper.realIndex}`);
    setCurrentSlide(swiper.realIndex);
    
    // Pause all videos first
    videoRefs.current.forEach((video, index) => {
      if (video && typeof video.pause === 'function') {
        video.pause();
        setVideosPlaying(prev => ({ ...prev, [index]: false }));
      }
    });
    
    // Play current slide video
    const currentVideo = videoRefs.current[swiper.realIndex];
    if (currentVideo && typeof currentVideo.play === 'function') {
      currentVideo.play()
        .then(() => {
          setVideosPlaying(prev => ({ ...prev, [swiper.realIndex]: true }));
        })
        .catch(error => {
          console.warn('Failed to play video on slide change:', error);
          setVideosPlaying(prev => ({ ...prev, [swiper.realIndex]: false }));
        });
    }
  };

  const handlePlayVideo = (slideIndex) => {
    const video = videoRefs.current[slideIndex];
    if (video && typeof video.play === 'function') {
      video.play()
        .then(() => {
          setVideosPlaying(prev => ({ ...prev, [slideIndex]: true }));
        })
        .catch(error => {
          console.warn('Failed to play video manually:', error);
        });
    }
  };

  return (
    <section className="relative w-full h-[400px] overflow-hidden bg-[#FFF6EB]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={800}
        loop
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
        //   el: ".swiper-pagination-custom",
        }}
        onInit={handleSlideChange}
        onSlideChange={handleSlideChange}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Simple Video Element */}
              <video
                ref={(el) => videoRefs.current[index] = el}
                className="absolute inset-0 w-full h-full object-cover"
                poster={slide.poster}
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => handleVideoError(index, slide)}
                onPlay={() => setVideosPlaying(prev => ({ ...prev, [index]: true }))}
                onPause={() => setVideosPlaying(prev => ({ ...prev, [index]: false }))}
              >
                <source src={slide.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Gradient overlay */}
              <div className="absolute inset-0 " />

              {/* Play button overlay - show if video is not playing */}
              {/* {!videosPlaying[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <button
                    onClick={() => handlePlayVideo(index)}
                    className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 shadow-lg"
                  >
                    <svg className="w-6 h-6 text-[#C08237] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              )} */}

              {/* Content */}
              {/* <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                  <div className="max-w-xl">
                    <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-[#333] mb-4">
                      {slide.title}
                    </h1>
                    <p className="font-mona text-sm md:text-base text-gray-600 mb-8 max-w-md">
                      {slide.subtitle}
                    </p>
                    <button className="px-8 py-3 bg-[#C08237] text-white font-bold rounded-full hover:bg-[#A66D2E] transition">
                      {slide.ctaText}
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation */}
        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 bg-white rounded-full items-center justify-center shadow">
          <ChevronLeft className="text-[#C08237]" />
        </button>

        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-10 h-10 bg-white rounded-full items-center justify-center shadow">
          <ChevronRight className="text-[#C08237]" />
        </button>

        {/* Pagination */}
        <div className="swiper-pagination-custom  absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
      </Swiper>

      {/* Styles */}
     <style jsx global>{`
  /* pagination wrapper bg */
  .swiper-pagination {

    padding: 6px 12px;
    border-radius: 20px;
    width: fit-content;
    left: 50% !important;
    transform: translateX(-50%);
    bottom: 24px !important;
  }

  /* dots */
  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: #ffffff;
    opacity: 1;
    transition: all 0.3s ease;
  }

  /* active */
  .swiper-pagination-bullet-active {
    width: 24px;
    background: #C08237;
    border-radius: 12px;
  }
`}</style>

    </section>
  );
};

export default Hero;
