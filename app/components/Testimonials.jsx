"use client";
import React from 'react';
import { Star, Quote, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const testimonials = [
  {
    id: 1,
    type: 'text',
    quote: "Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide.",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    id: 2,
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    id: 3,
    type: 'text',
    quote: "Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide.",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    id: 4,
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    id: 5,
    type: 'text',
    quote: "Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide.",
    name: "John Deo",
    role: "International Retail Buyer",
  },
];

const Testimonials = () => {
  return (
    <section className="sm:py-20 px-6 md:px-16 bg-[#FCF8F1] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
          <div className="flex-1">
            <div className='sm:flex justify-between '>
            <h4 className="text-[32px] playfair text-[#1A1A1A] font-bold mb-4">Testimonials</h4>
            <div className="flex items-center gap-4 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-[#1A1A1A]">4.8 Reviews</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="#FDB022" stroke="none" />
                ))}
              </div>
            </div>
            
            <div className="h-12 w-[1.5px] bg-gray-300 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                alt="Google" 
                className="h-7 w-auto" 
              />
              <div className="flex items-center gap-1 font-bold text-[#A52A2A] text-2xl">
                <img 
                src="/images/1200px-IndiaMART_logo.svg-1.svg" 
               
                className="h-7 w-auto" 
              />
              </div>
            </div>
          </div>
            </div>
            <h2 className="text-3xl md:text-[28px] font-bold text-[#1A1A1A]  mona">
              Global Partners & Happy Clients
            </h2>
          </div>

         
        </div>

        {/* Slider Container */}
        <Swiper
          spaceBetween={24}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
            1440: { slidesPerView: 4.2 },
          }}
          className="testimonial-swiper !overflow-visible"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="h-[380px] w-full relative rounded-[32px] overflow-hidden">
                {item.type === 'text' ? (
                  /* Text Card Style */
                  <div className="bg-[#FFF3E5] h-full p-10 flex flex-col justify-between">
                    <div>
                      <img
                       src='/images/“.svg' 
                        className="mb-6 w-10 h-10" 
                     
                      />
                      <p className="text-[#333333] text-md mona font-medium">
                        “{item.quote}”
                      </p>
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1A1A1A] text-xl mb-1">{item.name}</h5>
                      <p className="text-[#666666] text-base font-medium">{item.role}</p>
                    </div>
                  </div>
                ) : (
                  /* Video Card Style */
                  <div className="relative h-full w-full group cursor-pointer">
                    <img 
                      src={item.thumbnail} 
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Glass Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-all duration-300 group-hover:scale-110">
                        <Play fill="white" stroke="white" size={24} className="ml-1" />
                      </div>
                    </div>
                    {/* Overlay text for video */}
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                      <h5 className="font-bold text-white text-xl mb-1">{item.name}</h5>
                      <p className="text-gray-200 text-base">{item.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;