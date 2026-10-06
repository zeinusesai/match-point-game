/**
 * WebRTC Peer-to-Peer Network Engine using PeerJS
 * Supports Host room broadcasting and Client mobile device synchronization.
 */

import Peer, { DataConnection } from 'peerjs';
import { NetworkMessage } from '../types/multiplayer';
import { getPeerIdForRoom } from './roomCode';

export type MessageHandler = (msg: NetworkMessage, conn?: DataConnection) => void;

class PeerNetwork {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConnection: DataConnection | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private isHost: boolean = false;
  private currentRoomCode: string = '';

  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  private dispatchMessage(msg: NetworkMessage, conn?: DataConnection) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(msg, conn);
      } catch (err) {
        console.error('Error handling peer message:', err);
      }
    });
  }

  /**
   * Initialize Host Peer with designated Party Code
   */
  public async initHost(roomCode: string): Promise<string> {
    this.destroy();
    this.isHost = true;
    this.currentRoomCode = roomCode;

    // Initialize BroadcastChannel as local backup
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(`matchpoint_online_${roomCode.toLowerCase()}`);
      this.broadcastChannel.onmessage = (event) => {
        const msg = event.data as NetworkMessage;
        if (msg && msg.type) {
          this.dispatchMessage(msg);
        }
      };
    }

    const hostPeerId = getPeerIdForRoom(roomCode);

    return new Promise((resolve, reject) => {
      try {
        const peer = new Peer(hostPeerId, {
          debug: 1,
        });

        this.peer = peer;

        peer.on('open', (id) => {
          resolve(id);
        });

        peer.on('connection', (conn) => {
          this.setupHostConnection(conn);
        });

        peer.on('error', (err: any) => {
          console.warn('Peer error (host):', err);
          // If ID is already taken (e.g. host refreshed), try fallback
          if (err?.type === 'unavailable-id') {
            const fallbackPeer = new Peer('', { debug: 1 });
            this.peer = fallbackPeer;
            fallbackPeer.on('open', (fbId) => {
              resolve(fbId);
            });
            fallbackPeer.on('connection', (conn) => {
              this.setupHostConnection(conn);
            });
          } else {
            resolve(hostPeerId);
          }
        });
      } catch (e) {
        console.error('Failed to init host peer:', e);
        resolve(hostPeerId);
      }
    });
  }

  private setupHostConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data) => {
      const msg = data as NetworkMessage;
      if (msg && msg.type) {
        this.dispatchMessage(msg, conn);
      }
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });

    conn.on('error', () => {
      this.connections.delete(conn.peer);
    });
  }

  /**
   * Broadcast message to all connected player clients
   */
  public broadcast(type: NetworkMessage['type'], payload: any, senderId: string = 'host') {
    const msg: NetworkMessage = {
      type,
      senderId,
      timestamp: Date.now(),
      payload,
    };

    // Broadcast over all WebRTC peer connections
    this.connections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch (err) {
          console.error('Failed to send to peer:', conn.peer, err);
        }
      }
    });

    // Also broadcast to local BroadcastChannel for tab/local clients
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch {}
    }
  }

  /**
   * Initialize Client Node and connect to Host Room
   */
  public async initClient(roomCode: string, onConnected?: () => void, onError?: (err: any) => void): Promise<void> {
    this.destroy();
    this.isHost = false;
    this.currentRoomCode = roomCode;

    // Initialize BroadcastChannel as local backup
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(`matchpoint_online_${roomCode.toLowerCase()}`);
      this.broadcastChannel.onmessage = (event) => {
        const msg = event.data as NetworkMessage;
        if (msg && msg.type) {
          this.dispatchMessage(msg);
        }
      };
    }

    const hostPeerId = getPeerIdForRoom(roomCode);

    return new Promise((resolve) => {
      try {
        const peer = new Peer('', { debug: 1 });
        this.peer = peer;

        peer.on('open', () => {
          this.connectToHost(hostPeerId, onConnected, onError);
          resolve();
        });

        peer.on('error', (err) => {
          console.warn('Client peer error:', err);
          if (onError) onError(err);
          resolve();
        });
      } catch (err) {
        console.error('Failed to start client peer:', err);
        if (onError) onError(err);
        resolve();
      }
    });
  }

  private connectToHost(hostPeerId: string, onConnected?: () => void, onError?: (err: any) => void) {
    if (!this.peer) return;

    try {
      const conn = this.peer.connect(hostPeerId, { reliable: true });
      this.hostConnection = conn;

      conn.on('open', () => {
        if (onConnected) onConnected();
      });

      conn.on('data', (data) => {
        const msg = data as NetworkMessage;
        if (msg && msg.type) {
          this.dispatchMessage(msg, conn);
        }
      });

      conn.on('close', () => {
        this.hostConnection = null;
      });

      conn.on('error', (err) => {
        if (onError) onError(err);
      });
    } catch (e) {
      if (onError) onError(e);
    }
  }

  /**
   * Send message from Client to Host
   */
  public sendToHost(type: NetworkMessage['type'], payload: any, senderId: string, senderName?: string) {
    const msg: NetworkMessage = {
      type,
      senderId,
      senderName,
      timestamp: Date.now(),
      payload,
    };

    if (this.hostConnection && this.hostConnection.open) {
      try {
        this.hostConnection.send(msg);
      } catch (err) {
        console.error('Failed to send to host:', err);
      }
    }

    // Backup via BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch {}
    }
  }

  public getConnectedPeersCount(): number {
    let count = 0;
    this.connections.forEach((conn) => {
      if (conn.open) count++;
    });
    return count;
  }

  public isConnectedToHost(): boolean {
    return this.hostConnection !== null && this.hostConnection.open;
  }

  public destroy() {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();

    if (this.hostConnection) {
      this.hostConnection.close();
      this.hostConnection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    this.isHost = false;
    this.currentRoomCode = '';
  }
}

export const peerNetwork = new PeerNetwork();
