'use client';

import React from 'react';
import FlowerDoodle from '@/components/ui/FlowerDoodle';

export default function Loading() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] flex flex-col items-center justify-center relative overflow-hidden z-20">
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-[#EADBC8] border border-[#8C4A27]/25 flex items-center justify-center shadow-md animate-pulse">
            <FlowerDoodle size={36} />
          </div>
          <div className="absolute inset-0 rounded-3xl border border-[#8C4A27]/30 animate-ping opacity-40" />
        </div>

        <div className="space-y-1 mt-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C4A27] font-bold block">
            CINERA STUDIO
          </span>
          <h2 className="text-lg font-serif font-bold text-[#241711]">
            Entering Your Haven...
          </h2>
          <p className="text-xs font-serif text-[#8C4A27]/80 italic">
            Gathering your concepts, scenes, and production rhythm.
          </p>
        </div>
      </div>
    </div>
  );
}