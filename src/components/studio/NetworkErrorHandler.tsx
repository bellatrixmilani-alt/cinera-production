'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkErrorHandler() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#EADBC8] border-2 border-[#8C4A27] text-[#241711] px-6 py-3.5 rounded-full shadow-[6px_6px_0px_0px_#8C4A27] flex items-center gap-3 font-sans text-xs font-bold"
        >
          <span className="w-3 h-3 rounded-full bg-[#8C4A27] animate-ping" />
          <span>📡 Internet connection lost. Working in offline mode (local auto-save active).</span>
          <button
            onClick={() => setIsOffline(false)}
            className="text-[#8C4A27] hover:text-[#241711] font-black underline cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}