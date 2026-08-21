'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { getSparks, saveSpark, deleteSpark, SparkItem } from '@/lib/sparks';

function SparksVaultContent() {
  const router = useRouter();
  const [sparks, setSparks] = useState<SparkItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newSparkInput, setNewSparkInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadUserSparks = async () => {
    const list = await getSparks();
    setSparks(list);
  };

  useEffect(() => {
    loadUserSparks();
  }, []);

  const handleCreateSpark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSparkInput.trim()) return;
    await saveSpark(newSparkInput.trim(), selectedPlatform);
    setNewSparkInput('');
    await loadUserSparks();
    showToast('✨ Spark pinned to your vault!');
  };

  const handleDelete = async (id: string) => {
    await deleteSpark(id);
    await loadUserSparks();
    showToast('Deleted spark.');
  };

  const filteredSparks = sparks.filter((s) => {
    const matchesFilter = activeFilter === 'All' || s.platform === activeFilter;
    const matchesSearch =
      (s.content || s.text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs = ['All', 'YouTube', 'TikTok/Reels', 'Podcast', 'Brand/Ad'];

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#241711] font-sans selection:bg-[#EADBC8] relative overflow-x-hidden flex flex-col justify-between">
      <FlowerAtmosphere />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-5 py-3 rounded-2xl shadow-xl text-xs font-bold z-50 border border-[#FAF6F0]/20"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-6 relative z-10 flex flex-col gap-6 flex-1">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#8C4A27]/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/studio')}
              className="w-10 h-10 rounded-2xl bg-[#EADBC8] border border-[#8C4A27]/25 hover:bg-[#DFCEB9] flex items-center justify-center text-xs font-bold text-[#241711] transition-transform hover:-translate-x-0.5 cursor-pointer shadow-xs"
              title="Back to Studio"
            >
              ←
            </button>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C4A27] font-bold block">
                CREATIVE VAULT
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#241711]">
                Sparks & Epiphany Board
              </h1>
            </div>
          </div>

          <button
            onClick={() => router.push('/studio/video-generator')}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>✦</span>
            <span>Open Concept Room</span>
          </button>
        </header>

        {/* INPUT PINNER */}
        <form
          onSubmit={handleCreateSpark}
          className="bg-[#EADBC8]/70 backdrop-blur-md border border-[#8C4A27]/25 rounded-[24px] p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2 w-full flex-1 px-3">
            <span className="text-sm">💡</span>
            <input
              type="text"
              value={newSparkInput}
              onChange={(e) => setNewSparkInput(e.target.value)}
              placeholder="Capture a raw hook, title maxim, or midnight idea..."
              className="w-full bg-transparent text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#6B4426] focus:outline-none cursor-pointer"
            >
              <option value="YouTube">YouTube</option>
              <option value="TikTok/Reels">TikTok/Reels</option>
              <option value="Podcast">Podcast</option>
              <option value="Brand/Ad">Brand/Ad</option>
            </select>

            <button
              type="submit"
              disabled={!newSparkInput.trim()}
              className="bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-40 text-[#FAF6F0] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer shrink-0"
            >
              Pin Spark
            </button>
          </div>
        </form>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeFilter === tab
                    ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-xs'
                    : 'bg-[#EADBC8]/50 hover:bg-[#EADBC8] text-[#8C4A27] border-[#8C4A27]/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 w-full sm:w-64">
            <span className="text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sparks..."
              className="w-full bg-transparent text-xs font-serif text-[#241711] placeholder-[#8C4A27]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* SPARKS BOARD */}
        {filteredSparks.length === 0 ? (
          <div className="bg-[#EADBC8]/40 border-2 border-dashed border-[#8C4A27]/20 rounded-[28px] p-12 text-center flex flex-col items-center justify-center gap-2 flex-1">
            <div className="text-3xl">✨</div>
            <h3 className="text-base font-serif font-bold text-[#241711]">Your Sparks Vault is empty</h3>
            <p className="text-xs font-serif text-[#8C4A27] max-w-sm">
              Save hooks and concepts from the Concept Room, or type a raw spark in the bar above.
            </p>
          </div>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredSparks.map((spark) => (
                <motion.div
                  key={spark.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-[24px] p-5 shadow-xs flex flex-col justify-between group hover:border-[#6B4426] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] bg-[#EADBC8] px-2.5 py-0.5 rounded-full border border-[#8C4A27]/15">
                        {spark.platform || 'General'}
                      </span>
                      <button
                        onClick={() => handleDelete(spark.id)}
                        className="text-[#8C4A27]/40 hover:text-red-700 font-bold text-sm transition-colors cursor-pointer px-1"
                        title="Delete spark"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs font-serif text-[#241711] leading-relaxed italic whitespace-pre-wrap mb-4">
                      "{spark.content || spark.text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#8C4A27]/15 flex items-center justify-between">
                    <button
                      onClick={() =>
                        router.push(
                          spark.type === 'Shot List'
                            ? `/studio/shot-list?concept=${encodeURIComponent(spark.content || '')}`
                            : `/studio/video-generator?prompt=${encodeURIComponent(spark.content || '')}`
                        )
                      }
                      className="text-[10px] font-bold text-[#8C4A27] hover:text-[#6B4426] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>✦ Launch in {spark.type === 'Shot List' ? 'Shot List' : 'Concept Room'}</span>
                      <span>→</span>
                    </button>
                    <span className="text-xs">💡</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </main>
        )}
      </div>

      <footer className="w-full max-w-6xl mx-auto px-5 py-4 border-t border-[#8C4A27]/15 flex items-center justify-between text-[10px] font-mono text-[#8C4A27]/70 uppercase relative z-10">
        <span>CINERA SPARKS BOARD</span>
        <span className="flex items-center gap-1.5">
          <span>PRIVATE CREATOR VAULT</span>
          <FlowerDoodle size={16} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
        </span>
      </footer>
    </div>
  );
}

export default function SparksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-8 font-serif">Loading Vault...</div>}>
      <SparksVaultContent />
    </Suspense>
  );
}