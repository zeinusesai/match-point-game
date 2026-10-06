/**
 * Types for Online Multiplayer & Party Code Integration
 */

import { Difficulty, Player, TriviaQuestion } from './trivia';

export interface RemotePlayer extends Player {
  peerId?: string;
  isOnline?: boolean;
  isReady?: boolean;
  favoriteClub?: string;
  selectedOption?: string | null; // e.g. "A", "B", "C", "D"
  answeredAtRemainingTime?: number | null; // seconds left when locked in
  isLockedIn?: boolean;
}

export type NetworkMessageType =
  | 'LOBBY_JOIN'
  | 'PLAYER_READY'
  | 'SUBMIT_ANSWER'
  | 'STATE_SYNC'
  | 'TIMER_START'
  | 'TIMER_PAUSE'
  | 'TIMER_TICK'
  | 'TIMER_EXPIRED'
  | 'ANSWER_REVEAL'
  | 'SCORE_UPDATE'
  | 'GAME_START'
  | 'GAME_OVER'
  | 'HOST_KICK';

export interface NetworkMessage {
  type: NetworkMessageType;
  senderId: string;
  senderName?: string;
  timestamp: number;
  payload: any;
}

export interface RoomInfo {
  roomCode: string;
  hostPeerId: string;
  isOnline: boolean;
  joinUrl: string;
}
