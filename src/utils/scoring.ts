import { Difficulty, Player, GameAward, QuestionResult } from '../types/trivia';

export const BASE_POINTS: Record<Difficulty, number> = {
  'Easy': 100,
  'Medium': 200,
  'Hard': 300,
  'Very Hard': 500,
};

/**
 * Speed-Decay Scoring Algorithm
 * Formula: Points awarded = Base Points * (0.5 + 0.5 * (Time Remaining / Total Time))
 */
export function calculateSpeedPoints(
  difficulty: Difficulty,
  timeRemaining: number,
  totalTime: number = 20
): { basePoints: number; speedPoints: number; ratio: number } {
  const basePoints = BASE_POINTS[difficulty] || 100;
  // Clamp time remaining between 0 and totalTime
  const clampedTime = Math.max(0, Math.min(totalTime, timeRemaining));
  const timeRatio = clampedTime / totalTime;
  
  // 0.5 + 0.5 * (Time Remaining / Total Time)
  const multiplier = 0.5 + 0.5 * timeRatio;
  const speedPoints = Math.round(basePoints * multiplier);

  return {
    basePoints,
    speedPoints,
    ratio: multiplier,
  };
}

/**
 * Calculate streak bonus (+25 pts per consecutive correct answer)
 */
export function calculateStreakBonus(currentStreak: number, bonusPerStreak: number = 25): number {
  // If player already has a streak, entering their next consecutive answer awards bonus
  // E.g., 1st consecutive: +25, 2nd consecutive: +50, etc.
  return (currentStreak + 1) * bonusPerStreak;
}

/**
 * End-of-game awards generator
 */
export function calculateEndGameAwards(players: Player[], history: QuestionResult[]): GameAward[] {
  if (players.length === 0) return [];

  const awards: GameAward[] = [];

  // 1. MVP (Highest total score)
  const sortedByScore = [...players].sort((a, b) => b.score - a.score);
  if (sortedByScore[0] && sortedByScore[0].score > 0) {
    awards.push({
      id: 'mvp',
      title: 'Match MVP',
      recipientName: sortedByScore[0].name,
      avatarColor: sortedByScore[0].avatarColor,
      metricLabel: 'Total Points',
      metricValue: `${sortedByScore[0].score} pts`,
      description: 'Crowned tournament champion with the highest overall scoreline.',
      iconName: 'trophy',
    });
  }

  // 2. Speed Demon (Highest average answer speed / seconds remaining on correct answers)
  const eligibleSpeedPlayers = players
    .filter(p => p.correctCount > 0)
    .map(p => ({
      player: p,
      avgTimeRemaining: p.totalAnswerTimeRemaining / p.correctCount,
    }))
    .sort((a, b) => b.avgTimeRemaining - a.avgTimeRemaining);

  if (eligibleSpeedPlayers[0] && eligibleSpeedPlayers[0].avgTimeRemaining > 0) {
    awards.push({
      id: 'speed_demon',
      title: 'Speed Demon',
      recipientName: eligibleSpeedPlayers[0].player.name,
      avatarColor: eligibleSpeedPlayers[0].player.avatarColor,
      metricLabel: 'Avg Time Remaining',
      metricValue: `${eligibleSpeedPlayers[0].avgTimeRemaining.toFixed(1)}s`,
      description: 'Lightning-fast reflexes on the buzzer across all correct answers.',
      iconName: 'zap',
    });
  }

  // 3. Clutch Master (Most points scored under 5 seconds remaining)
  const sortedByClutch = [...players].sort((a, b) => b.clutchPoints - a.clutchPoints);
  if (sortedByClutch[0] && sortedByClutch[0].clutchPoints > 0) {
    awards.push({
      id: 'clutch_master',
      title: 'Clutch Master',
      recipientName: sortedByClutch[0].name,
      avatarColor: sortedByClutch[0].avatarColor,
      metricLabel: 'Points under 5s',
      metricValue: `${sortedByClutch[0].clutchPoints} pts`,
      description: 'Ice in their veins! Delivered under extreme last-second clock pressure.',
      iconName: 'flame',
    });
  }

  // 4. Brainiac (Most Very Hard questions answered correctly)
  const sortedByBrainiac = [...players].sort((a, b) => b.veryHardCorrectCount - a.veryHardCorrectCount);
  if (sortedByBrainiac[0] && sortedByBrainiac[0].veryHardCorrectCount > 0) {
    awards.push({
      id: 'brainiac',
      title: 'Brainiac',
      recipientName: sortedByBrainiac[0].name,
      avatarColor: sortedByBrainiac[0].avatarColor,
      metricLabel: 'Very Hard Solved',
      metricValue: `${sortedByBrainiac[0].veryHardCorrectCount} Qs`,
      description: 'Mastered the most elusive, complex 2020-present football deep cuts.',
      iconName: 'brain',
    });
  }

  // 5. The Choker (Most missed questions)
  const sortedByMisses = [...players].sort((a, b) => b.incorrectCount - a.incorrectCount);
  if (sortedByMisses[0] && sortedByMisses[0].incorrectCount > 0) {
    awards.push({
      id: 'choker',
      title: 'The Choker',
      recipientName: sortedByMisses[0].name,
      avatarColor: sortedByMisses[0].avatarColor,
      metricLabel: 'Questions Missed',
      metricValue: `${sortedByMisses[0].incorrectCount} misses`,
      description: 'Put it into Row Z when the pressure mounted. Better luck next fixture!',
      iconName: 'alert-triangle',
    });
  }

  // 6. Streaker (Longest consecutive correct streak)
  const sortedByStreak = [...players].sort((a, b) => b.maxStreak - a.maxStreak);
  if (sortedByStreak[0] && sortedByStreak[0].maxStreak >= 2) {
    awards.push({
      id: 'streaker',
      title: 'Unstoppable Run',
      recipientName: sortedByStreak[0].name,
      avatarColor: sortedByStreak[0].avatarColor,
      metricLabel: 'Max Streak',
      metricValue: `${sortedByStreak[0].maxStreak} in a row`,
      description: 'Strung together a devastating chain of back-to-back correct answers.',
      iconName: 'trending-up',
    });
  }

  return awards;
}
