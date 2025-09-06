import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Shield, Wifi } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNetworkMonitoring } from '../hooks/useNetworkMonitoring';

export const NetworkMonitor: React.FC = () => {
  const { packets, metrics, isMonitoring, threatsDetected, startMonitoring, stopMonitoring } = useNetworkMonitoring();

  const recentPackets = packets.slice(-10);
  const chartData = metrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    threats: metric.threatsBlocked,
    packets: metric.packetsAnalyzed / 100,
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Network Security Monitor</h2>
        </div>
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isMonitoring
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-gray-300">Threats Detected</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{threatsDetected}</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Packets Analyzed</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{packets.length}</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">Encrypted</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {packets.length ? Math.round((packets.filter(p => p.encrypted).length / packets.length) * 100) : 0}%
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-300">Status</span>
          </div>
          <div className={`text-sm font-semibold ${isMonitoring ? 'text-green-400' : 'text-gray-400'}`}>
            {isMonitoring ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Network Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="packets" stroke="#06B6D4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
        <h3 className="text-lg font-semibold text-white mb-4">Live Packet Analysis</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentPackets.map((packet) => (
            <motion.div
              key={packet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                packet.threatLevel === 'high'
                  ? 'bg-red-500/10 border-red-500/30'
                  : packet.threatLevel === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  packet.threatLevel === 'high' ? 'bg-red-400' :
                  packet.threatLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
                <div className="text-sm">
                  <div className="text-white font-mono">
                    {packet.source} → {packet.destination}
                  </div>
                  <div className="text-gray-400">
                    {packet.protocol} • {packet.size} bytes • {packet.encrypted ? '🔒' : '🔓'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(packet.timestamp).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};