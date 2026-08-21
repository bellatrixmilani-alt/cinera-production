'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  text: string;
  category: 'Pre-Production' | 'Filming' | 'Editing' | 'Distribution';
  timeEstimate: 'Quick Win (<15m)' | 'Focused Block (1-2h)' | 'Deep Work (Half Day)';
  bucket: 'today' | 'tomorrow' | 'weekend' | 'upcoming';
  done: boolean;
  steps?: string[];
  isGeneratingSteps?: boolean;
}

function TodoStudioContent() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBucket, setActiveBucket] = useState<'today' | 'tomorrow' | 'weekend' | 'upcoming'>('today');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>('Pre-Production');
  const [newTaskTime, setNewTaskTime] = useState<Task['timeEstimate']>('Quick Win (<15m)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadUserTasks() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) {
          setUserId(null);
          setTasks([]);
          setIsLoading(false);
        }
        return;
      }

      const uid = user.id;
      if (isMounted) setUserId(uid);

      const saved = localStorage.getItem(`cinera_tasks_full_${uid}`);
      if (saved) {
        try {
          if (isMounted) setTasks(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing tasks', e);
          if (isMounted) setTasks([]);
        }
      } else {
        if (isMounted) setTasks([]);
      }

      if (isMounted) setIsLoading(false);
    }

    loadUserTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveTasks = (updated: Task[], uid: string) => {
    setTasks(updated);
    localStorage.setItem(`cinera_tasks_full_${uid}`, JSON.stringify(updated));

    const studioTodos = updated
      .filter((t) => t.bucket === 'today')
      .map((t) => ({ id: t.id, text: t.text, done: t.done }));
    localStorage.setItem(`cinera_active_todos_${uid}`, JSON.stringify(studioTodos));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !userId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      category: newTaskCategory,
      timeEstimate: newTaskTime,
      bucket: activeBucket,
      done: false,
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated, userId);
    setNewTaskText('');
    showToast('✓ Task added to schedule.');
  };

  const handleAddQuickSuggestion = (
    text: string,
    category: Task['category'],
    timeEstimate: Task['timeEstimate']
  ) => {
    if (!userId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text,
      category,
      timeEstimate,
      bucket: activeBucket,
      done: false,
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated, userId);
    showToast(`✓ Added "${text}" to ${activeBucket}!`);
  };

  const toggleTask = (id: string) => {
    if (!userId) return;
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTasks(updated, userId);
  };

  const deleteTask = (id: string) => {
    if (!userId) return;
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated, userId);
    showToast('🗑️ Task removed.');
  };

  const handleGenerateSteps = async (task: Task) => {
    if (!userId) return;
    const updated = tasks.map((t) => (t.id === task.id ? { ...t, isGeneratingSteps: true } : t));
    setTasks(updated);

    try {
      const res = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Deconstruct this creator task into 3 short, concrete, sequential sub-steps: "${task.text}"`,
            },
          ],
        }),
      });

      const data = await res.json();
      const rawText: string = data.reply || '';
      const lines = rawText
        .split('\n')
        .map((l) => l.replace(/^[0-9*.-]+\s*/, '').trim())
        .filter((l) => l.length > 5)
        .slice(0, 3);

      const finalTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, steps: lines, isGeneratingSteps: false } : t
      );
      saveTasks(finalTasks, userId);
      showToast('✨ AI steps generated!');
    } catch {
      showToast('⚠️ Could not generate steps.');
      const finalTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, isGeneratingSteps: false } : t
      );
      setTasks(finalTasks);
    }
  };

  const currentBucketTasks = tasks.filter((t) => t.bucket === activeBucket);
  const doneCount = currentBucketTasks.filter((t) => t.done).length;
  const totalCount = currentBucketTasks.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] text-[#241711] font-sans selection:bg-[#EADBC8] relative overflow-x-hidden flex flex-col justify-between">
      <FlowerAtmosphere />

      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold z-50 border border-[#FAF6F0]/20">
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-8 relative z-10 flex flex-col gap-6 flex-1">
        {/* HEADER */}
        <header className="flex items-center justify-between pb-4 border-b border-[#8C4A27]/20">
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
                TASK DECOMPOSER
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#241711]">
                Production Routine & To-Do
              </h1>
            </div>
          </div>
        </header>

        {/* TIME BUCKET TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {(['today', 'tomorrow', 'weekend', 'upcoming'] as const).map((bucket) => {
            const count = tasks.filter((t) => t.bucket === bucket && !t.done).length;
            return (
              <button
                key={bucket}
                onClick={() => setActiveBucket(bucket)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-2 shrink-0 ${
                  activeBucket === bucket
                    ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-xs'
                    : 'bg-[#EADBC8]/60 hover:bg-[#EADBC8] text-[#8C4A27] border-[#8C4A27]/20'
                }`}
              >
                <span>{bucket}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF6F0]/20">
                  {count} left
                </span>
              </button>
            );
          })}
        </div>

        {/* PROGRESS BAR */}
        {totalCount > 0 && (
          <div className="bg-[#EADBC8]/70 border border-[#8C4A27]/20 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-serif font-bold text-[#241711]">
              <span>🎯 {doneCount} of {totalCount} {activeBucket} tasks completed</span>
              <span className="font-mono text-[#8C4A27]">{percent}% Complete</span>
            </div>
            <div className="w-full h-2 bg-[#FAF6F0] rounded-full overflow-hidden">
              <div
                style={{ width: `${percent}%` }}
                className="h-full bg-[#6B4426] transition-all duration-300 rounded-full"
              />
            </div>
          </div>
        )}

        {/* QUICK SUGGESTION CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { text: 'Record B-Roll cutaways', cat: 'Filming' as const, time: 'Focused Block (1-2h)' as const },
            { text: 'Check audio level calibration', cat: 'Pre-Production' as const, time: 'Quick Win (<15m)' as const },
            { text: 'Grade color profile & LUTs', cat: 'Editing' as const, time: 'Focused Block (1-2h)' as const },
            { text: 'Source background music & SFX', cat: 'Editing' as const, time: 'Quick Win (<15m)' as const },
          ].map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => handleAddQuickSuggestion(s.text, s.cat, s.time)}
              className="text-[11px] font-sans font-bold text-[#8C4A27] bg-[#EADBC8]/70 hover:bg-[#EADBC8] px-3 py-1.5 rounded-full border border-[#8C4A27]/20 whitespace-nowrap transition-all cursor-pointer shrink-0 hover:scale-102 shadow-2xs"
            >
              + {s.text}
            </button>
          ))}
        </div>

        {/* ADD TASK FORM */}
        <form
          onSubmit={handleAddTask}
          className="bg-[#EADBC8]/80 backdrop-blur-md border border-[#8C4A27]/25 rounded-[24px] p-4 flex flex-col gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8C4A27]">✦</span>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder={`Add a new task for ${activeBucket}...`}
              className="flex-1 bg-transparent text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none min-w-0"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#8C4A27]/15">
            <div className="flex items-center gap-2">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-1.5 text-xs font-serif text-[#241711] focus:outline-none cursor-pointer"
              >
                <option value="Pre-Production">Pre-Production</option>
                <option value="Filming">Filming</option>
                <option value="Editing">Editing</option>
                <option value="Distribution">Distribution</option>
              </select>

              <select
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value as any)}
                className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-1.5 text-xs font-serif text-[#241711] focus:outline-none cursor-pointer"
              >
                <option value="Quick Win (<15m)">⚡ Quick Win (&lt;15m)</option>
                <option value="Focused Block (1-2h)">⏱ Focused Block (1-2h)</option>
                <option value="Deep Work (Half Day)">🔋 Deep Work (Half Day)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!newTaskText.trim()}
              className="bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-40 text-[#FAF6F0] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs shrink-0"
            >
              + Add to {activeBucket}
            </button>
          </div>
        </form>

        {/* TASK LIST CONTAINER */}
        <main className="space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-serif italic text-[#8C4A27]">
              Loading your workspace...
            </div>
          ) : currentBucketTasks.length === 0 ? (
            <div className="bg-[#EADBC8]/30 border-2 border-dashed border-[#8C4A27]/20 rounded-[24px] p-8 text-center flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">🌱</span>
              <h4 className="text-sm font-serif font-bold text-[#241711]">No tasks scheduled for {activeBucket}</h4>
              <p className="text-xs font-serif text-[#8C4A27]">
                Add your filming or editing milestones above to get started.
              </p>
            </div>
          ) : (
            currentBucketTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-[#FAF6F0] border rounded-[22px] p-4 transition-all flex flex-col gap-2.5 ${
                  task.done
                    ? 'border-[#8C4A27]/15 opacity-70 bg-[#FAF6F0]/60'
                    : 'border-[#8C4A27]/25 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 accent-[#6B4426] rounded cursor-pointer shrink-0"
                    />
                    <span
                      className={`text-xs sm:text-sm font-serif font-medium truncate ${
                        task.done ? 'line-through text-[#8C4A27]/50' : 'text-[#241711]'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleGenerateSteps(task)}
                      disabled={task.isGeneratingSteps}
                      className="text-[10px] font-sans font-bold text-[#8C4A27] bg-[#EADBC8] hover:bg-[#DFCEB9] px-2.5 py-1 rounded-lg border border-[#8C4A27]/20 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>✦</span>
                      <span>{task.isGeneratingSteps ? 'Generating...' : 'Steps'}</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-[#8C4A27] hover:text-red-700 font-bold text-sm px-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-8">
                  <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] bg-[#EADBC8]/60 px-2 py-0.5 rounded-md">
                    {task.category}
                  </span>
                  <span className="text-[9px] font-mono text-[#8C4A27]/80">
                    {task.timeEstimate}
                  </span>
                </div>

                {task.steps && task.steps.length > 0 && (
                  <div className="ml-8 mt-1 p-3 bg-[#EADBC8]/40 border border-[#8C4A27]/15 rounded-xl space-y-1.5 text-xs font-serif text-[#241711]">
                    <span className="text-[9px] font-mono uppercase font-bold text-[#8C4A27] block">
                      AI DECONSTRUCTION:
                    </span>
                    {task.steps.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#8C4A27] font-bold">{idx + 1}.</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>

      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 border-t border-[#8C4A27]/15 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#8C4A27]/70 uppercase relative z-10">
        <span>CINERA TASK DECOMPOSER</span>
        <span className="flex items-center gap-1.5">
          <span>CALM CADENCE</span>
          <FlowerDoodle size={16} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
        </span>
      </footer>
    </div>
  );
}

export default function TodoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-8 font-serif">Loading Tasks...</div>}>
      <TodoStudioContent />
    </Suspense>
  );
}