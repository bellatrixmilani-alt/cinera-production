'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

interface ShotCard {
  id: number;
  title: string;
  lens: string;
  duration: string;
  movement: string;
  isAiElevated?: boolean;
}

export default function ShotListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Playful Tonal Palette for Shot Cards
  const cardTones = [
    { bg: '#EADBC8', border: '#8C4A27/35', tagBg: '#FAF6F0', rotation: '-rotate-1' },
    { bg: '#DFCEB9', border: '#8C4A27/35', tagBg: '#FAF6F0', rotation: 'rotate-1' },
    { bg: '#F2E8DC', border: '#8C4A27/35', tagBg: '#FAF6F0', rotation: '-rotate-2' },
  ];

  // Shot Cards State
  const [shots, setShots] = useState<ShotCard[]>([
    {
      id: 1,
      title: 'GOLDEN BREEZE',
      lens: 'Use background blur (portrait mode)',
      duration: 'Record 5-7 second tight moments feel more cinematic',
      movement: "Let's the character small movements create emotion",
    },
    {
      id: 2,
      title: 'COASTAL SUNRISE',
      lens: '35mm Prime • f/1.8 aperture',
      duration: '4 seconds slow-motion pan',
      movement: 'Tracking light reflections on water',
    },
  ]);

  // Input Dock State
  const [newTitle, setNewTitle] = useState('');

  // Load incoming concept or saved shots
  useEffect(() => {
    const incomingConcept = searchParams.get('concept');
    if (incomingConcept) {
      setNewTitle(incomingConcept);
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cinera_recent_shots');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) setShots(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [searchParams]);

  // Helper to persist shots so Studio Desk widget updates instantly
  const updateShotsAndStore = (updatedShots: ShotCard[]) => {
    setShots(updatedShots);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_recent_shots', JSON.stringify(updatedShots));
    }
  };

  // 1. MANUAL CREATE: Add Card Immediately on Enter or Click
  const handleAddManualShot = () => {
    if (!newTitle.trim()) return;
    const newCard: ShotCard = {
      id: Date.now(),
      title: newTitle.toUpperCase().trim(),
      lens: 'Click to add lens details (e.g. 50mm portrait mode)...',
      duration: 'Click to set duration (e.g. 5-7 seconds)...',
      movement: 'Click to describe camera movement...',
    };
    const updated = [newCard, ...shots];
    updateShotsAndStore(updated);
    setNewTitle('');
  };

  // 2. OPTIONAL AI ELEVATE: Suggest Lens & Movement for a Single Card
  const handleAiElevateSingleCard = (id: number) => {
    const updated = shots.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          lens: '50mm Anamorphic • Deep subject separation & warm bokeh',
          duration: 'Record 6-8 seconds to allow room for cinematic pacing',
          movement: 'Slow handheld push-in toward subject eyes to build emotion',
          isAiElevated: true,
        };
      }
      return s;
    });
    updateShotsAndStore(updated);
  };

  // 3. MANUAL EDIT FIELD IN CARD
  const handleUpdateField = (id: number, field: 'lens' | 'duration' | 'movement', value: string) => {
    const updated = shots.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    updateShotsAndStore(updated);
  };

  // Delete Card
  const handleDeleteCard = (id: number) => {
    const updated = shots.filter((s) => s.id !== id);
    updateShotsAndStore(updated);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5ECE1] text-[#241711] p-6 sm:p-10 font-sans relative overflow-x-hidden">
      
      {/* 01 — HEADER BAR (Clean Bold Head Title Font) */}
      <header className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-dashed border-[#8C4A27]/25">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/studio')}
            className="w-11 h-11 rounded-full bg-[#EADBC8] border-2 border-[#8C4A27]/30 hover:bg-[#DFCEB9] flex items-center justify-center text-sm font-bold text-[#241711] transition-transform hover:-translate-x-1 cursor-pointer shadow-2xs font-sans"
          >
            ←
          </button>
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black block mb-1">
              DIRECTOR'S CUT • SHOT BLUEPRINT
            </span>
            {/* CLEAN BOLD SERIF TITLE */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#241711] tracking-tight mt-0.5">
              Cinematic Shot Blueprint
            </h1>
          </div>
        </div>

        {/* Counter & Action */}
        <div className="flex items-center gap-3">
          <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/30 rounded-2xl px-5 py-2.5 text-xs font-sans font-black text-[#6B4426] shadow-2xs">
            🎬 {shots.length} {shots.length === 1 ? 'Shot Planned' : 'Shots Planned'}
          </div>
          <button
            onClick={() => updateShotsAndStore([])}
            className="text-xs font-sans text-[#8C4A27] hover:text-[#241711] font-bold underline cursor-pointer"
          >
            Clear Board
          </button>
        </div>
      </header>

      {/* 02 — USABLE CHATBOX INPUT DOCK (Light Underline / Border on Pill) */}
      <section className="w-full max-w-3xl mx-auto mb-10">
        <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-2.5 pl-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.3)] transition-all flex items-center gap-3">
          <span className="text-lg text-[#8C4A27]">🌿</span>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddManualShot()}
            placeholder="Type your shot title (e.g. 'Golden Breeze' or 'Coffee Pour') and press Enter..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none"
          />

          <button
            onClick={handleAddManualShot}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-6 py-2.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-all shadow-sm cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>+</span>
            <span>Add Shot Card</span>
          </button>
        </div>
        <p className="text-[11px] font-sans text-[#8C4A27] text-center mt-3 font-bold">
          Type a title to create your own card. All details are editable directly inside each card!
        </p>
      </section>

      {/* 03 — SHOT CARDS GRID */}
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <AnimatePresence>
          {shots.map((shot, idx) => {
            const tone = cardTones[idx % cardTones.length];

            return (
              <motion.div
                key={shot.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ backgroundColor: tone.bg }}
                className={`border-2 border-[#8C4A27]/35 rounded-[36px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.3)] transition-all flex flex-col justify-between relative group ${tone.rotation}`}
              >
                {/* Delete Trigger */}
                <button
                  onClick={() => handleDeleteCard(shot.id)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#6B4426] text-[#FAF6F0] hover:bg-[#8C4A27] flex items-center justify-center text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shadow-2xs"
                >
                  ✕
                </button>

                <div>
                  {/* Light Header Badge on Pill */}
                  <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-2xl py-2.5 px-4 mb-6 text-center shadow-2xs flex items-center justify-center gap-2">
                    <span className="text-sm">🌿</span>
                    <input
                      type="text"
                      value={shot.title}
                      onChange={(e) => {
                        const updatedTitle = e.target.value.toUpperCase();
                        handleUpdateField(shot.id, 'title' as any, updatedTitle);
                      }}
                      className="text-xs sm:text-sm font-serif font-bold text-[#6B4426] tracking-wider uppercase bg-transparent text-center focus:outline-none w-full"
                    />
                  </div>

                  {/* Specs List with Editable Textareas */}
                  <div className="space-y-4 font-sans text-xs">
                    
                    {/* LENS */}
                    <div className="flex items-start gap-3">
                      <span className="text-base text-[#6B4426] mt-0.5">🎥</span>
                      <div className="flex-1">
                        <span className="font-serif font-bold text-[#6B4426] uppercase tracking-wider block text-[10px] mb-0.5">
                          LENS
                        </span>
                        <textarea
                          rows={2}
                          value={shot.lens}
                          onChange={(e) => handleUpdateField(shot.id, 'lens', e.target.value)}
                          className="w-full bg-transparent text-[#6B5546] font-serif leading-relaxed text-xs focus:bg-[#FAF6F0] focus:p-1.5 focus:rounded-xl focus:outline-none resize-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* DURATION */}
                    <div className="flex items-start gap-3">
                      <span className="text-base text-[#6B4426] mt-0.5">⏱</span>
                      <div className="flex-1">
                        <span className="font-serif font-bold text-[#6B4426] uppercase tracking-wider block text-[10px] mb-0.5">
                          DURATION
                        </span>
                        <textarea
                          rows={2}
                          value={shot.duration}
                          onChange={(e) => handleUpdateField(shot.id, 'duration', e.target.value)}
                          className="w-full bg-transparent text-[#6B5546] font-serif leading-relaxed text-xs focus:bg-[#FAF6F0] focus:p-1.5 focus:rounded-xl focus:outline-none resize-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* MOVEMENT */}
                    <div className="flex items-start gap-3">
                      <span className="text-base text-[#6B4426] mt-0.5">🎬</span>
                      <div className="flex-1">
                        <span className="font-serif font-bold text-[#6B4426] uppercase tracking-wider block text-[10px] mb-0.5">
                          MOVEMENT
                        </span>
                        <textarea
                          rows={2}
                          value={shot.movement}
                          onChange={(e) => handleUpdateField(shot.id, 'movement', e.target.value)}
                          className="w-full bg-transparent text-[#6B5546] font-serif leading-relaxed text-xs focus:bg-[#FAF6F0] focus:p-1.5 focus:rounded-xl focus:outline-none resize-none transition-all font-medium"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Footer: Optional AI Elevate Button */}
                <div className="pt-4 border-t-2 border-dashed border-[#8C4A27]/20 mt-6 flex justify-between items-center text-[10px] font-sans font-black">
                  {shot.isAiElevated ? (
                    <span className="text-[#8C4A27] tracking-wider uppercase">
                      ✦ AI Enhanced
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAiElevateSingleCard(shot.id)}
                      className="text-[#6B4426] hover:text-[#8C4A27] transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider bg-[#FAF6F0] px-3 py-1 rounded-xl border border-[#8C4A27]/20 shadow-2xs hover:scale-105"
                    >
                      <span>✦</span>
                      <span>Elevate with AI</span>
                    </button>
                  )}

                  <span className="text-[#8C4A27]/70 font-mono text-[9px]">
                    ID: #{shot.id.toString().slice(-4)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>
    </div>
  );
}