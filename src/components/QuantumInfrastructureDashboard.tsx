import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Shield,
  AlertTriangle,
  Lock,
  Activity,
  TrendingUp,
  Database,
  Server,
  Network,
  HardDrive
} from 'lucide-react';
import { useQuantumInfrastructure } from '../hooks/useQuantumInfrastructure';

type ViewType = 'overview' | 'layers' | 'threats' | 'pqc' | 'vulnerabilities';

export const QuantumInfrastructureDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const {
    infrastructureLayers,
    quantumThreats,
    pqcAlgorithms,
    vulnerabilities,
    complianceFrameworks,
    threatIntelligence,
    loading
  } = useQuantumInfrastructure();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quantum infrastructure data...</p>
        </div>
      </div>
    );
  }

  const views = [
    { id: 'overview' as ViewType, name: 'Overview', icon: Activity },
    { id: 'layers' as ViewType, name: 'Infrastructure', icon: Layers },
    { id: 'threats' as ViewType, name: 'Threats', icon: AlertTriangle },
    { id: 'pqc' as ViewType, name: 'PQC Algorithms', icon: Lock },
    { id: 'vulnerabilities' as ViewType, name: 'Vulnerabilities', icon: Shield }
  ];

  const criticalThreats = quantumThreats.filter(t => t.severity === 'critical').length;
  const highRiskLayers = infrastructureLayers.filter(l => l.quantum_risk_score > 70).length;
  const deployedPQC = pqcAlgorithms.filter(a => a.deployment_status === 'deployed').length;
  const openVulnerabilities = vulnerabilities.filter(v => v.remediation_status === 'open').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Quantum Infrastructure Security</h2>
          <p className="text-gray-400 text-sm mt-1">Enterprise IaaS Platform Protection</p>
        </div>
        <div className="flex gap-2">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === view.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">{view.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeView === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <span className="text-3xl font-bold text-white">{criticalThreats}</span>
              </div>
              <h3 className="text-sm text-gray-400">Critical Threats</h3>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-4">
                <Layers className="h-8 w-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{highRiskLayers}</span>
              </div>
              <h3 className="text-sm text-gray-400">High Risk Layers</h3>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <Lock className="h-8 w-8 text-green-400" />
                <span className="text-3xl font-bold text-white">{deployedPQC}</span>
              </div>
              <h3 className="text-sm text-gray-400">PQC Deployed</h3>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
                <span className="text-3xl font-bold text-white">{openVulnerabilities}</span>
              </div>
              <h3 className="text-sm text-gray-400">Open Vulnerabilities</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Compliance Status</h3>
              <div className="space-y-3">
                {complianceFrameworks.slice(0, 5).map((framework) => (
                  <div key={framework.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{framework.framework_name}</span>
                      <span className="text-cyan-400">{framework.compliance_score}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                        style={{ width: `${framework.compliance_score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Threat Intelligence</h3>
              <div className="space-y-3">
                {threatIntelligence.slice(0, 5).map((threat) => (
                  <div key={threat.id} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      threat.severity === 'critical' ? 'text-red-400' :
                      threat.severity === 'high' ? 'text-orange-400' :
                      threat.severity === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{threat.threat_type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Confidence: {threat.confidence_score}% | {threat.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeView === 'layers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {infrastructureLayers.map((layer) => {
            const layerIcons: Record<string, typeof Server> = {
              'Application': Database,
              'Data': HardDrive,
              'Runtime': Activity,
              'Middleware': TrendingUp,
              'OS': Server,
              'Virtualization': Layers,
              'Hardware': Server,
              'Storage': HardDrive,
              'Network': Network
            };
            const Icon = layerIcons[layer.layer_name] || Server;

            return (
              <div key={layer.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{layer.layer_name}</h3>
                      <p className="text-sm text-gray-400">Level {layer.layer_level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      layer.quantum_risk_score > 75 ? 'text-red-400' :
                      layer.quantum_risk_score > 50 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {layer.quantum_risk_score}
                    </div>
                    <p className="text-xs text-gray-400">Risk Score</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">{layer.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-lg font-semibold text-white">{layer.vulnerabilities_count}</div>
                    <div className="text-xs text-gray-400">Vulnerabilities</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-lg font-semibold text-white">{layer.mitigations_deployed}</div>
                    <div className="text-xs text-gray-400">Mitigations</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className={`text-lg font-semibold ${layer.pqc_ready ? 'text-green-400' : 'text-red-400'}`}>
                      {layer.pqc_ready ? 'Ready' : 'Not Ready'}
                    </div>
                    <div className="text-xs text-gray-400">PQC Status</div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {activeView === 'threats' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {quantumThreats.map((threat) => (
            <div key={threat.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      threat.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-semibold">
                      {threat.threat_category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{threat.threat_name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{threat.threat_description}</p>
                  {threat.quantum_algorithm && (
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-cyan-400" />
                      <span className="text-cyan-400">{threat.quantum_algorithm}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {threat.cvss_score && (
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">{threat.cvss_score}</div>
                      <p className="text-xs text-gray-400">CVSS Score</p>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    threat.mitigation_status === 'mitigated' ? 'bg-green-500/20 text-green-400' :
                    threat.mitigation_status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {threat.mitigation_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeView === 'pqc' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {pqcAlgorithms.map((algorithm) => (
            <div key={algorithm.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{algorithm.algorithm_name}</h3>
                  <p className="text-sm text-gray-400">{algorithm.algorithm_type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  algorithm.deployment_status === 'deployed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  algorithm.deployment_status === 'testing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {algorithm.deployment_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">NIST Status</p>
                  <p className="text-sm font-medium text-white">{algorithm.nist_status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Key Size</p>
                  <p className="text-sm font-medium text-white">{algorithm.key_size} bits</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Security Level</p>
                  <p className="text-sm font-medium text-white">Level {algorithm.security_level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">CNSA 2.0</p>
                  <p className={`text-sm font-medium ${algorithm.cnsa_20_approved ? 'text-green-400' : 'text-red-400'}`}>
                    {algorithm.cnsa_20_approved ? 'Approved' : 'Not Approved'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Performance Score</p>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${algorithm.performance_score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeView === 'vulnerabilities' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vuln.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      vuln.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      vuln.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {vuln.severity.toUpperCase()}
                    </span>
                    {vuln.quantum_vulnerable && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-semibold">
                        Quantum Vulnerable
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{vuln.vulnerability_name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{vuln.vulnerability_description}</p>
                  {vuln.cve_id && (
                    <p className="text-xs text-gray-500 mb-2">CVE ID: {vuln.cve_id}</p>
                  )}
                  {vuln.pqc_solution && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">PQC Solution:</p>
                      <p className="text-sm text-green-400">{vuln.pqc_solution}</p>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  {vuln.cvss_score && (
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">{vuln.cvss_score}</div>
                      <p className="text-xs text-gray-400">CVSS Score</p>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    vuln.remediation_status === 'remediated' ? 'bg-green-500/20 text-green-400' :
                    vuln.remediation_status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {vuln.remediation_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
