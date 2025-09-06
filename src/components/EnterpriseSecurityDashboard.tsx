import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Database, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  Lock,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
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
    updateComplianceControl,
    executePlaybook,
    sendSecurityEvent
  } = useEnterpriseIntegrations();

  const [activeSection, setActiveSection] = useState<'overview' | 'vulnerabilities' | 'compliance' | 'threats' | 'soar' | 'ml' | 'containers'>('overview');

  const sections = [
    { id: 'overview' as const, name: 'Security Overview', icon: Shield },
    { id: 'vulnerabilities' as const, name: 'Vulnerability Management', icon: AlertTriangle },
    { id: 'compliance' as const, name: 'Compliance & Governance', icon: CheckCircle },
    { id: 'threats' as const, name: 'Threat Intelligence', icon: Eye },
    { id: 'soar' as const, name: 'SOAR & Automation', icon: Play },
    { id: 'ml' as const, name: 'AI/ML Security', icon: Activity },
    { id: 'containers' as const, name: 'Container Security', icon: Database }
  ];

  const overviewMetrics = {
    totalAssets: vulnerabilityAssets.length,
    criticalVulns: vulnerabilityAssets.reduce((sum, asset) => 
      sum + asset.vulnerabilities.filter(v => v.severity === 'critical').length, 0),
    complianceScore: complianceFrameworks.length > 0 
      ? Math.round(complianceFrameworks.reduce((sum, f) => sum + f.overall_score, 0) / complianceFrameworks.length)
      : 0,
    activeThreats: threatIndicators.filter(t => t.confidence > 80).length,
    mlAnomalies: anomalies.filter(a => a.severity === 'high' || a.severity === 'critical').length,
    containerRisk: containerImages.length > 0
      ? Math.round(containerImages.reduce((sum, img) => sum + img.risk_score, 0) / containerImages.length)
      : 0
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-sm text-gray-300">Critical Vulns</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{overviewMetrics.criticalVulns}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">Total Assets</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{overviewMetrics.totalAssets}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Compliance</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{overviewMetrics.complianceScore}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-300">Active Threats</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{overviewMetrics.activeThreats}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-300">ML Anomalies</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{overviewMetrics.mlAnomalies}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 rounded-lg p-4 border border-orange-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-5 w-5 text-orange-400" />
            <span className="text-sm text-gray-300">Container Risk</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{overviewMetrics.containerRisk}</div>
        </motion.div>
      </div>

      {/* Security Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Vulnerability Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vulnerabilityTrends}>
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
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#F97316" fill="#F97316" fillOpacity={0.6} />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#EAB308" fill="#EAB308" fillOpacity={0.6} />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Compliance Status</h3>
          <div className="space-y-4">
            {complianceFrameworks.slice(0, 3).map((framework) => (
              <div key={framework.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{framework.name}</span>
                  <span className={`text-sm font-semibold ${
                    framework.overall_score >= 80 ? 'text-green-400' :
                    framework.overall_score >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {framework.overall_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      framework.overall_score >= 80 ? 'bg-green-400' :
                      framework.overall_score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${framework.overall_score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Security Alerts</h3>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${
                alert.severity === 'critical' ? 'border-red-500/30 bg-red-500/10' :
                alert.severity === 'error' ? 'border-orange-500/30 bg-orange-500/10' :
                alert.severity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
                'border-blue-500/30 bg-blue-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-400' :
                    alert.severity === 'error' ? 'bg-orange-400' :
                    alert.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{alert.title}</div>
                    <div className="text-gray-400 text-sm">{alert.description}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(alert.created_at).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVulnerabilities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Vulnerability Management</h3>
        <button
          onClick={() => startVulnerabilityScan('asset-001', 'full')}
          className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2 inline" />
          Start Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Asset Inventory</h4>
          <div className="space-y-3">
            {vulnerabilityAssets.map((asset) => (
              <div key={asset.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{asset.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    asset.criticality === 'critical' ? 'bg-red-500/20 text-red-400' :
                    asset.criticality === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {asset.criticality}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {asset.ip_address} • {asset.os}
                </div>
                <div className="text-sm text-gray-400">
                  {asset.vulnerabilities.length} vulnerabilities found
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Vulnerability Trends</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={vulnerabilityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} />
                <Line type="monotone" dataKey="medium" stroke="#EAB308" strokeWidth={2} />
                <Line type="monotone" dataKey="low" stroke="#22C55E" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Compliance & Governance</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {complianceFrameworks.map((framework) => (
          <motion.div
            key={framework.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{framework.name}</h4>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                framework.overall_score >= 80 ? 'bg-green-500/20 text-green-400' :
                framework.overall_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {framework.overall_score}%
              </span>
            </div>
            
            <div className="space-y-3">
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
                <span className="text-gray-400">Non-Compliant:</span>
                <span className="text-red-400">
                  {framework.controls.filter(c => c.status === 'non-compliant').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Assessment:</span>
                <span className="text-gray-300">
                  {new Date(framework.last_assessment).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {complianceGaps.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Compliance Gaps</h4>
          <div className="space-y-3">
            {complianceGaps.slice(0, 5).map((gap, index) => (
              <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{gap.control_title}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    gap.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                    gap.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {gap.risk_level}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  {gap.framework} • {gap.control_id}
                </div>
                <div className="text-sm text-gray-300">
                  {gap.remediation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderThreats = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Threat Intelligence</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Threat Indicators</h4>
          <div className="space-y-3">
            {threatIndicators.map((indicator) => (
              <div key={indicator.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{indicator.type.toUpperCase()}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    indicator.confidence >= 90 ? 'bg-red-500/20 text-red-400' :
                    indicator.confidence >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {indicator.confidence}% confidence
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1 font-mono">
                  {indicator.value}
                </div>
                <div className="text-sm text-gray-400">
                  {indicator.threat_types.join(', ')} • {indicator.source}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Threat Campaigns</h4>
          <div className="space-y-3">
            {threatCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{campaign.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    campaign.confidence >= 90 ? 'bg-red-500/20 text-red-400' :
                    campaign.confidence >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {campaign.confidence}%
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {campaign.description}
                </div>
                <div className="text-sm text-gray-400">
                  Actor: {campaign.threat_actor} • {campaign.tactics.length} tactics
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSOAR = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">SOAR & Automation</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Active Playbooks</h4>
          <div className="space-y-3">
            {activePlaybooks.map((playbook) => (
              <div key={playbook.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{playbook.name}</span>
                  <button
                    onClick={() => executePlaybook(playbook.id, 'Manual execution')}
                    className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-all duration-200"
                  >
                    <Play className="h-3 w-3 mr-1 inline" />
                    Execute
                  </button>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {playbook.description}
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Executions: {playbook.execution_count}</span>
                  <span>Success Rate: {playbook.success_rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Recent Executions</h4>
          <div className="space-y-3">
            {playbookExecutions.map((execution) => (
              <div key={execution.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {activePlaybooks.find(p => p.id === execution.playbook_id)?.name || 'Unknown Playbook'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    execution.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    execution.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    execution.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {execution.status}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {execution.trigger_event}
                </div>
                <div className="text-sm text-gray-400">
                  {execution.actions_completed}/{execution.total_actions} actions completed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderML = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">AI/ML Security</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">ML Models</h4>
          <div className="space-y-3">
            {mlModels.map((model) => (
              <div key={model.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{model.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    model.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    model.status === 'training' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  {model.type.replace('_', ' ')} • v{model.version}
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Accuracy: {model.accuracy}%</span>
                  <span>Predictions: {model.predictions_made.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Anomaly Detection</h4>
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
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
                <div className="text-sm text-gray-300 mb-1">
                  {anomaly.anomaly_type.replace('_', ' ')}
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Confidence: {anomaly.confidence}%</span>
                  <span>{anomaly.investigated ? 'Investigated' : 'Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContainers = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Container Security</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Container Images</h4>
          <div className="space-y-3">
            {containerImages.map((image) => (
              <div key={image.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{image.name}:{image.tag}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    image.risk_score >= 80 ? 'bg-red-500/20 text-red-400' :
                    image.risk_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    Risk: {image.risk_score}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  {image.registry} • {(image.size / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="text-sm text-gray-400">
                  {image.vulnerabilities.length} vulnerabilities • {image.compliance_issues.length} compliance issues
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
          <h4 className="text-lg font-semibold text-white mb-4">Kubernetes Clusters</h4>
          <div className="space-y-3">
            {k8sClusters.map((cluster) => (
              <div key={cluster.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{cluster.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    cluster.risk_score >= 80 ? 'bg-red-500/20 text-red-400' :
                    cluster.risk_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    Risk: {cluster.risk_score}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  Kubernetes {cluster.version}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                  <span>Nodes: {cluster.nodes}</span>
                  <span>Pods: {cluster.pods}</span>
                  <span>Namespaces: {cluster.namespaces.length}</span>
                  <span>Policies: {cluster.security_policies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Enterprise Security Dashboard</h2>
          </div>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-800/30 p-1 rounded-xl border border-gray-700/50">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'vulnerabilities' && renderVulnerabilities()}
          {activeSection === 'compliance' && renderCompliance()}
          {activeSection === 'threats' && renderThreats()}
          {activeSection === 'soar' && renderSOAR()}
          {activeSection === 'ml' && renderML()}
          {activeSection === 'containers' && renderContainers()}
        </motion.div>
      </div>
    </div>
  );
};