import React from 'react';
import { Users, Heart, Star } from 'lucide-react';
import type { StreamStats } from '../types/stream';

interface StreamStatsProps {
  stats: StreamStats;
}

export function StreamStats({ stats }: StreamStatsProps) {
  return (
    <div className="fixed top-20 left-4 flex flex-col gap-2">
      <StatCard icon={<Users className="text-blue-400" />} value={stats.viewers} label="Viewers" />
      <StatCard icon={<Heart className="text-blue-400" />} value={stats.followers} label="Followers" />
      <StatCard icon={<Star className="text-blue-400" />} value={stats.subscribers} label="Subscribers" />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 text-white rounded-lg p-3 flex items-center gap-2">
      {icon}
      <div>
        <p className="font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-blue-300">{label}</p>
      </div>
    </div>
  );
}