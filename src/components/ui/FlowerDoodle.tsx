'use client';

import React from 'react';

export interface FlowerDoodleProps {
  className?: string;
  size?: number;
  colorFill?: string;
  colorLine?: string;
  colorInner?: string;
  colorCenter?: string;
  strokeColor?: string;
  opacity?: number;
}

export default function FlowerDoodle({
  className = '',
  size = 64,
  colorFill = '#E098A0',
  colorLine,
  colorInner,
  colorCenter = '#A84B56',
  strokeColor = '#FAF6F0',
  opacity = 0.95,
}: FlowerDoodleProps) {
  // Support both colorLine and colorInner seamlessly
  const innerTone = colorInner || colorLine || '#C46D77';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: size, minHeight: size }}
      className={`pointer-events-none select-none inline-block ${className}`}
    >
      <g opacity={opacity}>
        {/* Soft Outer Petals with Crisp Border */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={`outer-${i}`}
            cx="60"
            cy="30"
            rx="15"
            ry="24"
            fill={colorFill}
            stroke={strokeColor}
            strokeWidth="3"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}

        {/* Inner Painted Accent Layer */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
          <ellipse
            key={`inner-${i}`}
            cx="60"
            cy="38"
            rx="9"
            ry="16"
            fill={innerTone}
            opacity="0.8"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}

        {/* Center Core */}
        <circle
          cx="60"
          cy="60"
          r="14"
          fill={colorCenter}
          stroke={strokeColor}
          strokeWidth="2.5"
        />
        <circle cx="57" cy="57" r="4" fill={strokeColor} opacity="0.45" />
      </g>
    </svg>
  );
}