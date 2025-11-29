import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Cpu, Container, AlertTriangle, CheckCircle, Play, Clock, Target, Users, Lock, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useEnterpriseIntegrations } from '../hooks/useEnterpriseIntegrations';

export const EnterpriseSecurityDashboard: React.FC = () => {
  const {
    vulnerabilityAssets,
    complianceFrameworks,
    threatIndicators,
    activePlaybooks,
    playbookExecutions,
    mlModels,
    anomalies,
    containerImages,
    k8sClusters,
    alerts,
    metrics,
    executePlaybook
  } = useEnterpriseIntegrations();

  const latestMetrics = metrics[metrics.length - 1];
  const chartData = metrics.slice(-12).map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    cpu: metric.cpu_usage,
    memory: metric.memory_usage,
    connections: metric.active_connections / 10 // Scale for chart
  }));

  const alertsBySeverity = {
    critical: alerts.filter(a => a.severity === 'error').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length
  };

  const complianceScore = complianceFrameworks.length > 0
    ? Math.round(complianceFrameworks.reduce((acc, f) => acc + f.compliance_score, 0) / complianceFrameworks.length)
    : 85;

  const threatLevelData = [
    { name: 'High', value: threatIndicators.filter(t => t.confidence > 80).length, color: '#EF4444' },
    { name: 'Medium', value: threatIndicators.filter(t => t.confidence > 60 && t.confidence <= 80).length, color: '#F59E0B' },
    { name: 'Low', value: threatIndicators.filter(t => t.confidence <= 60).length, color: '#22C55E' }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">{complianceScore}%</span>
          </div>
          <h3 className="text-sm text-gray-400">Compliance Score</h3>
          <p className="text-xs text-cyan-400 mt-1">
            {complianceFrameworks.length} frameworks monitored
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">{threatIndicators.length}</span>
          </div>
          <h3 className="text-sm text-gray-400">Threat Indicators</h3>
          <p className="text-xs text-red-400 mt-1">
            {threatIndicators.filter(t => t.confidence > 80).length} high confidence
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Brain className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{mlModels.filter(m => m.status === 'active').length}</span>
          </div>
          <h3 className="text-sm text-gray-400">AI Models Active</h3>
          <p className="text-xs text-purple-400 mt-1">
            {mlModels.reduce((acc, m) => acc + m.predictions_made, 0).toLocaleString()} predictions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Play className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{activePlaybooks.length}</span>
          </div>
          <h3 className="text-sm text-gray-400">SOAR Playbooks</h3>
          <p className="text-xs text-green-400 mt-1">
            {playbookExecutions.filter(e => e.status === 'completed').length} executed today
          </p>
        </motion.div>
      </div>

      {/* Main Dashboard */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Enterprise Security Operations Center</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-white">Critical</span>
                </div>
                <span className="text-red-400 font-bold">{alertsBySeverity.critical}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white">Warning</span>
                </div>
                <span className="text-yellow-400 font-bold">{alertsBySeverity.warning}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white">Info</span>
                </div>
                <span className="text-blue-400 font-bold">{alertsBySeverity.info}</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">System Health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">CPU Usage</span>
                  <span className="text-cyan-400 font-semibold">
                    {latestMetrics ? latestMetrics.cpu_usage.toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"
                    style={{ width: `${latestMetrics ? latestMetrics.cpu_usage : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Memory Usage</span>
                  <span className="text-purple-400 font-semibold">
                    {latestMetrics ? latestMetrics.memory_usage.toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                    style={{ width: `${latestMetrics ? latestMetrics.memory_usage : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Active Connections</span>
                  <span className="text-green-400 font-semibold">
                    {latestMetrics ? latestMetrics.active_connections.toLocaleString() : 0}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                    style={{ width: `${latestMetrics ? Math.min((latestMetrics.active_connections / 1000) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => executePlaybook('pb-001', 'Manual trigger from dashboard')}
                className="w-full p-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <Play className="h-4 w-4" />
                  <span>Run Malware Response</span>
                </div>
              </button>

              <button className="w-full p-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4" />
                  <span>Start Vulnerability Scan</span>
                </div>
              </button>

              <button className="w-full p-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <Brain className="h-4 w-4" />
                  <span>Retrain ML Models</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance Trends */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Performance Trends</h3>
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
                <Line type="monotone" dataKey="cpu" stroke="#06B6D4" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="connections" stroke="#10B981" strokeWidth={2} name="Connections (x10)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Intelligence */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Indicator Distribution</h3>
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
      </div>

      {/* Enterprise Integrations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ML Models Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI/ML Models</h3>
          <div className="space-y-3">
            {mlModels.slice(0, 3).map((model) => (
              <div key={model.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{model.name}</p>
                  <p className="text-gray-400 text-xs">{model.accuracy.toFixed(1)}% accuracy</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  model.status === 'active' ? 'bg-green-400' :
                  model.status === 'training' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Container Security */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Container Security</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Container className="h-4 w-4 text-blue-400" />
                <span className="text-white text-sm">Images</span>
              </div>
              <span className="text-blue-400 font-medium">{containerImages.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm">K8s Clusters</span>
              </div>
              <span className="text-green-400 font-medium">{k8sClusters.length}</span>
            </div>

            <div className="text-xs text-gray-400">
              Avg Risk Score: {Math.round(containerImages.reduce((acc, img) => acc + img.risk_score, 0) / containerImages.length || 0)}
            </div>
          </div>
        </div>

        {/* Compliance Frameworks */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Compliance</h3>
          <div className="space-y-3">
            {complianceFrameworks.slice(0, 3).map((framework) => (
              <div key={framework.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{framework.name}</p>
                  <p className="text-gray-400 text-xs">{framework.controls_count} controls</p>
                </div>
                <span className={`text-sm font-medium ${
                  framework.compliance_score >= 90 ? 'text-green-400' :
                  framework.compliance_score >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {framework.compliance_score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Anomalies */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Anomaly Detection</h3>
          <div className="space-y-3">
            {anomalies.slice(0, 2).map((anomaly) => (
              <div key={anomaly.id} className="p-3 bg-gray-900/50 border border-gray-600/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    anomaly.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {anomaly.severity}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {anomaly.confidence}%
                  </span>
                </div>
                <p className="text-white text-sm">{anomaly.entity}</p>
                <p className="text-gray-400 text-xs">{anomaly.anomaly_type.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Playbook Executions */}
      {playbookExecutions.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent SOAR Executions</h3>
          <div className="space-y-3">
            {playbookExecutions.slice(-3).map((execution) => (
              <motion.div
                key={execution.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-900/50 border border-gray-600/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">
                    {activePlaybooks.find(p => p.id === execution.playbook_id)?.name || 'Unknown Playbook'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    execution.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {execution.status}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-2">{execution.trigger_event}</p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {execution.actions_completed}/{execution.total_actions} actions
                  </span>
                  <span>
                    {execution.start_time ? new Date(execution.start_time).toLocaleTimeString() : 'N/A'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};