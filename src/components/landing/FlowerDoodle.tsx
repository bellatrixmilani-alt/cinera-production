'use client';

import React from 'react';

interface FlowerDoodleProps {
  className?: string;
  size?: number;
  colorFill?: string;
  colorLine?: string;
}

export default function FlowerDoodle({
  className = '',
  size = 64,
  colorFill = '#D8C3B0',
  colorLine = '#EADBC8',
}: FlowerDoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Soft Filled Petal Silhouette */}
      <g opacity="0.35" fill={colorFill}>
        <path d="M50 50 C40 20, 60 20, 50 50 Z" />
        <path d="M50 50 C70 30, 80 50, 50 50 Z" />
        <path d="M50 50 C70 70, 50 80, 50 50 Z" />
        <path d="M50 50 C30 80, 20 60, 50 50 Z" />
        <path d="M50 50 C20 40, 30 20, 50 50 Z" />
      </g>
      {/* Loose Hand-Drawn Outline Layer Offset */}
      <g stroke={colorLine} strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
        <path d="M48 48 C35 15, 62 18, 48 48 C75 25, 82 52, 48 48 C72 72, 48 85, 48 48 C22 78, 15 52, 48 48 C18 35, 32 15, 48 48 Z" />
      </g>
    </svg>
  );
}