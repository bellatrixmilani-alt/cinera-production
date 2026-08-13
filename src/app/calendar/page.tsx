'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSpark } from '../../lib/sparks';

interface CalendarTask {
  id: number;
  dateNum: number;
  title: string;
  desc?: string;
  icon: string;
  color: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // Active Selected Date for Task Creation
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stored Tasks State
  const [tasks, setTasks] = useState<CalendarTask[]>([
    { id: 1, dateNum: 4, title: 'Film morning vlog', desc: 'Golden hour lighting', icon: '🎥', color: '#D8C3B0' },
    { id: 2, dateNum: 13, title: 'Edit B-roll sequence', desc: '35mm grain applied', icon: '💻', color: '#B8BEB0' },
    { id: 3, dateNum: 20, title: 'Podcast recording', desc: 'Episode 04 guest session', icon: '🎙', color: '#D2A89B' },
  ]);

  // Task Creation Form State
  const [selectedIcon, setSelectedIcon] = useState('📷');
  const [selectedColor, setSelectedColor] = useState('#D8C3B0');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  // Curated Neutral Pastel Palette
  const neutralPastels = [
    { name: 'Warm Latte', hex: '#E6DFD5' },
    { name: 'Walnut', hex: '#D8C3B0' },
    { name: 'Soft Sand', hex: '#C5B4A1' },
    { name: 'Dusty Rose', hex: '#D2A89B' },
    { name: 'Sage Green', hex: '#B8BEB0' },
    { name: 'Muted Slate', hex: '#A8B3C0' },
    { name: 'Earthy Ochre', hex: '#D9BE9B' },
    { name: 'Espresso Tint', hex: '#4A3B32' },
  ];

  // Curated Aesthetic Stickers
  const stickers = ['📷', '🎥', '🎙', '☕', '💡', '📚', '🎨', '🎬', '✈️', '💻', '🌿', '✨'];

  // Handle incoming idea parameter from Refiner
  useEffect(() => {
    const incomingIdea = searchParams.get('idea');
    if (incomingIdea) {
      setSelectedDate(4);
      setTaskTitle(incomingIdea);
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cinera_calendar_events');
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const saveTasksToStorage = (updated: CalendarTask[]) => {
    setTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_calendar_events', JSON.stringify(updated));
    }
  };

  const handleDateClick = (dateNum: number) => {
    setSelectedDate(dateNum);
  };

  const handleSaveTask = () => {
    if (!taskTitle || selectedDate === null) return;
    const newTask: CalendarTask = {
      id: Date.now(),
      dateNum: selectedDate,
      title: taskTitle,
      desc: taskDesc,
      icon: selectedIcon,
      color: selectedColor,
    };
    saveTasksToStorage([...tasks, newTask]);
    setTaskTitle('');
    setTaskDesc('');
    setSelectedDate(null);
  };

  // SAVE DIRECTLY TO SPARKS FROM CALENDAR MODAL
  const handleSaveCalendarTaskToSpark = () => {
    if (!taskTitle) return;
    const sparkContent = `${selectedIcon} ${taskTitle}${taskDesc ? ` — ${taskDesc}` : ''}`;
    saveSpark(sparkContent);
    showToast('💡 Saved to Sparks! It will now show on your Studio desk.');
  };

  return (
    <div className="min-h-screen w-full bg-[#F5ECE1] p-6 sm:p-12 font-sans text-[#241711] relative overflow-x-hidden">
      
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

      {/* 01 — HEADER BAR (Clean Bold Title Typography & Light Controls) */}
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
              CREATIVE SCHEDULE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#241711] tracking-tight mt-0.5">
              Content Calendar
            </h1>
          </div>
        </div>

        {/* Month Selector Controls Pill */}
        <div className="flex items-center gap-3 bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-full px-5 py-2.5 text-xs font-sans text-[#241711] shadow-2xs font-bold">
          <button className="hover:text-[#8C4A27] cursor-pointer font-bold text-sm">&lt;</button>
          <span className="font-serif font-bold text-sm px-2 text-[#6B4426]">December 2026</span>
          <button className="hover:text-[#8C4A27] cursor-pointer font-bold text-sm">&gt;</button>
        </div>
      </header>

      {/* 02 — DAYS OF WEEK HEADER */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-7 gap-2 sm:gap-4 text-center mb-4">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-xs sm:text-sm font-serif font-bold text-[#6B4426] tracking-widest uppercase">
            {day}
          </span>
        ))}
      </div>

      {/* 03 — 31-DAY INTERACTIVE GRID */}
      <main className="w-full max-w-6xl mx-auto grid grid-cols-7 gap-2.5 sm:gap-4">
        {calendarDays.map((dateNum) => {
          const dayTasks = tasks.filter((t) => t.dateNum === dateNum);
          return (
            <motion.div
              key={dateNum}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDateClick(dateNum)}
              className="bg-[#EADBC8] hover:bg-[#FAF6F0] border-2 border-[#8C4A27]/25 rounded-2xl p-2.5 sm:p-4 min-h-[110px] sm:min-h-[135px] flex flex-col justify-between transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(140,74,39,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(140,74,39,0.25)] hover:border-[#8C4A27]/50 group relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs sm:text-sm font-sans font-black text-[#241711]">
                  {dateNum}
                </span>
                {dayTasks.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#8C4A27] animate-pulse" />
                )}
              </div>

              {/* Pastel Labels Grid */}
              <div className="space-y-1.5 my-1 overflow-y-auto max-h-[75px] pr-0.5">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    style={{ backgroundColor: t.color, color: t.color === '#4A3B32' ? '#FAF6F0' : '#241711' }}
                    className="text-[10px] font-sans font-bold px-2 py-1 rounded-xl truncate flex items-center gap-1 shadow-2xs border border-[#8C4A27]/15 transition-transform hover:scale-102"
                  >
                    <span>{t.icon}</span>
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
              </div>

              <span className="text-[10px] sm:text-xs font-sans text-[#8C4A27] font-black group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-auto pt-1">
                + Add
              </span>
            </motion.div>
          );
        })}
      </main>

      {/* 04 — SCHEDULER MODAL WITH LIGHT PILLS */}
      <AnimatePresence>
        {selectedDate !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
              className="absolute inset-0 bg-[#241711]/50 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              className="relative w-full max-w-md bg-[#EADBC8] border-2 border-[#8C4A27]/40 rounded-[36px] p-8 shadow-[10px_10px_0px_0px_rgba(140,74,39,0.3)] z-10 text-left font-sans"
            >
              <button
                onClick={() => setSelectedDate(null)}
                className="absolute top-6 right-6 text-[#8C4A27] hover:text-[#241711] text-xs font-sans font-black cursor-pointer"
              >
                ✕
              </button>

              <div className="inline-block bg-[#FAF6F0] border border-[#8C4A27]/25 px-4 py-1.5 rounded-full mb-4 shadow-2xs">
                <span className="text-[10px] font-serif tracking-[0.15em] text-[#8C4A27] uppercase font-bold">
                  DECEMBER {selectedDate}, 2026
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-[#241711] mb-5">
                Schedule Creative Task
              </h3>

              {/* Sticker Selector */}
              <label className="block text-xs font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-2">
                Choose Sticker / Icon
              </label>
              <div className="flex flex-wrap gap-2 mb-5 p-2.5 bg-[#F5ECE1] rounded-2xl border border-[#8C4A27]/20">
                {stickers.map((stk) => (
                  <button
                    key={stk}
                    onClick={() => setSelectedIcon(stk)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                      selectedIcon === stk
                        ? 'bg-[#FAF6F0] scale-110 shadow-sm border border-[#8C4A27]/40'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>

              {/* Neutral Pastel Color Picker */}
              <label className="block text-xs font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-2">
                Choose Neutral Pastel Tag
              </label>
              <div className="grid grid-cols-4 gap-2.5 mb-6">
                {neutralPastels.map((p) => (
                  <button
                    key={p.hex}
                    onClick={() => setSelectedColor(p.hex)}
                    className={`h-9 rounded-xl transition-all cursor-pointer border flex items-center justify-center shadow-2xs ${
                      selectedColor === p.hex
                        ? 'ring-2 ring-[#6B4426] ring-offset-2 scale-105 border-transparent'
                        : 'border-[#8C4A27]/20 hover:scale-102'
                    }`}
                    style={{ backgroundColor: p.hex }}
                  >
                    {selectedColor === p.hex && (
                      <span className={p.hex === '#4A3B32' ? 'text-white text-xs font-bold' : 'text-[#241711] text-xs font-bold'}>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Title Input */}
              <label className="block text-xs font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Eg, Film morning vlog..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none mb-4 font-serif font-medium"
              />

              {/* Description Input */}
              <label className="block text-xs font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                Notes & Details
              </label>
              <textarea
                rows={2}
                placeholder="Add camera notes, location, or script details..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-3 text-xs text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none resize-none mb-5 font-serif font-medium"
              />

              {/* SAVE TO SPARKS BUTTON */}
              <button
                type="button"
                onClick={handleSaveCalendarTaskToSpark}
                className="w-full bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#241711] border border-[#8C4A27]/25 py-2.5 rounded-2xl text-xs font-sans font-bold cursor-pointer transition-colors mb-4 flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>💡</span>
                <span>Save to Sparks</span>
              </button>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDate(null)}
                  className="flex-1 border border-[#8C4A27]/30 hover:bg-[#F5ECE1] text-[#241711] py-3.5 rounded-2xl text-xs font-sans font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="flex-1 bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans font-bold cursor-pointer transition-colors shadow-md"
                >
                  Save to Calendar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}