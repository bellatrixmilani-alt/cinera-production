'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CaptureSparkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaptureSparkModal({ isOpen, onClose }: CaptureSparkModalProps) {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3D2B1F]/30 backdrop-blur-xs cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-6 shadow-2xl z-10 text-center"
        >
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#806F62] uppercase block mb-1">
            ✦ NEW SPARK
          </span>
          <h3 className="text-xl font-serif text-[#3D2B1F] mb-4">What's on your mind?</h3>

          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="&quot;Film about Nairobi at 5 AM...&quot;"
            className="w-full bg-[#F7F2EB] border border-[#D9CEC1]/60 rounded-2xl p-3 text-xs font-serif text-[#3D2B1F] focus:outline-none resize-none mb-4"
          />

          <button
            onClick={onClose}
            className="w-full bg-[#3D2B1F] hover:bg-[#171310] text-[#FAF6F0] py-2.5 rounded-full text-xs font-sans tracking-[0.15em] uppercase transition-all cursor-pointer"
          >
            Save Spark
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}