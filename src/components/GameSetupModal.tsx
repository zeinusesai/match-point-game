import React, { useState } from 'react';
import { Player, GameSettings, Difficulty } from '../types/trivia';
import { Plus, Trash2, Users, Settings2, Play, Check, Wifi, Sparkles, Database, History, Cpu } from 'lucide-react';
import { aiQuestionService } from '../services/aiQuestionService';

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  settings: GameSettings;
  categories: string[];
  onHostOnlineRoom?: () => void;
  onStartGame: (gameLength?: number) => void;
  onAddPlayer: (name?: string) => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
  onUpdateSettings: (settings: GameSettings) => void;
}

const KIT_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-rose-600 to-red-700',
  'from-purple-600 to-pink-600',
  'from-cyan-500 to-blue-700',
  'from-slate-700 to-slate-900',
];

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  isOpen,
  onClose,
  players,
  settings,
  categories,
  onHostOnlineRoom,
  onStartGame,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayerName,
  onUpdateSettings,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState<'roster' | 'settings'>('roster');

  if (!isOpen) return null;

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    } else {
      onAddPlayer();
    }
  };

  const toggleDifficulty = (diff: Difficulty) => {
    const current = [...settings.selectedDifficulties];
    const exists = current.includes(diff);
    let updated: Difficulty[];
    if (exists) {
      if (current.length === 1) return; // don't allow 0
      updated = current.filter(d => d !== diff);
    } else {
      updated = [...current, diff];
    }
    onUpdateSettings({ ...settings, selectedDifficulties: updated });
  };

  const toggleCategory = (cat: string) => {
    const current = [...settings.selectedCategories];
    const exists = current.includes(cat);
    let updated: string[];
    if (exists) {
      updated = current.filter(c => c !== cat);
    } else {
      updated = [...current, cat];
    }
    onUpdateSettings({ ...settings, selectedCategories: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-display">Match Setup & Team Roster</h2>
            <p className="text-xs text-slate-400">Configure players, match rules, and question filters.</p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'roster' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Players ({players.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Match Rules</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {activeTab === 'roster' ? (
            <div className="space-y-4">
              {/* Add Player Input Form */}
              <form onSubmit={handleAddPlayerSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter player / team name..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Player</span>
                </button>
              </form>

              {/* Player List */}
              <div className="space-y-2 mt-4">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold block">
                  Active Starting Lineup ({players.length})
                </span>

                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
                  {players.map((player, idx) => (
                    <div key={player.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white font-mono font-bold text-xs shadow-inner flex-shrink-0`}>
                          {player.avatarNumber}
                        </div>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => onUpdatePlayerName(player.id, e.target.value)}
                          className="bg-transparent text-sm font-semibold text-slate-200 border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-none px-1 py-0.5 w-full max-w-xs"
                        />
                        {player.isHost && (
                          <span className="text-[11px] text-purple-400 font-mono font-medium">(Host)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRemovePlayer(player.id)}
                          disabled={players.length <= 1}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-20 transition-colors"
                          title="Remove player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-sm">
              {/* Dynamic AI Question Engine Section */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-xs sm:text-sm">Dynamic AI Question Generator</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                          GEMINI 3.8 LIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Produces infinite, non-repetitive modern questions strictly from 2020 to present.
                      </p>
                    </div>
                  </div>

                  {/* Toggle AI Generation */}
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, useAiGeneration: !settings.useAiGeneration })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      settings.useAiGeneration !== false
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {settings.useAiGeneration !== false ? 'Live AI: ON' : 'Database Only'}
                  </button>
                </div>

                {settings.useAiGeneration !== false && (
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    {/* Era Focus */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                        Era Focus (Strictly 2020–Present)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'all', label: 'All (2020–Present)', desc: 'Full modern era' },
                          { id: '2020_2022', label: '2020–2022', desc: 'Euro 2020, Qatar 2022' },
                          { id: '2023_present', label: '2023–Present', desc: 'Euro 2024, Trebles' },
                        ].map(era => (
                          <button
                            key={era.id}
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, eraFocus: era.id as any })}
                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                              (settings.eraFocus || 'all') === era.id
                                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-semibold">{era.label}</div>
                            <div className="text-[10px] text-slate-500 truncate">{era.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Curve */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                        Difficulty Scaling
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateSettings({ ...settings, difficultyCurve: 'progressive' })}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            (settings.difficultyCurve || 'progressive') === 'progressive'
                              ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">Progressive Curve</div>
                          <div className="text-[10px] text-slate-500">Easy → Medium → Hard → Very Hard</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => onUpdateSettings({ ...settings, difficultyCurve: 'mixed' })}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            settings.difficultyCurve === 'mixed'
                              ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold">Random Mixed</div>
                          <div className="text-[10px] text-slate-500">Unpredictable match order</div>
                        </button>
                      </div>
                    </div>

                    {/* Deduplication & Fallback Indicators */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <History className="w-3.5 h-3.5" />
                        <span>Deduplication Memory: {aiQuestionService.getPlayedCount()}/100 past questions filtered</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Database className="w-3.5 h-3.5" />
                        <span>Instant 200+ offline fallback ready</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fixture Length */}
              <div>
                <label className="block text-xs uppercase font-mono font-semibold text-slate-400 mb-2">
                  Match Length (Questions per Round)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 30].map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, gameLength: len })}
                      className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                        settings.gameLength === len
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {len} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-xs uppercase font-mono font-semibold text-slate-400 mb-2">
                  Allowed Difficulty Tiers
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Easy', 'Medium', 'Hard', 'Very Hard'] as Difficulty[]).map((diff) => {
                    const isSelected = settings.selectedDifficulties.includes(diff);
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => toggleDifficulty(diff)}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-emerald-500/80 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span>{diff}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Countdown Duration */}
              <div>
                <label className="block text-xs uppercase font-mono font-semibold text-slate-400 mb-2">
                  Countdown Duration (Seconds)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="45"
                    step="5"
                    value={settings.totalSeconds}
                    onChange={(e) => onUpdateSettings({ ...settings, totalSeconds: Number(e.target.value) })}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="font-mono font-bold text-emerald-400 text-base w-12 text-right">
                    {settings.totalSeconds}s
                  </span>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs uppercase font-mono font-semibold text-slate-400 mb-2">
                  Categories ({settings.selectedCategories.length === 0 ? 'All Categories Included' : `${settings.selectedCategories.length} selected`})
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-800 rounded-lg bg-slate-950/60">
                  {categories.map((cat) => {
                    const isSelected = settings.selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-900/60 border border-emerald-500/60 text-emerald-300'
                            : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            {onHostOnlineRoom && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onHostOnlineRoom();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>Host Online Room (QR Code)</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartGame();
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Kick Off Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};
