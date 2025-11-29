/*
  # Quantum Infrastructure Security Database

  1. New Tables
    - `infrastructure_layers` - Tracks 9 infrastructure layers (Application, Data, Runtime, Middleware, OS, Virtualization, Hardware, Storage, Network)
    - `quantum_threats` - STRIDE threat model for quantum attacks across infrastructure layers
    - `pqc_algorithms` - NIST-approved post-quantum cryptographic algorithms tracking
    - `side_channel_attacks` - Side-channel attack vectors and mitigations
    - `quantum_compliance_frameworks` - Compliance framework requirements and status
    - `threat_intelligence` - Real-time threat intelligence feeds and indicators
    - `vulnerability_assessments` - Quantum vulnerability scanning and assessment results

  2. Security
    - Enable RLS on all tables with restrictive policies
    - Automated threat scoring and risk calculation
    - Real-time threat intelligence integration
    - Quantum-safe cryptographic inventory

  3. Important Notes
    - Based on "Cybersecurity in the Quantum Era" research
    - STRIDE threat modeling for quantum computing risks
    - NIST PQC standards integration (ML-KEM, ML-DSA, SLH-DSA)
    - Hardware security module (HSM) tracking
    - Covers all 9 infrastructure layers for comprehensive protection
*/

-- Infrastructure Layers Table
CREATE TABLE IF NOT EXISTS infrastructure_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  layer_name text UNIQUE NOT NULL CHECK (
    layer_name IN ('Application', 'Data', 'Runtime', 'Middleware', 'OS', 'Virtualization', 'Hardware', 'Storage', 'Network')
  ),
  layer_level integer NOT NULL CHECK (layer_level >= 1 AND layer_level <= 9),
  quantum_risk_score integer DEFAULT 0 CHECK (quantum_risk_score >= 0 AND quantum_risk_score <= 100),
  pqc_ready boolean DEFAULT false,
  description text NOT NULL,
  vulnerabilities_count integer DEFAULT 0,
  mitigations_deployed integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE infrastructure_layers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view infrastructure layers"
  ON infrastructure_layers FOR SELECT
  TO authenticated
  USING (true);

-- Quantum Threats Table (STRIDE Model)
CREATE TABLE IF NOT EXISTS quantum_threats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  layer_id uuid REFERENCES infrastructure_layers(id) ON DELETE CASCADE,
  threat_category text NOT NULL CHECK (
    threat_category IN ('Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure', 'Denial of Service', 'Elevation of Privilege')
  ),
  threat_name text NOT NULL,
  threat_description text NOT NULL,
  quantum_algorithm text CHECK (
    quantum_algorithm IN ('Shor''s Algorithm', 'Grover''s Algorithm', 'HHL Algorithm', 'Quantum Annealing', 'QAOA', 'VQE')
  ),
  severity text NOT NULL DEFAULT 'medium' CHECK (
    severity IN ('critical', 'high', 'medium', 'low')
  ),
  likelihood text NOT NULL DEFAULT 'medium' CHECK (
    likelihood IN ('very_high', 'high', 'medium', 'low', 'very_low')
  ),
  impact_score integer DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 100),
  cvss_score decimal(3,1) CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0),
  mitigation_status text DEFAULT 'identified' CHECK (
    mitigation_status IN ('identified', 'assessed', 'in_progress', 'mitigated', 'accepted')
  ),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE quantum_threats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view quantum threats"
  ON quantum_threats FOR SELECT
  TO authenticated
  USING (true);

-- PQC Algorithms Table
CREATE TABLE IF NOT EXISTS pqc_algorithms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  algorithm_name text UNIQUE NOT NULL,
  algorithm_type text NOT NULL CHECK (
    algorithm_type IN ('KEM', 'Digital Signature', 'Hash-Based Signature')
  ),
  nist_status text NOT NULL DEFAULT 'candidate' CHECK (
    nist_status IN ('standardized', 'finalist', 'candidate', 'deprecated')
  ),
  cnsa_20_approved boolean DEFAULT false,
  deployment_status text DEFAULT 'planned' CHECK (
    deployment_status IN ('deployed', 'testing', 'planned', 'not_planned')
  ),
  key_size integer NOT NULL,
  security_level integer CHECK (security_level IN (1, 2, 3, 4, 5)),
  performance_score integer DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  use_cases text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE pqc_algorithms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view PQC algorithms"
  ON pqc_algorithms FOR SELECT
  TO authenticated
  USING (true);

-- Side-Channel Attacks Table
CREATE TABLE IF NOT EXISTS side_channel_attacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  layer_id uuid REFERENCES infrastructure_layers(id) ON DELETE CASCADE,
  attack_type text NOT NULL CHECK (
    attack_type IN ('Timing Attack', 'Power Analysis', 'Electromagnetic Analysis', 'Cache Attack', 'Fault Injection', 'Acoustic Cryptanalysis')
  ),
  attack_name text NOT NULL,
  attack_description text NOT NULL,
  quantum_enhanced boolean DEFAULT false,
  affected_algorithms text[] DEFAULT ARRAY[]::text[],
  detection_method text,
  mitigation_technique text,
  effectiveness_score integer DEFAULT 0 CHECK (effectiveness_score >= 0 AND effectiveness_score <= 100),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE side_channel_attacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view side-channel attacks"
  ON side_channel_attacks FOR SELECT
  TO authenticated
  USING (true);

-- Quantum Compliance Frameworks Table
CREATE TABLE IF NOT EXISTS quantum_compliance_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  framework_name text UNIQUE NOT NULL,
  framework_version text NOT NULL,
  authority text NOT NULL,
  compliance_score integer DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  required_controls integer DEFAULT 0,
  implemented_controls integer DEFAULT 0,
  certification_date timestamptz,
  expiration_date timestamptz,
  status text DEFAULT 'in_progress' CHECK (
    status IN ('compliant', 'in_progress', 'non_compliant', 'not_applicable')
  ),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE quantum_compliance_frameworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view compliance frameworks"
  ON quantum_compliance_frameworks FOR SELECT
  TO authenticated
  USING (true);

-- Threat Intelligence Table
CREATE TABLE IF NOT EXISTS threat_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  threat_id text UNIQUE NOT NULL,
  source text NOT NULL,
  threat_type text NOT NULL,
  severity text NOT NULL CHECK (
    severity IN ('critical', 'high', 'medium', 'low', 'informational')
  ),
  ioc_type text CHECK (
    ioc_type IN ('IP', 'Domain', 'URL', 'Hash', 'Email', 'File', 'Registry', 'Certificate')
  ),
  ioc_value text,
  quantum_related boolean DEFAULT false,
  affected_layers text[] DEFAULT ARRAY[]::text[],
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  confidence_score integer DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  actionable boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE threat_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view threat intelligence"
  ON threat_intelligence FOR SELECT
  TO authenticated
  USING (true);

-- Vulnerability Assessments Table
CREATE TABLE IF NOT EXISTS vulnerability_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  layer_id uuid REFERENCES infrastructure_layers(id) ON DELETE CASCADE,
  vulnerability_id text UNIQUE NOT NULL,
  vulnerability_name text NOT NULL,
  vulnerability_description text NOT NULL,
  cve_id text,
  quantum_vulnerable boolean DEFAULT false,
  affected_cryptography text[] DEFAULT ARRAY[]::text[],
  cvss_score decimal(3,1) CHECK (cvss_score >= 0.0 AND cvss_score <= 10.0),
  severity text NOT NULL CHECK (
    severity IN ('critical', 'high', 'medium', 'low')
  ),
  remediation_status text DEFAULT 'open' CHECK (
    remediation_status IN ('open', 'in_progress', 'remediated', 'mitigated', 'accepted', 'false_positive')
  ),
  remediation_deadline timestamptz,
  pqc_solution text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE vulnerability_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vulnerability assessments"
  ON vulnerability_assessments FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_infrastructure_layers_level ON infrastructure_layers(layer_level);
CREATE INDEX IF NOT EXISTS idx_infrastructure_layers_quantum_risk ON infrastructure_layers(quantum_risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_quantum_threats_layer ON quantum_threats(layer_id);
CREATE INDEX IF NOT EXISTS idx_quantum_threats_severity ON quantum_threats(severity);
CREATE INDEX IF NOT EXISTS idx_quantum_threats_category ON quantum_threats(threat_category);
CREATE INDEX IF NOT EXISTS idx_pqc_algorithms_status ON pqc_algorithms(nist_status);
CREATE INDEX IF NOT EXISTS idx_pqc_algorithms_deployment ON pqc_algorithms(deployment_status);
CREATE INDEX IF NOT EXISTS idx_side_channel_attacks_layer ON side_channel_attacks(layer_id);
CREATE INDEX IF NOT EXISTS idx_side_channel_attacks_quantum ON side_channel_attacks(quantum_enhanced);
CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_status ON quantum_compliance_frameworks(status);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_severity ON threat_intelligence(severity);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_quantum ON threat_intelligence(quantum_related);
CREATE INDEX IF NOT EXISTS idx_vulnerability_assessments_layer ON vulnerability_assessments(layer_id);
CREATE INDEX IF NOT EXISTS idx_vulnerability_assessments_quantum ON vulnerability_assessments(quantum_vulnerable);
CREATE INDEX IF NOT EXISTS idx_vulnerability_assessments_severity ON vulnerability_assessments(severity);

-- Insert initial infrastructure layers
INSERT INTO infrastructure_layers (layer_name, layer_level, description, quantum_risk_score) VALUES
  ('Application', 1, 'Application layer services and APIs', 65),
  ('Data', 2, 'Data storage and encryption systems', 85),
  ('Runtime', 3, 'Runtime environments and containers', 55),
  ('Middleware', 4, 'Message queues, service buses, and integration layers', 60),
  ('OS', 5, 'Operating system and kernel security', 70),
  ('Virtualization', 6, 'Hypervisors and virtual machine management', 50),
  ('Hardware', 7, 'Physical servers, TPMs, and HSMs', 75),
  ('Storage', 8, 'SAN, NAS, and block storage systems', 80),
  ('Network', 9, 'Network infrastructure and communication protocols', 90)
ON CONFLICT (layer_name) DO NOTHING;

-- Insert NIST-approved PQC algorithms
INSERT INTO pqc_algorithms (algorithm_name, algorithm_type, nist_status, cnsa_20_approved, key_size, security_level, deployment_status) VALUES
  ('ML-KEM-768', 'KEM', 'standardized', true, 768, 3, 'deployed'),
  ('ML-KEM-1024', 'KEM', 'standardized', true, 1024, 5, 'testing'),
  ('ML-DSA-65', 'Digital Signature', 'standardized', true, 3293, 3, 'deployed'),
  ('ML-DSA-87', 'Digital Signature', 'standardized', true, 4595, 5, 'testing'),
  ('SLH-DSA-128s', 'Hash-Based Signature', 'standardized', true, 128, 1, 'planned'),
  ('SLH-DSA-256s', 'Hash-Based Signature', 'standardized', true, 256, 5, 'planned')
ON CONFLICT (algorithm_name) DO NOTHING;

-- Insert compliance frameworks
INSERT INTO quantum_compliance_frameworks (framework_name, framework_version, authority, required_controls) VALUES
  ('NIST PQC', '1.0', 'NIST', 50),
  ('CNSA 2.0', '2.0', 'NSA', 75),
  ('FIPS 140-3', '140-3', 'NIST', 100),
  ('ISO/IEC 27001:2022', '2022', 'ISO', 114),
  ('DoD CMMC Level 3', '2.0', 'DoD', 130)
ON CONFLICT (framework_name) DO NOTHING;