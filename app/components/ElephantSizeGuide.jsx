
"use client";
import { useState } from "react";
import Image from "next/image";

export default function ElephantSizeGuide() {
  const [active, setActive] = useState(5); // Default to XXL

  const sizes = [
    { label: "Mini", inch: "(2”)", w: 80, h: 60 },
    { label: "Small", inch: "(4”)", w: 120, h: 100 },
    { label: "Medium", inch: "(8”)", w: 150, h: 130 },
    { label: "Large", inch: "(12”)", w: 190, h: 170 },
    { label: "XL", inch: "(18”)", w: 250, h: 235 },
    { label: "XXL", inch: "(24”+ Custom)", w: 320, h: 300 },
  ];

  return (
    <div className="w-full bg-[#FCF9F3] py-12 overflow-x-auto scrollbar-hide">
      {/* Container ki width ko humne content ke hisaab se rakha hai taaki alignment na bigde */}
      <div className="min-w-[1200px]  max-w-7xl mx-auto px-10">
        
        {/* 1. Elephant Visual Display */}
        <div className="flex mb-6 pl-12">
          {sizes.map((item, idx) => (
            <div
              key={idx}
              // Inline style se hum har column ki width image ki width ke barabar rakh rahe hain
              style={{ width: `${item.w}px`, flexShrink: 0 }}
              className="flex flex-col items-center justify-end cursor-pointer px-2"
              onClick={() => setActive(idx)}
            >
              <div
                className={`relative transition-all duration-500 ${
                  active === idx 
                  ? "opacity-100 scale-105 drop-shadow-2xl" 
                  : "opacity-40  hover:opacity-40"
                }`}
                style={{ width: `${item.w}px`, height: `${item.h}px` }}
              >
                <Image
                  src="/images/elephant-1.svg" 
                  alt={item.label}
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 2. Slider Line & Pointer */}
        <div className="relative w-full mb-8 pl-9">
          <div className="w-full h-[1px] bg-[#D1D1D1]"></div>
          
          {/* Pointer alignment logic based on actual width of images */}
          <div 
            className="absolute -top-[1px] pl-21 transition-all duration-500 ease-in-out flex justify-center"
            style={{ 
               // Har column ke center calculate karne ka formula
               width: `${sizes[active].w}px`,
               left: `${sizes.slice(0, active).reduce((acc, curr) => acc + curr.w, 0)}px`,
            }}
          >
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-[#C08237]"></div>
          </div>
        </div>

        {/* 3. Size Labels - Aligning exactly under the center of images */}
        <div className="flex w-full pl-10">
          {sizes.map((item, idx) => (
            <div
              key={idx}
              style={{ width: `${item.w}px`, flexShrink: 0 }}
              className="flex flex-col items-center px-2"
            >
              <button
                onClick={() => setActive(idx)}
                className={`flex flex-col items-center transition-all duration-300 ${
                  active === idx ? "text-black scale-110" : "text-gray-400"
                }`}
              >
                <span className={`text-[15px] whitespace-nowrap ${active === idx ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
                <span className="text-[12px] opacity-80">{item.inch}</span>
              </button>
            </div>
          ))}
        </div>

        {/* 4. Bottom Scroll Element */}
        {/* <div className="flex justify-center mt-24">
           <div className="flex flex-col items-center gap-3 opacity-30">
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-[#C08237]"></div>
              <span className="text-[11px] uppercase tracking-[0.4em] font-semibold">Explore Majesty</span>
           </div>
        </div> */}
      </div>
    </div>
  );
}