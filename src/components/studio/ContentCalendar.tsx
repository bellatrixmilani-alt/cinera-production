'use client';

import React from 'react';

export default function ContentCalendar() {
  const days = [
    { num: 12, title: 'MON' },
    { num: 13, title: 'TUE', event: '🎬 Film Day' },
    { num: 14, title: 'WED' },
    { num: 15, title: 'THU', event: '🎨 Moodboard' },
    { num: 16, title: 'FRI', event: '📱 Reel' },
  ];

  return (
    <div className="bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <span className="text-[10px] font-sans tracking-[0.25em] text-[#806F62] uppercase font-bold block mb-3">
          📅 AUGUST PRODUCTION BOARD
        </span>

        {/* Minimal Timeline */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {days.map((day) => (
            <div
              key={day.num}
              className="group relative bg-[#F7F2EB] border border-[#D9CEC1]/40 rounded-xl p-2 min-h-[70px] flex flex-col justify-between hover:border-[#3D2B1F] transition-colors cursor-pointer"
            >
              <span className="text-[9px] font-sans font-medium text-[#806F62]">{day.title}</span>
              <span className="text-sm font-serif font-bold text-[#3D2B1F]">{day.num}</span>
              <span className="text-[9px] font-sans text-[#3D2B1F] truncate">{day.event || ''}</span>

              {/* Hover Timeline Card */}
              {day.num === 16 && (
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-[#171310] text-[#FAF6F0] rounded-xl p-3 shadow-xl z-30 text-left pointer-events-none">
                  <span className="text-[9px] font-sans text-[#806F62] uppercase block">CINEMATIC REEL</span>
                  <p className="text-xs font-serif italic text-[#FAF6F0] mb-1">"Nairobi Nights"</p>
                  <span className="text-[9px] font-sans text-emerald-400 block">🎥 Ready to publish</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}