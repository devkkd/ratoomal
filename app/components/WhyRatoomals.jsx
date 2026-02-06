"use client"; 
import React, { useState } from 'react';

const WhyRatoomals = () => {

  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      id: "01.",
      title: "Authentic Handcrafted Quality",
      description: "Every piece is inspected to meet high export standards.",
      image: "/images/blogs/image-114.svg", 
    },
    {
      id: "02.",
      title: "Heritage-First Design Language",
      description: "Rooted in Rajasthan's artistic legacy.",
      image: "/images/products/image-36.svg",
    },
    {
      id: "03.",
      title: "Flexible B2B Supply",
      description: "Bulk orders, customized design runs, and private-label partnerships.",
      image: "/images/products/image-48.svg",
    },
    {
      id: "04.",
      title: "Timely Global Delivery",
      description: "Export-ready logistics and documentation.",
      image: "/images/products/image-42.svg",
    },
    {
      id: "05.",
      title: "Compliance & Transparency",
      description: "Fully certified and export licensed.",
      image: "/images/products/image-40.svg",
    },
  ];

  return (
    <section className="bg-[#FCF8F1] py-8 sm:py-24 px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-20 sm:mx-6">
          <h2 className="text-[#1A1A1A] text-center sm:text-left playfair font-semibold text-4xl mb-4">
            Why Ratoomal's
          </h2>
          <h2 className="text-[#1A1A1A] text-3xl md:text-4xl font-bold leading-tight my-8">
            Craftsmanship You Can Trust — Global Supply You Can Scale
          </h2>
        </div>

        {/* Features List Container */}
        <div className="relative max-w-7xl sm:mt-0 -mt-9">
          {features.map((item, index) => {
            const isActive = activeIndex === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                className={`relative flex flex-col md:flex-row items-start md:items-center py-3 sm:py-10 cursor-pointer transition-all duration-500 ease-in-out ${
                  isActive ? 'bg-[#C2843E] text-white -mx-6 md:-mx-20 px-6 md:px-20' : 'text-[#1A1A1A] border-b border-gray-200'
                }`}
              >
                {/* Number */}
                <div className={`w-24  mona shrink-0 font-bold text-lg ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {item.id}
                </div>

                {/* Title */}
                <div className="w-full md:w-[35%] shrink-0">
                  <h3 className="font-bold mona text-lg tracking-wide">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="grow mt-3 md:mt-0 max-w-md">
                  <p className={`text-md mona ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Dynamic Floating Image */}
                {isActive && (
                  <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 z-20">
                    <div className="relative w-[320px] h-[220px] shadow-2xl border-2 border-white  transform rotate-3 animate-in fade-in zoom-in duration-300">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyRatoomals;