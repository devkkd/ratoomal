import Image from 'next/image';

export const metadata = {
  title: 'Decorative Art Experts in India | About Ratoomals Decorative Art Collection',
  description: 'Learn about Ratoomals, a trusted name in decorative art known for premium handcrafted pieces, artistic décor, and timeless designs that enhance homes and interiors.',
  keywords: 'Ratoomal, wooden handicrafts, Jaipur exporter, handmade decor, wooden elephant showpiece, Indian craftsmanship, home decor exporter',
  alternates: {
    canonical: 'https://www.ratoomals.com/about',
  },
  openGraph: {
    title: 'About Ratoomal\'s - Premium Wooden Handicraft Exporter',
    description: 'Discover our journey of excellence in handcrafted wooden décor since 1955. Trusted global sourcing partner for authentic Indian craftsmanship.',
    type: 'website',
    url: 'https://www.ratoomals.com/about',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/about/Maskgroup.svg',
        width: 1200,
        height: 630,
        alt: 'Ratoomals - Heritage Handicraft Manufacturer since 1955',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    // Use the "mona" class here for the whole container
    <main className="mona bg-ratoomalBg min-h-screen py-16 px-6 md:px-12 lg:px-24 text-ratoomalDark">
      
      {/* --- Section 1: Header --- */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        {/* Use the "playfair" class here */}
        <h1 className="playfair font-bold text-3xl md:text-4xl mb-8">About Ratoomal’s</h1>
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p>
            <span className="font-bold">Founded in 1955 in Jaipur, India, Ratoomal’s</span>is a renowned family-owned wooden handicraft exporter in Jaipur with nearly seven decades of excellence.
          </p>
          <p>
            Our specialty lies in high-quality handmade décor, gifts and utility items with a combination of authentic Indian craftwork, and international standards of quality for the international market.

          </p>
        </div>
      </section>

      {/* --- Section 2: Main Image --- */}
      <section className="max-w-6xl mx-auto mb-20 relative">
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <Image 
            src="/images/about/Maskgroup.svg" 
            alt="wooden elephant showpiece"
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>
       
      </section>

      {/* --- Section 3: The Journey --- */}
      <section className="max-w-3xl mx-auto text-center space-y-6 mb-8">
        <div className="space-y-1 ">
          <h2 className="playfair text-lg font-bold">Our journey reflects long-term values,</h2>
          <p className="playfair text-lg font-bold">
           generations of work, and reliable relationships. Being specialists in wooden home design,
          </p>
        </div>
        <p className="playfair text-lg font-bold">
          we believe in authenticity, quality, and integrity and adapt to the global market requirements.
        </p>
      </section>

      {/* --- Section 4: Our Craft & Capabilities --- */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center  pt-6">
        <div className="space-y-4">
          <h2 className="mona text-2xl font-bold">Timeless Decorative Art Supported by Artistry and Design in  Large-scale production</h2>
          <p className="text-sm text-[#0E0E0E]">
          Our experience in the field of home interior has been based on good relations with artisans in Rajasthan. This approach allows us to preserve traditional craftsmanship while continuously refining designs and finishes to meet modern global standards.
          </p>
          
          <div className="space-y-3">
            <h3 className="font-bold text-md mona">Having our own manufacturing and finishing plants, we guarantee:</h3>
            <ul className="font-bold text-sm md:text-xs">
              <li>→ Consistent quality control</li>
              <li className="font-bold">→ International production on a large scale.</li>
              <li>→ Personalisation of materials and finishes.</li>
            </ul>
          </div>
          
          <p className="mona text-xs text-[#0E0E0E]">
           The combination of this methodology provides stability and does not lose the handcrafted quality.
          </p>
        </div>

        <div className="rounded-lg overflow-hidden h-[300px] relative">
          <Image 
            src="/images/about/Craft.svg" 
            alt="handicraft manufacturer in india"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* --- Section 5: Global Presence & Partnerships --- */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center py-20">
        <div className="rounded-lg overflow-hidden h-[300px] relative">
          <Image 
            src="/images/about/image-176.svg" // Replace with your image path
            alt="decor and design"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4 text-center md:text-right ">
          <h2 className="mona text-2xl font-bold">Premium Wooden Elephant Showpiece Exporter with Global Partnerships</h2>
          <div className="space-y-5 text-sm md:text-base leading-relaxed text-[#4A4A4A]">
            <p className='text-sm text-[#0E0E0E]'>
            Ratoomal sells collections of handcrafted décor and wooden elephant showpieces to wholesalers, importers, buying houses, and retail brands throughout the world.
            </p>
            <p className='text-sm text-[#0E0E0E]'>
              We have a good B2B orientation which is based on trust, repeat business and long-term associations. We are not just a supplier but a trusted sourcing company; we know schedules, compliance, export, and international trade regulations.
            </p>
          </div>
        </div>
      </section>

      {/* --- Section 6: Our Values --- */}
    <section id="values" className="max-w-7xl mx-auto py-16">
  <div className="text-center mb-12">
    <h2 className="mona text-2xl font-bold mb-6">Excellence in Décor and Design Guided by Strong Values</h2>
    <p className="text-sm mona font-bold">At Ratoomal, we have a firm idea of what we want to do with our décor and design, and it is guided by the following principles that define each and every partnership and product:</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { id: "01", title: "Craft Authenticity", desc: "We respect the old skills, but we are also considerate of adjusting them to suit the new global markets." },
      { id: "02", title: "Consistent Quality", desc: "We have consistent quality standards in production cycles and in regions." },
      { id: "03", title: "Transparent Business Practices", desc: "We are ethical in production, we communicate effectively, and we are fully accountable." },
      { id: "04", title: "Long-Term Partnerships", desc: "We develop long-term relationships with customers, craftsmen and international partners." }
    ].map((item, index) => (
      <div 
        key={item.id} 
        className={`p-6 rounded-xl border border-stone-100 ${
          index === 1 || index === 3 ? "bg-[#FFF6EB]" : "bg-[#FCF9F4]"
        }`}
      >
        <span className="mona text-2xl font-bold block mb-4">{item.id}</span>
        <h3 className="font-bold text-lg mb-5 mona">{item.title}</h3>
        <p className=" mona text-xs text-[#0E0E0E]">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

      {/* --- Section 7: Vision & Philosophy --- */}
      <section id="vision" className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-[#FCF9F4] p-4  rounded-2xl border border-stone-300">
          <h2 className="mona text-2xl font-bold mb-6">Our Vision</h2>
          <p className="font-bold text-xs mb-4">To be a sourcing partner that is trusted globally in terms of handcrafted décor and gifting products of India.</p>
          <p className="text-xs text-gray-600"> Our vision is anchored on consistency, credibility and the idea that heritage craftsmanship can be scaled responsibly to serve international markets.</p>
        </div>
        
        <div className="bg-[#FCF9F4] p-4 rounded-2xl border border-stone-300">
          <h2 className="mona text-2xl font-bold mb-6">Our Philosophy</h2>
          <p className="font-bold text-xs mb-4">We think that the real luxury is not pronounced but rather determined by the authenticity, accuracy, and trust, which are gained over the course of time.</p>
          <p className="text-xs text-gray-600"> The Ratoomal is a symbol of uncompromised craftsmanship, responsible growth and heritage-based excellence.</p>
        </div>
      </section>


      {/* --- Section 8: Our History (Timeline) --- */}
      <section id="history" className="max-w-7xl mx-auto py-20 px-4">
  <h2 className="mona text-2xl font-bold text-center mb-12">Eight Years of Mastery in Home Interior Design</h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { year: "1955", title: "The Foundation", desc: "The foundation of Ratoomal was made on a definite principle, which was quality and honest craftsmanship. Our home interior designs are still guided by these founding values." },
      { year: "1965", title: "Craft Takes Form", desc: "We increased our artisan base, perfected the old methods and brought in the organised production without losing the authenticity of the handmade." },
      { year: "1975", title: "Design Meets Discipline", desc: "An increased emphasis on designing consistency and quality control brought us to international standards in the future.", highlight:true },
      { year: "1985", title: "Expanding Product Diversity", desc: "We added new materials and collections to our range, without undermining handcrafted integrity." },
      { year: "1995", title: "Preparing for Global Markets", desc: "Ratoomal has aligned its craftsmanship to the expectations of the buyers around the world and moved towards international trade preparedness." },
      { year: "2005", title: "Global Presence", desc: "We started serving customers in the USA, Canada, Japan, the Middle East, Asia, Europe, and the Americas, having fifty years of experience." },
      { year: "2015", title: "Modern Indian Handicrafts", desc: "The fusion of the traditional art with the modern techniques was done in a way that resulted in products that would be used in the global interiors." },
      { year: "2025", title: "House of Quality Since 1955", desc: "Ratoomal today provides 10,000+ SKUs, export-ready systems and a track record of trust, quality and long-term artisan relationships." }
    ].map((item, idx) => (
      <div 
        key={idx} 
        className={`p-6 rounded-xl border border-stone-200 h-full flex flex-col transition-all duration-300 ease-in-out ${
          item.highlight 
            ? ' bg-white text-ratoomalDark hover:bg-[#BC8141] hover:text-white hover:shadow-lg hover:border-[#BC8141]' 
            : 'bg-white text-ratoomalDark hover:bg-[#BC8141] hover:text-white hover:shadow-lg hover:border-[#BC8141]'
        }`}
      >
        <span className="text-2xl font-bold mb-4 mona">{item.year}</span>
        <h3 className="font-bold text-sm mb-4 mona">{item.title}</h3>
        <p className="text-[11px] mona opacity-90">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

      {/* --- Section 9: CEO Message --- */}
      <section id="ceo-message" className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* CEO Image Container */}
          <div className="w-full md:w-1/3">
            <div className="rounded-2xl overflow-hidden shadow-lg grayscale-0 transition-all duration-500">
              <Image 
                src="/images/about/Rectangle.svg" // Image path yahan badal dein
                alt="CEO Ratoomal's"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Message Content */}
          <div className="w-full md:w-2/3 space-y-6">
            <h2 className="playfair text-2xl font-bold">CEO Message</h2>
            <div className="relative">
              <span className="text-2xl absolute -top-3"><img src='/images/about/“.svg' className='w-5'/></span>
              <div className="space-y-3 text-sm text-[#0E0E0E] pt-4">
                <p>
                  "In our trade, I hold the belief that the buyer's contentment is of utmost importance. 
                  It is our responsibility to deliver precisely the product that was presented to them."
                </p>
                <p>
                  "Even though everything we create is handmade, I dedicate myself to ensuring that 
                  our buyers receive the satisfaction they are entitled to as patrons of Ratoomal's."
                </p>
                <p>
                  "This principle, passed down from my grandfather to my father and now to me, 
                  continues to guide our business."
                </p>
                <div className="pt-4">
                  <p className="font-bold">- CEO, Ratoomal's</p>
                </div>
              </div>
              <span className="text-2xl absolute -bottom-6"><img src='/images/about/bottom-“.svg' className='w-5'/></span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer Text --- */}
      <section className="max-w-4xl mx-auto text-center py-4">
        <p className="playfair text-xl  font-bold ">
         At Ratoomal, art is not a product but a heritage of generations of art and hard work,
        </p>
        <p className="playfair text-xl  font-bold  mt-2">
          And  we are so devoted to that legacy to maintain and defend it with integrity.
        </p>
      </section>
    </main>
  );
}