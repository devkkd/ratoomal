import React from 'react';
import Image from 'next/image';

const Guarantees = () => {
  const guaranteeData = [
    {
      title: "Uncompromised Quality Control",
      description: "Every piece is meticulously inspected to meet strict quality standards before dispatch.",
      image: "/images/connect/Vector.svg",
    },
    {
      title: "Dedicated Buyer Support",
      description: "At Ratoomals, every buyer receives attentive, professional service before, during, and after the order.",
      image: "/images/connect/Vector-2.svg",
    },
    {
      title: "On-Time Delivery Commitment",
      description: "Your orders are produced and prepared to ship within the promised timelines, without compromise.",
      image: "/images/connect/Vector-1.svg",
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#FCF8F1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl playfair md:text-3xl font-bold text-gray-900 mb-4">
            Our Guarantees
          </h2>
        
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {guaranteeData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center px-4"
            >
              {/* Icon Container */}
              <div className="mb-6 flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <Image 
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold mona text-gray-800 mb-3">
                {item.title}
              </h3>
              <p className="text-black text-sm mona font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Divider Line - Only on larger screens between items */}
        {/* <div className="hidden md:grid grid-cols-3 max-w-3xl mx-auto mb-16">
          <div className="h-px bg-gray-200 mt-8"></div>
          <div className="h-px bg-gray-200 mt-8"></div>
          <div className="h-px bg-gray-200 mt-8"></div>
        </div> */}

        {/* Footer Text */}
        <div className="text-center">
         <span 
              className="bg-clip-text text-xl font-bold playfair text-transparent bg-gradient-to-b from-[#DB9E55] to-[#8F561E]"
              style={{
                backgroundImage: 'linear-gradient(180deg, #DB9E55 0%, #8F561E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Because at Ratoomal's, it isn't words that define us — it's the craftsmanship that speaks for itself.
            </span>
        </div>
      </div>
    </section>
  );
};

export default Guarantees;