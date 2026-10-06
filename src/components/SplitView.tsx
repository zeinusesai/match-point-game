import React from 'react';
import { HostView } from './HostView';
import { BigScreenView } from './BigScreenView';
import { TriviaQuestion, QuestionResult, GameSettings } from '../types/trivia';
import { RemotePlayer } from '../types/multiplayer';
import { Radio, Layout, Tv } from 'lucide-react';

interface SplitViewProps {
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

export const SplitView: React.FC<SplitViewProps> = (props) => {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start select-none">
      {/* Left Column: Host Deck (7 cols) */}
      <div className="xl:col-span-7 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="p-1 clip-angled-sm bg-[#CCFF00] text-[#090A0F]">
              <Layout className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm uppercase font-broadcast font-bold tracking-wider text-white">
              HOST DIRECTORS DECK
            </span>
          </div>
          <span className="text-xs text-[#CCFF00] font-scoreboard uppercase font-bold">
            REFEREE CONTROLS & NOTES ACTIVE
          </span>
        </div>
        <HostView {...props} />
      </div>

      {/* Right Column: Player Big Screen Preview (5 cols) */}
      <div className="xl:col-span-5 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="p-1 clip-angled-sm bg-[#003B1D] border border-[#CCFF00]/40 text-[#CCFF00]">
              <Tv className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm uppercase font-broadcast font-bold tracking-wider text-white">
              STADIUM BIG SCREEN TV PREVIEW
            </span>
          </div>
          <span className="text-xs text-slate-400 font-scoreboard uppercase">
            AUDIENCE DISPLAY (NO SPOILERS)
          </span>
        </div>
        <BigScreenView
          question={props.question}
          totalQuestions={props.totalQuestions}
          currentIndex={props.currentIndex}
          activePlayer={props.activePlayer}
          timeRemaining={props.timeRemaining}
          timerRunning={props.timerRunning}
          gameStatus={props.gameStatus}
          lastResult={props.lastResult}
          settings={props.settings}
        />
      </div>
    </div>
  );
};
