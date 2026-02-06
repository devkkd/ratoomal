"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ElephantSizeGuide({ filters }) {
  const [active, setActive] = useState(5); // Default to XXL
  const [containerWidth, setContainerWidth] = useState(0);
  const [elephantData, setElephantData] = useState([]);
  const [currentImage, setCurrentImage] = useState("/images/elephant-1.svg");
  const [availableSizes, setAvailableSizes] = useState(["Mini", "Small", "Medium", "Large", "XL", "XXL"]);

  // Load elephant data from JSON
  useEffect(() => {
    const loadElephantData = async () => {
      try {
        const response = await fetch('/data/elephants.json');
        const data = await response.json();
        setElephantData(data);
        
        // Set default image based on first elephant
        if (data.length > 0) {
          setCurrentImage(data[0].image);
          setAvailableSizes(data[0].sizes);
        }
      } catch (error) {
        console.error("Error loading elephant data:", error);
      }
    };

    loadElephantData();
  }, []);

  // Update image and available sizes when filters change
  useEffect(() => {
    if (elephantData.length > 0 && filters) {
      const { style, finish, material } = filters;
      
      // Find matching elephant
      const matchedElephant = elephantData.find(elephant => 
        elephant.style === style && 
        elephant.finish === finish && 
        elephant.material === material
      );

      if (matchedElephant) {
        setCurrentImage(matchedElephant.image);
        setAvailableSizes(matchedElephant.sizes);
        
        // Update active size based on available sizes
        const allSizes = ["Mini", "Small", "Medium", "Large", "XL", "XXL"];
        const largestAvailableIndex = allSizes
          .map((size, index) => matchedElephant.sizes.includes(size) ? index : -1)
          .filter(index => index !== -1)
          .pop();
        
        if (largestAvailableIndex !== undefined) {
          setActive(largestAvailableIndex);
        }
      } else {
        // If no exact match, try partial matches
        const fallbackElephant = elephantData.find(elephant => 
          elephant.style === style
        ) || elephantData.find(elephant => 
          elephant.finish === finish
        ) || elephantData.find(elephant => 
          elephant.material === material
        ) || elephantData[0];
        
        if (fallbackElephant) {
          setCurrentImage(fallbackElephant.image);
          setAvailableSizes(fallbackElephant.sizes);
        }
      }
    }
  }, [filters, elephantData]);

  // Container width calculation (existing code)
  useEffect(() => {
    const updateContainerWidth = () => {
      const container = document.getElementById('elephant-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

 const sizes = [
    { label: "Mini", inch: "(2”)", baseWidth: 80, baseHeight: 60 },
    { label: "Small", inch: "(4”)", baseWidth: 120, baseHeight: 100 },
    { label: "Medium", inch: "(8”)", baseWidth: 150, baseHeight: 130 },
    { label: "Large", inch: "(12”)", baseWidth: 190, baseHeight: 170 },
    { label: "XL", inch: "(18”)", baseWidth: 250, baseHeight: 235 },
    { label: "XXL", inch: "(24”+Custom)", baseWidth: 320, baseHeight: 300 },
  ];

  // Filter sizes based on availability
  const filteredSizes = sizes.filter((size, index) => availableSizes.includes(size.label));

  // Calculate responsive dimensions based on screen size
  const getResponsiveDimensions = () => {
    if (containerWidth === 0 || filteredSizes.length === 0) return [];
    
    // For mobile screens (up to 640px)
    if (containerWidth < 640) {
      const totalElephants = filteredSizes.length;
      const totalGap = (totalElephants - 1) * 8;
      const availableWidth = containerWidth - totalGap - 32;
      
      const totalBaseWidth = filteredSizes.reduce((sum, size) => sum + size.baseWidth, 0);
      const scaleFactor = availableWidth / totalBaseWidth;
      
      return filteredSizes.map(size => ({
        ...size,
        width: Math.max(size.baseWidth * scaleFactor * 0.9, 24),
        height: size.baseHeight * scaleFactor * 0.9
      }));
    }
    
    // For tablet screens (640px to 1024px)
    if (containerWidth < 1024) {
      const totalElephants = filteredSizes.length;
      const totalGap = (totalElephants - 1) * 16;
      const availableWidth = containerWidth - totalGap - 64;
      
      const totalBaseWidth = filteredSizes.reduce((sum, size) => sum + size.baseWidth, 0);
      const scaleFactor = availableWidth / totalBaseWidth;
      
      return filteredSizes.map(size => ({
        ...size,
        width: size.baseWidth * scaleFactor * 0.95,
        height: size.baseHeight * scaleFactor * 0.95
      }));
    }
    
    // For desktop screens (1024px and above)
    const totalElephants = filteredSizes.length;
    const totalGap = (totalElephants - 1) * 20;
    const availableWidth = Math.min(containerWidth - totalGap - 128, 1200);
    
    const totalBaseWidth = filteredSizes.reduce((sum, size) => sum + size.baseWidth, 0);
    const scaleFactor = Math.min(1, availableWidth / totalBaseWidth);
    
    return filteredSizes.map(size => ({
      ...size,
      width: size.baseWidth * scaleFactor,
      height: size.baseHeight * scaleFactor
    }));
  };

  const responsiveSizes = getResponsiveDimensions();

  // Calculate total width of all elephants with gaps for pointer positioning
  const getTotalWidthWithGaps = () => {
    if (responsiveSizes.length === 0) return 0;
    
    const totalElephantsWidth = responsiveSizes.reduce((sum, size) => sum + size.width, 0);
    const gapCount = responsiveSizes.length - 1;
    const gapSize = containerWidth < 640 ? 12 : containerWidth < 1024 ? 16 : 38;
    
    return totalElephantsWidth + (gapCount * gapSize);
  };

  // Calculate left position for pointer
  const getPointerLeftPosition = () => {
    if (responsiveSizes.length === 0 || !responsiveSizes[active]) return 0;
    
    const gapSize = containerWidth < 640 ? 8 : containerWidth < 1024 ? 16 : 24;
    
    // Calculate cumulative width of elephants before active one
    const widthBeforeActive = responsiveSizes
      .slice(0, active)
      .reduce((sum, size) => sum + size.width, 0);
    
    // Add gaps before active elephant
    const gapsBeforeActive = active * gapSize;
    
    // Calculate center of active elephant
    const activeCenter = widthBeforeActive + gapsBeforeActive + (responsiveSizes[active].width / 2);
    
    // Calculate container offset to center the whole row
    const totalWidthWithGaps = getTotalWidthWithGaps();
    const containerOffset = (containerWidth - totalWidthWithGaps) / 2;
    
    return containerOffset + activeCenter - 8;
  };


const handleSizeHover = (index) => {
  if (availableSizes.includes(filteredSizes[index]?.label)) {
    setActive(index);
  }
};

  if (filteredSizes.length === 0) {
    return (
      <div className="w-full bg-[#FCF8F1] border py-6 sm:py-8 md:py-12">
        <div className="text-center text-gray-500">
          Loading elephant sizes...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FCF8F1] py-6 sm:py-8 md:py-12">
      <div 
        id="elephant-container" 
        className="w-full max-w-7xl sm:mx-auto px-3 sm:px-4 md:px-6 lg:px-8"
      >
        
        {/* Elephant Visual Display */}
       <div className="flex justify-center items-end mb-4 sm:mb-6 md:mb-8">
  <div className="flex items-end" style={{ gap: containerWidth < 640 ? '8px' : containerWidth < 1024 ? '16px' : '24px' }}>
    {responsiveSizes.map((item, idx) => {
      const isAvailable = availableSizes.includes(item.label);
      const isActive = active === idx;
      
      return (
        <div
          key={idx}
          className="flex flex-col items-center justify-end transition-all duration-300"
          style={{ 
            flexShrink: 0,
            transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            opacity: isAvailable ? 1 : 0.3
          }}
          onMouseEnter={() => isAvailable && handleSizeHover(idx)}
          onMouseLeave={() => {
            // Optional: Reset to default (XXL) or keep last hovered
            // if (isActive && idx !== defaultActiveIndex) {
            //   setActive(defaultActiveIndex);
            // }
          }}
        >
                  <div
                    className={`relative transition-all duration-500 ${
                      isActive 
                      ? "opacity-100 scale-105 drop-shadow-xl sm:drop-shadow-2xl" 
                      : "opacity-50 hover:opacity-80"
                    }`}
                    style={{ 
                      width: `${item.width}px`, 
                      height: `${item.height}px`,
                      minWidth: `${Math.max(item.width, 20)}px`
                    }}
                  >
                    <Image
                      src={currentImage}
                      alt={item.label}
                      fill
                      className="object-contain object-bottom"
                      sizes="(max-width: 640px) 40px, (max-width: 1024px) 80px, 320px"
                      priority={isActive}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slider Line & Pointer */}
        <div className="relative w-full mb-4 sm:mb-6 md:mb-8 px-2">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D1D1D1] to-transparent"></div>
          
          {/* Pointer */}
          <div 
            className="absolute -top-[1px] transition-all duration-500 ease-in-out"
            style={{ 
              left: `${getPointerLeftPosition()}px`
            }}
          >
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#C08237] sm:border-l-[10px] sm:border-r-[10px] sm:border-t-[12px] md:border-l-[12px] md:border-r-[12px] md:border-t-[14px]"></div>
          </div>
        </div>

        {/* Size Labels */}
        <div className="flex justify-center w-full px-2">
          <div className="flex" style={{ gap: containerWidth < 640 ? '8px' : containerWidth < 1024 ? '16px' : '24px' }}>
            {responsiveSizes.map((item, idx) => {
              const isAvailable = availableSizes.includes(item.label);
              const isActive = active === idx;
              
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center"
                  style={{ 
                    width: `${item.width}px`,
                    flexShrink: 0 
                  }}
                >
                  <button
                    onClick={() => isAvailable && setActive(idx)}
                    disabled={!isAvailable}
                    className={`flex flex-col items-center transition-all duration-300 w-full ${
                      isActive 
                      ? "text-[#C08237] scale-105 font-bold" 
                      : isAvailable 
                        ? "text-gray-600 hover:text-gray-800" 
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className={`text-[10px] xs:text-xs sm:text-sm md:text-[15px] whitespace-nowrap truncate w-full text-center ${
                      isActive ? "font-bold" : "font-medium"
                    }`}>
                      {item.label}
                      {!isAvailable && " (NA)"}
                    </span>
                    <span className={`text-[8px] xs:text-[9px] sm:text-[10px] md:text-[12px] mt-0.5 ${
                      isAvailable ? "opacity-80" : "opacity-50"
                    }`}>
                      {item.inch}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info text */}
        {/* <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500 italic">
            {availableSizes.length === 1 
              ? `Only ${availableSizes[0]} size available for this combination` 
              : "Click on any size to see the elephant scale"}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Current selection: {filters?.style} • {filters?.finish} • {filters?.material}
          </p>
        </div> */}
      </div>
    </div>
  );
}