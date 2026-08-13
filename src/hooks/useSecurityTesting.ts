import { useState, useEffect, useCallback, useRef } from 'react';
import { SecurityTest, SecurityFinding, StressTestMetrics, VulnerabilityReport } from '../types';

function generateId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(36).padStart(2, '0')).join('');
}

export const useSecurityTesting = () => {
  const [activeTests, setActiveTests] = useState<SecurityTest[]>([]);
  const [stressMetrics, setStressMetrics] = useState<StressTestMetrics[]>([]);
  const [vulnerabilityReport, setVulnerabilityReport] = useState<VulnerabilityReport | null>(null);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [testResults, setTestResults] = useState<SecurityTest[]>([]);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const generateSecurityFinding = useCallback((): SecurityFinding => {
    const findings = [
      { type: 'SQL Injection', description: 'Potential SQL injection vulnerability in login form', recommendation: 'Use parameterized queries and input validation', cve: 'CVE-2023-1234', cvss: 8.5 },
      { type: 'XSS Vulnerability', description: 'Cross-site scripting vulnerability in user input fields', recommendation: 'Implement proper input sanitization and CSP headers', cve: 'CVE-2023-5678', cvss: 6.1 },
      { type: 'Weak Authentication', description: 'Password policy does not meet security standards', recommendation: 'Implement stronger password requirements and MFA', cvss: 5.3 },
      { type: 'Insecure Headers', description: 'Missing security headers in HTTP responses', recommendation: 'Add X-Frame-Options, X-XSS-Protection, and CSP headers', cvss: 4.3 },
      { type: 'Outdated Dependencies', description: 'Application uses outdated libraries with known vulnerabilities', recommendation: 'Update all dependencies to latest secure versions', cvss: 7.2 }
    ];

    const finding = findings[Math.floor(Math.random() * findings.length)];
    const severities: SecurityFinding['severity'][] = ['low', 'medium', 'high', 'critical'];

    return {
      id: generateId(),
      type: finding.type,
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: finding.description,
      recommendation: finding.recommendation,
      cve: finding.cve,
      cvss: finding.cvss
    };
  }, []);

  const startSecurityTest = useCallback((testType: SecurityTest['type'], target: string) => {
    const testNames = {
      penetration: 'Penetration Test',
      vulnerability: 'Vulnerability Scan',
      load: 'Load Test',
      ddos: 'DDoS Simulation',
      injection: 'SQL Injection Test',
      xss: 'XSS Vulnerability Test'
    };

    const testId = generateId();
    const newTest: SecurityTest = {
      id: testId,
      name: testNames[testType],
      type: testType,
      status: 'running',
      severity: 'medium',
      startTime: Date.now(),
      duration: 0,
      progress: 0,
      findings: [],
      target
    };

    setActiveTests(prev => [...prev, newTest]);

    const interval = setInterval(() => {
      setActiveTests(prev => {
        const test = prev.find(t => t.id === testId);
        if (!test) return prev;

        const newProgress = Math.min(test.progress + Math.random() * 15, 100);
        const newFindings = [...test.findings];

        if (Math.random() > 0.7 && newFindings.length < 5) {
          newFindings.push(generateSecurityFinding());
        }

        const isComplete = newProgress >= 100;
        const updatedTest: SecurityTest = {
          ...test,
          progress: newProgress,
          duration: Date.now() - test.startTime,
          findings: newFindings,
          status: isComplete ? 'completed' : 'running',
          severity: newFindings.some(f => f.severity === 'critical') ? 'critical' :
                    newFindings.some(f => f.severity === 'high') ? 'high' : 'medium'
        };

        if (isComplete) {
          clearInterval(interval);
          intervalsRef.current.delete(testId);
          setTestResults(prevResults => [...prevResults, { ...updatedTest, progress: 100 }]);
          return prev.filter(t => t.id !== testId);
        }

        return prev.map(t => t.id === testId ? updatedTest : t);
      });
    }, 1000);

    intervalsRef.current.set(testId, interval);
    return testId;
  }, [generateSecurityFinding]);

  const startStressTest = useCallback(() => {
    setIsStressTesting(true);
    setStressMetrics([]);
  }, []);

  const stopStressTest = useCallback(() => {
    setIsStressTesting(false);
  }, []);

  const generateVulnerabilityReport = useCallback(() => {
    const criticalCount = Math.floor(Math.random() * 3);
    const highCount = Math.floor(Math.random() * 8) + 2;
    const mediumCount = Math.floor(Math.random() * 15) + 5;
    const lowCount = Math.floor(Math.random() * 20) + 10;
    const totalVulnerabilities = criticalCount + highCount + mediumCount + lowCount;
    const riskScore = Math.min(100, (criticalCount * 10 + highCount * 7 + mediumCount * 4 + lowCount * 1));

    const report: VulnerabilityReport = {
      id: generateId(),
      timestamp: Date.now(),
      totalVulnerabilities,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      riskScore,
      complianceStatus: riskScore < 30 ? 'compliant' : riskScore < 70 ? 'partial' : 'non-compliant'
    };

    setVulnerabilityReport(report);
  }, []);

  useEffect(() => {
    if (isStressTesting) {
      const interval = setInterval(() => {
        const newMetric: StressTestMetrics = {
          timestamp: Date.now(),
          concurrentUsers: Math.floor(Math.random() * 1000) + 100,
          requestsPerSecond: Math.floor(Math.random() * 5000) + 500,
          responseTime: Math.random() * 2000 + 100,
          errorRate: Math.random() * 5,
          cpuUsage: Math.random() * 100,
          memoryUsage: Math.random() * 100,
          networkThroughput: Math.random() * 1000 + 100
        };

        setStressMetrics(prev => [...prev.slice(-19), newMetric]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isStressTesting]);

  useEffect(() => {
    generateVulnerabilityReport();
  }, [generateVulnerabilityReport]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval));
      intervalsRef.current.clear();
    };
  }, []);

  return {
    activeTests,
    stressMetrics,
    vulnerabilityReport,
    isStressTesting,
    testResults,
    startSecurityTest,
    startStressTest,
    stopStressTest,
    generateVulnerabilityReport
  };
};
