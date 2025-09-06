import { ComplianceFramework, ComplianceControl } from '../types/integrations';

export class ComplianceManager {
  private frameworks: ComplianceFramework[] = [];

  constructor() {
    this.initializeFrameworks();
  }

  private initializeFrameworks() {
    // SOC 2 Type II Framework
    const soc2Controls: ComplianceControl[] = [
      {
        id: 'CC1.1',
        title: 'Control Environment - Integrity and Ethical Values',
        description: 'The entity demonstrates a commitment to integrity and ethical values.',
        status: 'compliant',
        evidence: ['Code of conduct', 'Ethics training records', 'Policy documentation'],
        remediation: 'Continue regular ethics training and policy updates',
        risk_level: 'low'
      },
      {
        id: 'CC2.1',
        title: 'Communication and Information - Internal Communication',
        description: 'The entity obtains or generates and uses relevant, quality information.',
        status: 'partial',
        evidence: ['Communication policies', 'Information management procedures'],
        remediation: 'Implement formal information classification system',
        risk_level: 'medium'
      },
      {
        id: 'CC6.1',
        title: 'Logical and Physical Access Controls',
        description: 'The entity implements logical access security software and infrastructure.',
        status: 'non-compliant',
        evidence: [],
        remediation: 'Implement multi-factor authentication and access reviews',
        risk_level: 'high'
      }
    ];

    // ISO 27001 Framework
    const iso27001Controls: ComplianceControl[] = [
      {
        id: 'A.5.1.1',
        title: 'Information Security Policy',
        description: 'A set of policies for information security shall be defined.',
        status: 'compliant',
        evidence: ['Information security policy document', 'Board approval records'],
        remediation: 'Annual policy review scheduled',
        risk_level: 'low'
      },
      {
        id: 'A.9.1.1',
        title: 'Access Control Policy',
        description: 'An access control policy shall be established and reviewed.',
        status: 'partial',
        evidence: ['Access control policy', 'User access reviews'],
        remediation: 'Implement automated access provisioning',
        risk_level: 'medium'
      },
      {
        id: 'A.12.6.1',
        title: 'Management of Technical Vulnerabilities',
        description: 'Information about technical vulnerabilities shall be obtained.',
        status: 'compliant',
        evidence: ['Vulnerability scanning reports', 'Patch management records'],
        remediation: 'Continue regular vulnerability assessments',
        risk_level: 'low'
      }
    ];

    // NIST Cybersecurity Framework
    const nistControls: ComplianceControl[] = [
      {
        id: 'ID.AM-1',
        title: 'Asset Management',
        description: 'Physical devices and systems within the organization are inventoried.',
        status: 'compliant',
        evidence: ['Asset inventory database', 'Asset management procedures'],
        remediation: 'Quarterly asset inventory updates',
        risk_level: 'low'
      },
      {
        id: 'PR.AC-1',
        title: 'Access Control',
        description: 'Identities and credentials are issued, managed, verified, revoked.',
        status: 'partial',
        evidence: ['Identity management system', 'Access control procedures'],
        remediation: 'Implement privileged access management',
        risk_level: 'medium'
      },
      {
        id: 'DE.CM-1',
        title: 'Detection Processes',
        description: 'The network is monitored to detect potential cybersecurity events.',
        status: 'compliant',
        evidence: ['Network monitoring tools', 'SIEM implementation'],
        remediation: 'Enhance threat detection capabilities',
        risk_level: 'low'
      }
    ];

    this.frameworks = [
      {
        id: 'soc2-type2',
        name: 'SOC 2 Type II',
        version: '2017',
        controls: soc2Controls,
        overall_score: this.calculateOverallScore(soc2Controls),
        last_assessment: '2024-01-15T00:00:00Z'
      },
      {
        id: 'iso27001',
        name: 'ISO 27001:2013',
        version: '2013',
        controls: iso27001Controls,
        overall_score: this.calculateOverallScore(iso27001Controls),
        last_assessment: '2024-01-10T00:00:00Z'
      },
      {
        id: 'nist-csf',
        name: 'NIST Cybersecurity Framework',
        version: '1.1',
        controls: nistControls,
        overall_score: this.calculateOverallScore(nistControls),
        last_assessment: '2024-01-20T00:00:00Z'
      }
    ];
  }

  private calculateOverallScore(controls: ComplianceControl[]): number {
    const weights = { compliant: 100, partial: 50, 'non-compliant': 0, 'not-assessed': 0 };
    const totalScore = controls.reduce((sum, control) => sum + weights[control.status], 0);
    return Math.round(totalScore / controls.length);
  }

  async getFrameworks(): Promise<ComplianceFramework[]> {
    return this.frameworks;
  }

  async getFramework(id: string): Promise<ComplianceFramework | null> {
    return this.frameworks.find(f => f.id === id) || null;
  }

  async updateControlStatus(
    frameworkId: string, 
    controlId: string, 
    status: ComplianceControl['status'],
    evidence?: string[]
  ): Promise<boolean> {
    const framework = this.frameworks.find(f => f.id === frameworkId);
    if (!framework) return false;

    const control = framework.controls.find(c => c.id === controlId);
    if (!control) return false;

    control.status = status;
    if (evidence) {
      control.evidence = evidence;
    }

    // Recalculate overall score
    framework.overall_score = this.calculateOverallScore(framework.controls);
    framework.last_assessment = new Date().toISOString();

    return true;
  }

  async generateComplianceReport(frameworkId: string): Promise<any> {
    const framework = await this.getFramework(frameworkId);
    if (!framework) return null;

    const controlsByStatus = framework.controls.reduce((acc, control) => {
      acc[control.status] = (acc[control.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const controlsByRisk = framework.controls.reduce((acc, control) => {
      acc[control.risk_level] = (acc[control.risk_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const nonCompliantControls = framework.controls.filter(c => 
      c.status === 'non-compliant' || c.status === 'partial'
    );

    return {
      framework_name: framework.name,
      version: framework.version,
      overall_score: framework.overall_score,
      last_assessment: framework.last_assessment,
      total_controls: framework.controls.length,
      controls_by_status: controlsByStatus,
      controls_by_risk: controlsByRisk,
      non_compliant_controls: nonCompliantControls.length,
      high_risk_controls: framework.controls.filter(c => c.risk_level === 'high' || c.risk_level === 'critical').length,
      recommendations: this.generateRecommendations(framework),
      next_assessment_due: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private generateRecommendations(framework: ComplianceFramework): string[] {
    const recommendations: string[] = [];
    
    const nonCompliant = framework.controls.filter(c => c.status === 'non-compliant');
    const partial = framework.controls.filter(c => c.status === 'partial');
    const highRisk = framework.controls.filter(c => c.risk_level === 'high' || c.risk_level === 'critical');

    if (nonCompliant.length > 0) {
      recommendations.push(`Address ${nonCompliant.length} non-compliant controls immediately`);
    }

    if (partial.length > 0) {
      recommendations.push(`Complete implementation of ${partial.length} partially compliant controls`);
    }

    if (highRisk.length > 0) {
      recommendations.push(`Prioritize ${highRisk.length} high-risk controls for immediate attention`);
    }

    if (framework.overall_score < 70) {
      recommendations.push('Overall compliance score is below acceptable threshold - implement comprehensive remediation plan');
    }

    recommendations.push('Schedule regular compliance assessments and control testing');
    recommendations.push('Implement continuous monitoring for critical controls');

    return recommendations;
  }

  async getComplianceGaps(): Promise<any[]> {
    const gaps = [];

    for (const framework of this.frameworks) {
      const nonCompliantControls = framework.controls.filter(c => 
        c.status === 'non-compliant' || c.status === 'partial'
      );

      for (const control of nonCompliantControls) {
        gaps.push({
          framework: framework.name,
          control_id: control.id,
          control_title: control.title,
          status: control.status,
          risk_level: control.risk_level,
          remediation: control.remediation,
          priority: this.calculatePriority(control.status, control.risk_level)
        });
      }
    }

    return gaps.sort((a, b) => b.priority - a.priority);
  }

  private calculatePriority(status: string, riskLevel: string): number {
    const statusWeight = { 'non-compliant': 10, 'partial': 5, 'compliant': 0, 'not-assessed': 3 };
    const riskWeight = { 'critical': 10, 'high': 7, 'medium': 4, 'low': 1 };
    
    return (statusWeight[status as keyof typeof statusWeight] || 0) + 
           (riskWeight[riskLevel as keyof typeof riskWeight] || 0);
  }
}

export const complianceManager = new ComplianceManager();
</parameter>