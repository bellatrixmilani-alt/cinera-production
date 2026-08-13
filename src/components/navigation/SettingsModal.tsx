'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3D2B1F]/30 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
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

          <h3 className="text-2xl font-serif uppercase tracking-[0.15em] text-[#3D2B1F] mb-1">
            PREFERENCES
          </h3>
          <p className="text-xs font-sans text-[#6B5546] mb-6">
            Customize your workspace ambiance
          </p>

          <div className="space-y-4 text-left border-t border-[#3D2B1F]/10 pt-4">
            {/* Setting Item 1 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-sans font-medium text-[#3D2B1F]">
                  Ambient Studio Audio
                </span>
                <span className="block text-[10px] text-[#6B5546]">
                  Subtle sound cues during generation
                </span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  soundEnabled ? 'bg-[#3D2B1F]' : 'bg-[#E8DFD3]'
                }`}
              >
                <div
                  className={`bg-[#FAF6F0] w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Setting Item 2 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-sans font-medium text-[#3D2B1F]">
                  Reduced Motion
                </span>
                <span className="block text-[10px] text-[#6B5546]">
                  Minimize landing background animations
                </span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  reducedMotion ? 'bg-[#3D2B1F]' : 'bg-[#E8DFD3]'
                }`}
              >
                <div
                  className={`bg-[#FAF6F0] w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#3D2B1F] hover:bg-[#2B1F16] text-[#FAF6F0] py-3 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer shadow-xs mt-6"
          >
            SAVE PREFERENCES
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}