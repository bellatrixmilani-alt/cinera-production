'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'Cinematic Vlog',
      title: 'Cinematic vlog',
      icon: (
        <svg className="w-8 h-8 stroke-[#3D2B1F]" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      id: 'Travel Content',
      title: 'Travel content',
      icon: (
        <svg className="w-8 h-8 stroke-[#3D2B1F]" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
    },
    {
      id: 'Food Content',
      title: 'Food content',
      icon: (
        <svg className="w-8 h-8 stroke-[#3D2B1F]" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        </svg>
      ),
    },
    {
      id: 'Beauty Trial',
      title: 'Beauty trial',
      icon: (
        <svg className="w-8 h-8 stroke-[#3D2B1F]" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
  ];

  const handleSelect = (genre: string) => {
    setSelectedCategory(genre);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_primary_genre', genre);
    }
    // Route straight to studio
    router.push('/studio');
  };

  return (
    <main className="min-h-screen w-full bg-[#F7F2EB] flex flex-col items-center justify-center px-6 py-10 text-[#3D2B1F]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight font-medium mb-1">
          What would you like to create
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight font-medium mb-4">
          Today?
        </h1>

        <p className="text-sm sm:text-base font-serif italic text-[#6B5546] mb-10">
          Choose your path, and Cinera will personalize everything for you!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl mb-8">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(cat.id)}
              className={`flex flex-col items-center justify-center p-8 rounded-3xl bg-[#FAF6F0] border transition-all duration-300 shadow-xs cursor-pointer ${
                selectedCategory === cat.id
                  ? 'border-[#3D2B1F] shadow-md bg-[#FAF6F0]'
                  : 'border-[#3D2B1F]/10 hover:border-[#3D2B1F]/30 hover:shadow-md'
              }`}
            >
              <div className="mb-4 opacity-80">{cat.icon}</div>
              <span className="text-base font-serif tracking-wide text-[#3D2B1F]">
                {cat.title}
              </span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => handleSelect('Open Exploration')}
          className="bg-[#4A3525] hover:bg-[#36261A] text-[#FAF6F0] px-10 py-3.5 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-300 shadow-md cursor-pointer"
        >
          I am not sure yet
        </button>
      </motion.div>
    </main>
  );
}