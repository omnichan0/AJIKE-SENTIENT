export type UserTier = 'JJC' | 'Sultan';

export interface UserProfile {
  id: string;
  email: string;
  tier: UserTier;
  role: 'user' | 'admin';
  credits: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  neuralLoad: number;
  activeNodes: number;
  sovereignResonance: number;
}
