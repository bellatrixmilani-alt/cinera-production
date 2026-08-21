'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { supabase } from '@/lib/supabase';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'Shoot Day' | 'Edit Session' | 'Release / Upload' | 'Sponsor Deadline';
  notes?: string;
}

function CalendarContent() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('guest');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentDateView, setCurrentDateView] = useState<Date>(new Date());

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('Shoot Day');
  const [newEventTime, setNewEventTime] = useState('14:00');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const activeUid = data?.user?.id || 'guest';
      setUserId(activeUid);

      const saved = localStorage.getItem(`cinera_calendar_events_${activeUid}`);
      if (saved) {
        try {
          setEvents(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setEvents([]);
      }
    });
  }, []);

  const saveEvents = (updated: CalendarEvent[], uid: string) => {
    setEvents(updated);
    localStorage.setItem(`cinera_calendar_events_${uid}`, JSON.stringify(updated));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      date: selectedDate,
      time: newEventTime,
      type: newEventType,
      notes: newEventNotes.trim(),
    };

    const updated = [newEvent, ...events];
    saveEvents(updated, userId);
    setNewEventTitle('');
    setNewEventNotes('');
    showToast('📅 Session scheduled on calendar!');
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated, userId);
    showToast('🗑️ Event removed.');
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDateView(now);
    setSelectedDate(todayStr);
    showToast('📅 Jumped to current date.');
  };

  const changeMonth = (offset: number) => {
    setCurrentDateView((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return next;
    });
  };

  const currentYear = currentDateView.getFullYear();
  const currentMonth = currentDateView.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = currentDateView.toLocaleString('en-US', { month: 'long' });

  const nextMonthName = new Date(currentYear, currentMonth + 1, 1).toLocaleString('en-US', {
    month: 'short',
  });
  const nextMonthYear = new Date(currentYear, currentMonth + 1, 1).getFullYear();

  const todayEvents = events.filter((e) => e.date === selectedDate);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#FAF6F0] text-[#241711] font-sans selection:bg-[#EADBC8] relative overflow-x-hidden flex flex-col justify-between">
      <FlowerAtmosphere />

      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold z-50 border border-[#FAF6F0]/20">
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-8 relative z-10 flex flex-col gap-6 flex-1">
        
        {/* HEADER WITH FUNCTIONAL BUTTONS */}
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
                PRODUCTION CADENCE
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#241711]">
                Production & Release Calendar
              </h1>
            </div>
          </div>

          {/* ACTIVE ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={jumpToToday}
              className="bg-[#EADBC8] hover:bg-[#DFCEB9] text-[#6B4426] border border-[#8C4A27]/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="bg-[#EADBC8] hover:bg-[#DFCEB9] text-[#6B4426] border border-[#8C4A27]/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Plan {nextMonthName} {nextMonthYear} →
            </button>
            <button
              onClick={() => {
                document.getElementById('event-title-input')?.focus();
              }}
              className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Schedule Session</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* MONTH CALENDAR VIEW */}
          <div className="md:col-span-7 bg-[#EADBC8]/70 border border-[#8C4A27]/25 rounded-[28px] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif font-bold text-[#241711]">
                  {monthName} {currentYear}
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="w-8 h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBC8] border border-[#8C4A27]/20 flex items-center justify-center text-xs font-bold text-[#6B4426] cursor-pointer"
                    title="Previous Month"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="w-8 h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBC8] border border-[#8C4A27]/20 flex items-center justify-center text-xs font-bold text-[#6B4426] cursor-pointer"
                    title="Next Month"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <span key={d} className="text-[9px] font-mono uppercase font-bold text-[#8C4A27] pb-1">
                    {d}
                  </span>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const dayEvents = events.filter((e) => e.date === dateStr);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-11 sm:h-12 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer flex flex-col items-center justify-between p-1 ${
                        isSelected
                          ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-xs'
                          : 'bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 text-[#241711] border-[#8C4A27]/15'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5">
                          {dayEvents.slice(0, 3).map((e) => (
                            <span
                              key={e.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-[#FAF6F0]' : 'bg-[#6B4426]'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DAY DETAILS & ADD EVENT FORM */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-[28px] p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#8C4A27]/15">
                <span className="text-xs font-serif font-bold text-[#241711]">
                  Scheduled for {selectedDate}
                </span>
                <span className="text-[10px] font-mono text-[#8C4A27] font-bold">
                  {todayEvents.length} Sessions
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {todayEvents.length === 0 ? (
                  <p className="text-xs font-serif italic text-[#8C4A27]/70 py-4 text-center">
                    No production events scheduled on this date.
                  </p>
                ) : (
                  todayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-[#EADBC8]/50 border border-[#8C4A27]/20 rounded-2xl flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase text-[#8C4A27] bg-[#FAF6F0] px-2 py-0.5 rounded-md">
                          {event.type} • {event.time}
                        </span>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-[#8C4A27] hover:text-red-700 font-bold text-xs cursor-pointer px-1"
                        >
                          ×
                        </button>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-[#241711]">{event.title}</h4>
                      {event.notes && (
                        <p className="text-[11px] font-serif text-[#241711]/80 italic">"{event.notes}"</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ADD EVENT FORM */}
            <form
              onSubmit={handleAddEvent}
              className="bg-[#EADBC8]/70 border border-[#8C4A27]/25 rounded-[28px] p-5 shadow-xs flex flex-col gap-3"
            >
              <span className="text-[10px] font-mono uppercase font-bold text-[#8C4A27] tracking-wider">
                + BOOK EVENT ON THIS DATE
              </span>

              <input
                id="event-title-input"
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title..."
                className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-2 text-xs font-serif text-[#241711] focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-2.5 py-1.5 text-xs font-serif text-[#241711] focus:outline-none cursor-pointer"
                >
                  <option value="Shoot Day">🎥 Shoot Day</option>
                  <option value="Edit Session">✂️ Edit Session</option>
                  <option value="Release / Upload">🚀 Upload Day</option>
                  <option value="Sponsor Deadline">💼 Sponsor</option>
                </select>

                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#241711] focus:outline-none"
                />
              </div>

              <input
                type="text"
                value={newEventNotes}
                onChange={(e) => setNewEventNotes(e.target.value)}
                placeholder="Optional notes..."
                className="bg-[#FAF6F0] border border-[#8C4A27]/20 rounded-xl px-3 py-2 text-xs font-serif text-[#241711] focus:outline-none"
              />

              <button
                type="submit"
                disabled={!newEventTitle.trim()}
                className="bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-40 text-[#FAF6F0] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                Save Session
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-5xl mx-auto px-5 py-4 border-t border-[#8C4A27]/15 flex items-center justify-between text-[10px] font-mono text-[#8C4A27]/70 uppercase relative z-10">
        <span>CINERA PRODUCTION CALENDAR</span>
        <span className="flex items-center gap-1.5">
          <span>SHOOT CADENCE</span>
          <FlowerDoodle size={16} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
        </span>
      </footer>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-8 font-serif">Loading Calendar...</div>}>
      <CalendarContent />
    </Suspense>
  );
}