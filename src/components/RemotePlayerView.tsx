import React, { useState, useEffect } from 'react';
import { TriviaQuestion, QuestionResult } from '../types/trivia';
import { RemotePlayer } from '../types/multiplayer';
import { CountdownTimer } from './CountdownTimer';
import { 
  Wifi, 
  WifiOff, 
  Lock, 
  Flame, 
  Trophy
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RemotePlayerViewProps {
  player: RemotePlayer;
  roomCode: string;
  isConnected: boolean;
  question: TriviaQuestion | null;
  currentIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  timerRunning: boolean;
  gameStatus: string;
  lastResult: QuestionResult | null;
  onSelectOption: (optionLetter: string, timeRemaining: number) => void;
  onLeaveRoom: () => void;
}

export const RemotePlayerView: React.FC<RemotePlayerViewProps> = ({
  player,
  roomCode,
  isConnected,
  question,
  currentIndex,
  totalQuestions,
  timeRemaining,
  timerRunning,
  gameStatus,
  lastResult,
  onSelectOption,
  onLeaveRoom,
}) => {
  const [selectedOptionLetter, setSelectedOptionLetter] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOptionLetter(null);
  }, [currentIndex, question?.id]);

  const handleOptionClick = (letter: string) => {
    if (selectedOptionLetter || !timerRunning || gameStatus !== 'playing') return;
    
    setSelectedOptionLetter(letter);
    if ('vibrate' in navigator) {
      try { navigator.vibrate(60); } catch {}
    }
    soundEngine.playTick(10);
    onSelectOption(letter, timeRemaining);
  };

  const isRevealed = gameStatus === 'revealed';
  const isGameOver = gameStatus === 'game_over';

  return (
    <div className="min-h-screen bg-[#121620] text-slate-100 flex flex-col justify-between max-w-lg mx-auto w-full p-4 sm:p-6 select-none font-sans border-x border-slate-700/40 relative overflow-hidden">
      {/* Mobile Top Scorebug Bar */}
      <header className="flex items-center justify-between pb-3.5 border-b border-slate-700/40 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-sm shadow-sm border border-slate-600`}>
            #{player.avatarNumber}
          </div>
          <div>
            <div className="text-base font-broadcast font-bold text-[#F1F5F9] leading-tight flex items-center gap-1.5">
              <span>{player.name}</span>
              {player.streak >= 2 && (
                <span className="text-rose-400 text-xs font-scoreboard flex items-center gap-0.5 ml-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {player.streak}x
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-scoreboard">
              Room: <span className="text-emerald-400 font-semibold">{roomCode}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-scoreboard font-semibold ${
            isConnected
              ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/50 border border-rose-500/40 text-rose-300 animate-pulse'
          }`}>
            {isConnected ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
            <span>{isConnected ? 'Online' : 'Reconnecting...'}</span>
          </div>

          <button
            type="button"
            onClick={onLeaveRoom}
            className="text-xs text-slate-400 hover:text-rose-400 font-scoreboard uppercase px-2 py-1 cursor-pointer"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Interactive Screen */}
      <div className="my-auto py-4 flex flex-col justify-center relative z-10">
        {gameStatus === 'setup' ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-2xl mx-auto shadow-inner">
              ⚽
            </div>
            <div>
              <h2 className="text-2xl font-broadcast font-bold text-[#F1F5F9]">In The Locker Room</h2>
              <p className="text-xs text-slate-400 mt-1">
                Waiting for the Host to kick off the fixture...
              </p>
            </div>
            <div className="inline-block p-3 rounded-xl bg-[#1A202C] border border-slate-700/50 text-xs font-scoreboard text-slate-300">
              Supporting: <span className="text-emerald-400 font-semibold uppercase">{player.favoriteClub || 'MatchPoint FC'}</span>
            </div>
          </div>
        ) : isGameOver ? (
          <div className="text-center py-8 space-y-4">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-broadcast font-bold text-[#F1F5F9]">Full Time</h2>
            <div className="text-4xl font-broadcast font-bold text-emerald-400 leading-none">
              {player.score.toLocaleString()} <span className="text-sm text-slate-400 font-scoreboard font-normal">pts</span>
            </div>
            <p className="text-xs text-slate-400">Check the Big Screen for final standings and awards.</p>
          </div>
        ) : !question ? (
          <div className="text-center py-12 text-slate-400 font-broadcast text-xl">
            Preparing next fixture...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Metadata Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/40 pb-2 font-scoreboard">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-400">
                  Q{currentIndex + 1}/{totalQuestions}
                </span>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span className="text-slate-200 font-medium uppercase">{question.category}</span>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span>{question.year}</span>
              </div>
              <span className={`font-semibold uppercase px-2.5 py-0.5 rounded-full text-[10px] ${
                question.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' :
                question.difficulty === 'Medium' ? 'bg-sky-950/40 text-sky-300 border border-sky-500/30' :
                question.difficulty === 'Hard' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30' :
                'bg-rose-950/40 text-rose-300 border border-rose-500/30'
              }`}>
                {question.difficulty}
              </span>
            </div>

            {/* Smooth Rounded Power Timer */}
            <div className="py-1">
              <CountdownTimer
                timeRemaining={timeRemaining}
                totalTime={20}
                isRunning={timerRunning}
                size="md"
              />
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#F1F5F9] leading-snug tracking-tight text-center py-2 font-syne">
              {question.question}
            </h2>

            {/* Tactile Option Cards */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {question.options.map((option, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedOptionLetter === letter;
                const isCorrectAnswer = option === question.answer;

                let cardStyle = 'bg-[#1A202C] border border-slate-700/50 text-[#F1F5F9] active:scale-98 hover:border-slate-600';
                let letterBadge = 'bg-slate-800 text-slate-300 font-scoreboard font-semibold';

                if (isRevealed) {
                  if (isCorrectAnswer) {
                    cardStyle = 'bg-emerald-950/40 border border-emerald-500/60 text-[#F1F5F9] ring-1 ring-emerald-500/40';
                    letterBadge = 'bg-emerald-600 text-white font-bold';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-950/40 border border-rose-500/50 text-rose-200';
                    letterBadge = 'bg-rose-600 text-white font-bold';
                  } else {
                    cardStyle = 'bg-[#121620]/60 border-slate-800 text-slate-500 opacity-40';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/40';
                  letterBadge = 'bg-emerald-600 text-white font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!!selectedOptionLetter || !timerRunning || isRevealed}
                    onClick={() => handleOptionClick(letter)}
                    className={`p-3.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${letterBadge}`}>
                        {letter}
                      </span>
                      <span className="font-medium text-sm sm:text-base truncate font-sans">
                        {option}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 text-emerald-400 font-scoreboard text-xs font-semibold flex-shrink-0 ml-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <footer className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400 font-scoreboard relative z-10">
        <span>MatchPoint Mobile</span>
        <span className="text-emerald-400 font-semibold font-mono">Score: {player.score} pts</span>
      </footer>
    </div>
  );
};
