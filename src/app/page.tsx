'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FlowerDoodle from '@/components/ui/FlowerDoodle';
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

  // Registration & Login Form Credentials State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  // New Creator Registration Handler (Supabase Sign Up)
  const handleRegisterNewCreator = async (e: React.FormEvent) => {
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

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cinera_user_name', firstName.trim());
          localStorage.setItem('cinera_has_onboarded', 'true');
        }

        setIsAuthModalOpen(false);
        window.location.href = '/studio';
      } else {
        setErrorMessage('Verification email sent! Please check your inbox before logging in.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Returning Creator Sign-In Handler (Supabase Sign In)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      const userMeta = data.user?.user_metadata;
      const storedName = userMeta?.first_name || 'Creator';

      if (typeof window !== 'undefined') {
        localStorage.setItem('cinera_user_name', storedName);
        localStorage.setItem('cinera_has_onboarded', 'true');
      }

      setIsAuthModalOpen(false);
      window.location.href = '/studio';
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign in failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-[#241711] font-sans relative overflow-x-hidden flex flex-col justify-between p-6 sm:p-10">
      {/* SCATTERED RETRO FLOWER DOODLES */}
      <FlowerDoodle size={75} className="absolute top-6 left-6 -rotate-12 opacity-50" colorFill="#8C4A27" colorLine="#D8C3B0" />
      <FlowerDoodle size={65} className="absolute top-16 right-10 rotate-45 opacity-40" colorFill="#8C4A27" colorLine="#D8C3B0" />
      <FlowerDoodle size={55} className="absolute top-[45%] right-[18%] -rotate-12 opacity-45" colorFill="#8C4A27" colorLine="#D8C3B0" />
      <FlowerDoodle size={60} className="absolute top-[52%] left-[18%] rotate-12 opacity-45" colorFill="#8C4A27" colorLine="#D8C3B0" />

      {/* 01 — TOP NAVIGATION BAR */}
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
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal tracking-[0.15em] text-[#241711] mb-2 uppercase"
        >
          CINERA AI
        </motion.h1>

        <h2 className="text-xl sm:text-3xl font-serif italic text-[#3D2B1F] font-normal mb-3">
          The Haven for Your Story
        </h2>

        <p className="text-xs sm:text-sm font-sans text-[#8C4A27] max-w-md mb-8 font-medium leading-relaxed">
          Create without chaos. A workspace designed for calm, beauty and brilliance.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center mb-6">
          <button
            onClick={() => {
              setErrorMessage(null);
              setAuthTab('new_creator');
              setIsAuthModalOpen(true);
            }}
            className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-8 py-3.5 rounded-full text-xs font-sans tracking-[0.15em] uppercase font-black transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <span>STEP INSIDE →</span>
          </button>

          <button
            onClick={() => {
              setErrorMessage(null);
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

              {/* GOOGLE SIGN-IN BUTTON */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#FAF6F0] hover:bg-[#F5ECE1] border border-[#8C4A27]/30 text-[#241711] py-3.5 rounded-2xl text-xs font-sans font-black tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs mb-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="w-full flex items-center my-3">
                <div className="flex-1 border-t border-[#8C4A27]/20"></div>
                <span className="px-3 text-[10px] uppercase font-sans text-[#8C4A27] font-bold tracking-wider">or</span>
                <div className="flex-1 border-t border-[#8C4A27]/20"></div>
              </div>

              {authTab === 'sign_in' ? (
                /* RETURNING CREATOR FORM */
                <form onSubmit={handleSignIn} className="w-full flex flex-col items-center">
                  <div className="bg-[#FAF6F0] border border-[#8C4A27]/25 px-4 py-1.5 rounded-full mb-3 shadow-2xs">
                    <span className="text-[10px] font-serif tracking-[0.15em] text-[#8C4A27] uppercase font-bold">
                      CREATOR ACCESS
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#241711] mb-1">
                    Welcome Back
                  </h3>
                  <p className="text-xs font-serif italic text-[#8C4A27] mb-5">
                    Enter your credentials to continue creating.
                  </p>

                  <div className="w-full text-left space-y-3.5 mb-5">
                    <div>
                      <label className="block text-[10px] font-sans font-black text-[#8C4A27] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F5ECE1] border border-[#8C4A27]/25 rounded-2xl px-4 py-3 text-xs font-serif text-[#241711] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-60 text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-colors cursor-pointer shadow-sm mb-4"
                  >
                    {loading ? 'AUTHENTICATING...' : 'Enter Studio Desk →'}
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
                    disabled={loading}
                    className="w-full bg-[#6B4426] hover:bg-[#52331B] disabled:opacity-60 text-[#FAF6F0] py-3.5 rounded-2xl text-xs font-sans tracking-[0.15em] uppercase font-black transition-colors cursor-pointer shadow-sm mb-3"
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'Create Account & Enter →'}
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

      {/* 05 — NAVIGATION MODALS */}
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