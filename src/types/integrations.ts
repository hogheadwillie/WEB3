// SIEM Integration Types
export interface SIEMEvent {
  id: string;
  timestamp: number;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  raw_data: any;
  indexed: boolean;
}

export interface ElasticSearchConfig {
  node: string;
  auth?: {
    username: string;
    password: string;
  };
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

export interface SplunkConfig {
  host: string;
  token: string;
  index: string;
  source: string;
  sourcetype: string;
}

// Vulnerability Management Types
export interface VulnerabilityAsset {
  id: string;
  name: string;
  ip_address: string;
  os: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  last_scan: string;
  vulnerabilities: Vulnerability[];
}

export interface Vulnerability {
  id: string;
  cve_id?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss_score: number;
  solution: string;
  references: string[];
  first_found: string;
  last_seen: string;
}

export interface ScanResult {
  id: string;
  asset_id: string;
  scan_type: 'full' | 'quick' | 'compliance';
  status: 'running' | 'completed' | 'failed';
  start_time: string;
  end_time?: string;
  vulnerabilities_found: number;
  progress: number;
}

// Compliance Types
export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  controls: ComplianceControl[];
  overall_score: number;
  last_assessment: string;
}

export interface ComplianceControl {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
  evidence: string[];
  remediation: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

// IAM Integration Types
export interface IdentityProvider {
  id: string;
  name: string;
  type: 'okta' | 'azure-ad' | 'auth0' | 'google';
  status: 'active' | 'inactive' | 'error';
  users_count: number;
  last_sync: string;
  config: any;
}

export interface UserIdentity {
  id: string;
  email: string;
  name: string;
  roles: string[];
  groups: string[];
  last_login: string;
  mfa_enabled: boolean;
  status: 'active' | 'inactive' | 'suspended';
  risk_score: number;
}

// Monitoring & Observability Types
export interface MetricData {
  timestamp: number;
  metric_name: string;
  value: number;
  tags: Record<string, string>;
  source: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  created_at: string;
  updated_at: string;
  source: string;
  tags: string[];
}

// SOAR Types
export interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger_conditions: string[];
  actions: PlaybookAction[];
  status: 'active' | 'inactive' | 'draft';
  execution_count: number;
  success_rate: number;
}

export interface PlaybookAction {
  id: string;
  type: 'email' | 'slack' | 'api_call' | 'script' | 'create_ticket';
  config: any;
  order: number;
  condition?: string;
}

export interface PlaybookExecution {
  id: string;
  playbook_id: string;
  trigger_event: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  start_time: string;
  end_time?: string;
  actions_completed: number;
  total_actions: number;
  logs: string[];
}

// Threat Intelligence Types
export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  confidence: number;
  threat_types: string[];
  first_seen: string;
  last_seen: string;
  source: string;
  tags: string[];
}

export interface ThreatCampaign {
  id: string;
  name: string;
  description: string;
  threat_actor: string;
  tactics: string[];
  techniques: string[];
  indicators: ThreatIndicator[];
  first_seen: string;
  last_activity: string;
  confidence: number;
}

// Container Security Types
export interface ContainerImage {
  id: string;
  name: string;
  tag: string;
  registry: string;
  size: number;
  created: string;
  vulnerabilities: Vulnerability[];
  compliance_issues: string[];
  risk_score: number;
}

export interface KubernetesCluster {
  id: string;
  name: string;
  version: string;
  nodes: number;
  pods: number;
  namespaces: string[];
  security_policies: number;
  last_scan: string;
  risk_score: number;
}

// DevSecOps Types
export interface CodeRepository {
  id: string;
  name: string;
  url: string;
  language: string;
  last_scan: string;
  vulnerabilities: number;
  secrets_found: number;
  quality_score: number;
  compliance_score: number;
}

export interface PipelineScan {
  id: string;
  repository_id: string;
  commit_hash: string;
  branch: string;
  status: 'running' | 'passed' | 'failed' | 'cancelled';
  start_time: string;
  end_time?: string;
  findings: SecurityFinding[];
}

// Communication Integration Types
export interface NotificationChannel {
  id: string;
  type: 'slack' | 'teams' | 'email' | 'webhook' | 'pagerduty';
  name: string;
  config: any;
  status: 'active' | 'inactive' | 'error';
  last_used: string;
}

export interface IncidentEscalation {
  id: string;
  incident_id: string;
  level: number;
  escalated_to: string;
  escalated_at: string;
  reason: string;
  status: 'pending' | 'acknowledged' | 'resolved';
}

// AI/ML Types
export interface MLModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'threat_classification' | 'behavioral_analysis';
  version: string;
  accuracy: number;
  last_trained: string;
  status: 'training' | 'active' | 'deprecated';
  predictions_made: number;
}

export interface AnomalyDetection {
  id: string;
  timestamp: number;
  entity: string;
  anomaly_type: string;
  confidence: number;
  baseline_value: number;
  observed_value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  investigated: boolean;
}

// Zero Trust Types
export interface ZeroTrustPolicy {
  id: string;
  name: string;
  description: string;
  resource_type: 'user' | 'device' | 'application' | 'network';
  conditions: string[];
  actions: string[];
  status: 'active' | 'inactive' | 'testing';
  violations: number;
}

export interface TrustScore {
  entity_id: string;
  entity_type: 'user' | 'device' | 'application';
  score: number;
  factors: TrustFactor[];
  last_updated: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface TrustFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
}

// Quantum Security Types
export interface QuantumThreat {
  id: string;
  type: 'quantum_computer_attack' | 'post_quantum_vulnerability' | 'key_compromise';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  detected_at: string;
  status: 'active' | 'mitigated' | 'false_positive';
}

export interface PostQuantumCrypto {
  algorithm: string;
  key_size: number;
  security_level: number;
  performance_impact: number;
  standardization_status: 'draft' | 'candidate' | 'standard';
  quantum_resistance: boolean;
}
</parameter>