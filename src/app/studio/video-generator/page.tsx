'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { saveSpark } from '@/lib/sparks';
import { supabase } from '@/lib/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  platform: 'YouTube' | 'TikTok/Reels' | 'Podcast' | 'Brand/Ad';
  messages: Message[];
  updatedAt: number;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey! I'm your Cinera Creative Director & Concept Producer. What story are we telling today? Drop a rough topic, a personal challenge, or an unpolished premise.",
  timestamp: 'Just now',
};

function VideoGeneratorChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState<string>('guest');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [platform, setPlatform] = useState<'YouTube' | 'TikTok/Reels' | 'Podcast' | 'Brand/Ad'>('YouTube');
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCreatorProfile = (uid: string) => {
    if (typeof window === 'undefined') return null;
    const raw =
      localStorage.getItem(`cinera_creator_profile_${uid}`) ||
      localStorage.getItem('cinera_creator_profile');
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

      const saved = localStorage.getItem(`cinera_chat_sessions_${activeUid}`);
      if (saved) {
        try {
          const parsed: ChatSession[] = JSON.parse(saved);
          setSessions(parsed);
          if (parsed.length > 0) {
            const latest = parsed[0];
            setActiveSessionId(latest.id);
            setMessages(latest.messages);
            setPlatform(latest.platform);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setSessions([]);
      setActiveSessionId(Date.now().toString());
      setMessages([DEFAULT_WELCOME_MESSAGE]);
    });
  }, []);

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      sendMessage(urlPrompt);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const saveCurrentSession = (
    updatedMessages: Message[],
    updatedPlatform: typeof platform,
    currentUid: string
  ) => {
    if (!activeSessionId) return;

    setSessions((prevSessions) => {
      const userFirstMsg = updatedMessages.find((m) => m.role === 'user');
      const title = userFirstMsg
        ? userFirstMsg.content.slice(0, 32) + (userFirstMsg.content.length > 32 ? '...' : '')
        : 'New Concept Session';

      const existingIndex = prevSessions.findIndex((s) => s.id === activeSessionId);
      let newSessions: ChatSession[];

      if (existingIndex >= 0) {
        newSessions = [...prevSessions];
        newSessions[existingIndex] = {
          ...newSessions[existingIndex],
          title,
          platform: updatedPlatform,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
      } else {
        const newSession: ChatSession = {
          id: activeSessionId,
          title,
          platform: updatedPlatform,
          messages: updatedMessages,
          updatedAt: Date.now(),
        };
        newSessions = [newSession, ...prevSessions];
      }

      newSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(`cinera_chat_sessions_${currentUid}`, JSON.stringify(newSessions));
      return newSessions;
    });
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const initialMessages = [DEFAULT_WELCOME_MESSAGE];
    setActiveSessionId(newId);
    setMessages(initialMessages);
    setIsSidebarOpen(false);
  };

  const switchSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setPlatform(session.platform);
    setIsSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem(`cinera_chat_sessions_${userId}`, JSON.stringify(updated));
    if (activeSessionId === id) {
      if (updated.length > 0) {
        switchSession(updated[0]);
      } else {
        createNewSession();
      }
    }
  };

  const sendMessage = async (customText?: string) => {
    const userText = (customText || input).trim();
    if (!userText || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantPlaceholderId = (Date.now() + 1).toString();
    const assistantPlaceholder: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const historyWithUser = [...messages, userMessage];
    const initialRenderHistory = [...historyWithUser, assistantPlaceholder];

    setMessages(initialRenderHistory);
    setInput('');
    setIsStreaming(true);

    try {
      const profile = getCreatorProfile(userId);

      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyWithUser.map((m) => ({ role: m.role, content: m.content })),
          platform,
          creatorProfile: profile,
        }),
      });

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Streaming connection interrupted');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedAccumulator = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        streamedAccumulator += textChunk;

        setMessages((prevMessages) => {
          const next = [...prevMessages];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].id === assistantPlaceholderId) {
            next[lastIdx] = {
              ...next[lastIdx],
              content: streamedAccumulator,
            };
          }
          return next;
        });
      }

      const finalCompletedHistory = [
        ...historyWithUser,
        {
          ...assistantPlaceholder,
          content: streamedAccumulator,
        },
      ];
      saveCurrentSession(finalCompletedHistory, platform, userId);
    } catch (err: any) {
      console.error(err);
      showToast(`⚠️ ${err.message || 'Could not reach Cinera stream'}`);
      setMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (lastIdx >= 0 && next[lastIdx].id === assistantPlaceholderId) {
          next[lastIdx] = {
            ...next[lastIdx],
            content: '⚠️ Connection lost while streaming. Let’s try that prompt again.',
          };
        }
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#241711] flex font-sans selection:bg-[#EADBC8] overflow-hidden relative">
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

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#EADBC8]/90 backdrop-blur-md border-r-2 border-[#8C4A27]/20 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#8C4A27]/20 mb-4">
            <button
              onClick={() => router.push('/studio')}
              className="text-xs font-black uppercase text-[#8C4A27] tracking-wider hover:text-[#6B4426] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>←</span>
              <span>Back to Studio</span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-[#8C4A27] font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <button
            onClick={createNewSession}
            className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3 px-4 rounded-2xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mb-5 hover:scale-102"
          >
            <span>+</span>
            <span>New Concept Session</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#8C4A27] uppercase font-black block px-2 mb-1">
              PAST SESSIONS
            </span>

            {sessions.length === 0 ? (
              <p className="text-xs font-serif italic text-[#8C4A27]/70 px-2">No previous brainstorms yet.</p>
            ) : (
              sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => switchSession(s)}
                    className={`group w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                      isActive
                        ? 'bg-[#FAF6F0] text-[#241711] font-bold border-[#8C4A27]/30 shadow-xs'
                        : 'text-[#241711]/80 hover:bg-[#DFCEB9] border-transparent'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate">{s.title}</p>
                      <span className="text-[9px] font-mono text-[#8C4A27] uppercase">{s.platform}</span>
                    </div>
                    <button
                      onClick={(e) => deleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-[#8C4A27] hover:text-red-700 font-bold px-1.5 transition-opacity cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-[#8C4A27]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse"></span>
              <span className="text-[11px] font-sans font-bold text-[#8C4A27]">Cinera Stream Engine</span>
            </div>
            <FlowerDoodle size={22} colorFill="#F0B8C0" colorInner="#DE919B" colorCenter="#C26A75" />
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-20">
        <header className="px-6 py-4 border-b border-[#8C4A27]/15 flex items-center justify-between bg-[#FAF6F0]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#EADBC8] border border-[#8C4A27]/20 flex items-center justify-center text-xs font-bold text-[#241711]"
            >
              ☰
            </button>
            <button
              onClick={() => router.push('/studio')}
              className="hidden sm:flex w-9 h-9 rounded-full bg-[#EADBC8] border border-[#8C4A27]/25 hover:bg-[#DFCEB9] items-center justify-center text-xs font-bold text-[#241711] transition-transform hover:-translate-x-0.5 cursor-pointer shadow-xs"
              title="Back to Studio"
            >
              ←
            </button>
            <div>
              <h2 className="text-base font-serif font-bold text-[#241711]">Cinera Concept Session</h2>
              <span className="text-[10px] tracking-widest text-[#8C4A27] uppercase font-bold">
                Live Directorial Stream
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#EADBC8]/70 p-1 rounded-full border border-[#8C4A27]/20">
            {(['YouTube', 'TikTok/Reels', 'Podcast', 'Brand/Ad'] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPlatform(p);
                  saveCurrentSession(messages, p, userId);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  platform === p
                    ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                    : 'text-[#8C4A27] hover:text-[#241711]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 max-w-4xl w-full mx-auto">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isPlaceholderEmpty = !isUser && !msg.content && isStreaming;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] tracking-wider uppercase font-bold text-[#8C4A27]/70 mb-1 px-1">
                  {isUser ? 'You' : 'Cinera'} • {msg.timestamp}
                </span>

                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 rounded-[24px] text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#6B4426] text-[#FAF6F0] rounded-tr-xs shadow-md font-sans font-medium'
                      : 'bg-[#EADBC8]/90 text-[#241711] rounded-tl-xs shadow-xs border border-[#8C4A27]/25 font-serif whitespace-pre-wrap'
                  }`}
                >
                  {isPlaceholderEmpty ? (
                    <div className="flex items-center gap-2 text-[#8C4A27] font-mono text-xs py-1">
                      <span className="w-2 h-2 rounded-full bg-[#8C4A27] animate-ping" />
                      <span>Directing & streaming tokens...</span>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {!isUser && msg.content && msg.id !== 'welcome' && (
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <button
                      onClick={async () => {
                        await saveSpark(msg.content, platform);
                        showToast('💡 Saved to Sparks Vault!');
                      }}
                      className="text-[10px] font-bold text-[#8C4A27] hover:text-[#6B4426] bg-[#FAF6F0] hover:bg-[#EADBC8] px-3 py-1.5 rounded-xl border border-[#8C4A27]/20 transition-all cursor-pointer flex items-center gap-1 shadow-xs hover:scale-105"
                    >
                      <span>💡 Save Spark</span>
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/studio/shot-list?concept=${encodeURIComponent(msg.content.slice(0, 200))}`
                        )
                      }
                      className="text-[10px] font-bold text-[#FAF6F0] bg-[#6B4426] hover:bg-[#52331B] px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
                    >
                      <span>🎥 Turn into Shot List →</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}

          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 sm:p-6 max-w-4xl w-full mx-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
            {[
              'Give me 3 high-contrast cold open hooks',
              'What is the unexpected twist for this story?',
              'How to structure the first 30 seconds for retention?',
              'Make this concept more emotional and raw',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                disabled={isStreaming}
                className="text-[11px] font-bold text-[#8C4A27] bg-[#EADBC8]/70 hover:bg-[#EADBC8] px-3 py-1.5 rounded-full border border-[#8C4A27]/20 whitespace-nowrap transition-all cursor-pointer shrink-0 hover:scale-102 shadow-2xs"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          <div className="bg-[#FAF6F0] border-2 border-[#8C4A27]/30 rounded-[28px] p-2 pl-5 flex items-center gap-3 shadow-md focus-within:border-[#6B4426] transition-colors">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Brainstorm with Cinera... (Shift + Enter for new line)"
              className="flex-1 bg-transparent text-sm font-serif text-[#241711] placeholder-[#8C4A27]/50 focus:outline-none resize-none max-h-32"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isStreaming || !input.trim()}
              className="bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-40 text-[#FAF6F0] px-5 py-3 rounded-full text-xs font-bold transition-transform hover:scale-105 cursor-pointer shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>{isStreaming ? 'Streaming' : 'Send'}</span>
              <span>↑</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function VideoGeneratorPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#FAF6F0] p-10 font-serif">Loading Generator...</div>}
    >
      <VideoGeneratorChatContent />
    </Suspense>
  );
}