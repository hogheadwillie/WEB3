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

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  category: 'malware' | 'phishing' | 'ddos' | 'breach' | 'vulnerability' | 'unauthorized_access' | 'data_leak' | 'system_failure' | 'other';
  source?: string;
  affected_systems: string[];
  assigned_to?: string;
  reported_by: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
  impact_assessment?: string;
  mitigation_steps: string[];
  evidence_urls: string[];
  tags: string[];
}

export interface IncidentComment {
  id: string;
  incident_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  user_email?: string;
}

export interface IncidentAttachment {
  id: string;
  incident_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface IncidentStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}