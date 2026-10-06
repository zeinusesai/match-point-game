/**
 * Progression, Authentication, Matchmaking, and Gamification Types
 */

export type RankTier =
  | 'Academy Prospect'
  | 'Sunday League'
  | 'Semi-Pro'
  | 'Pro'
  | 'World Class'
  | 'Legend';

export interface RankTierInfo {
  name: RankTier;
  minXp: number;
  maxXp: number;
  minRating: number;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'wins' | 'accuracy' | 'speed' | 'streaks' | 'level';
  icon: string;
  target: number;
  current: number;
  completed: boolean;
  rewardCoins: number;
  rewardXp: number;
  rewardBadge?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  rewardCoins: number;
  rewardXp: number;
  icon: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'avatars' | 'frames' | 'themes' | 'sounds';
  description: string;
  price: number;
  icon: string;
  previewColor?: string;
  previewBorder?: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  requiredLevel?: number;
}

export interface MatchHistoryItem {
  id: string;
  timestamp: number;
  gameMode: '1v1_ranked' | 'ffa_4p' | 'party_room' | 'local_host';
  placement: number; // 1 for winner, 2, 3, etc.
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  avgSpeedSeconds: number;
  maxStreak: number;
  opponents: Array<{
    name: string;
    score: number;
    avatarColor: string;
    isBot?: boolean;
  }>;
  xpEarned: number;
  coinsEarned: number;
}

export interface UserStats {
  matchesPlayed: number;
  wins: number;
  totalPoints: number;
  totalCorrect: number;
  totalAttempted: number;
  avgAnswerSpeed: number; // in seconds
  highestStreak: number;
  veryHardCorrectCount: number;
  clutchPoints: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  isGuest: boolean;
  avatarColor: string;
  avatarNumber: number;
  avatarId?: string;
  frameId?: string;
  equippedTheme?: string;
  equippedSoundPack?: string;
  badgeTitle: string;
  favoriteClub: string;
  level: number;
  xp: number;
  trophyCoins: number;
  rankTier: RankTier;
  skillRating: number; // Elo / SBMM rating (1000 start)
  dailyStreak: number;
  lastLoginDate: string;
  unlockedItemIds: string[];
  stats: UserStats;
  matchHistory: MatchHistoryItem[];
  achievements: Record<string, { current: number; completed: boolean; claimed: boolean }>;
  dailyMissions: DailyMission[];
  topAchievementIds: string[];
}

export interface MatchmakingBot {
  id: string;
  name: string;
  avatarColor: string;
  avatarNumber: number;
  favoriteClub: string;
  badgeTitle: string;
  rankTier: RankTier;
  skillRating: number;
  accuracyRate: number; // 0.0 to 1.0
  minDelaySeconds: number;
  maxDelaySeconds: number;
}

export interface PostMatchRewards {
  xpEarned: number;
  coinsEarned: number;
  placementBonusXp: number;
  performanceBonusXp: number;
  streakMultiplier: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  ratingDelta: number;
}
