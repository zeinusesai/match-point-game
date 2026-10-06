import React, { useState, useEffect, useCallback } from 'react';
import { TriviaQuestion, QuestionResult, GameSettings } from '../types/trivia';
import { RemotePlayer } from '../types/multiplayer';
import { MatchmakingBot } from '../types/progression';
import { CountdownTimer } from './CountdownTimer';
import { calculateSpeedPoints, calculateStreakBonus } from '../utils/scoring';
import { soundEngine } from '../utils/audio';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Database, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Bot, 
  Zap, 
  Clock, 
  Brain,
  ShieldAlert,
  Radio,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SoloMatchViewProps {
  question: TriviaQuestion | null;
  totalQuestions: number;
  currentIndex: number;
  player: RemotePlayer;
  bots: MatchmakingBot[];
  players: RemotePlayer[];
  timeRemaining: number;
  timerRunning: boolean;
  gameStatus: string;
  settings: GameSettings;
  onAnswerSubmitted: (option: string, timeRemaining: number) => void;
  onNextQuestion: () => void;
  onForfeitMatch: () => void;
  isAiLive?: boolean;
}

interface BotTurnState {
  botId: string;
  name: string;
  avatarColor: string;
  avatarNumber: number;
  favoriteClub?: string;
  status: 'thinking' | 'locked' | 'revealed';
  chosenOption?: string;
  isCorrect?: boolean;
  answerTimeSeconds?: number;
  score: number;
}

export const SoloMatchView: React.FC<SoloMatchViewProps> = ({
  question,
  totalQuestions,
  currentIndex,
  player,
  bots,
  players,
  timeRemaining,
  timerRunning,
  gameStatus,
  settings,
  onAnswerSubmitted,
  onNextQuestion,
  onForfeitMatch,
  isAiLive = true,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [autoAdvanceRemaining, setAutoAdvanceRemaining] = useState<number>(3.5);
  const [botStates, setBotStates] = useState<Record<string, BotTurnState>>({});

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setAutoAdvanceRemaining(3.5);

    if (!question) return;

    // Initialize bot turn simulation for the current question
    const initialBots: Record<string, BotTurnState> = {};
    const botPlayers = players.filter(p => p.id.startsWith('bot_'));

    botPlayers.forEach((bp, index) => {
      const botConfig = bots.find(b => b.id === bp.id) || {
        id: bp.id,
        name: bp.name,
        avatarColor: bp.avatarColor,
        avatarNumber: bp.avatarNumber,
        favoriteClub: bp.favoriteClub,
        accuracyRate: 0.75,
        minDelaySeconds: 4,
        maxDelaySeconds: 12,
      };

      // Difficulty modifier on bot accuracy
      let diffAcc = botConfig.accuracyRate || 0.75;
      if (question.difficulty === 'Hard') diffAcc -= 0.1;
      if (question.difficulty === 'Very Hard') diffAcc -= 0.18;

      const roll = Math.random();
      const isCorrect = roll < Math.max(0.35, diffAcc);

      // Random delay
      const minD = botConfig.minDelaySeconds || 4;
      const maxD = botConfig.maxDelaySeconds || 12;
      const delay = Math.round((minD + Math.random() * (maxD - minD)) * 10) / 10;

      let chosen = question.answer;
      if (!isCorrect) {
        const wrongs = question.options.filter(o => o !== question.answer);
        chosen = wrongs[Math.floor(Math.random() * wrongs.length)] || question.options[0];
      }

      initialBots[bp.id] = {
        botId: bp.id,
        name: bp.name,
        avatarColor: bp.avatarColor,
        avatarNumber: bp.avatarNumber,
        favoriteClub: bp.favoriteClub,
        status: 'thinking',
        chosenOption: chosen,
        isCorrect,
        answerTimeSeconds: delay,
        score: bp.score,
      };
    });

    setBotStates(initialBots);
  }, [currentIndex, question]);

  // Simulate bot locks as timer counts down
  useEffect(() => {
    if (!timerRunning || hasSubmitted || !question) return;

    const elapsed = (settings.totalSeconds || 20) - timeRemaining;

    setBotStates(prev => {
      let changed = false;
      const next = { ...prev };

      Object.keys(next).forEach(botId => {
        const b = next[botId];
        if (b.status === 'thinking' && b.answerTimeSeconds && elapsed >= b.answerTimeSeconds) {
          next[botId] = { ...b, status: 'locked' };
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [timeRemaining, timerRunning, hasSubmitted, question, settings.totalSeconds]);

  // Handle player answer submission
  const handleSelectOption = useCallback((option: string) => {
    if (hasSubmitted || !question || !timerRunning) return;

    setSelectedOption(option);
    setHasSubmitted(true);

    const isCorrect = option === question.answer;
    if (isCorrect) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playWrong();
    }

    // Immediately notify parent
    onAnswerSubmitted(option, timeRemaining);

    // Reveal bot answers
    setBotStates(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(botId => {
        next[botId] = { ...next[botId], status: 'revealed' };
      });
      return next;
    });
  }, [hasSubmitted, question, timerRunning, timeRemaining, onAnswerSubmitted]);

  // Auto-submit on timer expiration
  useEffect(() => {
    if (timeRemaining <= 0 && !hasSubmitted && question) {
      setHasSubmitted(true);
      soundEngine.playWrong();
      onAnswerSubmitted('', 0);
      setBotStates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(botId => {
          next[botId] = { ...next[botId], status: 'revealed' };
        });
        return next;
      });
    }
  }, [timeRemaining, hasSubmitted, question, onAnswerSubmitted]);

  // Auto-advance countdown timer after answer submission
  useEffect(() => {
    if (!hasSubmitted || gameStatus === 'game_over') return;

    const interval = setInterval(() => {
      setAutoAdvanceRemaining(prev => {
        if (prev <= 0.1) {
          clearInterval(interval);
          onNextQuestion();
          return 0;
        }
        return Math.max(0, Math.round((prev - 0.1) * 10) / 10);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [hasSubmitted, gameStatus, onNextQuestion]);

  // Keyboard shortcut support (1-4, A-D, Space/Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasSubmitted) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }

      if (!question || !timerRunning) return;

      const key = e.key.toUpperCase();
      let index = -1;
      if (['1', 'A'].includes(key)) index = 0;
      else if (['2', 'B'].includes(key)) index = 1;
      else if (['3', 'C'].includes(key)) index = 2;
      else if (['4', 'D'].includes(key)) index = 3;

      if (index >= 0 && index < question.options.length) {
        e.preventDefault();
        handleSelectOption(question.options[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSubmitted, question, timerRunning, handleSelectOption, onNextQuestion]);

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-800 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-broadcast font-bold text-slate-100">Loading AI Trivia Fixture...</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Fetching real-time modern football questions directly from Gemini AI engine.
        </p>
      </div>
    );
  }

  // Calculate live speed & streak projection
  const speedCalc = calculateSpeedPoints(question.difficulty, timeRemaining, settings.totalSeconds || 20);
  const potentialStreakBonus = calculateStreakBonus(player.streak, settings.streakBonusPerCorrect || 25);
  const isCorrect = selectedOption === question.answer;

  const userPlayerInList = players.find(p => p.id === player.id) || player;
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const userRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full select-none animate-in fade-in duration-200">
      {/* Top Match HUD: Mode Tag, Round Indicator & AI Badge */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-lg">
        {/* Matchday Mode Pill & Round */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-scoreboard text-xs font-bold tracking-wide">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SOLO VS AI · MATCHDAY</span>
          </div>

          <div className="text-xs font-scoreboard text-slate-400 flex items-center gap-1.5">
            <span className="font-broadcast font-bold text-slate-200 text-sm">
              Question {currentIndex + 1}
            </span>
            <span>of</span>
            <span className="font-mono text-slate-300">{totalQuestions}</span>
          </div>
        </div>

        {/* Live AI Question Indicator & Forfeit Action */}
        <div className="flex items-center gap-2.5">
          {question.isAiGenerated || isAiLive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-scoreboard font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gemini 3.8 Live AI</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-scoreboard font-semibold">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>2020+ Verified Offline</span>
            </div>
          )}

          <button
            type="button"
            onClick={onForfeitMatch}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Leave Match"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Opponents & Live Standings Strip */}
      <div className="bg-[#121620] border border-slate-700/50 rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {/* User Score Card */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-emerald-500/40 shadow-sm">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-xs shadow-inner`}>
              #{player.avatarNumber}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-broadcast font-bold text-emerald-300">{player.name} (You)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold">
                  #{userRank}
                </span>
              </div>
              <div className="text-xs font-scoreboard font-bold text-white font-mono leading-none mt-0.5">
                {userPlayerInList.score} pts
                {player.streak >= 2 && (
                  <span className="ml-1 text-rose-400 text-[10px]">🔥 {player.streak}x</span>
                )}
              </div>
            </div>
          </div>

          <span className="text-slate-600 font-bold">VS</span>

          {/* AI Opponents */}
          {Object.values(botStates).map((b) => (
            <div
              key={b.botId}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                b.status === 'revealed'
                  ? b.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50'
                    : 'bg-rose-950/40 border-rose-500/50'
                  : b.status === 'locked'
                  ? 'bg-sky-950/30 border-sky-500/40'
                  : 'bg-[#1A202C] border-slate-700/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${b.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-xs shadow-inner`}>
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-scoreboard font-semibold text-slate-300">{b.name}</span>
                  {b.status === 'thinking' && (
                    <span className="text-[10px] text-amber-400 font-mono animate-pulse">Thinking...</span>
                  )}
                  {b.status === 'locked' && (
                    <span className="text-[10px] text-sky-400 font-mono flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                  {b.status === 'revealed' && (
                    <span className={`text-[10px] font-mono font-bold ${b.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {b.isCorrect ? '✓ Correct' : '✗ Missed'}
                    </span>
                  )}
                </div>
                <div className="text-xs font-scoreboard font-medium text-slate-400 font-mono leading-none mt-0.5">
                  {b.score} pts
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Reward Value Meter */}
        <div className="hidden sm:flex items-center gap-2 text-right min-w-max border-l border-slate-700/50 pl-4">
          <div>
            <div className="text-[10px] uppercase font-scoreboard text-slate-400">Turn Value</div>
            <div className="text-sm font-broadcast font-bold text-emerald-400 font-mono">
              +{speedCalc.speedPoints} pts
            </div>
          </div>
        </div>
      </div>

      {/* Main Single-Player Interactive Card */}
      <div className="bg-[#1A202C] border border-slate-700/50 rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Question Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-700/40 pb-3 mb-5 relative z-10">
          <div className="flex items-center gap-2 font-scoreboard text-xs sm:text-sm flex-wrap">
            <span className="text-emerald-400 font-semibold uppercase">{question.category}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-400 font-mono">{question.year}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className={`font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs ${
              question.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' :
              question.difficulty === 'Medium' ? 'bg-sky-950/40 text-sky-300 border border-sky-500/30' :
              question.difficulty === 'Hard' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30' :
              'bg-rose-950/40 text-rose-300 border border-rose-500/30'
            }`}>
              {question.difficulty} Tier ({speedCalc.basePoints} base)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-scoreboard text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select answer before clock hits zero</span>
          </div>
        </div>

        {/* Dynamic Countdown Timer Meter */}
        <div className="mb-5 relative z-10">
          <CountdownTimer
            timeRemaining={timeRemaining}
            totalTime={settings.totalSeconds || 20}
            isRunning={timerRunning && !hasSubmitted}
            variant="angled-meter"
            size="md"
          />
        </div>

        {/* Question Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] leading-snug mb-6 font-syne tracking-tight relative z-10">
          {question.question}
        </h2>

        {/* 4 Interactive Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 relative z-10">
          {question.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isUserChosen = selectedOption === option;
            const isCorrectOption = option === question.answer;

            let cardStyle = 'bg-[#121620] border-slate-700/50 hover:border-emerald-500/60 hover:bg-[#161c28] text-slate-200';
            let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

            if (hasSubmitted) {
              if (isCorrectOption) {
                cardStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-950/50';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-400';
              } else if (isUserChosen) {
                cardStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500/60';
                badgeStyle = 'bg-rose-600 text-white border-rose-400';
              } else {
                cardStyle = 'bg-[#121620]/60 border-slate-800 text-slate-500 opacity-60';
              }
            } else if (isUserChosen) {
              cardStyle = 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500';
              badgeStyle = 'bg-emerald-600 text-white';
            }

            return (
              <button
                key={option}
                type="button"
                disabled={hasSubmitted || timeRemaining <= 0}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-3 group relative cursor-pointer disabled:cursor-default ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-scoreboard font-bold text-sm border transition-colors flex-shrink-0 ${badgeStyle}`}>
                    {letter}
                  </span>
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {option}
                  </span>
                </div>

                {hasSubmitted && isCorrectOption && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
                )}
                {hasSubmitted && isUserChosen && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Reveal Feedback Banner & Auto-Advancement */}
        {hasSubmitted && (
          <div className="mt-4 p-5 rounded-2xl bg-[#121620] border border-slate-700/60 shadow-xl space-y-3 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {isCorrect ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="font-broadcast text-xl font-bold">
                    {isCorrect ? (
                      <span className="text-emerald-400">
                        GOOOAL! +{speedCalc.speedPoints + potentialStreakBonus} PTS
                      </span>
                    ) : (
                      <span className="text-rose-400">
                        MISSED! ({selectedOption ? 'Incorrect Answer' : 'Time Expired'})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 font-scoreboard">
                    {isCorrect ? (
                      <span>
                        Base: {speedCalc.basePoints} · Speed: +{speedCalc.speedPoints - speedCalc.basePoints} · Streak: +{potentialStreakBonus}
                      </span>
                    ) : (
                      <span>
                        Correct Answer: <strong className="text-emerald-400">{question.answer}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Question CTA & Auto-Advance Progress */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-scoreboard font-bold text-sm shadow-lg shadow-emerald-950/50 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Historical Trivia Context */}
            {question.context && (
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-2">
                <span className="text-emerald-400 font-bold font-scoreboard uppercase text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 flex-shrink-0 mt-0.5">
                  Trivia Context
                </span>
                <span>{question.context}</span>
              </div>
            )}

            {/* Auto-Advance Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Advancing to next question automatically...</span>
                <span className="text-emerald-400">{autoAdvanceRemaining.toFixed(1)}s (or press Space)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${(autoAdvanceRemaining / 3.5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
