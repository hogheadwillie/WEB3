export interface NetworkPacket {
  id: string;
  timestamp: number;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
  size: number;
  threatLevel: 'low' | 'medium' | 'high';
  encrypted: boolean;
}

export interface QuantumKey {
  id: string;
  bits: string;
  basis: ('rectilinear' | 'diagonal')[];
  timestamp: number;
  fidelity: number;
}

export interface SecurityMetric {
  timestamp: number;
  threatsBlocked: number;
  packetsAnalyzed: number;
  encryptionStrength: number;
  quantumEntropy: number;
}

export interface User {
  id: string;
  address?: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: number;
}

export interface MainframeConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastHeartbeat: number;
  cpu: number;
  memory: number;
  storage: number;
  activeJobs: number;
  region: string;
  version: string;
}

export interface CloudflareMetrics {
  timestamp: number;
  requests: number;
  bandwidth: number;
  threats: number;
  cacheHitRatio: number;
  responseTime: number;
  uniqueVisitors: number;
  countries: string[];
}

export interface MainframeJob {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  priority: number;
  startTime: number;
  duration: number;
  cpu: number;
  memory: number;
}