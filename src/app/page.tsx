'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FlowerDoodle from '@/components/landing/FlowerDoodle';
import FilmstripGallery from '@/components/landing/FilmStripGallery';
import AboutModal from '@/components/navigation/AboutModal';
import SettingsModal from '@/components/navigation/SettingsModal';

export default function LandingPage() {
  const router = useRouter();

  // Navigation Modal States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auth Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'sign_in' | 'new_creator'>('sign_in');
  
  // Registration Form Credentials State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Creator Registration Handler
  const handleRegisterNewCreator = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required credential fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    if (typeof window !== 'undefined') {
      const userCredentials = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      };
      localStorage.setItem('cinera_user_credentials', JSON.stringify(userCredentials));
      localStorage.setItem('cinera_user_name', firstName.trim());
      localStorage.setItem('cinera_has_onboarded', 'true');
    }

    setIsAuthModalOpen(false);
    router.push('/studio');
  };

  // Returning Creator Sign-In Handler
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinera_has_onboarded', 'true');
    }
    setIsAuthModalOpen(false);
    router.push('/studio');
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#241711] font-sans relative overflow-x-hidden flex flex-col justify-between p-6 sm:p-10">
      
      {/* SCATTERED RETRO FLOWER DOODLES */}
      <FlowerDoodle size={75} className="absolute top-6 left-6 -rotate-12 opacity-50" colorFill="#8C4A27" colorLine="#D8C3B0" />
      <FlowerDoodle size={65} className="absolute top-16 right-10 rotate-45 opacity-40" colorFill="#8C4A27" colorLine="#D8C3B0" />
      <FlowerDoodle size={55} className="absolute top-[45%] right-[18%] -rotate-12 opacity-45" colorFill="#8C4A27" colorLine="#D8C3B0" />
      <FlowerDoodle size={60} className="absolute top-[52%] left-[18%] rotate-12 opacity-45" colorFill="#8C4A27" colorLine="#D8C3B0" />

      {/* 01 — TOP NAVIGATION BAR (Opens Navigation Modals) */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center z-20">
        <button
          onClick={() => setIsAboutOpen(true)}
          className="text-xs font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-bold hover:text-[#241711] transition-colors cursor-pointer"
        >
          ABOUT
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-xs font-sans tracking-[0.25em] text-[#8C4A27] uppercase font-bold hover:text-[#241711] transition-colors cursor-pointer"
        >
          SETTINGS
        </button>
      </nav>

      {/* 02 — HERO SECTION */}
      <main className="w-full max-w-4xl mx-auto text-center z-10 my-auto py-12 flex flex-col items-center">
        
        {/* GIANT SPOTLIGHT TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal tracking-[0.15em] text-[#241711] mb-2 uppercase"
        >
          CINERA AI
        </motion.h1>

        {/* ITALICS SUBTITLE */}
        <h2 className="text-xl sm:text-3xl font-serif italic text-[#3D2B1F] font-normal mb-3">
          The Haven for Your Story
        </h2>

        {/* DESCRIPTION */}
        <p className="text-xs sm:text-sm font-sans text-[#8C4A27] max-w-md mb-8 font-medium leading-relaxed">
          Create without chaos. A workspace designed for calm, beauty and brilliance.
        </p>

        {/* DUAL PILL BUTTONS */}
        <div className="flex items-center gap-4 flex-wrap justify-center mb-6">
          <button
            onClick={() => {
              setAuthTab('sign_in');
              setIsAuthModalOpen(true);
            }}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-8 py-3.5 rounded-full text-xs font-sans tracking-[0.15em] uppercase font-black transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <span>STEP INSIDE →</span>
          </button>

          <button
            onClick={() => {
              setAuthTab('sign_in');
              setIsAuthModalOpen(true);
            }}
            className="bg-transparent hover:bg-[#EADBC8]/40 text-[#241711] border-2 border-[#8C4A27]/30 px-8 py-3.5 rounded-full text-xs font-sans tracking-[0.15em] uppercase font-bold transition-colors cursor-pointer"
          >
            SIGN IN
          </button>
        </div>
      </main>

      {/* 03 — CAROUSEL FILMSTRIP */}
      <section className="w-full z-10 pt-4 pb-2">
        <FilmstripGallery />
      </section>

      {/* 04 — ACCOUNT AUTH & REGISTRATION MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-[#241711]/50 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-md bg-[#EADBC8] border-2 border-[#8C4A27]/40 rounded-[36px] p-8 shadow-xl z-10 flex flex-col items-center text-center font-sans max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-5 right-5 text-[#8C4A27] hover:text-[#241711] text-xs font-sans cursor-pointer font-black"
              >
                ✕
              </button>

              {errorMessage && (
                <div className="w-full bg-[#FAF6F0] border border-[#8C4A27] text-[#8C4A27] px-3.5 py-2 rounded-2xl text-[11px] font-sans font-bold mb-4 text-left">
                  ⚠️ {errorMessage}
                </div>
              )}

              {authTab === 'sign_in' ? (
                /* RETURNING CREATOR FORM */
                <form onSubmit={handleSignIn} className="w-full flex flex-col items-center">
                  <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 px-4 py-1.5 rounded-full mb-4 shadow-2xs">
                    <span className="text-[10px] font-serif tracking-[0.15em] text-[#8C4A27] uppercase font-bold">
                      CREATOR ACCESS
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#241711] mb-1">
                    Welcome Back
                  </h3>
                  <p className="text-xs font-serif italic text-[#8C4A27] mb-6">
                    Enter your credentials to continue creating.
                  </p>

                  <div className="w-full text-left space-y-3.5 mb-6">
                    <div>
                      <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-3 text-xs font-serif text-[#241711] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-3 text-xs font-serif text-[#241711] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-colors cursor-pointer shadow-sm mb-4"
                  >
                    Enter Studio Desk →
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setAuthTab('new_creator');
                    }}
                    className="text-xs font-sans text-[#8C4A27] hover:text-[#241711] transition-colors cursor-pointer font-bold"
                  >
                    New here? Create an account →
                  </button>
                </form>
              ) : (
                /* NEW CREATOR CREDENTIALS REGISTRATION FORM */
                <form onSubmit={handleRegisterNewCreator} className="w-full flex flex-col items-center">
                  <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 px-4 py-1.5 rounded-full mb-3 shadow-2xs">
                    <span className="text-[10px] font-serif tracking-[0.15em] text-[#8C4A27] uppercase font-bold">
                      ACCOUNT REGISTRATION
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#241711] mb-1">
                    Create Your Account
                  </h3>
                  <p className="text-xs font-serif italic text-[#8C4A27] mb-5">
                    Register your details to store your creator profile.
                  </p>

                  <div className="w-full text-left space-y-3 mb-5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name..."
                          className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-3.5 py-2.5 text-xs font-serif text-[#241711] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name..."
                          className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-3.5 py-2.5 text-xs font-serif text-[#241711] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@cinera.ai"
                        className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-3.5 py-2.5 text-xs font-serif text-[#241711] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-3.5 py-2.5 text-xs font-serif text-[#241711] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-3.5 py-2.5 text-xs font-serif text-[#241711] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-colors cursor-pointer shadow-sm mb-3"
                  >
                    Create Account & Enter →
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setAuthTab('sign_in');
                    }}
                    className="text-xs font-sans text-[#8C4A27] hover:text-[#241711] transition-colors cursor-pointer font-bold"
                  >
                    Already have an account? Sign in →
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 05 — NAVIGATION MODALS FROM NAVIGATION FOLDER */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}