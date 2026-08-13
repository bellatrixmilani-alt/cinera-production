'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MoodboardProps {
  onOpen: () => void;
}

export default function Moodboard({ onOpen }: MoodboardProps) {
  return (
    <motion.div
      onClick={onOpen}
      whileHover="hover"
      className="group relative bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full overflow-hidden"
    >
      <div>
        <span className="text-[10px] font-sans tracking-[0.25em] text-[#806F62] uppercase font-bold block mb-1">
          🎨 MOODBOARD
        </span>
        <p className="text-xs font-serif italic text-[#3D2B1F]">warm • nostalgic • intimate</p>
      </div>

      {/* Collapsing / Separating Collages */}
      <div className="relative w-full h-36 my-2 flex items-center justify-center">
        {/* Image 1 */}
        <motion.div
          variants={{ hover: { x: -28, rotate: -6 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute w-20 h-24 bg-[#D9CEC1] rounded-xl border-2 border-[#FBF8F3] shadow-md -rotate-3 overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-br from-[#806F62] to-[#3D2B1F]" />
        </motion.div>

        {/* Image 2 */}
        <motion.div
          variants={{ hover: { x: 28, rotate: 6 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute w-20 h-24 bg-[#D9CEC1] rounded-xl border-2 border-[#FBF8F3] shadow-md rotate-2 overflow-hidden z-10"
        >
          <div className="w-full h-full bg-gradient-to-br from-[#3D2B1F] to-[#171310]" />
        </motion.div>

        {/* Image 3 Center */}
        <motion.div
          variants={{ hover: { y: -10, scale: 1.05 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute w-22 h-26 bg-[#F7F2EB] rounded-xl border-2 border-[#FBF8F3] shadow-lg z-20 flex items-center justify-center"
        >
          <span className="text-xs font-serif italic text-[#3D2B1F]">+12</span>
        </motion.div>
      </div>

      <span className="text-[10px] font-sans tracking-widest text-[#806F62] uppercase text-right block">
        Explore Canvas →
      </span>
    </motion.div>
  );
}