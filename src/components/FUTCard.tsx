import React from 'react';
import { Player } from '../types/trivia';
import { RemotePlayer } from '../types/multiplayer';
import { Flame, Sparkles } from 'lucide-react';

export interface FUTCardProps {
  player: Player | RemotePlayer;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rank?: number;
  showStats?: boolean;
  variant?: 'gold' | 'special-lime' | 'champions' | 'silver';
  className?: string;
  onClick?: () => void;
}

export const FUTCard: React.FC<FUTCardProps> = ({
  player,
  isActive = false,
  size = 'md',
  rank,
  showStats = true,
  variant,
  className = '',
  onClick,
}) => {
  const remotePlayer = player as RemotePlayer;

  // Determine card edition based on score, streak or rank
  const cardEdition = variant || (
    isActive 
      ? 'special-lime' 
      : (rank === 1 && player.score > 0)
      ? 'gold'
      : player.score >= 300
      ? 'champions'
      : 'gold'
  );

  // Calculate dynamic overall (OVR) rating (75 - 99 scale)
  const baseOvr = 78;
  const streakBoost = Math.min(10, (player.streak || 0) * 3);
  const scoreBoost = Math.min(11, Math.floor((player.score || 0) / 100));
  const ovr = Math.min(99, Math.max(75, baseOvr + streakBoost + scoreBoost));

  // Determine position
  const position = player.isHost 
    ? 'CAPT' 
    : player.streak >= 3 
    ? 'ST' 
    : player.score > 300 
    ? 'CAM' 
    : player.correctCount > 3
    ? 'RW'
    : 'CM';

  // Calculate 6-Stats
  const totalAnswers = (player.correctCount || 0) + (player.incorrectCount || 0);
  const spdStat = player.correctCount > 0 && player.totalAnswerTimeRemaining > 0
    ? Math.max(70, Math.min(99, Math.round(75 + (player.totalAnswerTimeRemaining / player.correctCount) * 1.2)))
    : 84;

  const accStat = totalAnswers > 0
    ? Math.max(65, Math.min(99, Math.round((player.correctCount / totalAnswers) * 100)))
    : 80;

  const stkStat = Math.min(99, 70 + (player.maxStreak || player.streak || 0) * 7);
  const ptsStat = Math.min(99, 72 + Math.floor(player.score / 30));
  const clbStat = Math.min(99, 75 + (player.clutchPoints > 0 ? 15 : 5));
  const iqStat = Math.min(99, 75 + (player.veryHardCorrectCount || 0) * 8);

  // Sizing definitions
  const widthClasses = size === 'sm' ? 'w-36' : size === 'lg' ? 'w-64' : 'w-52';
  const heightClasses = size === 'sm' ? 'min-h-[190px]' : size === 'lg' ? 'min-h-[330px]' : 'min-h-[260px]';

  return (
    <div
      onClick={onClick}
      className={`relative select-none group cursor-pointer transition-all duration-200 ${widthClasses} ${heightClasses} ${className} ${
        isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      {/* Smooth Rounded Container with Soft Depth */}
      <div
        className={`w-full h-full rounded-2xl p-0.5 transition-all ${
          isActive
            ? 'bg-gradient-to-b from-emerald-500/40 via-emerald-600/20 to-slate-800 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950/40'
            : cardEdition === 'gold'
            ? 'bg-gradient-to-b from-amber-500/30 via-amber-600/10 to-slate-800 shadow-md'
            : 'bg-gradient-to-b from-sky-500/30 via-slate-700/20 to-slate-800 shadow-md'
        }`}
      >
        {/* Inner Card Face */}
        <div className="w-full h-full bg-[#1A202C] rounded-[14px] flex flex-col justify-between p-3.5 border border-slate-700/40 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          {isActive && (
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none rounded-[14px]" />
          )}

          {/* Top Section: OVR, Position, Club Badge & Rank */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col items-center">
              <span
                className={`font-broadcast text-3xl sm:text-4xl font-bold leading-none ${
                  isActive
                    ? 'text-emerald-400'
                    : cardEdition === 'gold'
                    ? 'text-amber-400'
                    : 'text-sky-400'
                }`}
              >
                {ovr}
              </span>
              <span className="font-scoreboard font-semibold text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">
                {position}
              </span>
              {remotePlayer.favoriteClub && (
                <div
                  title={remotePlayer.favoriteClub}
                  className="mt-1 px-2 py-0.5 bg-[#121620] border border-slate-700/50 rounded-full text-[9px] font-scoreboard text-slate-300 max-w-[56px] truncate"
                >
                  {remotePlayer.favoriteClub.split(' ')[0]}
                </div>
              )}
            </div>

            {/* Rank / Status Pill */}
            <div className="flex flex-col items-end gap-1">
              {rank !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-scoreboard font-bold tracking-wide ${
                    rank === 1
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : rank === 2
                      ? 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                      : rank === 3
                      ? 'bg-amber-900/30 text-amber-400 border border-amber-800/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{rank}
                </span>
              )}
              {player.streak >= 2 && (
                <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-500/40 px-2 py-0.5 rounded-full text-[10px] font-scoreboard font-semibold text-rose-300">
                  <Flame className="w-2.5 h-2.5 fill-current" />
                  <span>{player.streak}x</span>
                </div>
              )}
              {isActive && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-scoreboard font-semibold text-[10px] rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Center: Player Jersey / Circular Avatar */}
          <div className="relative z-10 flex flex-col items-center my-1.5">
            <div className="relative">
              <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${player.avatarColor} border-2 border-slate-700/60 flex items-center justify-center text-white font-broadcast text-xl sm:text-2xl font-bold shadow-md`}>
                #{player.avatarNumber}
              </div>
              {cardEdition === 'gold' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500/90 rounded-full flex items-center justify-center shadow">
                  <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                </span>
              )}
            </div>

            {/* Player Name */}
            <h4 className="font-broadcast text-lg sm:text-xl font-bold text-[#F1F5F9] text-center mt-1.5 truncate max-w-[95%]">
              {player.name}
            </h4>

            {/* Total Points Badge */}
            <div className="flex items-center gap-1 text-xs font-scoreboard mt-0.5">
              <span className="text-slate-400">Score:</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {player.score.toLocaleString()} pts
              </span>
            </div>
          </div>

          {/* Bottom Matrix: 6-Stat Grid */}
          {showStats && size !== 'sm' && (
            <div className="relative z-10 pt-2 border-t border-slate-700/40 mt-1">
              <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-center">
                <div>
                  <span className="text-[10px] font-scoreboard text-slate-400 mr-1">SPD</span>
                  <span className="text-xs font-scoreboard font-bold text-slate-200">{spdStat}</span>
                </div>
                <div>
                  <span className="text-[10px] font-scoreboard text-slate-400 mr-1">ACC</span>
                  <span className="text-xs font-scoreboard font-bold text-slate-200">{accStat}</span>
                </div>
                <div>
                  <span className="text-[10px] font-scoreboard text-slate-400 mr-1">STK</span>
                  <span className="text-xs font-scoreboard font-bold text-slate-200">{stkStat}</span>
                </div>
                <div>
                  <span className="text-[10px] font-scoreboard text-slate-400 mr-1">PTS</span>
                  <span className="text-xs font-scoreboard font-bold text-slate-200">{ptsStat}</span>
                </div>
                <div>
                  <span className="text-[10px] font-scoreboard text-slate-400 mr-1">CLU</span>
                  <span className="text-xs font-scoreboard font-bold text-slate-200">{clbStat}</span>
                </div>
                <div>
                  <span className="text-[10px] font-scoreboard text-slate-400 mr-1">IQ</span>
                  <span className="text-xs font-scoreboard font-bold text-slate-200">{iqStat}</span>
                </div>
              </div>
            </div>
          )}

          {/* Card Base Emblem */}
          <div className="relative z-10 flex items-center justify-center pt-1.5 pb-0.5">
            <span className="text-[9px] uppercase font-scoreboard font-medium text-slate-500 tracking-wider">
              MatchPoint Player Card
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
