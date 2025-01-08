import { Client } from 'tmi.js';
import { EventEmitter } from '../utils/EventEmitter';
import type { ChatMessage, StreamStats, StreamInfo } from '../types/stream';

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

class TwitchService extends EventEmitter {
  private client: Client | null = null;
  private channelName: string = '';
  private clientId: string = '';
  private accessToken: string = '';
  private broadcasterId: string = '';
  private pollIntervals: NodeJS.Timeout[] = [];
  private emoteCache: Map<string, string> = new Map();

  constructor() {
    super();
  }

  private async retry<T>(
    operation: () => Promise<T>,
    attempts: number = RETRY_ATTEMPTS,
    delay: number = RETRY_DELAY
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempts <= 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retry(operation, attempts - 1, delay * 2);
    }
  }

  async connect(channel: string, clientId: string, accessToken: string) {
    this.channelName = channel;
    this.clientId = clientId;
    this.accessToken = accessToken;

    try {
      // Get broadcaster ID first
      await this.retry(() => this.getBroadcasterId());

      // Initialize TMI client
      this.client = new Client({
        options: { debug: false }, // Set to false to reduce console noise
        identity: {
          username: this.channelName,
          password: `oauth:${this.accessToken}`
        },
        channels: [this.channelName]
      });

      // Connect to Twitch
      await this.client.connect();
      console.log('Connected to Twitch chat');

      // Set up chat message handler
      this.client.on('message', async (channel, tags, message, self) => {
        if (self) return;

        const chatMessage: ChatMessage = {
          id: tags.id || String(Date.now()),
          username: tags['display-name'] || tags.username || 'Anonymous',
          message,
          isHighlighted: tags['msg-id'] === 'highlighted-message'
        };

        this.emit('chat', chatMessage);
      });

      // Start polling for stream info and stats
      this.startPolling();
    } catch (error) {
      console.error('Failed to connect to Twitch:', error);
      throw error;
    }
  }

  private async getBroadcasterId() {
    try {
      const response = await fetch(
        `https://api.twitch.tv/helix/users?login=${this.channelName}`,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error('Channel not found');
      }

      this.broadcasterId = data.data[0].id;
      console.log('Got broadcaster ID:', this.broadcasterId);
    } catch (error) {
      console.error('Failed to get broadcaster ID:', error);
      throw error;
    }
  }

  private async fetchWithAuth(url: string) {
    const response = await fetch(url, {
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private startPolling() {
    // Clear any existing intervals
    this.pollIntervals.forEach(clearInterval);
    this.pollIntervals = [];

    // Poll stream info
    const pollStreamInfo = async () => {
      try {
        const [channelData, streamData] = await Promise.all([
          this.retry(() => this.fetchWithAuth(`https://api.twitch.tv/helix/channels?broadcaster_id=${this.broadcasterId}`)),
          this.retry(() => this.fetchWithAuth(`https://api.twitch.tv/helix/streams?user_id=${this.broadcasterId}`))
        ]);

        const streamInfo: StreamInfo = {
          title: channelData.data[0].title,
          game: channelData.data[0].game_name,
          isLive: streamData.data.length > 0
        };

        this.emit('streamInfo', streamInfo);
      } catch (error) {
        console.error('Failed to fetch stream info:', error);
      }
    };

    // Poll stream stats
    const pollStreamStats = async () => {
      try {
        const [channelData, followerData] = await Promise.all([
          this.retry(() => this.fetchWithAuth(`https://api.twitch.tv/helix/channels?broadcaster_id=${this.broadcasterId}`)),
          this.retry(() => this.fetchWithAuth(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${this.broadcasterId}`))
        ]);

        const stats: StreamStats = {
          followers: followerData.total,
          subscribers: channelData.data[0].subscriber_count || 0,
          viewers: channelData.data[0].viewer_count || 0
        };

        this.emit('statsUpdate', stats);
      } catch (error) {
        console.error('Failed to fetch stream stats:', error);
      }
    };

    // Initial calls
    pollStreamInfo().catch(console.error);
    pollStreamStats().catch(console.error);

    // Set up polling intervals
    this.pollIntervals.push(
      setInterval(() => pollStreamInfo().catch(console.error), 60000),
      setInterval(() => pollStreamStats().catch(console.error), 60000)
    );
  }

  disconnect() {
    // Clear polling intervals
    this.pollIntervals.forEach(clearInterval);
    this.pollIntervals = [];

    // Disconnect TMI client
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}

export const twitchService = new TwitchService();