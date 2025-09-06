import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Server, 
  Eye, 
  Zap, 
  Brain,
  Container,
  Activity,
  Users,
  Lock,
  Search,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useEnterpriseIntegrations } from '../hooks/useEnterpriseIntegrations';

export const EnterpriseSecurityDashboard: React.FC = () => {
  const {
    vulnerabilityAssets,
    vulnerabilityTrends,
    complianceFrameworks,
    complianceGaps,
    threatIndicators,
    threatCampaigns,
    activePlaybooks,
    playbookExecutions,
    mlModels,
    anomalies,
    containerImages,
    k8sClusters,
    alerts,
    metrics,
    startVulnerabilityScan,
    executePlaybook,
    sendSecurityEvent
  } = useEnterpriseIntegrations();

  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'compliance' | 'threats' | 'soar' | 'aiml' | 'containers' | 'monitoring'>('overview');

  // Calculate summary statistics
  const totalVulnerabilities = vulnerabilityAssets.reduce((sum, asset) => sum + asset.vulnerabilities.length, 0);
  const criticalVulns = vulnerabilityAssets.reduce((sum, asset) => 
    sum + asset.vulnerabilities.filter(v => v.severity === 'critical').length, 0);
  
  const avgComplianceScore = complianceFrameworks.length > 0 
    ? Math.round(complianceFrameworks.reduce((sum, f) => sum + f.overall_score, 0) / complianceFrameworks.length)
    : 0;

  const activeThreats = threatIndicators.filter(t => 
    new Date(t.last_seen).getTime() > Date.now() - 24 * 60 * 60 * 1000
  ).length;

  const highSeverityAlerts = alerts.filter(a => a.severity === 'error' || a.severity === 'critical').length;

  const tabs = [
    { id: 'overview' as const, name: 'Overview', icon: Shield },
    { id: 'vulnerabilities' as const, name: 'Vulnerabilities', icon: AlertTriangle },
    { id: 'compliance' as const, name: 'Compliance', icon: CheckCircle },
    { id: 'threats' as const, name: 'Threat Intel', icon: Eye },
    { id: 'soar' as const, name: 'SOAR', icon: Zap },
    { id: 'aiml' as const, name: 'AI/ML', icon: Brain },
    { id: 'containers' as const, name: 'Containers', icon: Container },
    { id: 'monitoring' as const, name: 'Monitoring', icon: Activity }
  ];

  const vulnerabilityChartData = vulnerabilityTrends.map(trend => ({
    date: trend.date,
    critical: trend.critical,
    high: trend.high,
    medium: trend.medium,
    low: trend.low
  }));

  const complianceChartData = complianceFrameworks.map(framework => ({
    name: framework.name,
    score: framework.overall_score
  }));

  const threatTypeData = threatIndicators.reduce((acc, indicator) => {
    indicator.threat_types.forEach(type => {
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const threatChartData = Object.entries(threatTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-2">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Critical Vulnerabilities</p>
                  <p className="text-3xl font-bold text-red-400">{criticalVulns}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-400">+12% from last week</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Compliance Score</p>
                  <p className="text-3xl font-bold text-yellow-400">{avgComplianceScore}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full"
                    style={{ width: `${avgComplianceScore}%` }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Threats</p>
                  <p className="text-3xl font-bold text-orange-400">{activeThreats}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-400" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">Last 24 hours</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">High Priority Alerts</p>
                  <p className="text-3xl font-bold text-purple-400">{highSeverityAlerts}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">Requires attention</p>
              </div>
            </motion.div>
          </div>

          {/* Charts Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vulnerabilityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="high" stackId="1" stroke="#F97316" fill="#F97316" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="medium" stackId="1" stroke="#EAB308" fill="#EAB308" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="low" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Compliance Scores</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceChartData}>
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
                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vulnerabilities Tab */}
      {activeTab === 'vulnerabilities' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Vulnerability Management</h2>
              <button
                onClick={() => startVulnerabilityScan('asset-001', 'full')}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                <Search className="h-4 w-4 mr-2 inline" />
                Start Scan
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Assets</h3>
                <div className="space-y-3">
                  {vulnerabilityAssets.map((asset) => (
                    <div key={asset.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{asset.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          asset.criticality === 'critical' ? 'bg-red-500/20 text-red-400' :
                          asset.criticality === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          asset.criticality === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {asset.criticality}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        {asset.ip_address} • {asset.os}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          {asset.vulnerabilities.length} vulnerabilities
                        </span>
                        <span className="text-xs text-gray-500">
                          Last scan: {new Date(asset.last_scan).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vulnerabilityTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} />
                      <Line type="monotone" dataKey="medium" stroke="#EAB308" strokeWidth={2} />
                      <Line type="monotone" dataKey="low" stroke="#22C55E" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Compliance Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {complianceFrameworks.map((framework) => (
                <div key={framework.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{framework.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      framework.overall_score >= 90 ? 'bg-green-500/20 text-green-400' :
                      framework.overall_score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {framework.overall_score}%
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          framework.overall_score >= 90 ? 'bg-green-400' :
                          framework.overall_score >= 70 ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                        style={{ width: `${framework.overall_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Controls:</span>
                      <span className="text-white">{framework.controls.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Compliant:</span>
                      <span className="text-green-400">
                        {framework.controls.filter(c => c.status === 'compliant').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Non-compliant:</span>
                      <span className="text-red-400">
                        {framework.controls.filter(c => c.status === 'non-compliant').length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {complianceGaps.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Compliance Gaps</h3>
                <div className="space-y-3">
                  {complianceGaps.slice(0, 5).map((gap, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-white font-medium">{gap.control_title}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              gap.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                              gap.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              gap.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {gap.risk_level}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{gap.framework} - {gap.control_id}</p>
                          <p className="text-gray-300 text-sm">{gap.remediation}</p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            gap.status === 'non-compliant' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {gap.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat Intelligence Tab */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Threat Intelligence</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Active Indicators</h3>
                <div className="space-y-3">
                  {threatIndicators.map((indicator) => (
                    <div key={indicator.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono">{indicator.value}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          indicator.confidence >= 90 ? 'bg-red-500/20 text-red-400' :
                          indicator.confidence >= 70 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {indicator.confidence}% confidence
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-gray-400 text-sm">{indicator.type.toUpperCase()}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">{indicator.source}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {indicator.threat_types.map((type, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Threat Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={threatChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {threatChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {threatCampaigns.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Campaigns</h3>
                <div className="space-y-3">
                  {threatCampaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">{campaign.name}</h4>
                          <p className="text-gray-400 text-sm">{campaign.threat_actor}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          campaign.confidence >= 90 ? 'bg-red-500/20 text-red-400' :
                          campaign.confidence >= 70 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {campaign.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{campaign.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.tactics.map((tactic: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            {tactic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SOAR Tab */}
      {activeTab === 'soar' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Security Orchestration & Automated Response</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Active Playbooks</h3>
                <div className="space-y-3">
                  {activePlaybooks.map((playbook) => (
                    <div key={playbook.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{playbook.name}</h4>
                        <button
                          onClick={() => executePlaybook(playbook.id, 'Manual execution test')}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-500/30 transition-all duration-200"
                        >
                          <Play className="h-3 w-3 mr-1 inline" />
                          Execute
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{playbook.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Executions:</span>
                          <span className="text-white ml-2">{playbook.execution_count}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Success Rate:</span>
                          <span className="text-green-400 ml-2">{playbook.success_rate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Executions</h3>
                <div className="space-y-3">
                  {playbookExecutions.slice(-5).map((execution) => (
                    <div key={execution.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">{execution.trigger_event}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          execution.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          execution.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {execution.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        {execution.actions_completed}/{execution.total_actions} actions completed
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full"
                          style={{ width: `${(execution.actions_completed / execution.total_actions) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI/ML Tab */}
      {activeTab === 'aiml' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">AI/ML Security Models</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Active Models</h3>
                <div className="space-y-3">
                  {mlModels.map((model) => (
                    <div key={model.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{model.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          model.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          model.status === 'training' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {model.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Accuracy:</span>
                          <span className="text-cyan-400 ml-2">{model.accuracy}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Version:</span>
                          <span className="text-white ml-2">{model.version}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Predictions:</span>
                          <span className="text-white ml-2">{model.predictions_made.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Trained:</span>
                          <span className="text-gray-300 ml-2">{new Date(model.last_trained).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Anomalies</h3>
                <div className="space-y-3">
                  {anomalies.map((anomaly) => (
                    <div key={anomaly.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{anomaly.entity}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {anomaly.severity}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{anomaly.anomaly_type}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-cyan-400 ml-2">{anomaly.confidence}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Investigated:</span>
                          <span className={`ml-2 ${anomaly.investigated ? 'text-green-400' : 'text-red-400'}`}>
                            {anomaly.investigated ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Container Security Tab */}
      {activeTab === 'containers' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Container & Kubernetes Security</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Container Images</h3>
                <div className="space-y-3">
                  {containerImages.map((image) => (
                    <div key={image.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{image.name}:{image.tag}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          image.risk_score >= 80 ? 'bg-red-500/20 text-red-400' :
                          image.risk_score >= 60 ? 'bg-orange-500/20 text-orange-400' :
                          image.risk_score >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          Risk: {image.risk_score}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        {image.registry} • {(image.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Vulnerabilities:</span>
                          <span className="text-red-400 ml-2">{image.vulnerabilities.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Compliance Issues:</span>
                          <span className="text-yellow-400 ml-2">{image.compliance_issues.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Kubernetes Clusters</h3>
                <div className="space-y-3">
                  {k8sClusters.map((cluster) => (
                    <div key={cluster.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{cluster.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          cluster.risk_score >= 80 ? 'bg-red-500/20 text-red-400' :
                          cluster.risk_score >= 60 ? 'bg-orange-500/20 text-orange-400' :
                          cluster.risk_score >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          Risk: {cluster.risk_score}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        Kubernetes {cluster.version}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Nodes:</span>
                          <span className="text-white ml-2">{cluster.nodes}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Pods:</span>
                          <span className="text-white ml-2">{cluster.pods}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Namespaces:</span>
                          <span className="text-white ml-2">{cluster.namespaces.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Security Policies:</span>
                          <span className="text-cyan-400 ml-2">{cluster.security_policies}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Security Monitoring & Alerting</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">{alert.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'error' ? 'bg-orange-500/20 text-orange-400' :
                          alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{alert.source}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.status === 'open' ? 'bg-red-500/20 text-red-400' :
                          alert.status === 'acknowledged' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">System Metrics</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.slice(-12)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#9CA3AF"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Line type="monotone" dataKey="cpu_usage" stroke="#EF4444" strokeWidth={2} name="CPU %" />
                      <Line type="monotone" dataKey="memory_usage" stroke="#3B82F6" strokeWidth={2} name="Memory %" />
                      <Line type="monotone" dataKey="active_connections" stroke="#22C55E" strokeWidth={2} name="Connections" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
</parameter>