"use client";
import { useState, useRef, useEffect } from "react";
import ElephantSizeGuide from "./ElephantSizeGuide";

// Material → Finish mapping as per business logic
const MATERIAL_FINISH_MAP = {
  "Wood": {
    color: "#C8A96E",
    finishes: ["Plain", "Carved", "Undercut", "Painted Decorated"],
  },
  "Aluminium": {
    color: "#A8B8C8",
    finishes: ["Silver Coated", "Painted", "Decorated"],
  },
  "Paper Mache": {
    color: "#D4B896",
    finishes: ["Stone Finish", "Mosaic Work", "Decorated", "Painted"],
  },
  "Re-cycled Plastic": {
    color: "#8FBC8F",
    finishes: ["Painted", "Decorated", "Stone Finish", "Metallic Finish"],
  },
};

const MATERIALS = Object.keys(MATERIAL_FINISH_MAP);

// Finish color swatches
const FINISH_COLORS = {
  "Plain":            "#D4B896",
  "Carved":           "#C8A070",
  "Undercut":         "#B8906A",
  "Painted Decorated":"#E8A0A0",
  "Silver Coated":    "#C0C0C0",
  "Painted":          "#A0B8D0",
  "Decorated":        "#D0A0C0",
  "Stone Finish":     "#B0B0A0",
  "Mosaic Work":      "#A0C0A0",
  "Metallic Finish":  "#C8B870",
};

export default function ElephantSizeFilter() {
  const [selectedMaterial, setSelectedMaterial] = useState("Wood");
  const [selectedFinish, setSelectedFinish]     = useState("Plain");

  const materialScrollRef = useRef(null);
  const finishScrollRef   = useRef(null);

  // When material changes, reset finish to first available
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    const firstFinish = MATERIAL_FINISH_MAP[material].finishes[0];
    setSelectedFinish(firstFinish);
  };

  const handleFinishSelect = (finish) => {
    setSelectedFinish(finish);
  };

  const currentFinishes = MATERIAL_FINISH_MAP[selectedMaterial]?.finishes || [];

  const filters = { material: selectedMaterial, finish: selectedFinish };

  return (
    <div className="w-full bg-[#FCF8F1] px-6 py-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-8">

        {/* Left — Branding */}
        <div className="w-full lg:w-[45%] text-center flex flex-col justify-center items-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <h1 className="text-3xl md:text-5xl playfair font-serif font-bold text-[#1a1a1a] mb-4 md:mb-6 leading-tight">
              The Elephant Guy
            </h1>
            <h2 className="text-lg mona md:text-lg font-bold text-[#1a1a1a] mb-3 md:mb-4">
              Royal Elephant Collection — Craft Your Majesty
            </h2>
            <p className="text-[#4a4a4a] mona text-sm md:text-base">
              From Palm-Size to Palace-Size – Your Elephant, Your Way
            </p>

            {/* Current selection badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#C08237]/30 rounded-full shadow-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: MATERIAL_FINISH_MAP[selectedMaterial]?.color }}
              />
              <span className="text-xs font-medium text-[#6B4C2A]">
                {selectedMaterial} · {selectedFinish}
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden lg:block w-px h-48 bg-gray-300" />

        {/* Right — Filters */}
        <div className="w-full lg:w-[55%] space-y-6 lg:pl-4">
          <h3 className="text-base mona md:text-md font-bold text-black text-center lg:text-left">
            Customize your elephant
          </h3>

          {/* ── Material Row ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="font-bold text-sm w-20 shrink-0 text-[#4a4a4a]">Material</span>
            <div
              ref={materialScrollRef}
              className="flex overflow-x-auto scrollbar-hide gap-2 px-1 pb-1"
            >
              {MATERIALS.map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialSelect(mat)}
                  className={`px-3 py-1.5 text-[12px] rounded-full transition-all border shrink-0 whitespace-nowrap flex items-center gap-1.5
                    ${selectedMaterial === mat
                      ? "bg-[#C08237] text-white border-[#A66E2C] shadow-inner"
                      : "bg-[#FFF7ED] text-[#444] border-transparent hover:border-[#C08237]"
                    }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/50"
                    style={{ background: MATERIAL_FINISH_MAP[mat].color }}
                  />
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Finish Row (dynamic based on material) ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="font-bold text-sm w-20 shrink-0 text-[#4a4a4a]">Finish</span>
            <div
              ref={finishScrollRef}
              className="flex overflow-x-auto scrollbar-hide gap-2 px-1 pb-1"
            >
              {currentFinishes.map((finish) => (
                <button
                  key={finish}
                  onClick={() => handleFinishSelect(finish)}
                  className={`px-3 py-1.5 text-[12px] rounded-full transition-all border shrink-0 whitespace-nowrap flex items-center gap-1.5
                    ${selectedFinish === finish
                      ? "bg-[#C08237] text-white border-[#A66E2C] shadow-inner"
                      : "bg-[#FFF7ED] text-[#444] border-transparent hover:border-[#C08237]"
                    }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/50"
                    style={{ background: FINISH_COLORS[finish] || "#ccc" }}
                  />
                  {finish}
                </button>
              ))}
            </div>
          </div>

          {/* Helper text */}
          <p className="text-xs text-[#9a7a5a] pl-1">
            Select a material to see available finishes for that craft
          </p>
        </div>
      </div>

      {/* Size Guide — passes both filters down */}
      <div className="mt-8 lg:mt-12">
        <ElephantSizeGuide filters={filters} />
      </div>

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
