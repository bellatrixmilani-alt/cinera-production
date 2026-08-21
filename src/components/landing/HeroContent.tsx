'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import AuthModal from '@/components/auth/AuthModal';

export default function HeroContent() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setAuthMode('signin');
    setIsAuthOpen(true);
  };

  const handleStepInside = () => {
    router.push('/onboarding');
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 my-auto">
        {/* Main Title */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif tracking-[0.15em] text-[#3D2B1F] uppercase font-medium mb-3 select-none">
          CINERA AI
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-serif italic text-[#3D2B1F]/90 font-normal mb-2 tracking-wide">
          The Haven for Your Story
        </h2>

        {/* Mission Statement */}
        <p className="text-xs sm:text-sm text-[#6B5546] max-w-md leading-relaxed font-sans mb-6 tracking-wide">
          Create without chaos. A workspace designed for calm, beauty and brilliance.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleStepInside}
            className="bg-[#3D2B1F] hover:bg-[#2B1F16] text-[#FAF6F0] px-9 py-3.5 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer hover:scale-102"
          >
            <span>STEP INSIDE</span>
            <span className="text-sm">→</span>
          </button>
          
          <button
            onClick={openSignIn}
            className="border border-[#3D2B1F]/80 text-[#3D2B1F] hover:bg-[#3D2B1F]/10 px-9 py-3.5 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
          >
            SIGN IN
          </button>
        </div>
      </section>

      {/* Auth Modal with Connected Toggle State */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}