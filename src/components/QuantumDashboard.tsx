import React from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, Zap, Activity } from 'lucide-react';
import { useQuantumSimulation } from '../hooks/useQuantumSimulation';

export const QuantumDashboard: React.FC = () => {
  const {
    quantumKeys,
    isGenerating,
    entanglementStrength,
    startKeyGeneration,
    stopKeyGeneration,
  } = useQuantumSimulation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Key className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">{quantumKeys.length}</span>
          </div>
          <h3 className="text-sm text-gray-400">Generated Keys</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">
              {(entanglementStrength * 100).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Entanglement Strength</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8 text-green-400" />
            <span className={`text-2xl font-bold ${isGenerating ? 'text-green-400' : 'text-gray-400'}`}>
              {isGenerating ? 'Active' : 'Idle'}
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Generation Status</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">128</span>
          </div>
          <h3 className="text-sm text-gray-400">Key Length (bits)</h3>
        </motion.div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Quantum Key Generation</h2>
          <button
            onClick={isGenerating ? stopKeyGeneration : startKeyGeneration}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isGenerating
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
            }`}
          >
            {isGenerating ? 'Stop Generation' : 'Start Generation'}
          </button>
        </div>

        <div className="space-y-4">
          {quantumKeys.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No quantum keys generated yet. Click "Start Generation" to begin.</p>
            </div>
          ) : (
            quantumKeys.map((key) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Key ID: {key.id}</span>
                  <span className="text-sm text-cyan-400">
                    Fidelity: {(key.fidelity * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Quantum Bits:</p>
                  <div className="font-mono text-xs text-white bg-black/50 p-2 rounded overflow-x-auto">
                    {key.bits}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Basis: {key.basis[0]}</span>
                  <span>{new Date(key.timestamp).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
