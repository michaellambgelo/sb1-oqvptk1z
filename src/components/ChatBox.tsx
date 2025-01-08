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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className="bg-gradient-to-b from-blue-900/90 to-blue-800/90 fixed w-80 pointer-events-auto" 
      style={{ 
        [position]: '1rem',
        bottom: cameraVisible ? 'calc(16rem + 5rem)' : '5rem' // Position above camera when visible, with some spacing
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
            className={`p-3 ${
              msg.isHighlighted 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-2 border-blue-400' 
                : 'bg-blue-950/50'
            }`}
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