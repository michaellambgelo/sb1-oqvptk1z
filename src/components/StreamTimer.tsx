import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface StreamTimerProps {
  position?: 'left' | 'right';
  startTime?: string; // ISO string for custom start time
}

export function StreamTimer({ position = 'left', startTime }: StreamTimerProps) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    // If no start time is provided, use current time
    const start = startTime ? new Date(startTime).getTime() : Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const diff = now - start;
      
      // Handle invalid or future start times
      if (isNaN(diff) || diff < 0) {
        setElapsed('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div
      className="fixed top-5 bg-gradient-to-r from-blue-900/90 to-blue-800/90 px-4 py-2 rounded-lg pointer-events-auto"
      style={{ [position]: '1rem' }}
    >
      <div className="flex items-center gap-2">
        <Timer className="w-5 h-5 text-blue-300" />
        <span className="font-mono text-xl text-blue-200">{elapsed}</span>
      </div>
    </div>
  );
}
