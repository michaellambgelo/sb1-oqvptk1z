import React, { useState, useEffect } from 'react';
import { ChatBox } from './components/ChatBox';
import { StreamStats } from './components/StreamStats';
import { GoalBar } from './components/GoalBar';
import { CameraFrame } from './components/CameraFrame';
import { StreamLogo } from './components/StreamLogo';
import { twitchService } from './services/twitch';
import type { ChatMessage, StreamStats as StreamStatsType, Goal } from './types/stream';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<StreamStatsType>({
    followers: 0,
    viewers: 0,
    subscribers: 0
  });
  const [goal, setGoal] = useState<Goal>({
    type: 'followers',
    current: 0,
    target: 2000,
    title: 'Follower Goal'
  });

  useEffect(() => {
    const connectToTwitch = async () => {
      try {
        // These should be provided via environment variables
        const channel = import.meta.env.VITE_TWITCH_CHANNEL;
        const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
        const accessToken = import.meta.env.VITE_TWITCH_ACCESS_TOKEN;

        if (!channel || !clientId || !accessToken) {
          console.error('Missing Twitch credentials');
          return;
        }

        await twitchService.connect(channel, clientId, accessToken);
      } catch (error) {
        console.error('Failed to connect to Twitch:', error);
      }
    };

    connectToTwitch();

    twitchService.on('chat', (message: ChatMessage) => {
      setMessages(prev => [...prev.slice(-19), message]);
    });

    twitchService.on('statsUpdate', (newStats: StreamStatsType) => {
      setStats(newStats);
      // Update goal progress
      setGoal(prev => ({
        ...prev,
        current: newStats.followers
      }));
    });

    return () => {
      twitchService.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative">
      <StreamLogo text="AWESOME STREAM" />
      <StreamStats stats={stats} />
      <GoalBar goal={goal} />
      <div className="absolute inset-0 pointer-events-none">
        <ChatBox messages={messages} position="right" />
        <CameraFrame position="bottom-left" />
      </div>
    </div>
  );
}