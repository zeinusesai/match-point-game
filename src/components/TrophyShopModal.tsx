import React, { useState } from 'react';
import { UserProfile, ShopItem } from '../types/progression';
import { SHOP_CATALOG } from '../utils/progression';
import { authService } from '../services/authService';
import { X, Trophy, Check, Sparkles, Volume2, Shield, Palette, User, Lock } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TrophyShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const TrophyShopModal: React.FC<TrophyShopModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'avatars' | 'frames' | 'sounds' | 'themes'>('avatars');
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = SHOP_CATALOG.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (profile.unlockedItemIds.includes(item.id)) {
      authService.equipItem(item.id, item.category);
      setPurchaseNotice(`Equipped ${item.name}!`);
      soundEngine.playCorrect();
      setTimeout(() => setPurchaseNotice(null), 2500);
      return;
    }

    if (profile.trophyCoins < item.price) {
      alert(`You need ${item.price - profile.trophyCoins} more Trophy Coins! Win matches to earn coins.`);
      return;
    }

    const success = authService.purchaseItem(item.id, item.price, item.category);
    if (success) {
      soundEngine.playStreak();
      setPurchaseNotice(`Unlocked and equipped ${item.name}!`);
      setTimeout(() => setPurchaseNotice(null), 3000);
    }
  };

  const isEquipped = (item: ShopItem) => {
    if (item.category === 'avatars') return profile.avatarId === item.id;
    if (item.category === 'frames') return profile.frameId === item.id;
    if (item.category === 'themes') return profile.equippedTheme === item.id;
    if (item.category === 'sounds') return profile.equippedSoundPack === item.id;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071d12] border-2 border-emerald-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-xl shadow-md">
              🪙
            </div>
            <div>
              <h2 className="text-xl font-stadium font-bold text-slate-100 tracking-wider">
                TROPHY COINS CLUB STORE
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Earn coins in matches · Unlock cosmetic avatars, frames, & audio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Coin Balance */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-stadium text-base font-black shadow-md">
              <span>🪙</span>
              <span>{profile.trophyCoins.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Purchase Notification Banner */}
        {purchaseNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-scoreboard font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{purchaseNotice}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto border-b border-emerald-500/20 pb-3">
          {[
            { id: 'avatars', label: 'LEGEND AVATARS', icon: User },
            { id: 'frames', label: 'CARD FRAMES', icon: Shield },
            { id: 'sounds', label: 'SOUND PACKS', icon: Volume2 },
            { id: 'themes', label: 'PITCH THEMES', icon: Palette },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-scoreboard font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                    : 'bg-slate-950/80 border border-emerald-500/20 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map(item => {
              const isUnlocked = profile.unlockedItemIds.includes(item.id);
              const equipped = isEquipped(item);
              const levelLocked = Boolean(item.requiredLevel && profile.level < item.requiredLevel);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all bg-slate-950/80 ${
                    equipped
                      ? 'border-emerald-400 shadow-xl shadow-emerald-950/80 ring-2 ring-emerald-500/50'
                      : isUnlocked
                      ? 'border-emerald-500/30 hover:border-emerald-500/60'
                      : 'border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                        {item.icon}
                      </span>
                      <span className={`text-[10px] font-scoreboard font-bold uppercase px-2 py-0.5 rounded ${
                        item.rarity === 'Legendary' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        item.rarity === 'Epic' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {item.rarity}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-stadium text-xl font-bold text-slate-100 tracking-wide">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>

                    {levelLocked && (
                      <div className="text-[10px] font-scoreboard text-rose-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Requires Player Level {item.requiredLevel}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="font-stadium text-lg font-bold text-amber-300 flex items-center gap-1">
                      {isUnlocked ? (
                        <span className="text-emerald-400 text-xs font-scoreboard uppercase font-bold">OWNED</span>
                      ) : (
                        <>
                          <span>🪙</span>
                          <span>{item.price}</span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={levelLocked && !isUnlocked}
                      onClick={() => handlePurchase(item)}
                      className={`px-4 py-1.5 rounded-xl font-scoreboard font-bold text-xs transition-all cursor-pointer ${
                        equipped
                          ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 cursor-default'
                          : isUnlocked
                          ? 'bg-slate-800 hover:bg-emerald-600 text-slate-100 hover:text-slate-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md disabled:opacity-30'
                      }`}
                    >
                      {equipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : 'UNLOCK'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
