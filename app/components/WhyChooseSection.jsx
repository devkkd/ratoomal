"use client";
import React from 'react';
import { Gift, Globe, Umbrella } from 'lucide-react'; // Icons as placeholders for your custom SVGs

const WhyChooseSection = () => {
  const features = [
    {
      title: "Cost Savings",
      description: "Bulk buying online ensures you get the best prices, making it economical for large orders.",
 
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
       
          <img src="/images/trust/Union.svg" alt="Cost Savings Icon" className="absolute w-15 h-15"/>
        </div>
      )
    },
    {
      title: "Convenience",
      description: "Shop from the comfort of your home with our comprehensive online wholesale market.",
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
           <img src="/images/trust/Union1.svg" alt="Cost Savings Icon" className="absolute w-15 h-15"/>
        </div>
      )
    },
    {
      title: "Quality Assurance",
      description: "Each Ganesha idol is crafted to perfection, meeting high standards of quality and design.",
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
           <img src="/images/trust/Union2.svg" alt="Cost Savings Icon" className="absolute w-15 h-15"/>
        </div>
      )
    }
  ];

  return (
    <section className="w-full bg-[#fffcf7] py-10 px-6 playfair">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading (Serif Style) */}
        <h2 className="text-3xl playfair font-bold text-center text-[#1a1a1a] mb-6">
          Why Choose Ratoomal's?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center px-10 py-2 ${
                index !== features.length - 1 ? 'md:border-r border-gray-200' : ''
              }`}
            >
              {/* Icon Container */}
              <div className="mb-3 flex justify-center items-center">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg mona font-bold text-[#1a1a1a] mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm mona text-gray-600 leading-relaxed max-w-[280px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action Text */}
        <div className="mt-16 text-center space-y-1">
          <p className="text-[#555] mona text-sm ">
            Transform your home and celebrate with beautifully crafted Ganesha idols.
          </p>
          <p className="text-[#555] mona text-sm">
            Explore our collection and make your bulk purchases today for an enriched spiritual experience and memorable gifts.
          </p>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseSection;