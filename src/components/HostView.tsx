import React, { useEffect } from 'react';
import { TriviaQuestion, QuestionResult, GameSettings } from '../types/trivia';
import { RemotePlayer } from '../types/multiplayer';
import { CountdownTimer } from './CountdownTimer';
import { calculateSpeedPoints, calculateStreakBonus } from '../utils/scoring';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Flame, 
  Wifi, 
  QrCode, 
  CheckCheck,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Database
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HostViewProps {
  question: TriviaQuestion | null;
  totalQuestions: number;
  currentIndex: number;
  players: RemotePlayer[];
  activePlayer: RemotePlayer;
  timeRemaining: number;
  timerRunning: boolean;
  gameStatus: string;
  lastResult: QuestionResult | null;
  settings: GameSettings;
  isOnlineHost?: boolean;
  roomCode?: string;
  onOpenLobby?: () => void;
  onAutoGrade?: () => void;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onSelectPlayer: (id: string) => void;
  onSubmitResult: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onManualAdjust: (playerId: string, delta: number) => void;
  onToggleHostPlay: (enable: boolean) => void;
}

export const HostView: React.FC<HostViewProps> = ({
  question,
  totalQuestions,
  currentIndex,
  players,
  activePlayer,
  timeRemaining,
  timerRunning,
  gameStatus,
  lastResult,
  settings,
  isOnlineHost = false,
  roomCode = '',
  onOpenLobby,
  onAutoGrade,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onSelectPlayer,
  onSubmitResult,
  onNextQuestion,
  onPrevQuestion,
  onToggleHostPlay,
}) => {
  if (!question) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 font-scoreboard text-base">
        Waiting for next fixture to kick off...
      </div>
    );
  }

  // Calculate live projection if marked correct right now
  const projected = calculateSpeedPoints(question.difficulty, timeRemaining, settings.totalSeconds);
  const potentialStreakBonus = calculateStreakBonus(activePlayer?.streak || 0, settings.streakBonusPerCorrect);
  const totalProjected = projected.speedPoints + potentialStreakBonus;

  // Sound-enhanced timer start
  const handleStartTimerWithWhistle = () => {
    soundEngine.playWhistle();
    onStartTimer();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (timerRunning) {
          onPauseTimer();
        } else if (gameStatus === 'playing') {
          handleStartTimerWithWhistle();
        }
      } else if (e.key === 'c' || e.key === 'C') {
        if (gameStatus === 'playing') {
          e.preventDefault();
          onSubmitResult(true);
        }
      } else if (e.key === 'x' || e.key === 'X') {
        if (gameStatus === 'playing') {
          e.preventDefault();
          onSubmitResult(false);
        }
      } else if (e.key === 'n' || e.key === 'N' || e.key === 'Enter') {
        if (gameStatus === 'revealed') {
          e.preventDefault();
          onNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timerRunning, gameStatus, onPauseTimer, onSubmitResult, onNextQuestion]);

  const lockedInCount = players.filter(p => p.selectedOption).length;

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full select-none">
      {/* Active Target Player Prompter Banner */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-lg relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          {/* Smooth Circular Icon Bubble */}
          <div className="w-11 h-11 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-emerald-400 text-xl shadow-inner">
            ⚽
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-scoreboard font-semibold flex items-center gap-1.5">
              <span>Active Turn</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xl sm:text-2xl font-broadcast font-bold text-[#F1F5F9] flex items-center gap-2">
              <span className="text-slate-400 font-medium">Pass Ball To:</span>
              <span className="text-emerald-400">
                {activePlayer?.name}
              </span>
              {activePlayer?.streak >= 2 && (
                <span className="text-xs font-scoreboard text-rose-300 font-semibold flex items-center gap-1 bg-rose-950/40 border border-rose-500/40 px-2 py-0.5 rounded-full ml-1">
                  <Flame className="w-3 h-3 fill-current" />
                  {activePlayer.streak}x streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Room badge & Squad switcher */}
        <div className="flex items-center gap-2.5 relative z-10 flex-wrap">
          {isOnlineHost && roomCode ? (
            <button
              type="button"
              onClick={onOpenLobby}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-scoreboard font-semibold hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title="Room Party Code"
            >
              <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Room: {roomCode}</span>
              <QrCode className="w-3.5 h-3.5 ml-0.5 text-slate-300" />
            </button>
          ) : null}

          {/* Sub In Player Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-scoreboard font-medium">Sub:</span>
            <select
              value={activePlayer?.id}
              onChange={(e) => onSelectPlayer(e.target.value)}
              className="bg-[#121620] border border-slate-700/60 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500/60 font-scoreboard font-medium"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.score} pts) {p.isHost ? '★ Host' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Host Active Play Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-[#121620] border border-slate-700/50 px-3 py-1.5 rounded-xl hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={settings.hostActivePlay}
              onChange={(e) => onToggleHostPlay(e.target.checked)}
              className="accent-emerald-500 rounded cursor-pointer w-3.5 h-3.5"
            />
            <span className="text-xs text-slate-300 font-scoreboard font-medium">Host Play</span>
          </label>
        </div>
      </div>

      {/* Main Question Console Card */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Question Header & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-700/40 pb-3 mb-5 relative z-10">
          <div className="flex items-center gap-2 font-scoreboard text-xs sm:text-sm flex-wrap">
            <span className="font-broadcast font-bold text-emerald-400 text-base sm:text-lg">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium uppercase">{question.category}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-400 font-mono">{question.year}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className={`font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs ${
              question.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' :
              question.difficulty === 'Medium' ? 'bg-sky-950/40 text-sky-300 border border-sky-500/30' :
              question.difficulty === 'Hard' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30' :
              'bg-rose-950/40 text-rose-300 border border-rose-500/30'
            }`}>
              {question.difficulty} ({projected.basePoints} base)
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

          {/* Live Speed Points Value Projection */}
          <div className="flex items-center gap-2 font-scoreboard text-sm">
            <span className="text-slate-400 uppercase text-xs">Live Reward:</span>
            <span className="text-emerald-400 font-bold font-mono text-lg">
              +{projected.speedPoints} pts
            </span>
            {activePlayer?.streak > 0 && (
              <span className="text-amber-400 font-medium text-xs flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                (+{potentialStreakBonus} streak)
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] leading-snug mb-6 font-syne tracking-tight relative z-10">
          {question.question}
        </h2>

        {/* 4 Options Grid with Smooth Rounded Geometry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 relative z-10">
          {question.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isCorrectOption = option === question.answer;

            const selectingPlayers = players.filter(p => {
              if (!p.selectedOption) return false;
              const pOptLetter = p.selectedOption.toUpperCase();
              return pOptLetter === letter || p.selectedOption === option;
            });

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCorrectOption
                    ? 'bg-emerald-950/30 border-emerald-500/60 text-[#F1F5F9]'
                    : 'bg-[#121620] border-slate-700/50 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-scoreboard font-bold text-xs ${
                    isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1 font-medium text-sm sm:text-base tracking-tight">{option}</span>
                  {isCorrectOption && (
                    <span className="text-xs text-emerald-400 font-scoreboard font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ✓ Correct Answer
                    </span>
                  )}
                </div>

                {/* Show remote players who locked in this option */}
                {selectingPlayers.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-400 font-scoreboard uppercase font-medium">Locked by:</span>
                    {selectingPlayers.map(sp => (
                      <span key={sp.id} className="text-[11px] font-scoreboard font-medium px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700/60">
                        {sp.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Remote Submissions HUD (Online Mode) */}
        {isOnlineHost && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#121620] border border-slate-700/50 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-scoreboard text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Online Submissions ({lockedInCount}/{players.length} Locked)</span>
              </span>
              {onAutoGrade && (
                <button
                  type="button"
                  onClick={onAutoGrade}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-scoreboard font-semibold text-xs hover:bg-emerald-900/60 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Auto-Grade All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {players.map(p => {
                const hasAnswered = !!p.selectedOption;
                return (
                  <div
                    key={p.id}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                      hasAnswered
                        ? 'bg-slate-800/80 border-emerald-500/40 text-[#F1F5F9]'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="truncate max-w-[95px] font-medium">{p.name}</span>
                    {hasAnswered ? (
                      <span className="font-scoreboard font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs">
                        {p.selectedOption}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-scoreboard italic">Thinking</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Referee Solution & Context Notes */}
        <div className="bg-[#121620] border border-slate-700/50 rounded-xl p-3.5 mb-5 relative z-10">
          <div className="flex items-center gap-2 mb-1 text-xs text-emerald-400 font-scoreboard font-semibold uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Referee Solution & Matchday Context</span>
          </div>
          <div className="text-base font-scoreboard font-bold text-[#F1F5F9] mb-1">
            Solution: <span className="text-emerald-400">{question.answer}</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
            {question.context}
          </p>
        </div>

        {/* Tactile Power-Meter Countdown Timer */}
        <div className="mb-5 relative z-10">
          <CountdownTimer
            timeRemaining={timeRemaining}
            totalTime={settings.totalSeconds}
            isRunning={timerRunning}
            size="md"
          />
        </div>

        {/* Verification Result Banner */}
        {gameStatus === 'revealed' && lastResult && (
          <div className={`p-4 rounded-xl border mb-5 flex flex-wrap items-center justify-between gap-3 animate-score-pop relative z-10 ${
            lastResult.isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/50 text-[#F1F5F9]'
              : 'bg-rose-950/30 border-rose-500/50 text-[#F1F5F9]'
          }`}>
            <div className="flex items-center gap-3">
              {lastResult.isCorrect ? (
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  ⚽
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-900/60 border border-rose-500/50 flex items-center justify-center text-rose-300 font-bold text-xl">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="font-broadcast text-xl sm:text-2xl font-bold leading-tight">
                  {lastResult.isCorrect
                    ? `Goal scored by ${lastResult.playerName}! +${lastResult.totalPointsAwarded} points awarded.`
                    : `Missed the target. 0 points awarded to ${lastResult.playerName}.`}
                </div>
                {lastResult.isCorrect && (
                  <div className="text-xs font-scoreboard text-emerald-300 mt-0.5">
                    Speed Value: +{lastResult.speedPoints} pts ({lastResult.timeRemaining.toFixed(1)}s left)
                    {lastResult.streakBonus > 0 && ` · Streak Bonus: +${lastResult.streakBonus} pts`}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onNextQuestion}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard font-semibold text-sm tracking-wide rounded-full shadow-md transition-colors cursor-pointer"
            >
              <span>Next Fixture ➡️</span>
            </button>
          </div>
        )}

        {/* Tactile Action Controls (Dark Filled / Soft Pill Buttons) */}
        <div className="pt-3 border-t border-slate-700/40 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Timer Actions */}
            <div className="flex items-center gap-2">
              {!timerRunning ? (
                <button
                  type="button"
                  onClick={handleStartTimerWithWhistle}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-scoreboard font-semibold text-sm border border-emerald-500/40 transition-colors shadow-sm cursor-pointer"
                  title="Spacebar shortcut"
                >
                  <Play className="w-4 h-4 fill-current text-emerald-400" />
                  <span>Start Timer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPauseTimer}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-scoreboard font-semibold text-sm transition-colors cursor-pointer"
                  title="Spacebar shortcut"
                >
                  <Pause className="w-4 h-4 fill-current text-amber-300" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                type="button"
                onClick={onResetTimer}
                className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Reset Timer to 20s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Verification Actions: Soft pill buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSubmitResult(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-scoreboard font-semibold rounded-full text-sm border border-rose-500/40 transition-colors cursor-pointer shadow-sm"
                title="Press X on keyboard"
              >
                <XCircle className="w-4 h-4" />
                <span>Incorrect (0)</span>
              </button>

              <button
                type="button"
                onClick={() => onSubmitResult(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard font-semibold text-base rounded-full transition-colors cursor-pointer shadow-md"
                title="Press C on keyboard"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Correct (+{totalProjected})</span>
              </button>
            </div>

            {/* Navigation shortcuts */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onPrevQuestion}
                disabled={currentIndex === 0}
                className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Question"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNextQuestion}
                className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Next Match (Enter / N)"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Hotkeys Notice */}
          <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/30 font-scoreboard">
            <span>Hotkeys: [Space] Timer · [C] Correct · [X] Incorrect · [N] Next Fixture</span>
            <span>Speed Decay: 100% at 20s → 50% at 0s buzzer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
