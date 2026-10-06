import { RankTier, RankTierInfo, ShopItem, Achievement, DailyMission, UserProfile, PostMatchRewards } from '../types/progression';

export const RANK_TIERS: Record<RankTier, RankTierInfo> = {
  'Academy Prospect': {
    name: 'Academy Prospect',
    minXp: 0,
    maxXp: 499,
    minRating: 500,
    badgeColor: 'text-slate-300',
    badgeBg: 'bg-slate-800',
    borderColor: 'border-slate-500',
    icon: '🌱',
  },
  'Sunday League': {
    name: 'Sunday League',
    minXp: 500,
    maxXp: 1499,
    minRating: 800,
    badgeColor: 'text-amber-500',
    badgeBg: 'bg-amber-950',
    borderColor: 'border-amber-700',
    icon: '⚽',
  },
  'Semi-Pro': {
    name: 'Semi-Pro',
    minXp: 1500,
    maxXp: 3499,
    minRating: 1200,
    badgeColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-950',
    borderColor: 'border-cyan-500',
    icon: '🛡️',
  },
  'Pro': {
    name: 'Pro',
    minXp: 3500,
    maxXp: 6999,
    minRating: 1600,
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-950',
    borderColor: 'border-emerald-500',
    icon: '⚡',
  },
  'World Class': {
    name: 'World Class',
    minXp: 7000,
    maxXp: 11999,
    minRating: 2000,
    badgeColor: 'text-purple-400',
    badgeBg: 'bg-purple-950',
    borderColor: 'border-purple-500',
    icon: '🌟',
  },
  'Legend': {
    name: 'Legend',
    minXp: 12000,
    maxXp: 999999,
    minRating: 2500,
    badgeColor: 'text-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-950 to-yellow-900',
    borderColor: 'border-amber-400',
    icon: '👑',
  },
};

export function getRankTierFromXp(xp: number): RankTier {
  if (xp >= 12000) return 'Legend';
  if (xp >= 7000) return 'World Class';
  if (xp >= 3500) return 'Pro';
  if (xp >= 1500) return 'Semi-Pro';
  if (xp >= 500) return 'Sunday League';
  return 'Academy Prospect';
}

export function getXpRequiredForLevel(level: number): number {
  return level * 250 + 150;
}

export function getStreakMultiplier(dailyStreak: number): number {
  if (dailyStreak >= 5) return 1.5;
  if (dailyStreak >= 3) return 1.3;
  if (dailyStreak >= 2) return 1.15;
  return 1.0;
}

export const SHOP_CATALOG: ShopItem[] = [
  // Legendary Player Avatars
  {
    id: 'avatar_r9',
    name: 'El Fenómeno R9',
    category: 'avatars',
    description: 'Iconic 2002 World Cup look with trademark swagger.',
    price: 350,
    icon: '🇧🇷',
    previewColor: 'from-yellow-500 to-green-600',
    rarity: 'Legendary',
    requiredLevel: 3,
  },
  {
    id: 'avatar_zidane',
    name: 'Maestro Zizou 98',
    category: 'avatars',
    description: 'Pure French elegance and mid-field sorcery.',
    price: 300,
    icon: '🇫🇷',
    previewColor: 'from-blue-600 to-red-600',
    rarity: 'Epic',
    requiredLevel: 2,
  },
  {
    id: 'avatar_ronaldinho',
    name: 'Samba King 10',
    category: 'avatars',
    description: 'Playing with pure joy and boundless trickery.',
    price: 350,
    icon: '🤙',
    previewColor: 'from-amber-400 to-purple-600',
    rarity: 'Legendary',
    requiredLevel: 4,
  },
  {
    id: 'avatar_cruyff',
    name: 'Total Football 14',
    category: 'avatars',
    description: 'The architectural visionary of modern tactical football.',
    price: 400,
    icon: '🇳🇱',
    previewColor: 'from-orange-500 to-amber-600',
    rarity: 'Legendary',
    requiredLevel: 5,
  },

  // Card Frames
  {
    id: 'frame_gold_holo',
    name: 'Balon de Oro Hologram',
    category: 'frames',
    description: 'Shimmering metallic gold border fit for a world champion.',
    price: 250,
    icon: '✨',
    previewBorder: 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]',
    rarity: 'Legendary',
  },
  {
    id: 'frame_cyber_pitch',
    name: 'Neon Pitch Grid',
    category: 'frames',
    description: 'Glowing emerald electric turf lines around your profile.',
    price: 150,
    icon: '🟢',
    previewBorder: 'border-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]',
    rarity: 'Rare',
  },
  {
    id: 'frame_champions_star',
    name: 'Champions Starburst',
    category: 'frames',
    description: 'Deep midnight indigo with celestial European stars.',
    price: 200,
    icon: '⭐',
    previewBorder: 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]',
    rarity: 'Epic',
  },

  // Sound Packs
  {
    id: 'sound_anthem',
    name: 'Champions Anthem Chime',
    category: 'sounds',
    description: 'Grand orchestral chords upon answering correctly.',
    price: 180,
    icon: '🎺',
    rarity: 'Rare',
  },
  {
    id: 'sound_vuvuzela',
    name: 'Stadium Vuvuzela Blast',
    category: 'sounds',
    description: 'Echoing South Africa 2010 horn blast on correct strikes.',
    price: 120,
    icon: '📣',
    rarity: 'Common',
  },
  {
    id: 'sound_retro',
    name: 'Retro 8-Bit Arcade Kit',
    category: 'sounds',
    description: 'Classic arcade soccer sound effects for countdown and goals.',
    price: 150,
    icon: '🕹️',
    rarity: 'Rare',
  },

  // Pitch Themes
  {
    id: 'theme_campnou',
    name: 'Midnight Camp Nou',
    category: 'themes',
    description: 'Deep Blaugrana gradient stadium with floodlight night ambiance.',
    price: 300,
    icon: '🏟️',
    rarity: 'Epic',
  },
  {
    id: 'theme_bernabeu',
    name: 'Royal Bernabéu Gold',
    category: 'themes',
    description: 'White and royal gold accents across cards and boards.',
    price: 350,
    icon: '👑',
    rarity: 'Legendary',
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First On The Scoresheet',
    description: 'Complete your first trivia match.',
    category: 'wins',
    icon: '⚽',
    target: 1,
    current: 0,
    completed: false,
    rewardCoins: 50,
    rewardXp: 100,
    rewardBadge: 'Prospect',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 5 questions with over 15 seconds remaining.',
    category: 'speed',
    icon: '⚡',
    target: 5,
    current: 0,
    completed: false,
    rewardCoins: 100,
    rewardXp: 150,
    rewardBadge: 'Supersonic',
  },
  {
    id: 'clutch_king',
    title: 'Clutch Master',
    description: 'Score 300+ points on questions with under 5 seconds left.',
    category: 'accuracy',
    icon: '🔥',
    target: 300,
    current: 0,
    completed: false,
    rewardCoins: 120,
    rewardXp: 200,
    rewardBadge: 'Clutch',
  },
  {
    id: 'streak_master',
    title: 'Unstoppable Run',
    description: 'Achieve a streak of 5 consecutive correct answers.',
    category: 'streaks',
    icon: '🌟',
    target: 5,
    current: 0,
    completed: false,
    rewardCoins: 150,
    rewardXp: 250,
    rewardBadge: 'On Fire',
  },
  {
    id: 'brainiac',
    title: 'Deep Cut Savant',
    description: 'Answer 10 Very Hard questions correctly.',
    category: 'accuracy',
    icon: '🧠',
    target: 10,
    current: 0,
    completed: false,
    rewardCoins: 200,
    rewardXp: 300,
    rewardBadge: 'Tactician',
  },
  {
    id: 'centurion',
    title: 'Century Club',
    description: 'Answer 100 questions correctly across all game modes.',
    category: 'wins',
    icon: '💯',
    target: 100,
    current: 0,
    completed: false,
    rewardCoins: 300,
    rewardXp: 500,
    rewardBadge: 'Centurion',
  },
];

export function generateDailyMissions(): DailyMission[] {
  return [
    {
      id: 'daily_goals',
      title: 'Matchday Striker',
      description: 'Answer 5 questions correctly today.',
      target: 5,
      current: 0,
      completed: false,
      claimed: false,
      rewardCoins: 40,
      rewardXp: 80,
      icon: '🎯',
    },
    {
      id: 'daily_speed',
      title: 'Flash Finish',
      description: 'Answer 2 questions in under 6 seconds.',
      target: 2,
      current: 0,
      completed: false,
      claimed: false,
      rewardCoins: 50,
      rewardXp: 100,
      icon: '⚡',
    },
    {
      id: 'daily_matches',
      title: 'Fixture Grinder',
      description: 'Complete 2 full matches (Local, Online, or Ranked).',
      target: 2,
      current: 0,
      completed: false,
      claimed: false,
      rewardCoins: 60,
      rewardXp: 120,
      icon: '🏟️',
    },
  ];
}
