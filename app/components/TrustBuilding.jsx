import React from "react";

const TrustBuilding = () => {
  const features = [
    {
      imgSrc: "/images/trust/Handcrafted.svg",
      label: "Handcrafted Decor",
    },
    {
      imgSrc: "/images/trust/Authentic.svg",
      label: "Authentic Heritage",
    },
    {
      imgSrc: "/images/trust/Legacy.svg",
      label: "70+ Years Legacy",
    },
    {
      imgSrc: "/images/trust/Antiques.svg",
      label: "Salvaged Antiques",
    },
    {
      imgSrc: "/images/trust/Presence.svg",
      label: "Global Presence",
    },
  ];

  return (
    <section className="w-full bg-[#fdf6e9] py-4 px-4 md:px-8 font-sans overflow-hidden relative">
      {/* Top-left shadow */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#c48b46] to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Top-right shadow */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#c48b46] to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl  mx-auto relative z-10 flex flex-col">
        {/* Top Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-7 mb-16">
          <div className="relative w-full md:w-[40%] flex justify-center">
            <img
              src="/images/Group-241.svg"
              alt="Handcrafted Elephant Art"
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </div>

          <div className="w-full md:w-[60%] text-left space-y-6">
            <h2
              className="text-xl md:text-[33px] font-bold playfair"
              style={{
                background: "linear-gradient(180deg, #DB9E55 0%, #8F561E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ratoomal’s Jaipur’s Heritage
            </h2>

            <h1 className="text-4xl font-semibold text-black leading-[1.1] mona">
              Handicraft & Sculptural Excellence
            </h1>
            <div className="space-y-4">
              <p className="text-gray-700 text-md max-w-xl mona">
                From the Royal City of Jaipur to the World - Handcrafted Statues, 
                Sculptures & Decor with Timeless Indian Heritage.  
                <span className="text-black text-md pl-1 font-bold uppercase mona">
                  HANDMADE ARTISTRY SINCE 1955
                </span>
              </p>
            </div>

            <button className="mt-8 mona px-10 py-4 bg-[#c48b46] text-white rounded-full flex items-center gap-1 hover:bg-[#a6753a] transition-all duration-300 font-medium text-base uppercase">
              EXPLORE COLLECTIONS
              <span className="text-xl group-hover:translate-y-1 transition-transform duration-300">
                ↓
              </span>
            </button>
          </div>
        </div>

        {/* Bottom: Icon Features Grid */}
        <div className="relative max-w-6xl mx-7 px-4 md:px-0 ">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-2 md:space-y-4 group relative w-full"
              >
                <div className="p-2 transition-transform duration-300 group-hover:scale-110">
                  <img src={item.imgSrc} alt={item.label} className="w-12 h-12 object-contain" />
                </div>
                <p className="text-gray-800 text-sm md:text-[14px] font-normal mona">
                  {item.label}
                </p>

                {/* Vertical dividers for desktop */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute right-[-8px] top-1/2 transform -translate-y-1/2 h-[90%] w-[1px] bg-gray-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBuilding;
