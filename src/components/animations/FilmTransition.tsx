'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilmTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function FilmTransition({ isActive, onComplete }: FilmTransitionProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
          onAnimationComplete={onComplete}
          className="fixed inset-0 z-[100] bg-[#171310] flex flex-col justify-between py-4 pointer-events-none shadow-2xl"
        >
          {/* Top Film Sprockets */}
          <div className="w-full flex justify-between px-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-4 h-6 bg-[#FAF6F0]/20 rounded-xs" />
            ))}
          </div>

          {/* Center Sound Track Lines */}
          <div className="w-full border-t border-b border-[#FAF6F0]/10 py-2 flex justify-center items-center">
            <span className="text-[10px] font-mono tracking-[0.5em] text-[#FAF6F0]/40 uppercase">
              CINERA FILM FRAME • 35MM
            </span>
          </div>

          {/* Bottom Film Sprockets */}
          <div className="w-full flex justify-between px-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-4 h-6 bg-[#FAF6F0]/20 rounded-xs" />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}