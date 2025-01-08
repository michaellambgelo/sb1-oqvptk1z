import React from 'react';

interface CameraFrameProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'left-4 bottom-[calc(4rem+100px)]',  // Position it relative to bottom with space for follower goal
  'bottom-right': 'bottom-4 right-4'
};

export function CameraFrame({ position = 'bottom-right' }: CameraFrameProps) {
  return (
    <div className={`fixed ${positionClasses[position]} w-80 h-60 rounded-lg overflow-hidden border-2 border-blue-500`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
    </div>
  );
}