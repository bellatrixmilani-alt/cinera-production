'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import FlowerDoodle from '@/components/ui/FlowerDoodle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'danger'>('profile');

  const [creatorName, setCreatorName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [audienceTier, setAudienceTier] = useState('');

  const [hasBrowserPermission, setHasBrowserPermission] = useState(false);
  const [dailyNudgeEnabled, setDailyNudgeEnabled] = useState(true);
  const [calendarAlertsEnabled, setCalendarAlertsEnabled] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setHasBrowserPermission(Notification.permission === 'granted');
      }

      supabase.auth.getUser().then((res: { data: { user: any } }) => {
        const user = res?.data?.user;
        if (user) {
          const userId = user.id;
          setUserEmail(user.email || '');

          const savedName = localStorage.getItem(`cinera_creator_name_${userId}`) || user.user_metadata?.full_name || '';
          setCreatorName(savedName);

          const savedNudges = localStorage.getItem(`cinera_daily_nudges_${userId}`);
          if (savedNudges !== null) setDailyNudgeEnabled(savedNudges === 'true');

          const savedCal = localStorage.getItem(`cinera_calendar_alerts_${userId}`);
          if (savedCal !== null) setCalendarAlertsEnabled(savedCal === 'true');

          const profileRaw = localStorage.getItem(`cinera_creator_profile_${userId}`) || localStorage.getItem('cinera_creator_profile');
          if (profileRaw) {
            try {
              const parsed = JSON.parse(profileRaw);
              setSelectedNiches(parsed.niches || []);
              setAudienceTier(parsed.audienceTier || '');
            } catch (e) {
              console.error(e);
            }
          }
        }
      });
    }
  }, [isOpen]);

  const requestNotificationAccess = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('⚠️ Push notifications are not supported on this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setHasBrowserPermission(true);
        setDailyNudgeEnabled(true);
        const { data } = await supabase.auth.getUser();
        const userId = data?.user?.id || 'guest';
        localStorage.setItem(`cinera_daily_nudges_${userId}`, 'true');

        new Notification('Cinera Director Call', {
          body: '🎬 "Hey, people are waiting for your content!" Tap to enter your studio.',
          icon: '/favicon.ico',
        });
        showToast('🔔 Notifications enabled! Test alert sent.');
      } else {
        setHasBrowserPermission(false);
        showToast('⚠️ Notification access was denied in browser settings.');
      }
    } catch (e) {
      console.error(e);
      showToast('⚠️ Could not request permissions.');
    }
  };

  const triggerTestAlert = () => {
    if (!hasBrowserPermission) {
      requestNotificationAccess();
      return;
    }
    new Notification('Cinera Studio Alert', {
      body: '🎬 "Hey, people are waiting for your content!" Time to shoot your next scene.',
      icon: '/favicon.ico',
    });
    showToast('🔔 Test reminder fired!');
  };

  const handleSaveProfile = async () => {
    if (!creatorName.trim()) return;
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id || 'guest';

    localStorage.setItem(`cinera_creator_name_${userId}`, creatorName.trim());
    localStorage.setItem(`cinera_daily_nudges_${userId}`, String(dailyNudgeEnabled));
    localStorage.setItem(`cinera_calendar_alerts_${userId}`, String(calendarAlertsEnabled));
    showToast('✓ Settings updated successfully.');
  };

  const handlePasswordReset = async () => {
    if (!userEmail) {
      showToast('⚠️ No active account email found.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/studio`,
      });
      if (error) throw error;
      showToast('✉️ Password reset link sent to your email.');
    } catch (err: any) {
      showToast(`⚠️ ${err.message || 'Failed to send reset link.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllData = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear your Cinera workspace data for this account? This cannot be undone.'
    );
    if (!confirmClear) return;

    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id || 'guest';

    localStorage.removeItem(`cinera_active_todos_${userId}`);
    localStorage.removeItem(`cinera_tasks_full_${userId}`);
    localStorage.removeItem(`cinera_chat_sessions_${userId}`);
    localStorage.removeItem(`cinera_sparks_vault_${userId}`);
    localStorage.removeItem(`cinera_creator_profile_${userId}`);
    localStorage.removeItem(`cinera_creator_name_${userId}`);
    localStorage.removeItem(`cinera_calendar_events_${userId}`);
    localStorage.removeItem(`cinera_active_shotlist_${userId}`);

    showToast('🧹 Account workspace data erased.');
    setTimeout(() => {
      window.location.href = '/onboarding';
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to sign out? Your workspace will remain secure and private to your account.'
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (err: any) {
      showToast(`⚠️ ${err.message || 'Error signing out.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-[#6B4426] text-[#FAF6F0] px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold z-60 border border-[#FAF6F0]/20 max-w-[90vw]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-[#FAF6F0] border-2 border-[#8C4A27]/25 rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92dvh] my-auto"
      >
        {/* SIDEBAR TABS */}
        <aside className="w-full md:w-56 bg-[#EADBC8]/70 border-b md:border-b-0 md:border-r border-[#8C4A27]/20 p-4 sm:p-5 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center justify-between md:justify-start gap-2.5 mb-3 md:mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] border border-[#8C4A27]/20 flex items-center justify-center shadow-2xs">
                  <FlowerDoodle size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-[#8C4A27] block">
                    WORKSPACE
                  </span>
                  <h3 className="text-xs sm:text-sm font-serif font-bold text-[#241711]">Studio Settings</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="md:hidden text-[#8C4A27] font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {[
                { id: 'profile', label: '👤 Profile' },
                { id: 'notifications', label: '🔔 Nudges' },
                { id: 'security', label: '🔒 Security' },
                { id: 'danger', label: '⚠️ Account' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-auto md:w-full text-left px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                    activeTab === tab.id
                      ? 'bg-[#6B4426] text-[#FAF6F0] shadow-xs'
                      : 'text-[#241711] hover:bg-[#EADBC8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden md:block pt-4 border-t border-[#8C4A27]/15">
            <span className="text-[9px] font-mono text-[#8C4A27]/70 uppercase block">CINERA SUITE v1.0</span>
            <span className="text-[10px] font-serif text-[#241711]/60 italic">Calm & brilliance</span>
          </div>
        </aside>

        {/* CONTENT PANEL */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto flex flex-col justify-between bg-[#FAF6F0] gap-5">
          
          {activeTab === 'profile' && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#241711]">Creator Identity</h4>
                <p className="text-xs font-serif text-[#8C4A27]">
                  Configure how Cinera addresses you during concept calls.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C4A27] block mb-1">
                    WHAT SHOULD CINERA CALL YOU?
                  </label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="e.g. Director, Alex..."
                    className="w-full bg-[#FAF6F0] border border-[#8C4A27]/25 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-serif text-[#241711] focus:outline-none focus:border-[#6B4426]"
                  />
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C4A27] block mb-1">
                    CURRENT CREATIVE NICHES
                  </label>
                  <div className="p-3 bg-[#EADBC8]/40 border border-[#8C4A27]/15 rounded-xl text-xs font-serif text-[#241711] flex flex-wrap gap-1.5">
                    {selectedNiches.length > 0 ? (
                      selectedNiches.map((n) => (
                        <span key={n} className="bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#8C4A27]/20 text-[11px] font-bold text-[#6B4426]">
                          {n}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-[#8C4A27]">No specific niches selected.</span>
                    )}
                  </div>
                  <a href="/onboarding" className="text-[10px] font-mono font-bold text-[#8C4A27] hover:underline block mt-1.5">
                    ✎ Re-configure niches in Onboarding →
                  </a>
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C4A27] block mb-1">
                    AUDIENCE STAGE
                  </label>
                  <input
                    type="text"
                    disabled
                    value={audienceTier || 'Nano Creator'}
                    className="w-full bg-[#EADBC8]/30 border border-[#8C4A27]/20 rounded-xl px-3.5 py-2 text-xs font-mono text-[#8C4A27]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#241711]">Device Alerts & Daily Filming Nudges</h4>
                <p className="text-xs font-serif text-[#8C4A27]">
                  Receive an everyday prompt on your device reminding you to keep creative momentum.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-[#EADBC8]/50 border border-[#8C4A27]/25 rounded-2xl flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-serif font-bold text-[#241711] block">Browser Push Permissions</span>
                  <span className="text-[10px] sm:text-[11px] font-serif text-[#8C4A27]">
                    {hasBrowserPermission ? '✓ Active & Authorized' : '⚠️ Permissions required for phone/desktop pop-ups'}
                  </span>
                </div>
                <button
                  onClick={requestNotificationAccess}
                  className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0 min-h-[36px]"
                >
                  {hasBrowserPermission ? 'Re-test Alert' : 'Enable Pop-ups'}
                </button>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#8C4A27]/15">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#241711] block">Daily Production Call</span>
                    <span className="text-[10px] font-serif text-[#8C4A27]/80 italic">"Hey, people are waiting for your content!"</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyNudgeEnabled}
                    onChange={(e) => setDailyNudgeEnabled(e.target.checked)}
                    className="accent-[#6B4426] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#8C4A27]/15">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#241711] block">Calendar Shoot Deadlines</span>
                    <span className="text-[10px] font-serif text-[#8C4A27]/80">Alert on scheduled filming and editing dates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={calendarAlertsEnabled}
                    onChange={(e) => setCalendarAlertsEnabled(e.target.checked)}
                    className="accent-[#6B4426] w-4 h-4 cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={triggerTestAlert}
                  className="w-full bg-[#EADBC8] hover:bg-[#DFCEB9] text-[#6B4426] border border-[#8C4A27]/20 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center min-h-[38px]"
                >
                  ⚡ Send Test Push Reminder Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#241711]">Security & Credentials</h4>
                <p className="text-xs font-serif text-[#8C4A27]">
                  Manage your authentication and password security.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C4A27] block mb-1">
                    AUTHENTICATED EMAIL
                  </label>
                  <input
                    type="email"
                    disabled
                    value={userEmail || 'creator@cinera.studio'}
                    className="w-full bg-[#EADBC8]/30 border border-[#8C4A27]/20 rounded-xl px-3.5 py-2 text-xs font-mono text-[#8C4A27]"
                  />
                </div>

                <div className="p-3.5 sm:p-4 bg-[#EADBC8]/40 border border-[#8C4A27]/15 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#241711] block">Password Reset</span>
                    <span className="text-[10px] font-serif text-[#8C4A27]">Send a secure one-click reset link to your email.</span>
                  </div>
                  <button
                    onClick={handlePasswordReset}
                    disabled={isLoading}
                    className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[36px]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h4 className="text-sm sm:text-base font-serif font-bold text-red-800">Data Controls & Account</h4>
                <p className="text-xs font-serif text-red-900/70">
                  Manage your data isolation or sign out of this device.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-serif font-bold text-red-950 block">Clear Local Account Data</span>
                    <span className="text-[10px] font-serif text-red-800/80">
                      Erases all saved sparks, sessions, and tasks for this specific account.
                    </span>
                  </div>
                  <button
                    onClick={handleClearAllData}
                    className="bg-red-800 hover:bg-red-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[36px]"
                  >
                    Clear Data
                  </button>
                </div>

                <div className="p-3.5 sm:p-4 bg-red-100/70 border border-red-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-serif font-bold text-red-950 block">Sign Out</span>
                    <span className="text-[10px] font-serif text-red-800/80">
                      Safely sign out and leave a clean slate for the next login.
                    </span>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 min-h-[36px]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="pt-4 border-t border-[#8C4A27]/20 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="text-xs font-serif font-bold text-[#8C4A27] hover:text-[#241711] cursor-pointer min-h-[36px] px-2"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleSaveProfile();
                onClose();
              }}
              className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer min-h-[38px]"
            >
              Save & Apply
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}