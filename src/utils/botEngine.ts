import { RankTier, MatchmakingBot } from '../types/progression';
import { TriviaQuestion } from '../types/trivia';

const BOT_NAMES = [
  'FootyBot_99',
  'TacticsGuru',
  'StrikerAI',
  'Gegenpress9',
  'TotalFootball',
  'TikiTakaPro',
  'BellinghamFan_5',
  'HaalandBeast',
  'KloppHeavyMetal',
  'AncelottiEyebrow',
  'PepInvertBack',
  'SambaWizard10',
  'CleanSheetKing',
  'TheSpecialOne',
  'MidfieldMetronome',
];

const BOT_CLUBS = [
  'Real Madrid', 'Manchester City', 'Barcelona', 'Arsenal',
  'Liverpool', 'Bayern Munich', 'Inter Milan', 'PSG',
  'Bayer Leverkusen', 'Borussia Dortmund', 'Juventus', 'Chelsea'
];

const BOT_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-rose-600 to-red-700',
  'from-amber-500 to-orange-600',
  'from-purple-600 to-pink-600',
  'from-teal-600 to-emerald-700',
  'from-cyan-500 to-blue-700',
];

export function createBotOpponent(playerRankTier: RankTier, playerRating: number, index: number = 0): MatchmakingBot {
  const name = BOT_NAMES[(index + Math.floor(Math.random() * BOT_NAMES.length)) % BOT_NAMES.length];
  const club = BOT_CLUBS[Math.floor(Math.random() * BOT_CLUBS.length)];
  const color = BOT_COLORS[Math.floor(Math.random() * BOT_COLORS.length)];
  const squadNum = Math.floor(Math.random() * 98 + 1);

  let accuracyRate = 0.65;
  let minDelaySeconds = 6;
  let maxDelaySeconds = 14;
  let badgeTitle = 'Sunday League Regular';

  switch (playerRankTier) {
    case 'Academy Prospect':
      accuracyRate = 0.58;
      minDelaySeconds = 7;
      maxDelaySeconds = 15;
      badgeTitle = 'Academy Trainee';
      break;
    case 'Sunday League':
      accuracyRate = 0.68;
      minDelaySeconds = 6;
      maxDelaySeconds = 13;
      badgeTitle = 'Sunday League Striker';
      break;
    case 'Semi-Pro':
      accuracyRate = 0.76;
      minDelaySeconds = 4.5;
      maxDelaySeconds = 10;
      badgeTitle = 'Semi-Pro Playmaker';
      break;
    case 'Pro':
      accuracyRate = 0.84;
      minDelaySeconds = 3.5;
      maxDelaySeconds = 8;
      badgeTitle = 'First Team Pro';
      break;
    case 'World Class':
      accuracyRate = 0.90;
      minDelaySeconds = 2.5;
      maxDelaySeconds = 6.5;
      badgeTitle = 'World Class Baller';
      break;
    case 'Legend':
      accuracyRate = 0.95;
      minDelaySeconds = 1.8;
      maxDelaySeconds = 5;
      badgeTitle = 'Hall of Fame Legend';
      break;
  }

  // Slight variance in rating (+/- 45 of player rating)
  const ratingJitter = Math.floor(Math.random() * 90 - 45);
  const botRating = Math.max(500, playerRating + ratingJitter);

  return {
    id: `bot_${Date.now()}_${index}`,
    name,
    avatarColor: color,
    avatarNumber: squadNum,
    favoriteClub: club,
    badgeTitle,
    rankTier: playerRankTier,
    skillRating: botRating,
    accuracyRate,
    minDelaySeconds,
    maxDelaySeconds,
  };
}

/**
 * Simulates a bot's answer choice and reaction delay for a given question
 */
export function simulateBotAnswer(
  bot: MatchmakingBot,
  question: TriviaQuestion
): { chosenOption: string; answerTimeSeconds: number; isCorrect: boolean } {
  // Difficulty modifier on bot accuracy
  let difficultyAccuracy = bot.accuracyRate;
  if (question.difficulty === 'Hard') difficultyAccuracy -= 0.1;
  if (question.difficulty === 'Very Hard') difficultyAccuracy -= 0.18;

  const roll = Math.random();
  const isCorrect = roll < Math.max(0.35, difficultyAccuracy);

  // Reaction delay
  const delayRange = bot.maxDelaySeconds - bot.minDelaySeconds;
  const answerDelay = Math.round((bot.minDelaySeconds + Math.random() * delayRange) * 10) / 10;

  let chosenOption = question.answer;
  if (!isCorrect) {
    // Pick an incorrect option
    const wrongOptions = question.options.filter(o => o !== question.answer);
    chosenOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || question.options[0];
  }

  return {
    chosenOption,
    answerTimeSeconds: answerDelay,
    isCorrect,
  };
}
