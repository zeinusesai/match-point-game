import React from 'react';
import { TriviaQuestion, QuestionResult, GameSettings } from '../types/trivia';
import { RemotePlayer } from '../types/multiplayer';
import { CountdownTimer } from './CountdownTimer';
import { Flame, Maximize2, Minimize2, XCircle, Radio, CheckCircle, Sparkles, Database } from 'lucide-react';

interface BigScreenViewProps {
  question: TriviaQuestion | null;
  totalQuestions: number;
  currentIndex: number;
  activePlayer: RemotePlayer;
  timeRemaining: number;
  timerRunning: boolean;
  gameStatus: string;
  lastResult: QuestionResult | null;
  settings: GameSettings;
}

export const BigScreenView: React.FC<BigScreenViewProps> = ({
  question,
  totalQuestions,
  currentIndex,
  activePlayer,
  timeRemaining,
  timerRunning,
  gameStatus,
  lastResult,
  settings,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400 font-broadcast text-2xl tracking-normal">
        Waiting for next fixture to commence...
      </div>
    );
  }

  const isRevealed = gameStatus === 'revealed' && lastResult !== null;
  const ovr = Math.min(99, Math.max(76, 80 + Math.min(10, (activePlayer?.streak || 0) * 3) + Math.min(9, Math.floor((activePlayer?.score || 0) / 100))));

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-between min-h-[600px] bg-[#1A202C] border border-slate-700/50 rounded-2xl p-6 sm:p-9 shadow-xl relative overflow-hidden select-none">
      {/* Broadcast Header & Metadata */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/40 mb-6">
          {/* Metadata Pill */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-scoreboard">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Broadcast View</span>
            </div>
            <span className="font-broadcast text-xl font-bold text-[#F1F5F9]">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold uppercase">{question.category}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-400 font-mono">{question.year}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className={`font-semibold uppercase px-2.5 py-0.5 rounded-full text-xs ${
              question.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' :
              question.difficulty === 'Medium' ? 'bg-sky-950/40 text-sky-300 border border-sky-500/30' :
              question.difficulty === 'Hard' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30' :
              'bg-rose-950/40 text-rose-300 border border-rose-500/30'
            }`}>
              {question.difficulty} Tier
            </span>
            {question.isAiGenerated ? (
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI Live Gen</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700">
                <Database className="w-3 h-3 text-slate-400" />
                <span>2020+ Verified</span>
              </span>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-[#121620] border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Active Player Showcase Banner */}
        <div className="flex items-center justify-between bg-[#121620] border border-slate-700/50 rounded-2xl px-5 py-3.5 mb-6 shadow-md">
          <div className="flex items-center gap-3.5">
            {/* Circular Avatar with OVR Badge */}
            <div className="relative">
              <div className={`w-13 h-13 rounded-full bg-gradient-to-br ${activePlayer?.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-lg shadow-sm border-2 border-slate-600`}>
                #{activePlayer?.avatarNumber}
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-600 text-white font-scoreboard font-bold text-[10px] rounded-full shadow">
                {ovr}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-scoreboard font-semibold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>Active Turn</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xl sm:text-2xl font-broadcast font-bold text-[#F1F5F9] flex items-center gap-2">
                <span>{activePlayer?.name}</span>
                {activePlayer?.isHost && (
                  <span className="text-xs text-emerald-400 font-scoreboard font-medium px-2 py-0.5 bg-emerald-950/40 rounded-full border border-emerald-500/30">
                    Host
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activePlayer?.streak >= 2 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/40 border border-rose-500/40 rounded-full text-rose-300 font-scoreboard text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{activePlayer.streak} in a row!</span>
              </div>
            )}
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-scoreboard">Match Score</div>
              <div className="font-broadcast font-bold text-2xl sm:text-3xl text-emerald-400 leading-none">
                {activePlayer?.score.toLocaleString()} <span className="text-xs font-scoreboard text-slate-400 font-normal">pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="my-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F1F5F9] leading-tight font-syne tracking-tight px-2">
            {question.question}
          </h1>
        </div>
      </div>

      {/* 4 Options Grid (Smooth Rounded Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-6 relative z-10">
        {question.options.map((option, idx) => {
          const letter = ['A', 'B', 'C', 'D'][idx];
          const isAnswer = option === question.answer;

          let cardClass = 'border border-slate-700/50 bg-[#121620] text-[#F1F5F9] hover:border-slate-600';
          let letterClass = 'bg-slate-800 text-slate-300';

          if (isRevealed) {
            if (isAnswer) {
              cardClass = 'border border-emerald-500/70 bg-emerald-950/30 text-[#F1F5F9] ring-1 ring-emerald-500/40 shadow-sm';
              letterClass = 'bg-emerald-600 text-white font-bold';
            } else {
              cardClass = 'border-slate-800/80 bg-[#121620]/50 text-slate-500 opacity-40';
              letterClass = 'bg-slate-800/60 text-slate-600';
            }
          }

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-xl flex items-center gap-3.5 transition-all duration-200 shadow-sm ${cardClass}`}
            >
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-scoreboard font-bold text-sm flex-shrink-0 ${letterClass}`}>
                {letter}
              </span>
              <span className="text-base sm:text-lg font-medium flex-1 tracking-tight font-sans">
                {option}
              </span>
              {isRevealed && isAnswer && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm shadow-sm">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Answer Verification Banner */}
      {isRevealed && (
        <div className={`p-5 rounded-xl border mb-6 relative z-10 animate-score-pop ${
          lastResult.isCorrect
            ? 'bg-emerald-950/30 border-emerald-500/50 text-[#F1F5F9]'
            : 'bg-rose-950/30 border-rose-500/50 text-[#F1F5F9]'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-700/40 mb-3">
            <div className="flex items-center gap-2 font-broadcast text-xl sm:text-2xl font-bold">
              {lastResult.isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <span className="text-emerald-400">Goal Scored! (+{lastResult.totalPointsAwarded} pts)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-400" />
                  <span className="text-rose-400">Off Target / Time Expired (0 pts)</span>
                </>
              )}
            </div>

            {lastResult.isCorrect && (
              <div className="text-xs font-scoreboard text-emerald-300 font-semibold">
                Speed Value: +{lastResult.speedPoints} pts ({lastResult.timeRemaining.toFixed(1)}s)
                {lastResult.streakBonus > 0 && ` · Streak Bonus: +${lastResult.streakBonus} pts`}
              </div>
            )}
          </div>

          <div className="text-sm text-slate-300 leading-relaxed font-sans">
            <span className="text-emerald-400 font-scoreboard text-xs font-semibold uppercase tracking-wider block mb-0.5">
              Matchday Context:
            </span>
            {question.context}
          </div>
        </div>
      )}

      {/* Tactile Power-Meter Countdown Timer */}
      <div className="mt-4 pt-4 border-t border-slate-700/40 relative z-10">
        <CountdownTimer
          timeRemaining={timeRemaining}
          totalTime={settings.totalSeconds}
          isRunning={timerRunning}
          size="lg"
        />
      </div>
    </div>
  );
};
