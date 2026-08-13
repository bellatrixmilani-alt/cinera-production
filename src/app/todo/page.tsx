'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSpark } from '../../lib/sparks';

interface TodoTask {
  id: number;
  text: string;
  category: 'PRE-PRODUCTION' | 'FILMING' | 'EDITING' | 'PUBLISHING';
  done: boolean;
  dueDate?: string;
}

export default function TodoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState<'ALL' | 'PRE-PRODUCTION' | 'FILMING' | 'EDITING' | 'PUBLISHING'>('ALL');
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'PRE-PRODUCTION' | 'FILMING' | 'EDITING' | 'PUBLISHING'>('PRE-PRODUCTION');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stored Tasks State
  const [tasks, setTasks] = useState<TodoTask[]>([
    { id: 1, text: 'Scout 6 AM location at Nairobi CBD', category: 'PRE-PRODUCTION', done: true },
    { id: 2, text: 'Record B-roll of morning mist & traffic reflections', category: 'FILMING', done: false },
    { id: 3, text: 'Apply 35mm warm film grain preset in DaVinci', category: 'EDITING', done: false },
    { id: 4, text: 'Draft high-curiosity YouTube hook description', category: 'PUBLISHING', done: false },
  ]);

  useEffect(() => {
    const incomingIdea = searchParams.get('idea');
    if (incomingIdea) {
      setNewTaskText(incomingIdea);
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cinera_todo_list');
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [searchParams]);

  const saveTasksToStorage = (updated: TodoTask[]) => {
    setTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_todo_list', JSON.stringify(updated));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add Task
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: TodoTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      category: selectedCategory,
      done: false,
    };
    saveTasksToStorage([newTask, ...tasks]);
    setNewTaskText('');
  };

  // Toggle Done State
  const toggleTask = (id: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTasksToStorage(updated);
  };

  // Delete Task
  const deleteTask = (id: number) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasksToStorage(updated);
  };

  // Save Task to Spark Repository
  const handleSaveToSpark = (text: string) => {
    saveSpark(text, 'To-Do Task');
    showToast('💡 Saved as a Spark! Viewable on your Studio desk.');
  };

  // Schedule Task to Calendar
  const handleScheduleToCalendar = (text: string) => {
    router.push(`/calendar?idea=${encodeURIComponent(text)}`);
  };

  // Filtered List
  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter((t) => t.category === filter);
  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen w-full bg-[#F5ECE1] text-[#241711] p-6 sm:p-12 font-sans relative overflow-x-hidden">
      
      {/* Toast Notification */}
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

      {/* 01 — HEADER BAR (Clean Bold Title Typography) */}
      <header className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-dashed border-[#8C4A27]/25">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/studio')}
            className="w-11 h-11 rounded-full bg-[#EADBC8] border-2 border-[#8C4A27]/30 hover:bg-[#DFCEB9] flex items-center justify-center text-sm font-bold text-[#241711] transition-transform hover:-translate-x-1 cursor-pointer shadow-2xs font-sans"
          >
            ←
          </button>
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black block mb-1">
              PRODUCTION CHECKLIST
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#241711] tracking-tight mt-0.5">
              To-Do & Action Items
            </h1>
          </div>
        </div>

        {/* Progress Tracker Pill */}
        <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div>
            <span className="text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider block">
              PROGRESS: {completedCount} / {tasks.length} DONE
            </span>
            <div className="w-40 bg-[#F5ECE1] h-2.5 rounded-full overflow-hidden mt-1.5 border border-[#8C4A27]/20">
              <div
                className="bg-[#6B4426] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-xl font-serif font-bold text-[#241711]">
            {progressPercentage}%
          </span>
        </div>
      </header>

      {/* 02 — TASK INPUT DOCK (Light Pill Outlines) */}
      <section className="w-full max-w-3xl mx-auto mb-10">
        <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-3xl p-3 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(140,74,39,0.3)] transition-all flex flex-col sm:flex-row items-center gap-3">
          
          {/* Category Dropdown Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#F5ECE1] text-[#6B4426] text-xs font-sans font-black px-3.5 py-2.5 rounded-2xl border-2 border-[#8C4A27]/25 focus:outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="PRE-PRODUCTION">Pre-Production</option>
            <option value="FILMING">Filming</option>
            <option value="EDITING">Editing</option>
            <option value="PUBLISHING">Publishing</option>
          </select>

          {/* Text Input */}
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Add production step or task (e.g. 'Record voiceover narration')..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none px-2 w-full font-medium"
          />

          <button
            onClick={handleAddTask}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-6 py-2.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-all shadow-sm cursor-pointer w-full sm:w-auto"
          >
            + Add Task
          </button>
        </div>
      </section>

      {/* 03 — CATEGORY FILTER TABS (Light Pill Outlines) */}
      <section className="w-full max-w-5xl mx-auto flex flex-wrap gap-2.5 justify-center mb-8">
        {(['ALL', 'PRE-PRODUCTION', 'FILMING', 'EDITING', 'PUBLISHING'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-sans font-bold transition-all cursor-pointer border-2 ${
              filter === cat
                ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-[3px_3px_0px_0px_#A6633C]'
                : 'bg-[#EADBC8] text-[#8C4A27] border-[#8C4A27]/25 hover:bg-[#DFCEB9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 04 — TASKS LIST */}
      <main className="w-full max-w-4xl mx-auto space-y-3 mb-12">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <div className="bg-[#EADBC8] border-2 border-dashed border-[#8C4A27]/30 rounded-3xl p-10 text-center font-serif text-[#8C4A27] italic font-medium">
              No tasks listed under this category. Add one above!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-[#EADBC8] border-2 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[4px_4px_0px_0px_rgba(140,74,39,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(140,74,39,0.25)] ${
                  task.done ? 'border-[#8C4A27]/20 opacity-60 bg-[#EADBC8]/60' : 'border-[#8C4A27]/35'
                }`}
              >
                {/* Left: Checkbox + Text + Badge */}
                <div className="flex items-center gap-3.5 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 border-[#6B4426] flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.done ? 'bg-[#6B4426]' : 'bg-transparent hover:border-[#8C4A27]'
                    }`}
                  >
                    {task.done && <span className="text-white text-xs font-bold">✓</span>}
                  </button>

                  <div>
                    <p className={`text-sm font-serif text-[#241711] font-medium ${task.done ? 'line-through text-[#8C4A27]' : ''}`}>
                      {task.text}
                    </p>
                    <span className="text-[9px] font-sans font-black text-[#8C4A27] tracking-wider uppercase bg-[#FAF6F0] border border-[#8C4A27]/20 px-2 py-0.5 rounded-full inline-block mt-1">
                      {task.category}
                    </span>
                  </div>
                </div>

                {/* Right Action Triggers: Save to Spark, Schedule, Delete */}
                <div className="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#8C4A27]/20 justify-end">
                  <button
                    onClick={() => handleSaveToSpark(task.text)}
                    title="Save to Sparks"
                    className="bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#241711] px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold cursor-pointer transition-colors border border-[#8C4A27]/20 flex items-center gap-1 shadow-2xs"
                  >
                    <span>💡</span>
                    <span>Spark</span>
                  </button>

                  <button
                    onClick={() => handleScheduleToCalendar(task.text)}
                    title="Schedule on Calendar"
                    className="bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#241711] px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold cursor-pointer transition-colors border border-[#8C4A27]/20 flex items-center gap-1 shadow-2xs"
                  >
                    <span>📅</span>
                    <span>Calendar</span>
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-[#8C4A27] hover:text-[#241711] p-1.5 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}