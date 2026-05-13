"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ElephantSizeGuide({ filters }) {
  const [active, setActive] = useState(3); // Default to Large
  const [containerWidth, setContainerWidth] = useState(0);
  const [elephantData, setElephantData] = useState([]);
  const [currentImages, setCurrentImages] = useState({}); // size → url map
  const [availableSizes, setAvailableSizes] = useState(["Mini", "Small", "Medium", "Large", "XL", "XXL"]);

  useEffect(() => {
    const loadElephantData = async () => {
      try {
        const response = await fetch('/data/elephants.json');
        const data = await response.json();
        setElephantData(data);
        if (data.length > 0) {
          setCurrentImages(data[0].images || {});
          setAvailableSizes(data[0].sizes);
          // Auto-select largest available size on initial load
          const sizeLabels = ["Mini", "Small", "Medium", "Large", "XL", "XXL"];
          const filteredLabels = sizeLabels.filter(s => data[0].sizes.includes(s));
          // active = last index in filteredSizes = largest
          setActive(filteredLabels.length - 1);
        }
      } catch (error) {
        console.error("Error loading elephant data:", error);
      }
    };
    loadElephantData();
  }, []);

  useEffect(() => {
    if (elephantData.length > 0 && filters) {
      const { finish, material } = filters;
      const matchedElephant = elephantData.find(e => e.material === material && e.finish === finish);
      const fallback = matchedElephant ||
        elephantData.find(e => e.material === material) ||
        elephantData.find(e => e.finish === finish) ||
        elephantData[0];

      if (fallback) {
        setCurrentImages(fallback.images || {});
        setAvailableSizes(fallback.sizes);
        // Set active to last index of filteredSizes (largest available)
        // filteredSizes is computed from sizes array filtered by availableSizes
        // We need to set active = filteredSizes.length - 1 after sizes are filtered
        // Use a ref-safe approach: store the target label, resolve index after render
        const allSizes = ["Mini", "Small", "Medium", "Large", "XL", "XXL"];
        // Find largest available label
        const largestLabel = [...fallback.sizes].sort(
          (a, b) => allSizes.indexOf(b) - allSizes.indexOf(a)
        )[0];
        // Find its index in filteredSizes (which filters the sizes array)
        const sizeLabels = ["Mini", "Small", "Medium", "Large", "XL", "XXL"];
        const filteredLabels = sizeLabels.filter(s => fallback.sizes.includes(s));
        const idx = filteredLabels.indexOf(largestLabel);
        if (idx !== -1) setActive(idx);
      }
    }
  }, [filters, elephantData]);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById('elephant-container');
      if (el) setContainerWidth(el.offsetWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const sizes = [
    { label: "Mini",   inch: '(2")',         baseWidth: 60,  baseHeight: 55  },
    { label: "Small",  inch: '(4")',         baseWidth: 110, baseHeight: 100 },
    { label: "Medium", inch: '(8")',         baseWidth: 180, baseHeight: 165 },
    { label: "Large",  inch: '(12")',        baseWidth: 270, baseHeight: 250 },
    { label: "XL",     inch: '(18")',        baseWidth: 370, baseHeight: 345 },
    { label: "XXL",    inch: '(24"+Custom)', baseWidth: 480, baseHeight: 450 },
  ];

  const filteredSizes = sizes.filter(s => availableSizes.includes(s.label));

  const getResponsiveDimensions = () => {
    if (containerWidth === 0 || filteredSizes.length === 0) return [];
    const gap = containerWidth < 640 ? 4 : containerWidth < 1024 ? 10 : 16;
    const totalGap = (filteredSizes.length - 1) * gap;
    const padding = containerWidth < 640 ? 4 : containerWidth < 1024 ? 32 : 64;
    const available = containerWidth - totalGap - padding;
    const totalBase = filteredSizes.reduce((s, x) => s + x.baseWidth, 0);
    const scale = available / totalBase;

    // Cap max height so single/few images don't blow up
    const maxHeight = containerWidth < 640 ? 160 : containerWidth < 1024 ? 260 : 360;
    const largestHeight = filteredSizes[filteredSizes.length - 1].baseHeight * scale;
    const heightScale = largestHeight > maxHeight ? maxHeight / largestHeight : 1;
    const finalScale = scale * heightScale;

    return filteredSizes.map(s => ({
      ...s,
      width: Math.max(s.baseWidth * finalScale, 16),
      height: s.baseHeight * finalScale,
    }));
  };

  const responsiveSizes = getResponsiveDimensions();
  const gap = containerWidth < 640 ? 4 : containerWidth < 1024 ? 10 : 16;

  const getPointerLeft = () => {
    if (!responsiveSizes.length || !responsiveSizes[active]) return 0;
    const totalW = responsiveSizes.reduce((s, x) => s + x.width, 0) + (responsiveSizes.length - 1) * gap;
    const containerOffset = (containerWidth - totalW) / 2;
    const beforeW = responsiveSizes.slice(0, active).reduce((s, x) => s + x.width, 0);
    // Center of active elephant
    const center = beforeW + active * gap + responsiveSizes[active].width / 2;
    // Subtract half of arrow width (8px) to center the arrow on the label
    return containerOffset + center - 8;
  };

  const handleSizeHover = (idx) => {
    if (availableSizes.includes(filteredSizes[idx]?.label)) setActive(idx);
  };

  if (filteredSizes.length === 0) {
    return (
      <div className="w-full bg-[#FCF8F1] py-8 text-center text-gray-500">
        Loading elephant sizes...
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FCF8F1] py-4 ">
      <div id="elephant-container" className="w-full max-w-7xl sm:mx-auto px-1 sm:px-4 md:px-6 lg:px-8">

        {/* Elephants */}
        <div className="flex justify-center items-end">
          <div className="flex items-end" style={{ gap: `${gap}px` }}>
            {responsiveSizes.map((item, idx) => {
              const isAvailable = availableSizes.includes(item.label);
              const isActive = active === idx;
              return (
                <div
                  key={idx}
                  style={{
                    flexShrink: 0,
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.3,
                  }}
                  onMouseEnter={() => isAvailable && handleSizeHover(idx)}
                >
                  <div
                    className={`relative transition-all duration-500 ${isActive ? "opacity-100 scale-105 drop-shadow-xl sm:drop-shadow-2xl" : "opacity-50 hover:opacity-80"}`}
                    style={{ width: `${item.width}px`, height: `${item.height}px`, minWidth: `${Math.max(item.width, 20)}px` }}
                  >
                    <Image
                      src={currentImages[item.label] || "/images/elephant-1.svg"}
                      alt={item.label}
                      fill
                      className="object-contain object-bottom  "
                      sizes="(max-width: 640px) 40px, (max-width: 1024px) 80px, 320px"
                      priority={isActive}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line + Labels + Pointer — all in one row so pointer is always centered on label */}
        <div className="flex justify-center w-full px-1">
          <div className="flex" style={{ gap: `${gap}px` }}>
            {responsiveSizes.map((item, idx) => {
              const isAvailable = availableSizes.includes(item.label);
              const isActive = active === idx;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center"
                  style={{ width: `${item.width}px`, flexShrink: 0 }}
                >
                  {/* Divider line segment + pointer arrow */}
                  <div className="relative w-full flex items-center justify-center mb-2">
                    <div className="w-full h-px bg-[#D1D1D1]" />
                    {isActive && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
                        <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-[#C08237]" />
                      </div>
                    )}
                  </div>

                  {/* Label text */}
                  <button
                    onClick={() => isAvailable && setActive(idx)}
                    disabled={!isAvailable}
                    className={`flex flex-col items-center w-full transition-all duration-300 ${
                      isActive ? "text-[#C08237] font-bold"
                      : isAvailable ? "text-gray-600 hover:text-gray-800"
                      : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className={`block text-center leading-tight text-[10px] sm:text-sm md:text-[15px] ${isActive ? "font-bold" : "font-medium"}`}>
                      {item.label}{!isAvailable && " (NA)"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
