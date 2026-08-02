import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Activity,
  Lock,
  Crosshair,
  Gauge,
  Skull,
  Radar,
  Zap,
  TrendingUp,
  Ban,
  Target,
  Clock,
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
  Area,
  AreaChart,
} from 'recharts';
import { useThreatAnalysis, getAttackName, getAttackColor } from '../hooks/useThreatAnalysis';
import { ThreatEvent } from '../types';

const severityColor: Record<ThreatEvent['severity'], string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#22C55E',
};

const severityBg: Record<ThreatEvent['severity'], string> = {
  critical: 'bg-red-500/10 border-red-500/30',
  high: 'bg-orange-500/10 border-orange-500/30',
  medium: 'bg-yellow-500/10 border-yellow-500/30',
  low: 'bg-green-500/10 border-green-500/30',
};

const severityText: Record<ThreatEvent['severity'], string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

export const SecurityAnalytics: React.FC = () => {
  const {
    events,
    isAnalyzing,
    stats,
    topAttackers,
    attackTrend,
    startAnalysis,
    stopAnalysis,
    clearEvents,
  } = useThreatAnalysis();

  const [filter, setFilter] = useState<ThreatEvent['severity'] | 'all'>('all');

  const filteredEvents = useMemo(() => {
    const list = filter === 'all' ? events : events.filter((e) => e.severity === filter);
    return [...list].reverse().slice(0, 12);
  }, [events, filter]);

  const trendData = attackTrend.map((t) => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
    threats: t.count,
    blocked: t.blocked,
  }));

  const severityData = (['critical', 'high', 'medium', 'low'] as const).map((sev) => ({
    name: sev.charAt(0).toUpperCase() + sev.slice(1),
    value: stats.bySeverity[sev] || 0,
    color: severityColor[sev],
  }));

  const attackTypeData = Object.entries(stats.byAttackType)
    .map(([type, count]) => ({
      name: getAttackName(type as ThreatEvent['attackType']),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const blockRate = stats.totalThreats > 0 ? (stats.blockedThreats / stats.totalThreats) * 100 : 0;

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
            <Crosshair className="h-8 w-8 text-red-400" />
            <span className="text-3xl font-bold text-white">{stats.totalThreats}</span>
          </div>
          <h3 className="text-sm text-gray-400">Threats Detected</h3>
          <p className="text-xs text-red-400 mt-1">
            {stats.bySeverity.critical || 0} critical / {stats.bySeverity.high || 0} high
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Ban className="h-8 w-8 text-green-400" />
            <span className="text-3xl font-bold text-white">{stats.blockedThreats}</span>
          </div>
          <h3 className="text-sm text-gray-400">Threats Blocked</h3>
          <p className="text-xs text-green-400 mt-1">{blockRate.toFixed(1)}% block rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Gauge className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold text-white">{stats.averageConfidence}%</span>
          </div>
          <h3 className="text-sm text-gray-400">Avg Confidence</h3>
          <p className="text-xs text-blue-400 mt-1">{stats.threatsPerMinute} threats/min</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl p-6 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-cyan-400" />
            <span className="text-3xl font-bold text-white">{stats.threatsPerMinute}</span>
          </div>
          <h3 className="text-sm text-gray-400">Threats / Min</h3>
          <p className="text-xs text-cyan-400 mt-1">Live detection rate</p>
        </motion.div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Radar className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Real-Time Threat Analysis Engine</h2>
              <p className="text-sm text-gray-400">Pattern-based attack classification with confidence scoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {events.length > 0 && (
              <button
                onClick={clearEvents}
                className="px-4 py-2 rounded-lg font-medium text-gray-400 border border-gray-600 hover:bg-gray-700/50 transition-all"
              >
                Clear
              </button>
            )}
            <button
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isAnalyzing
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
              }`}
            >
              {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-4 flex items-center space-x-2 text-cyan-400">
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm">Analyzing live traffic for attack signatures...</span>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Trend */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Attack Trend (Last Minute)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="threats" stroke="#EF4444" fill="url(#threatGrad)" name="Threats" strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" stroke="#22C55E" fill="url(#blockedGrad)" name="Blocked" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Severity Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Type Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skull className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Top Attack Types</h3>
          </div>
          <div className="h-64">
            {attackTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No attacks detected yet
              </div>
            )}
          </div>
        </div>

        {/* Top Attackers */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Top Attacker Sources</h3>
          </div>
          <div className="space-y-3">
            {topAttackers.length > 0 ? (
              topAttackers.map((attacker, idx) => (
                <motion.div
                  key={attacker.ip}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                    <span className="text-sm font-mono text-gray-200">{attacker.ip}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(attacker.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded">
                      {attacker.count} hits
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">No attackers identified</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Threat Feed */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Live Threat Feed</h3>
            {isAnalyzing && (
              <span className="flex items-center gap-1 text-xs text-cyan-400">
                <motion.span
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Live
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilter(sev)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  filter === sev
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 border border-gray-700 hover:bg-gray-700/50'
                }`}
              >
                {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[28rem] overflow-y-auto">
          <AnimatePresence initial={false}>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-4 rounded-lg border ${severityBg[event.severity]}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{ backgroundColor: severityColor[event.severity] + '20', color: severityColor[event.severity] }}
                    >
                      {event.severity}
                    </span>
                    <span className="text-sm font-semibold text-white truncate">
                      {getAttackName(event.attackType)}
                    </span>
                    {event.blocked ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <Shield className="h-3 w-3" /> Blocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <AlertTriangle className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mt-2">{event.description}</p>

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                  <span className="font-mono">{event.sourceIp} → {event.targetIp}</span>
                  <span>{event.protocol}</span>
                  <span>{event.packetSize} bytes</span>
                  {event.mitreTactic && <span className="text-gray-500">MITRE: {event.mitreTactic}</span>}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Confidence</span>
                      <span className={severityText[event.severity]}>{event.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <motion.div
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: severityColor[event.severity] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${event.confidence}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {event.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs font-mono bg-gray-700/50 text-gray-300 rounded border border-gray-600/50"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {isAnalyzing ? (
                <>
                  <Radar className="h-10 w-10 mx-auto mb-3 opacity-40 animate-pulse" />
                  <p className="text-sm">Scanning for threats...</p>
                </>
              ) : (
                <>
                  <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No threats detected. Start analysis to begin monitoring.</p>
                </>
              )}
            </div>
          )}
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
                <Eye className="h-5 w-5 text-green-400" />
                <span className="text-white">IDS/IPS</span>
              </div>
              <span className="text-green-400 text-sm">{isAnalyzing ? 'Monitoring' : 'Idle'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Detection Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Total Events</span>
              <span className="text-white font-semibold">{stats.totalThreats}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Blocked</span>
              <span className="text-green-400 font-semibold">{stats.blockedThreats}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Avg Confidence</span>
              <span className="text-cyan-400 font-semibold">{stats.averageConfidence}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Block Rate</span>
              <span className="text-blue-400 font-semibold">{blockRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Detection Engine</span>
                <span className={isAnalyzing ? 'text-green-400 font-semibold' : 'text-gray-500 font-semibold'}>
                  {isAnalyzing ? 'Online' : 'Standby'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                  animate={{ width: isAnalyzing ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Threat Intelligence</span>
                <span className="text-cyan-400 font-semibold">Synced</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Response Automation</span>
                <span className="text-purple-400 font-semibold">Armed</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
