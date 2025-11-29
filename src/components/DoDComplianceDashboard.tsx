import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, AlertTriangle, Award, FileText, Users, Server, Database, Activity } from 'lucide-react';
import { useDoDCompliance } from '../hooks/useDoDCompliance';

export const DoDComplianceDashboard: React.FC = () => {
  const {
    complianceFrameworks,
    securityControls,
    certificationStatus,
    riskAssessment,
    auditTrail,
    cryptographicCompliance
  } = useDoDCompliance();

  const [selectedView, setSelectedView] = useState<'overview' | 'controls' | 'crypto' | 'audit' | 'risk'>('overview');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border-2 border-cyan-500/30">
        <div className="flex items-center gap-4 mb-4">
          <Shield className="h-12 w-12 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Department of Defense Compliance Center</h2>
            <p className="text-cyan-400">NIST SP 800-171 | CMMC | FIPS 140-3 | NSA CNSA 2.0</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Overall Compliance</p>
            <p className="text-2xl font-bold text-cyan-400">{complianceFrameworks.overallScore}%</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">CMMC Level</p>
            <p className="text-2xl font-bold text-green-400">Level {complianceFrameworks.cmmcLevel}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">CNSA 2.0 Ready</p>
            <p className="text-2xl font-bold text-purple-400">{cryptographicCompliance.cnsa20Ready}%</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Risk Score</p>
            <p className="text-2xl font-bold text-orange-400">{riskAssessment.overallScore}/100</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['overview', 'controls', 'crypto', 'audit', 'risk'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view as typeof selectedView)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedView === view
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" />
              DoD Compliance Frameworks
            </h3>
            <div className="space-y-4">
              {complianceFrameworks.frameworks.map((framework, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        framework.status === 'compliant' ? 'bg-green-400' :
                        framework.status === 'partial' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <span className="text-white font-semibold">{framework.name}</span>
                    </div>
                    <span className="text-cyan-400 font-bold">{framework.score}%</span>
                  </div>
                  <div className="mb-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${framework.score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full ${
                          framework.score >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          framework.score >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{framework.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {framework.controlsImplemented}/{framework.totalControls} Controls
                    </span>
                    {framework.certificationDate && (
                      <span className="text-xs text-gray-500">
                        Certified: {framework.certificationDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Certification Status
            </h3>
            <div className="space-y-4">
              {certificationStatus.map((cert, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border-l-4" style={{
                  borderLeftColor: cert.status === 'active' ? '#10b981' :
                                   cert.status === 'pending' ? '#f59e0b' : '#ef4444'
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{cert.certification}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      cert.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      cert.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {cert.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <p className="text-gray-500">Authority</p>
                      <p className="text-white">{cert.authority}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid Until</p>
                      <p className="text-white">{cert.validUntil}</p>
                    </div>
                  </div>
                  {cert.nextAudit && (
                    <p className="text-xs text-cyan-400 mt-2">
                      Next Audit: {cert.nextAudit}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedView === 'controls' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-cyan-400" />
            NIST SP 800-171 Security Controls
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {securityControls.map((control, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{control.id}</span>
                      {control.implemented ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{control.title}</p>
                    <p className="text-xs text-gray-400">{control.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    control.family === 'Access Control' ? 'bg-blue-500/20 text-blue-400' :
                    control.family === 'Incident Response' ? 'bg-red-500/20 text-red-400' :
                    control.family === 'System Protection' ? 'bg-purple-500/20 text-purple-400' :
                    control.family === 'Cryptographic Protection' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {control.family}
                  </span>
                  <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                    {control.cmmcLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedView === 'crypto' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-400" />
              NSA CNSA 2.0 Cryptographic Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                <p className="text-xs text-gray-400 mb-2">Key Encapsulation</p>
                <p className="text-lg font-bold text-cyan-400">ML-KEM-768</p>
                <p className="text-xs text-green-400 mt-1">FIPS 203 Final</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                <p className="text-xs text-gray-400 mb-2">Digital Signatures</p>
                <p className="text-lg font-bold text-purple-400">ML-DSA-65</p>
                <p className="text-xs text-green-400 mt-1">FIPS 204 Final</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <p className="text-xs text-gray-400 mb-2">Security Level</p>
                <p className="text-lg font-bold text-green-400">Category 3</p>
                <p className="text-xs text-gray-400 mt-1">192-bit equivalent</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                <p className="text-xs text-gray-400 mb-2">DoD 5220.22-M</p>
                <p className="text-lg font-bold text-orange-400">7-Pass Wipe</p>
                <p className="text-xs text-green-400 mt-1">Compliant</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Algorithm</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Purpose</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">DoD Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">CNSA 2.0</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptographicCompliance.algorithms.map((algo, idx) => (
                    <tr key={idx} className="border-b border-gray-700/50">
                      <td className="py-3 px-4 text-white font-medium">{algo.name}</td>
                      <td className="py-3 px-4 text-gray-300">{algo.purpose}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          algo.dodStatus === 'Approved' ? 'bg-green-500/20 text-green-400' :
                          algo.dodStatus === 'Restricted' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {algo.dodStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          algo.cnsa20Compliant ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {algo.cnsa20Compliant ? 'Compliant' : 'Legacy'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{algo.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">FIPS 140-3 Validation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cryptographicCompliance.fipsValidation.map((module, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Server className="h-8 w-8 text-cyan-400" />
                    <span className={`text-xs px-2 py-1 rounded ${
                      module.status === 'Validated' ? 'bg-green-500/20 text-green-400' :
                      module.status === 'In Process' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {module.status}
                    </span>
                  </div>
                  <p className="text-white font-semibold mb-2">{module.module}</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Security Level: {module.securityLevel}</p>
                    {module.certificateNumber && (
                      <p className="text-cyan-400">Cert #: {module.certificateNumber}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedView === 'audit' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Compliance Audit Trail
          </h3>
          <div className="space-y-3">
            {auditTrail.map((entry, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border-l-4" style={{
                borderLeftColor: entry.type === 'compliance' ? '#10b981' :
                                 entry.type === 'security' ? '#f59e0b' :
                                 entry.type === 'incident' ? '#ef4444' : '#6366f1'
              }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        entry.type === 'compliance' ? 'bg-green-500/20 text-green-400' :
                        entry.type === 'security' ? 'bg-yellow-500/20 text-yellow-400' :
                        entry.type === 'incident' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {entry.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">{entry.timestamp}</span>
                    </div>
                    <p className="text-white font-medium mb-1">{entry.event}</p>
                    <p className="text-sm text-gray-400 mb-2">{entry.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>User: {entry.user}</span>
                      <span>Framework: {entry.framework}</span>
                      {entry.controlId && <span>Control: {entry.controlId}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedView === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Risk Assessment Matrix
            </h3>
            <div className="space-y-4">
              {riskAssessment.risks.map((risk, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">{risk.category}</span>
                    <span className={`px-3 py-1 rounded font-bold ${
                      risk.level === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      risk.level === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      risk.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{risk.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Mitigation Status</p>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.mitigationProgress}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      />
                    </div>
                    <p className="text-xs text-cyan-400 mt-1">{risk.mitigationProgress}% Complete</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {risk.affectedFrameworks.map((framework, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {riskAssessment.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      rec.priority === 'Immediate' ? 'bg-red-400' :
                      rec.priority === 'High' ? 'bg-orange-400' :
                      'bg-yellow-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium">{rec.action}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'Immediate' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{rec.rationale}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Owner: {rec.owner}</span>
                        <span className="text-cyan-400">Due: {rec.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
