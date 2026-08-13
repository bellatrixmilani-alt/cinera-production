import React from 'react';

export default function HeroSection() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-6 pb-10 flex flex-col items-center">
      {/* Top Header Toggles: About & Settings */}
      <header className="w-full flex justify-between items-center mb-16 text-xs font-sans tracking-widest text-[#6B5546] uppercase">
        <button className="hover:text-[#3D2B1F] transition-colors duration-200 cursor-pointer">
          ABOUT
        </button>
        <button className="hover:text-[#3D2B1F] transition-colors duration-200 cursor-pointer flex items-center gap-1">
          <span>SETTINGS</span>
        </button>
      </header>

      {/* Hero Content */}
      <section className="flex flex-col items-center justify-center text-center max-w-3xl">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-serif tracking-[0.15em] text-[#3D2B1F] uppercase font-medium mb-4">
          CINERA AI
        </h1>

        {/* Mission / Tagline */}
        <h2 className="text-xl md:text-2xl font-serif italic text-[#3D2B1F]/90 font-normal mb-3">
          The Haven for Your Story
        </h2>
        <p className="text-xs md:text-sm text-[#6B5546] max-w-md leading-relaxed font-sans mb-10">
          Create without chaos. A workspace designed for calm, beauty and brilliance.
        </p>

        {/* Single Start Action Button */}
        <button className="bg-[#3D2B1F] hover:bg-[#2B1F16] text-[#FAF6F0] px-8 py-3 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer">
          <span>STEP INSIDE</span>
          <span className="text-sm">→</span>
        </button>
      </section>
    </div>
  );
}