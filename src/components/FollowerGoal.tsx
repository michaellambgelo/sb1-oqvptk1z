import React from 'react';

interface FollowerGoalProps {
  current: number;
  target: number;
  type: 'followers' | 'subscribers';
  title: string;
}

export function FollowerGoal({ current, target, type, title }: FollowerGoalProps) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div className="fixed bottom-4 left-4 w-64 bg-black/50 rounded-lg p-4">
      <div className="flex justify-between text-white mb-2">
        <span className="font-medium">{title}</span>
        <span className="font-bold">
          {current}/{target}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
