import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RemotePlayer } from '../types/multiplayer';
import { 
  Wifi, 
  Copy, 
  Check, 
  Users, 
  Play, 
  X, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Trash2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface OnlineLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  joinUrl: string;
  players: RemotePlayer[];
  onStartMatch: () => void;
  onKickPlayer?: (playerId: string) => void;
  onFallbackToLocal: () => void;
}

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  joinUrl,
  players,
  onStartMatch,
  onKickPlayer,
  onFallbackToLocal,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wifi className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-display">Live Online Party Room</h2>
              <p className="text-xs text-slate-400">Invite players to join on their smartphones or laptops.</p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {/* Party Code & QR Hero Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center bg-slate-950/80 border border-slate-800 rounded-xl p-5">
            {/* Left: 6-char Party Code & Join Link */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest text-slate-400 font-semibold block mb-1">
                  Room Party Code
                </span>
                <div className="inline-block text-3xl sm:text-4xl font-black font-mono tracking-widest text-emerald-400 bg-slate-900 border-2 border-emerald-500/60 px-4 py-2 rounded-xl shadow-inner select-all">
                  {roomCode}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5 font-medium">Direct Join Link:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={joinUrl}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: QR Code for Mobile Scanning */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md border border-slate-200 text-slate-900">
              <QRCodeSVG
                value={joinUrl}
                size={148}
                level="M"
                includeMargin={false}
              />
              <span className="text-[11px] font-semibold text-slate-700 mt-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                Scan to join with smartphone
              </span>
            </div>
          </div>

          {/* Connected Players Lobby Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
                  Connected Players ({players.length})
                </h3>
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Host Authoritative Node Active</span>
              </span>
            </div>

            {players.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 text-xs space-y-1">
                <div className="font-semibold text-slate-300">Waiting for players to join...</div>
                <div>Share the 6-character party code or scan the QR code above.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${player.avatarColor} flex items-center justify-center text-white font-mono font-bold text-xs shadow-inner flex-shrink-0`}>
                        {player.avatarNumber}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                          <span>{player.name}</span>
                          {player.isHost && (
                            <span className="text-[10px] text-purple-400 font-mono">(Host)</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {player.favoriteClub || 'Football Fan'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        Ready
                      </span>
                      {onKickPlayer && !player.isHost && (
                        <button
                          type="button"
                          onClick={() => onKickPlayer(player.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Remove player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fallback Graceful Notice */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Need to play locally on this single screen?</span>
            <button
              type="button"
              onClick={onFallbackToLocal}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Switch to Pass-and-Play</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Close Lobby
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartMatch();
            }}
            disabled={players.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Match ({players.length} Players)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
