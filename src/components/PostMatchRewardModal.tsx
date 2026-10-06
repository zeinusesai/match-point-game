import React, { useEffect } from 'react';
import { PostMatchRewards, UserProfile } from '../types/progression';
import { Trophy, Sparkles, Flame, ArrowRight, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface PostMatchRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: PostMatchRewards;
  profile: UserProfile;
}

export const PostMatchRewardModal: React.FC<PostMatchRewardModalProps> = ({
  isOpen,
  onClose,
  rewards,
  profile,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (rewards.leveledUp) {
        soundEngine.playStreak();
      } else {
        soundEngine.playCorrect();
      }
      try {
        confetti({
          particleCount: rewards.leveledUp ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#eab308', '#06b6d4', '#ec4899', '#ffffff'],
        });
      } catch {}
    }
  }, [isOpen, rewards.leveledUp]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071d12] border-2 border-emerald-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative text-center">
        {/* Stadium Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          {/* Header Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-4xl shadow-xl ring-4 ring-amber-400/40 border border-white/20 animate-bounce">
              {rewards.leveledUp ? '👑' : '🏆'}
            </div>
            {rewards.leveledUp && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-stadium text-xs font-bold shadow-md animate-pulse">
                LEVEL UP!
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="font-stadium text-3xl font-black text-slate-100 tracking-wide">
              {rewards.leveledUp ? 'LEVEL UP REACHED!' : 'MATCHDAY REWARDS CLAIMED!'}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              XP, Trophy Coins, and Career metrics updated successfully.
            </p>
          </div>

          {/* Reward Summary Chips */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center">
              <span className="text-[10px] uppercase font-scoreboard font-bold text-slate-400 block">EXPERIENCE POINTS</span>
              <span className="font-stadium text-3xl font-black text-emerald-400">+{rewards.xpEarned} XP</span>
              {rewards.streakMultiplier > 1 && (
                <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                  ({rewards.streakMultiplier}x Daily Streak Multiplier)
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40 text-center">
              <span className="text-[10px] uppercase font-scoreboard font-bold text-slate-400 block">TROPHY COINS</span>
              <span className="font-stadium text-3xl font-black text-amber-300">+{rewards.coinsEarned} 🪙</span>
              {rewards.leveledUp && (
                <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                  (+100 Level-up Bonus!)
                </span>
              )}
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-scoreboard font-bold">
              <span className="text-slate-300">PLAYER LEVEL {profile.level}</span>
              <span className="text-emerald-400">{profile.xp} / {profile.level * 250 + 150} XP</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${Math.min(100, Math.round((profile.xp / (profile.level * 250 + 150)) * 100))}%` }}
              />
            </div>
          </div>

          {/* Dismiss CTA */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-stadium font-black text-xl tracking-wider rounded-xl shadow-lg shadow-emerald-950 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <span>CONTINUE TO LOCKER ROOM</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
