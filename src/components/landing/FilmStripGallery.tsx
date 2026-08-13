'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FilmstripGallery() {
  return (
    <div className="w-full overflow-hidden py-4 relative bg-transparent select-none">
      {/* Continuous Carousel Loop */}
      <motion.div
        className="flex whitespace-nowrap gap-6 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 20, // Continuous smooth carousel motion
        }}
      >
        {/* Carousel Set 1 */}
        <div className="flex gap-6 items-center shrink-0">
          <img
            src="/filmstrip-full.png"
            alt="Cinera Filmstrip Frame Reel"
            className="h-28 sm:h-36 object-contain drop-shadow-xs"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Carousel Set 2 (Seamless Mirror to fill space as Set 1 exits) */}
        <div className="flex gap-6 items-center shrink-0">
          <img
            src="/filmstrip-full.png"
            alt="Cinera Filmstrip Frame Reel Loop"
            className="h-28 sm:h-36 object-contain drop-shadow-xs"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Carousel Set 3 (Guarantees zero blank gaps on wide displays) */}
        <div className="flex gap-6 items-center shrink-0">
          <img
            src="/filmstrip-full.png"
            alt="Cinera Filmstrip Frame Reel Loop Overflow"
            className="h-28 sm:h-36 object-contain drop-shadow-xs"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}