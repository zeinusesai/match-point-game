import React from 'react';

export const FooterWatermark: React.FC = () => {
  return (
    <aside
      aria-label="Developer attribution watermark"
      className="fixed bottom-2 right-2 sm:bottom-3.5 sm:right-4 z-[9999] pointer-events-none select-none text-[11px] sm:text-xs tracking-wider uppercase font-sans text-slate-400/50 backdrop-blur-[2px] px-2 py-1 rounded bg-slate-950/20 border border-white/5 transition-opacity"
    >
      Developed by Zein | All Rights Reserved
    </aside>
  );
};
