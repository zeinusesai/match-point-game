import React from 'react';
import { 
  Tv, 
  Layout, 
  Split, 
  Volume2, 
  VolumeX, 
  Database, 
  ExternalLink,
  QrCode,
  Swords,
  Radio
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { UserProfile } from '../types/progression';
import { RANK_TIERS } from '../utils/progression';

export type ActiveView = 'host' | 'bigscreen' | 'split';

interface NavBarProps {
  currentView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  gameStatus: string;
  currentIndex: number;
  totalQuestions: number;
  profile?: UserProfile;
  isOnlineHost?: boolean;
  roomCode?: string;
  onReturnToHub?: () => void;
  onOpenProfile?: () => void;
  onOpenShop?: () => void;
  onOpenQuests?: () => void;
  onOpenMatchmaking?: () => void;
  onOpenOnlineLobby?: () => void;
  onOpenJoinGame?: () => void;
  onOpenSetup: () => void;
  onOpenQuestions: () => void;
  onRestartMatch: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  currentView,
  onChangeView,
  gameStatus,
  currentIndex,
  totalQuestions,
  profile,
  isOnlineHost = false,
  roomCode = '',
  onReturnToHub,
  onOpenProfile,
  onOpenShop,
  onOpenMatchmaking,
  onOpenOnlineLobby,
  onOpenQuestions,
}) => {
  const [muted, setMuted] = React.useState(soundEngine.getMuted());

  const toggleSound = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
  };

  const handlePopOut = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=bigscreen`;
    window.open(url, 'MatchPoint_TV', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  const rankInfo = profile ? RANK_TIERS[profile.rankTier] : null;

  return (
    <header className="w-full bg-[#121620]/90 border-b border-slate-700/40 backdrop-blur-lg sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Modern Sports Scorebug Branding */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onReturnToHub}
            className="flex items-center bg-[#1A202C] border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer group hover:border-slate-600 transition-colors shadow-sm"
            title="Return to Main Game Mode Hub"
          >
            {/* Soft Green Live Matchday Pill */}
            <div className="bg-emerald-600 px-3 py-1.5 flex items-center gap-1.5 text-white font-scoreboard font-bold text-xs tracking-wider">
              <span>LIVE MATCHDAY</span>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            </div>

            {/* Title & Tag */}
            <div className="px-3.5 py-1.5 bg-[#1A202C] flex items-center gap-2 group-hover:bg-[#1E2533] transition-colors">
              <span className="font-broadcast text-lg sm:text-xl font-bold tracking-tight text-[#F1F5F9]">
                MATCHPOINT
              </span>
              <span className="text-[11px] font-scoreboard font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30 hidden sm:inline">
                PITCHSIDE HUD
              </span>
            </div>
          </div>

          {/* Round Indicator Pill */}
          {(gameStatus === 'playing' || gameStatus === 'revealed') && (
            <div className="hidden md:flex items-center bg-[#1A202C] border border-slate-700/50 rounded-full px-3.5 py-1 text-xs font-scoreboard text-slate-300 gap-2">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                ROUND
              </span>
              <span className="font-semibold text-[#F1F5F9]">
                {currentIndex + 1} <span className="text-slate-500">/</span> {totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* View Switcher: Soft-Toned Pill Group */}
        <div className="flex items-center bg-[#1A202C] border border-slate-700/50 rounded-full p-1 shadow-inner">
          <button
            type="button"
            onClick={() => onChangeView('host')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-scoreboard font-semibold transition-all cursor-pointer ${
              currentView === 'host'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Host Deck</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('bigscreen')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-scoreboard font-semibold transition-all cursor-pointer ${
              currentView === 'bigscreen'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Stadium TV</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('split')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-scoreboard font-semibold transition-all cursor-pointer ${
              currentView === 'split'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Screen</span>
            <span className="sm:hidden">Split</span>
          </button>
        </div>

        {/* Right Section: Economy, Profile, Sound & Matchmaking */}
        <div className="flex items-center gap-2">
          {profile && (
            <>
              {/* Trophy Coins Pill */}
              <div 
                onClick={onOpenShop}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A202C] border border-amber-500/30 text-amber-300 font-scoreboard text-xs font-semibold cursor-pointer hover:border-amber-400/60 transition-colors shadow-sm"
                title="Trophy Coins Store"
              >
                <span>🪙</span>
                <span>{profile.trophyCoins.toLocaleString()}</span>
              </div>

              {/* Player Avatar & Level Pill */}
              <div 
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#1A202C] border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors shadow-sm"
                title="Player Profile"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-scoreboard font-bold text-xs shadow-inner`}>
                  #{profile.avatarNumber}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-xs font-scoreboard font-semibold text-[#F1F5F9]">
                    Lvl {profile.level}
                  </div>
                  <div className="text-[10px] font-scoreboard text-emerald-400">
                    {profile.rankTier.split(' ')[0]}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Online Room Party Active Badge or Ranked Matchmaking Button */}
          {isOnlineHost && roomCode ? (
            <button
              type="button"
              onClick={onOpenOnlineLobby}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-scoreboard font-semibold hover:bg-emerald-900/60 transition-colors cursor-pointer shadow-sm"
              title="Click to view Room Party QR Code and Connected Players"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Room {roomCode}</span>
              <QrCode className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenMatchmaking}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A202C] border border-slate-700/50 text-slate-200 hover:text-white hover:border-slate-600 text-xs font-scoreboard font-medium transition-colors cursor-pointer"
              title="Ranked Matchmaking"
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ranked</span>
            </button>
          )}

          {/* Sound Toggle (Circular Bubble) */}
          <button
            type="button"
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-[#1A202C] border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Database Question Bank */}
          <button
            type="button"
            onClick={onOpenQuestions}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A202C] border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-scoreboard transition-colors cursor-pointer"
            title="Browse Question Bank"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Database</span>
          </button>

          {/* Pop-Out TV Window */}
          <button
            type="button"
            onClick={handlePopOut}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#1A202C] border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Pop-Out Big Screen TV View"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
