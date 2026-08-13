'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VideoStudioProps {
  onOpen: () => void;
}

export default function VideoStudio({ onOpen }: VideoStudioProps) {
  return (
    <motion.div
      onClick={onOpen}
      whileHover={{ scale: 1.01 }}
      className="group relative bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full overflow-hidden"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#806F62] uppercase font-bold">
            🎬 VIDEO STUDIO
          </span>
          <span className="text-[10px] font-sans text-[#806F62]">Last edited • 12 min ago</span>
        </div>
        <p className="text-xs font-sans text-[#806F62] mb-4">Turn an idea into moving images.</p>
      </div>

      {/* Cinematic Preview Box */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#171310] flex items-center justify-center my-2">
        {/* Subtle Ambient Film Loop Simulation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3D2B1F] via-[#806F62]/40 to-[#171310] opacity-80 animate-pulse" />
        <div className="absolute inset-0 ambient-grain pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF6F0]/20 backdrop-blur-md border border-[#FAF6F0]/40 flex items-center justify-center text-[#FAF6F0] pl-0.5 group-hover:scale-110 transition-transform duration-300">
            ▶
          </div>
          <span className="text-[10px] font-serif italic text-[#FAF6F0]/80 mt-2 tracking-wide">
            Nairobi Nights • Preview
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-xs font-serif italic text-[#3D2B1F] font-medium">Nairobi Nights</span>
        <span className="text-xs font-sans tracking-widest uppercase text-[#3D2B1F] group-hover:translate-x-1 transition-transform">
          Open Studio →
        </span>
      </div>
    </motion.div>
  );
}