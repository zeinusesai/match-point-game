import React, { useState } from 'react';
import { UserProfile } from '../types/progression';
import { authService } from '../services/authService';
import { X, LogIn, UserPlus, Sparkles, ShieldCheck, Mail, Lock, User, Check, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim() || !email.trim() || !password) {
          throw new Error('Please fill out all fields.');
        }
        await authService.signUpWithEmail(username, email, password);
      } else {
        if (!email.trim() || !password) {
          throw new Error('Please enter email and password.');
        }
        await authService.loginWithEmail(email, password);
      }
      soundEngine.playCorrect();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // One-tap client Google profile sign in
      const defaultName = profile.username && !profile.username.includes('Guest') ? profile.username : 'Football Legend';
      await authService.loginWithGoogle({
        name: defaultName,
        email: `${defaultName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      });
      soundEngine.playCorrect();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071d12] border-2 border-emerald-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Stadium Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/30 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xl shadow-md">
              ⚽
            </div>
            <div>
              <h2 className="text-xl font-stadium font-bold text-slate-100 tracking-wider">
                {profile.isGuest ? 'UPGRADE PLAYER ACCOUNT' : mode === 'signup' ? 'CREATE SQUAD PROFILE' : 'STADIUM LOGIN'}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                {profile.isGuest ? 'Save your Level, XP, and Trophy Coins permanently!' : 'Sync match records & online rankings.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guest Progress Preservation Banner */}
        {profile.isGuest && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2 relative z-10">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              All current stats (<strong>Level {profile.level}</strong>, <strong>{profile.trophyCoins} Coins</strong>) will be transferred automatically!
            </span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 relative z-10">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-slate-950 border border-emerald-500/30 rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-scoreboard font-bold tracking-wide transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIGN UP
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-scoreboard font-bold tracking-wide transition-all cursor-pointer ${
                mode === 'login' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LOG IN
            </button>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block uppercase font-scoreboard font-bold text-slate-300 text-xs mb-1">
                Player Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  placeholder="e.g. StrikerLegend"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block uppercase font-scoreboard font-bold text-slate-300 text-xs mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                type="email"
                placeholder="striker@stadium.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase font-scoreboard font-bold text-slate-300 text-xs mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400 font-sans"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-stadium font-black text-xl tracking-wider rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{mode === 'signup' ? 'JOIN MATCHPOINT SQUAD' : 'ENTER STADIUM'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Google OAuth One-Tap */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-200 font-scoreboard font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
