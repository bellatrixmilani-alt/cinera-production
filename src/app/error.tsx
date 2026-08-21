'use client';

import React, { useEffect } from 'react';
import FlowerDoodle from '@/components/ui/FlowerDoodle';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime Studio Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="w-full max-w-md bg-[#EADBC8]/70 border-2 border-[#8C4A27]/25 rounded-[32px] p-8 shadow-xl flex flex-col items-center gap-4 relative z-10 backdrop-blur-xs">
        
        <div className="w-14 h-14 rounded-2xl bg-[#FAF6F0] border border-[#8C4A27]/20 flex items-center justify-center shadow-xs">
          <FlowerDoodle size={28} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C4A27] font-bold block">
            INTERRUPTION DETECTED
          </span>
          <h2 className="text-xl font-serif font-bold text-[#241711]">
            The Studio Hit a Snag
          </h2>
          <p className="text-xs font-serif text-[#8C4A27] leading-relaxed">
            We ran into an unexpected hiccup while rendering this session. Your saved drafts and sparks are secure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
          <button
            onClick={() => reset()}
            className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            ↻ Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/studio')}
            className="w-full bg-[#FAF6F0] hover:bg-[#EADBC8] text-[#6B4426] border border-[#8C4A27]/20 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
}