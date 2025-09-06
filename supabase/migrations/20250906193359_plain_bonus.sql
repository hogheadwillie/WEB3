/*
  # Incident Reporting Database System

  1. New Tables
    - `security_incidents`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `severity` (enum: low, medium, high, critical)
      - `status` (enum: open, investigating, resolved, closed)
      - `category` (enum: malware, phishing, ddos, breach, vulnerability, other)
      - `source` (text, source of incident detection)
      - `affected_systems` (text array)
      - `assigned_to` (uuid, foreign key to users)
      - `reported_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `resolved_at` (timestamp, nullable)
      - `resolution_notes` (text, nullable)
      - `impact_assessment` (text, nullable)
      - `mitigation_steps` (text array)
      - `evidence_urls` (text array)
      - `tags` (text array)

    - `incident_comments`
      - `id` (uuid, primary key)
      - `incident_id` (uuid, foreign key to security_incidents)
      - `user_id` (uuid, foreign key to users)
      - `comment` (text, required)
      - `is_internal` (boolean, default true)
      - `created_at` (timestamp)

    - `incident_attachments`
      - `id` (uuid, primary key)
      - `incident_id` (uuid, foreign key to security_incidents)
      - `file_name` (text, required)
      - `file_url` (text, required)
      - `file_type` (text, required)
      - `file_size` (bigint)
      - `uploaded_by` (uuid, foreign key to users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage incidents
    - Add policies for incident assignment and access control

  3. Indexes
    - Add indexes for performance on commonly queried fields
*/

-- Create custom types
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
CREATE TYPE incident_category AS ENUM ('malware', 'phishing', 'ddos', 'breach', 'vulnerability', 'unauthorized_access', 'data_leak', 'system_failure', 'other');

-- Create security_incidents table
CREATE TABLE IF NOT EXISTS security_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  severity incident_severity NOT NULL DEFAULT 'medium',
  status incident_status NOT NULL DEFAULT 'open',
  category incident_category NOT NULL,
  source text,
  affected_systems text[] DEFAULT '{}',
  assigned_to uuid REFERENCES auth.users(id),
  reported_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolution_notes text,
  impact_assessment text,
  mitigation_steps text[] DEFAULT '{}',
  evidence_urls text[] DEFAULT '{}',
  tags text[] DEFAULT '{}'
);

-- Create incident_comments table
CREATE TABLE IF NOT EXISTS incident_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid REFERENCES security_incidents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  comment text NOT NULL,
  is_internal boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create incident_attachments table
CREATE TABLE IF NOT EXISTS incident_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid REFERENCES security_incidents(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  uploaded_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for security_incidents
CREATE POLICY "Users can view all incidents"
  ON security_incidents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create incidents"
  ON security_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update incidents they reported or are assigned to"
  ON security_incidents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = reported_by OR auth.uid() = assigned_to);

-- Create policies for incident_comments
CREATE POLICY "Users can view comments for incidents they have access to"
  ON incident_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM security_incidents 
      WHERE id = incident_comments.incident_id
    )
  );

CREATE POLICY "Users can create comments"
  ON incident_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON incident_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for incident_attachments
CREATE POLICY "Users can view attachments for incidents they have access to"
  ON incident_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM security_incidents 
      WHERE id = incident_attachments.incident_id
    )
  );

CREATE POLICY "Users can upload attachments"
  ON incident_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_category ON security_incidents(category);
CREATE INDEX IF NOT EXISTS idx_security_incidents_assigned_to ON security_incidents(assigned_to);
CREATE INDEX IF NOT EXISTS idx_security_incidents_reported_by ON security_incidents(reported_by);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON security_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_comments_incident_id ON incident_comments(incident_id);
CREATE INDEX IF NOT EXISTS idx_incident_attachments_incident_id ON incident_attachments(incident_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_security_incidents_updated_at
    BEFORE UPDATE ON security_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();