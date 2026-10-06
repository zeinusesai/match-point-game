/**
 * Authentication and Player Profile Service
 * Supports Email/Password, Google OAuth, and Guest mode with seamless account upgrade/linking.
 */

import { UserProfile, RankTier, PostMatchRewards, MatchHistoryItem } from '../types/progression';
import { getRankTierFromXp, getXpRequiredForLevel, getStreakMultiplier, generateDailyMissions, DEFAULT_ACHIEVEMENTS } from '../utils/progression';

const STORAGE_KEY_PROFILE = 'matchpoint_user_profile';
const STORAGE_KEY_AUTH_USERS = 'matchpoint_registered_users';

function createDefaultGuestProfile(): UserProfile {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const todayStr = new Date().toISOString().split('T')[0];

  const achievementsMap: Record<string, { current: number; completed: boolean; claimed: boolean }> = {};
  DEFAULT_ACHIEVEMENTS.forEach(a => {
    achievementsMap[a.id] = { current: 0, completed: false, claimed: false };
  });

  return {
    id: guestId,
    username: `Guest Striker #${Math.floor(Math.random() * 900 + 100)}`,
    email: '',
    isGuest: true,
    avatarColor: 'from-emerald-600 to-teal-800',
    avatarNumber: 10,
    avatarId: 'default',
    frameId: 'none',
    equippedTheme: 'default',
    equippedSoundPack: 'default',
    badgeTitle: 'Academy Prospect',
    favoriteClub: 'Real Madrid',
    level: 1,
    xp: 0,
    trophyCoins: 150, // Starting bonus
    rankTier: 'Academy Prospect',
    skillRating: 1000,
    dailyStreak: 1,
    lastLoginDate: todayStr,
    unlockedItemIds: ['default', 'none'],
    stats: {
      matchesPlayed: 0,
      wins: 0,
      totalPoints: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      avgAnswerSpeed: 0,
      highestStreak: 0,
      veryHardCorrectCount: 0,
      clutchPoints: 0,
    },
    matchHistory: [],
    achievements: achievementsMap,
    dailyMissions: generateDailyMissions(),
    topAchievementIds: ['first_blood', 'speed_demon', 'clutch_king'],
  };
}

class AuthService {
  private currentProfile: UserProfile;
  private listeners: Set<(profile: UserProfile) => void> = new Set();

  constructor() {
    this.currentProfile = this.loadProfile();
    this.checkDailyStreak();
  }

  private loadProfile(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          // Recompute rank tier based on current XP
          parsed.rankTier = getRankTierFromXp(parsed.xp || 0);
          return parsed;
        }
      }
    } catch {}

    const fresh = createDefaultGuestProfile();
    this.saveProfile(fresh);
    return fresh;
  }

  private saveProfile(profile: UserProfile): void {
    this.currentProfile = profile;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {}
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try { fn(this.currentProfile); } catch {}
    });
  }

  public subscribe(listener: (profile: UserProfile) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentProfile);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getProfile(): UserProfile {
    return this.currentProfile;
  }

  private checkDailyStreak(): void {
    const todayStr = new Date().toISOString().split('T')[0];
    if (this.currentProfile.lastLoginDate !== todayStr) {
      const lastDate = new Date(this.currentProfile.lastLoginDate || todayStr);
      const todayDate = new Date(todayStr);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      let newStreak = this.currentProfile.dailyStreak;
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      const updated: UserProfile = {
        ...this.currentProfile,
        dailyStreak: newStreak,
        lastLoginDate: todayStr,
        dailyMissions: generateDailyMissions(), // refresh daily missions on new day
      };
      this.saveProfile(updated);
    }
  }

  /**
   * Email & Password Sign Up (or upgrade existing Guest profile)
   */
  public async signUpWithEmail(username: string, email: string, passwordHash: string): Promise<UserProfile> {
    const cleanUser = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const users = this.getRegisteredUsers();
    if (users[cleanEmail]) {
      throw new Error('An account with this email already exists.');
    }

    // Save credentials in local storage accounts table
    users[cleanEmail] = {
      username: cleanUser,
      email: cleanEmail,
      password: passwordHash,
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_AUTH_USERS, JSON.stringify(users));

    // Seamlessly upgrade current guest profile preserving XP, coins, and history!
    const upgraded: UserProfile = {
      ...this.currentProfile,
      id: `usr_${Date.now()}`,
      username: cleanUser,
      email: cleanEmail,
      isGuest: false,
      trophyCoins: this.currentProfile.trophyCoins + 100, // Sign-up bonus coins
    };

    this.saveProfile(upgraded);
    return upgraded;
  }

  /**
   * Email & Password Login
   */
  public async loginWithEmail(email: string, passwordHash: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const found = users[cleanEmail];

    if (!found || found.password !== passwordHash) {
      throw new Error('Invalid email or password credentials.');
    }

    // Load or link profile
    const updated: UserProfile = {
      ...this.currentProfile,
      username: found.username,
      email: cleanEmail,
      isGuest: false,
    };

    this.saveProfile(updated);
    return updated;
  }

  /**
   * Google OAuth client sign-in / one-tap
   */
  public async loginWithGoogle(mockGoogleUser: { name: string; email: string; avatarUrl?: string }): Promise<UserProfile> {
    const cleanEmail = mockGoogleUser.email.toLowerCase();
    const cleanName = mockGoogleUser.name.trim();

    const users = this.getRegisteredUsers();
    if (!users[cleanEmail]) {
      users[cleanEmail] = {
        username: cleanName,
        email: cleanEmail,
        googleAuth: true,
        createdAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY_AUTH_USERS, JSON.stringify(users));
    }

    // Preserve existing guest stats, XP, and coins on upgrade
    const upgraded: UserProfile = {
      ...this.currentProfile,
      username: cleanName,
      email: cleanEmail,
      isGuest: false,
      trophyCoins: this.currentProfile.trophyCoins + 100,
    };

    this.saveProfile(upgraded);
    return upgraded;
  }

  /**
   * Switch / Reset to Guest Account
   */
  public continueAsGuest(): UserProfile {
    if (this.currentProfile.isGuest) return this.currentProfile;
    const freshGuest = createDefaultGuestProfile();
    this.saveProfile(freshGuest);
    return freshGuest;
  }

  /**
   * Log Out: resets to guest without destroying registered accounts
   */
  public logout(): void {
    const freshGuest = createDefaultGuestProfile();
    this.saveProfile(freshGuest);
  }

  private getRegisteredUsers(): Record<string, any> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH_USERS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * Update Profile Customizations
   */
  public updateProfileCustomizations(updates: Partial<Pick<UserProfile, 'username' | 'favoriteClub' | 'avatarColor' | 'avatarNumber' | 'badgeTitle' | 'avatarId' | 'frameId' | 'equippedTheme' | 'equippedSoundPack'>>): void {
    const updated = {
      ...this.currentProfile,
      ...updates,
    };
    this.saveProfile(updated);
  }

  /**
   * Purchase & Equip Item from Trophy Shop
   */
  public purchaseItem(itemId: string, price: number, category: string): boolean {
    if (this.currentProfile.trophyCoins < price) return false;
    if (this.currentProfile.unlockedItemIds.includes(itemId)) return true;

    const newCoins = this.currentProfile.trophyCoins - price;
    const newUnlocked = [...this.currentProfile.unlockedItemIds, itemId];

    const updated: UserProfile = {
      ...this.currentProfile,
      trophyCoins: newCoins,
      unlockedItemIds: newUnlocked,
    };

    // Auto-equip purchased item
    if (category === 'avatars') updated.avatarId = itemId;
    if (category === 'frames') updated.frameId = itemId;
    if (category === 'themes') updated.equippedTheme = itemId;
    if (category === 'sounds') updated.equippedSoundPack = itemId;

    this.saveProfile(updated);
    return true;
  }

  public equipItem(itemId: string, category: string): void {
    const updated = { ...this.currentProfile };
    if (category === 'avatars') updated.avatarId = itemId;
    if (category === 'frames') updated.frameId = itemId;
    if (category === 'themes') updated.equippedTheme = itemId;
    if (category === 'sounds') updated.equippedSoundPack = itemId;
    this.saveProfile(updated);
  }

  /**
   * Award Post-Match Progression & Statistics
   * Works for both offline pass-and-play, private rooms, and online ranked matchmaking!
   */
  public recordMatchCompletion(
    gameMode: MatchHistoryItem['gameMode'],
    placement: number,
    totalScore: number,
    totalQuestions: number,
    correctCount: number,
    avgSpeed: number,
    maxStreak: number,
    opponents: MatchHistoryItem['opponents'] = []
  ): PostMatchRewards {
    const isWinner = placement === 1;

    // Base XP: +150 for victory, +75 for participation
    const placementBonusXp = isWinner ? 150 : 75;
    // Performance XP: +10 XP per correct answer
    const performanceBonusXp = correctCount * 10;
    // Streak multiplier
    const multiplier = getStreakMultiplier(this.currentProfile.dailyStreak);

    const totalRawXp = Math.round((placementBonusXp + performanceBonusXp) * multiplier);
    const coinsEarned = Math.round((isWinner ? 60 : 25 + correctCount * 3) * multiplier);

    // Rating Delta (Elo) for ranked matches
    let ratingDelta = 0;
    if (gameMode === '1v1_ranked' || gameMode === 'ffa_4p') {
      ratingDelta = isWinner ? +28 : -14;
    }

    let newXp = this.currentProfile.xp + totalRawXp;
    let newLevel = this.currentProfile.level;
    let leveledUp = false;

    // Level-up loop
    let requiredXp = getXpRequiredForLevel(newLevel);
    while (newXp >= requiredXp) {
      newXp -= requiredXp;
      newLevel += 1;
      leveledUp = true;
      requiredXp = getXpRequiredForLevel(newLevel);
    }

    const newCoins = this.currentProfile.trophyCoins + coinsEarned + (leveledUp ? 100 : 0);
    const newRank = getRankTierFromXp(this.currentProfile.xp + totalRawXp);
    const newRating = Math.max(400, this.currentProfile.skillRating + ratingDelta);

    // Update Stats
    const prevStats = this.currentProfile.stats;
    const totalMatches = prevStats.matchesPlayed + 1;
    const totalWins = isWinner ? prevStats.wins + 1 : prevStats.wins;
    const totalPoints = prevStats.totalPoints + totalScore;
    const totalCorrect = prevStats.totalCorrect + correctCount;
    const totalAttempted = prevStats.totalAttempted + totalQuestions;
    const newAvgSpeed = totalMatches > 1
      ? Math.round(((prevStats.avgAnswerSpeed * (totalMatches - 1) + avgSpeed) / totalMatches) * 10) / 10
      : avgSpeed;

    const historyItem: MatchHistoryItem = {
      id: `m_${Date.now()}`,
      timestamp: Date.now(),
      gameMode,
      placement,
      totalScore,
      totalQuestions,
      correctAnswers: correctCount,
      avgSpeedSeconds: avgSpeed,
      maxStreak,
      opponents,
      xpEarned: totalRawXp,
      coinsEarned,
    };

    // Keep up to 10 latest matches
    const updatedHistory = [historyItem, ...this.currentProfile.matchHistory].slice(0, 10);

    // Update daily missions progress
    const updatedMissions = this.currentProfile.dailyMissions.map(m => {
      let progress = m.current;
      if (m.id === 'daily_goals') progress += correctCount;
      if (m.id === 'daily_matches') progress += 1;
      if (m.id === 'daily_speed' && avgSpeed > 14) progress += 1;
      return {
        ...m,
        current: progress,
        completed: progress >= m.target,
      };
    });

    const updatedProfile: UserProfile = {
      ...this.currentProfile,
      level: newLevel,
      xp: newXp,
      trophyCoins: newCoins,
      rankTier: newRank,
      skillRating: newRating,
      stats: {
        matchesPlayed: totalMatches,
        wins: totalWins,
        totalPoints,
        totalCorrect,
        totalAttempted,
        avgAnswerSpeed: newAvgSpeed,
        highestStreak: Math.max(prevStats.highestStreak, maxStreak),
        veryHardCorrectCount: prevStats.veryHardCorrectCount,
        clutchPoints: prevStats.clutchPoints,
      },
      matchHistory: updatedHistory,
      dailyMissions: updatedMissions,
    };

    this.saveProfile(updatedProfile);

    return {
      xpEarned: totalRawXp,
      coinsEarned,
      placementBonusXp,
      performanceBonusXp,
      streakMultiplier: multiplier,
      leveledUp,
      oldLevel: this.currentProfile.level,
      newLevel,
      ratingDelta,
    };
  }

  /**
   * Claim Daily Mission Reward
   */
  public claimMissionReward(missionId: string): boolean {
    const mission = this.currentProfile.dailyMissions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return false;

    const updatedMissions = this.currentProfile.dailyMissions.map(m => {
      if (m.id === missionId) return { ...m, claimed: true };
      return m;
    });

    const updatedProfile: UserProfile = {
      ...this.currentProfile,
      trophyCoins: this.currentProfile.trophyCoins + mission.rewardCoins,
      xp: this.currentProfile.xp + mission.rewardXp,
      dailyMissions: updatedMissions,
    };

    this.saveProfile(updatedProfile);
    return true;
  }
}

export const authService = new AuthService();
