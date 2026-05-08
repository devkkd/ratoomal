"use client";
import React from 'react';
import { Star } from 'lucide-react';

// Exactly 13 clients — each has image + testimonial paired together
const clients = [
  {
    image: '/client/1.JPG',
    name: "Priya Sharma",
    role: "Wholesale Distributor, Mumbai",
    quote: "Ratoomals' elephant collection elevated our retail décor lineup. Exceptional craftsmanship every single time.",
  },
  {
    image: '/client/2.JPG',
    name: "Ahmed Al-Rashid",
    role: "Gift Shop Owner, Dubai",
    quote: "The quality and packaging exceeded our expectations. Our customers love the handcrafted wooden figurines.",
  },
  {
    image: '/client/3.jpeg',
    name: "Rajesh Gupta",
    role: "Export Manager, Delhi",
    quote: "Bulk orders delivered on time with zero defects. Ratoomals is our go-to partner for festive gifting.",
  },
  {
    image: '/client/4.jpeg',
    name: "Linda Chen",
    role: "Home Décor Retailer, Singapore",
    quote: "From custom designs to timely delivery — Ratoomals handles everything professionally. 5+ years of trust.",
  },
  {
    image: '/client/5.jpeg',
    name: "Fatima Al-Zahra",
    role: "Interior Designer, Abu Dhabi",
    quote: "Incredible attention to detail. Every piece tells a story — our clients always ask where we source these.",
  },
  {
    image: '/client/6.jpeg',
    name: "David Thompson",
    role: "Museum Gift Shop, USA",
    quote: "We've been importing from Ratoomals for 3 years. Consistent quality and always on schedule.",
  },
  {
    image: '/client/7.jpeg',
    name: "Anita Patel",
    role: "Handicraft Exporter, Ahmedabad",
    quote: "The wooden God figurines are our bestsellers. Customers love the authentic Rajasthani craftsmanship.",
  },
  {
    image: '/client/8.jpeg',
    name: "Samuel Okafor",
    role: "Retail Chain, Lagos",
    quote: "Outstanding product range and reliable shipping. Ratoomals has been a game-changer for our business.",
  },
  {
    image: '/client/9.jpeg',
    name: "Emma Wilson",
    role: "Spiritual Goods Store, Sydney",
    quote: "The spiritual figurines bring such positive energy. Our customers keep coming back for more.",
  },
  {
    image: '/client/10.jpeg',
    name: "Ravi Krishnan",
    role: "Temple Supplies, Chennai",
    quote: "Perfect craftsmanship for temple décor. The attention to religious detail is truly commendable.",
  },
  {
    image: '/client/11.jpeg',
    name: "Kenji Watanabe",
    role: "Asian Arts Dealer, Osaka",
    quote: "Ratoomals understands the art of traditional Indian crafts. Their pieces are museum-worthy.",
  },
  {
    image: '/client/12.jpeg',
    name: "Maria Santos",
    role: "Home Décor Brand, Lisbon",
    quote: "Beautiful products, great communication, and fast delivery. Highly recommend for bulk orders.",
  },
  {
    image: '/client/13.jpeg',
    name: "Tariq Hassan",
    role: "Luxury Gifts, Riyadh",
    quote: "Premium quality that matches our luxury brand standards. Our clients are always impressed.",
  },
];

// Build alternating pairs: image → text → image → text ...
const buildItems = () => {
  const items = [];
  clients.forEach((client, i) => {
    items.push({ type: 'image', ...client, id: `img-${i}` });
    items.push({ type: 'text',  ...client, id: `txt-${i}` });
  });
  return items;
};

const allItems = buildItems(); // 26 items (13 pairs)
const marqueeItems = [...allItems, ...allItems]; // duplicate for seamless loop

const ImageCard = ({ image, name, role }) => (
  <div className="relative h-full w-full rounded-[28px] overflow-hidden group">
    <img
      src={image}
      alt={name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 via-black/20 to-transparent">
      <h5 className="font-bold text-white text-sm leading-tight">{name}</h5>
      <p className="text-gray-300 text-xs mt-0.5">{role}</p>
    </div>
  </div>
);

const TextCard = ({ image, name, role, quote }) => (
  <div className="bg-[#FFF3E5] h-full p-7 flex flex-col justify-between rounded-[28px]">
    <div>
      <div className="text-[#C08237] text-5xl font-serif leading-none mb-3 select-none">"</div>
      <p className="text-[#333] text-sm mona font-medium leading-relaxed line-clamp-5">
        {quote}
      </p>
    </div>
    <div className="flex items-center gap-3 mt-4">
      {/* Small avatar from client image */}
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-[#C08237]/30">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h5 className="font-bold text-[#1A1A1A] text-sm leading-tight">{name}</h5>
        <p className="text-[#999] text-xs mt-0.5">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
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

      {/* Marquee — full bleed */}
      <div
        className="relative w-full"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}
      >
        <div className="flex gap-5 marquee-track" style={{ width: 'max-content' }}>
          {marqueeItems.map((item) => (
            <div
              key={item.id + Math.random()}
              className="h-[340px] shrink-0"
              style={{ width: item.type === 'text' ? '300px' : '260px' }}
            >
              {item.type === 'image'
                ? <ImageCard image={item.image} name={item.name} role={item.role} />
                : <TextCard image={item.image} name={item.name} role={item.role} quote={item.quote} />
              }
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 70s linear infinite;
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
