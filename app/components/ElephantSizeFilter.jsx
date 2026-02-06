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
  const [elephantData, setElephantData] = useState([]);
  
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

  // Load elephant data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/elephants.json');
        const data = await response.json();
        setElephantData(data);
        
        // Set default filters based on first elephant
        if (data.length > 0) {
          const defaultElephant = data[0];
          setFilters({
            style: defaultElephant.style,
            finish: defaultElephant.finish,
            material: defaultElephant.material,
          });
        }
      } catch (error) {
        console.error("Error loading elephant data:", error);
      }
    };
    
    loadData();
  }, []);

  const handleSelect = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Log current combination
    if (elephantData.length > 0) {
      const matchedElephant = elephantData.find(elephant => 
        elephant.style === newFilters.style && 
        elephant.finish === newFilters.finish && 
        elephant.material === newFilters.material
      );
      
      if (matchedElephant) {
        console.log("Selected elephant:", matchedElephant.name);
        console.log("Available sizes:", matchedElephant.sizes);
      } else {
        console.log("No exact match found for combination:", newFilters);
      }
    }
  };

  const checkScroll = (container, index) => {
    if (container) {
      const showLeft = container.scrollLeft > 0;
      const showRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
      
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
        
        checkScroll(container, index);
        
        const handleResize = () => checkScroll(container, index);
        window.addEventListener('resize', handleResize);
        
        return () => {
          container.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        };
      }
    });
  }, []);

  // Get available combinations for current filters
  const getAvailableCombinations = () => {
    if (elephantData.length === 0) return [];
    
    const { style, finish, material } = filters;
    
    // Find all elephants matching current filters
    return elephantData.filter(elephant => 
      elephant.style === style || 
      elephant.finish === finish || 
      elephant.material === material
    );
  };

  return (
    <div className="w-full  px-10 py-6 md:p-8  ">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        
        {/* Left Section: Branding - 45% width */}
        <div className="w-full lg:w-[45%] text-center flex flex-col justify-center items-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <h1 className="text-3xl md:text-5xl playfair font-serif font-bold text-[#1a1a1a] mb-4 md:mb-6 leading-tight">
              The Elephant Guy
            </h1>
            <h2 className="text-lg mona md:text-lg font-bold text-[#1a1a1a] mb-3 md:mb-4">
              Royal Elephant Collection - Craft Your Majesty
            </h2>
            <p className="text-[#4a4a4a] mona text-sm md:text-base">
              From Palm-Size to Palace-Size – Your Elephant, Your Way
            </p>
            
            {/* Display current selection */}
            {/* {elephantData.length > 0 && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700">
                  Current Selection:
                </p>
                <p className="text-xs text-gray-600">
                  {filters.style} • {filters.finish} • {filters.material}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getAvailableCombinations().length} matching designs available
                </p>
              </div>
            )} */}
          </div>
        </div>

        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden lg:block w-[1px] h-48 bg-gray-400"></div>

        {/* Right Section: Customization - 55% width */}
        <div className="w-full lg:w-[55%] space-y-5 lg:pl-4 ">
          <h3 className="text-base mona md:text-md font-bold text-black text-center lg:text-left">
            Customize you want
          </h3>

          {/* Style Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
            <span className="font-bold text-sm w-20 sm:w-16 shrink-0">Craft</span>
            <div className="relative w-full">
              <div 
                ref={scrollRefs[0]}
                className="flex overflow-x-auto scrollbar-hide gap-1 px-1"
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
            </div>
          </div>

          {/* Finish Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
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
            </div>
          </div>
          
          {/* Available Combinations Preview */}
          {/* {elephantData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                Available designs for current selection:
              </p>
              <div className="flex flex-wrap gap-2">
                {getAvailableCombinations().slice(0, 3).map((elephant, idx) => (
                  <div 
                    key={elephant.id}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-300"
                    title={elephant.name}
                  >
                    {elephant.sizes.length} sizes
                  </div>
                ))}
                {getAvailableCombinations().length > 3 && (
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-300">
                    +{getAvailableCombinations().length - 3} more
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>

      <div className="mt-8 lg:mt-12">
        <ElephantSizeGuide filters={filters} />
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