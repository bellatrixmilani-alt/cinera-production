'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'new_creator';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(
    initialMode === 'new_creator' || initialMode === 'signup' ? 'signup' : 'signin'
  );

  useEffect(() => {
    setMode(initialMode === 'new_creator' || initialMode === 'signup' ? 'signup' : 'signin');
  }, [initialMode]);

  if (!isOpen) return null;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FAF6F0] border-2 border-[#8C4A27]/30 rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C4A27] font-bold text-sm hover:opacity-75 cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-2xl font-serif font-bold text-[#241711] mb-1">
          {mode === 'signin' ? 'Welcome Back' : 'Step Inside'}
        </h3>
        <p className="text-xs font-serif text-[#8C4A27] mb-6">
          {mode === 'signin'
            ? 'Sign in to access your sanctuary and studio.'
            : 'Create your haven for calm storytelling.'}
        </p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer mb-4"
        >
          Continue with Google
        </button>

        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-[11px] font-sans font-bold text-[#8C4A27] hover:underline cursor-pointer"
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already a creator? Sign in'}
        </button>
      </div>
    </div>
  );
}