import React from 'react';
import { motion } from 'framer-motion';
import { Server, Activity, AlertTriangle, CheckCircle, Clock, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useMainframeMonitoring } from '../hooks/useMainframeMonitoring';

export const MainframeMonitor: React.FC = () => {
  const { connections, jobs, isMonitoring, totalCpu, totalMemory, startMonitoring, stopMonitoring } = useMainframeMonitoring();

  const runningJobs = jobs.filter(job => job.status === 'running');
  const failedJobs = jobs.filter(job => job.status === 'failed');
  
  const cpuData = connections.map(conn => ({
    name: conn.name.split(' ')[1],
    cpu: conn.cpu,
    memory: conn.memory
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Server className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">IBM Z Series Mainframe Monitor</h2>
        </div>
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isMonitoring
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
          }`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">Active Systems</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {connections.filter(c => c.status === 'connected').length}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">Avg CPU Usage</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{totalCpu.toFixed(1)}%</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <MemoryStick className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-300">Avg Memory</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{totalMemory.toFixed(1)}%</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-300">Active Jobs</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{runningJobs.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cpuData}>
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
                <Bar dataKey="cpu" fill="#3B82F6" name="CPU %" />
                <Bar dataKey="memory" fill="#8B5CF6" name="Memory %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
          <h3 className="text-lg font-semibold text-white mb-4">Mainframe Connections</h3>
          <div className="space-y-3">
            {connections.map((connection) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${
                  connection.status === 'connected'
                    ? 'bg-green-500/10 border-green-500/30'
                    : connection.status === 'error'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      connection.status === 'connected' ? 'bg-green-400' :
                      connection.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <div>
                      <div className="text-white font-medium">{connection.name}</div>
                      <div className="text-sm text-gray-400">
                        {connection.host}:{connection.port} • {connection.version}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">{connection.activeJobs} jobs</div>
                    <div className="text-xs text-gray-400">{connection.region}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
        <h3 className="text-lg font-semibold text-white mb-4">Active Jobs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-300">Job ID</th>
                <th className="text-left py-2 text-gray-300">Name</th>
                <th className="text-left py-2 text-gray-300">Status</th>
                <th className="text-left py-2 text-gray-300">Priority</th>
                <th className="text-left py-2 text-gray-300">CPU %</th>
                <th className="text-left py-2 text-gray-300">Memory MB</th>
                <th className="text-left py-2 text-gray-300">Duration</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 10).map((job) => (
                <tr key={job.id} className="border-b border-gray-800">
                  <td className="py-2 text-blue-400 font-mono">{job.id}</td>
                  <td className="py-2 text-white">{job.name}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      job.status === 'running' ? 'bg-green-500/20 text-green-400' :
                      job.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      job.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{job.priority}</td>
                  <td className="py-2 text-gray-300">{job.cpu.toFixed(1)}%</td>
                  <td className="py-2 text-gray-300">{job.memory.toFixed(0)}</td>
                  <td className="py-2 text-gray-300">
                    {Math.floor(job.duration / 60000)}m {Math.floor((job.duration % 60000) / 1000)}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {failedJobs.length > 0 && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">Failed Jobs Alert</span>
          </div>
          <p className="text-gray-300 text-sm">
            {failedJobs.length} job(s) have failed and require attention.
          </p>
        </div>
      )}
    </div>
  );
};