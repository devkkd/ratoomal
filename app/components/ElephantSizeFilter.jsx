"use client";
import { useState, useRef, useEffect } from "react";
import ElephantSizeGuide from "./ElephantSizeGuide";

export default function RoyalCollection() {
  const [filters, setFilters] = useState({
    style: "Hand Painted",
    finish: "Multi Color",
    material: "Wooden",
  });

  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  const scrollRefs = [useRef(null), useRef(null), useRef(null)];

  const styles = ["Hand Painted", "Hand Carved", "Antique Finish", "Heritage", "Minimal", "Royal"];
  const finishes = [
    { name: "Multi Color", color: "#C08237" },
    { name: "Single Color", color: "#D8A76B" },
    { name: "Gold Foil", color: "#E6BC23" },
    { name: "Meenakari", color: "#857057" },
    { name: "Diamond/Stone", color: "#D7D7CD" },
    { name: "Wood", color: "#CAAE7B" },
  ];
  const materials = [
    { name: "Wooden", color: "#C8AC40" },
    { name: "Brass", color: "#A5952D" },
    { name: "Marble", color: "#C7C7C7" },
    { name: "Resin", color: "#696969" },
    { name: "Meenakari", color: "#637E54" },
    { name: "Tribal Art", color: "#799FAD" },
    { name: "Metal Inlay", color: "#626262" },
  ];

  const handleSelect = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const checkScroll = (container, index) => {
    if (container) {
      const showLeft = container.scrollLeft > 0;
      const showRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
      
      // You can store these states in an array if you want independent scroll buttons
      setShowLeftScroll(showLeft);
      setShowRightScroll(showRight);
    }
  };

  const scroll = (direction, index) => {
    const container = scrollRefs[index].current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollRefs.forEach((ref, index) => {
      const container = ref.current;
      if (container) {
        const handleScroll = () => checkScroll(container, index);
        container.addEventListener('scroll', handleScroll);
        
        // Initial check
        checkScroll(container, index);
        
        // Re-check on window resize
        const handleResize = () => checkScroll(container, index);
        window.addEventListener('resize', handleResize);
        
        return () => {
          container.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        };
      }
    });
  }, []);

  return (
    <div className="w-full bg-[#FCF9F3] px-10 py-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        
        {/* Left Section: Branding - 45% width */}
        <div className="w-full lg:w-[45%]  text-center  flex flex-col justify-center items-center">
          <div className="max-w-md mx-auto lg:mx-0"> {/* Added wrapper for better control */}
            <h1 className="text-3xl md:text-5xl playfair font-serif font-bold text-[#1a1a1a] mb-4 md:mb-6 leading-tight">
              The Elephant Guy
            </h1>
            <h2 className="text-lg mona md:text-lg font-bold text-[#1a1a1a] mb-3 md:mb-4">
              Royal Elephant Collection - Craft Your Majesty
            </h2>
            <p className="text-[#4a4a4a] mona text-sm md:text-base">
              From Palm-Size to Palace-Size – Your Elephant, Your Way
            </p>
          </div>
        </div>

        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden lg:block w-[1px] h-48 bg-gray-400"></div>

        {/* Right Section: Customization - 55% width */}
        <div className="w-full lg:w-[55%] space-y-5 lg:pl-4 ">
          <h3 className="text-base mona md:text-md font-bold text-black  text-center lg:text-left">
            Customize you want
          </h3>

          {/* Style Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 ">
            <span className="font-bold text-sm w-20 sm:w-16 shrink-0">Craft</span>
            <div className="relative w-full">
              <div 
                ref={scrollRefs[0]}
                className="flex overflow-x-auto scrollbar-hide gap-1  px-1"
                onScroll={() => checkScroll(scrollRefs[0].current, 0)}
              >
                {styles.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSelect("style", item)}
                    className={`px-2 py-1.5 text-[12px] rounded-full transition-all border shrink-0 whitespace-nowrap
                      ${filters.style === item 
                        ? "bg-[#C08237] text-white border-[#A66E2C] shadow-inner" 
                        : "bg-[#FFF7ED] text-[#444] border-transparent hover:border-[#C08237]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {/* Scroll Indicators */}
              {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                {showLeftScroll && (
                  <div className="w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border">
                    <span className="text-xs">←</span>
                  </div>
                )}
              </div> */}
              {/* <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                {showRightScroll && (
                  <div className="w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border">
                    <span className="text-xs">→</span>
                  </div>
                )}
              </div> */}
            </div>
          </div>

          {/* Finish Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 ">
            <span className="font-bold text-sm w-20 sm:w-16 shrink-0">Finish</span>
            <div className="relative w-full">
              <div 
                ref={scrollRefs[1]}
                className="flex overflow-x-auto scrollbar-hide gap-1 px-1"
                onScroll={() => checkScroll(scrollRefs[1].current, 1)}
              >
                {finishes.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleSelect("finish", item.name)}
                    className={`px-2 py-1.5 text-[12px] rounded-full flex items-center gap-2 border transition-all shrink-0 whitespace-nowrap
                      ${filters.finish === item.name 
                        ? "bg-[#C08237] text-white border-[#A66E2C]" 
                        : "bg-[#FFF7ED] text-[#444] border-transparent hover:border-[#C08237]"}`}
                  >
                    <span className="w-4 h-4 rounded-full shadow-sm" style={{ background: item.color }}></span>
                    {item.name}
                  </button>
                ))}
              </div>
              {/* Scroll Indicators */}
              {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                {showLeftScroll && (
                  <div className="w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border">
                    <span className="text-xs">←</span>
                  </div>
                )}
              </div> */}
              {/* <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                {showRightScroll && (
                  <div className="w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border">
                    <span className="text-xs">→</span>
                  </div>
                )}
              </div> */}
            </div>
          </div>

          {/* Material Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <span className="font-bold text-sm w-20 sm:w-16 shrink-0">Elephant</span>
            <div className="relative w-full">
              <div 
                ref={scrollRefs[2]}
                className="flex overflow-x-auto scrollbar-hide gap-1 px-1"
                onScroll={() => checkScroll(scrollRefs[2].current, 2)}
              >
                {materials.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect("material", item.name)}
                    className={`px-2 py-1.5 text-[12px] rounded-full flex items-center gap-2 border transition-all shrink-0 whitespace-nowrap
                      ${filters.material === item.name 
                        ? "bg-[#C08237] text-white border-[#A66E2C]" 
                        : "bg-[#FFF7ED] text-[#444] border-transparent hover:border-[#C08237]"}`}
                  >
                    <span className="w-4 h-4 rounded-full shadow-sm" style={{ background: item.color }}></span>
                    {item.name}
                  </button>
                ))}
              </div>
              {/* Scroll Indicators */}
              {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                {showLeftScroll && (
                  <div className="w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border">
                    <span className="text-xs">←</span>
                  </div>
                )}
              </div> */}
              {/* <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                {showRightScroll && (
                  <div className="w-6 h-6 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm border">
                    <span className="text-xs">→</span>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:mt-12">
        <ElephantSizeGuide />
      </div>

      {/* Add this to your global CSS or tailwind.config.js */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}