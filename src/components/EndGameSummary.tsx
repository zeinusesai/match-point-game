import React, { useEffect } from 'react';
import { Player, QuestionResult } from '../types/trivia';
import { calculateEndGameAwards } from '../utils/scoring';
import { FUTCard } from './FUTCard';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Zap, 
  Flame, 
  Brain, 
  AlertTriangle, 
  RotateCcw, 
  TrendingUp,
  Award,
  Crown,
  ArrowRight,
  Radio
} from 'lucide-react';

interface EndGameSummaryProps {
  players: Player[];
  history: QuestionResult[];
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export const EndGameSummary: React.FC<EndGameSummaryProps> = ({
  players,
  history,
  onPlayAgain,
  onNewGame,
}) => {
  // Fire celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#10B981', '#38BDF8', '#F59E0B', '#F43F5E', '#FFFFFF'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 50,
          origin: { x: 0 },
          colors: ['#10B981', '#F59E0B', '#38BDF8'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 50,
          origin: { x: 1 },
          colors: ['#10B981', '#F59E0B', '#38BDF8'],
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch {}
  }, []);

  const awards = calculateEndGameAwards(players, history);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const getAwardIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'brain': return <Brain className="w-5 h-5 text-purple-400" />;
      case 'alert-triangle': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'trending-up': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default: return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-400 pb-12 select-none">
      {/* Final Whistle Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-scoreboard font-semibold">
          <Radio className="w-3.5 h-3.5" />
          <span>Full Time · Official Match Report</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F1F5F9] font-broadcast tracking-tight">
          Post-Match Ceremony
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-sans">
          Final standings determined with speed-decay algorithm and streak bonuses.
        </p>
      </div>

      {/* Podium Presentation & Champion FUT Card */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        <div className="text-xs uppercase font-scoreboard font-semibold text-emerald-400 tracking-wider mb-7 text-center relative z-10 flex items-center justify-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Official Tournament Podium</span>
        </div>

        {/* Dynamic Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto relative z-10">
          {/* 2nd Place */}
          {sortedPlayers[1] ? (
            <div className="bg-[#121620] border border-slate-700/50 rounded-2xl p-5 text-center flex flex-col items-center order-2 md:order-1 h-60 justify-between shadow-md">
              <div className="space-y-1.5 w-full">
                <span className="text-[10px] font-scoreboard font-semibold text-slate-400 uppercase tracking-wider block">
                  Runner-Up (2nd)
                </span>
                <div className={`w-13 h-13 rounded-full bg-gradient-to-br ${sortedPlayers[1].avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-lg mx-auto shadow-sm border border-slate-600`}>
                  #{sortedPlayers[1].avatarNumber}
                </div>
                <div className="font-scoreboard font-semibold text-[#F1F5F9] text-base truncate">{sortedPlayers[1].name}</div>
              </div>
              <div className="font-broadcast font-bold text-2xl text-slate-200">
                {sortedPlayers[1].score.toLocaleString()} <span className="text-xs font-scoreboard text-slate-400 font-normal">pts</span>
              </div>
            </div>
          ) : <div className="hidden md:block order-2 md:order-1" />}

          {/* 1st Place (Champion Player Card Showcase) */}
          {winner && (
            <div className="order-1 md:order-2 flex flex-col items-center justify-center -mt-2">
              <div className="mb-2 flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-scoreboard font-semibold text-xs rounded-full shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Tournament MVP</span>
              </div>
              <FUTCard
                player={winner}
                isActive={true}
                rank={1}
                size="md"
                variant="gold"
              />
            </div>
          )}

          {/* 3rd Place */}
          {sortedPlayers[2] ? (
            <div className="bg-[#121620] border border-slate-700/50 rounded-2xl p-5 text-center flex flex-col items-center order-3 h-52 justify-between shadow-md">
              <div className="space-y-1.5 w-full">
                <span className="text-[10px] font-scoreboard font-semibold text-amber-500 uppercase tracking-wider block">
                  3rd Place
                </span>
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${sortedPlayers[2].avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-base mx-auto shadow-sm border border-amber-800/60`}>
                  #{sortedPlayers[2].avatarNumber}
                </div>
                <div className="font-scoreboard font-semibold text-[#F1F5F9] text-base truncate">{sortedPlayers[2].name}</div>
              </div>
              <div className="font-broadcast font-bold text-xl text-amber-500">
                {sortedPlayers[2].score.toLocaleString()} <span className="text-xs font-scoreboard text-slate-400 font-normal">pts</span>
              </div>
            </div>
          ) : <div className="hidden md:block order-3" />}
        </div>
      </div>

      {/* End-of-Game Match Awards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-[#F1F5F9] font-broadcast tracking-tight">
            Individual Match Honors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award) => (
            <div
              key={award.id}
              className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-600 transition-colors shadow-md relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* Circular Icon Bubble */}
                  <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center">
                    {getAwardIcon(award.iconName)}
                  </div>
                  <span className="text-xs font-scoreboard font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {award.metricValue}
                  </span>
                </div>

                <div className="text-xs uppercase tracking-wider text-slate-400 font-scoreboard">
                  {award.title}
                </div>
                <div className="text-lg font-bold font-scoreboard text-[#F1F5F9] mt-0.5 truncate">
                  {award.recipientName}
                </div>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-sans">
                  {award.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Scorecard Metrics */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-5 overflow-hidden shadow-md">
        <h3 className="text-xs font-scoreboard uppercase font-semibold tracking-wider text-slate-400 mb-4">
          Full Scorecard Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-scoreboard">
            <thead>
              <tr className="border-b border-slate-700/40 text-xs text-slate-400 uppercase">
                <th className="pb-3 font-semibold">Player</th>
                <th className="pb-3 font-semibold text-right">Total Score</th>
                <th className="pb-3 font-semibold text-right">Correct</th>
                <th className="pb-3 font-semibold text-right">Incorrect</th>
                <th className="pb-3 font-semibold text-right">Streak</th>
                <th className="pb-3 font-semibold text-right">Clutch Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedPlayers.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 flex items-center gap-2">
                    <span className="text-slate-500 text-xs w-4">#{idx + 1}</span>
                    <span className="font-semibold text-[#F1F5F9]">{p.name}</span>
                  </td>
                  <td className="py-3 text-right font-semibold text-emerald-400">
                    {p.score.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-emerald-400">{p.correctCount}</td>
                  <td className="py-3 text-right text-rose-400">{p.incorrectCount}</td>
                  <td className="py-3 text-right text-amber-400">{p.maxStreak}</td>
                  <td className="py-3 text-right text-slate-300">{p.clutchPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soft Pill Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard font-semibold text-sm rounded-full shadow-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Rematch With Squad</span>
        </button>

        <button
          type="button"
          onClick={onNewGame}
          className="flex items-center gap-2 px-7 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-[#F1F5F9] font-scoreboard font-semibold text-sm rounded-full shadow-sm transition-colors cursor-pointer"
        >
          <span>Main Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
