'use client';

import React from 'react';

export default function StudioLoading() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] p-5 sm:p-8 flex flex-col justify-between max-w-5xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#EADBC8] rounded-2xl border border-[#8C4A27]/15" />
          <div className="space-y-1.5">
            <div className="w-24 h-3 bg-[#EADBC8] rounded-md" />
            <div className="w-44 h-5 bg-[#EADBC8] rounded-md" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-28 h-10 bg-[#EADBC8] rounded-xl" />
          <div className="w-10 h-10 bg-[#EADBC8] rounded-xl" />
        </div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="w-full h-44 bg-[#EADBC8]/70 border border-[#8C4A27]/20 rounded-[28px] my-6" />

      {/* Tool Pills Skeleton */}
      <div className="flex gap-2 pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-24 h-9 bg-[#EADBC8]/60 rounded-xl" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        <div className="lg:col-span-5 h-64 bg-[#EADBC8]/60 rounded-2xl" />
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#EADBC8]/60 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}