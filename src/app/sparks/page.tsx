'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSparks, saveSpark, SparkItem } from '../../lib/sparks';

export default function SparksPage() {
  const router = useRouter();

  const [sparks, setSparks] = useState<SparkItem[]>([]);
  const [newSparkText, setNewSparkText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Raw Spark');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Playful Tonal Palette for Spark Cards with Soft Warm Brown Outlines
  const cardTones = [
    { bg: '#F2E8DC', border: '#CBB499', tagBg: '#E4D3C0', rotation: '-rotate-2' },
    { bg: '#EADBC8', border: '#BCA488', tagBg: '#DAC2A7', rotation: 'rotate-1' },
    { bg: '#DFCEB9', border: '#A88D70', tagBg: '#CDB498', rotation: '-rotate-1' },
    { bg: '#FAF2E8', border: '#D8C5B0', tagBg: '#EFE1D0', rotation: 'rotate-2' },
    { bg: '#E5D6C5', border: '#B8A087', tagBg: '#D5C3AE', rotation: '-rotate-3' },
  ];

  // Playful Stickers/Emojis
  const stickers = ['💡', '✨', '☕', '🌱', '🎞️', '🎙️', '🎧', '⚡', '🎨', '📝'];

  useEffect(() => {
    const loaded = getSparks().filter((s) => s.text && s.text.trim() !== '""' && s.text.trim() !== '');
    setSparks(loaded);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateSpark = () => {
    if (!newSparkText.trim()) return;
    const updated = saveSpark(newSparkText, selectedPlatform);
    setSparks(updated.filter((s) => s.text && s.text.trim() !== '""' && s.text.trim() !== ''));
    setNewSparkText('');
    showToast('✨ Spark pinned to your creative board!');
  };

  const handleDeleteSpark = (id: number) => {
    const updated = sparks.filter((s) => s.id !== id);
    setSparks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_recent_sparks', JSON.stringify(updated));
    }
  };

  const filteredSparks =
    activeFilter === 'ALL'
      ? sparks
      : sparks.filter((s) => (s.platform || 'Raw Spark').toUpperCase() === activeFilter);

  return (
    <div className="min-h-screen w-full bg-[#F5ECE1] text-[#241711] p-6 sm:p-10 font-sans relative overflow-x-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-5 py-3 rounded-full shadow-2xl text-xs font-sans font-bold flex items-center gap-2 z-50 border border-[#FAF6F0]/20"
          >
            <span>💡</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 01 — TOP HEADER */}
      <header className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-dashed border-[#8C4A27]/25">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/studio')}
            className="w-11 h-11 rounded-full bg-[#EADBC8] border-2 border-[#8C4A27]/30 hover:bg-[#DFCEB9] flex items-center justify-center text-sm font-bold text-[#241711] transition-transform hover:-translate-x-1 cursor-pointer shadow-2xs font-sans"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#8C4A27] uppercase font-black">
                CREATIVE REPOSITORY
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#241711] tracking-tight mt-0.5">
              Sparks & Ideas
            </h1>
          </div>
        </div>

        {/* Counter Badge with Softened Brown Border */}
        <div className="flex items-center gap-3">
          <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/30 rounded-2xl px-5 py-2.5 text-xs font-sans font-black text-[#6B4426] rotate-1 shadow-2xs">
            ✨ {sparks.length} {sparks.length === 1 ? 'Idea Pinned' : 'Ideas Pinned'}
          </div>
        </div>
      </header>

      {/* 02 — INPUT DOCK WITH SOFT WARM BROWN SHADOW & BORDER */}
      <section className="w-full max-w-4xl mx-auto mb-12">
        <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/40 rounded-[32px] p-4 shadow-[6px_6px_0px_0px_#8C4A27/25] hover:shadow-[8px_8px_0px_0px_#8C4A27/35] transition-all flex flex-col sm:flex-row items-center gap-3">
          
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-[#F5ECE1] text-[#6B4426] text-xs font-sans font-bold px-4 py-3 rounded-2xl border-2 border-[#8C4A27]/30 focus:outline-none cursor-pointer uppercase tracking-wider shrink-0"
          >
            <option value="Raw Spark">💡 Raw Thought</option>
            <option value="TikTok/Reels">📱 TikTok / Reel</option>
            <option value="YouTube">🎬 YouTube Essay</option>
            <option value="LinkedIn">💼 Professional Story</option>
            <option value="Podcast">🎙 Audio Monologue</option>
          </select>

          <input
            type="text"
            value={newSparkText}
            onChange={(e) => setNewSparkText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateSpark()}
            placeholder="Type a raw visual angle, half a sentence, or a concept title..."
            className="flex-1 bg-transparent text-sm sm:text-base font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none px-2 w-full font-normal"
          />

          <button
            onClick={handleCreateSpark}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-7 py-3 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-all cursor-pointer w-full sm:w-auto shrink-0 shadow-md hover:scale-102"
          >
            📌 Pin Spark
          </button>
        </div>
      </section>

      {/* 03 — SOFTENED FILTER PILLS */}
      <section className="w-full max-w-7xl mx-auto flex flex-wrap gap-2.5 justify-center mb-10">
        {(['ALL', 'RAW SPARK', 'TIKTOK/REELS', 'YOUTUBE', 'LINKEDIN', 'PODCAST'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-sans font-bold transition-all cursor-pointer border-2 ${
              activeFilter === cat
                ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-[3px_3px_0px_0px_#A6633C]'
                : 'bg-[#EADBC8] text-[#8C4A27] border-[#8C4A27]/25 hover:bg-[#DFCEB9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 04 — BOARD */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        <AnimatePresence>
          {filteredSparks.length === 0 ? (
            <div className="col-span-full bg-[#EADBC8] border-2 border-dashed border-[#8C4A27]/30 rounded-3xl p-12 text-center font-serif text-[#8C4A27]">
              Your board is empty in this category. Pin an idea above!
            </div>
          ) : (
            filteredSparks.map((spark, idx) => {
              const tone = cardTones[idx % cardTones.length];
              const sticker = stickers[idx % stickers.length];

              return (
                <motion.div
                  key={spark.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ backgroundColor: tone.bg, borderColor: tone.border }}
                  className={`border-2 rounded-[28px] p-6 shadow-[5px_5px_0px_0px_rgba(140,74,39,0.25)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.35)] transition-all hover:-translate-y-1 flex flex-col justify-between relative group ${tone.rotation}`}
                >
                  {/* Decorative Pin Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FAF6F0]/80 border border-[#8C4A27]/20 rotate-2 rounded-xs shadow-2xs pointer-events-none" />

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteSpark(spark.id)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#6B4426] text-[#FAF6F0] hover:bg-[#8C4A27] flex items-center justify-center text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shadow-2xs"
                  >
                    ✕
                  </button>

                  <div>
                    {/* Header Sticker + Platform Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{sticker}</span>
                        <span
                          style={{ backgroundColor: tone.tagBg }}
                          className="text-[9px] font-sans font-black tracking-widest text-[#6B4426] uppercase px-2.5 py-1 rounded-xl border border-[#8C4A27]/20"
                        >
                          {spark.platform || 'RAW SPARK'}
                        </span>
                      </div>
                      <span className="text-[10px] font-sans font-bold text-[#8C4A27]">
                        {spark.date}
                      </span>
                    </div>

                    {/* Spark Quote */}
                    <p className="text-base font-serif text-[#241711] leading-relaxed mb-6 font-medium">
                      "{spark.text}"
                    </p>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 border-t border-[#8C4A27]/20 flex items-center justify-between text-[10px] font-sans font-black">
                    <button
                      onClick={() => router.push(`/studio/video-generator?prompt=${encodeURIComponent(spark.text)}`)}
                      className="text-[#6B4426] hover:text-[#8C4A27] transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#8C4A27]/20 shadow-2xs hover:scale-105"
                    >
                      <span>✦</span>
                      <span>Refine</span>
                    </button>

                    <button
                      onClick={() => router.push(`/calendar?idea=${encodeURIComponent(spark.text)}`)}
                      className="text-[#8C4A27] hover:text-[#241711] transition-colors cursor-pointer uppercase tracking-wider bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#8C4A27]/20 shadow-2xs hover:scale-105"
                    >
                      📅 Schedule
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}