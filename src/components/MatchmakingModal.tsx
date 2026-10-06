import React, { useState, useEffect } from 'react';
import { UserProfile, MatchmakingBot } from '../types/progression';
import { RANK_TIERS } from '../utils/progression';
import { createBotOpponent } from '../utils/botEngine';
import { 
  X, 
  Trophy, 
  Users, 
  Clock, 
  WifiOff, 
  Sparkles, 
  ArrowRight,
  Shield,
  Radio
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onMatchFound: (gameMode: '1v1_ranked' | 'ffa_4p', opponents: MatchmakingBot[]) => void;
  onFallbackToLocal: () => void;
}

const TRIVIA_TIPS = [
  'Tip: Instant answers with 20s left score 100% base points, while 0s buzzer-beaters still score 50%!',
  'Tip: Consecutive correct answers award an automatic +25 pts streak bonus!',
  'Tip: Erling Haaland broke the single-season Premier League scoring record with 36 goals in 2022-23.',
  'Tip: Kai Havertz scored the only goal in the 2021 Champions League Final against Manchester City.',
  'Tip: Argentina defeated France on penalties following a legendary 3-3 draw in the 2022 World Cup Final.',
  'Tip: Spain conquered UEFA Euro 2024 by defeating England 2-1 in Berlin.',
  'Tip: Bayer Leverkusen completed an unprecedented 34-match unbeaten Bundesliga season in 2023-24.',
];

export const MatchmakingModal: React.FC<MatchmakingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onMatchFound,
  onFallbackToLocal,
}) => {
  const [selectedMode, setSelectedMode] = useState<'1v1_ranked' | 'ffa_4p'>('1v1_ranked');
  const [isSearching, setIsSearching] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Searching timer & 60-second Bot Fallback timeout
  useEffect(() => {
    let interval: number | null = null;
    if (isSearching) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;

          if (next % 6 === 0) {
            setTipIndex(t => (t + 1) % TRIVIA_TIPS.length);
          }

          if (next >= 60) {
            triggerBotBackfill();
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSearching]);

  if (!isOpen) return null;

  const handleStartSearch = () => {
    setIsSearching(true);
    setElapsedSeconds(0);
    soundEngine.playWhistle();
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setElapsedSeconds(0);
  };

  const triggerBotBackfill = () => {
    setIsSearching(false);
    soundEngine.playStreak();

    const count = selectedMode === '1v1_ranked' ? 1 : 3;
    const bots: MatchmakingBot[] = [];
    for (let i = 0; i < count; i++) {
      bots.push(createBotOpponent(profile.rankTier, profile.skillRating, i));
    }

    onClose();
    onMatchFound(selectedMode, bots);
  };

  const rankInfo = RANK_TIERS[profile.rankTier];
  const searchRadius = Math.min(450, 100 + Math.floor(elapsedSeconds / 5) * 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121620]/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-broadcast font-bold text-[#F1F5F9] leading-tight">
                COMPETITIVE MATCHMAKING
              </h2>
              <p className="text-xs text-slate-400 font-scoreboard mt-0.5">
                Global Ranked Ladder · Elo Rating: <span className="text-emerald-400 font-semibold font-mono">{profile.skillRating}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Offline Warning Banner with Local Fallback */}
        {isOffline && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between gap-3 text-xs text-rose-200 relative z-10">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>You are currently offline. Switch to Local Pass & Play mode?</span>
            </div>
            <button
              type="button"
              onClick={() => { onClose(); onFallbackToLocal(); }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-scoreboard font-semibold rounded-full text-xs cursor-pointer shadow-sm"
            >
              Switch to Offline
            </button>
          </div>
        )}

        <div className="p-6 space-y-6 relative z-10">
          {!isSearching ? (
            /* Mode Selection Screen */
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setSelectedMode('1v1_ranked')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedMode === '1v1_ranked'
                      ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-sm'
                      : 'bg-[#121620] border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1">⚽</div>
                  <div className="font-broadcast text-xl font-bold text-[#F1F5F9] leading-tight">
                    1v1 Ranked Duel
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Direct head-to-head match against an opponent matching your skill tier.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('ffa_4p')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedMode === 'ffa_4p'
                      ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-sm'
                      : 'bg-[#121620] border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1">🏟️</div>
                  <div className="font-broadcast text-xl font-bold text-[#F1F5F9] leading-tight">
                    4-Player Battle
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Free-For-All match with 4 contestants competing for podium standings.
                  </p>
                </button>
              </div>

              {/* Player Matchmaking Card Preview */}
              <div className="p-4 rounded-xl bg-[#121620] border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-sm shadow-sm border border-slate-600`}>
                    #{profile.avatarNumber}
                  </div>
                  <div>
                    <div className="font-scoreboard font-semibold text-[#F1F5F9]">{profile.username}</div>
                    <div className="text-xs font-scoreboard text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>{rankInfo.icon}</span>
                      <span>{profile.rankTier}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300">Lvl {profile.level}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-scoreboard uppercase block">Division Tier</span>
                  <span className="text-lg font-broadcast font-bold text-[#F1F5F9]">
                    Division {Math.max(1, 10 - Math.floor(profile.skillRating / 150))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartSearch}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard font-semibold text-base rounded-full shadow-md transition-colors cursor-pointer"
              >
                <span>Enter Matchmaking Queue</span>
              </button>
            </div>
          ) : (
            /* Animated Searching Screen */
            <div className="space-y-6 text-center py-4">
              {/* Radar Sweep Animation (Soft, Non-Blinding) */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-30" />
                <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-slate-800 border border-emerald-500/50 flex items-center justify-center text-2xl">
                  ⚽
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-broadcast font-bold text-[#F1F5F9]">
                  Searching for Opponents...
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-xs font-scoreboard text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Time in Queue: <span className="font-semibold text-emerald-400 font-mono">{elapsedSeconds}s</span> / 60s</span>
                </div>
                <div className="text-xs font-scoreboard text-slate-400 mt-0.5">
                  Skill Search Radius: <span className="text-slate-200 font-semibold font-mono">±{searchRadius} Elo</span>
                </div>
              </div>

              {/* Bot Fallback Progress Bar */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between text-[11px] font-scoreboard text-slate-400">
                  <span>AI Bot Backfill Guarantee</span>
                  <span className="text-emerald-400 font-mono">{Math.max(0, 60 - elapsedSeconds)}s remaining</span>
                </div>
                <div className="w-full h-2 bg-[#121620] rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(elapsedSeconds / 60) * 100}%` }}
                  />
                </div>
              </div>

              {/* Scouting Report Box */}
              <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-700/50 text-xs text-slate-300 font-sans text-left leading-relaxed">
                <div className="flex items-center gap-1.5 text-[10px] font-scoreboard font-semibold text-emerald-400 uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Matchday Scouting Report</span>
                </div>
                {TRIVIA_TIPS[tipIndex]}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelSearch}
                  className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 font-scoreboard text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel Search
                </button>

                {elapsedSeconds >= 10 && (
                  <button
                    type="button"
                    onClick={triggerBotBackfill}
                    className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    Deploy AI Opponents Now
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
