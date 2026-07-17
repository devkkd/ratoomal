"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/hero1.png",
  "/images/hero1.png",
  "/images/hero1.png",
  "/images/hero1.png",
  "/images/hero1.png",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FFF6EB]">

      <div className="relative h-[250px] sm:h-[280px] md:h-[400px] lg:h-[520px] xl:h-[620px]">

        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Hero ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              current === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Left Arrow */}
    <button
  onClick={prevSlide}
  className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2
             items-center justify-center
             w-10 h-10
             rounded-full
             bg-white/80 backdrop-blur-md
             border border-white/30
             shadow-lg
             hover:bg-white
             transition-all duration-300
             z-20"
>
  <ChevronLeft
    className="w-5 h-5 text-[#5B4636]"
    strokeWidth={2}
  />
</button>
        {/* Right Arrow */}
  <button
  onClick={nextSlide}
  className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2
             items-center justify-center
             w-10 h-10
             rounded-full
             bg-white/80 backdrop-blur-md
             border border-white/30
             shadow-lg
             hover:bg-white
             transition-all duration-300
             z-20"
>
  <ChevronRight
    className="w-5 h-5 text-[#5B4636]"
    strokeWidth={2}
  />
</button>

        {/* Dots */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
  {images.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrent(index)}
      aria-label={`Go to slide ${index + 1}`}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        width: "10px",
        height: "10px",
        minWidth: "10px",
        minHeight: "10px",
        maxWidth: "10px",
        maxHeight: "10px",
        padding: 0,
        margin: 0,
        border: "none",
        outline: "none",
        borderRadius: "9999px",
        flexShrink: 0,
        cursor: "pointer",
        backgroundColor:
          current === index ? "#C08237" : "rgba(255,255,255,0.7)",
      }}
    />
  ))}
</div>
      </div>
    </section>
  );
}