import React, { useEffect, useState } from 'react';
import { twitchService } from '../services/twitch';
import type { StreamInfo } from '../types/stream';

interface StreamLogoProps {
  imageUrl?: string;
}

export function StreamLogo({ imageUrl }: StreamLogoProps) {
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);

  useEffect(() => {
    const handleStreamInfo = (info: StreamInfo) => {
      setStreamInfo(info);
    };

    twitchService.on('streamInfo', handleStreamInfo);

    return () => {
      twitchService.off('streamInfo', handleStreamInfo);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/30 p-3 rounded-lg backdrop-blur-sm">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Stream Logo" 
          className="w-12 h-12 rounded-lg object-cover shadow-lg"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse shadow-lg" />
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl tracking-wider">
            {streamInfo?.isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          <span className={`inline-block w-2 h-2 rounded-full ${streamInfo?.isLive ? 'bg-red-500' : 'bg-gray-500'} animate-pulse shadow`} />
        </div>
        {streamInfo?.title && (
          <span className="text-white text-sm opacity-80 max-w-[300px] truncate">
            {streamInfo.title}
          </span>
        )}
        {streamInfo?.game && (
          <span className="text-white/60 text-xs">
            Playing {streamInfo.game}
          </span>
        )}
      </div>
    </div>
  );
}