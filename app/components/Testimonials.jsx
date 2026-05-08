"use client";
import React from 'react';
import { Star } from 'lucide-react';

// Alternating text → image → text → image order
const testimonials = [
  {
    id: 1,
    type: 'text',
    quote: "Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide. Exceptional craftsmanship every time.",
    name: "James Mitchell",
    role: "International Retail Buyer, UK",
  },
  {
    id: 2,
    type: 'image',
    image: '/client/1.JPG',
    name: "Priya Sharma",
    role: "Wholesale Distributor, Mumbai",
  },
  {
    id: 3,
    type: 'text',
    quote: "The quality and packaging exceeded our expectations. Our customers love the handcrafted wooden figurines — reordering every season.",
    name: "Sophie Laurent",
    role: "Boutique Owner, Paris",
  },
  {
    id: 4,
    type: 'image',
    image: '/client/2.JPG',
    name: "Ahmed Al-Rashid",
    role: "Gift Shop Owner, Dubai",
  },
  {
    id: 5,
    type: 'text',
    quote: "Bulk orders delivered on time with zero defects. Ratoomals is our go-to partner for festive season gifting collections.",
    name: "Marco Rossi",
    role: "Corporate Gifting Head, Italy",
  },
  {
    id: 6,
    type: 'image',
    image: '/client/3.jpeg',
    name: "Rajesh Gupta",
    role: "Export Manager, Delhi",
  },
  {
    id: 7,
    type: 'text',
    quote: "From custom designs to timely delivery — Ratoomals handles everything professionally. A trusted partner for 5+ years.",
    name: "Yuki Tanaka",
    role: "Lifestyle Brand, Tokyo",
  },
  {
    id: 8,
    type: 'image',
    image: '/client/4.jpeg',
    name: "Linda Chen",
    role: "Home Décor Retailer, Singapore",
  },
  {
    id: 9,
    type: 'text',
    quote: "Incredible attention to detail. Every piece tells a story — our gallery customers always ask where we source these beautiful figurines.",
    name: "Hannah Müller",
    role: "Craft Gallery, Berlin",
  },
  {
    id: 10,
    type: 'image',
    image: '/client/5.jpeg',
    name: "Fatima Al-Zahra",
    role: "Interior Designer, Abu Dhabi",
  },
  {
    id: 11,
    type: 'text',
    quote: "We've been importing from Ratoomals for 3 years. Consistent quality, great communication, and always on schedule.",
    name: "Carlos Mendez",
    role: "Souvenir Shop, Mexico City",
  },
  {
    id: 12,
    type: 'image',
    image: '/client/6.jpeg',
    name: "David Thompson",
    role: "Museum Gift Shop, USA",
  },
  {
    id: 13,
    type: 'text',
    quote: "The wooden God figurines are our bestsellers. Customers love the authentic Rajasthani craftsmanship and the spiritual energy they carry.",
    name: "Anita Patel",
    role: "Handicraft Exporter, Ahmedabad",
  },
  {
    id: 14,
    type: 'image',
    image: '/client/7.jpeg',
    name: "Nadia Kowalski",
    role: "Décor Importer, Warsaw",
  },
  {
    id: 15,
    type: 'image',
    image: '/client/8.jpeg',
    name: "Samuel Okafor",
    role: "Retail Chain, Lagos",
  },
  {
    id: 16,
    type: 'image',
    image: '/client/9.jpeg',
    name: "Emma Wilson",
    role: "Spiritual Goods Store, Sydney",
  },
  {
    id: 17,
    type: 'image',
    image: '/client/10.jpeg',
    name: "Ravi Krishnan",
    role: "Temple Supplies, Chennai",
  },
  {
    id: 18,
    type: 'image',
    image: '/client/11.jpeg',
    name: "Kenji Watanabe",
    role: "Asian Arts Dealer, Osaka",
  },
  {
    id: 19,
    type: 'image',
    image: '/client/12.jpeg',
    name: "Maria Santos",
    role: "Home Décor Brand, Lisbon",
  },
  {
    id: 20,
    type: 'image',
    image: '/client/13.jpeg',
    name: "Tariq Hassan",
    role: "Luxury Gifts, Riyadh",
  },
];

const TextCard = ({ item }) => (
  <div className="bg-[#FFF3E5] h-full p-7 flex flex-col justify-between rounded-[28px]">
    <div>
      <div className="text-[#C08237] text-5xl font-serif leading-none mb-3 select-none">"</div>
      <p className="text-[#333] text-sm mona font-medium leading-relaxed line-clamp-5">
        {item.quote}
      </p>
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="w-9 h-9 rounded-full bg-[#C08237]/20 flex items-center justify-center text-[#C08237] font-bold text-base shrink-0">
        {item.name.charAt(0)}
      </div>
      <div>
        <h5 className="font-bold text-[#1A1A1A] text-sm leading-tight">{item.name}</h5>
        <p className="text-[#999] text-xs mt-0.5">{item.role}</p>
      </div>
    </div>
  </div>
);

const ImageCard = ({ item }) => (
  <div className="relative h-full w-full rounded-[28px] overflow-hidden group">
    <img
      src={item.image}
      alt={item.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 via-black/20 to-transparent">
      <h5 className="font-bold text-white text-sm leading-tight">{item.name}</h5>
      <p className="text-gray-300 text-xs mt-0.5">{item.role}</p>
    </div>
  </div>
);

const Testimonials = () => {
  // Duplicate for seamless infinite loop
  const items = [...testimonials, ...testimonials];

  return (
    <section className="py-12 sm:py-20 bg-[#FCF8F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="mb-12">
          <div className="sm:flex justify-between items-end">
            <h4 className="text-[32px] playfair text-[#1A1A1A] font-bold mb-4 sm:mb-0">Testimonials</h4>
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
            Global Partners & Happy Clients
          </h2>
        </div>
      </div>

      {/* Marquee Track — full bleed, no side padding */}
      <div
        className="relative w-full"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
      >
        <div className="flex gap-5 marquee-track" style={{ width: 'max-content' }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="h-[340px] shrink-0"
              style={{ width: item.type === 'text' ? '300px' : '260px' }}
            >
              {item.type === 'text'
                ? <TextCard item={item} />
                : <ImageCard item={item} />
              }
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 60s linear infinite;
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
