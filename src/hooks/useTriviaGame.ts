import { useState, useEffect, useRef, useCallback } from 'react';
import { TriviaQuestion, Player, GameSettings, QuestionResult, GameStatus } from '../types/trivia';
import { RemotePlayer, NetworkMessage } from '../types/multiplayer';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { calculateSpeedPoints, calculateStreakBonus } from '../utils/scoring';
import { soundEngine } from '../utils/audio';
import { peerNetwork } from '../utils/peerNetwork';
import { generatePartyCode, getJoinUrl } from '../utils/roomCode';
import { aiQuestionService } from '../services/aiQuestionService';

const STORAGE_KEY_CUSTOM_QS = 'matchpoint_custom_questions';
const STORAGE_KEY_PLAYERS = 'matchpoint_saved_players';
const STORAGE_KEY_SETTINGS = 'matchpoint_settings';

const DEFAULT_PLAYERS: RemotePlayer[] = [
  {
    id: 'p1',
    name: 'Player 1',
    score: 0,
    avatarColor: 'from-blue-600 to-indigo-600',
    avatarNumber: 10,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    incorrectCount: 0,
    totalAnswerTimeRemaining: 0,
    clutchPoints: 0,
    veryHardCorrectCount: 0,
  },
  {
    id: 'p2',
    name: 'Player 2',
    score: 0,
    avatarColor: 'from-emerald-600 to-teal-700',
    avatarNumber: 7,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    incorrectCount: 0,
    totalAnswerTimeRemaining: 0,
    clutchPoints: 0,
    veryHardCorrectCount: 0,
  },
  {
    id: 'p3',
    name: 'Player 3',
    score: 0,
    avatarColor: 'from-amber-500 to-orange-600',
    avatarNumber: 9,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    incorrectCount: 0,
    totalAnswerTimeRemaining: 0,
    clutchPoints: 0,
    veryHardCorrectCount: 0,
  },
];

const DEFAULT_SETTINGS: GameSettings = {
  totalSeconds: 20,
  streakBonusPerCorrect: 25,
  hostActivePlay: false,
  gameLength: 15,
  selectedDifficulties: ['Easy', 'Medium', 'Hard', 'Very Hard'],
  selectedCategories: [],
  soundEnabled: true,
  useAiGeneration: true,
  eraFocus: 'all',
  difficultyCurve: 'progressive',
};

export interface RemoteSubmission {
  option: string;
  timeRemaining: number;
  timestamp: number;
}

export function useTriviaGame() {
  // Questions master list
  const [questions, setQuestions] = useState<TriviaQuestion[]>(() => {
    try {
      const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_QS);
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...DEFAULT_QUESTIONS, ...parsed];
        }
      }
    } catch {}
    return DEFAULT_QUESTIONS;
  });

  // Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Players
  const [players, setPlayers] = useState<RemotePlayer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PLAYERS;
  });

  // Online Multiplayer Room State
  const [isOnlineHost, setIsOnlineHost] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const [remoteSubmissions, setRemoteSubmissions] = useState<Record<string, RemoteSubmission>>({});

  // Active game state
  const [gameQuestions, setGameQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  
  // AI Generation Status
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [questionSource, setQuestionSource] = useState<'ai_live' | 'curated_database'>('curated_database');
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(20);
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null);
  const [history, setHistory] = useState<QuestionResult[]>([]);

  const timerIntervalRef = useRef<number | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Sync settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Sync players
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
    } catch {}
  }, [players]);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('matchpoint_sync');
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'STATE_SYNC') {
          if (payload.gameQuestions) setGameQuestions(payload.gameQuestions);
          if (payload.currentIndex !== undefined) setCurrentIndex(payload.currentIndex);
          if (payload.activePlayerIndex !== undefined) setActivePlayerIndex(payload.activePlayerIndex);
          if (payload.gameStatus) setGameStatus(payload.gameStatus);
          if (payload.timeRemaining !== undefined) setTimeRemaining(payload.timeRemaining);
          if (payload.timerRunning !== undefined) setTimerRunning(payload.timerRunning);
          if (payload.players) setPlayers(payload.players);
          if (payload.lastResult !== undefined) setLastResult(payload.lastResult);
        }
      };

      return () => {
        bc.close();
      };
    }
  }, []);

  // Broadcast state to local windows & connected WebRTC players
  const broadcastState = useCallback((stateOverride: Record<string, unknown> = {}) => {
    const payload = {
      gameQuestions,
      currentIndex,
      currentQuestion: gameQuestions[currentIndex] || null,
      activePlayerIndex,
      gameStatus,
      timeRemaining,
      timerRunning,
      players,
      lastResult,
      ...stateOverride,
    };

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'STATE_SYNC',
          payload,
        });
      } catch {}
    }

    if (isOnlineHost) {
      peerNetwork.broadcast('STATE_SYNC', payload);
    }
  }, [gameQuestions, currentIndex, activePlayerIndex, gameStatus, timeRemaining, timerRunning, players, lastResult, isOnlineHost]);

  // Handle Online Host Peer Network Events
  useEffect(() => {
    if (!isOnlineHost) return;

    const unsubscribe = peerNetwork.onMessage((msg, conn) => {
      if (msg.type === 'LOBBY_JOIN') {
        const { id, name, avatarColor, avatarNumber, favoriteClub } = msg.payload || {};
        if (!name) return;

        setPlayers(prev => {
          // Check if already in list (for reconnection)
          const existingIdx = prev.findIndex(p => p.id === id || p.name.toLowerCase() === name.toLowerCase());
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              isOnline: true,
              peerId: conn?.peer,
              favoriteClub: favoriteClub || updated[existingIdx].favoriteClub,
            };
            return updated;
          }

          // New player joining
          const newPlayer: RemotePlayer = {
            id: id || `p_${Date.now()}`,
            name,
            score: 0,
            avatarColor: avatarColor || 'from-blue-600 to-indigo-600',
            avatarNumber: avatarNumber || Math.floor(Math.random() * 90 + 10),
            isOnline: true,
            isReady: true,
            favoriteClub: favoriteClub || 'Football Fan',
            peerId: conn?.peer,
            streak: 0,
            maxStreak: 0,
            correctCount: 0,
            incorrectCount: 0,
            totalAnswerTimeRemaining: 0,
            clutchPoints: 0,
            veryHardCorrectCount: 0,
          };
          return [...prev, newPlayer];
        });

        // Send current state to newly joined player
        setTimeout(() => {
          broadcastState();
        }, 150);
      } else if (msg.type === 'SUBMIT_ANSWER') {
        const { playerId, option, timeRemaining: answeredTime } = msg.payload || {};
        if (playerId && option) {
          setRemoteSubmissions(prev => ({
            ...prev,
            [playerId]: {
              option,
              timeRemaining: answeredTime ?? timeRemaining,
              timestamp: Date.now(),
            },
          }));

          // Mark player as locked in
          setPlayers(prev => prev.map(p => {
            if (p.id !== playerId) return p;
            return {
              ...p,
              selectedOption: option,
              answeredAtRemainingTime: answeredTime,
              isLockedIn: true,
            };
          }));
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOnlineHost, timeRemaining, broadcastState]);

  // Host Online Room Setup
  const createOnlineRoom = useCallback(async (customCode?: string) => {
    const code = customCode ? customCode.toUpperCase() : generatePartyCode();
    setRoomCode(code);
    setIsOnlineHost(true);

    try {
      await peerNetwork.initHost(code);
    } catch (err) {
      console.error('Peer init host failed:', err);
    }

    return code;
  }, []);

  const closeOnlineRoom = useCallback(() => {
    peerNetwork.destroy();
    setIsOnlineHost(false);
    setRoomCode('');
    setRemoteSubmissions({});
  }, []);

  // Timer runner
  useEffect(() => {
    if (timerRunning && gameStatus === 'playing') {
      const stepMs = 100;
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const next = Math.max(0, Math.round((prev - stepMs / 1000) * 10) / 10);
          
          if (Math.abs(Math.round(next) - next) < 0.05 && next > 0 && next <= 20) {
            soundEngine.playTick(Math.round(next));
          }

          if (next <= 0) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            soundEngine.playWhistle();
            broadcastState({ timerRunning: false, timeRemaining: 0 });

            // Automated Scoring on Timer Expiration for Remote Submissions
            if (isOnlineHost && gameQuestions[currentIndex]) {
              autoGradeRemoteAnswers();
            }
            return 0;
          }
          return next;
        });
      }, stepMs);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, gameStatus, isOnlineHost, currentIndex, gameQuestions, broadcastState]);

  // Automated Scoring for Remote Players
  const autoGradeRemoteAnswers = useCallback(() => {
    const currentQ = gameQuestions[currentIndex];
    if (!currentQ) return;

    const letterToIndex: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

    setPlayers(prev => {
      let anyCorrect = false;

      const updated = prev.map(p => {
        const submission = remoteSubmissions[p.id];
        if (!submission) {
          // No answer submitted in time
          return {
            ...p,
            streak: 0,
            incorrectCount: p.incorrectCount + 1,
            isLockedIn: false,
            selectedOption: null,
          };
        }

        const optIndex = letterToIndex[submission.option.toUpperCase()];
        const chosenText = currentQ.options[optIndex];
        const isCorrect = chosenText === currentQ.answer || submission.option === currentQ.answer;

        if (isCorrect) {
          anyCorrect = true;
          const calc = calculateSpeedPoints(currentQ.difficulty, submission.timeRemaining, settings.totalSeconds);
          const streakBonus = calculateStreakBonus(p.streak, settings.streakBonusPerCorrect);
          const totalPoints = calc.speedPoints + streakBonus;

          const newStreak = p.streak + 1;
          const isClutch = submission.timeRemaining < 5.0;
          const isVeryHard = currentQ.difficulty === 'Very Hard';

          return {
            ...p,
            score: p.score + totalPoints,
            streak: newStreak,
            maxStreak: Math.max(p.maxStreak, newStreak),
            correctCount: p.correctCount + 1,
            totalAnswerTimeRemaining: p.totalAnswerTimeRemaining + submission.timeRemaining,
            clutchPoints: isClutch ? p.clutchPoints + totalPoints : p.clutchPoints,
            veryHardCorrectCount: isVeryHard ? p.veryHardCorrectCount + 1 : p.veryHardCorrectCount,
            isLockedIn: false,
            selectedOption: submission.option,
          };
        } else {
          return {
            ...p,
            streak: 0,
            incorrectCount: p.incorrectCount + 1,
            isLockedIn: false,
            selectedOption: submission.option,
          };
        }
      });

      if (anyCorrect) {
        soundEngine.playCorrect();
      } else {
        soundEngine.playWrong();
      }

      const dummyResult: QuestionResult = {
        questionId: currentQ.id,
        playerId: prev[activePlayerIndex]?.id || 'all',
        playerName: prev[activePlayerIndex]?.name || 'Players',
        isCorrect: anyCorrect,
        timeRemaining,
        basePoints: calculateSpeedPoints(currentQ.difficulty, timeRemaining, settings.totalSeconds).basePoints,
        speedPoints: 0,
        streakBonus: 0,
        totalPointsAwarded: 0,
        timestamp: Date.now(),
      };

      setLastResult(dummyResult);
      setGameStatus('revealed');
      aiQuestionService.markQuestionPlayed(currentQ);

      broadcastState({
        players: updated,
        lastResult: dummyResult,
        gameStatus: 'revealed',
        timerRunning: false,
      });

      return updated;
    });
  }, [gameQuestions, currentIndex, remoteSubmissions, settings, timeRemaining, activePlayerIndex, broadcastState]);

  // Start game with hybrid AI Question Engine & instant deduplicated fallback
  const startGame = useCallback((customLength?: number, preloadedQuestions?: TriviaQuestion[]) => {
    const length = customLength || settings.gameLength || 15;

    let selected: TriviaQuestion[] = [];
    let source: 'ai_live' | 'curated_database' = 'curated_database';

    if (preloadedQuestions && preloadedQuestions.length > 0) {
      selected = preloadedQuestions;
      source = preloadedQuestions[0]?.isAiGenerated ? 'ai_live' : 'curated_database';
    } else {
      // Instant zero-latency seed from curated fallback database with deduplication memory
      selected = aiQuestionService.getCuratedFallback({
        selectedDifficulties: settings.selectedDifficulties,
        selectedCategories: settings.selectedCategories,
        eraFocus: settings.eraFocus,
        difficultyCurve: settings.difficultyCurve,
      }, length);
      source = 'curated_database';

      // If AI generation is enabled and network is available, fetch live AI batch in background
      if (settings.useAiGeneration !== false && typeof navigator !== 'undefined' && navigator.onLine) {
        setIsAiLoading(true);
        aiQuestionService.fetchQuestionBatch({
          count: length,
          selectedDifficulties: settings.selectedDifficulties,
          selectedCategories: settings.selectedCategories,
          eraFocus: settings.eraFocus,
          difficultyCurve: settings.difficultyCurve,
        }).then(res => {
          if (res.questions && res.questions.length > 0) {
            setGameQuestions(res.questions);
            setQuestionSource(res.source);
            broadcastState({
              gameQuestions: res.questions,
              currentQuestion: res.questions[0],
            });
          }
        }).catch(err => {
          console.warn('AI Question batch background load notice:', err);
        }).finally(() => {
          setIsAiLoading(false);
        });
      }
    }

    setQuestionSource(source);

    const resetPlayers = players.map(p => ({
      ...p,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalAnswerTimeRemaining: 0,
      clutchPoints: 0,
      veryHardCorrectCount: 0,
      selectedOption: null,
      isLockedIn: false,
    }));

    setGameQuestions(selected);
    setCurrentIndex(0);
    setActivePlayerIndex(0);
    setTimeRemaining(settings.totalSeconds || 20);
    setTimerRunning(false);
    setLastResult(null);
    setHistory([]);
    setPlayers(resetPlayers);
    setRemoteSubmissions({});
    setGameStatus('playing');

    soundEngine.playWhistle();

    broadcastState({
      gameQuestions: selected,
      currentIndex: 0,
      currentQuestion: selected[0],
      activePlayerIndex: 0,
      timeRemaining: settings.totalSeconds || 20,
      timerRunning: false,
      lastResult: null,
      players: resetPlayers,
      gameStatus: 'playing',
    });
  }, [settings, players, broadcastState]);

  const startTimer = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setTimerRunning(true);
    broadcastState({ timerRunning: true });
    if (isOnlineHost) {
      peerNetwork.broadcast('TIMER_START', { timeRemaining });
    }
  }, [gameStatus, broadcastState, isOnlineHost, timeRemaining]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
    broadcastState({ timerRunning: false });
    if (isOnlineHost) {
      peerNetwork.broadcast('TIMER_PAUSE', { timeRemaining });
    }
  }, [broadcastState, isOnlineHost, timeRemaining]);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimeRemaining(settings.totalSeconds || 20);
    broadcastState({ timerRunning: false, timeRemaining: settings.totalSeconds || 20 });
    if (isOnlineHost) {
      peerNetwork.broadcast('TIMER_PAUSE', { timeRemaining: settings.totalSeconds || 20 });
    }
  }, [settings.totalSeconds, broadcastState, isOnlineHost]);

  const setActivePlayer = useCallback((playerId: string) => {
    const idx = players.findIndex(p => p.id === playerId);
    if (idx !== -1) {
      setActivePlayerIndex(idx);
      broadcastState({ activePlayerIndex: idx });
    }
  }, [players, broadcastState]);

  // Submit Answer Verification (Host manual verification or single-player override)
  const submitResult = useCallback((isCorrect: boolean) => {
    if (gameStatus !== 'playing') return;
    const currentQ = gameQuestions[currentIndex];
    const activePlayer = players[activePlayerIndex];
    if (!currentQ || !activePlayer) return;

    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    let speedPoints = 0;
    let basePoints = 0;
    let streakBonus = 0;
    let totalAwarded = 0;

    const prevRankOrder = [...players].sort((a, b) => b.score - a.score).map(p => p.id);

    let updatedPlayers: RemotePlayer[];

    if (isCorrect) {
      const calc = calculateSpeedPoints(currentQ.difficulty, timeRemaining, settings.totalSeconds);
      basePoints = calc.basePoints;
      speedPoints = calc.speedPoints;
      streakBonus = calculateStreakBonus(activePlayer.streak, settings.streakBonusPerCorrect);
      totalAwarded = speedPoints + streakBonus;

      const newStreak = activePlayer.streak + 1;
      const newMaxStreak = Math.max(activePlayer.maxStreak, newStreak);
      const isClutch = timeRemaining < 5.0;
      const isVeryHard = currentQ.difficulty === 'Very Hard';

      updatedPlayers = players.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        return {
          ...p,
          score: p.score + totalAwarded,
          streak: newStreak,
          maxStreak: newMaxStreak,
          correctCount: p.correctCount + 1,
          totalAnswerTimeRemaining: p.totalAnswerTimeRemaining + timeRemaining,
          clutchPoints: isClutch ? p.clutchPoints + totalAwarded : p.clutchPoints,
          veryHardCorrectCount: isVeryHard ? p.veryHardCorrectCount + 1 : p.veryHardCorrectCount,
          isLockedIn: false,
        };
      });

      soundEngine.playCorrect();
      if (newStreak >= 2) {
        setTimeout(() => soundEngine.playStreak(), 280);
      }
    } else {
      updatedPlayers = players.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        return {
          ...p,
          streak: 0,
          incorrectCount: p.incorrectCount + 1,
          isLockedIn: false,
        };
      });

      soundEngine.playWrong();
    }

    const newRankOrder = [...updatedPlayers].sort((a, b) => b.score - a.score).map(p => p.id);
    const activeOldRank = prevRankOrder.indexOf(activePlayer.id);
    const activeNewRank = newRankOrder.indexOf(activePlayer.id);
    if (isCorrect && activeNewRank < activeOldRank) {
      setTimeout(() => soundEngine.playRankChange(), 600);
    }

    const result: QuestionResult = {
      questionId: currentQ.id,
      playerId: activePlayer.id,
      playerName: activePlayer.name,
      isCorrect,
      timeRemaining,
      basePoints,
      speedPoints,
      streakBonus,
      totalPointsAwarded: totalAwarded,
      timestamp: Date.now(),
    };

    setPlayers(updatedPlayers);
    setLastResult(result);
    setHistory(prev => [result, ...prev]);
    setGameStatus('revealed');
    aiQuestionService.markQuestionPlayed(currentQ);

    broadcastState({
      timerRunning: false,
      players: updatedPlayers,
      lastResult: result,
      gameStatus: 'revealed',
    });

    if (isOnlineHost) {
      peerNetwork.broadcast('ANSWER_REVEAL', {
        result,
        players: updatedPlayers,
      });
    }
  }, [gameStatus, gameQuestions, currentIndex, players, activePlayerIndex, timeRemaining, settings, broadcastState, isOnlineHost]);

  // Next question
  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= gameQuestions.length) {
      setGameStatus('game_over');
      setTimerRunning(false);
      soundEngine.playWhistle();
      broadcastState({ gameStatus: 'game_over', timerRunning: false });
      if (isOnlineHost) {
        peerNetwork.broadcast('GAME_OVER', { players });
      }
      return;
    }

    const nextIdx = currentIndex + 1;
    const nextPlayerIdx = (activePlayerIndex + 1) % players.length;

    // Reset player answer locks
    const clearedPlayers = players.map(p => ({
      ...p,
      selectedOption: null,
      isLockedIn: false,
    }));

    setCurrentIndex(nextIdx);
    setActivePlayerIndex(nextPlayerIdx);
    setTimeRemaining(settings.totalSeconds || 20);
    setTimerRunning(false);
    setLastResult(null);
    setRemoteSubmissions({});
    setPlayers(clearedPlayers);
    setGameStatus('playing');

    broadcastState({
      currentIndex: nextIdx,
      currentQuestion: gameQuestions[nextIdx],
      activePlayerIndex: nextPlayerIdx,
      timeRemaining: settings.totalSeconds || 20,
      timerRunning: false,
      lastResult: null,
      players: clearedPlayers,
      gameStatus: 'playing',
    });
  }, [currentIndex, gameQuestions, activePlayerIndex, players, settings.totalSeconds, broadcastState, isOnlineHost]);

  // Prev question
  const prevQuestion = useCallback(() => {
    if (currentIndex <= 0) return;
    const prevIdx = currentIndex - 1;
    setCurrentIndex(prevIdx);
    setTimeRemaining(settings.totalSeconds || 20);
    setTimerRunning(false);
    setLastResult(null);
    setRemoteSubmissions({});
    setGameStatus('playing');

    broadcastState({
      currentIndex: prevIdx,
      currentQuestion: gameQuestions[prevIdx],
      timeRemaining: settings.totalSeconds || 20,
      timerRunning: false,
      lastResult: null,
      gameStatus: 'playing',
    });
  }, [currentIndex, gameQuestions, settings.totalSeconds, broadcastState]);

  // Manual score adjustment
  const manualScoreAdjust = useCallback((playerId: string, delta: number) => {
    setPlayers(prev => {
      const next = prev.map(p => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          score: Math.max(0, p.score + delta),
        };
      });
      broadcastState({ players: next });
      return next;
    });
  }, [broadcastState]);

  // Host play toggle
  const toggleHostActivePlay = useCallback((enable: boolean) => {
    setSettings(prev => ({ ...prev, hostActivePlay: enable }));
    setPlayers(prev => {
      const hasHost = prev.some(p => p.isHost);
      let updated: RemotePlayer[];
      if (enable && !hasHost) {
        const hostPlayer: RemotePlayer = {
          id: 'host_player',
          name: 'The Host',
          score: 0,
          avatarColor: 'from-purple-600 to-pink-600',
          avatarNumber: 1,
          isHost: true,
          streak: 0,
          maxStreak: 0,
          correctCount: 0,
          incorrectCount: 0,
          totalAnswerTimeRemaining: 0,
          clutchPoints: 0,
          veryHardCorrectCount: 0,
        };
        updated = [...prev, hostPlayer];
      } else if (!enable && hasHost) {
        updated = prev.filter(p => !p.isHost);
      } else {
        updated = prev;
      }
      broadcastState({ players: updated });
      return updated;
    });
  }, [broadcastState]);

  // Add / remove player
  const addPlayer = useCallback((name?: string) => {
    const kitColors = [
      'from-rose-600 to-red-700',
      'from-sky-500 to-blue-600',
      'from-emerald-500 to-teal-700',
      'from-amber-500 to-orange-600',
      'from-violet-600 to-purple-800',
      'from-cyan-500 to-blue-700',
      'from-yellow-400 to-amber-600',
    ];
    setPlayers(prev => {
      const newNum = prev.length + 1;
      const newPlayer: RemotePlayer = {
        id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name?.trim() || `Player ${newNum}`,
        score: 0,
        avatarColor: kitColors[(newNum - 1) % kitColors.length],
        avatarNumber: newNum * 2 + 1,
        streak: 0,
        maxStreak: 0,
        correctCount: 0,
        incorrectCount: 0,
        totalAnswerTimeRemaining: 0,
        clutchPoints: 0,
        veryHardCorrectCount: 0,
      };
      return [...prev, newPlayer];
    });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setPlayers(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(p => p.id !== playerId);
    });
  }, []);

  const updatePlayerName = useCallback((playerId: string, name: string) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, name } : p));
  }, []);

  const addCustomQuestion = useCallback((newQ: Omit<TriviaQuestion, 'id'>) => {
    const created: TriviaQuestion = {
      ...newQ,
      id: Date.now(),
      isCustom: true,
    };
    setQuestions(prev => {
      const updated = [created, ...prev];
      const customOnly = updated.filter(q => q.isCustom);
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_QS, JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
  }, []);

  const deleteCustomQuestion = useCallback((id: number | string) => {
    setQuestions(prev => {
      const updated = prev.filter(q => q.id !== id);
      const customOnly = updated.filter(q => q.isCustom);
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_QS, JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
  }, []);

  const exitToSetup = useCallback(() => {
    setTimerRunning(false);
    setGameStatus('setup');
    broadcastState({ gameStatus: 'setup', timerRunning: false });
  }, [broadcastState]);

  return {
    questions,
    gameQuestions,
    currentIndex,
    currentQuestion: gameQuestions[currentIndex] || null,
    players,
    activePlayer: players[activePlayerIndex] || players[0] || null,
    activePlayerIndex,
    gameStatus,
    timerRunning,
    timeRemaining,
    lastResult,
    history,
    settings,
    setSettings,
    isAiLoading,
    questionSource,
    aiQuestionService,
    isOnlineHost,
    roomCode,
    joinUrl: getJoinUrl(roomCode),
    remoteSubmissions,
    createOnlineRoom,
    closeOnlineRoom,
    autoGradeRemoteAnswers,
    startGame,
    startTimer,
    pauseTimer,
    resetTimer,
    setActivePlayer,
    submitResult,
    nextQuestion,
    prevQuestion,
    manualScoreAdjust,
    toggleHostActivePlay,
    addPlayer,
    removePlayer,
    updatePlayerName,
    addCustomQuestion,
    deleteCustomQuestion,
    exitToSetup,
  };
}
