'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ShotList from '@/components/studio/ShotList';
import ProfileDrawer from '@/components/studio/ProfileDrawer';
import NetworkErrorHandler from '@/components/studio/NetworkErrorHandler';
import { saveSpark } from '../../lib/sparks';

interface CalendarTask {
  id: number;
  dateNum: number;
  title: string;
  icon: string;
  color: string;
}

interface TodoTask {
  id: number;
  text: string;
  done: boolean;
  category: string;
}

interface ChatMessage {
  sender: 'friend' | 'user';
  text: string;
}

export default function StudioPage() {
  const router = useRouter();
  const [genre, setGenre] = useState<string>('TRAVEL CONTENT');
  const [promptText, setPromptText] = useState<string>('');
  const [userName, setUserName] = useState<string>('Winnie');
  
  // UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOverwhelmedOpen, setIsOverwhelmedOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Best-Friend Therapy Chatbox States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'friend',
      text: "Hey Winnie, I'm right here. Take a deep breath... What's going on today? Is it brain fog, too many ideas, or just life getting heavy?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Calendar Week Tasks
  const [scheduledTasks, setScheduledTasks] = useState<CalendarTask[]>([]);

  // Sparks State
  const [recentSparks, setRecentSparks] = useState([
    { id: 1, text: 'A travel vignette shot entirely at 6 AM.', date: '2 days ago' },
    { id: 2, text: 'Capturing ocean reflections through train glass.', date: 'Yesterday' },
  ]);

  // To-Do List State
  const [todoTasks, setTodoTasks] = useState<TodoTask[]>([
    { id: 1, text: 'Scout 6 AM location at Nairobi CBD', done: true, category: 'PRE-PRODUCTION' },
    { id: 2, text: 'Record B-roll of morning mist & reflections', done: false, category: 'FILMING' },
    { id: 3, text: 'Apply 35mm warm film grain preset', done: false, category: 'EDITING' },
  ]);
  const [newTodoInput, setNewTodoInput] = useState('');

  // Load Saved Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('cinera_user_name');
      if (storedName) setUserName(storedName);

      const storedGenre = localStorage.getItem('cinera_primary_genre');
      if (storedGenre) setGenre(storedGenre.toUpperCase());

      // Load Calendar Events
      const storedCal = localStorage.getItem('cinera_calendar_events');
      if (storedCal) {
        try {
          setScheduledTasks(JSON.parse(storedCal));
        } catch (e) {
          console.error(e);
        }
      }

      // Load Saved Sparks
      const storedSparks = localStorage.getItem('cinera_recent_sparks');
      if (storedSparks) {
        try {
          const parsed = JSON.parse(storedSparks);
          if (parsed.length > 0) setRecentSparks(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      // Load Saved To-Dos
      const storedTodos = localStorage.getItem('cinera_todo_list');
      if (storedTodos) {
        try {
          const parsed = JSON.parse(storedTodos);
          if (parsed.length > 0) setTodoTasks(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Auto-scroll chatbox
  useEffect(() => {
    if (isOverwhelmedOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOverwhelmedOpen, isFriendTyping]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleVisionCreate = () => {
    if (promptText.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cinera_active_prompt', promptText);
      }
      router.push(`/studio/video-generator?prompt=${encodeURIComponent(promptText)}`);
    } else {
      router.push('/studio/video-generator');
    }
  };

  // Direct Save to Sparks Trigger
  const handleSaveVisionToSpark = () => {
    if (!promptText.trim()) return;
    saveSpark(promptText);
    setPromptText('');
    triggerToast('💡 Saved as a new Spark! Visible under Sparks.');
  };

  // To-Do Handlers
  const toggleTodo = (id: number) => {
    const updated = todoTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTodoTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_todo_list', JSON.stringify(updated));
    }
  };

  const handleAddModalTodo = () => {
    if (!newTodoInput.trim()) return;
    const newTask: TodoTask = {
      id: Date.now(),
      text: newTodoInput.trim(),
      done: false,
      category: 'PRE-PRODUCTION',
    };
    const updated = [newTask, ...todoTasks];
    setTodoTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_todo_list', JSON.stringify(updated));
    }
    setNewTodoInput('');
  };

  // Best Friend Interactive Therapy Chat Handler
  const handleSendMessageToFriend = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const updatedMessages: ChatMessage[] = [...chatMessages, { sender: 'user', text: userMsg }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsFriendTyping(true);

    // Dynamic Best-Friend Conversational Response
    setTimeout(() => {
      let replyText = "I completely hear you. That sounds exhausting. You don't have to carry the whole project on your shoulders right now. What if we just pick ONE simple, quiet moment to film and leave everything else for later?";

      const lower = userMsg.toLowerCase();
      if (lower.includes('too many') || lower.includes('ideas') || lower.includes('confused')) {
        replyText = "I know that feeling so well—your head feels full of noise. Let's park 90% of those ideas for later. What is the SINGLE visual or sentence that made you feel happy today?";
      } else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('burnout') || lower.includes('stress')) {
        replyText = "First off: give yourself credit for creating anything at all. You don't owe anyone a masterpiece today. If you want, we can make something super simple—like a 10-second clip with warm room audio.";
      } else if (lower.includes('don\'t know') || lower.includes('start') || lower.includes('blank')) {
        replyText = "That's totally okay! Blank pages are scary. Why don't we start with something you already did today—like grabbing coffee or looking out the window?";
      }

      setChatMessages([...updatedMessages, { sender: 'friend', text: replyText }]);
      setIsFriendTyping(false);
    }, 1200);
  };

  // Active Week Data (Mon 12 - Fri 16 Dec)
  const currentWeekDays = [
    { num: 12, dayName: 'MON' },
    { num: 13, dayName: 'TUE' },
    { num: 14, dayName: 'WED' },
    { num: 15, dayName: 'THU' },
    { num: 16, dayName: 'FRI' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5ECE1] text-[#241711] p-6 md:p-10 font-sans relative overflow-x-hidden">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-5 py-3 rounded-2xl shadow-2xl text-xs font-sans font-bold flex items-center gap-2 z-50 border border-[#FAF6F0]/20"
          >
            <span>💡</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 01 — NAVIGATION HEADER */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center pb-8 border-b-2 border-dashed border-[#8C4A27]/25 mb-8">
        <span className="text-2xl font-serif font-black tracking-[0.2em] uppercase text-[#241711]">
          CINERA
        </span>

        <div className="hidden md:flex items-center gap-8 text-xs font-sans tracking-[0.2em] text-[#8C4A27] uppercase font-bold">
          <button className="text-[#241711] font-black cursor-pointer">Home</button>
          <button onClick={() => router.push('/todo')} className="hover:text-[#241711] transition-colors cursor-pointer">To-Do List</button>
          <button onClick={() => router.push('/sparks')} className="hover:text-[#241711] transition-colors cursor-pointer">Sparks</button>
          <button onClick={() => router.push('/calendar')} className="hover:text-[#241711] transition-colors cursor-pointer">Calendar</button>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-xs font-sans tracking-[0.15em] text-[#8C4A27] hover:text-[#241711] font-bold uppercase cursor-pointer">
            SEARCH
          </button>

          {/* + CREATE Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-6 py-2.5 rounded-full text-xs font-sans tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(140,74,39,0.25)] hover:scale-102 cursor-pointer font-bold"
            >
              <span>✦</span>
              <span>Create</span>
            </button>

            <AnimatePresence>
              {isCreateOpen && (
                <>
                  <div
                    onClick={() => setIsCreateOpen(false)}
                    className="fixed inset-0 bg-transparent z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 12, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    className="absolute right-0 top-full w-56 bg-[#EADBC8] border-2 border-[#8C4A27]/30 rounded-2xl p-3 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.25)] z-50"
                  >
                    <div className="text-[10px] font-sans tracking-widest text-[#8C4A27] uppercase px-2 py-1 mb-1 border-b border-[#8C4A27]/20 font-black">
                      Create New
                    </div>
                    <div className="space-y-1">
                      {[
                        { label: 'Video Idea', icon: '🎬', action: () => router.push('/studio/video-generator') },
                        { label: 'To-Do List', icon: '📝', action: () => setIsTodoModalOpen(true) },
                        { label: 'Spark', icon: '💡', action: () => router.push('/sparks') },
                        { label: 'Shot List', icon: '📋', action: () => router.push('/studio/shot-list') },
                        { label: 'Calendar Task', icon: '📅', action: () => router.push('/calendar') },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            setIsCreateOpen(false);
                            if (opt.action) opt.action();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans text-[#241711] hover:bg-[#FAF6F0] transition-colors cursor-pointer text-left font-bold"
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar Trigger */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-9 h-9 rounded-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] flex items-center justify-center font-serif text-sm font-bold shadow-2xs border border-[#FAF6F0]/20 cursor-pointer hover:scale-105 transition-transform"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>
      </nav>

      {/* 02 — HERO WRITER'S DESK */}
      <section className="w-full max-w-4xl mx-auto text-center flex flex-col items-center mb-12">
        <span className="text-[11px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase block mb-1 font-black bg-[#EADBC8] border border-[#8C4A27]/25 px-3 py-1 rounded-full shadow-2xs">
          🎙️ GENRE: {genre}
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#241711] font-bold tracking-tight mb-2">
          Good morning, {userName}.
        </h1>
        <p className="text-xs sm:text-sm font-serif italic text-[#8C4A27] max-w-md mb-8 font-medium">
          "Turn a raw thought, feeling, or unfinished observation into something worth making."
        </p>

        {/* Vision Prompt Box */}
        <div className="w-full max-w-2xl bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[10px_10px_0px_0px_rgba(140,74,39,0.3)] transition-all">
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleVisionCreate();
              }
            }}
            placeholder=' "I want to create a cinematic film about..." '
            className="w-full bg-transparent text-sm sm:text-base font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none resize-none leading-relaxed italic"
          />

          <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-[#8C4A27]/25 mt-2">
            <span className="text-[10px] font-sans tracking-wider text-[#8C4A27] font-black uppercase">
              ✨ WRITER'S DESK • READY
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleSaveVisionToSpark}
                title="Save as Spark"
                className="bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#241711] px-4 py-2 rounded-full text-[11px] font-sans font-bold transition-all cursor-pointer border-2 border-[#8C4A27]/25 flex items-center gap-1.5 shadow-2xs hover:scale-102"
              >
                <span>💡</span>
                <span>Save to Spark</span>
              </button>

              <button 
                onClick={handleVisionCreate}
                className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-5 py-2 rounded-full text-xs font-sans tracking-[0.15em] uppercase transition-all duration-200 flex items-center gap-1.5 shadow-md cursor-pointer font-bold hover:scale-102"
              >
                <span>✦</span>
                <span>Refine Idea</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => setIsOverwhelmedOpen(true)}
            className="text-xs font-sans text-[#8C4A27] hover:text-[#241711] bg-[#EADBC8] border border-[#8C4A27]/25 px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs font-bold"
          >
            <span>Feeling stuck?</span>
            <span className="text-[#241711] font-bold underline">I'm overwhelmed →</span>
          </button>
        </div>
      </section>

      {/* 03 — CREATIVE MODULES GRID */}
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
        
        {/* Module 1: Idea Refiner Studio */}
        <div 
          onClick={() => router.push('/studio/video-generator')}
          className="md:col-span-7 bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.3)] transition-all duration-300 flex flex-col justify-between h-[320px] group cursor-pointer"
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black">
                💡 IDEA REFINER STUDIO
              </span>
              <span className="text-[10px] font-sans text-[#6B4426] font-bold bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#8C4A27]/20">Active Brainstorming</span>
            </div>
            <p className="text-xs font-serif italic text-[#8C4A27]">Turn a generic thought into a unique multi-platform angle.</p>
          </div>

          <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-[#F5ECE1] border-2 border-[#8C4A27]/20 p-4 flex flex-col justify-between my-2 shadow-2xs">
            <span className="text-[9px] font-sans font-black tracking-widest text-[#8C4A27] uppercase">
              ✨ LATEST CONCEPT ANGLE
            </span>
            <p className="text-xs font-serif italic text-[#241711] leading-relaxed font-medium">
              "Skip the standard vlog intro. Open mid-action at 0:02 with the high-stakes moment of the day."
            </p>
            <span className="text-[10px] font-sans text-[#6B4426] font-bold">
              Multi-Platform Fit • High Retention Opening
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-serif italic text-[#241711] font-bold">Coastal Escape Concept</span>
            <span className="text-xs font-sans tracking-widest uppercase text-[#241711] group-hover:translate-x-1 transition-transform font-black">
              Refine Ideas →
            </span>
          </div>
        </div>

        {/* Module 2: RECENT TO-DO LIST WIDGET */}
        <div 
          onClick={() => setIsTodoModalOpen(true)}
          className="md:col-span-5 bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.3)] transition-all duration-300 flex flex-col justify-between h-[320px] cursor-pointer group"
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black">
                📝 TODAY'S NARRATIVE (TO-DO)
              </span>
              <span className="text-[10px] font-sans text-[#241711] font-black underline">
                View All →
              </span>
            </div>
            <p className="text-xs font-serif italic text-[#8C4A27] mb-3">Focus on essential production steps.</p>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {todoTasks.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTodo(t.id);
                  }}
                  className="flex items-center justify-between bg-[#F5ECE1] border border-[#8C4A27]/20 rounded-xl p-2.5 text-xs font-serif text-[#241711] hover:bg-[#FAF6F0] transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-4 h-4 rounded-full border-2 border-[#6B4426] flex items-center justify-center ${t.done ? 'bg-[#6B4426]' : ''}`}>
                      {t.done && <span className="text-white text-[8px] font-bold">✓</span>}
                    </div>
                    <span className={`truncate ${t.done ? 'line-through opacity-50' : 'font-medium'}`}>
                      {t.text}
                    </span>
                  </div>
                  <span className="text-[8px] font-sans font-black text-[#8C4A27] bg-[#EADBC8] px-1.5 py-0.5 rounded-md uppercase ml-2 shrink-0 border border-[#8C4A27]/20">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t-2 border-dashed border-[#8C4A27]/25 flex justify-between items-center text-[10px] font-sans text-[#8C4A27] font-black">
            <span>{todoTasks.filter(t => t.done).length} / {todoTasks.length} Done</span>
            <span className="group-hover:translate-x-1 transition-transform">Open Modal →</span>
          </div>
        </div>

        {/* Module 3: Dynamic Sparks List */}
        <div className="md:col-span-5 bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] flex flex-col justify-between h-[280px]">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black">
                💡 RECENT SPARKS
              </span>
              <button
                onClick={() => router.push('/sparks')}
                className="text-[10px] font-sans text-[#241711] font-black underline cursor-pointer"
              >
                View All →
              </button>
            </div>
            <p className="text-xs font-serif italic text-[#8C4A27] mb-3">Saved thoughts & ideas.</p>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {recentSparks.map((spk) => (
                <div key={spk.id} className="bg-[#F5ECE1] border border-[#8C4A27]/20 rounded-xl p-3 text-xs font-serif text-[#241711] shadow-2xs">
                  <p className="italic font-medium">"{spk.text}"</p>
                  <span className="text-[9px] font-sans text-[#8C4A27] font-bold block mt-1">{spk.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module 4: Smart AI Shot List */}
        <div className="md:col-span-7 h-[280px]">
          <ShotList />
        </div>

        {/* Module 5: LIVE CALENDAR WEEK DISPLAY */}
        <div
          onClick={() => router.push('/calendar')}
          className="md:col-span-12 bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.3)] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black">
                  📅 THIS WEEK'S PRODUCTION CALENDAR
                </span>
                <span className="text-[9px] font-sans bg-[#6B4426] text-[#FAF6F0] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AUTO-SAVED
                </span>
              </div>
              <span className="text-xs font-sans text-[#241711] font-black group-hover:translate-x-1 transition-transform">
                Open Full Calendar →
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
              {currentWeekDays.map((wDay) => {
                const dayEvents = scheduledTasks.filter((t) => t.dateNum === wDay.num);
                return (
                  <div
                    key={wDay.num}
                    className="bg-[#F5ECE1] border border-[#8C4A27]/20 rounded-2xl p-3 min-h-[95px] flex flex-col justify-between group-hover:border-[#8C4A27] transition-colors shadow-2xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-sans font-black text-[#8C4A27]">{wDay.dayName}</span>
                      <span className="text-xs font-serif font-bold text-[#241711]">{wDay.num}</span>
                    </div>

                    <div className="space-y-1 my-1">
                      {dayEvents.length === 0 ? (
                        <span className="text-[9px] font-sans text-[#8C4A27]/60 italic font-medium block">+ Add task</span>
                      ) : (
                        dayEvents.slice(0, 2).map((evt) => (
                          <div
                            key={evt.id}
                            style={{ backgroundColor: evt.color || '#D8C3B0' }}
                            className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-md text-[#241711] truncate flex items-center gap-1 shadow-2xs border border-[#8C4A27]/15"
                          >
                            <span>{evt.icon}</span>
                            <span className="truncate">{evt.title}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>

      {/* TODAY'S NARRATIVE (TO-DO LIST) POPUP MODAL */}
      <AnimatePresence>
        {isTodoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTodoModalOpen(false)}
              className="absolute inset-0 bg-[#241711]/50 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-md bg-[#EADBC8] border-2 border-[#8C4A27]/40 rounded-[36px] p-8 shadow-[10px_10px_0px_0px_rgba(140,74,39,0.3)] z-10 flex flex-col items-center text-center font-sans"
            >
              <button
                onClick={() => setIsTodoModalOpen(false)}
                className="absolute top-5 right-5 text-[#8C4A27] hover:text-[#241711] text-xs font-sans cursor-pointer font-black"
              >
                ✕
              </button>

              <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 px-4 py-1.5 rounded-full mb-4 shadow-2xs">
                <span className="text-[10px] font-serif tracking-[0.15em] text-[#6B5546] uppercase font-bold">
                  PRODUCTION CHECKLIST
                </span>
              </div>

              <h2 className="text-2xl font-serif tracking-[0.08em] text-[#241711] uppercase font-bold mb-1">
                TODAY'S NARRATIVE
              </h2>
              <p className="text-xs font-serif italic text-[#8C4A27] mb-6 font-medium">
                Focus on the essential steps
              </p>

              {/* Task Add Input inside Modal */}
              <div className="w-full flex gap-2 mb-5">
                <input
                  type="text"
                  value={newTodoInput}
                  onChange={(e) => setNewTodoInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddModalTodo()}
                  placeholder="Add a new step..."
                  className="flex-1 bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-2.5 text-xs font-serif text-[#241711] focus:outline-none"
                />
                <button
                  onClick={handleAddModalTodo}
                  className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-4 py-2.5 rounded-2xl text-xs font-sans font-bold cursor-pointer shadow-xs"
                >
                  + Add
                </button>
              </div>

              {/* Interactive Task List */}
              <div className="w-full space-y-3 mb-6 text-left max-h-[220px] overflow-y-auto pr-1">
                {todoTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTodo(t.id)}
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#F5ECE1] transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 border-[#6B4426] flex items-center justify-center transition-colors ${t.done ? 'bg-[#6B4426]' : 'bg-transparent'}`}>
                      {t.done && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`text-sm font-serif text-[#241711] flex-1 ${t.done ? 'line-through opacity-40' : 'font-medium'}`}>
                      {t.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/todo')}
                className="text-[10px] font-serif tracking-[0.2em] text-[#8C4A27] hover:text-[#241711] uppercase transition-colors cursor-pointer pt-3 border-t-2 border-dashed border-[#8C4A27]/25 w-full font-black"
              >
                Open Full To-Do Page →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERWHELMED BEST-FRIEND THERAPY CHATBOX MODAL */}
      <AnimatePresence>
        {isOverwhelmedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOverwhelmedOpen(false)}
              className="absolute inset-0 bg-[#241711]/50 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-lg bg-[#EADBC8] border-2 border-[#8C4A27]/40 rounded-[36px] p-6 shadow-[10px_10px_0px_0px_rgba(140,74,39,0.3)] z-10 flex flex-col h-[520px] justify-between font-sans"
            >
              {/* Header */}
              <div className="pb-3 border-b-2 border-dashed border-[#8C4A27]/25 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#6B4426] text-[#FAF6F0] flex items-center justify-center text-xs font-bold">
                    🌱
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#241711]">Cinera Best Friend Chat</h3>
                    <span className="text-[10px] font-sans font-bold text-[#8C4A27]">Safe Space • No Pressure</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOverwhelmedOpen(false)}
                  className="text-[#8C4A27] hover:text-[#241711] text-xs font-sans cursor-pointer font-black"
                >
                  ✕
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] p-3.5 rounded-2xl text-xs font-serif leading-relaxed shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-[#6B4426] text-[#FAF6F0] rounded-br-xs font-medium'
                          : 'bg-[#F5ECE1] text-[#241711] border border-[#8C4A27]/20 rounded-bl-xs font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isFriendTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#F5ECE1] border border-[#8C4A27]/20 p-3 rounded-2xl rounded-bl-xs text-xs font-serif italic text-[#8C4A27] animate-pulse">
                      Cinera is typing back...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input & Soft Create Bridge */}
              <div className="pt-3 border-t-2 border-dashed border-[#8C4A27]/25 space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessageToFriend()}
                    placeholder="Talk to Cinera... How are you feeling right now?"
                    className="flex-1 bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-2.5 text-xs font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessageToFriend}
                    className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-4 py-2.5 rounded-2xl text-xs font-sans font-bold cursor-pointer shadow-xs"
                  >
                    Send
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsOverwhelmedOpen(false);
                    const softConcept = chatMessages.find(m => m.sender === 'user')?.text || "A travel vignette shot entirely at 6 AM.";
                    router.push(`/studio/video-generator?mode=overwhelmed&prompt=${encodeURIComponent(softConcept)}`);
                  }}
                  className="w-full bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#6B4426] border border-[#8C4A27]/30 py-2 rounded-2xl text-[11px] font-sans font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>🌱</span>
                  <span>Ready? Build a simple video from our chat →</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATOR PROFILE SETTINGS DRAWER */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onNameChange={(newName) => setUserName(newName)}
      />

      {/* NETWORK / OFFLINE LISTENER SYSTEM */}
      <NetworkErrorHandler />
    </div>
  );
}