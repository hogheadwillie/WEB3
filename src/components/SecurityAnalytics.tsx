import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Shield, Activity, Zap } from 'lucide-react';

export const SecurityAnalytics: React.FC = () => {
  const threatData = [
    { name: 'DDoS', count: 45, color: '#EF4444' },
    { name: 'Malware', count: 32, color: '#F97316' },
    { name: 'Phishing', count: 28, color: '#EAB308' },
    { name: 'Brute Force', count: 21, color: '#8B5CF6' },
    { name: 'SQL Injection', count: 15, color: '#06B6D4' },
  ];

  const timelineData = [
    { time: '00:00', incidents: 5 },
    { time: '04:00', incidents: 12 },
    { time: '08:00', incidents: 8 },
    { time: '12:00', incidents: 15 },
    { time: '16:00', incidents: 20 },
    { time: '20:00', incidents: 18 },
  ];

  const riskLevel = 'Medium';
  const riskColor = riskLevel === 'High' ? 'text-red-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400';

  // Real-time security metrics simulation
  const [realTimeMetrics, setRealTimeMetrics] = React.useState({
    activeConnections: 1247,
    blockedAttacks: 89,
    quantumKeyStrength: 98.7,
    systemIntegrity: 99.2
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 20) - 10,
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 5),
        quantumKeyStrength: Math.max(95, Math.min(100, prev.quantumKeyStrength + (Math.random() - 0.5) * 2)),
        systemIntegrity: Math.max(95, Math.min(100, prev.systemIntegrity + (Math.random() - 0.5) * 1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="space-y-6">
      {/* Real-time Security Status */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Shield className="h-6 w-6 text-cyan-400" />
          <span>Real-time Security Status</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Connections</p>
                <p className="text-2xl font-bold text-blue-400">{realTimeMetrics.activeConnections.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Blocked Attacks</p>
                <p className="text-2xl font-bold text-red-400">{realTimeMetrics.blockedAttacks}</p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Quantum Key Strength</p>
                <p className="text-2xl font-bold text-purple-400">{realTimeMetrics.quantumKeyStrength.toFixed(1)}%</p>
              </div>
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Integrity</p>
                <p className="text-2xl font-bold text-green-400">{realTimeMetrics.systemIntegrity.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gray-800/50 rounded-lg p-4 border border-red-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-400">7</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-400">+15% from yesterday</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Threats Blocked</p>
              <p className="text-2xl font-bold text-green-400">1,247</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400">+8% from yesterday</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Network Uptime</p>
              <p className="text-2xl font-bold text-blue-400">99.98%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingDown className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-400">-0.01% from yesterday</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Risk Level</p>
              <p className={`text-2xl font-bold ${riskColor}`}>{riskLevel}</p>
            </div>
            <AlertCircle className={`h-8 w-8 ${riskColor}`} />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl border border-gray-600/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {threatData.map((entry, index) => (
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

        <div className="bg-gray-800/50 rounded-xl border border-gray-600/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Security Incidents Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
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
                <Bar dataKey="incidents" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-600/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Security Events</h3>
        <div className="space-y-3">
          {[
            { type: 'DDoS Attack', severity: 'high', time: '2 minutes ago', description: 'Large-scale DDoS attack blocked from 192.168.1.100' },
            { type: 'Malware Detected', severity: 'medium', time: '5 minutes ago', description: 'Trojan.Win32 detected and quarantined' },
            { type: 'Failed Login', severity: 'low', time: '8 minutes ago', description: 'Multiple failed login attempts from unknown IP' },
            { type: 'Firewall Rule', severity: 'low', time: '12 minutes ago', description: 'New firewall rule applied successfully' },
          ].map((event, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border ${
                event.severity === 'high' ? 'border-red-500/30 bg-red-500/10' :
                event.severity === 'medium' ? 'border-yellow-500/30 bg-yellow-500/10' :
                'border-green-500/30 bg-green-500/10'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.severity === 'high' ? 'bg-red-400' :
                    event.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <div>
                    <p className="font-semibold text-white">{event.type}</p>
                    <p className="text-sm text-gray-400">{event.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{event.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};