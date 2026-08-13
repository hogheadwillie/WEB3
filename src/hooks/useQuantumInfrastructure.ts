import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface InfrastructureLayer {
  id: string;
  layer_name: string;
  layer_level: number;
  quantum_risk_score: number;
  pqc_ready: boolean;
  description: string;
  vulnerabilities_count: number;
  mitigations_deployed: number;
  metadata: Record<string, unknown>;
}

interface QuantumThreat {
  id: string;
  threat_category: string;
  threat_name: string;
  threat_description: string;
  quantum_algorithm: string | null;
  severity: string;
  likelihood: string;
  impact_score: number;
  cvss_score: number | null;
  mitigation_status: string;
  metadata: Record<string, unknown>;
}

interface PQCAlgorithm {
  id: string;
  algorithm_name: string;
  algorithm_type: string;
  nist_status: string;
  cnsa_20_approved: boolean;
  deployment_status: string;
  key_size: number;
  security_level: number;
  performance_score: number;
  use_cases: string[];
  metadata: Record<string, unknown>;
}

interface Vulnerability {
  id: string;
  vulnerability_id: string;
  vulnerability_name: string;
  vulnerability_description: string;
  cve_id: string | null;
  quantum_vulnerable: boolean;
  affected_cryptography: string[];
  cvss_score: number | null;
  severity: string;
  remediation_status: string;
  remediation_deadline: string | null;
  pqc_solution: string | null;
  metadata: Record<string, unknown>;
}

interface ComplianceFramework {
  id: string;
  framework_name: string;
  framework_version: string;
  authority: string;
  compliance_score: number;
  required_controls: number;
  implemented_controls: number;
  certification_date: string | null;
  expiration_date: string | null;
  status: string;
  metadata: Record<string, unknown>;
}

interface ThreatIntelligence {
  id: string;
  threat_id: string;
  source: string;
  threat_type: string;
  severity: string;
  ioc_type: string | null;
  ioc_value: string | null;
  quantum_related: boolean;
  affected_layers: string[];
  first_seen: string;
  last_seen: string;
  confidence_score: number;
  actionable: boolean;
  metadata: Record<string, unknown>;
}

export const useQuantumInfrastructure = () => {
  const [infrastructureLayers, setInfrastructureLayers] = useState<InfrastructureLayer[]>([]);
  const [quantumThreats, setQuantumThreats] = useState<QuantumThreat[]>([]);
  const [pqcAlgorithms, setPqcAlgorithms] = useState<PQCAlgorithm[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [threatIntelligence, setThreatIntelligence] = useState<ThreatIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInfrastructureLayers = useCallback(async () => {
    const { data, error } = await supabase
      .from('infrastructure_layers')
      .select('*')
      .order('layer_level', { ascending: true });

    if (error) {
      console.error('Error loading infrastructure layers:', error);
    } else {
      setInfrastructureLayers(data || []);
    }
  }, []);

  const loadQuantumThreats = useCallback(async () => {
    const { data, error } = await supabase
      .from('quantum_threats')
      .select('*')
      .order('severity', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading quantum threats:', error);
    } else {
      setQuantumThreats(data || []);
    }
  }, []);

  const loadPQCAlgorithms = useCallback(async () => {
    const { data, error } = await supabase
      .from('pqc_algorithms')
      .select('*')
      .order('nist_status', { ascending: false });

    if (error) {
      console.error('Error loading PQC algorithms:', error);
    } else {
      setPqcAlgorithms(data || []);
    }
  }, []);

  const loadVulnerabilities = useCallback(async () => {
    const { data, error } = await supabase
      .from('vulnerability_assessments')
      .select('*')
      .order('cvss_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading vulnerabilities:', error);
    } else {
      setVulnerabilities(data || []);
    }
  }, []);

  const loadComplianceFrameworks = useCallback(async () => {
    const { data, error } = await supabase
      .from('quantum_compliance_frameworks')
      .select('*')
      .order('compliance_score', { ascending: false });

    if (error) {
      console.error('Error loading compliance frameworks:', error);
    } else {
      setComplianceFrameworks(data || []);
    }
  }, []);

  const loadThreatIntelligence = useCallback(async () => {
    const { data, error } = await supabase
      .from('threat_intelligence')
      .select('*')
      .order('last_seen', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading threat intelligence:', error);
    } else {
      setThreatIntelligence(data || []);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadInfrastructureLayers(),
        loadQuantumThreats(),
        loadPQCAlgorithms(),
        loadVulnerabilities(),
        loadComplianceFrameworks(),
        loadThreatIntelligence()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [
    loadInfrastructureLayers,
    loadQuantumThreats,
    loadPQCAlgorithms,
    loadVulnerabilities,
    loadComplianceFrameworks,
    loadThreatIntelligence
  ]);

  useEffect(() => {
    loadData();

    const layersSubscription = supabase
      .channel('infrastructure_layers_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'infrastructure_layers' }, () => {
        loadInfrastructureLayers();
      })
      .subscribe();

    const threatsSubscription = supabase
      .channel('quantum_threats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quantum_threats' }, () => {
        loadQuantumThreats();
      })
      .subscribe();

    const pqcSubscription = supabase
      .channel('pqc_algorithms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pqc_algorithms' }, () => {
        loadPQCAlgorithms();
      })
      .subscribe();

    return () => {
      layersSubscription.unsubscribe();
      threatsSubscription.unsubscribe();
      pqcSubscription.unsubscribe();
    };
  }, [loadData, loadInfrastructureLayers, loadQuantumThreats, loadPQCAlgorithms]);

  return {
    infrastructureLayers,
    quantumThreats,
    pqcAlgorithms,
    vulnerabilities,
    complianceFrameworks,
    threatIntelligence,
    loading,
    error,
    refreshData: loadData
  };
};
