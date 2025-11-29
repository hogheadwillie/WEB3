import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Shield, AlertTriangle, Activity, Globe, Lock, Filter, Pause, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNetworkMonitoring } from '../hooks/useNetworkMonitoring';

export const NetworkMonitor: React.FC = () => {
  const { packets, metrics, isMonitoring, threatsDetected, startMonitoring, stopMonitoring } = useNetworkMonitoring();

  const latestMetric = metrics[metrics.length - 1];
  const chartData = metrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    packetsAnalyzed: metric.packetsAnalyzed,
    threatsBlocked: metric.threatsBlocked,
    encryptionStrength: metric.encryptionStrength * 100
  }));

  const recentPackets = packets.slice(-10);
  const threatLevels = {
    low: packets.filter(p => p.threatLevel === 'low').length,
    medium: packets.filter(p => p.threatLevel === 'medium').length,
    high: packets.filter(p => p.threatLevel === 'high').length
  };

  const protocolStats = {
    HTTPS: packets.filter(p => p.protocol === 'HTTPS').length,
    HTTP: packets.filter(p => p.protocol === 'HTTP').length,
    TCP: packets.filter(p => p.protocol === 'TCP').length,
    UDP: packets.filter(p => p.protocol === 'UDP').length,
    ICMP: packets.filter(p => p.protocol === 'ICMP').length
  };

  const encryptedCount = packets.filter(p => p.encrypted).length;
  const encryptionPercentage = packets.length > 0 ? (encryptedCount / packets.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{packets.length}</span>
          </div>
          <h3 className="text-sm text-gray-400">Packets Captured</h3>
          <p className="text-xs text-blue-400 mt-1">Live monitoring</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">{threatsDetected}</span>
          </div>
          <h3 className="text-sm text-gray-400">Threats Detected</h3>
          <p className="text-xs text-red-400 mt-1">{threatLevels.high} high severity</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Lock className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{encryptionPercentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-sm text-gray-400">Encrypted Traffic</h3>
          <p className="text-xs text-green-400 mt-1">{encryptedCount} of {packets.length} packets</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Globe className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">
              {latestMetric ? (latestMetric.quantumEntropy * 100).toFixed(0) : 0}%
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Network Entropy</h3>
          <p className="text-xs text-purple-400 mt-1">Quantum analysis</p>
        </motion.div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Wifi className="h-6 w-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Real-time Network Monitor</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200">
              <Filter className="h-4 w-4 text-gray-300" />
            </button>
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isMonitoring
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
              }`}
            >
              {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isMonitoring ? 'Pause' : 'Start'} Monitoring</span>
            </button>
          </div>
        </div>

        {/* Live Status */}
        {isMonitoring && (
          <div className="mb-4 flex items-center space-x-2 text-cyan-400">
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm">Live network monitoring active - capturing {packets.length} packets</span>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Traffic Over Time */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Network Traffic Analysis</h3>
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
                <Line type="monotone" dataKey="packetsAnalyzed" stroke="#3B82F6" strokeWidth={2} name="Packets Analyzed" />
                <Line type="monotone" dataKey="threatsBlocked" stroke="#EF4444" strokeWidth={2} name="Threats Blocked" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Encryption Trends */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Encryption Strength Trends</h3>
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Protocol & Threat Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Protocol Distribution</h3>
          <div className="space-y-3">
            {Object.entries(protocolStats).map(([protocol, count]) => {
              const percentage = packets.length > 0 ? (count / packets.length) * 100 : 0;
              const colors = {
                HTTPS: 'from-green-400 to-emerald-400',
                HTTP: 'from-yellow-400 to-orange-400',
                TCP: 'from-blue-400 to-cyan-400',
                UDP: 'from-purple-400 to-pink-400',
                ICMP: 'from-red-400 to-rose-400'
              };

              return (
                <div key={protocol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[protocol as keyof typeof colors]}`} />
                    <span className="text-gray-300 font-medium">{protocol}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${colors[protocol as keyof typeof colors]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Level Analysis */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Level Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white">Low Risk</span>
              </div>
              <span className="text-2xl font-bold text-green-400">{threatLevels.low}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-white">Medium Risk</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">{threatLevels.medium}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-white">High Risk</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{threatLevels.high}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Packet Activity */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Packet Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-300">Time</th>
                <th className="text-left py-3 text-gray-300">Source</th>
                <th className="text-left py-3 text-gray-300">Destination</th>
                <th className="text-left py-3 text-gray-300">Protocol</th>
                <th className="text-left py-3 text-gray-300">Size</th>
                <th className="text-left py-3 text-gray-300">Threat Level</th>
                <th className="text-left py-3 text-gray-300">Encrypted</th>
              </tr>
            </thead>
            <tbody>
              {recentPackets.map((packet) => (
                <motion.tr
                  key={packet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-3 text-gray-400">
                    {new Date(packet.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 text-blue-400 font-mono text-xs">{packet.source}</td>
                  <td className="py-3 text-purple-400 font-mono text-xs">{packet.destination}</td>
                  <td className="py-3 text-white">{packet.protocol}</td>
                  <td className="py-3 text-gray-300">{packet.size}B</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      packet.threatLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                      packet.threatLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {packet.threatLevel}
                    </span>
                  </td>
                  <td className="py-3">
                    {packet.encrypted ? (
                      <Lock className="h-4 w-4 text-green-400" />
                    ) : (
                      <div className="h-4 w-4 border border-gray-500 rounded-sm opacity-50" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {recentPackets.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Wifi className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No network activity detected. Start monitoring to see packet data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};