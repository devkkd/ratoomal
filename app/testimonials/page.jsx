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

export default function TestimonialsPage() {
  return (
    <section className="w-full bg-[#FCF8F1] min-h-screen py-12 md:py-20 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl playfair font-bold text-[#1a1a1a] mb-6">
            Testimonials
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg mona">4.8 Reviews</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FDB022" stroke="none" />
                ))}
              </div>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300" />
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
          <h3 className="text-2xl md:text-3xl mona font-bold text-[#1a1a1a]">
            Global Partners &amp; Happy Clients
          </h3>
        </div>

        {/* Image grid — 2 cols on mobile, 3 on md, 4 on lg */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {clients.map((client, i) => (
            <div
              key={i}
              className="break-inside-avoid rounded-[20px] overflow-hidden group shadow-sm"
            >
              <img
                src={client.image}
                alt={client.name}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
