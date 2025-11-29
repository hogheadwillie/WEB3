import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, TrendingUp, Zap, Lock, Unlock } from 'lucide-react';
import { useQuantumThreats } from '../hooks/useQuantumThreats';

export const QuantumThreatMonitor: React.FC = () => {
  const { threatLandscape, vulnerableAlgorithms, exposureAreas, riskMatrix } = useQuantumThreats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <div>
              <h3 className="text-white font-semibold">HNDL Attacks</h3>
              <p className="text-xs text-gray-400">Active Today</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Harvest-now-decrypt-later attacks targeting encrypted data for future quantum decryption
          </p>
          <div className="mt-4 pt-4 border-t border-red-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Threat Level</span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">CRITICAL</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl p-6 border border-orange-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-orange-400" />
            <div>
              <h3 className="text-white font-semibold">Q-Day Horizon</h3>
              <p className="text-xs text-gray-400">2030-2035</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Projected timeline for cryptographically relevant quantum computers
          </p>
          <div className="mt-4 pt-4 border-t border-orange-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Qubit Scaling</span>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-semibold">EXPONENTIAL</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-cyan-400" />
            <div>
              <h3 className="text-white font-semibold">PQC Readiness</h3>
              <p className="text-xs text-gray-400">V5.17 Platform</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Quantum-safe cryptography with ML-KEM-768 and ML-DSA-65 algorithms
          </p>
          <div className="mt-4 pt-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Protection Status</span>
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold">SECURED</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Unlock className="h-5 w-5 text-red-400" />
            Vulnerable Algorithms
          </h3>
          <div className="space-y-3">
            {vulnerableAlgorithms.map((algo, idx) => (
              <div key={idx} className="p-4 bg-gray-900/50 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{algo.name}</span>
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">VULNERABLE</span>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Key Size: {algo.keySize}</p>
                  <p>Attack Model: {algo.attackModel}</p>
                  <p>Use Cases: {algo.useCases}</p>
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
            <Zap className="h-5 w-5 text-yellow-400" />
            Risk Exposure by Domain
          </h3>
          <div className="space-y-4">
            {exposureAreas.map((area, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{area.domain}</span>
                  <span className="text-sm font-semibold text-white">{area.exposure}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${area.exposure}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${
                      area.riskLevel === 'high'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : area.riskLevel === 'medium'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{area.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-cyan-400" />
          Quantum Threat Drivers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {threatLandscape.drivers.map((driver, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
            >
              <h4 className="text-white font-semibold mb-2">{driver.title}</h4>
              <p className="text-sm text-gray-400">{driver.description}</p>
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <span className="text-xs text-purple-400 font-medium">{driver.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Risk Mitigation Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Risk</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Likelihood</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Impact</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Rating</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Controls</th>
              </tr>
            </thead>
            <tbody>
              {riskMatrix.map((risk, idx) => (
                <tr key={idx} className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-white font-medium">{risk.name}</td>
                  <td className="py-3 px-4 text-gray-300">{risk.likelihood}</td>
                  <td className="py-3 px-4 text-gray-300">{risk.impact}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      risk.rating === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      risk.rating === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {risk.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {risk.controls.map((control, i) => (
                        <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {control}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
