'use client';

import React from 'react';

export default function FlowerAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Top Right Large Atmospheric Bloom */}
      <svg
        className="absolute -top-16 -right-16 w-[480px] h-[480px] opacity-20 text-[#E098A0] blur-[1px] transform rotate-12"
        viewBox="0 0 120 120"
        fill="currentColor"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx="60"
            cy="28"
            rx="16"
            ry="28"
            fill="currentColor"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="16" fill="#C46D77" />
      </svg>

      {/* Bottom Left Deep Warm Bloom */}
      <svg
        className="absolute -bottom-24 -left-20 w-[520px] h-[520px] opacity-15 text-[#D57A83] blur-[2px] transform -rotate-12"
        viewBox="0 0 120 120"
        fill="currentColor"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx="60"
            cy="28"
            rx="16"
            ry="28"
            fill="currentColor"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}
      </svg>

      {/* Subtle Warm Ambient Glow In Center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#EADBC8]/40 rounded-full blur-3xl" />
    </div>
  );
}