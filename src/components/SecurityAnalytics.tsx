import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, AlertTriangle, CheckCircle, TrendingUp, Activity, Lock, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNetworkMonitoring } from '../hooks/useNetworkMonitoring';

export const SecurityAnalytics: React.FC = () => {
  const { metrics, packets, threatsDetected, isMonitoring, startMonitoring, stopMonitoring } = useNetworkMonitoring();

  const latestMetric = metrics[metrics.length - 1];
  const chartData = metrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    threatsBlocked: metric.threatsBlocked,
    packetsAnalyzed: metric.packetsAnalyzed / 100, // Scale down for chart
    encryptionStrength: metric.encryptionStrength * 100,
    quantumEntropy: metric.quantumEntropy * 100
  }));

  const threatLevelData = [
    { name: 'Low', value: packets.filter(p => p.threatLevel === 'low').length, color: '#22C55E' },
    { name: 'Medium', value: packets.filter(p => p.threatLevel === 'medium').length, color: '#EAB308' },
    { name: 'High', value: packets.filter(p => p.threatLevel === 'high').length, color: '#EF4444' }
  ];

  const protocolData = [
    { name: 'HTTPS', value: packets.filter(p => p.protocol === 'HTTPS').length },
    { name: 'HTTP', value: packets.filter(p => p.protocol === 'HTTP').length },
    { name: 'TCP', value: packets.filter(p => p.protocol === 'TCP').length },
    { name: 'UDP', value: packets.filter(p => p.protocol === 'UDP').length },
    { name: 'ICMP', value: packets.filter(p => p.protocol === 'ICMP').length }
  ];

  const encryptedPackets = packets.filter(p => p.encrypted).length;
  const encryptionPercentage = packets.length > 0 ? (encryptedPackets / packets.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">{threatsDetected}</span>
          </div>
          <h3 className="text-sm text-gray-400">Threats Detected</h3>
          <p className="text-xs text-red-400 mt-1">
            {packets.filter(p => p.threatLevel === 'high').length} high severity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {latestMetric ? latestMetric.threatsBlocked : 0}
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Threats Blocked</h3>
          <p className="text-xs text-green-400 mt-1">Last 5 minutes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">
              {latestMetric ? latestMetric.packetsAnalyzed.toLocaleString() : '0'}
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Packets Analyzed</h3>
          <p className="text-xs text-blue-400 mt-1">Real-time monitoring</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Lock className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">
              {encryptionPercentage.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Encrypted Traffic</h3>
          <p className="text-xs text-purple-400 mt-1">
            {encryptedPackets}/{packets.length} packets
          </p>
        </motion.div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Eye className="h-6 w-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Security Analytics Center</h2>
          </div>
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isMonitoring
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>

        {/* Real-time Status */}
        {isMonitoring && (
          <div className="mb-4 flex items-center space-x-2 text-cyan-400">
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm">Real-time security monitoring active...</span>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Metrics Over Time */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Security Metrics Trends</h3>
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
                <Line type="monotone" dataKey="threatsBlocked" stroke="#EF4444" strokeWidth={2} name="Threats Blocked" />
                <Line type="monotone" dataKey="packetsAnalyzed" stroke="#3B82F6" strokeWidth={2} name="Packets Analyzed (x100)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Encryption & Quantum Metrics */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Encryption Strength</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                <Area type="monotone" dataKey="encryptionStrength" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Encryption Strength %" />
                <Area type="monotone" dataKey="quantumEntropy" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Quantum Entropy %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Level Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Level Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatLevelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {threatLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Analysis */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Protocol Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Security Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Security Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white">Firewall</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-green-400" />
                <span className="text-white">Encryption</span>
              </div>
              <span className="text-green-400 text-sm">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="text-white">IDS/IPS</span>
              </div>
              <span className="text-green-400 text-sm">Monitoring</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {packets.slice(-3).filter(p => p.threatLevel === 'high').map((packet) => (
              <div key={packet.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-red-400 text-sm font-medium">High Threat</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(packet.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  Suspicious {packet.protocol} traffic from {packet.source}
                </p>
              </div>
            ))}
            {packets.filter(p => p.threatLevel === 'high').length === 0 && (
              <div className="text-center py-4 text-gray-400">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No high-priority alerts</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Quantum Entropy</span>
                <span className="text-cyan-400 font-semibold">
                  {latestMetric ? (latestMetric.quantumEntropy * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"
                  style={{ width: `${latestMetric ? latestMetric.quantumEntropy * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Encryption Strength</span>
                <span className="text-purple-400 font-semibold">
                  {latestMetric ? (latestMetric.encryptionStrength * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                  style={{ width: `${latestMetric ? latestMetric.encryptionStrength * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};