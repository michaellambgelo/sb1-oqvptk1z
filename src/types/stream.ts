export interface StreamStats {
  followers: number;
  viewers: number;
  subscribers: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  isHighlighted?: boolean;
}

export interface StreamInfo {
  title: string;
  game: string;
  isLive: boolean;
}

export interface Goal {
  type: 'followers' | 'subscribers';
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