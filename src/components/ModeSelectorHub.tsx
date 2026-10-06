import React from 'react';
import { UserProfile } from '../types/progression';
import { RANK_TIERS } from '../utils/progression';
import { 
  Users, 
  Wifi, 
  Swords, 
  Trophy, 
  Flame, 
  ArrowRight,
  Radio
} from 'lucide-react';

interface ModeSelectorHubProps {
  profile: UserProfile;
  onSelectLocalPlay: () => void;
  onSelectPrivateRoom: () => void;
  onSelectMatchmaking: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
  onOpenQuests: () => void;
}

export const ModeSelectorHub: React.FC<ModeSelectorHubProps> = ({
  profile,
  onSelectLocalPlay,
  onSelectPrivateRoom,
  onSelectMatchmaking,
  onOpenProfile,
  onOpenShop,
  onOpenQuests,
}) => {
  const rankInfo = RANK_TIERS[profile.rankTier];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-7 py-3 animate-in fade-in duration-300 select-none">
      {/* Player Header Banner / Status Strip */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur-lg relative overflow-hidden">
        {/* Player Identity Card */}
        <div 
          onClick={onOpenProfile}
          className="flex items-center gap-3.5 cursor-pointer group relative z-10"
          title="Click to view Player Profile & Match History"
        >
          {/* Smooth Circular Avatar */}
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-base shadow-sm border-2 border-slate-600 group-hover:scale-105 transition-transform`}>
              #{profile.avatarNumber}
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-600 text-white font-scoreboard font-semibold text-[9px] rounded-full shadow">
              Lvl {profile.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-broadcast text-xl font-bold text-[#F1F5F9] group-hover:text-emerald-300 transition-colors">
                {profile.username}
              </span>
              {profile.isGuest && (
                <span className="text-[10px] font-scoreboard font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Guest
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-scoreboard text-slate-400 mt-0.5">
              <span className="font-medium text-emerald-400 flex items-center gap-1">
                <span>{rankInfo.icon}</span>
                <span>{profile.rankTier}</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium">{profile.favoriteClub}</span>
            </div>
          </div>
        </div>

        {/* Currency, Level & Quests Quick Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap relative z-10">
          {/* XP Progress Bar Pill */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121620] border border-slate-700/50 text-xs font-scoreboard cursor-pointer hover:border-slate-600 transition-colors"
          >
            <span className="text-emerald-400 font-semibold text-xs">XP</span>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, Math.round((profile.xp / (profile.level * 250 + 150)) * 100))}%` }} 
              />
            </div>
            <span className="text-slate-400 text-[10px] font-mono">
              {profile.xp}/{profile.level * 250 + 150}
            </span>
          </div>

          {/* Trophy Coins Pill */}
          <div 
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121620] border border-amber-500/30 text-xs font-scoreboard text-amber-300 cursor-pointer hover:border-amber-400/60 transition-colors shadow-sm"
            title="Trophy Coins - Click to visit Trophy Shop"
          >
            <span className="text-sm">🪙</span>
            <span className="text-sm font-bold">{profile.trophyCoins.toLocaleString()}</span>
          </div>

          {/* Daily Streak Pill */}
          {profile.dailyStreak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/40 text-xs font-scoreboard text-rose-300 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{profile.dailyStreak}d streak</span>
            </div>
          )}

          {/* Quests Button */}
          <button
            type="button"
            onClick={onOpenQuests}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-200 text-xs font-scoreboard font-medium transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Missions</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-scoreboard font-semibold uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>2020+ FOOTBALL TRIVIA ARENA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-broadcast tracking-tight text-[#F1F5F9]">
          MODERN FOOTBALL CHALLENGE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
          Play offline on the couch with friends, host a private room for smartphone buzzer play, or compete in ranked online matchmaking.
        </p>
      </div>

      {/* 3 Tactile Mode Selection Cards (Balanced Padding, Circular Bubbles, Soft Pill Buttons) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Mode 1: Local Pass & Play (100% Offline) */}
        <div 
          onClick={onSelectLocalPlay}
          className="bg-[#1A202C] border border-slate-700/50 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer group transition-all duration-200 hover:shadow-xl shadow-md relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Circular Icon Bubble */}
              <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                ⚽
              </div>
              <span className="text-[11px] font-scoreboard font-semibold px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                100% Offline
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-broadcast font-bold text-[#F1F5F9] group-hover:text-emerald-300 transition-colors">
                Local Pass & Play
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-sans">
                Living room sofa mode. Host directs questions, runs the timer, and awards speed-decay points. Zero internet required.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-scoreboard text-slate-400">
              <span className="text-emerald-400">✓ Big Screen View</span>
              <span>·</span>
              <span>2–8 Players</span>
              <span>·</span>
              <span>Local XP</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              className="w-full py-3 bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white font-scoreboard font-semibold text-sm rounded-full border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Kick Off Offline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mode 2: Host Private Online Room (Party Code + QR) */}
        <div 
          onClick={onSelectPrivateRoom}
          className="bg-[#1A202C] border border-slate-700/50 hover:border-sky-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer group transition-all duration-200 hover:shadow-xl shadow-md relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Circular Icon Bubble */}
              <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                🏟️
              </div>
              <span className="text-[11px] font-scoreboard font-semibold px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300">
                Party Code + QR
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-broadcast font-bold text-[#F1F5F9] group-hover:text-sky-300 transition-colors">
                Host Private Room
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-sans">
                Generate a 6-character room code. Friends scan with mobile phones to lock in their answers in real-time.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-scoreboard text-slate-400">
              <span className="text-sky-400">✓ QR Code Scan</span>
              <span>·</span>
              <span>Mobile Buzzer</span>
              <span>·</span>
              <span>Live Sync</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              className="w-full py-3 bg-slate-800 hover:bg-sky-600 text-sky-300 hover:text-white font-scoreboard font-semibold text-sm rounded-full border border-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Host Online Room</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mode 3: Online Ranked Matchmaking (SBMM + Bots) */}
        <div 
          onClick={onSelectMatchmaking}
          className="bg-[#1A202C] border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer group transition-all duration-200 hover:shadow-xl shadow-md relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Circular Icon Bubble with Football Trophy */}
              <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform text-amber-400">
                🏆
              </div>
              <span className="text-[11px] font-scoreboard font-semibold px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 uppercase tracking-wider">
                RANKED DIVISION 1
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-broadcast font-bold text-[#F1F5F9] group-hover:text-amber-300 transition-colors">
                Ranked Matchmaking
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-sans">
                Compete 1v1 or in a 4-player Free-For-All against global opponents matching your skill rating, with bot fallback.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-scoreboard text-slate-400">
              <span className="text-amber-400">✓ Elo Rating</span>
              <span>·</span>
              <span>60s Bot Fallback</span>
              <span>·</span>
              <span>Trophy Rewards</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              className="w-full py-3 bg-slate-800 hover:bg-amber-600 text-amber-300 hover:text-white font-scoreboard font-semibold text-sm rounded-full border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Find Ranked Match</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
