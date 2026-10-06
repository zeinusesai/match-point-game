import React from 'react';
import { Player } from '../types/trivia';
import { Trophy, Flame, Plus, Minus, UserCheck, Crown, Sparkles } from 'lucide-react';

interface LeaderboardSidebarProps {
  players: Player[];
  activePlayerId?: string;
  onSelectPlayer?: (playerId: string) => void;
  onManualAdjust?: (playerId: string, delta: number) => void;
  showControls?: boolean;
}

export const LeaderboardSidebar: React.FC<LeaderboardSidebarProps> = ({
  players,
  activePlayerId,
  onSelectPlayer,
  onManualAdjust,
  showControls = false,
}) => {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-4 flex flex-col h-full shadow-lg relative overflow-hidden backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/40 mb-3.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-broadcast text-lg font-bold text-[#F1F5F9] leading-tight">
              Standings
            </h3>
            <span className="text-[11px] font-scoreboard text-slate-400">
              Live Matchday Table
            </span>
          </div>
        </div>
        <span className="text-xs text-emerald-400 font-scoreboard font-semibold bg-[#121620] px-3 py-1 rounded-full border border-emerald-500/30">
          {players.length} Players
        </span>
      </div>

      {/* Top 3 Podium Showcase */}
      {sorted.length >= 2 && (
        <div className="grid grid-cols-3 gap-2 mb-3.5 p-3 bg-[#121620] border border-slate-700/40 rounded-xl relative z-10 text-center items-end">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-scoreboard font-medium text-slate-400">2ND</span>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${sorted[1]?.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-xs shadow-sm border border-slate-600`}>
              #{sorted[1]?.avatarNumber}
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate w-full mt-1">{sorted[1]?.name}</div>
            <div className="text-xs font-mono font-medium text-slate-300">{sorted[1]?.score}</div>
          </div>

          {/* 1st Place (Leader) */}
          <div className="flex flex-col items-center -mt-1">
            <Crown className="w-3.5 h-3.5 text-amber-400 animate-bounce mb-0.5" />
            <span className="text-[10px] font-scoreboard font-bold text-amber-400">1ST</span>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${sorted[0]?.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-sm shadow-md ring-2 ring-amber-400/50 border border-amber-300/40`}>
              #{sorted[0]?.avatarNumber}
            </div>
            <div className="text-xs font-bold text-amber-300 truncate w-full mt-1">{sorted[0]?.name}</div>
            <div className="text-sm font-mono font-bold text-emerald-400">{sorted[0]?.score}</div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-scoreboard font-medium text-amber-600">3RD</span>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${sorted[2]?.avatarColor || 'from-slate-700 to-slate-900'} flex items-center justify-center text-white font-scoreboard font-bold text-xs shadow-sm border border-amber-700/60`}>
              {sorted[2] ? `#${sorted[2].avatarNumber}` : '-'}
            </div>
            <div className="text-xs font-semibold text-slate-300 truncate w-full mt-1">{sorted[2]?.name || '---'}</div>
            <div className="text-xs font-mono font-medium text-amber-500/80">{sorted[2]?.score || 0}</div>
          </div>
        </div>
      )}

      {/* Player Standings List */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar relative z-10">
        {sorted.map((player, index) => {
          const isActive = player.id === activePlayerId;
          const isGold = index === 0 && player.score > 0;
          const isSilver = index === 1 && player.score > 0;
          const isBronze = index === 2 && player.score > 0;

          // Smooth rounded card row styling
          let borderStyle = 'border-slate-700/40 bg-[#121620] hover:border-slate-600';
          if (isGold) borderStyle = 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-[#121620]';
          else if (isSilver) borderStyle = 'border-slate-600/40 bg-[#121620]';
          else if (isBronze) borderStyle = 'border-amber-800/30 bg-[#121620]';

          if (isActive) {
            borderStyle = 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/40 shadow-sm';
          }

          return (
            <div
              key={player.id}
              onClick={() => onSelectPlayer && onSelectPlayer(player.id)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer select-none ${borderStyle}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Position Badge */}
                  <span className={`w-5 text-center font-scoreboard text-xs font-bold ${
                    isGold ? 'text-amber-400' : isSilver ? 'text-slate-300' : isBronze ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>

                  {/* Circular Avatar */}
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-xs shadow-sm border border-white/20 flex-shrink-0 relative`}>
                    #{player.avatarNumber}
                    {isGold && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-slate-950" />
                      </span>
                    )}
                  </div>

                  {/* Player Name and Stats */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-scoreboard font-semibold text-[#F1F5F9] truncate group-hover:text-emerald-300 transition-colors">
                        {player.name}
                      </span>
                      {player.isHost && (
                        <span className="text-[10px] text-emerald-400 font-scoreboard font-medium px-1.5 py-0.2 bg-emerald-950/40 border border-emerald-500/30 rounded-full">
                          Host
                        </span>
                      )}
                      {isActive && (
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-scoreboard">
                      <span>{player.correctCount} goals</span>
                      {player.streak >= 2 && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-amber-400 font-medium flex items-center gap-0.5">
                            <Flame className="w-3 h-3 fill-current" />
                            {player.streak}x streak
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-broadcast text-xl font-bold leading-none text-emerald-400">
                    {player.score.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400 font-scoreboard uppercase block mt-0.5">
                    PTS
                  </span>
                </div>
              </div>

              {/* Host Quick Adjust Buttons */}
              {showControls && onManualAdjust && (
                <div className="mt-2 pt-2 border-t border-slate-700/30 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-scoreboard text-[11px]">
                    VAR Adjust:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onManualAdjust(player.id, -25);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 transition-colors font-scoreboard font-medium flex items-center gap-1 border border-slate-700/50"
                      title="Deduct 25 pts"
                    >
                      <Minus className="w-3 h-3" />
                      <span>25</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onManualAdjust(player.id, 25);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-400 transition-colors font-scoreboard font-medium flex items-center gap-1 border border-slate-700/50"
                      title="Add 25 pts"
                    >
                      <Plus className="w-3 h-3" />
                      <span>25</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
