'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShotCard {
  id: number;
  title: string;
  lens: string;
  duration: string;
  movement: string;
}

export default function ShotListWidget() {
  const router = useRouter();

  const [shots, setShots] = useState<ShotCard[]>([
    {
      id: 1,
      title: 'GOLDEN BREEZE',
      lens: 'Use background blur (portrait mode)',
      duration: 'Record 5-7 second tight moments feel more cinematic',
      movement: "Let's the character small movements create emotion",
    },
    {
      id: 2,
      title: 'COASTAL SUNRISE',
      lens: '35mm Prime • f/1.8 aperture',
      duration: '4 seconds slow-motion pan',
      movement: 'Tracking light reflections on water',
    },
  ]);

  // Read saved active blueprint cards from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cinera_recent_shots');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) setShots(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const latestShot = shots[0];

  return (
    <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] flex flex-col justify-between h-full relative overflow-hidden font-sans">
      <div>
        {/* Widget Header */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black">
            🎬 RECENT SHOT BLUEPRINT
          </span>
          <button
            onClick={() => router.push('/studio/shot-list')}
            className="text-[10px] font-sans text-[#241711] font-black underline hover:text-[#8C4A27] transition-colors cursor-pointer"
          >
            Open Blueprint Studio →
          </button>
        </div>

        <p className="text-xs font-serif italic text-[#8C4A27] mb-3">
          Active camera direction on your desk
        </p>

        {/* Active Shot Card Preview */}
        {latestShot ? (
          <div
            onClick={() => router.push('/studio/shot-list')}
            className="bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Top Rounded Header Badge */}
            <div className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl py-1.5 px-3 mb-2.5 text-center flex items-center justify-center gap-1.5 shadow-2xs">
              <span className="text-xs">🌿</span>
              <span className="text-xs font-serif font-bold text-[#6B4426] tracking-wider uppercase truncate">
                {latestShot.title}
              </span>
            </div>

            {/* Spec Details */}
            <div className="space-y-1.5 text-[11px] font-serif">
              <div className="flex items-start gap-2">
                <span className="text-xs text-[#6B4426]">🎥</span>
                <p className="text-[#6B5546] truncate">
                  <strong className="text-[#6B4426] font-sans text-[9px] uppercase tracking-wider mr-1">LENS:</strong>
                  {latestShot.lens}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-xs text-[#6B4426]">⏱</span>
                <p className="text-[#6B5546] truncate">
                  <strong className="text-[#6B4426] font-sans text-[9px] uppercase tracking-wider mr-1">DURATION:</strong>
                  {latestShot.duration}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-xs text-[#6B4426]">🎬</span>
                <p className="text-[#6B5546] truncate">
                  <strong className="text-[#6B4426] font-sans text-[9px] uppercase tracking-wider mr-1">MOVEMENT:</strong>
                  {latestShot.movement}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => router.push('/studio/shot-list')}
            className="bg-[#F5ECE1]/60 border border-dashed border-[#8C4A27]/30 rounded-2xl p-6 text-center cursor-pointer hover:border-[#8C4A27]"
          >
            <span className="text-xs font-serif italic text-[#8C4A27]">
              + Click to create your first camera shot card
            </span>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="pt-2 border-t-2 border-dashed border-[#8C4A27]/25 flex justify-between items-center text-[10px] font-sans text-[#8C4A27] font-black">
        <span>{shots.length} Active Shot Cards</span>
        <span className="group-hover:translate-x-1 transition-transform">Customize Shots →</span>
      </div>
    </div>
  );
}