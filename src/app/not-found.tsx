'use client';

import React from 'react';
import Link from 'next/link';
import FlowerDoodle from '@/components/ui/FlowerDoodle';

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="w-full max-w-md bg-[#EADBC8]/70 border-2 border-[#8C4A27]/25 rounded-[32px] p-8 shadow-xl flex flex-col items-center gap-4 relative z-10 backdrop-blur-xs">
        
        <div className="w-14 h-14 rounded-2xl bg-[#FAF6F0] border border-[#8C4A27]/20 flex items-center justify-center text-2xl shadow-xs">
          🎬
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C4A27] font-bold block">
            404 • UNCHARTED SCENE
          </span>
          <h2 className="text-xl font-serif font-bold text-[#241711]">
            Page Not Found
          </h2>
          <p className="text-xs font-serif text-[#8C4A27] leading-relaxed">
            This room or tool doesn't exist in the Cinera workspace. Let's get you back to your production hub.
          </p>
        </div>

        <Link
          href="/studio"
          className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs text-center mt-2"
        >
          Back to Studio →
        </Link>
      </div>
    </div>
  );
}