"use client";

import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function ArtOfAuthenticity() {
  return (
    <section
      className={`${playfairDisplay.className} w-full bg-[#FCF8F1] pt-16 pb-8 md:py-16 flex flex-col items-center text-center px-4`}
    >
      <p className=" text-sm md:text-base  text-gray-500 uppercase">
        <img src="/images/upperblock.svg" alt="Decorative block pattern" className="w-md" />
      </p>

      <h1 className="text-[30px] sm:text-[50px] font-semibold text-[#C08237] mt-8 my-7">
        Where Royal Rajasthan Craftsmanship
      </h1>

      <div className="max-w-[1200px] mx-auto mt-8 space-y-8">
        <p className="text-[14px] md:text-[16px] leading-[1.9] text-[#2B2B2B] text-center">
          <span className="font-semibold text-[#121212]">
            Rooted in Jaipur, Rajasthan – the land of Maharajas and master craftsmen –
            Ratoomal's represents over six decades of heritage artistry,
          </span>{" "}
          meticulously handcrafted for international markets.
        </p>

        <p className="text-[14px] md:text-[16px] leading-[1.9] text-[#2B2B2B] text-center">
          Our products are designed and crafted with the{" "}
          <span className="font-semibold text-[#121212]">
            same precision, symbolism, and cultural integrity
          </span>{" "}
          that once adorned{" "}
          <span className="font-semibold text-[#121212]">
            royal palaces.
          </span>
        </p>

        <p className="text-[14px] md:text-[16px] leading-[1.9] text-[#2B2B2B] text-center">
          We specialize in{" "}
          <span className="font-semibold text-[#121212]">
            wooden, metal, resin, and mixed-material handicrafts
          </span>{" "}
          that reflect both timeless{" "}
          <span className="font-semibold text-[#121212]">
            Indian traditions
          </span>{" "}
          and contemporary global tastes.
        </p>

        <p className="text-[14px] md:text-[16px] leading-[1.9] text-[#2B2B2B] text-center">
          We are a trusted manufacturer, exporter, wholesaler, and B2B partner for
          home décor, corporate gifting, interior design studios, and boutique
          retailers worldwide.
        </p>
      </div>

      <p className="text-sm md:text-base tracking-widest text-gray-500 uppercase mt-8 mb-2 md:mb-10">
        <img
          src="/images/downblock.svg"
          alt="Decorative block pattern"
          className="w-md"
        />
      </p>
    </section>
  );
}