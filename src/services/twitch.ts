import { EventEmitter } from '../utils/EventEmitter';
import type { ChatMessage, StreamStats } from '../types/stream';

// Mock Twitch service
class TwitchService extends EventEmitter {
  private mockStats: StreamStats = {
    followers: 1234,
    viewers: 567,
    subscribers: 89
  };

  constructor() {
    super();
    this.simulateViewerChanges();
    this.simulateChat();
  }

  private simulateViewerChanges() {
    setInterval(() => {
      this.mockStats.viewers += Math.floor(Math.random() * 11) - 5; // -5 to +5
      this.emit('statsUpdate', this.mockStats);
    }, 5000);
  }

  private simulateChat() {
    const mockUsers = ['TwitchUser123', 'GameFan99', 'StreamLover', 'CoolViewer'];
    const mockMessages = [
      'Great stream!',
      'Love the content! 👍',
      'Amazing play!',
      'Keep it up! 🎮',
      'Hello everyone!'
    ];

    setInterval(() => {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
        timestamp: new Date(),
        isHighlighted: Math.random() > 0.8
      };
      this.emit('chat', message);
    }, 3000);
  }

  connect() {
    console.log('Connected to Twitch mock service');
    return this;
  }

  getStats() {
    return this.mockStats;
  }
}

export const twitchService = new TwitchService();