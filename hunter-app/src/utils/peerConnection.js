// ─── Peer Duel Connection ───
// BroadcastChannel for same-device tabs + simulated opponent for demos

const CHANNEL_PREFIX = 'hunter-duel-';

export class PeerDuelConnection {
  constructor(roomCode, onMessage) {
    this.roomCode = roomCode;
    this.onMessage = onMessage;
    this.channel = null;
    this.isHost = false;
    this.connected = false;
    this.playerId = 'player-' + Math.random().toString(36).substring(2, 8);

    this._initChannel();
  }

  _initChannel() {
    try {
      this.channel = new BroadcastChannel(CHANNEL_PREFIX + this.roomCode);
      this.channel.onmessage = (event) => {
        const msg = event.data;
        if (msg.senderId === this.playerId) return; // Ignore own messages
        this.onMessage(msg);
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported, using simulated mode');
    }
  }

  send(type, data = {}) {
    const msg = {
      type,
      data,
      senderId: this.playerId,
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage(msg);
    }
  }

  createRoom() {
    this.isHost = true;
    this.send('room-created', { hostId: this.playerId });
    return this.roomCode;
  }

  joinRoom() {
    this.send('join', { playerId: this.playerId });
  }

  sendAnswer(questionId, answerIdx, timeMs) {
    this.send('answer', { questionId, answerIdx, timeMs });
  }

  sendReady() {
    this.send('ready', { playerId: this.playerId });
  }

  sendHintRequest() {
    this.send('hint-request', { playerId: this.playerId });
  }

  disconnect() {
    if (this.channel) {
      this.channel.close();
    }
  }
}

// Generate a random room code
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Simulated opponent for demo/offline mode
export class SimulatedOpponent {
  constructor(onAction) {
    this.onAction = onAction;
    this.timers = [];
    this.score = 0;
    this.name = 'Hunter Bot 🤖';
  }

  simulateAnswer(questionId, correctIdx, difficulty) {
    // Bot answers with delay based on difficulty
    const baseDelay = difficulty === 1 ? 3000 : 6000;
    const variance = Math.random() * 4000;
    const delay = baseDelay + variance;

    // Bot accuracy varies with difficulty
    const accuracy = difficulty === 1 ? 0.85 : 0.65;
    const isCorrect = Math.random() < accuracy;
    const answerIdx = isCorrect ? correctIdx : (correctIdx + 1 + Math.floor(Math.random() * 3)) % 4;

    const timer = setTimeout(() => {
      if (isCorrect) this.score++;
      this.onAction({
        type: 'answer',
        data: {
          questionId,
          answerIdx,
          timeMs: delay,
          isCorrect,
        },
        senderId: 'bot',
      });
    }, delay);

    this.timers.push(timer);
  }

  simulateTyping() {
    // Send typing indicators at random intervals
    const timer = setTimeout(() => {
      this.onAction({
        type: 'typing',
        senderId: 'bot',
      });
    }, 1000 + Math.random() * 2000);
    this.timers.push(timer);
  }

  cleanup() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }
}
