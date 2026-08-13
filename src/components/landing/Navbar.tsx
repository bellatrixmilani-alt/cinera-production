'use client';

import React, { useState } from 'react';
import AboutModal from '@/components/navigation/AboutModal';
import SettingsModal from '@/components/navigation/SettingsModal';

export default function LandingNavbar() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="w-full max-w-6xl mx-auto px-6 pt-6 pb-2 flex justify-between items-center text-xs font-sans tracking-[0.25em] text-[#6B5546] uppercase font-medium">
        <button
          onClick={() => setIsAboutOpen(true)}
          className="hover:text-[#3D2B1F] transition-colors duration-200 cursor-pointer"
        >
          ABOUT
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hover:text-[#3D2B1F] transition-colors duration-200 cursor-pointer"
        >
          SETTINGS
        </button>
      </header>

      {/* Navigation Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}