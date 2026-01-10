"use client";
import React from 'react';
import { Play, Star } from 'lucide-react';

const TestimonialCard = ({ type, content, author, role, image }) => {
  // Quote Card Style
  if (type === 'text') {
    return (
      <div className="bg-[#FFF6EB] p-8 rounded-2xl flex flex-col justify-between h-full min-h-[220px] shadow-sm">
        <div>
          <span className="text-[#bf8e44] text-3xl font-serif leading-none"><img src='/images/testimonials/“.svg' className='w-8'/></span>
          <p className="text-[#0E0E0E] text-[14px] mona my-10">
            {content}
          </p>
        </div>
        <div className="mt-6">
          <h4 className="font-bold text-[#1a1a1a] text-sm">{author}</h4>
          <p className="text-[#888] text-xs mt-1">{role}</p>
        </div>
      </div>
    );
  }

  // Video/Image Card Style
  return (
    <div className="relative group overflow-hidden rounded-2xl h-full min-h-[280px] cursor-pointer">
      <img 
        src={image} 
        alt={author} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center">
          <Play fill="white" className="text-white ml-1" size={20} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
        <h4 className="font-bold text-white text-sm">{author}</h4>
        <p className="text-white/80 text-xs mt-1">{role}</p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { type: 'text', content: "Ratoomal's elephant collection elevated our retail decor line-up and connected with customers worldwide.", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'text', content: "The quality and craftsmanship of the statues are unmatched. Perfect for our international showroom.", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'text', content: "Their focus on traditional symbolism with a global appeal makes them our go-to partner in India.", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'text', content: "Ratoomal's elephant collection elevated our retail decor line-up and connected with customers worldwide.", author: "John Doe", role: "International Retail Buyer" },
     { type: 'text', content: "Ratoomal's elephant collection elevated our retail decor line-up and connected with customers worldwide.", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'text', content: "The quality and craftsmanship of the statues are unmatched. Perfect for our international showroom.", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'text', content: "Their focus on traditional symbolism with a global appeal makes them our go-to partner in India.", author: "John Doe", role: "International Retail Buyer" },
    { type: 'video', image: "/api/placeholder/400/500", author: "John Doe", role: "International Retail Buyer" },
    { type: 'text', content: "Ratoomal's elephant collection elevated our retail decor line-up and connected with customers worldwide.", author: "John Doe", role: "International Retail Buyer" },
];

  return (
    <section className="w-full bg-white py-10 mt-4 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl playfair font-bold text-[#1a1a1a] mb-6">Testimonials</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg mona">4.8 Reviews</span>
              <div className="flex text-[#ffb400] gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#ffb400" />)}
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3 h-8">
              <img src="/images/testimonials/google-img.svg" alt="Google" className="h-8" />
              <img src="/images/testimonials/1200px-IndiaMART_logo.svg" alt="IndiaMart" className="h-6 " />
            </div>
          </div>
          
          <h3 className="text-3xl mona font-bold text-[#1a1a1a] mt-10">Global Partners & Happy Clients</h3>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, index) => (
            <TestimonialCard key={index} {...item} />
          ))}
        </div>



      </div>
    </section>
  );
};

export default TestimonialsSection;