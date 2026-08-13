'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        {/* Darkened Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3D2B1F]/40 backdrop-blur-xs cursor-pointer"
        />

        {/* Newspaper Modal Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-[#F7F2EB] border-2 border-[#3D2B1F] rounded-2xl p-6 sm:p-10 shadow-2xl z-10 overflow-y-auto font-serif text-[#3D2B1F]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-[#3D2B1F] hover:opacity-60 text-sm font-sans transition-opacity cursor-pointer font-bold"
          >
            ✕
          </button>

          {/* NEWSPAPER MASTHEAD */}
          <div className="text-center border-b-2 border-[#3D2B1F] pb-3 mb-6">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-sans tracking-[0.25em] uppercase text-[#6B5546] border-b border-[#3D2B1F]/30 pb-1 mb-2">
              <span>VOL. 01 — ISSUE 01</span>
              <span>THE CREATIVE GAZETTE</span>
              <span>NAIROBI / GLOBAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase font-serif">
              THE HAVEN FOR YOUR STORY
            </h2>
            <p className="text-xs italic text-[#6B5546] mt-1">
              "Your story. Your taste. Your creative studio."
            </p>
          </div>

          {/* MAIN HEADLINE */}
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold italic tracking-wide">
              An Entire Studio That Understands How Your Films Should Feel.
            </h3>
          </div>

          {/* TWO-COLUMN NEWSPAPER BODY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-sans text-[#3D2B1F]/90 border-t border-b border-[#3D2B1F]/30 py-6 mb-6">
            
            {/* Column 1 */}
            <div>
              <p className="mb-3">
                <span className="float-left text-4xl font-serif font-bold leading-none pr-2 pt-1 text-[#3D2B1F]">Y</span>
                ou have an idea for a video, but it’s still messy. Maybe it’s just a sentence in your head, a few screenshots, a track you can't stop playing, or a distinct feeling you want to capture. You bring that into <strong>CINERA AI</strong>.
              </p>
              <p className="mb-3">
                Instead of handing you a generic AI-generated script, CINERA helps you turn that vague spark into something you can actually see, structure, and build. It guides you to discover references, develop visual direction, frame shots, and refine every creative decision along the way.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <p className="mb-3">
                The more you construct within it, the deeply it understands your creative taste—the pacing, cinematography, moods, palettes, and visual language you gravitate toward. You aren't starting from a blank canvas every morning.
              </p>
              <p className="mb-3">
                You are entering a studio that already knows your aesthetic. CINERA doesn't replace your creativity—it accelerates your journey from raw intuition to production.
              </p>
            </div>
          </div>

          {/* PULL QUOTE BLOCK */}
          <div className="bg-[#E8DFD3]/50 border-l-4 border-[#3D2B1F] p-4 mb-6 text-center font-serif">
            <p className="text-sm italic font-medium">
              "CINERA bridges the gap from 'I have an idea...' to 'I know exactly what I want to make.' And finally: 'Let's shoot.'"
            </p>
          </div>

          {/* BOTTOM FEATURE / RETENTION INSIGHT */}
          <div className="border-t border-[#3D2B1F]/20 pt-4 text-center">
            <h4 className="text-xs font-sans tracking-[0.2em] uppercase font-bold text-[#3D2B1F] mb-1">
              THE CREATIVE INSIGHT
            </h4>
            <p className="text-[11px] font-sans text-[#6B5546] max-w-lg mx-auto leading-normal">
              Script generators are commodity tools. Taste is rare. CINERA evolves every day because what a director truly seeks each morning isn't just a utility—it's fresh inspiration that makes them say: <em>"I need to make something today."</em>
            </p>
          </div>

          {/* FOOTER CTA BUTTON */}
          <button
            onClick={onClose}
            className="w-full bg-[#3D2B1F] hover:bg-[#2B1F16] text-[#FAF6F0] py-3 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer shadow-md mt-6"
          >
            RETURN TO THE STUDIO
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}