import React, { useState } from 'react';
import { UserProfile } from '../types/progression';
import { RANK_TIERS, DEFAULT_ACHIEVEMENTS } from '../utils/progression';
import { authService } from '../services/authService';
import { FUTCard } from './FUTCard';
import { Player } from '../types/trivia';
import { 
  X, 
  Trophy, 
  Flame, 
  Award, 
  LogOut,
  Calendar,
  Check,
  Radio
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onOpenAuth: () => void;
}

const POPULAR_CLUBS = [
  'Real Madrid', 'Manchester City', 'Barcelona', 'Arsenal',
  'Liverpool', 'Bayern Munich', 'Inter Milan', 'PSG',
  'Bayer Leverkusen', 'Borussia Dortmund', 'Juventus', 'Chelsea'
];

const KIT_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-800',
  'from-amber-500 to-orange-600',
  'from-rose-600 to-red-700',
  'from-purple-600 to-pink-600',
  'from-cyan-500 to-blue-700',
  'from-slate-700 to-slate-900',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'history' | 'edit'>('card');
  const [favoriteClub, setFavoriteClub] = useState(profile.favoriteClub);
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor);
  const [avatarNumber, setAvatarNumber] = useState(profile.avatarNumber);
  const [username, setUsername] = useState(profile.username);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const rankInfo = RANK_TIERS[profile.rankTier];
  const winRate = profile.stats.matchesPlayed > 0 
    ? Math.round((profile.stats.wins / profile.stats.matchesPlayed) * 100) 
    : 0;

  const handleSaveCustomizations = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfileCustomizations({
      username: username.trim() || profile.username,
      favoriteClub,
      avatarColor,
      avatarNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    authService.logout();
    onClose();
  };

  // Convert profile to Player shape for PlayerCard rendering
  const dummyPlayerForCard: Player = {
    id: profile.id,
    name: profile.username,
    score: profile.stats.totalPoints,
    avatarColor: profile.avatarColor,
    avatarNumber: profile.avatarNumber,
    streak: profile.stats.highestStreak,
    maxStreak: profile.stats.highestStreak,
    correctCount: profile.stats.wins * 5,
    incorrectCount: (profile.stats.matchesPlayed - profile.stats.wins) * 3,
    totalAnswerTimeRemaining: profile.stats.avgAnswerSpeed * 5,
    clutchPoints: 200,
    veryHardCorrectCount: profile.level * 2,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121620]/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-broadcast font-bold text-[#F1F5F9] leading-tight">
                PLAYER DOSSIER & STATS
              </h2>
              <span className="text-xs font-scoreboard text-slate-400">
                Official Career Performance Record
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Selectors (Soft Pill Group) */}
            <div className="flex items-center bg-[#121620] border border-slate-700/50 rounded-full p-1">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1 rounded-full text-xs font-scoreboard font-semibold transition-all cursor-pointer ${
                  activeTab === 'card' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Player Card
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-full text-xs font-scoreboard font-semibold transition-all cursor-pointer ${
                  activeTab === 'history' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fixtures ({profile.matchHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-full text-xs font-scoreboard font-semibold transition-all cursor-pointer ${
                  activeTab === 'edit' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Edit Squad
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 relative z-10">
          {activeTab === 'card' ? (
            /* Player Collectible Card Layout */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Master Player Card (5 cols) */}
                <div className="sm:col-span-5 flex justify-center">
                  <FUTCard
                    player={dummyPlayerForCard}
                    isActive={true}
                    size="md"
                    variant="gold"
                    showStats={true}
                  />
                </div>

                {/* Core Stats Overview (7 cols) */}
                <div className="sm:col-span-7 space-y-4">
                  <div className="bg-[#121620] border border-slate-700/50 rounded-2xl p-4 space-y-3">
                    <span className="text-xs uppercase font-scoreboard font-semibold text-slate-400 block">
                      Lifetime Career Statistics
                    </span>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-[#1A202C] p-3 rounded-xl border border-slate-700/40">
                        <span className="text-slate-400 block text-[10px] font-scoreboard">MATCHES PLAYED</span>
                        <span className="font-broadcast text-2xl font-bold text-[#F1F5F9]">{profile.stats.matchesPlayed}</span>
                      </div>

                      <div className="bg-[#1A202C] p-3 rounded-xl border border-slate-700/40">
                        <span className="text-slate-400 block text-[10px] font-scoreboard">TOTAL SCORE POINTS</span>
                        <span className="font-broadcast text-2xl font-bold text-emerald-400">{profile.stats.totalPoints.toLocaleString()}</span>
                      </div>

                      <div className="bg-[#1A202C] p-3 rounded-xl border border-slate-700/40">
                        <span className="text-slate-400 block text-[10px] font-scoreboard">AVG ANSWER SPEED</span>
                        <span className="font-broadcast text-xl font-bold text-sky-400">{profile.stats.avgAnswerSpeed}s left</span>
                      </div>

                      <div className="bg-[#1A202C] p-3 rounded-xl border border-slate-700/40">
                        <span className="text-slate-400 block text-[10px] font-scoreboard">HIGHEST STREAK</span>
                        <span className="font-broadcast text-xl font-bold text-amber-400">{profile.stats.highestStreak}x streak</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Achievements Showcase */}
                  <div className="bg-[#121620] border border-slate-700/50 rounded-2xl p-4 space-y-2">
                    <span className="text-xs uppercase font-scoreboard font-semibold text-amber-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Showcased Trophies</span>
                    </span>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {DEFAULT_ACHIEVEMENTS.slice(0, 3).map((ach) => (
                        <div key={ach.id} className="p-2.5 bg-[#1A202C] border border-slate-700/40 rounded-xl text-center space-y-1">
                          <span className="text-xl block">{ach.icon}</span>
                          <span className="text-[10px] font-scoreboard font-semibold text-[#F1F5F9] block truncate">{ach.title}</span>
                          <span className="text-[9px] font-scoreboard text-emerald-400">+{ach.rewardCoins} coins</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Profile Upgrade Callout */}
              {profile.isGuest && (
                <div className="p-4 rounded-xl bg-[#121620] border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
                  <div>
                    <span className="font-scoreboard font-semibold text-sm text-amber-300 block">
                      Currently Playing on Guest Profile
                    </span>
                    <span className="text-slate-400">Link your email or Google account to keep stats safely forever.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenAuth(); }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-scoreboard font-semibold rounded-full text-xs cursor-pointer shadow-sm transition-colors"
                  >
                    Upgrade Account
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === 'history' ? (
            /* Match History Log */
            <div className="space-y-3">
              <span className="text-xs uppercase font-scoreboard font-semibold text-slate-400 block">
                Last 10 Fixtures & Results
              </span>

              {profile.matchHistory.length === 0 ? (
                <div className="p-12 text-center bg-[#121620] border border-slate-700/50 rounded-2xl text-slate-500 text-xs font-scoreboard">
                  No fixtures played yet. Kick off a match to see your match reports recorded here!
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.matchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-[#121620] border border-slate-700/50 flex items-center justify-between hover:border-slate-600 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-scoreboard font-bold text-xs ${
                          item.placement === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{item.placement}
                        </span>

                        <div>
                          <div className="font-scoreboard font-semibold text-[#F1F5F9] leading-tight">
                            {item.gameMode === '1v1_ranked' || item.gameMode === 'ffa_4p' ? 'Ranked Division Match' : item.gameMode === 'party_room' ? 'Online Party Room' : 'Local Pass & Play'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                            <span>·</span>
                            <span>{(item.opponents?.length || 0) + 1} Players</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-broadcast text-xl font-bold text-emerald-400">
                          {(item.totalScore || 0).toLocaleString()} pts
                        </div>
                        <div className="text-[10px] text-slate-400 font-scoreboard">
                          +{item.xpEarned} XP · +{item.coinsEarned} 🪙
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Edit Squad Profile */
            <form onSubmit={handleSaveCustomizations} className="space-y-5">
              <div>
                <label className="block text-xs font-scoreboard font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                  Player / Squad Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={18}
                  className="w-full bg-[#121620] border border-slate-700/50 rounded-xl px-4 py-2.5 text-[#F1F5F9] font-scoreboard text-sm focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-scoreboard font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                  Favorite Club
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_CLUBS.map((club) => (
                    <button
                      key={club}
                      type="button"
                      onClick={() => setFavoriteClub(club)}
                      className={`p-2.5 rounded-xl text-xs font-scoreboard font-medium border transition-all text-left truncate cursor-pointer ${
                        favoriteClub === club
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                          : 'bg-[#121620] border-slate-700/50 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {club}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-scoreboard font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                  Jersey Number
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[7, 9, 10, 11, 8, 4, 1, 23].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAvatarNumber(num)}
                      className={`w-9 h-9 rounded-full font-scoreboard font-bold text-sm border transition-all cursor-pointer ${
                        avatarNumber === num
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-[#121620] border-slate-700/50 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      #{num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-scoreboard font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                  Kit Theme Color
                </label>
                <div className="flex items-center gap-2.5">
                  {KIT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} transition-all cursor-pointer ${
                        avatarColor === color ? 'ring-2 ring-emerald-500 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard font-semibold text-sm rounded-full cursor-pointer shadow-sm transition-colors"
                >
                  Save Squad
                </button>

                {savedSuccess && (
                  <span className="text-xs font-scoreboard text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-4 h-4" />
                    Saved to Squad Roster!
                  </span>
                )}

                {!profile.isGuest && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-scoreboard text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
