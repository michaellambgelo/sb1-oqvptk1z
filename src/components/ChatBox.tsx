import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../types/stream';

interface ChatBoxProps {
  messages: ChatMessage[];
  maxMessages?: number;
  position?: 'left' | 'right';
  cameraVisible?: boolean;
}

export function ChatBox({ messages, maxMessages = 10, position = 'right', cameraVisible = true }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentTime = new Date('2025-01-13T09:54:52-06:00').getTime();

  const getMessageOpacity = (timestamp: string) => {
    const messageTime = new Date(timestamp).getTime();
    const ageInSeconds = (currentTime - messageTime) / 1000;
    if (ageInSeconds >= 30) return 0;
    if (ageInSeconds >= 25) return 0.2;
    if (ageInSeconds >= 20) return 0.4;
    if (ageInSeconds >= 15) return 0.6;
    if (ageInSeconds >= 10) return 0.8;
    return 1;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className="bg-gradient-to-b from-blue-900/90 to-blue-800/90 fixed w-80 pointer-events-auto" 
      style={{ 
        [position]: '1rem',
        bottom: cameraVisible ? 'calc(16rem + 5rem)' : '5rem'
      }}
    >
      <div className="flex items-center gap-2 p-4 border-b border-blue-700/50">
        <MessageSquare className="w-5 h-5 text-blue-300" />
        <h3 className="font-bold text-blue-200">Stream Chat</h3>
      </div>
      <div className="overflow-y-auto p-4 space-y-4 max-h-[300px]">
        {messages.slice(-maxMessages).map((msg) => (
          <div 
            key={msg.id} 
            className={`p-3 transition-opacity duration-1000 ${
              msg.isHighlighted 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-2 border-blue-400' 
                : 'bg-blue-950/50'
            }`}
            style={{
              opacity: getMessageOpacity(msg.timestamp)
            }}
          >
            <span className="font-bold text-blue-300 block mb-1">{msg.username}</span>
            <p className="text-sm text-blue-100 break-words">{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}