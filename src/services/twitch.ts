import { Client } from 'tmi.js';
import { EventEmitter } from '../utils/EventEmitter';
import type { ChatMessage, StreamStats } from '../types/stream';

class TwitchService extends EventEmitter {
  private client: Client;
  private channelName: string = '';
  private clientId: string = '';
  private accessToken: string = '';
  private broadcasterId: string = '';

  constructor() {
    super();
  }

  async connect(channel: string, clientId: string, accessToken: string) {
    this.channelName = channel;
    this.clientId = clientId;
    this.accessToken = accessToken;

    // Get broadcaster ID first
    await this.getBroadcasterId();

    // Initialize TMI client
    this.client = new Client({
      options: { debug: true },
      identity: {
        username: this.channelName,
        password: `oauth:${this.accessToken}`
      },
      channels: [this.channelName]
    });

    // Connect to Twitch
    try {
      await this.client.connect();
      console.log('Connected to Twitch chat');

      // Set up chat message handler
      this.client.on('message', (channel, tags, message, self) => {
        if (self) return; // Ignore messages from the bot

        const chatMessage: ChatMessage = {
          id: tags.id || String(Date.now()),
          username: tags['display-name'] || tags.username || 'Anonymous',
          message,
          isHighlighted: tags['msg-id'] === 'highlighted-message'
        };

        this.emit('chat', chatMessage);
      });

      // Start polling for stream stats
      this.pollStreamStats();
    } catch (error) {
      console.error('Failed to connect to Twitch chat:', error);
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

  private async pollStreamStats() {
    const pollInterval = 60000; // Poll every minute

    const updateStats = async () => {
      try {
        // Get channel information
        const channelResponse = await fetch(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${this.broadcasterId}`,
          {
            headers: {
              'Client-ID': this.clientId,
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        );

        if (!channelResponse.ok) {
          throw new Error(`HTTP error! status: ${channelResponse.status}`);
        }

        const channelData = await channelResponse.json();

        // Get follower count
        const followerResponse = await fetch(
          `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${this.broadcasterId}`,
          {
            headers: {
              'Client-ID': this.clientId,
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        );

        if (!followerResponse.ok) {
          throw new Error(`HTTP error! status: ${followerResponse.status}`);
        }

        const followerData = await followerResponse.json();

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

    // Update immediately and then start polling
    await updateStats();
    setInterval(updateStats, pollInterval);
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}

export const twitchService = new TwitchService();