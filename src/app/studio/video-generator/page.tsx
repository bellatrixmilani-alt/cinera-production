'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSpark } from '../../../lib/sparks';

export default function IdeaRefinerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode Detection
  const [isOverwhelmedMode, setIsOverwhelmedMode] = useState(false);
  
  // Title & Input State
  const [projectTitle, setProjectTitle] = useState('My Next Big Idea');
  const [platform, setPlatform] = useState<'TikTok/Reels' | 'YouTube' | 'LinkedIn' | 'X/Twitter' | 'Podcast'>('TikTok/Reels');
  const [rawIdea, setRawIdea] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [savedSparkSuccess, setSavedSparkSuccess] = useState(false);

  // Overwhelmed Companion Chat & Breathing States
  const [userFeeling, setUserFeeling] = useState('');
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // REGULAR MODE PLATFORM INSIGHTS (Sharp, Strategic, High-Energy)
  const regularPlatformInsights = {
    'TikTok/Reels': {
      encouragement: '"This concept has incredible energy. Short-form audiences respond instantly to genuine micro-moments and unfiltered voice, and your spark has that exact human magnetic pull."',
      marketFit: 'Taps into short-form visual storytelling and high-retention audio hooks.',
      competitorNoise: 'Most short-form creators post over-edited trends. Standing out here means using natural lighting, authentic pacing, and a 2-second visual hook.',
    },
    'YouTube': {
      encouragement: '"This idea has deep narrative legs. There is a rich story here that deserves space to breathe, build, and hold an audience’s curiosity over a full video."',
      marketFit: 'Fits the mid-form to long-form essay and vlog niche where audience retention and emotional depth are rewarded.',
      competitorNoise: 'Most videos in this niche start with loud intro speeches. Standing out means opening mid-action or with a compelling question.',
    },
    'LinkedIn': {
      encouragement: '"This reflection carries real professional resonance. It takes raw experience and transforms it into actionable, vulnerable insight that people will want to repost."',
      marketFit: 'High affinity for storytelling-based thought leadership. Bypasses corporate jargon for genuine human perspective.',
      competitorNoise: 'Feeds are dominated by AI-generated listicles and humblebrags. Unfiltered authenticity immediately commands attention.',
    },
    'X/Twitter': {
      encouragement: '"This is sharp, concise, and thought-provoking. It compresses a big observation into a punchy narrative line that begs for discussion."',
      marketFit: 'Ideal for thread breakdown or a single provocative observation that drives replies and quote-tweets.',
      competitorNoise: 'Most accounts tweet generic advice. Focusing on a specific, personal lesson learned will stand out instantly.',
    },
    'Podcast': {
      encouragement: '"This topic feels conversational and intimate. It creates an immediate sense of warmth—like sitting down with a friend for an honest late-night conversation."',
      marketFit: 'Perfect for long-form audio exploration, solo reflections, or intimate guest interviews.',
      competitorNoise: 'Podcasts often linger without focus. A clear central question will keep listeners engaged till the final minute.',
    },
  };

  // OVERWHELMED MODE PLATFORM INSIGHTS (Soft, No-Pressure, Calming)
  const overwhelmedPlatformInsights = {
    'TikTok/Reels': {
      encouragement: '"You don’t have to post every day or chase loud trends. A simple 10-second clip of quiet morning light with honest voiceover will touch people far more deeply."',
      marketFit: 'Slow-living and raw vulnerability resonate strongly when feed anxiety is high.',
      competitorNoise: 'Ignore the fast cuts and over-edited trends. Your calm pace is your superpower.',
    },
    'YouTube': {
      encouragement: '"Take all the pressure off duration. Whether it ends up as 3 minutes or 12 minutes, just share one genuine lesson you lived through."',
      marketFit: 'Mid-form personal essays create rich retention without needing grand setups.',
      competitorNoise: 'No need for loud intros or flashy graphics. Start right where your heart is.',
    },
    'LinkedIn': {
      encouragement: '"You don’t need to sound like an expert today. Just describe what didn’t work out, and what it taught you about yourself."',
      marketFit: 'Authentic vulnerability breaks through rigid corporate feed clutter instantly.',
      competitorNoise: 'Feeds are full of perfect success stories. Real human lessons command true respect.',
    },
    'X/Twitter': {
      encouragement: '"Keep it to three short lines. Share the single realization that helped you quiet your mind today."',
      marketFit: 'Short, reflective thoughts spark thoughtful community dialogue.',
      competitorNoise: 'Skip hot takes and arguments. Quiet clarity always stands out.',
    },
    'Podcast': {
      encouragement: '"Pour a warm cup of coffee or tea, press record, and talk as if you’re speaking to a close friend in a quiet room."',
      marketFit: 'Intimate audio builds deep personal connection and trust.',
      competitorNoise: 'Forget rigid interview formats. A relaxed, personal reflection is enough.',
    },
  };

  const currentInsight = isOverwhelmedMode 
    ? overwhelmedPlatformInsights[platform] 
    : regularPlatformInsights[platform];

  // REGULAR MODE ANGLES vs OVERWHELMED ANGLES
  const regularAngles = [
    {
      id: 1,
      type: '⚡ THE PLATFORM HOOK',
      concept: 'Open within 1.5 seconds. Use a bold visual text overlay while speaking directly to the viewer’s core curiosity.',
      selected: true,
    },
    {
      id: 2,
      type: '🎯 THE UNCONVENTIONAL ANGLE',
      concept: 'Instead of teaching or showing "how-to", frame it around the #1 mistake you made so the audience learns through your vulnerability.',
      selected: false,
    },
    {
      id: 3,
      type: '👁️ AESTHETIC & PACING SIGNATURE',
      concept: 'Use natural room audio, warm color tones, and deliberate pause beats to break the hyper-active scrolling pattern.',
      selected: false,
    },
  ];

  const overwhelmedAngles = [
    {
      id: 1,
      type: '🌱 SOFT HOOK',
      concept: 'Open with total calm. Natural room audio, soft ambient noise, and a warm visual beat.',
      selected: true,
    },
    {
      id: 2,
      type: '🎯 HONEST VULNERABILITY',
      concept: 'Admit that you felt overwhelmed or stuck today—it makes your audience feel less alone.',
      selected: false,
    },
    {
      id: 3,
      type: '👁️ SLOW PACING SIGNATURE',
      concept: 'Take deliberate pauses between thoughts. Let the visual moments breathe.',
      selected: false,
    },
  ];

  const [angles, setAngles] = useState(regularAngles);

  // Read URL Params
  useEffect(() => {
    const mode = searchParams.get('mode');
    const isOverwhelmed = mode === 'overwhelmed';
    setIsOverwhelmedMode(isOverwhelmed);

    if (isOverwhelmed) {
      setProjectTitle('Soft Creative Reflection');
      setAngles(overwhelmedAngles);

      const interval = setInterval(() => {
        setBreathingPhase((prev) => {
          if (prev === 'Inhale') return 'Hold';
          if (prev === 'Hold') return 'Exhale';
          return 'Inhale';
        });
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setProjectTitle('My Next Big Idea');
      setAngles(regularAngles);
    }

    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      setRawIdea(urlPrompt);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cinera_active_prompt');
      if (stored) setRawIdea(stored);
    }
  }, [searchParams]);

  const handleRefineIdea = () => {
    setIsRefining(true);
    setTimeout(() => {
      setIsRefining(false);
    }, 1000);
  };

  const handleSaveAsSpark = () => {
    const sparkContent = rawIdea.trim() || projectTitle;
    if (!sparkContent) return;
    saveSpark(sparkContent, platform);
    setSavedSparkSuccess(true);
    setTimeout(() => setSavedSparkSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5ECE1] text-[#241711] p-6 md:p-10 font-sans flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {savedSparkSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-5 py-3 rounded-2xl shadow-2xl text-xs font-sans font-bold flex items-center gap-2 z-50 border border-[#FAF6F0]/20"
          >
            <span>💡</span>
            <span>Idea saved as a Spark! Viewable on your Studio desk.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERWHELMED BANNER (Only shows if mode=overwhelmed) */}
      <AnimatePresence>
        {isOverwhelmedMode && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl mx-auto bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[28px] p-5 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full bg-[#FAF6F0] border-2 border-[#8C4A27]/30 flex items-center justify-center shrink-0">
                <motion.div
                  animate={{ scale: breathingPhase === 'Inhale' ? 1.25 : breathingPhase === 'Hold' ? 1.25 : 0.85 }}
                  transition={{ duration: 3, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-full bg-[#6B4426]/30"
                />
                <span className="absolute text-[9px] font-sans font-black text-[#6B4426] uppercase">
                  {breathingPhase}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#8C4A27] uppercase font-black block">
                  🌱 CINERA CALM COMPANION
                </span>
                <h3 className="text-lg font-serif font-bold text-[#241711]">
                  Take a slow breath, Winnie. There is no rush here.
                </h3>
                <p className="text-xs font-serif italic text-[#8C4A27]">
                  We picked this concept so you can create without noise or expectation.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center gap-2 bg-[#F5ECE1] border border-[#8C4A27]/20 rounded-2xl p-2 px-3">
              <span className="text-xs">💬</span>
              <input
                type="text"
                value={userFeeling}
                onChange={(e) => setUserFeeling(e.target.value)}
                placeholder="What happened or how do you feel right now? (Optional)..."
                className="bg-transparent text-xs font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none w-full md:w-64"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-[#8C4A27]/25 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/studio')}
            className="w-11 h-11 rounded-full bg-[#EADBC8] border-2 border-[#8C4A27]/30 hover:bg-[#DFCEB9] flex items-center justify-center text-sm font-bold text-[#241711] transition-transform hover:-translate-x-1 cursor-pointer shadow-2xs font-sans"
          >
            ←
          </button>
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black block mb-1">
              {isOverwhelmedMode ? '🌱 GENTLE IDEA SPACE' : '💡 MULTI-PLATFORM IDEA REFINER'}
            </span>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-serif font-bold text-[#241711] bg-transparent focus:outline-none border-b-2 border-transparent focus:border-[#8C4A27]/40 transition-colors tracking-tight"
            />
          </div>
        </div>

        {/* Action Triggers Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleSaveAsSpark}
            className="bg-[#EADBC8] hover:bg-[#DFCEB9] text-[#241711] border-2 border-[#8C4A27]/25 px-4 py-2.5 rounded-full text-xs font-sans tracking-[0.1em] uppercase font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
          >
            <span>💡</span>
            <span>Save as Spark</span>
          </button>

          <button 
            onClick={() => router.push(`/studio/shot-list?concept=${encodeURIComponent(rawIdea || projectTitle)}`)}
            className="bg-[#EADBC8] hover:bg-[#DFCEB9] text-[#241711] border-2 border-[#8C4A27]/25 px-4 py-2.5 rounded-full text-xs font-sans tracking-[0.1em] uppercase font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
          >
            <span>🎥</span>
            <span>Generate Shot List</span>
          </button>

          <button 
            onClick={() => router.push(`/calendar?idea=${encodeURIComponent(projectTitle)}`)}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-5 py-2.5 rounded-full text-xs font-sans tracking-[0.1em] uppercase font-black transition-all shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-102"
          >
            <span>📅</span>
            <span>{isOverwhelmedMode ? 'Schedule Gently' : 'Schedule on Calendar'}</span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 flex-1">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black block mb-2">
                CHOOSE TARGET PLATFORM
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['TikTok/Reels', 'YouTube', 'LinkedIn', 'X/Twitter', 'Podcast'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-sans font-black transition-all cursor-pointer border ${
                      platform === p
                        ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-2xs'
                        : 'bg-[#FAF6F0] text-[#8C4A27] border-[#8C4A27]/20 hover:bg-[#F5ECE1]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              placeholder={`Type your raw ${platform} idea or creative spark here...`}
              className="w-full bg-[#F5ECE1] border-2 border-[#8C4A27]/20 rounded-2xl p-4 text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/60 focus:outline-none resize-none mb-5 leading-relaxed shadow-2xs font-medium italic"
            />

            {/* Encouragement & Insights */}
            <div className="space-y-3.5 mb-6">
              <div className="bg-[#F5ECE1]/90 border-l-4 border-[#8C4A27] rounded-r-2xl p-3.5 shadow-2xs">
                <span className="text-[9px] font-sans font-black tracking-widest text-[#8C4A27] uppercase block mb-1">
                  ✨ {isOverwhelmedMode ? 'GENTLE ENCOURAGEMENT' : 'CREATIVE ENCOURAGEMENT'} ({platform.toUpperCase()})
                </span>
                <p className="text-xs font-serif text-[#241711] leading-relaxed italic font-medium">
                  {currentInsight.encouragement}
                </p>
              </div>

              <div className="bg-[#F5ECE1]/90 border-l-4 border-[#6B4426] rounded-r-2xl p-3.5 shadow-2xs">
                <span className="text-[9px] font-sans font-black tracking-widest text-[#6B4426] uppercase block mb-1">
                  🎯 {isOverwhelmedMode ? 'NO-PRESSURE FIT' : 'MARKET OPPORTUNITY FIT'}
                </span>
                <p className="text-xs font-serif text-[#241711] leading-relaxed font-medium">
                  {currentInsight.marketFit}
                </p>
              </div>

              {!isOverwhelmedMode && (
                <div className="bg-[#F5ECE1]/90 border-l-4 border-[#8C4A27]/60 rounded-r-2xl p-3.5 shadow-2xs">
                  <span className="text-[9px] font-sans font-black tracking-widest text-[#8C4A27] uppercase block mb-1">
                    👀 WHAT OTHERS ARE DOING (THE NOISE)
                  </span>
                  <p className="text-xs font-serif text-[#241711] leading-relaxed font-medium">
                    {currentInsight.competitorNoise}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleRefineIdea}
            disabled={isRefining}
            className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans tracking-[0.2em] uppercase font-black transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2 hover:scale-102"
          >
            <span>✦</span>
            <span>
              {isRefining
                ? 'Elevating Concept...'
                : isOverwhelmedMode
                ? `Make My ${platform} Idea Soft & Unique`
                : `Make My ${platform} Idea Unique`}
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)]">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-black block mb-4">
              {isOverwhelmedMode ? `CALM & AUTHENTIC ANGLES (${platform.toUpperCase()})` : `DIFFERENTIATION ANGLES (${platform.toUpperCase()})`}
            </span>

            <div className="space-y-3">
              {angles.map((ang) => (
                <div
                  key={ang.id}
                  onClick={() => setAngles(angles.map(a => ({ ...a, selected: a.id === ang.id })))}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    ang.selected
                      ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-2xs'
                      : 'bg-[#F5ECE1] text-[#241711] border-[#8C4A27]/20 hover:border-[#8C4A27]/50'
                  }`}
                >
                  <span className={`text-[10px] font-sans font-black tracking-wider block mb-1 ${ang.selected ? 'text-[#E8A87C]' : 'text-[#8C4A27]'}`}>
                    {ang.type}
                  </span>
                  <p className="text-xs font-serif leading-relaxed font-medium">
                    "{ang.concept}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Reflection Box if user typed feeling in Overwhelmed Mode */}
          {isOverwhelmedMode && userFeeling && (
            <div className="bg-[#EADBC8] border-2 border-[#8C4A27]/35 rounded-[32px] p-5 shadow-[6px_6px_0px_0px_rgba(140,74,39,0.2)] font-serif text-xs">
              <span className="text-[10px] font-sans font-black tracking-widest text-[#8C4A27] uppercase block mb-1">
                💬 YOUR THOUGHT TODAY
              </span>
              <p className="italic text-[#241711]">"{userFeeling}"</p>
              <p className="text-[10px] text-[#8C4A27] font-sans mt-2 font-bold">
                Thank you for honoring how you feel. We built this video around this exact truth.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}