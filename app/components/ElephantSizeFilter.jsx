"use client";
import { useState, useRef } from "react";
import ElephantSizeGuide from "./ElephantSizeGuide";

const MATERIAL_FINISH_MAP = {
  "Wood":          { color: "#C8A96E", finishes: ["Plain", "Carved", "Undercut", "Painted", "Decorated"] },
  "Aluminium":     { color: "#A8B8C8", finishes: ["Painted", "Decorated"] },
  "Paper Mache":   { color: "#D4B896", finishes: ["Stone Finish", "Decorated", "Painted"] },
  "Plastic":       { color: "#8FBC8F", finishes: ["Painted", "Decorated"] },
};

const MATERIALS = Object.keys(MATERIAL_FINISH_MAP);

export default function ElephantSizeFilter() {
  const [selectedMaterial, setSelectedMaterial] = useState("Wood");
  const [selectedFinish, setSelectedFinish]     = useState("Plain");

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setSelectedFinish(MATERIAL_FINISH_MAP[material].finishes[0]);
  };

  const currentFinishes = MATERIAL_FINISH_MAP[selectedMaterial]?.finishes || [];
  const filters = { material: selectedMaterial, finish: selectedFinish };

  return (
    <div className="w-full bg-[#FCF8F1] px-3 py-4 md:px-8 md:py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 lg:gap-8">

        {/* Left — Branding (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex w-full lg:w-[45%] text-center flex-col justify-center items-center">
          <div className="max-w-md">
            <h1 className="text-3xl md:text-5xl playfair font-serif font-bold text-[#1a1a1a] mb-4 leading-tight">
              The Elephant Guy
            </h1>
            <h2 className="text-lg mona font-bold text-[#1a1a1a] mb-3">
              Royal Elephant Collection — Craft Your Majesty
            </h2>
            <p className="text-[#4a4a4a] mona text-sm md:text-base">
              From Palm-Size to Palace-Size – Your Elephant, Your Way
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#C08237]/30 rounded-full shadow-sm">
              <span className="text-xs font-medium text-[#6B4C2A]">
                {selectedMaterial} · {selectedFinish}
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider (Desktop only) */}
        <div className="hidden lg:block w-px h-48 bg-gray-300" />

        {/* Right — Filters */}
        <div className="w-full lg:w-[55%] lg:pl-4">

          {/* Mobile title */}
          <div className="lg:hidden mb-3">
            <h2 className="text-base playfair font-bold text-[#1a1a1a]">The Elephant Guy</h2>
            <p className="text-xs text-[#4a4a4a] mt-0.5">Craft Your Majesty — Choose Material & Finish</p>
          </div>

          {/* Material Row */}
          <div className="mb-3">
            <span className="block font-bold text-xs text-[#4a4a4a] mb-1.5 uppercase tracking-wide">Material</span>
            <div className="flex flex-wrap gap-1.5">
              {MATERIALS.map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialSelect(mat)}
                  className={`px-2.5 py-1 text-[11px] rounded-full transition-all border whitespace-nowrap
                    ${selectedMaterial === mat
                      ? "bg-[#C08237] text-white border-[#A66E2C] font-semibold"
                      : "bg-white text-[#555] border-[#ddd] hover:border-[#C08237] hover:text-[#C08237]"
                    }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Finish Row */}
          <div className="mb-3">
            <span className="block font-bold text-xs text-[#4a4a4a] mb-1.5 uppercase tracking-wide">Finish</span>
            <div className="flex flex-wrap gap-1.5">
              {currentFinishes.map((finish) => (
                <button
                  key={finish}
                  onClick={() => setSelectedFinish(finish)}
                  className={`px-2.5 py-1 text-[11px] rounded-full transition-all border whitespace-nowrap
                    ${selectedFinish === finish
                      ? "bg-[#C08237] text-white border-[#A66E2C] font-semibold"
                      : "bg-white text-[#555] border-[#ddd] hover:border-[#C08237] hover:text-[#C08237]"
                    }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>

          {/* Selection badge — mobile only */}
          <div className="lg:hidden mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#C08237]/30 rounded-full text-[11px] font-medium text-[#6B4C2A]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: MATERIAL_FINISH_MAP[selectedMaterial]?.color }}
              />
              {selectedMaterial} · {selectedFinish}
            </span>
          </div>
        </div>
      </div>

      {/* Size Guide */}
      <div className="mt-4">
        <ElephantSizeGuide filters={filters} />
      </div>
    </div>
  );
}
