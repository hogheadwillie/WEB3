import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, AlertTriangle, CheckCircle, Play, Square, RefreshCw, Target, Activity, Cpu, MemoryStick, Network } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useSecurityTesting } from '../hooks/useSecurityTesting';

export const SecurityTestingDashboard: React.FC = () => {
  const {
    activeTests,
    stressMetrics,
    vulnerabilityReport,
    isStressTesting,
    testResults,
    startSecurityTest,
    startStressTest,
    stopStressTest,
    generateVulnerabilityReport
  } = useSecurityTesting();

  const testTypes = [
    { type: 'penetration' as const, name: 'Penetration Test', icon: Target, color: 'red' },
    { type: 'vulnerability' as const, name: 'Vulnerability Scan', icon: Shield, color: 'orange' },
    { type: 'load' as const, name: 'Load Test', icon: Activity, color: 'blue' },
    { type: 'ddos' as const, name: 'DDoS Simulation', icon: Zap, color: 'purple' },
    { type: 'injection' as const, name: 'SQL Injection Test', icon: AlertTriangle, color: 'yellow' },
    { type: 'xss' as const, name: 'XSS Test', icon: AlertTriangle, color: 'pink' }
  ];

  const latestStressMetric = stressMetrics[stressMetrics.length - 1];
  const stressChartData = stressMetrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    users: metric.concurrentUsers,
    rps: metric.requestsPerSecond / 100,
    responseTime: metric.responseTime,
    errorRate: metric.errorRate
  }));

  const vulnerabilityChartData = vulnerabilityReport ? [
    { name: 'Critical', value: vulnerabilityReport.criticalCount, color: '#EF4444' },
    { name: 'High', value: vulnerabilityReport.highCount, color: '#F97316' },
    { name: 'Medium', value: vulnerabilityReport.mediumCount, color: '#EAB308' },
    { name: 'Low', value: vulnerabilityReport.lowCount, color: '#22C55E' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Security Test Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Security Testing Suite</h2>
          </div>
          <button
            onClick={generateVulnerabilityReport}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2 inline" />
            Refresh Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {testTypes.map((testType) => {
            const Icon = testType.icon;
            const isRunning = activeTests.some(test => test.type === testType.type);
            
            return (
              <motion.button
                key={testType.type}
                onClick={() => !isRunning && startSecurityTest(testType.type, 'https://quantumsecure.app')}
                disabled={isRunning}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isRunning
                    ? 'bg-gray-700/50 border-gray-600 cursor-not-allowed'
                    : `bg-${testType.color}-500/10 border-${testType.color}-500/30 hover:bg-${testType.color}-500/20`
                }`}
                whileHover={!isRunning ? { scale: 1.02 } : {}}
                whileTap={!isRunning ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-6 w-6 ${isRunning ? 'text-gray-400' : `text-${testType.color}-400`}`} />
                  <div className="text-left">
                    <div className={`font-medium ${isRunning ? 'text-gray-400' : 'text-white'}`}>
                      {testType.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {isRunning ? 'Running...' : 'Click to start'}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Tests */}
        {activeTests.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Active Tests</h3>
            {activeTests.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-white font-medium">{test.name}</span>
                    <span className="text-gray-400 text-sm">on {test.target}</span>
                  </div>
                  <span className="text-blue-400 text-sm">{test.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${test.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Duration: {Math.floor(test.duration / 1000)}s</span>
                  <span>Findings: {test.findings.length}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Vulnerability Report */}
      {vulnerabilityReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Assessment</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{vulnerabilityReport.criticalCount}</div>
                <div className="text-sm text-gray-300">Critical</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-400">{vulnerabilityReport.highCount}</div>
                <div className="text-sm text-gray-300">High</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400">{vulnerabilityReport.mediumCount}</div>
                <div className="text-sm text-gray-300">Medium</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{vulnerabilityReport.lowCount}</div>
                <div className="text-sm text-gray-300">Low</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Risk Score</span>
                <span className={`font-bold ${
                  vulnerabilityReport.riskScore < 30 ? 'text-green-400' :
                  vulnerabilityReport.riskScore < 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {vulnerabilityReport.riskScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    vulnerabilityReport.riskScore < 30 ? 'bg-green-400' :
                    vulnerabilityReport.riskScore < 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${vulnerabilityReport.riskScore}%` }}
                />
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              vulnerabilityReport.complianceStatus === 'compliant' ? 'bg-green-500/10 border-green-500/30' :
              vulnerabilityReport.complianceStatus === 'partial' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                {vulnerabilityReport.complianceStatus === 'compliant' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                )}
                <span className={`font-medium ${
                  vulnerabilityReport.complianceStatus === 'compliant' ? 'text-green-400' :
                  vulnerabilityReport.complianceStatus === 'partial' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {vulnerabilityReport.complianceStatus === 'compliant' ? 'Compliant' :
                   vulnerabilityReport.complianceStatus === 'partial' ? 'Partially Compliant' :
                   'Non-Compliant'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vulnerabilityChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {vulnerabilityChartData.map((entry, index) => (
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
      )}

      {/* Stress Testing */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Stress Testing</h2>
          </div>
          <button
            onClick={isStressTesting ? stopStressTest : startStressTest}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isStressTesting
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
            }`}
          >
            {isStressTesting ? (
              <>
                <Square className="h-4 w-4 mr-2 inline" />
                Stop Test
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2 inline" />
                Start Test
              </>
            )}
          </button>
        </div>

        {latestStressMetric && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-300">Concurrent Users</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {latestStressMetric.concurrentUsers.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-300">Requests/sec</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {latestStressMetric.requestsPerSecond.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Response Time</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {latestStressMetric.responseTime.toFixed(0)}ms
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-sm text-gray-300">Error Rate</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {latestStressMetric.errorRate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {stressChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stressChartData}>
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
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
                    <Line type="monotone" dataKey="rps" stroke="#10B981" strokeWidth={2} name="RPS (x100)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
              <h3 className="text-lg font-semibold text-white mb-4">Response Time & Errors</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stressChartData}>
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
                    <Line type="monotone" dataKey="responseTime" stroke="#EAB308" strokeWidth={2} name="Response Time (ms)" />
                    <Line type="monotone" dataKey="errorRate" stroke="#EF4444" strokeWidth={2} name="Error Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Completed Tests</h3>
          <div className="space-y-4">
            {testResults.slice(-5).map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  test.severity === 'critical' ? 'border-red-500/30 bg-red-500/10' :
                  test.severity === 'high' ? 'border-orange-500/30 bg-orange-500/10' :
                  test.severity === 'medium' ? 'border-yellow-500/30 bg-yellow-500/10' :
                  'border-green-500/30 bg-green-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">{test.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      test.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      test.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      test.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {test.severity}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {Math.floor(test.duration / 1000)}s
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Found {test.findings.length} security findings
                </div>
                {test.findings.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {test.findings.slice(0, 3).map((finding) => (
                      <div key={finding.id} className="text-xs text-gray-400 bg-gray-900/50 p-2 rounded">
                        <div className="font-medium text-gray-300">{finding.type}</div>
                        <div>{finding.description}</div>
                      </div>
                    ))}
                    {test.findings.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{test.findings.length - 3} more findings
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};