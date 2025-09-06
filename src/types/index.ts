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

export interface SecurityTest {
  id: string;
  name: string;
  type: 'penetration' | 'vulnerability' | 'load' | 'ddos' | 'injection' | 'xss';
  status: 'running' | 'completed' | 'failed' | 'queued';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: number;
  duration: number;
  progress: number;
  findings: SecurityFinding[];
  target: string;
}

export interface SecurityFinding {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  cve?: string;
  cvss?: number;
}

export interface StressTestMetrics {
  timestamp: number;
  concurrentUsers: number;
  requestsPerSecond: number;
  responseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  networkThroughput: number;
}

export interface VulnerabilityReport {
  id: string;
  timestamp: number;
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  riskScore: number;
  complianceStatus: 'compliant' | 'non-compliant' | 'partial';
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