'use client';

import React from 'react';

export default function ShotListLoading() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] p-5 sm:p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-[#8C4A27]/15">
        <div className="w-48 h-8 bg-[#EADBC8] rounded-xl" />
        <div className="w-36 h-10 bg-[#EADBC8] rounded-xl" />
      </div>

      <div className="w-full h-36 bg-[#EADBC8]/70 rounded-[28px]" />

      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-36 bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-[24px] p-5 space-y-3">
            <div className="w-1/3 h-5 bg-[#EADBC8] rounded-md" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-14 bg-[#EADBC8]/50 rounded-xl" />
              <div className="h-14 bg-[#EADBC8]/50 rounded-xl" />
              <div className="h-14 bg-[#EADBC8]/50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}