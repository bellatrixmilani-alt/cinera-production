'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import FlowerAtmosphere from '@/components/ui/FlowerAtmosphere';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
import { supabase } from '@/lib/supabase/client';

interface NicheCategory {
  category: string;
  icon: string;
  items: string[];
}

const NICHE_TAXONOMY: NicheCategory[] = [
  {
    category: 'Entertainment & Gaming',
    icon: '🎮',
    items: [
      'Gaming / Esports commentators, streamers, speedrunners',
      'Comedy / Sketch creators',
      'Prank channels',
      'Reaction channels',
      'Commentary / Drama channels',
      'Meme creators / Pages',
      'Anime / Manga content creators',
      'Cosplay creators',
      'ASMR creators',
    ],
  },
  {
    category: 'Lifestyle, Vlogs & Fashion',
    icon: '✨',
    items: [
      'Vloggers (Daily life)',
      'Beauty & Makeup creators',
      'Fashion & Style influencers',
      'Parenting / Mommy / Daddy bloggers',
      'Pet / Animal content creators',
      'Minimalism / Decluttering creators',
      'Van life / Nomad creators',
    ],
  },
  {
    category: 'Health, Fitness & Food',
    icon: '🥗',
    items: [
      'Fitness & Bodybuilding creators',
      'Health & Wellness creators',
      'Cooking / Food creators (Recipe developers, mukbang, reviewers)',
    ],
  },
  {
    category: 'Tech, Coding & Business',
    icon: '💻',
    items: [
      'Tech reviewers / Unboxers',
      'Coding / Programming tutorial creators',
      'AI & Emerging Tech news creators',
      'Business / Entrepreneurship creators',
      'Finance / Investing creators (Finfluencers)',
      'Productivity / Study creators (StudyTubers)',
      'Life-hack creators',
    ],
  },
  {
    category: 'Creative Arts, Film & Music',
    icon: '🎬',
    items: [
      'Cinematography / Film creators',
      'Photography creators',
      'Music creators (Original artists, covers, producers, beatmakers)',
      'Dance creators / Choreographers',
      'Art creators (Digital art, traditional art, tutorials)',
      'Architecture & Design creators',
      'Interior design creators',
      'Book / Literary creators (BookTok, BookTube)',
    ],
  },
  {
    category: 'Hands-On, DIY & Outdoor',
    icon: '🛠️',
    items: [
      'DIY & Crafts creators',
      'Woodworking / Making creators',
      'Model builders / Miniature painters',
      'Toy / Collectible reviewers',
      'Home improvement / Renovation creators',
      'Gardening creators',
      'Automotive creators (Car reviews, mods, racing)',
      'Outdoor / Survivalist / Bushcraft creators',
      'Fishing / Hunting creators',
      'Extreme sports / Adventure creators',
      'Travel vloggers / Influencers',
      'Weather / Storm chasers',
      'Farming / Homesteading creators',
    ],
  },
  {
    category: 'Education, Science & Thought',
    icon: '🧠',
    items: [
      'Educational creators (Edutainment, explainers)',
      'Science communicators',
      'History content creators',
      'Language learning creators',
      'True crime creators',
      'Paranormal / Horror content creators',
      'Sports commentary / Analysis creators',
      'Motivational / Self-help creators',
      'Spiritual / Religious content creators',
      'Political commentators',
      'News / Independent journalism creators',
      'Fact-checkers / Debunkers',
      'Medical professionals sharing education (MedTok)',
      'Legal creators (Explaining law)',
      'Military / Veteran content creators',
      'Sustainability / Eco-living creators',
    ],
  },
  {
    category: 'Commercial, Brand & Modern Formats',
    icon: '📦',
    items: [
      'Product reviewers (General)',
      'Unboxing / Haul creators',
      'Shopping / Deal-hunting creators',
      'UGC creators (Content made for brands)',
      'Affiliate marketers / Content',
      'Brand ambassadors',
      'Faceless channel creators (Compilation, narration, listicle)',
      'Virtual influencers (AI / CGI personas)',
    ],
  },
];

const AUDIENCE_TIERS = [
  { label: 'Nano Creator', range: '0 - 5k community' },
  { label: 'Micro Creator', range: '5k - 50k community' },
  { label: 'Growth Creator', range: '50k - 250k community' },
  { label: 'Macro / Celebrity', range: '250k+ community' },
];

function OnboardingContent() {
  const router = useRouter();

  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('Nano Creator');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((item) => item !== niche) : [...prev, niche]
    );
  };

  const handleFinishOnboarding = async () => {
    if (selectedNiches.length === 0) return;
    setIsSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest';

    const profileData = {
      niches: selectedNiches,
      audienceTier: selectedTier,
      completedAt: Date.now(),
    };

    localStorage.setItem(`cinera_creator_profile_${userId}`, JSON.stringify(profileData));
    localStorage.setItem('cinera_creator_profile', JSON.stringify(profileData));

    // 🔒 Set empty clean-slate defaults for new user accounts
    if (!localStorage.getItem(`cinera_active_todos_${userId}`)) {
      localStorage.setItem(`cinera_active_todos_${userId}`, JSON.stringify([]));
    }
    if (!localStorage.getItem(`cinera_tasks_full_${userId}`)) {
      localStorage.setItem(`cinera_tasks_full_${userId}`, JSON.stringify([]));
    }
    if (!localStorage.getItem(`cinera_chat_sessions_${userId}`)) {
      localStorage.setItem(`cinera_chat_sessions_${userId}`, JSON.stringify([]));
    }
    if (!localStorage.getItem(`cinera_sparks_vault_${userId}`)) {
      localStorage.setItem(`cinera_sparks_vault_${userId}`, JSON.stringify([]));
    }
    if (!localStorage.getItem(`cinera_calendar_events_${userId}`)) {
      localStorage.setItem(`cinera_calendar_events_${userId}`, JSON.stringify([]));
    }

    setTimeout(() => {
      router.push('/studio');
    }, 600);
  };

  const filteredTaxonomy = NICHE_TAXONOMY.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#241711] font-sans selection:bg-[#EADBC8] relative overflow-x-hidden flex flex-col justify-between">
      <FlowerAtmosphere />

      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-10 relative z-10 flex flex-col gap-8 flex-1">
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EADBC8] border border-[#8C4A27]/25 shadow-xs mb-4">
            <FlowerDoodle size={32} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C4A27] font-bold block mb-1">
            CREATOR IDENTITY SETUP
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#241711] tracking-tight mb-3">
            What is your creative arena?
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#8C4A27] leading-relaxed">
            Select the realms you create in. Cinera tunes every hook, shot angle, and executive director response to your exact medium.
          </p>
        </header>

        <section className="bg-[#EADBC8]/70 backdrop-blur-md border border-[#8C4A27]/25 rounded-[28px] p-5 shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C4A27] block mb-3 text-center sm:text-left">
            SELECT CURRENT AUDIENCE STAGE
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AUDIENCE_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.label;
              return (
                <button
                  key={tier.label}
                  onClick={() => setSelectedTier(tier.label)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-xs'
                      : 'bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 text-[#241711] border-[#8C4A27]/15'
                  }`}
                >
                  <span className="text-xs font-serif font-bold">{tier.label}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-[#FAF6F0]/80' : 'text-[#8C4A27]'
                    }`}
                  >
                    {tier.range}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-xs focus-within:border-[#6B4426] transition-all">
          <span className="text-sm text-[#8C4A27]">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specific niches (e.g. Gaming, True Crime, Beauty, ASMR, Finance)..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-serif text-[#241711] placeholder-[#8C4A27]/50 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#8C4A27] hover:text-[#241711] px-1"
            >
              Clear
            </button>
          )}
        </div>

        <main className="space-y-6">
          {filteredTaxonomy.map((cat) => (
            <div
              key={cat.category}
              className="bg-[#EADBC8]/50 backdrop-blur-xs border border-[#8C4A27]/20 rounded-[28px] p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#8C4A27]/15">
                <span className="text-lg">{cat.icon}</span>
                <h3 className="text-sm font-serif font-bold text-[#241711]">{cat.category}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => {
                  const isSelected = selectedNiches.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleNiche(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-serif transition-all cursor-pointer border text-left leading-snug flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#6B4426] text-[#FAF6F0] border-[#6B4426] shadow-xs font-bold'
                          : 'bg-[#FAF6F0] hover:bg-[#FAF6F0]/90 text-[#241711] border-[#8C4A27]/15'
                      }`}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </main>

        <footer className="sticky bottom-6 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-2 border-[#8C4A27]/30 rounded-[28px] p-4 px-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold bg-[#6B4426] text-[#FAF6F0] px-3 py-1 rounded-xl">
              {selectedNiches.length}
            </span>
            <span className="text-xs font-serif font-bold text-[#241711]">
              {selectedNiches.length === 1
                ? '1 Niche Selected'
                : `${selectedNiches.length} Niches Selected`}
            </span>
          </div>

          <button
            onClick={handleFinishOnboarding}
            disabled={selectedNiches.length === 0 || isSaving}
            className="w-full sm:w-auto bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-40 text-[#FAF6F0] px-8 py-3.5 rounded-2xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>{isSaving ? 'Configuring Your Studio...' : 'Enter Cinera Studio'}</span>
            <span>→</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-10 font-serif">Loading Onboarding...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}