'use client';

import React, { useEffect } from 'react';

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Studio Room Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-[#FAF6F0] border-2 border-[#8C4A27]/25 rounded-[28px] p-6 shadow-md flex flex-col items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-base font-serif font-bold text-[#241711]">
          Unable to Load Studio Room
        </h3>
        <p className="text-xs font-serif text-[#8C4A27]">
          Failed to synchronize this workspace room. Click below to reload the section.
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#6B4426] hover:bg-[#52331B] text-[#FAF6F0] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer mt-2"
        >
          Reload Room
        </button>
      </div>
    </div>
  );
}