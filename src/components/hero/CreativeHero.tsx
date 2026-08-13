'use client';

import React, { useState } from 'react';

interface CreativeHeroProps {
  userName?: string;
  onOpenOverwhelmed: () => void;
}

export default function CreativeHero({ userName = 'Winner', onOpenOverwhelmed }: CreativeHeroProps) {
  const [prompt, setPrompt] = useState('');

  return (
    <section className="w-full max-w-4xl mx-auto px-6 pt-10 pb-12 text-center flex flex-col items-center">
      {/* Good Morning Header */}
      <span className="text-xs font-sans tracking-[0.25em] uppercase text-[#806F62] mb-2 font-medium">
        Good morning, {userName}
      </span>

      {/* Large Serif Title */}
      <h1 className="text-4xl sm:text-6xl font-serif text-[#3D2B1F] font-normal tracking-tight mb-3 select-none">
        What are we creating today?
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm font-sans text-[#806F62] max-w-md mb-8 tracking-wide">
        Turn a thought, feeling, or unfinished idea into something worth making.
      </p>

      {/* Writer's Desk Vision Box */}
      <div className="w-full max-w-2xl relative bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="&quot;I want to make a nostalgic short film about...&quot;"
          className="w-full bg-transparent text-sm sm:text-base font-serif text-[#3D2B1F] placeholder-[#806F62]/50 focus:outline-none resize-none leading-relaxed"
        />

        <div className="flex justify-between items-center pt-4 border-t border-[#D9CEC1]/40 mt-2">
          <span className="text-[10px] font-sans tracking-wider text-[#806F62]">
            PAPER DESK CANCER • READY
          </span>

          <div className="flex items-center gap-3">
            <button className="text-[#806F62] hover:text-[#3D2B1F] text-sm p-1.5 rounded-full hover:bg-[#F7F2EB] transition-colors cursor-pointer">
              🎙
            </button>
            <button className="bg-[#3D2B1F] hover:bg-[#171310] text-[#FAF6F0] px-5 py-2 rounded-full text-xs font-sans tracking-[0.15em] uppercase transition-all duration-200 flex items-center gap-1.5 shadow-xs cursor-pointer">
              <span>✦</span>
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emotional Help Pill */}
      <div className="mt-6">
        <button
          onClick={onOpenOverwhelmed}
          className="text-xs font-sans text-[#806F62] hover:text-[#3D2B1F] bg-[#FBF8F3]/80 border border-[#D9CEC1]/60 px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
        >
          <span>Feeling stuck?</span>
          <span className="text-[#3D2B1F] font-medium underline">I'm overwhelmed →</span>
        </button>
      </div>
    </section>
  );
}