import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTriviaGame } from './hooks/useTriviaGame';
import { NavBar, ActiveView } from './components/NavBar';
import { HostView } from './components/HostView';
import { BigScreenView } from './components/BigScreenView';
import { SplitView } from './components/SplitView';
import { LeaderboardSidebar } from './components/LeaderboardSidebar';
import { EndGameSummary } from './components/EndGameSummary';
import { GameSetupModal } from './components/GameSetupModal';
import { CustomQuestionsModal } from './components/CustomQuestionsModal';
import { OnlineLobbyModal } from './components/OnlineLobbyModal';
import { JoinGameModal } from './components/JoinGameModal';
import { RemotePlayerView } from './components/RemotePlayerView';
import { ModeSelectorHub } from './components/ModeSelectorHub';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { TrophyShopModal } from './components/TrophyShopModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { MatchmakingModal } from './components/MatchmakingModal';
import { PostMatchRewardModal } from './components/PostMatchRewardModal';
import { SoloMatchView } from './components/SoloMatchView';
import { FooterWatermark } from './components/FooterWatermark';
import { RemotePlayer, NetworkMessage } from './types/multiplayer';
import { UserProfile, MatchmakingBot, PostMatchRewards } from './types/progression';
import { authService } from './services/authService';
import { peerNetwork } from './utils/peerNetwork';
import { simulateBotAnswer, createBotOpponent } from './utils/botEngine';
import { TriviaQuestion, QuestionResult } from './types/trivia';
import { 
  Play, 
  Users, 
  Settings2, 
  Database, 
  Trophy, 
  Zap, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Wifi, 
  LogIn, 
  Home
} from 'lucide-react';

export default function App() {
  const {
    questions,
    gameQuestions,
    currentIndex,
    currentQuestion,
    players,
    activePlayer,
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
    joinUrl,
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
    submitSoloAnswer,
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
  } = useTriviaGame();

  // User Profile & Authentication State
  const [profile, setProfile] = useState<UserProfile>(authService.getProfile());

  // Subscribe to auth service updates
  useEffect(() => {
    return authService.subscribe(setProfile);
  }, []);

  // View state
  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'bigscreen') return 'bigscreen';
    }
    return 'host';
  });

  // Active Menu / Game Mode
  const [activeMode, setActiveMode] = useState<'hub' | 'local_setup' | 'playing'>('hub');
  const [gameMode, setGameMode] = useState<'SOLO_VS_AI' | 'LOCAL_HOST' | 'PARTY_ROOM'>('SOLO_VS_AI');
  const [currentMatchMode, setCurrentMatchMode] = useState<'local_host' | '1v1_ranked' | 'ffa_4p' | 'party_room'>('1v1_ranked');
  const [activeBots, setActiveBots] = useState<MatchmakingBot[]>([]);
  const botAnswerTimeoutsRef = useRef<number[]>([]);

  // Client remote player state (if joined as mobile client)
  const [isClientMode, setIsClientMode] = useState(false);
  const [clientPlayer, setClientPlayer] = useState<RemotePlayer | null>(null);
  const [clientRoomCode, setClientRoomCode] = useState('');
  const [clientConnected, setClientConnected] = useState(false);
  const [clientQuestion, setClientQuestion] = useState<TriviaQuestion | null>(null);
  const [clientIndex, setClientIndex] = useState(0);
  const [clientTotalQs, setClientTotalQs] = useState(20);
  const [clientTimeRemaining, setClientTimeRemaining] = useState(20);
  const [clientTimerRunning, setClientTimerRunning] = useState(false);
  const [clientGameStatus, setClientGameStatus] = useState<string>('setup');
  const [clientLastResult, setClientLastResult] = useState<QuestionResult | null>(null);

  // Modals state
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [onlineLobbyModalOpen, setOnlineLobbyModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinModalDefaultCode, setJoinModalDefaultCode] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [questsModalOpen, setQuestsModalOpen] = useState(false);
  const [matchmakingModalOpen, setMatchmakingModalOpen] = useState(false);
  const [postMatchRewards, setPostMatchRewards] = useState<PostMatchRewards | null>(null);

  // Categories
  const allCategories = React.useMemo(() => {
    const set = new Set<string>();
    questions.forEach(q => set.add(q.category));
    return Array.from(set).sort();
  }, [questions]);

  // URL query params check on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const joinCode = params.get('join');
      if (joinCode) {
        setJoinModalDefaultCode(joinCode.toUpperCase());
        setJoinModalOpen(true);
      }
    }
  }, []);

  // Handle Client Peer Network Events
  useEffect(() => {
    if (!isClientMode || !clientRoomCode) return;

    const unsubscribe = peerNetwork.onMessage((msg: NetworkMessage) => {
      if (msg.type === 'STATE_SYNC') {
        const payload = msg.payload || {};
        if (payload.currentQuestion !== undefined) setClientQuestion(payload.currentQuestion);
        if (payload.currentIndex !== undefined) setClientIndex(payload.currentIndex);
        if (payload.gameQuestions) setClientTotalQs(payload.gameQuestions.length);
        if (payload.timeRemaining !== undefined) setClientTimeRemaining(payload.timeRemaining);
        if (payload.timerRunning !== undefined) setClientTimerRunning(payload.timerRunning);
        if (payload.gameStatus) setClientGameStatus(payload.gameStatus);
        if (payload.lastResult !== undefined) setClientLastResult(payload.lastResult);

        if (payload.players && clientPlayer) {
          const updatedSelf = payload.players.find((p: RemotePlayer) => p.id === clientPlayer.id);
          if (updatedSelf) setClientPlayer(updatedSelf);
        }
      } else if (msg.type === 'TIMER_START') {
        setClientTimerRunning(true);
        if (msg.payload?.timeRemaining !== undefined) setClientTimeRemaining(msg.payload.timeRemaining);
      } else if (msg.type === 'TIMER_PAUSE') {
        setClientTimerRunning(false);
        if (msg.payload?.timeRemaining !== undefined) setClientTimeRemaining(msg.payload.timeRemaining);
      } else if (msg.type === 'ANSWER_REVEAL') {
        setClientTimerRunning(false);
        setClientGameStatus('revealed');
        if (msg.payload?.result) setClientLastResult(msg.payload.result);
        if (msg.payload?.players && clientPlayer) {
          const updatedSelf = msg.payload.players.find((p: RemotePlayer) => p.id === clientPlayer.id);
          if (updatedSelf) setClientPlayer(updatedSelf);
        }
      } else if (msg.type === 'GAME_OVER') {
        setClientGameStatus('game_over');
        setClientTimerRunning(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isClientMode, clientRoomCode, clientPlayer]);

  // AI Bots real-time answer simulation during active question countdown
  useEffect(() => {
    // Clear any pending bot simulation timeouts
    botAnswerTimeoutsRef.current.forEach(t => clearTimeout(t));
    botAnswerTimeoutsRef.current = [];

    if (timerRunning && gameStatus === 'playing' && activeBots.length > 0 && currentQuestion) {
      activeBots.forEach((bot) => {
        const botSim = simulateBotAnswer(bot, currentQuestion);
        // Convert bot delay into timeout
        const delayMs = Math.max(1200, Math.min(18000, botSim.answerTimeSeconds * 1000));

        const timeout = window.setTimeout(() => {
          // Simulate bot locking in an answer option
          const letter = ['A', 'B', 'C', 'D'][currentQuestion.options.indexOf(botSim.chosenOption)] || 'A';
          // Find player entry for bot and update
          const remainingSec = Math.max(0, 20 - botSim.answerTimeSeconds);

          // Submit answer on host state
          if (peerNetwork) {
            peerNetwork.broadcast('SUBMIT_ANSWER', {
              playerId: bot.id,
              option: letter,
              timeRemaining: remainingSec,
            });
          }
        }, delayMs);

        botAnswerTimeoutsRef.current.push(timeout);
      });
    }

    return () => {
      botAnswerTimeoutsRef.current.forEach(t => clearTimeout(t));
      botAnswerTimeoutsRef.current = [];
    };
  }, [timerRunning, gameStatus, currentIndex, activeBots, currentQuestion]);

  // When game completes, automatically calculate rewards & update profile
  const hasAwardedRef = useRef(false);
  useEffect(() => {
    if (gameStatus === 'game_over' && !hasAwardedRef.current) {
      hasAwardedRef.current = true;
      const sorted = [...players].sort((a, b) => b.score - a.score);
      const userPlayer = players.find(p => !p.id.startsWith('bot_')) || players[0];
      const userRank = userPlayer ? sorted.indexOf(userPlayer) + 1 : 1;
      const userScore = userPlayer?.score || 0;
      const correctCount = userPlayer?.correctCount || 0;
      const maxStreak = userPlayer?.maxStreak || 0;
      const avgSpeed = userPlayer && userPlayer.correctCount > 0 
        ? userPlayer.totalAnswerTimeRemaining / userPlayer.correctCount 
        : 12.0;

      const opponentsList = players.filter(p => p.id !== userPlayer?.id).map(p => ({
        name: p.name,
        score: p.score,
        avatarColor: p.avatarColor,
        isBot: p.id.startsWith('bot_'),
      }));

      const rewards = authService.recordMatchCompletion(
        currentMatchMode,
        userRank,
        userScore,
        gameQuestions.length,
        correctCount,
        avgSpeed,
        maxStreak,
        opponentsList
      );

      setPostMatchRewards(rewards);
    } else if (gameStatus === 'playing') {
      hasAwardedRef.current = false;
    }
  }, [gameStatus, players, currentMatchMode, gameQuestions.length]);

  // Launch Dedicated Single-Player (Solo vs AI) Match directly bypassing Host Deck
  const handleStartSoloVsAi = useCallback((mode: '1v1_ranked' | 'ffa_4p' = '1v1_ranked') => {
    setCurrentMatchMode(mode);
    setGameMode('SOLO_VS_AI');
    const count = mode === '1v1_ranked' ? 1 : 3;
    const opponents: MatchmakingBot[] = [];
    for (let i = 0; i < count; i++) {
      opponents.push(createBotOpponent(profile.rankTier, profile.skillRating, i));
    }
    setActiveBots(opponents);

    const userAsPlayer: RemotePlayer = {
      id: profile.id,
      name: profile.username,
      score: 0,
      avatarColor: profile.avatarColor,
      avatarNumber: profile.avatarNumber,
      favoriteClub: profile.favoriteClub,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalAnswerTimeRemaining: 0,
      clutchPoints: 0,
      veryHardCorrectCount: 0,
    };

    const opponentPlayers: RemotePlayer[] = opponents.map(b => ({
      id: b.id,
      name: b.name,
      score: 0,
      avatarColor: b.avatarColor,
      avatarNumber: b.avatarNumber,
      favoriteClub: b.favoriteClub,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalAnswerTimeRemaining: 0,
      clutchPoints: 0,
      veryHardCorrectCount: 0,
    }));

    const roster = [userAsPlayer, ...opponentPlayers];
    startGame(10, undefined, roster);
    setActiveMode('playing');
    setTimeout(() => startTimer(), 100);

    // Stock the 5-question background prefetch buffer immediately
    aiQuestionService.prefetchQuestions({
      count: 5,
      selectedDifficulties: settings.selectedDifficulties,
      selectedCategories: settings.selectedCategories,
      eraFocus: settings.eraFocus,
      difficultyCurve: settings.difficultyCurve,
    }).catch(() => {});
  }, [profile, settings, startGame, startTimer]);

  // Handle Ranked Match Found (SBMM & Bot Backfill) - Routes directly into Solo vs AI match
  const handleMatchFound = useCallback((mode: '1v1_ranked' | 'ffa_4p', opponents: MatchmakingBot[]) => {
    setCurrentMatchMode(mode);
    setGameMode('SOLO_VS_AI');
    setActiveBots(opponents);

    // Build player roster with user profile first
    const userAsPlayer: RemotePlayer = {
      id: profile.id,
      name: profile.username,
      score: 0,
      avatarColor: profile.avatarColor,
      avatarNumber: profile.avatarNumber,
      favoriteClub: profile.favoriteClub,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalAnswerTimeRemaining: 0,
      clutchPoints: 0,
      veryHardCorrectCount: 0,
    };

    const opponentPlayers: RemotePlayer[] = opponents.map(b => ({
      id: b.id,
      name: b.name,
      score: 0,
      avatarColor: b.avatarColor,
      avatarNumber: b.avatarNumber,
      favoriteClub: b.favoriteClub,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalAnswerTimeRemaining: 0,
      clutchPoints: 0,
      veryHardCorrectCount: 0,
    }));

    // Update game players and start match
    const roster = [userAsPlayer, ...opponentPlayers];
    // Start 10-question competitive fixture
    startGame(10, undefined, roster);
    setActiveMode('playing');
    setTimeout(() => startTimer(), 100);

    // Replenish prefetch buffer
    aiQuestionService.prefetchQuestions({
      count: 5,
      selectedDifficulties: settings.selectedDifficulties,
      selectedCategories: settings.selectedCategories,
      eraFocus: settings.eraFocus,
      difficultyCurve: settings.difficultyCurve,
    }).catch(() => {});
  }, [profile, settings, startGame, startTimer]);

  // Handle Solo Answer Submission (Auto-grades and advances without host intervention)
  const handleSoloAnswerSubmitted = useCallback((chosenOption: string, remainingTime: number) => {
    // Generate simulated answers for bots
    const botAnswers = activeBots.map(b => {
      const sim = currentQuestion ? simulateBotAnswer(b, currentQuestion) : {
        chosenOption: '',
        answerTimeSeconds: 6,
        isCorrect: false,
      };
      return {
        botId: b.id,
        chosenOption: sim.chosenOption,
        isCorrect: sim.isCorrect,
        answerTimeSeconds: sim.answerTimeSeconds,
      };
    });

    submitSoloAnswer(chosenOption, remainingTime, botAnswers);
  }, [activeBots, currentQuestion, submitSoloAnswer]);

  // Handle Solo Auto-Advancement to Next Question
  const handleSoloNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= gameQuestions.length) {
      nextQuestion();
    } else {
      nextQuestion();
      setTimeout(() => startTimer(), 150);

      // Pre-fetch 5-question buffer in background
      aiQuestionService.prefetchQuestions({
        count: 5,
        selectedDifficulties: settings.selectedDifficulties,
        selectedCategories: settings.selectedCategories,
        eraFocus: settings.eraFocus,
        difficultyCurve: settings.difficultyCurve,
      }).catch(() => {});
    }
  }, [currentIndex, gameQuestions.length, nextQuestion, startTimer, settings]);

  // Client joining room
  const handleJoinRoom = useCallback(async (
    targetRoomCode: string,
    playerName: string,
    avatarColor: string,
    avatarNumber: number,
    favoriteClub: string
  ) => {
    const playerId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newClient: RemotePlayer = {
      id: playerId,
      name: playerName,
      score: 0,
      avatarColor,
      avatarNumber,
      favoriteClub,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      incorrectCount: 0,
      totalAnswerTimeRemaining: 0,
      clutchPoints: 0,
      veryHardCorrectCount: 0,
      isOnline: true,
      isReady: true,
    };

    setClientPlayer(newClient);
    setClientRoomCode(targetRoomCode);
    setIsClientMode(true);
    setClientConnected(false);

    try {
      await peerNetwork.initClient(
        targetRoomCode,
        () => {
          setClientConnected(true);
          peerNetwork.sendToHost('LOBBY_JOIN', newClient, playerId, playerName);
        },
        () => {
          setClientConnected(false);
        }
      );
    } catch {
      setClientConnected(false);
    }
  }, []);

  const handleClientSelectOption = useCallback((optionLetter: string, remainingTime: number) => {
    if (!clientPlayer || !clientRoomCode) return;
    peerNetwork.sendToHost('SUBMIT_ANSWER', {
      playerId: clientPlayer.id,
      option: optionLetter,
      timeRemaining: remainingTime,
    }, clientPlayer.id, clientPlayer.name);
  }, [clientPlayer, clientRoomCode]);

  const handleClientLeaveRoom = useCallback(() => {
    peerNetwork.destroy();
    setIsClientMode(false);
    setClientPlayer(null);
    setClientRoomCode('');
    setClientConnected(false);
  }, []);

  const handleOpenOnlineHost = useCallback(async () => {
    let currentCode = roomCode;
    if (!isOnlineHost || !currentCode) {
      currentCode = await createOnlineRoom();
    }
    setCurrentMatchMode('party_room');
    setOnlineLobbyModalOpen(true);
  }, [isOnlineHost, roomCode, createOnlineRoom]);

  const handleFallbackToLocal = useCallback(() => {
    closeOnlineRoom();
    setOnlineLobbyModalOpen(false);
    setCurrentMatchMode('local_host');
    setActiveMode('local_setup');
  }, [closeOnlineRoom]);

  // If this device is acting as a remote player (mobile client)
  if (isClientMode && clientPlayer) {
    return (
      <>
        <RemotePlayerView
          player={clientPlayer}
          roomCode={clientRoomCode}
          isConnected={clientConnected}
          question={clientQuestion}
          currentIndex={clientIndex}
          totalQuestions={clientTotalQs}
          timeRemaining={clientTimeRemaining}
          timerRunning={clientTimerRunning}
          gameStatus={clientGameStatus}
          lastResult={clientLastResult}
          onSelectOption={handleClientSelectOption}
          onLeaveRoom={handleClientLeaveRoom}
        />
        <FooterWatermark />
      </>
    );
  }

  // If in standalone big screen popout mode
  const isPopOutTV = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'bigscreen';

  if (isPopOutTV) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-8">
        {gameStatus === 'playing' || gameStatus === 'revealed' ? (
          <BigScreenView
            question={currentQuestion}
            totalQuestions={gameQuestions.length}
            currentIndex={currentIndex}
            activePlayer={activePlayer}
            timeRemaining={timeRemaining}
            timerRunning={timerRunning}
            gameStatus={gameStatus}
            lastResult={lastResult}
            settings={settings}
          />
        ) : gameStatus === 'game_over' ? (
          <EndGameSummary
            players={players}
            history={history}
            onPlayAgain={() => startGame(settings.gameLength)}
            onNewGame={() => setSetupModalOpen(true)}
          />
        ) : (
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-xl">
              MP
            </div>
            <h2 className="text-2xl font-bold font-display">MatchPoint Broadcast Screen</h2>
            <p className="text-sm text-slate-400">
              Synchronized with the Host Deck. Waiting for the Host to kick off the match.
            </p>
          </div>
        )}
        <FooterWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04120a] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Matchday HUD Scoreboard */}
      <NavBar
        currentView={currentView}
        onChangeView={setCurrentView}
        gameStatus={gameStatus}
        currentIndex={currentIndex}
        totalQuestions={gameQuestions.length}
        profile={profile}
        isOnlineHost={isOnlineHost}
        roomCode={roomCode}
        onReturnToHub={() => {
          exitToSetup();
          setActiveMode('hub');
        }}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenShop={() => setShopModalOpen(true)}
        onOpenQuests={() => setQuestsModalOpen(true)}
        onOpenMatchmaking={() => setMatchmakingModalOpen(true)}
        onOpenOnlineLobby={handleOpenOnlineHost}
        onOpenJoinGame={() => setJoinModalOpen(true)}
        onOpenSetup={() => setSetupModalOpen(true)}
        onOpenQuestions={() => setQuestionsModalOpen(true)}
        onRestartMatch={() => startGame(settings.gameLength)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {gameStatus === 'playing' || gameStatus === 'revealed' ? (
          /* Active Match View: Dedicated Solo vs AI, Split, BigScreen, or Host Deck */
          gameMode === 'SOLO_VS_AI' ? (
            <SoloMatchView
              question={currentQuestion}
              totalQuestions={gameQuestions.length}
              currentIndex={currentIndex}
              player={players.find(p => !p.id.startsWith('bot_')) || players[0]}
              bots={activeBots}
              players={players}
              timeRemaining={timeRemaining}
              timerRunning={timerRunning}
              gameStatus={gameStatus}
              settings={settings}
              onAnswerSubmitted={handleSoloAnswerSubmitted}
              onNextQuestion={handleSoloNextQuestion}
              onForfeitMatch={() => {
                exitToSetup();
                setActiveMode('hub');
              }}
              isAiLive={settings.useAiGeneration !== false && questionSource === 'ai_live'}
            />
          ) : currentView === 'split' ? (
            <SplitView
              question={currentQuestion}
              totalQuestions={gameQuestions.length}
              currentIndex={currentIndex}
              players={players}
              activePlayer={activePlayer}
              timeRemaining={timeRemaining}
              timerRunning={timerRunning}
              gameStatus={gameStatus}
              lastResult={lastResult}
              settings={settings}
              isOnlineHost={isOnlineHost}
              roomCode={roomCode}
              onOpenLobby={() => setOnlineLobbyModalOpen(true)}
              onAutoGrade={autoGradeRemoteAnswers}
              onStartTimer={startTimer}
              onPauseTimer={pauseTimer}
              onResetTimer={resetTimer}
              onSelectPlayer={setActivePlayer}
              onSubmitResult={submitResult}
              onNextQuestion={nextQuestion}
              onPrevQuestion={prevQuestion}
              onManualAdjust={manualScoreAdjust}
              onToggleHostPlay={toggleHostActivePlay}
            />
          ) : currentView === 'bigscreen' ? (
            <div className="w-full flex-1 flex flex-col justify-center">
              <BigScreenView
                question={currentQuestion}
                totalQuestions={gameQuestions.length}
                currentIndex={currentIndex}
                activePlayer={activePlayer}
                timeRemaining={timeRemaining}
                timerRunning={timerRunning}
                gameStatus={gameStatus}
                lastResult={lastResult}
                settings={settings}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
              <div className="lg:col-span-8 flex flex-col gap-4">
                <HostView
                  question={currentQuestion}
                  totalQuestions={gameQuestions.length}
                  currentIndex={currentIndex}
                  players={players}
                  activePlayer={activePlayer}
                  timeRemaining={timeRemaining}
                  timerRunning={timerRunning}
                  gameStatus={gameStatus}
                  lastResult={lastResult}
                  settings={settings}
                  isOnlineHost={isOnlineHost}
                  roomCode={roomCode}
                  onOpenLobby={() => setOnlineLobbyModalOpen(true)}
                  onAutoGrade={autoGradeRemoteAnswers}
                  onStartTimer={startTimer}
                  onPauseTimer={pauseTimer}
                  onResetTimer={resetTimer}
                  onSelectPlayer={setActivePlayer}
                  onSubmitResult={submitResult}
                  onNextQuestion={nextQuestion}
                  onPrevQuestion={prevQuestion}
                  onManualAdjust={manualScoreAdjust}
                  onToggleHostPlay={toggleHostActivePlay}
                />
              </div>

              <div className="lg:col-span-4 sticky top-20">
                <LeaderboardSidebar
                  players={players}
                  activePlayerId={activePlayer?.id}
                  onSelectPlayer={setActivePlayer}
                  onManualAdjust={manualScoreAdjust}
                  showControls={true}
                />
              </div>
            </div>
          )
        ) : gameStatus === 'game_over' ? (
          /* Match Concluded Podium */
          <EndGameSummary
            players={players}
            history={history}
            onPlayAgain={() => startGame(settings.gameLength)}
            onNewGame={() => {
              exitToSetup();
              setActiveMode('hub');
            }}
          />
        ) : activeMode === 'local_setup' ? (
          /* Local Pass & Play Kickoff Configuration */
          <div className="max-w-4xl mx-auto w-full my-auto space-y-6 animate-in fade-in duration-300 py-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveMode('hub')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Back to Mode Hub"
                >
                  <Home className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-2xl font-stadium font-bold text-slate-100 tracking-wider">
                    LOCAL PASS & PLAY ROSTER SETUP
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    100% Offline group play · Pass device between active turn players.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSetupModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-scoreboard font-bold hover:bg-slate-800 cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>MATCH RULES</span>
              </button>
            </div>

            {/* Lineup Card */}
            <div className="bg-[#071d12]/95 border-2 border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-scoreboard font-bold uppercase text-slate-400">
                  STARTING SQUAD LINEUP ({players.length} PLAYERS)
                </span>
                <button
                  type="button"
                  onClick={() => addPlayer()}
                  className="text-xs font-scoreboard font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer"
                >
                  + ADD PLAYER
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 shadow-md"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white font-mono font-bold text-xs shadow-inner`}>
                      {p.avatarNumber}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{p.name}</div>
                      {p.isHost && <div className="text-[10px] text-purple-400 font-mono">Host</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-500/20">
                <div className="flex flex-col gap-1 text-xs font-scoreboard text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>FIXTURE: {settings.gameLength} QUESTIONS · TIMER: {settings.totalSeconds}S</span>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, useAiGeneration: !prev.useAiGeneration }))}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                        settings.useAiGeneration !== false
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/70'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                      title="Click to toggle AI Live Generation vs Offline Database"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{settings.useAiGeneration !== false ? 'Live AI Generator (Gemini 3.8)' : 'Curated Database Only'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span>Deduplication memory:</span>
                    <span className="text-emerald-400 font-mono">{aiQuestionService.getPlayedCount()}/100</span>
                    <span>past questions filtered to prevent duplicate topics.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setGameMode('LOCAL_HOST');
                    setCurrentMatchMode('local_host');
                    startGame(settings.gameLength);
                    setActiveMode('playing');
                  }}
                  className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-stadium font-black text-2xl tracking-wider rounded-xl shadow-lg shadow-emerald-950 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>{isAiLoading ? 'GENERATING MATCH...' : 'KICK OFF OFFLINE MATCH'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Universal Landing Page Mode Selector Hub */
          <ModeSelectorHub
            profile={profile}
            onSelectSoloVsAi={() => handleStartSoloVsAi('1v1_ranked')}
            onSelectLocalPlay={() => {
              setGameMode('LOCAL_HOST');
              setActiveMode('local_setup');
            }}
            onSelectPrivateRoom={() => {
              setGameMode('PARTY_ROOM');
              handleOpenOnlineHost();
            }}
            onSelectMatchmaking={() => setMatchmakingModalOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenShop={() => setShopModalOpen(true)}
            onOpenQuests={() => setQuestsModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <GameSetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        players={players}
        settings={settings}
        categories={allCategories}
        onHostOnlineRoom={() => {
          setGameMode('PARTY_ROOM');
          handleOpenOnlineHost();
        }}
        onStartGame={(len) => {
          setGameMode('LOCAL_HOST');
          setCurrentMatchMode('local_host');
          startGame(len);
          setActiveMode('playing');
        }}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onUpdatePlayerName={updatePlayerName}
        onUpdateSettings={setSettings}
      />

      <CustomQuestionsModal
        isOpen={questionsModalOpen}
        onClose={() => setQuestionsModalOpen(false)}
        questions={questions}
        onAddQuestion={addCustomQuestion}
        onDeleteQuestion={deleteCustomQuestion}
      />

      <OnlineLobbyModal
        isOpen={onlineLobbyModalOpen}
        onClose={() => setOnlineLobbyModalOpen(false)}
        roomCode={roomCode}
        joinUrl={joinUrl}
        players={players}
        onStartMatch={() => {
          setGameMode('PARTY_ROOM');
          startGame(settings.gameLength);
          setActiveMode('playing');
        }}
        onKickPlayer={removePlayer}
        onFallbackToLocal={handleFallbackToLocal}
      />

      <JoinGameModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        defaultRoomCode={joinModalDefaultCode}
        onJoinRoom={handleJoinRoom}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        profile={profile}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <TrophyShopModal
        isOpen={shopModalOpen}
        onClose={() => setShopModalOpen(false)}
        profile={profile}
      />

      <DailyQuestsModal
        isOpen={questsModalOpen}
        onClose={() => setQuestsModalOpen(false)}
        profile={profile}
      />

      <MatchmakingModal
        isOpen={matchmakingModalOpen}
        onClose={() => setMatchmakingModalOpen(false)}
        profile={profile}
        onMatchFound={handleMatchFound}
        onFallbackToLocal={handleFallbackToLocal}
      />

      {postMatchRewards && (
        <PostMatchRewardModal
          isOpen={true}
          onClose={() => setPostMatchRewards(null)}
          rewards={postMatchRewards}
          profile={profile}
        />
      )}

      {/* Persistent Non-Intrusive Footer Watermark */}
      <FooterWatermark />
    </div>
  );
}
