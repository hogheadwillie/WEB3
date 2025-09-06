import React from 'react';
import { motion } from 'framer-motion';
import { Key, Zap, Shield, Activity } from 'lucide-react';
import { useQuantumSimulation } from '../hooks/useQuantumSimulation';

export const QuantumDashboard: React.FC = () => {
  const {
    quantumKeys,
    isGenerating,
    entanglementStrength,
    startKeyGeneration,
    stopKeyGeneration,
  } = useQuantumSimulation();

  const latestKey = quantumKeys[quantumKeys.length - 1];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Key className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Quantum Key Distribution</h2>
        </div>
        <button
          onClick={isGenerating ? stopKeyGeneration : startKeyGeneration}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isGenerating
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30'
          }`}
        >
          {isGenerating ? 'Stop Generation' : 'Start Generation'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-gray-300">Entanglement Strength</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {(entanglementStrength * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${entanglementStrength * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Keys Generated</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{quantumKeys.length}</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-300">Fidelity</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {latestKey ? `${(latestKey.fidelity * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </div>
      </div>

      {latestKey && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">Latest Quantum Key</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Key ID:</span>
              <span className="text-purple-400 font-mono">{latestKey.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timestamp:</span>
              <span className="text-gray-300">{new Date(latestKey.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="mt-3">
              <span className="text-gray-400">Key Bits (first 64):</span>
              <div className="mt-1 p-2 bg-gray-800 rounded font-mono text-xs text-green-400 break-all">
                {latestKey.bits.slice(0, 64)}...
              </div>
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="mt-4 flex items-center space-x-2 text-purple-400">
          <motion.div
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm">Generating quantum-entangled keys...</span>
        </div>
      )}
    </div>
  );
};