import React, { useState, useEffect } from 'react';
import { ChatBox } from './components/ChatBox';
import { StreamLogo } from './components/StreamLogo';
import { FollowerGoal } from './components/FollowerGoal';
import { twitchService } from './services/twitch';
import type { ChatMessage, StreamStats } from './types/stream';
import logoImage from './assets/logo.png';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<StreamStats>({
    followers: 0,
    subscribers: 0,
    viewers: 0,
  });

  useEffect(() => {
    const channel = import.meta.env.VITE_TWITCH_CHANNEL;
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const accessToken = import.meta.env.VITE_TWITCH_ACCESS_TOKEN;

    if (!channel || !clientId || !accessToken) {
      console.error('Missing required environment variables');
      return;
    }

    const handleChat = (message: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-49), message]);
    };

    const handleStats = (newStats: StreamStats) => {
      setStats(newStats);
    };

    twitchService
      .connect(channel, clientId, accessToken)
      .catch(console.error);

    twitchService.on('chat', handleChat);
    twitchService.on('statsUpdate', handleStats);

    return () => {
      twitchService.off('chat', handleChat);
      twitchService.off('statsUpdate', handleStats);
      twitchService.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-transparent pointer-events-none">
      <StreamLogo imageUrl={logoImage} />
      <ChatBox messages={messages} />
      <FollowerGoal
        current={stats.followers}
        target={100}
        type="followers"
        title="Follower Goal"
      />
    </div>
  );
}

export default App;