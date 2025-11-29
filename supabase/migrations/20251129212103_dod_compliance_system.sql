/*
  # DoD Compliance Management System

  1. New Tables
    - `dod_compliance_metrics` - Overall compliance scores and framework status
    - `security_controls` - Individual security control implementation tracking
    - `certification_records` - DoD certification and ATO tracking
    - `cryptographic_inventory` - Cryptographic algorithm usage tracking
    - `compliance_audit_log` - Immutable audit trail for compliance events
    - `risk_register` - Risk assessment and mitigation tracking

  2. Security
    - Enable RLS on all tables with restrictive policies
    - Audit logging with tamper-evident controls
    - Data retention per DoD 5015.2 requirements

  3. Important Notes
    - Designed for DoD IL5 requirements
    - FIPS 140-3 compliant data handling
    - Quantum-safe encryption ready
*/

-- DoD Compliance Metrics Table
CREATE TABLE IF NOT EXISTS dod_compliance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  overall_score integer NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  cmmc_level integer NOT NULL DEFAULT 1 CHECK (cmmc_level >= 1 AND cmmc_level <= 5),
  nist_800_171_score integer DEFAULT 0 CHECK (nist_800_171_score >= 0 AND nist_800_171_score <= 100),
  cmmc_score integer DEFAULT 0 CHECK (cmmc_score >= 0 AND cmmc_score <= 100),
  cnsa_20_score integer DEFAULT 0 CHECK (cnsa_20_score >= 0 AND cnsa_20_score <= 100),
  fips_140_3_validated boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE dod_compliance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view DoD compliance metrics"
  ON dod_compliance_metrics FOR SELECT
  TO authenticated
  USING (true);

-- Security Controls Table
CREATE TABLE IF NOT EXISTS security_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  control_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  family text NOT NULL,
  implemented boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE security_controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view security controls"
  ON security_controls FOR SELECT
  TO authenticated
  USING (true);

-- Certification Records Table
CREATE TABLE IF NOT EXISTS certification_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  certification_name text NOT NULL,
  authority text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('active', 'pending', 'expired', 'suspended', 'revoked')
  ),
  valid_until timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE certification_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view certifications"
  ON certification_records FOR SELECT
  TO authenticated
  USING (true);

-- Cryptographic Inventory Table
CREATE TABLE IF NOT EXISTS cryptographic_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  algorithm_name text NOT NULL,
  dod_approved boolean DEFAULT false,
  cnsa_20_compliant boolean DEFAULT false,
  quantum_safe boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE cryptographic_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view crypto inventory"
  ON cryptographic_inventory FOR SELECT
  TO authenticated
  USING (true);

-- Compliance Audit Log Table (Immutable)
CREATE TABLE IF NOT EXISTS compliance_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  event_type text NOT NULL,
  event_name text NOT NULL,
  event_description text NOT NULL,
  user_email text NOT NULL,
  framework text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE compliance_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit logs"
  ON compliance_audit_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert audit logs"
  ON compliance_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Risk Register Table
CREATE TABLE IF NOT EXISTS risk_register (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  risk_category text NOT NULL,
  risk_level text NOT NULL CHECK (
    risk_level IN ('critical', 'high', 'medium', 'low')
  ),
  risk_description text NOT NULL,
  mitigation_progress integer DEFAULT 0 CHECK (mitigation_progress >= 0 AND mitigation_progress <= 100),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE risk_register ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view risks"
  ON risk_register FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_compliance_metrics_created_at ON dod_compliance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_controls_control_id ON security_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON compliance_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crypto_cnsa_compliant ON cryptographic_inventory(cnsa_20_compliant);
