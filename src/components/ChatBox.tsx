import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../types/stream';

interface ChatBoxProps {
  messages: ChatMessage[];
  maxMessages?: number;
  position?: 'left' | 'right';
}

export function ChatBox({ messages, maxMessages = 10, position = 'right' }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`fixed ${position}-4 bottom-4 w-80 rounded-lg bg-gradient-to-b from-blue-900/90 to-blue-800/90 flex flex-col max-h-[500px]`}>
      <div className="flex items-center gap-2 p-4 border-b border-blue-700/50">
        <MessageSquare className="w-5 h-5 text-blue-300" />
        <h3 className="font-bold text-blue-200">Stream Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.slice(-maxMessages).map((msg) => (
          <div 
            key={msg.id} 
            className={`p-2 rounded ${
              msg.isHighlighted 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-2 border-blue-400' 
                : 'bg-blue-950/50'
            }`}
          >
            <span className="font-bold text-blue-300">{msg.username}</span>
            <p className="text-sm text-blue-100 break-words">{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}