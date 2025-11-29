import { useState, useEffect } from 'react';

interface ThreatDriver {
  title: string;
  description: string;
  impact: string;
}

interface ThreatLandscape {
  drivers: ThreatDriver[];
}

interface VulnerableAlgorithm {
  name: string;
  keySize: string;
  attackModel: string;
  useCases: string;
}

interface ExposureArea {
  domain: string;
  exposure: number;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
}

interface RiskMatrixItem {
  name: string;
  likelihood: string;
  impact: string;
  rating: string;
  controls: string[];
}

export const useQuantumThreats = () => {
  const [threatLandscape] = useState<ThreatLandscape>({
    drivers: [
      {
        title: 'Rapid Qubit Scaling',
        description: 'Exponential growth in quantum processor capabilities from commercial providers',
        impact: 'Q-Day acceleration risk',
      },
      {
        title: 'Government Programs',
        description: 'National investments in quantum computing R&D programs worldwide',
        impact: 'Strategic threat emergence',
      },
      {
        title: 'Commercial Adoption',
        description: 'AWS, Google, IBM offering quantum cloud services to enterprises',
        impact: 'Widespread accessibility',
      },
    ],
  });

  const vulnerableAlgorithms: VulnerableAlgorithm[] = [
    { name: 'RSA-2048', keySize: '2048 bits (256 bytes)', attackModel: '4099 logical qubits', useCases: 'Signatures, certificates' },
    { name: 'ECDSA P-256', keySize: '256 bits (32 bytes)', attackModel: '2330 logical qubits', useCases: 'SSH, TLS, blockchain' },
    { name: 'Ed25519', keySize: '256 bits (32 bytes)', attackModel: '2330 logical qubits', useCases: 'SSH keys, signatures' },
    { name: 'DH Key Exchange', keySize: 'Various', attackModel: 'Shor\'s algorithm', useCases: 'VPNs, secure channels' },
  ];

  const exposureAreas: ExposureArea[] = [
    { domain: 'Network Security', exposure: 87, riskLevel: 'high', description: 'TLS handshakes, VPN tunnels, secure protocols' },
    { domain: 'Data Protection', exposure: 82, riskLevel: 'high', description: 'Code signing, encrypted storage, archives' },
    { domain: 'Identity Systems', exposure: 78, riskLevel: 'high', description: 'PKI infrastructure, authentication chains' },
    { domain: 'Applications', exposure: 65, riskLevel: 'medium', description: 'Legacy app cryptography, third-party libraries' },
  ];

  const riskMatrix: RiskMatrixItem[] = [
    {
      name: 'Harvest-Now-Decrypt-Later',
      likelihood: 'High (Active Today)',
      impact: 'High',
      rating: 'Critical',
      controls: ['ML-KEM-768', 'Traffic Shaping', 'Forensics'],
    },
    {
      name: 'Quantum Computing Attacks',
      likelihood: 'Medium (2030-2035)',
      impact: 'Critical',
      rating: 'High',
      controls: ['Hybrid PQC', 'Key Rotation', 'CNSA 2.0'],
    },
    {
      name: 'Supply Chain Crypto Debt',
      likelihood: 'High',
      impact: 'Medium',
      rating: 'High',
      controls: ['Vendor Assessment', 'Algorithm Agility'],
    },
    {
      name: 'Performance Degradation',
      likelihood: 'Medium',
      impact: 'Medium',
      rating: 'Medium',
      controls: ['HW Offload', 'Optimized Impl.', 'SLAs'],
    },
  ];

  return {
    threatLandscape,
    vulnerableAlgorithms,
    exposureAreas,
    riskMatrix,
  };
};
