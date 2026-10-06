import React, { useState, useEffect } from 'react';
import { sanitizePartyCode } from '../utils/roomCode';
import { LogIn, X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoomCode?: string;
  onJoinRoom: (roomCode: string, playerName: string, avatarColor: string, avatarNumber: number, favoriteClub: string) => void;
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

const POPULAR_CLUBS = [
  'Real Madrid', 'Barcelona', 'Manchester City', 'Arsenal',
  'Liverpool', 'Bayern Munich', 'Inter Milan', 'PSG',
  'Chelsea', 'Juventus', 'Bayer Leverkusen', 'Borussia Dortmund'
];

export const JoinGameModal: React.FC<JoinGameModalProps> = ({
  isOpen,
  onClose,
  defaultRoomCode = '',
  onJoinRoom,
}) => {
  const [roomCode, setRoomCode] = useState(defaultRoomCode);
  const [playerName, setPlayerName] = useState('');
  const [favoriteClub, setFavoriteClub] = useState('Real Madrid');
  const [avatarColor, setAvatarColor] = useState(KIT_COLORS[0]);
  const [avatarNumber, setAvatarNumber] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultRoomCode) {
      setRoomCode(sanitizePartyCode(defaultRoomCode));
    }
  }, [defaultRoomCode]);

  // Restore saved player profile if exists
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('matchpoint_client_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setPlayerName(parsed.name);
        if (parsed.club) setFavoriteClub(parsed.club);
        if (parsed.color) setAvatarColor(parsed.color);
        if (parsed.number) setAvatarNumber(parsed.number);
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = sanitizePartyCode(roomCode);
    const cleanName = playerName.trim() || `Player ${Math.floor(Math.random() * 90 + 10)}`;

    if (cleanCode.length !== 6) {
      alert('Please enter a valid 6-character party code.');
      return;
    }

    setIsSubmitting(true);

    // Save profile for auto-reconnect
    try {
      sessionStorage.setItem('matchpoint_client_profile', JSON.stringify({
        name: cleanName,
        club: favoriteClub,
        color: avatarColor,
        number: avatarNumber,
      }));
    } catch {}

    onJoinRoom(cleanCode, cleanName, avatarColor, avatarNumber, favoriteClub);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <LogIn className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-display">Join Party Match</h2>
              <p className="text-xs text-slate-400">Play live on this device against the room.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Party Code Input */}
          <div>
            <label className="block uppercase font-mono font-semibold text-slate-400 mb-1.5">
              6-Character Party Code
            </label>
            <input
              required
              type="text"
              maxLength={6}
              placeholder="e.g. FOOTY6"
              value={roomCode}
              onChange={(e) => setRoomCode(sanitizePartyCode(e.target.value))}
              className="w-full bg-slate-950 border-2 border-emerald-500/50 rounded-xl px-4 py-3 text-center text-2xl font-mono font-black text-emerald-400 uppercase tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Player Name */}
          <div>
            <label className="block uppercase font-mono font-semibold text-slate-400 mb-1.5">
              Your Player Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Jude, Erling, Kylian..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans font-medium"
            />
          </div>

          {/* Favorite Club */}
          <div>
            <label className="block uppercase font-mono font-semibold text-slate-400 mb-1.5">
              Favorite Club
            </label>
            <select
              value={favoriteClub}
              onChange={(e) => setFavoriteClub(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-medium"
            >
              {POPULAR_CLUBS.map((club) => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
          </div>

          {/* Jersey Kit Colors & Number Selection */}
          <div>
            <label className="block uppercase font-mono font-semibold text-slate-400 mb-2">
              Jersey Kit & Squad Number
            </label>
            <div className="flex items-center gap-3">
              {/* Kit Colors */}
              <div className="flex items-center gap-1.5 flex-1">
                {KIT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAvatarColor(color)}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white transition-all cursor-pointer ${
                      avatarColor === color ? 'ring-2 ring-emerald-400 scale-105 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {avatarColor === color && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                ))}
              </div>

              {/* Number Input */}
              <div className="w-16">
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={avatarNumber}
                  onChange={(e) => setAvatarNumber(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-center font-mono font-bold text-sm text-slate-100 focus:outline-none"
                  title="Jersey Number"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || roomCode.length !== 6}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Connect to Match Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
