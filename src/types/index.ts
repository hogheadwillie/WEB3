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