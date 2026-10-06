/**
 * Core type definitions for MatchPoint Football Trivia
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export interface TriviaQuestion {
  id: number | string;
  question: string;
  options: string[];
  answer: string;
  difficulty: Difficulty;
  category: string;
  year: number;
  context: string;
  isCustom?: boolean;
  isAiGenerated?: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  avatarColor: string; // Hex or tailwind class
  avatarNumber: number;
  isHost?: boolean;
  streak: number;
  maxStreak: number;
  correctCount: number;
  incorrectCount: number;
  totalAnswerTimeRemaining: number; // for calculating average answer speed
  clutchPoints: number; // points scored under 5s remaining
  veryHardCorrectCount: number;
}

export type GameStatus = 'setup' | 'playing' | 'revealed' | 'game_over';

export interface QuestionResult {
  questionId: number | string;
  playerId: string;
  playerName: string;
  isCorrect: boolean;
  timeRemaining: number;
  basePoints: number;
  speedPoints: number;
  streakBonus: number;
  totalPointsAwarded: number;
  selectedAnswer?: string;
  timestamp: number;
}

export interface GameSettings {
  totalSeconds: number; // default 20
  streakBonusPerCorrect: number; // default 25
  hostActivePlay: boolean; // default false
  gameLength: number; // default 15
  selectedDifficulties: Difficulty[];
  selectedCategories: string[];
  soundEnabled: boolean;
  useAiGeneration?: boolean; // default true
  eraFocus?: 'all' | '2020_2022' | '2023_present';
  difficultyCurve?: 'progressive' | 'custom' | 'mixed';
}

export interface GameAward {
  id: 'speed_demon' | 'clutch_master' | 'brainiac' | 'choker' | 'streaker' | 'mvp';
  title: string;
  recipientName: string;
  avatarColor: string;
  metricLabel: string;
  metricValue: string | number;
  description: string;
  iconName: string;
}
