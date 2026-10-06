/**
 * Party Code generator and validator
 */

const PREFIXES = ['FOOTY', 'GOAL', 'KICK', 'PITCH', 'STRIKE', 'VAR', 'DERBY', 'CHAMP', 'TREBLE', 'BALL'];

export function generatePartyCode(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  if (prefix.length === 6) return prefix;
  // If prefix is 4 or 5 chars, append random digits to make exactly 6 chars
  const remainingLen = 6 - prefix.length;
  let suffix = '';
  for (let i = 0; i < remainingLen; i++) {
    suffix += Math.floor(Math.random() * 9 + 1); // 1-9
  }
  return `${prefix}${suffix}`.toUpperCase();
}

export function sanitizePartyCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

export function getJoinUrl(roomCode: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const path = window.location.pathname;
  return `${origin}${path}?join=${roomCode}`;
}

export function getPeerIdForRoom(roomCode: string): string {
  // Unique deterministic host peer ID for the party code
  return `matchpoint-host-${roomCode.toLowerCase()}`;
}
