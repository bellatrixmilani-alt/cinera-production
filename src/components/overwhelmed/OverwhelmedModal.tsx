'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OverwhelmedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OverwhelmedModal({ isOpen, onClose }: OverwhelmedModalProps) {
  const [step, setStep] = useState<'options' | 'resolved'>('options');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Soft Background Tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3D2B1F]/40 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-8 shadow-2xl z-10 text-center font-serif text-[#3D2B1F]"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#806F62] hover:text-[#3D2B1F] text-xs font-sans cursor-pointer"
          >
            ✕
          </button>

          {step === 'options' ? (
            <>
              <h3 className="text-3xl font-normal mb-1">Okay. Let's slow down.</h3>
              <p className="text-xs font-sans text-[#806F62] mb-6">What are you dealing with right now?</p>

              <div className="space-y-2 text-left font-sans text-xs">
                {[
                  'I have too many ideas.',
                  "I don't know what to create.",
                  "I don't know where to start.",
                  'My project feels messy.',
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep('resolved')}
                    className="w-full bg-[#F7F2EB] hover:bg-[#3D2B1F] hover:text-[#FAF6F0] border border-[#D9CEC1]/60 p-3.5 rounded-2xl transition-all cursor-pointer font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#806F62] uppercase block mb-2">
                COLLECTION 01 • NAIROBI AFTER DARK
              </span>
              <h3 className="text-2xl font-normal mb-3">You don't need all 27 Sparks.</h3>
              <p className="text-xs font-sans text-[#806F62] mb-4">
                I found 4 thoughts that belong together:
              </p>

              <div className="bg-[#F7F2EB] border border-[#D9CEC1]/60 rounded-2xl p-4 text-left font-serif text-xs space-y-1.5 mb-6">
                <p>• "Matatu lights."</p>
                <p>• "Late-night food stalls."</p>
                <p>• "Someone waiting for a phone call."</p>
                <p>• "Rain on the pavement."</p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#3D2B1F] hover:bg-[#171310] text-[#FAF6F0] py-3 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all cursor-pointer shadow-md"
              >
                Turn these into a project →
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}