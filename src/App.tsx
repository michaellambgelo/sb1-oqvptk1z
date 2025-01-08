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
  const [stats, setStats] = useState<StreamStatsType>(twitchService.getStats());
  const [goal] = useState<Goal>({
    type: 'followers',
    current: 1234,
    target: 2000,
    title: 'Follower Goal'
  });

  useEffect(() => {
    const service = twitchService.connect();

    service.on('chat', (message: ChatMessage) => {
      setMessages(prev => [...prev.slice(-19), message]);
    });

    service.on('statsUpdate', (newStats: StreamStatsType) => {
      setStats(newStats);
    });

    return () => {
      service.removeAllListeners();
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <StreamLogo text="AWESOME STREAM" />
      <StreamStats stats={stats} />
      <GoalBar goal={goal} />
      <ChatBox messages={messages} position="right" />
      <CameraFrame position="bottom-right" />
    </div>
  );
}