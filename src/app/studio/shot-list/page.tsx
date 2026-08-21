'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { saveSpark } from '@/lib/sparks';
import { supabase } from '@/lib/supabase/client';

interface GearItem {
  item: string;
  purpose: string;
  searchQuery: string;
}

interface ShotScene {
  sceneNumber: number;
  name: string;
  shotType: string;
  movement: string;
  lighting: string;
  staging: string;
  audioDialogue: string;
  duration: string;
  completed?: boolean;
}

interface ShotListData {
  title: string;
  logline: string;
  gearRecommendations: GearItem[];
  scenes: ShotScene[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function ShotListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState<string>('guest');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [formatType, setFormatType] = useState('YouTube Video');
  const [toneMode, setToneMode] = useState<'creator' | 'pro'>('creator');
  const [shotData, setShotData] = useState<ShotListData | null>(null);
  const [activeTab, setActiveTab] = useState<'scenes' | 'gear'>('scenes');
  const [storeSource, setStoreSource] = useState<'amazon' | 'jumia' | 'tiktok'>('jumia');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hey! I'm your Cinera Cinematographer. Tell me what you want to shoot, your available space or gear, and let's craft the perfect angles and lighting setup together.",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isCompilingPlan, setIsCompilingPlan] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getCreatorProfile = (uid: string) => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(`cinera_creator_profile_${uid}`) || localStorage.getItem('cinera_creator_profile');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const activeUid = data?.user?.id || 'guest';
      setUserId(activeUid);

      const saved = localStorage.getItem(`cinera_active_shotlist_${activeUid}`);
      if (saved) {
        try {
          setShotData(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  useEffect(() => {
    const conceptFromUrl = searchParams.get('concept');
    if (conceptFromUrl) {
      setIsDrawerOpen(true);
      handleSendChatMessage(`Concept from generator: "${conceptFromUrl}". What angles, lighting, and camera positions should we use?`);
    }
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  const handleSendChatMessage = async (customText?: string) => {
    const text = (customText || chatInput).trim();
    if (!text || isAiThinking) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput('');
    setIsAiThinking(true);

    try {
      const profile = getCreatorProfile(userId);

      const res = await fetch('/api/ai/shot-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          format: formatType,
          toneMode,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          creatorProfile: profile,
        }),
      });

      if (!res.ok) throw new Error('Failed to reach DP');
      const data = await res.json();

      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply },
      ]);
    } catch (e) {
      console.error(e);
      showToast('⚠️ Could not connect to DP');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleCompileToPlan = async () => {
    setIsCompilingPlan(true);
    try {
      const profile = getCreatorProfile(userId);

      const res = await fetch('/api/ai/shot-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'compile',
          format: formatType,
          toneMode,
          messages: chatMessages,
          creatorProfile: profile,
        }),
      });

      if (!res.ok) throw new Error('Failed to compile shot list');
      const planData: ShotListData = await res.json();
      setShotData(planData);
      localStorage.setItem(`cinera_active_shotlist_${userId}`, JSON.stringify(planData));
      setIsDrawerOpen(false);
      showToast('🎬 Production plan compiled below!');
    } catch (e) {
      console.error(e);
      showToast('⚠️ Failed to compile plan');
    } finally {
      setIsCompilingPlan(false);
    }
  };

  const handleSaveToSparks = async () => {
    if (!shotData) return;
    const summary = `${shotData.title} (Shot List Plan)\nLogline: ${shotData.logline}\nScenes: ${shotData.scenes
      .map((s) => `Scene ${s.sceneNumber} (${s.shotType}): ${s.name}`)
      .join(' | ')}`;
    await saveSpark(summary, formatType, 'Shot List');
    showToast('💡 Saved complete shot list to Sparks Vault!');
  };

  const toggleSceneCompletion = (index: number) => {
    if (!shotData) return;
    const scenes = [...shotData.scenes];
    scenes[index] = { ...scenes[index], completed: !scenes[index].completed };
    const updated = { ...shotData, scenes };
    setShotData(updated);
    localStorage.setItem(`cinera_active_shotlist_${userId}`, JSON.stringify(updated));
  };

  const getStoreUrl = (query: string) => {
    if (storeSource === 'jumia') {
      return `https://www.jumia.co.ke/catalog/?q=${encodeURIComponent(query)}`;
    }
    if (storeSource === 'tiktok') {
      return `https://www.tiktok.com/search?q=${encodeURIComponent(query + ' gear review')}`;
    }
    return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  };

  const completedCount = shotData?.scenes.filter((s) => s.completed).length || 0;
  const totalScenes = shotData?.scenes.length || 0;
  const progressPercent = totalScenes > 0 ? Math.round((completedCount / totalScenes) * 100) : 0;

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
                DIRECTORIAL SUITE
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#241711]">
                Shot List & Camera Staging
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#EADBC8] p-1 rounded-xl border border-[#8C4A27]/20">
              <button
                onClick={() => setToneMode('creator')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  toneMode === 'creator'
                    ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                    : 'text-[#8C4A27] hover:text-[#241711]'
                }`}
              >
                ✨ Creator Terms
              </button>
              <button
                onClick={() => setToneMode('pro')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  toneMode === 'pro'
                    ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                    : 'text-[#8C4A27] hover:text-[#241711]'
                }`}
              >
                🎥 Filmmaker Pro
              </button>
            </div>

            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>💬</span>
              <span>{isDrawerOpen ? 'Close DP Chat' : 'Debate with Cinera DP'}</span>
            </button>
          </div>
        </header>

        {shotData ? (
          <>
            <div className="bg-gradient-to-br from-[#6B4426] via-[#5A381E] to-[#452712] text-[#FAF6F0] rounded-[28px] p-6 sm:p-7 shadow-md border border-[#8C4A27]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#FAF6F0]/15 px-3 py-1 rounded-full text-[#FAF6F0] font-bold inline-block mb-2">
                  ACTIVE PRODUCTION PLAN
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold mb-1">
                  {shotData.title}
                </h2>
                <p className="text-xs font-serif text-[#FAF6F0]/80 italic">
                  "{shotData.logline}"
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:items-end gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans font-bold text-[#FAF6F0]">
                    {completedCount} of {totalScenes} Takes Blocked
                  </span>
                  <span className="text-xs font-mono font-bold bg-[#FAF6F0] text-[#6B4426] px-2.5 py-0.5 rounded-lg">
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full sm:w-44 h-2 bg-[#FAF6F0]/20 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-[#FAF6F0] rounded-full"
                  />
                </div>

                <button
                  onClick={handleSaveToSparks}
                  className="bg-[#FAF6F0] hover:bg-[#EADBC8] text-[#6B4426] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer mt-1"
                >
                  <span>💡</span>
                  <span>Save Plan to Sparks Vault</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#8C4A27]/20 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('scenes')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeTab === 'scenes'
                      ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                      : 'text-[#8C4A27] hover:bg-[#EADBC8]/50'
                  }`}
                >
                  🎬 Camera & Lighting Beats ({shotData.scenes.length})
                </button>
                <button
                  onClick={() => setActiveTab('gear')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeTab === 'gear'
                      ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                      : 'text-[#8C4A27] hover:bg-[#EADBC8]/50'
                  }`}
                >
                  📦 Recommended Equipment ({shotData.gearRecommendations.length})
                </button>
              </div>

              {activeTab === 'gear' && (
                <div className="flex items-center gap-1.5 bg-[#EADBC8] p-1 rounded-xl border border-[#8C4A27]/20">
                  <span className="text-[10px] font-mono font-bold text-[#8C4A27] px-2">Store:</span>
                  {(['jumia', 'amazon', 'tiktok'] as const).map((store) => (
                    <button
                      key={store}
                      onClick={() => setStoreSource(store)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        storeSource === store
                          ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                          : 'text-[#8C4A27] hover:text-[#241711]'
                      }`}
                    >
                      {store === 'jumia' ? '🇰🇪 Jumia Kenya' : store === 'amazon' ? 'Amazon' : 'TikTok Shop'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeTab === 'scenes' && (
              <main className="space-y-4">
                <AnimatePresence>
                  {shotData.scenes.map((scene, idx) => (
                    <motion.div
                      key={scene.sceneNumber}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-[24px] border p-5 sm:p-6 transition-all flex flex-col gap-4 ${
                        scene.completed
                          ? 'bg-[#FAF6F0]/60 border-[#8C4A27]/20 opacity-75'
                          : 'bg-[#FAF6F0] border-[#8C4A27]/30 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#8C4A27]/15">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={scene.completed}
                            onChange={() => toggleSceneCompletion(idx)}
                            className="w-5 h-5 accent-[#6B4426] rounded cursor-pointer"
                          />
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C4A27] block">
                              SCENE {scene.sceneNumber} • {scene.duration}
                            </span>
                            <h3 className={`text-base font-serif font-bold ${scene.completed ? 'line-through text-[#8C4A27]/60' : 'text-[#241711]'}`}>
                              {scene.name}
                            </h3>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold bg-[#EADBC8] text-[#6B4426] px-3 py-1 rounded-full border border-[#8C4A27]/20">
                          {scene.shotType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-[#EADBC8]/50 p-3 rounded-xl border border-[#8C4A27]/15">
                          <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] block mb-1">
                            🎥 CAMERA MOVEMENT
                          </span>
                          <p className="font-serif text-[#241711] font-medium">{scene.movement}</p>
                        </div>

                        <div className="bg-[#EADBC8]/50 p-3 rounded-xl border border-[#8C4A27]/15">
                          <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] block mb-1">
                            💡 LIGHTING SETUP
                          </span>
                          <p className="font-serif text-[#241711] font-medium">{scene.lighting}</p>
                        </div>

                        <div className="bg-[#EADBC8]/50 p-3 rounded-xl border border-[#8C4A27]/15">
                          <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] block mb-1">
                            📐 STAGING & POSITION
                          </span>
                          <p className="font-serif text-[#241711] font-medium">{scene.staging}</p>
                        </div>
                      </div>

                      <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#8C4A27]/20 flex items-start gap-2">
                        <span className="text-xs">🎙️</span>
                        <p className="text-xs font-serif text-[#241711]/90 italic">
                          <strong className="font-sans font-bold not-italic text-[#8C4A27] mr-1.5">Audio Cue:</strong>
                          {scene.audioDialogue}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </main>
            )}

            {activeTab === 'gear' && (
              <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shotData.gearRecommendations.map((gear, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-[24px] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">📦</span>
                        <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] bg-[#EADBC8] px-2 py-0.5 rounded-full border border-[#8C4A27]/20">
                          Recommended
                        </span>
                      </div>

                      <h4 className="text-sm font-serif font-bold text-[#241711] mb-1">
                        {gear.item}
                      </h4>
                      <p className="text-xs font-serif text-[#241711]/80 leading-relaxed mb-4">
                        {gear.purpose}
                      </p>
                    </div>

                    <a
                      href={getStoreUrl(gear.searchQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-2 px-3.5 rounded-xl text-xs font-bold text-center transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>
                        Search on {storeSource === 'jumia' ? 'Jumia Kenya' : storeSource === 'amazon' ? 'Amazon' : 'TikTok'}
                      </span>
                      <span>↗</span>
                    </a>
                  </div>
                ))}
              </main>
            )}
          </>
        ) : (
          <div className="bg-[#EADBC8]/40 border-2 border-dashed border-[#8C4A27]/25 rounded-[28px] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#EADBC8] border border-[#8C4A27]/20 flex items-center justify-center text-2xl shadow-xs">
              🎬
            </div>
            <h3 className="text-lg font-serif font-bold text-[#241711]">No Production Plan Locked Yet</h3>
            <p className="text-xs font-serif text-[#8C4A27] max-w-md leading-relaxed">
              Open the DP Chat Drawer on the right to debate lighting, camera movements, and staging for your specific niche. When you're ready, click "Lock into Production Plan".
            </p>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer mt-2"
            >
              Open Cinera DP Drawer →
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-2xs md:hidden"
            />

            <motion.aside
              initial={{ x: 440 }}
              animate={{ x: 0 }}
              exit={{ x: 440 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[430px] bg-[#FAF6F0] border-l-2 border-[#8C4A27]/30 shadow-2xl z-50 flex flex-col justify-between"
            >
              <div className="p-4 border-b border-[#8C4A27]/20 bg-[#EADBC8]/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8C4A27]">
                      CINERA CINEMATOGRAPHER
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#241711]">
                    Debate Visuals & Staging
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#8C4A27]/25 flex items-center justify-center text-xs font-bold text-[#8C4A27] hover:bg-[#DFCEB9] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {chatMessages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27]/70 mb-1 px-1">
                        {isUser ? 'You' : 'Cinera DP'}
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                          isUser
                            ? 'bg-[#6B4426] text-[#FAF6F0] rounded-tr-xs shadow-xs'
                            : 'bg-[#EADBC8] text-[#241711] rounded-tl-xs border border-[#8C4A27]/20 font-serif whitespace-pre-wrap'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {isAiThinking && (
                  <div className="text-xs font-serif italic text-[#8C4A27] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8C4A27] animate-ping" />
                    Cinera is calculating camera angles...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-[#8C4A27]/20 bg-[#EADBC8]/60 flex flex-col gap-2.5">
                <button
                  onClick={handleCompileToPlan}
                  disabled={isCompilingPlan || chatMessages.length <= 1}
                  className="w-full bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-50 text-[#FAF6F0] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-101"
                >
                  <span>✦</span>
                  <span>{isCompilingPlan ? 'Compiling Production Plan...' : 'Lock into Production Plan Below'}</span>
                </button>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    'How do I light this with 1 window?',
                    'Give me simple phone angles',
                    'Where should I put the mic?',
                    'What gear can I get on Jumia?',
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSendChatMessage(s)}
                      className="text-[10px] font-sans font-bold text-[#8C4A27] bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#8C4A27]/20 whitespace-nowrap cursor-pointer hover:bg-[#EADBC8]"
                    >
                      + {s}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-xl p-1.5 pl-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendChatMessage();
                    }}
                    placeholder="Debate lighting, phone vs camera, Jumia gear..."
                    className="flex-1 bg-transparent text-xs font-serif text-[#241711] placeholder-[#8C4A27]/50 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    disabled={!chatInput.trim() || isAiThinking}
                    className="bg-[#6B4426] text-[#FAF6F0] px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <footer className="w-full max-w-6xl mx-auto px-5 py-4 border-t border-[#8C4A27]/15 flex items-center justify-between text-[10px] font-mono text-[#8C4A27]/70 uppercase relative z-10">
        <span>CINERA DIRECTORIAL SUITE</span>
        <span className="flex items-center gap-1.5">
          <span>STAGING & LIGHTING</span>
          <FlowerDoodle size={16} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
        </span>
      </footer>
    </div>
  );
}

export default function ShotListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-8 font-serif">Loading Shot List...</div>}>
      <ShotListContent />
    </Suspense>
  );
}