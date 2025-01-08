export interface StreamStats {
  followers: number;
  viewers: number;
  subscribers: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isHighlighted?: boolean;
  badges?: string[];
}

export interface Goal {
  type: 'followers' | 'subscribers' | 'donations';
  current: number;
  target: number;
  title: string;
}

export interface OverlayConfig {
  theme: 'dark' | 'light';
  accentColor: string;
  chatPosition: 'left' | 'right';
  showGoals: boolean;
  showStats: boolean;
}