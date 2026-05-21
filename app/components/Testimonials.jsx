"use client";
import React from 'react';
import { Star } from 'lucide-react';

const clients = [
  { image: '/client/1.JPG',   name: 'Client 1'  },
  { image: '/client/2.JPG',   name: 'Client 2'  },
  { image: '/client/3.jpeg',  name: 'Client 3'  },
  { image: '/client/4.jpeg',  name: 'Client 4'  },
  { image: '/client/5.jpeg',  name: 'Client 5'  },
  { image: '/client/6.jpeg',  name: 'Client 6'  },
  { image: '/client/7.jpeg',  name: 'Client 7'  },
  { image: '/client/8.jpeg',  name: 'Client 8'  },
  { image: '/client/9.jpeg',  name: 'Client 9'  },
  { image: '/client/10.jpeg', name: 'Client 10' },
  { image: '/client/11.jpeg', name: 'Client 11' },
  { image: '/client/12.jpeg', name: 'Client 12' },
  { image: '/client/13.jpeg', name: 'Client 13' },
];

// Duplicate for seamless infinite loop
const marqueeItems = [...clients, ...clients];

const ImageCard = ({ image, name }) => (
  <div className="relative h-full w-full rounded-[24px] overflow-hidden group shadow-sm">
    <img
      src={image}
      alt={name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    {/* Subtle warm overlay on hover */}
    <div className="absolute inset-0 bg-[#C08237]/0 group-hover:bg-[#C08237]/10 transition-colors duration-500 rounded-[24px]" />
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-12 sm:py-20 bg-[#FCF8F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="mb-12">
          <div className="sm:flex justify-between items-end">
            <h4 className="text-[32px] playfair text-[#1A1A1A] font-bold mb-4 sm:mb-0">
              Testimonials
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-[#1A1A1A]">4.8 Reviews</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#FDB022" stroke="none" />
                  ))}
                </div>
              </div>
              <div className="h-10 w-px bg-gray-300 hidden md:block" />
              <div className="flex items-center gap-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                  alt="Google"
                  className="h-6 w-auto"
                />
                <img
                  src="/images/1200px-IndiaMART_logo.svg-1.svg"
                  alt="IndiaMART"
                  className="h-6 w-auto"
                />
              </div>
            </div>
          </div>
          <h2 className="text-2xl md:text-[28px] font-bold text-[#1A1A1A] mona mt-3">
            Global Partners &amp; Happy Clients
          </h2>
        </div>
      </div>

      {/* Marquee — full bleed, fade edges */}
      <div
        className="relative w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="flex gap-4 marquee-track" style={{ width: 'max-content' }}>
          {marqueeItems.map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              className="h-[320px] w-[260px] shrink-0"
            >
              <ImageCard image={client.image} name={client.name} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 55s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
