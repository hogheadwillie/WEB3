import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Shield,
  Calendar,
  Tag,
  FileText,
  Edit3,
  Trash2,
  UserCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useIncidentReporting } from '../hooks/useIncidentReporting';
import { useAuth } from '../hooks/useAuth';
import { SecurityIncident } from '../types';

export const IncidentReportingDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    incidents,
    comments,
    stats,
    loading,
    error,
    fetchComments,
    createIncident,
    updateIncident,
    addComment,
    assignIncident,
    deleteIncident
  } = useIncidentReporting();

  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [newComment, setNewComment] = useState('');

  // Form state for creating incidents
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    category: 'other' as const,
    source: '',
    affected_systems: '',
    impact_assessment: '',
    tags: ''
  });

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createIncident({
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        status: 'open',
        category: formData.category,
        source: formData.source || undefined,
        affected_systems: formData.affected_systems ? formData.affected_systems.split(',').map(s => s.trim()) : [],
        assigned_to: undefined,
        resolved_at: undefined,
        resolution_notes: undefined,
        impact_assessment: formData.impact_assessment || undefined,
        mitigation_steps: [],
        evidence_urls: [],
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()) : []
      });

      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: 'other',
        source: '',
        affected_systems: '',
        impact_assessment: '',
        tags: ''
      });
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  const handleStatusUpdate = async (incidentId: string, newStatus: SecurityIncident['status']) => {
    try {
      await updateIncident(incidentId, { status: newStatus });
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update incident status:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !newComment.trim()) return;

    try {
      await addComment(selectedIncident.id, newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleIncidentClick = async (incident: SecurityIncident) => {
    setSelectedIncident(incident);
    await fetchComments(incident.id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'investigating': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'resolved': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'closed': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const severityChartData = [
    { name: 'Critical', value: stats.critical, color: '#EF4444' },
    { name: 'High', value: stats.high, color: '#F97316' },
    { name: 'Medium', value: stats.medium, color: '#EAB308' },
    { name: 'Low', value: stats.low, color: '#22C55E' }
  ];

  const statusChartData = [
    { name: 'Open', value: stats.open },
    { name: 'Investigating', value: stats.investigating },
    { name: 'Resolved', value: stats.resolved },
    { name: 'Closed', value: stats.closed }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Security Incident Management</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Report Incident
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">Total Incidents</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm text-gray-300">Open Incidents</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.open}</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-300">Investigating</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.investigating}</div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">Resolved</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
            <h3 className="text-lg font-semibold text-white mb-4">Incidents by Severity</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {severityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
            <h3 className="text-lg font-semibold text-white mb-4">Incidents by Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Incidents List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Incidents</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredIncidents.map((incident) => (
              <motion.div
                key={incident.id}
                onClick={() => handleIncidentClick(incident)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-700/30 ${
                  selectedIncident?.id === incident.id ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-gray-600/30'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium truncate">{incident.title}</h4>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{incident.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                  <span className="capitalize">{incident.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Incident Detail View */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
          {selectedIncident ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedIncident.title}</h3>
                <div className="flex space-x-2">
                  <select
                    value={selectedIncident.status}
                    onChange={(e) => handleStatusUpdate(selectedIncident.id, e.target.value as SecurityIncident['status'])}
                    className="px-3 py-1 bg-gray-900/50 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Severity:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs border ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Category:</span>
                  <span className="ml-2 text-white text-sm capitalize">{selectedIncident.category}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 text-sm">Description:</span>
                <p className="text-white mt-1">{selectedIncident.description}</p>
              </div>

              {selectedIncident.affected_systems.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Affected Systems:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedIncident.affected_systems.map((system, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.tags.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedIncident.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">Comments</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  {comments[selectedIncident.id]?.map((comment) => (
                    <div key={comment.id} className="bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-sm">{comment.user_email}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an incident to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Incident Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl border border-gray-600 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Report New Incident</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Brief description of the incident"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Detailed description of the incident"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Severity *</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="malware">Malware</option>
                    <option value="phishing">Phishing</option>
                    <option value="ddos">DDoS Attack</option>
                    <option value="breach">Security Breach</option>
                    <option value="vulnerability">Vulnerability</option>
                    <option value="unauthorized_access">Unauthorized Access</option>
                    <option value="data_leak">Data Leak</option>
                    <option value="system_failure">System Failure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Source of detection (e.g., Network Monitor, User Report)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Affected Systems</label>
                <input
                  type="text"
                  value={formData.affected_systems}
                  onChange={(e) => setFormData(prev => ({ ...prev, affected_systems: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Comma-separated list of affected systems"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Impact Assessment</label>
                <textarea
                  rows={3}
                  value={formData.impact_assessment}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact_assessment: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Assessment of the incident's impact"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Comma-separated tags"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                >
                  Create Incident
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-2 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};