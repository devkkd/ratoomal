"use client";
import Image from 'next/image';

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
            <span className="font-bold">Founded in 1955 in Jaipur, India, Ratoomal's</span> is a family-owned handicrafts manufacturing and export house with a legacy spanning nearly seven decades.
          </p>
          <p>
            What began as a small, tradition-led enterprise has evolved into a trusted global partner for handcrafted decor, gifting, and utility products – rooted in <span className="font-bold">Indian craftsmanship and refined for international markets.</span>
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
      <section className="max-w-3xl mx-auto text-center space-y-12 mb-8">
        <div className="space-y-1 ">
          <h2 className="playfair text-lg font-bold">Our Journey Is Defined By Continuity:</h2>
          <p className="playfair text-lg font-bold">
            of values, of skills passed down through generations, and of long-standing relationships with clients and artisans alike.
          </p>
        </div>
        <p className="playfair text-lg font-bold">
          While markets have evolved, our commitment to authenticity, quality, and integrity remains unchanged.
        </p>
      </section>

      {/* --- Section 4: Our Craft & Capabilities --- */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center  pt-6">
        <div className="space-y-4">
          <h2 className="mona text-2xl font-bold">Our Craft & Capabilities</h2>
          <p className="text-sm text-[#0E0E0E]">
           At the heart of <b> Ratoomal’s </b> lies a deep collaboration with skilled artisans across Rajasthan. These partnerships, nurtured over decades, allow us to preserve traditional techniques while adapting designs, finishes, and specifications to meet contemporary global requirements.
          </p>
          
          <div className="space-y-3">
            <h3 className="font-bold text-md mona">We operate our own manufacturing and finishing facilities, enabling:</h3>
            <ul className="font-bold text-sm md:text-xs">
              <li>→ Consistent quality control</li>
              <li className="font-bold">→ Scalable production for international demand</li>
              <li>→ Customization across materials, finishes, and product categories</li>
            </ul>
          </div>
          
          <p className="mona text-xs text-[#0E0E0E]">
            This integrated approach ensures reliability without compromising the soul of handcrafted work.
          </p>
        </div>

        <div className="rounded-lg overflow-hidden h-[300px] relative">
          <Image 
            src="/images/about/Craft.svg" 
            alt="interior decoration interior decoration
"
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
            alt="Handcrafted elephant stapler"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4 text-center md:text-right ">
          <h2 className="mona text-2xl font-bold">Global Presence & Partnerships</h2>
          <div className="space-y-5 text-sm md:text-base leading-relaxed text-[#4A4A4A]">
            <p className='text-sm text-[#0E0E0E]'>
              Ratoomal's supplies handcrafted décor, gifting, and utility products to <strong>wholesalers, importers, buying houses, and retail brands</strong> across multiple international markets.
            </p>
            <p className='text-sm text-[#0E0E0E]'>
              Our focus is firmly B2B—built on trust, repeat business, and long-term alignment rather than transactional volume.
            </p>
            <p className='text-sm text-[#0E0E0E]'>
              We position ourselves not as a vendor, but as a <strong>sourcing partner</strong> — one that understands timelines, compliance, export standards, and the nuances of global trade.
            </p>
          </div>
        </div>
      </section>

      {/* --- Section 6: Our Values --- */}
    <section id="values" className="max-w-7xl mx-auto py-16">
  <div className="text-center mb-12">
    <h2 className="mona text-2xl font-bold mb-6">Our Values</h2>
    <p className="text-sm mona font-bold">Every partnership and product at Ratoomal’s is guided by a clear set of principles:</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { id: "01", title: "Craft Authenticity", desc: "Respecting traditional skills while adapting them thoughtfully for modern markets." },
      { id: "02", title: "Consistent Quality", desc: "Delivering dependable standards across production cycles and geographies." },
      { id: "03", title: "Transparent Business Practices", desc: "Clear communication, ethical production, and accountability at every stage." },
      { id: "04", title: "Long-Term Partnerships", desc: "Building enduring relationships with clients, artisans, and collaborators." }
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
          <p className="font-bold text-xs mb-4">To be a trusted global sourcing partner for handcrafted décor and gifting products from India.</p>
          <p className="text-xs text-gray-600">A vision grounded in consistency, credibility, and the belief that heritage craftsmanship can scale responsibly for the world.</p>
        </div>
        
        <div className="bg-[#FCF9F4] p-4 rounded-2xl border border-stone-300">
          <h2 className="mona text-2xl font-bold mb-6">Our Philosophy</h2>
          <p className="font-bold text-xs mb-4">We believe true luxury is quiet - defined by provenance, precision, and trust earned over time.</p>
          <p className="text-xs text-gray-600"><strong>Ratoomal’s</strong> stands for craftsmanship without compromise, scale without dilution, and growth rooted in heritage.</p>
        </div>
      </section>


      {/* --- Section 8: Our History (Timeline) --- */}
      <section id="history" className="max-w-7xl mx-auto py-20 px-4">
  <h2 className="mona text-2xl font-bold text-center mb-12">Our History - A Legacy by Decades</h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { year: "1955", title: "The Foundation", desc: "Ratoomal's was established with a singular philosophy: uncompromising quality and honest craftsmanship. The foundation laid during this decade still defines the company's values today." },
      { year: "1965", title: "Craft Takes Form", desc: "The business expanded its artisan base, refining techniques and beginning structured production while remaining deeply rooted in handmade processes." },
      { year: "1975", title: "Design Meets Discipline", desc: "With growing experience, Ratoomal's strengthened its focus on product design consistency and quality control, setting internal standards that would later support international trade.", highlight: true },
      { year: "1985", title: "Expanding Product Diversity", desc: "New materials and categories were introduced, broadening the portfolio while preserving the integrity of handcrafted methods." },
      { year: "1995", title: "Preparing for Global Markets", desc: "Ratoomal's evolved from local heritage brand into a business ready for international exposure, aligning craftsmanship with global buyer expectations." },
      { year: "2005", title: "Global Presence", desc: "With over five decades of experience, Ratoomal's began actively serving buyers across USA, Canada, Japan, Middle East, Asia Europe, and the Americas, forming long-term trade relationships based on trust and quality." },
      { year: "2015", title: "Modern Indian Handicrafts", desc: "Traditional inspiration was consciously fused with contemporary artistic skills and techniques, creating modern handicrafts that resonated with international interiors while preserving cultural depth." },
      { year: "2025", title: "House of Quality Since 1955", desc: "Today, Ratoomal's stands as a House of Quality, offering 10,000+ SKUs, export-ready processes, and a reputation built on six decades of buyer satisfaction and artisan respect." }
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
          At Ratoomal’s, craftsmanship is not merely a product it is a legacy.
        </p>
        <p className="playfair text-xl  font-bold  mt-2">
          And that legacy is protected.
        </p>
      </section>
    </main>
  );
}