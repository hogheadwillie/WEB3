import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, TrendingUp, Calendar, DollarSign, Award, Target } from 'lucide-react';
import { usePQCCompliance } from '../hooks/usePQCCompliance';

export const PQCComplianceDashboard: React.FC = () => {
  const { complianceData, algorithmStatus, cnsa20Compliance, financialMetrics } = usePQCCompliance();
  const [selectedView, setSelectedView] = useState<'overview' | 'algorithms' | 'roadmap' | 'roi'>('overview');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">{complianceData.cnsa20Score}%</span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">CNSA 2.0 Compliance</h3>
          <p className="text-xs text-cyan-400">Target: 98%+ by 2027</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">${financialMetrics.annualSavings}K</span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Annual Savings</h3>
          <p className="text-xs text-green-400">ROI: {financialMetrics.roi}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">{complianceData.riskReduction}%</span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Breach Risk Reduction</h3>
          <p className="text-xs text-orange-400">Quantum-safe controls</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{complianceData.daysUntilQDay}</span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">Days Until Q-Day</h3>
          <p className="text-xs text-purple-400">Projected: 2030-2035</p>
        </motion.div>
      </div>

      <div className="flex gap-2 mb-4">
        {['overview', 'algorithms', 'roadmap', 'roi'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view as typeof selectedView)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" />
              NIST PQC Standards
            </h3>
            <div className="space-y-4">
              {algorithmStatus.map((algo, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${algo.status === 'deployed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <div>
                      <p className="text-white font-medium">{algo.name}</p>
                      <p className="text-xs text-gray-400">{algo.purpose}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    algo.status === 'deployed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {algo.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Compliance Status by Domain
            </h3>
            <div className="space-y-4">
              {cnsa20Compliance.map((domain, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{domain.domain}</span>
                    <span className="text-sm font-semibold text-white">{domain.readiness}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${domain.readiness}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full ${
                        domain.readiness >= 90
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : domain.readiness >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{domain.requirement}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedView === 'algorithms' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">NIST Post-Quantum Algorithm Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Algorithm</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Purpose</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Key Size</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Security Level</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-white font-medium">ML-KEM-768</td>
                  <td className="py-3 px-4 text-gray-300">Key Encapsulation</td>
                  <td className="py-3 px-4 text-gray-300">1632B public</td>
                  <td className="py-3 px-4 text-cyan-400">Category 3 (192-bit)</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">FIPS 203 Final</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-white font-medium">ML-DSA-65</td>
                  <td className="py-3 px-4 text-gray-300">Digital Signatures</td>
                  <td className="py-3 px-4 text-gray-300">1952B public</td>
                  <td className="py-3 px-4 text-cyan-400">Category 3 (192-bit)</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">FIPS 204 Final</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-white font-medium">FALCON-512</td>
                  <td className="py-3 px-4 text-gray-300">Signatures (Alt)</td>
                  <td className="py-3 px-4 text-gray-300">897B public</td>
                  <td className="py-3 px-4 text-cyan-400">Category 1</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Selected</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-medium">SPHINCS+</td>
                  <td className="py-3 px-4 text-gray-300">Signatures (Alt)</td>
                  <td className="py-3 px-4 text-gray-300">32B public</td>
                  <td className="py-3 px-4 text-cyan-400">Various</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Selected</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {selectedView === 'roadmap' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">24-Month Implementation Roadmap</h3>
          <div className="space-y-6">
            {[
              { phase: 'Phase 1: Assessment', duration: '0-3 months', status: 'completed', items: ['Inventory cryptographic assets', 'Risk assessment & gap analysis', 'Vendor selection & planning'] },
              { phase: 'Phase 2: Pilot Implementation', duration: '4-8 months', status: 'in-progress', items: ['Hybrid PQC deployment', 'Performance benchmarking', 'Security testing & validation'] },
              { phase: 'Phase 3: Gradual Rollout', duration: '9-18 months', status: 'planned', items: ['Production deployment', 'Monitoring & optimization', 'Staff training & documentation'] },
              { phase: 'Phase 4: Full Migration', duration: '19-24 months', status: 'planned', items: ['Complete PQC replacement', 'Legacy system decommissioning', 'Continuous compliance monitoring'] },
            ].map((phase, idx) => (
              <div key={idx} className="relative pl-8 pb-6 border-l-2 border-gray-700 last:border-l-0 last:pb-0">
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  phase.status === 'completed' ? 'bg-green-500' : phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {phase.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="text-white font-semibold">{phase.phase}</h4>
                    <span className="text-xs text-gray-400">{phase.duration}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedView === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Financial Impact Analysis
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-gray-400 mb-1">Annual Savings</p>
                <p className="text-3xl font-bold text-green-400">${financialMetrics.annualSavings}K</p>
                <p className="text-xs text-gray-400 mt-2">ROI: {financialMetrics.roi}%</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-300 text-sm">Key Management Automation</span>
                  <span className="text-green-400 font-semibold">$285K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-300 text-sm">Incident Reduction</span>
                  <span className="text-green-400 font-semibold">$200K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-300 text-sm">Gateway Security</span>
                  <span className="text-green-400 font-semibold">$156K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded">
                  <span className="text-gray-300 text-sm">Anonymity Layer</span>
                  <span className="text-green-400 font-semibold">$100K</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Business Impact Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm text-gray-400 mb-1">Breach Cost Reduction</p>
                <p className="text-3xl font-bold text-orange-400">-40%</p>
                <p className="text-xs text-gray-400 mt-2">Average $4.45M per incident</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-900/50 rounded">
                  <p className="text-white font-medium mb-1">Certificate Storm Prevention</p>
                  <p className="text-sm text-gray-400">3-6 month re-issuance lead times eliminated</p>
                </div>
                <div className="p-3 bg-gray-900/50 rounded">
                  <p className="text-white font-medium mb-1">Compliance Readiness</p>
                  <p className="text-sm text-gray-400">98% CNSA 2.0 alignment by 2027</p>
                </div>
                <div className="p-3 bg-gray-900/50 rounded">
                  <p className="text-white font-medium mb-1">Market Access</p>
                  <p className="text-sm text-gray-400">Government/financial contract eligibility</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
