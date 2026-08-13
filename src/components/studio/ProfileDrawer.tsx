'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNameChange: (newName: string) => void;
}

export default function ProfileDrawer({ isOpen, onClose, onNameChange }: ProfileDrawerProps) {
  const [preferredName, setPreferredName] = useState('Winnie');
  const [primaryGenre, setPrimaryGenre] = useState('Travel Content');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('cinera_user_name');
      if (storedName) setPreferredName(storedName);

      const storedGenre = localStorage.getItem('cinera_primary_genre');
      if (storedGenre) setPrimaryGenre(storedGenre);
    }
  }, [isOpen]);

  const handleSaveProfile = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_user_name', preferredName);
      localStorage.setItem('cinera_primary_genre', primaryGenre);
    }
    onNameChange(preferredName);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#241711]/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#EADBC8] border-l-2 border-[#8C4A27]/40 h-full p-8 shadow-[ -10px_0px_20px_0px_rgba(140,74,39,0.2) ] z-10 flex flex-col justify-between font-sans overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-6 border-b-2 border-dashed border-[#8C4A27]/25 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6B4426] text-[#FAF6F0] flex items-center justify-center font-serif text-base font-bold shadow-2xs">
                    W
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#241711]">Creator Settings</h2>
                    <span className="text-[10px] font-sans font-bold text-[#8C4A27]">Personalize Cinera</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F5ECE1] border border-[#8C4A27]/20 flex items-center justify-center text-xs font-black text-[#8C4A27] hover:text-[#241711] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-6">
                {/* 01. How AI Addresses You */}
                <div>
                  <label className="block text-xs font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-2">
                    How Should Cinera Address You?
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. Winnie, Director, Winner..."
                    className="w-full bg-[#F5ECE1] border-2 border-[#8C4A27]/25 rounded-2xl px-4 py-3 text-sm font-serif text-[#241711] focus:outline-none focus:border-[#8C4A27]"
                  />
                  <p className="text-[11px] font-sans text-[#8C4A27]/70 italic mt-1.5 font-medium">
                    "Good morning, {preferredName || 'Winnie'}."
                  </p>
                </div>

                {/* 02. Creative Niche / Focus */}
                <div>
                  <label className="block text-xs font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-2">
                    Primary Creative Focus
                  </label>
                  <select
                    value={primaryGenre}
                    onChange={(e) => setPrimaryGenre(e.target.value)}
                    className="w-full bg-[#F5ECE1] text-[#241711] text-xs font-sans font-bold px-4 py-3 rounded-2xl border-2 border-[#8C4A27]/25 focus:outline-none cursor-pointer uppercase tracking-wider"
                  >
                    <option value="Travel Content">✈️ Travel Content & Vignettes</option>
                    <option value="Cinematic Vlogs">🎬 Cinematic Vlogs & Storytelling</option>
                    <option value="Product Design">🎨 Product Design & UI/UX Case Studies</option>
                    <option value="Brand Identity">🏷️ Brand Identity & Editorial Campaigns</option>
                    <option value="Tech & Engineering">⚡ Tech & Digital Systems</option>
                  </select>
                </div>

                {/* Status Indicator */}
                {savedSuccess && (
                  <div className="bg-[#FAF6F0] border border-[#8C4A27]/30 text-[#6B4426] p-3 rounded-2xl text-xs font-sans font-bold flex items-center gap-2">
                    <span>✨</span>
                    <span>Profile saved! Greeting updated.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t-2 border-dashed border-[#8C4A27]/25">
              <button
                onClick={handleSaveProfile}
                className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-all cursor-pointer shadow-md hover:scale-102"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}