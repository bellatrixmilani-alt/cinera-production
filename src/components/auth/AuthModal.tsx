'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save basic user info to local state/storage if needed
    if (typeof window !== 'undefined' && fullName) {
      localStorage.setItem('cinera_user_name', fullName);
    }

    // Close modal & route directly to Phase 2 Onboarding
    onClose();
    router.push('/onboarding');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Dimmed Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3D2B1F]/30 backdrop-blur-xs cursor-pointer"
        />

        {/* Dynamic Modal Card */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-[#FAF6F0] border border-[#3D2B1F]/20 rounded-3xl p-8 shadow-2xl z-10 text-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#6B5546] hover:text-[#3D2B1F] text-xs font-sans transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Mode Header */}
          <motion.div layout="position" className="mb-6">
            <h3 className="text-2xl font-serif uppercase tracking-[0.15em] text-[#3D2B1F] mb-1">
              {mode === 'signin' ? 'WELCOME BACK' : 'CREATE YOUR STUDIO'}
            </h3>
            <p className="text-xs font-sans text-[#6B5546]">
              {mode === 'signin'
                ? 'Enter your credentials to step inside'
                : 'Set up your account to start creating'}
            </p>
          </motion.div>

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-[10px] font-sans tracking-widest text-[#6B5546] uppercase mb-1">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  placeholder="Winnie Kanja"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F7F2EB] border border-[#3D2B1F]/20 rounded-full px-4 py-2.5 text-xs text-[#3D2B1F] placeholder-[#6B5546]/40 focus:outline-none focus:border-[#3D2B1F] transition-colors"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-[10px] font-sans tracking-widest text-[#6B5546] uppercase mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="creator@cinera.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F2EB] border border-[#3D2B1F]/20 rounded-full px-4 py-2.5 text-xs text-[#3D2B1F] placeholder-[#6B5546]/40 focus:outline-none focus:border-[#3D2B1F] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans tracking-widest text-[#6B5546] uppercase mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F2EB] border border-[#3D2B1F]/20 rounded-full px-4 py-2.5 text-xs text-[#3D2B1F] placeholder-[#6B5546]/40 focus:outline-none focus:border-[#3D2B1F] transition-colors"
              />
            </div>

            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-[10px] font-sans tracking-widest text-[#6B5546] uppercase mb-1">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F7F2EB] border border-[#3D2B1F]/20 rounded-full px-4 py-2.5 text-xs text-[#3D2B1F] placeholder-[#6B5546]/40 focus:outline-none focus:border-[#3D2B1F] transition-colors"
                />
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-[#3D2B1F] hover:bg-[#2B1F16] text-[#FAF6F0] py-3 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer shadow-xs mt-4"
            >
              {mode === 'signin' ? 'ENTER STUDIO →' : 'CREATE ACCOUNT →'}
            </button>
          </form>

          {/* Toggle Button Helper */}
          <div className="mt-6 pt-4 border-t border-[#3D2B1F]/10 text-[10px] font-sans text-[#6B5546]">
            {mode === 'signin' ? (
              <p>
                First time at Cinera?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-[#3D2B1F] font-semibold underline hover:opacity-80 transition-opacity cursor-pointer ml-1"
                >
                  Create your account
                </button>
              </p>
            ) : (
              <p>
                Already have a workspace?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-[#3D2B1F] font-semibold underline hover:opacity-80 transition-opacity cursor-pointer ml-1"
                >
                  Sign in instead
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}