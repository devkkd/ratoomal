"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function ExhibitionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Always show popup on website open
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Disable scroll and blur everything
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Re-enable scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop - Full page blur including header */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-md transition-opacity duration-300"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Popup Modal - On top of everything */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 lg:p-6 overflow-y-auto pt-32 md:pt-24 lg:pt-20">
          {/* Card Container - Responsive with gap from header */}
          <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Close Button - X Only */}
            <button
              onClick={handleClose}
              className="absolute top-4 md:top-6 right-4 md:right-6 z-10 bg-white hover:bg-gray-100 text-gray-800 p-2 md:p-2.5 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center hover:shadow-xl"
              aria-label="Close popup"
            >
              <X className="w-5 md:w-6 h-5 md:h-6 stroke-[2.5]" />
            </button>

            {/* Image Container - 500x680 scaled responsively */}
            <div className="relative w-full aspect-[500/680] bg-gray-200 overflow-hidden">
              <Image
                src="/expo2.png"
                alt="Exhibition Banner"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(max-width: 640px) calc(100vw - 1.5rem), (max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) 500px, 600px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
