import Image from "next/image";

// Static hero — no carousel JS needed (single image, interval removed)
// This is a server component: renders in HTML, no JS shipped to client for this section.

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FFF6EB]">
      <div className="relative h-[250px] sm:h-[280px] md:h-[400px] lg:h-[520px] xl:h-[620px]">

        {/* Hero Heading */}
        <div className="
          absolute
          left-6 md:left-12 lg:left-20
          top-1/2
          -translate-y-1/2
          z-10
        ">
          <h1 className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            font-serif
            font-medium
            text-[#4A3526]
            leading-tight
            max-w-xl
          ">
            Handicrafts Exporters in Jaipur
          </h1>
        </div>

        {/* LCP image — next/image handles srcset + lazy decode automatically */}
        <Image
          src="/images/hero1.webp"
          alt="Handicrafts Exporters in Jaipur — Ratoomals"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={85}
        />
      </div>
    </section>
  );
}
