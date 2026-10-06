import React from 'react';

interface CountdownTimerProps {
  timeRemaining: number;
  totalTime?: number;
  isRunning: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'angled-meter' | 'radial';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeRemaining,
  totalTime = 20,
  isRunning,
  size = 'md',
  showLabel = true,
  variant = 'angled-meter',
}) => {
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const isUrgent = timeRemaining <= 5 && timeRemaining > 0;
  const isExpired = timeRemaining <= 0;

  // Segmented energy blocks with smooth rounded corners (no skews)
  const totalBlocks = size === 'sm' ? 12 : size === 'lg' ? 24 : 18;
  const activeBlocks = Math.ceil((percentage / 100) * totalBlocks);

  // Muted, eye-friendly color palette:
  // Starts at smooth stadium green (#10B981), shifts through warm amber (#F59E0B) to soft rose (#F43F5E)
  const isCrimsonZone = timeRemaining <= 5;
  const isWarningZone = timeRemaining <= 10 && timeRemaining > 5;

  const barColor = isCrimsonZone
    ? '#F43F5E'
    : isWarningZone
    ? '#F59E0B'
    : '#10B981';

  const textColorClass = isCrimsonZone
    ? 'text-rose-400'
    : isWarningZone
    ? 'text-amber-400'
    : 'text-emerald-400';

  if (variant === 'radial') {
    const strokeWidth = size === 'lg' ? 7 : 5;
    const radius = size === 'lg' ? 44 : 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className={`transform -rotate-90 ${size === 'lg' ? 'w-28 h-28' : 'w-20 h-20'}`}
        >
          {/* Background Track */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#1E2533"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Stadium Arc */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={barColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-linear"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-broadcast text-xl font-bold tracking-tight ${textColorClass}`}>
            {timeRemaining.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase font-scoreboard font-semibold text-slate-400">
            SEC
          </span>
        </div>
      </div>
    );
  }

  // Smooth Tactile Power-Meter Rail
  return (
    <div className="w-full select-none">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          {/* Soft Pill Status Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 text-xs font-scoreboard font-semibold uppercase tracking-wide rounded-full border transition-colors ${
                isUrgent
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
                  : isRunning
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : isExpired
                  ? 'bg-slate-900 border-slate-700 text-slate-400'
                  : 'bg-slate-900/80 border-slate-700/50 text-slate-400'
              }`}
            >
              {isExpired
                ? 'Time Expired'
                : isRunning
                ? (isUrgent ? 'Final Seconds' : 'Match Clock Running')
                : 'Clock Ready'}
            </div>
            <span className="text-xs font-scoreboard text-slate-400 hidden sm:inline">
              Speed-Decay Meter
            </span>
          </div>

          {/* Clean Digital Timer Readout */}
          <div className="flex items-baseline gap-1">
            <span
              className={`font-broadcast font-bold tracking-tight transition-all ${
                size === 'lg'
                  ? 'text-4xl sm:text-5xl'
                  : size === 'sm'
                  ? 'text-xl'
                  : 'text-2xl sm:text-3xl'
              } ${textColorClass}`}
            >
              {timeRemaining.toFixed(1)}
            </span>
            <span className="font-scoreboard text-xs font-medium text-slate-400">s</span>
          </div>
        </div>
      )}

      {/* Smooth Rounded Segmented Rail */}
      <div
        className={`relative w-full p-1.5 bg-[#121620] border border-slate-700/50 rounded-xl overflow-hidden ${
          isUrgent && isRunning ? 'border-rose-500/60' : ''
        }`}
      >
        {/* Rounded Energy Segments */}
        <div className="flex gap-1 h-3 sm:h-3.5 w-full">
          {Array.from({ length: totalBlocks }).map((_, idx) => {
            const isLit = idx < activeBlocks;
            return (
              <div
                key={idx}
                className="flex-1 rounded-sm transition-all duration-75"
                style={{
                  backgroundColor: isLit ? barColor : '#1E2533',
                  opacity: isLit ? 1 : 0.35,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
