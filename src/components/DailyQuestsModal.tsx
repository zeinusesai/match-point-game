import React from 'react';
import { UserProfile } from '../types/progression';
import { DEFAULT_ACHIEVEMENTS } from '../utils/progression';
import { authService } from '../services/authService';
import { X, Trophy, CheckCircle2, Clock, Sparkles, Gift, Award, Flame } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const handleClaimMission = (missionId: string) => {
    const success = authService.claimMissionReward(missionId);
    if (success) {
      soundEngine.playStreak();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071d12] border-2 border-emerald-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xl shadow-md">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-stadium font-bold text-slate-100 tracking-wider">
                DAILY MISSIONS & MILESTONES
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Complete objectives in matches to earn bonus XP and Trophy Coins.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {/* Daily Missions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-scoreboard font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>TODAY'S DAILY MISSIONS (RESETS DAILY)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">Streak: {profile.dailyStreak} Days</span>
            </div>

            <div className="space-y-2.5">
              {profile.dailyMissions.map((mission) => {
                const percent = Math.min(100, Math.round((mission.current / mission.target) * 100));
                return (
                  <div
                    key={mission.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0">
                        {mission.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-stadium text-lg font-bold text-slate-100 truncate tracking-wide">
                          {mission.title}
                        </div>
                        <div className="text-xs text-slate-400 font-sans truncate">
                          {mission.description}
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {mission.current}/{mission.target}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-stadium text-amber-300 font-bold mb-1">
                        +{mission.rewardCoins} 🪙 · +{mission.rewardXp} XP
                      </div>
                      {mission.claimed ? (
                        <span className="text-[11px] font-scoreboard font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-lg">
                          CLAIMED ✓
                        </span>
                      ) : mission.completed ? (
                        <button
                          type="button"
                          onClick={() => handleClaimMission(mission.id)}
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-scoreboard font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 animate-bounce cursor-pointer"
                        >
                          CLAIM!
                        </button>
                      ) : (
                        <span className="text-[11px] font-scoreboard font-bold text-slate-500 bg-slate-900/60 px-2.5 py-1 rounded-lg">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Milestones Section */}
          <div className="space-y-3">
            <span className="text-xs font-scoreboard font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>CAREER ACHIEVEMENTS & TROPHIES</span>
            </span>

            <div className="space-y-2.5">
              {DEFAULT_ACHIEVEMENTS.map((ach) => {
                const isDone = profile.stats.matchesPlayed >= ach.target;
                return (
                  <div
                    key={ach.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                        {ach.icon}
                      </span>
                      <div>
                        <div className="font-stadium text-lg font-bold text-slate-200 tracking-wide">
                          {ach.title}
                        </div>
                        <div className="text-xs text-slate-400 font-sans">
                          {ach.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-stadium text-amber-300 font-bold">
                        +{ach.rewardCoins} 🪙 · +{ach.rewardXp} XP
                      </div>
                      <span className="text-[10px] font-scoreboard font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        BADGE: {ach.rewardBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
