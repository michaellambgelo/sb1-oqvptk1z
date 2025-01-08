import React from 'react';

interface StreamLogoProps {
  imageUrl?: string;
  text?: string;
}

export function StreamLogo({ imageUrl, text = 'LIVE' }: StreamLogoProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
      {imageUrl ? (
        <img src={imageUrl} alt="Stream Logo" className="w-10 h-10 rounded-full" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
      )}
      <span className="text-white font-bold text-xl tracking-wider">
        {text}
        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </span>
    </div>
  );
}