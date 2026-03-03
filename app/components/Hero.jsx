"use client";

import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-[#FFF6EB]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      >
        <source src="/banner-video.mp4" type="video/mp4" />
        <img 
          src="/images/banner.svg" 
          alt="Hero Banner" 
          className="w-full h-full object-cover"
        />
      </video>
    </section>
  );
};

export default Hero;
