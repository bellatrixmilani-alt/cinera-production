'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { getSparks, SparkItem } from '@/lib/sparks';
import SettingsModal from '@/components/navigation/SettingsModal';
import { supabase } from '@/lib/supabase/client';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

interface ShotListData {
  title: string;
  logline: string;
  scenes: any[];
}

function StudioDashboardContent() {
  const router = useRouter();

  const [userId, setUserId] = useState<string>('guest');
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Tools');
  const [sparks, setSparks] = useState<SparkItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeShotlist, setActiveShotlist] = useState<ShotListData | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning.');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon.');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good evening.');
    } else {
      setGreeting('Late night studio.');
    }

    const dateFormatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    setCurrentDate(dateFormatted);

    supabase.auth.getUser().then(({ data }) => {
      const activeUid = data?.user?.id || 'guest';
      setUserId(activeUid);

      getSparks().then((res) => setSparks(res.slice(0, 3))).catch(() => {});

      const savedTodos = localStorage.getItem(`cinera_active_todos_${activeUid}`);
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos));
        } catch (e) {
          console.error(e);
        }
      } else {
        setTodos([]);
      }

      const savedShot = localStorage.getItem(`cinera_active_shotlist_${activeUid}`);
      if (savedShot) {
        try {
          setActiveShotlist(JSON.parse(savedShot));
        } catch (e) {
          console.error(e);
        }
      } else {
        setActiveShotlist(null);
      }
    });
  }, []);

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTodos(updated);
    localStorage.setItem(`cinera_active_todos_${userId}`, JSON.stringify(updated));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: Date.now().toString(), text: newTodo.trim(), done: false }];
    setTodos(updated);
    localStorage.setItem(`cinera_active_todos_${userId}`, JSON.stringify(updated));
    setNewTodo('');
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) {
      router.push('/studio/video-generator');
      return;
    }
    router.push(`/studio/video-generator?prompt=${encodeURIComponent(quickPrompt.trim())}`);
  };

  const toolPills = ['All Tools', 'Concept Room', 'Shot List', 'Sparks Vault', 'Calendar'];

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] text-[#241711] font-sans selection:bg-[#EADBC8] relative overflow-x-hidden flex flex-col justify-between">
      <FlowerAtmosphere />

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-8 relative z-10 flex flex-col gap-5 sm:gap-6 flex-1">
        
        {/* TOP BAR: BRAND + ACTIONS */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#EADBC8] border border-[#8C4A27]/25 flex items-center justify-center shadow-xs shrink-0">
              <FlowerDoodle size={26} />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#8C4A27] font-bold block">
                {currentDate}
              </span>
              <h1 className="text-lg sm:text-2xl font-serif font-bold text-[#241711] leading-tight">
                {greeting} <span className="italic font-normal text-[#8C4A27] hidden xs:inline">Ready to create?</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => router.push('/studio/video-generator')}
              className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <span>+</span>
              <span className="hidden sm:inline">New Concept</span>
              <span className="sm:hidden">Create</span>
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#EADBC8]/70 border border-[#8C4A27]/20 flex items-center justify-center text-sm font-bold text-[#8C4A27] hover:bg-[#EADBC8] transition-colors cursor-pointer"
              title="Studio Settings & Notifications"
            >
              ⚙
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 rounded-xl bg-[#EADBC8]/70 border border-[#8C4A27]/20 flex items-center justify-center text-sm font-bold text-[#8C4A27] hover:bg-[#EADBC8] transition-colors cursor-pointer"
              title="Landing"
            >
              ⌂
            </button>
          </div>
        </header>

        {/* SEARCH / PROMPT INPUT PILL */}
        <form
          onSubmit={handleLaunch}
          className="w-full bg-[#EADBC8]/80 backdrop-blur-md border border-[#8C4A27]/25 rounded-2xl p-2 sm:p-2.5 pl-3.5 sm:pl-4 flex items-center gap-2 sm:gap-3 shadow-xs focus-within:border-[#6B4426] transition-all"
        >
          <span className="text-xs sm:text-sm text-[#8C4A27]">✦</span>
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Pitch Cinera an idea or film premise..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none min-w-0"
          />
          <button
            type="submit"
            className="bg-[#6B4426] text-[#FAF6F0] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#52331B] shrink-0 cursor-pointer shadow-xs"
          >
            Brainstorm
          </button>
        </form>

        {/* FEATURED HERO CARD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#6B4426] via-[#5A381E] to-[#452712] text-[#FAF6F0] rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 shadow-md border border-[#8C4A27]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-6 translate-y-6 sm:translate-x-8 sm:translate-y-8">
            <FlowerDoodle size={200} colorFill="#F0B8C0" colorInner="#E098A0" strokeColor="transparent" />
          </div>

          <div className="max-w-xl relative z-10">
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#FAF6F0]/15 px-2.5 sm:px-3 py-1 rounded-full text-[#FAF6F0] font-bold inline-block mb-2 sm:mb-2.5">
              ACTIVE PRODUCTION TREATMENT
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#FAF6F0] mb-1.5 leading-snug">
              {activeShotlist ? activeShotlist.title : 'Start Your First Story Treatment'}
            </h2>
            <p className="text-xs sm:text-sm font-serif text-[#FAF6F0]/80 leading-relaxed">
              {activeShotlist
                ? `"${activeShotlist.logline}"`
                : 'Turn video concepts into staged directorial beats with camera angles and lighting.'}
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <button
              onClick={() => router.push('/studio/shot-list')}
              className="w-full md:w-auto bg-[#FAF6F0] hover:bg-[#EADBC8] text-[#241711] px-5 py-2.5 sm:py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-xs text-center cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              {activeShotlist ? 'Resume Shot List →' : 'Create Shot List →'}
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {toolPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveCategory(pill)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 min-h-[36px] ${
                activeCategory === pill
                  ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-xs'
                  : 'bg-[#EADBC8]/60 hover:bg-[#EADBC8] text-[#8C4A27] border-[#8C4A27]/20'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* TO-DO ROUTINE */}
          <div className="lg:col-span-5 bg-[#EADBC8]/70 backdrop-blur-xs border border-[#8C4A27]/25 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C4A27]">
                  TODAY'S PRODUCTION ROUTINE
                </span>
                <span className="text-[10px] font-bold text-[#8C4A27] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#8C4A27]/15">
                  {todos.filter((t) => t.done).length}/{todos.length} done
                </span>
              </div>

              <div className="space-y-2 mb-2">
                {todos.length === 0 ? (
                  <p className="text-xs font-serif italic text-[#8C4A27]/70 py-4 text-center">
                    No active tasks yet. Add one below to kick off your day.
                  </p>
                ) : (
                  todos.slice(0, 3).map((todo) => (
                    <div
                      key={todo.id}
                      onClick={() => toggleTodo(todo.id)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] transition-colors cursor-pointer text-xs font-serif select-none border border-[#8C4A27]/10"
                    >
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => toggleTodo(todo.id)}
                        className="accent-[#6B4426] rounded cursor-pointer w-4 h-4"
                      />
                      <span className={todo.done ? 'line-through text-[#8C4A27]/50' : 'text-[#241711] font-medium truncate'}>
                        {todo.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-[#8C4A27]/15">
              <form onSubmit={handleAddTodo} className="flex gap-1.5">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a filming or editing task..."
                  className="flex-1 bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-2 text-xs text-[#241711] placeholder-[#8C4A27]/50 focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0 min-h-[38px]"
                >
                  +
                </button>
              </form>

              <button
                onClick={() => router.push('/todo')}
                className="w-full bg-[#EADBC8] hover:bg-[#DFCEB9] text-[#6B4426] border border-[#8C4A27]/25 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs text-center flex items-center justify-center gap-1.5 min-h-[38px]"
              >
                <span>✦</span>
                <span>Make a To-Do List</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* 4 TOOLS GRID */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                title: 'Concept Room',
                tag: 'Interactive Room',
                desc: 'Brainstorm & debate formats 1-on-1 with Cinera.',
                icon: '💡',
                route: '/studio/video-generator',
              },
              {
                title: 'Directorial Shot List',
                tag: 'Scene Builder',
                desc: 'Turn treatments into timed camera beats & lighting cues.',
                icon: '🎥',
                route: '/studio/shot-list',
              },
              {
                title: 'Sparks Vault',
                tag: `${sparks.length} Saved`,
                desc: 'Pin raw epiphanies, maxims, and hook fragments.',
                icon: '✨',
                route: '/sparks',
              },
              {
                title: 'Shoot Schedule',
                tag: 'Release Cadence',
                desc: 'Map out filming dates and delivery deadlines.',
                icon: '📅',
                route: '/calendar',
              },
            ].map((tool) => (
              <div
                key={tool.title}
                onClick={() => router.push(tool.route)}
                className="bg-[#EADBC8]/70 hover:bg-[#EADBC8] border border-[#8C4A27]/25 hover:border-[#6B4426] rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between group shadow-xs hover:-translate-y-0.5 min-h-[135px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl p-1.5 bg-[#FAF6F0] rounded-xl border border-[#8C4A27]/10">
                      {tool.icon}
                    </span>
                    <span className="text-[9px] font-mono uppercase font-bold text-[#8C4A27] bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#8C4A27]/15">
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="text-xs font-serif font-bold text-[#241711] mb-1 group-hover:text-[#6B4426]">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-serif text-[#241711]/80 leading-snug">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[#8C4A27]/10 flex items-center justify-between text-[10px] font-bold text-[#8C4A27] group-hover:text-[#6B4426]">
                  <span>Enter</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 border-t border-[#8C4A27]/15 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#8C4A27]/70 uppercase relative z-10">
        <span>CINERA STUDIO SUITE</span>
        <span className="flex items-center gap-1.5">
          <span>CLARITY & BRILLIANCE</span>
          <FlowerDoodle size={16} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
        </span>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-8 font-serif">Loading Studio...</div>}>
      <StudioDashboardContent />
    </Suspense>
  );
}