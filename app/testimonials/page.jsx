"use client";
import React from 'react';
import { Star } from 'lucide-react';

const clients = [
  { image: '/client/1.JPG',   name: "Priya Sharma",     role: "Wholesale Distributor, Mumbai",    quote: "Ratoomals' elephant collection elevated our retail décor lineup. Exceptional craftsmanship every single time." },
  { image: '/client/2.JPG',   name: "Ahmed Al-Rashid",  role: "Gift Shop Owner, Dubai",           quote: "The quality and packaging exceeded our expectations. Our customers love the handcrafted wooden figurines." },
  { image: '/client/3.jpeg',  name: "Rajesh Gupta",     role: "Export Manager, Delhi",            quote: "Bulk orders delivered on time with zero defects. Ratoomals is our go-to partner for festive gifting." },
  { image: '/client/4.jpeg',  name: "Linda Chen",       role: "Home Décor Retailer, Singapore",   quote: "From custom designs to timely delivery — Ratoomals handles everything professionally. 5+ years of trust." },
  { image: '/client/5.jpeg',  name: "Fatima Al-Zahra",  role: "Interior Designer, Abu Dhabi",     quote: "Incredible attention to detail. Every piece tells a story — our clients always ask where we source these." },
  { image: '/client/6.jpeg',  name: "David Thompson",   role: "Museum Gift Shop, USA",            quote: "We've been importing from Ratoomals for 3 years. Consistent quality and always on schedule." },
  { image: '/client/7.jpeg',  name: "Anita Patel",      role: "Handicraft Exporter, Ahmedabad",   quote: "The wooden God figurines are our bestsellers. Customers love the authentic Rajasthani craftsmanship." },
  { image: '/client/8.jpeg',  name: "Samuel Okafor",    role: "Retail Chain, Lagos",              quote: "Outstanding product range and reliable shipping. Ratoomals has been a game-changer for our business." },
  { image: '/client/9.jpeg',  name: "Emma Wilson",      role: "Spiritual Goods Store, Sydney",    quote: "The spiritual figurines bring such positive energy. Our customers keep coming back for more." },
  { image: '/client/10.jpeg', name: "Ravi Krishnan",    role: "Temple Supplies, Chennai",         quote: "Perfect craftsmanship for temple décor. The attention to religious detail is truly commendable." },
  { image: '/client/11.jpeg', name: "Kenji Watanabe",   role: "Asian Arts Dealer, Osaka",         quote: "Ratoomals understands the art of traditional Indian crafts. Their pieces are museum-worthy." },
  { image: '/client/12.jpeg', name: "Maria Santos",     role: "Home Décor Brand, Lisbon",         quote: "Beautiful products, great communication, and fast delivery. Highly recommend for bulk orders." },
  { image: '/client/13.jpeg', name: "Tariq Hassan",     role: "Luxury Gifts, Riyadh",             quote: "Premium quality that matches our luxury brand standards. Our clients are always impressed." },
];

const ImageCard = ({ image, name, role }) => (
  <div className="relative h-[300px] w-full rounded-[20px] overflow-hidden group">
    <img
      src={image}
      alt={name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/75 via-black/20 to-transparent">
      <h5 className="font-bold text-white text-sm leading-tight">{name}</h5>
      <p className="text-gray-300 text-xs mt-0.5">{role}</p>
    </div>
  </div>
);

const TextCard = ({ image, name, role, quote }) => (
  <div className="bg-[#FFF3E5] h-[300px] p-6 flex flex-col justify-between rounded-[20px]">
    <div>
      <div className="text-[#C08237] text-5xl font-serif leading-none mb-2 select-none">"</div>
      <p className="text-[#333] text-sm mona font-medium leading-relaxed line-clamp-5">
        {quote}
      </p>
    </div>
    <div className="flex items-center gap-3">
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

// Build flat list with alternating row pattern:
// Odd rows  (0,2,4...): Image, Text, Image, Text
// Even rows (1,3,5...): Text, Image, Text, Image
const buildGrid = () => {
  const items = [];
  const cols = 4;

  clients.forEach((client, i) => {
    const row = Math.floor((i * 2) / cols);       // which row this pair falls in
    const posInRow = (i * 2) % cols;              // position within row (0-3)
    const isOddRow = row % 2 === 1;

    // For odd rows, swap: even positions → text, odd positions → image
    const firstIsText = isOddRow;

    items.push({
      type: firstIsText ? 'text' : 'image',
      client,
      key: `a-${i}`,
    });
    items.push({
      type: firstIsText ? 'image' : 'text',
      client,
      key: `b-${i}`,
    });
  });

  return items;
};

const gridItems = buildGrid();

export default function TestimonialsPage() {
  return (
    <section className="w-full bg-[#FCF8F1] min-h-screen py-12 md:py-20 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl playfair font-bold text-[#1a1a1a] mb-6">Testimonials</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg mona">4.8 Reviews</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FDB022" stroke="none" />)}
              </div>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 w-auto" />
              <img src="/images/1200px-IndiaMART_logo.svg-1.svg" alt="IndiaMART" className="h-6 w-auto" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl mona font-bold text-[#1a1a1a]">Global Partners & Happy Clients</h3>
        </div>

        {/* Grid with alternating row pattern */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {gridItems.map(({ type, client, key }) =>
            type === 'image'
              ? <ImageCard key={key} image={client.image} name={client.name} role={client.role} />
              : <TextCard  key={key} image={client.image} name={client.name} role={client.role} quote={client.quote} />
          )}
        </div>

      </div>
    </section>
  );
}
