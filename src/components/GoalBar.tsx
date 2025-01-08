import React from 'react';
import type { Goal } from '../types/stream';

interface GoalBarProps {
  goal: Goal;
}

export function GoalBar({ goal }: GoalBarProps) {
  const progress = (goal.current / goal.target) * 100;
  
  return (
    <div className="fixed top-20 right-4 w-64 rounded-lg p-4 bg-gradient-to-b from-blue-900/90 to-blue-800/90 text-white">
      <h3 className="font-bold mb-2 text-blue-200">{goal.title}</h3>
      <div className="w-full h-4 bg-blue-950/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 transition-all duration-1000"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-sm text-blue-300">
        <span>{goal.current}</span>
        <span>{goal.target}</span>
      </div>
    </div>
  );
}