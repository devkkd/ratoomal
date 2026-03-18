import Hero from "@/app/components/Hero";
import Craftsmanship from "@/app/components/Craftsmanship";
import TrustBuilding from "@/app/components/TrustBuilding";
import dynamic from "next/dynamic";

// SSR-safe dynamic imports (server component compatible)
const ElephantSizeFilter = dynamic(() => import("./components/ElephantSizeFilter"));
const CuratedCollections = dynamic(() => import("./components/CuratedCollections"));
const GodFigurines       = dynamic(() => import("./components/GodFigurines"));
const Utility            = dynamic(() => import("./components/Utility"));
const WhyRatoomals       = dynamic(() => import("./components/WhyRatoomals"));
const Testimonials       = dynamic(() => import("./components/Testimonials"));
const FAQSection         = dynamic(() => import("./components/FAQSection"));
const ContactForm        = dynamic(() => import("./components/ContactForm"));

export const metadata = {
  title: 'Ratoomal\'s | B2B Wooden Handicraft Manufacturer & Exporter from Jaipur, India',
  description: 'Leading B2B manufacturer and exporter of handcrafted wooden handicrafts from Jaipur, India. Specializing in god figurines, animal sculptures, utility decor, and custom bulk orders carved from wood for home interior.',
  keywords: 'handicraft export business in india, handicraft export from india to usa, jaipur handicrafts jaipur, B2B wooden handicrafts, wooden god statues, animal sculptures, utility decor, carved from wood, home interior, bulk orders, custom handicrafts, Jaipur exporter, wholesale wooden products',
  alternates: {
    canonical: 'https://www.ratoomals.com',
  },
  openGraph: {
    title: 'Ratoomal\'s - Premium Wooden Handicraft Manufacturer & Exporter',
    description: 'Handcrafted wooden products for bulk orders, custom designs, and wholesale partnerships. Premium quality carved from wood for home interior from Jaipur, India.',
    type: 'website',
    url: 'https://www.ratoomals.com',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: "Ratoomals - B2B Wooden Handicraft Manufacturer from Jaipur",
      },
    ],
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ratoomals",
  "description": "B2B handicraft manufacturer and exporter specializing in handcrafted wooden statues, sculptures, and decorative products for home interior",
  "url": "https://www.ratoomals.com",
  "logo": "https://www.ratoomals.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Jaipur",
    "addressRegion": "Rajasthan",
    "addressCountry": "India"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "areaServed": "Worldwide",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://www.ratoomals.com"
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <main className="flex flex-col bg-[#FCF8F1]">

      <Hero />
      {/* WHY US */}
      <section className="w-full">
        <TrustBuilding />
      </section>

      {/* WHY US */}
      <section className="">
        <Craftsmanship />

      </section>

      {/* PRODUCTS */}
      <section className="-mt-12">
        <ElephantSizeFilter />

        <div className="bg-[#FCF8F1] mt-4">
        <CuratedCollections />
        </div>

        <div className="bg-[#FCF8F1]">
        <GodFigurines />
        </div>

        <div className="">
        <Utility />
        </div>

         <div className="">
        <WhyRatoomals/>
        </div>

        <div className="">
        <Testimonials/>
        </div>
        <div className="">
        <FAQSection/>
        </div>
         <div className="">
        <ContactForm/>
        </div>
        
      </section>

    </main>
    </>
  );
}
