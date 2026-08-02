import { useState, useEffect, useCallback, useRef } from 'react';
import { ThreatEvent, AttackType, ThreatAnalysisState, NetworkPacket } from '../types';

interface AttackSignature {
  type: AttackType;
  name: string;
  severity: ThreatEvent['severity'];
  mitreTactic: string;
  indicators: string[];
  description: string;
  weight: number;
}

const ATTACK_SIGNATURES: AttackSignature[] = [
  {
    type: 'sql_injection',
    name: 'SQL Injection',
    severity: 'high',
    mitreTactic: 'Initial Access (T1190)',
    indicators: ["' OR 1=1--", 'UNION SELECT', 'SLEEP(', 'INFORMATION_SCHEMA', "' OR ''='"],
    description: 'Malicious SQL query attempting to bypass authentication or extract data',
    weight: 0.3,
  },
  {
    type: 'xss',
    name: 'Cross-Site Scripting',
    severity: 'high',
    mitreTactic: 'Execution (T1059.007)',
    indicators: ['<script>', 'javascript:', 'onerror=', 'onload=', 'document.cookie'],
    description: 'Injection of malicious scripts into web content',
    weight: 0.25,
  },
  {
    type: 'ddos',
    name: 'DDoS Attack',
    severity: 'critical',
    mitreTactic: 'Network Denial of Service (T1498)',
    indicators: ['SYN flood', 'UDP amplification', 'HTTP flood', 'slowloris', 'volumetric'],
    description: 'Distributed flood targeting service availability',
    weight: 0.4,
  },
  {
    type: 'port_scan',
    name: 'Port Scan',
    severity: 'medium',
    mitreTactic: 'Discovery (T1046)',
    indicators: ['sequential ports', 'SYN without ACK', 'nmap', 'port sweep', 'banner grab'],
    description: 'Systematic probing of network ports for open services',
    weight: 0.15,
  },
  {
    type: 'brute_force',
    name: 'Brute Force',
    severity: 'high',
    mitreTactic: 'Credential Access (T1110)',
    indicators: ['repeated login', 'password spray', 'dictionary attack', 'failed auth', 'rapid retries'],
    description: 'Automated credential guessing against authentication endpoints',
    weight: 0.2,
  },
  {
    type: 'malware_c2',
    name: 'Malware C2 Beacon',
    severity: 'critical',
    mitreTactic: 'Command and Control (T1071)',
    indicators: ['beacon interval', 'DNS tunneling', 'known C2 IP', 'encrypted payload', 'heartbeat'],
    description: 'Compromised host communicating with command and control infrastructure',
    weight: 0.35,
  },
  {
    type: 'data_exfiltration',
    name: 'Data Exfiltration',
    severity: 'critical',
    mitreTactic: 'Exfiltration (T1041)',
    indicators: ['large outbound transfer', 'unusual destination', 'off-hours transfer', 'compressed payload', 'DNS exfil'],
    description: 'Unauthorized bulk data transfer to external destination',
    weight: 0.3,
  },
  {
    type: 'phishing',
    name: 'Phishing Payload',
    severity: 'medium',
    mitreTactic: 'Phishing (T1566)',
    indicators: ['spoofed domain', 'credential harvest', 'malicious link', 'attachment', 'lookalike URL'],
    description: 'Social engineering payload attempting credential capture',
    weight: 0.2,
  },
  {
    type: 'privilege_escalation',
    name: 'Privilege Escalation',
    severity: 'high',
    mitreTactic: 'Privilege Escalation (T1068)',
    indicators: ['sudo abuse', 'kernel exploit', 'setuid binary', 'token impersonation', 'registry modification'],
    description: 'Attempt to gain elevated system privileges',
    weight: 0.25,
  },
  {
    type: 'zero_day',
    name: 'Zero-Day Exploit',
    severity: 'critical',
    mitreTactic: 'Exploitation for Privilege Escalation (T1068)',
    indicators: ['unknown payload', 'novel signature', 'memory corruption', 'RCE chain', 'no CVE match'],
    description: 'Exploitation of previously unknown vulnerability',
    weight: 0.45,
  },
  {
    type: 'reconnaissance',
    name: 'Network Reconnaissance',
    severity: 'low',
    mitreTactic: 'Discovery (T1046)',
    indicators: ['OS fingerprinting', 'service query', 'subnet mapping', 'traceroute', 'SNMP query'],
    description: 'Information gathering to map network topology',
    weight: 0.1,
  },
];

const MALICIOUS_IP_PREFIXES = ['45.227', '193.27', '185.220', '23.129', '171.25', '89.248'];
const INTERNAL_SUBNETS = ['192.168', '10.0', '172.16'];
const PROTOCOLS: ThreatEvent['protocol'][] = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];

function randomIp(prefixes: string[]): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomId(): string {
  return Math.random().toString(36).substr(2, 12);
}

function classifyPacket(): ThreatEvent | null {
  const isAttack = Math.random() < 0.35;
  if (!isAttack) return null;

  const signature = ATTACK_SIGNATURES[Math.floor(Math.random() * ATTACK_SIGNATURES.length)];
  const matchedIndicatorCount = Math.floor(Math.random() * signature.indicators.length) + 1;
  const matchedIndicators = [...signature.indicators]
    .sort(() => Math.random() - 0.5)
    .slice(0, matchedIndicatorCount);

  const baseConfidence = signature.weight * 100;
  const indicatorBoost = (matchedIndicatorCount / signature.indicators.length) * 40;
  const noise = (Math.random() - 0.5) * 15;
  const confidence = Math.max(45, Math.min(99, baseConfidence + indicatorBoost + noise));

  const blocked = confidence > 60 || signature.severity === 'critical';

  return {
    id: randomId(),
    timestamp: Date.now(),
    attackType: signature.type,
    severity: signature.severity,
    confidence: Math.round(confidence),
    sourceIp: randomIp(MALICIOUS_IP_PREFIXES),
    targetIp: randomIp(INTERNAL_SUBNETS),
    protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
    description: signature.description,
    indicators: matchedIndicators,
    blocked,
    mitreTactic: signature.mitreTactic,
    packetSize: Math.floor(Math.random() * 1400) + 64,
  };
}

function computeStats(events: ThreatEvent[]): ThreatAnalysisState['stats'] {
  const recentWindow = Date.now() - 60000;
  const recent = events.filter((e) => e.timestamp >= recentWindow);
  const bySeverity: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  const byAttackType: Record<string, number> = {};

  for (const e of events) {
    bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
    byAttackType[e.attackType] = (byAttackType[e.attackType] || 0) + 1;
  }

  const totalConfidence = events.reduce((sum, e) => sum + e.confidence, 0);

  return {
    totalThreats: events.length,
    blockedThreats: events.filter((e) => e.blocked).length,
    bySeverity,
    byAttackType,
    averageConfidence: events.length > 0 ? Math.round(totalConfidence / events.length) : 0,
    threatsPerMinute: recent.length,
  };
}

function computeTopAttackers(events: ThreatEvent[]) {
  const attackerMap = new Map<string, { ip: string; count: number; lastSeen: number }>();
  for (const e of events) {
    const existing = attackerMap.get(e.sourceIp);
    if (existing) {
      existing.count++;
      existing.lastSeen = Math.max(existing.lastSeen, e.timestamp);
    } else {
      attackerMap.set(e.sourceIp, { ip: e.sourceIp, count: 1, lastSeen: e.timestamp });
    }
  }
  return Array.from(attackerMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function computeAttackTrend(events: ThreatEvent[]) {
  const now = Date.now();
  const buckets: { timestamp: number; count: number; blocked: number }[] = [];
  for (let i = 9; i >= 0; i--) {
    const bucketStart = now - i * 6000;
    const bucketEnd = bucketStart + 6000;
    const inBucket = events.filter((e) => e.timestamp >= bucketStart && e.timestamp < bucketEnd);
    buckets.push({
      timestamp: bucketStart,
      count: inBucket.length,
      blocked: inBucket.filter((e) => e.blocked).length,
    });
  }
  return buckets;
}

export const useThreatAnalysis = () => {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnalysis = useCallback(() => setIsAnalyzing(true), []);
  const stopAnalysis = useCallback(() => setIsAnalyzing(false), []);

  useEffect(() => {
    if (isAnalyzing) {
      intervalRef.current = setInterval(() => {
        const newEvent = classifyPacket();
        if (newEvent) {
          setEvents((prev) => [...prev.slice(-199), newEvent]);
        }
      }, 800);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAnalyzing]);

  const stats = computeStats(events);
  const topAttackers = computeTopAttackers(events);
  const attackTrend = computeAttackTrend(events);

  const clearEvents = useCallback(() => setEvents([]), []);

  return {
    events,
    isAnalyzing,
    stats,
    topAttackers,
    attackTrend,
    startAnalysis,
    stopAnalysis,
    clearEvents,
  };
};

export const getAttackName = (type: AttackType): string => {
  const sig = ATTACK_SIGNATURES.find((s) => s.type === type);
  return sig?.name ?? type;
};

export const getAttackColor = (severity: ThreatEvent['severity']): string => {
  switch (severity) {
    case 'critical':
      return '#EF4444';
    case 'high':
      return '#F97316';
    case 'medium':
      return '#EAB308';
    case 'low':
      return '#22C55E';
    default:
      return '#6B7280';
  }
};

export type { NetworkPacket };
