import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Shield, Globe, Zap, TrendingUp, Users, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useCloudflareMetrics } from '../hooks/useCloudflareMetrics';

export const CloudflareMonitor: React.FC = () => {
  const { metrics, isMonitoring, totalRequests, totalThreats, avgResponseTime, startMonitoring, stopMonitoring } = useCloudflareMetrics();

  const latestMetric = metrics[metrics.length - 1];
  const chartData = metrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    requests: metric.requests / 1000, // Convert to thousands
    threats: metric.threats,
    responseTime: metric.responseTime,
    cacheHit: metric.cacheHitRatio * 100
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Cloud className="h-6 w-6 text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Cloudflare Security & Performance</h2>
        </div>
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isMonitoring
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">Total Requests</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {(totalRequests / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {latestMetric ? `${(latestMetric.requests / 1000).toFixed(1)}K/5min` : 'N/A'}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-red-400" />
            <span className="text-sm text-gray-300">Threats Blocked</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{totalThreats}</div>
          <div className="text-xs text-gray-400 mt-1">
            {latestMetric ? `${latestMetric.threats}/5min` : 'N/A'}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{avgResponseTime.toFixed(0)}ms</div>
          <div className="text-xs text-gray-400 mt-1">Average global</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-300">Cache Hit Ratio</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {latestMetric ? `${(latestMetric.cacheHitRatio * 100).toFixed(1)}%` : 'N/A'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Bandwidth saved</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic & Threats</h3>
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
                <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} name="Requests (K)" />
                <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} name="Threats" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
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
                <Area type="monotone" dataKey="responseTime" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Response Time (ms)" />
                <Area type="monotone" dataKey="cacheHit" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Cache Hit %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white">DDoS Protection</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white">Web Application Firewall</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white">Bot Management</span>
              </div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-white">SSL/TLS Encryption</span>
              </div>
              <span className="text-green-400 text-sm">Full (Strict)</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Global Traffic Distribution</h3>
          {latestMetric && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Unique Visitors</span>
                </div>
                <span className="text-blue-400 font-semibold">
                  {latestMetric.uniqueVisitors.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Top Countries</h4>
                {latestMetric.countries.map((country, index) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                          style={{ width: `${Math.max(20, 100 - index * 15)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">
                        {Math.max(5, 35 - index * 5)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isMonitoring && (
        <div className="mt-4 flex items-center space-x-2 text-orange-400">
          <motion.div
            className="w-2 h-2 bg-orange-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm">Monitoring Cloudflare metrics in real-time...</span>
        </div>
      )}
    </div>
  );
};