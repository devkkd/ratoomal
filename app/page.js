import Hero from "@/app/components/Hero";
import Craftsmanship from "@/app/components/Craftsmanship";
// import FeatureCard from "@/components/FeatureCard";
import ProductCard from "@/app/components/ProductCard";
import TrustBuilding from "@/app/components/TrustBuilding";
import ElephantSizeFilter from "./components/ElephantSizeFilter";
import CuratedCollections from "./components/CuratedCollections";
import GodFigurines from "./components/GodFigurines";
import Utility from "./components/Utility";
import WhyRatoomals from "./components/WhyRatoomals";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import ContactForm from "./components/ContactForm";
import ConnectSection from "./components/ConnectSection";
import Guarantees from "./components/Guarantees";

export default function HomePage() {
  return (
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
  );
}
