import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { SecurityIncident, IncidentComment, IncidentStats } from '../types';

export const useIncidentReporting = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [comments, setComments] = useState<Record<string, IncidentComment[]>>({});
  const [stats, setStats] = useState<IncidentStats>({
    total: 0,
    open: 0,
    investigating: 0,
    resolved: 0,
    closed: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setIncidents(data || []);
      
      // Calculate stats
      const newStats: IncidentStats = {
        total: data?.length || 0,
        open: data?.filter(i => i.status === 'open').length || 0,
        investigating: data?.filter(i => i.status === 'investigating').length || 0,
        resolved: data?.filter(i => i.status === 'resolved').length || 0,
        closed: data?.filter(i => i.status === 'closed').length || 0,
        critical: data?.filter(i => i.severity === 'critical').length || 0,
        high: data?.filter(i => i.severity === 'high').length || 0,
        medium: data?.filter(i => i.severity === 'medium').length || 0,
        low: data?.filter(i => i.severity === 'low').length || 0,
      };
      
      setStats(newStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchComments = useCallback(async (incidentId: string) => {
    if (!user) return;

    try {
      const { data: commentData, error } = await supabase
        .from('incident_comments')
        .select('*')
        .eq('incident_id', incidentId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithUserInfo = (commentData || []).map((comment: any) => ({
        ...comment,
        user_email: 'Current User'
      }));

      setComments(prev => ({
        ...prev,
        [incidentId]: commentsWithUserInfo
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, [user]);

  const createIncident = useCallback(async (incidentData: Omit<SecurityIncident, 'id' | 'created_at' | 'updated_at' | 'reported_by'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('security_incidents')
        .insert({
          ...incidentData,
          reported_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchIncidents();
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      throw err;
    }
  }, [user, fetchIncidents]);

  const updateIncident = useCallback(async (incidentId: string, updates: Partial<SecurityIncident>) => {
    if (!user) throw new Error('User not authenticated');

    const { id: _id, created_at: _created, updated_at: _updated, reported_by: _reported, ...safeUpdates } = updates;

    try {
      const updateData: Record<string, unknown> = { ...safeUpdates };

      if (safeUpdates.status === 'resolved' && !safeUpdates.resolved_at) {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('security_incidents')
        .update(updateData)
        .eq('id', incidentId);

      if (error) throw error;

      await fetchIncidents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      throw err;
    }
  }, [user, fetchIncidents]);

  const addComment = useCallback(async (incidentId: string, comment: string, isInternal: boolean = true) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('incident_comments')
        .insert({
          incident_id: incidentId,
          user_id: user.id,
          comment,
          is_internal: isInternal
        });

      if (error) throw error;

      await fetchComments(incidentId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      throw err;
    }
  }, [user, fetchComments]);

  const assignIncident = useCallback(async (incidentId: string, assigneeId: string | null) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('security_incidents')
        .update({ assigned_to: assigneeId })
        .eq('id', incidentId);

      if (error) throw error;

      await fetchIncidents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      throw err;
    }
  }, [user, fetchIncidents]);

  const deleteIncident = useCallback(async (incidentId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('security_incidents')
        .delete()
        .eq('id', incidentId);

      if (error) throw error;

      await fetchIncidents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      throw err;
    }
  }, [user, fetchIncidents]);

  // Auto-generate incidents from security events
  const generateIncidentFromThreat = useCallback(async (threatType: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    if (!user) return;

    const incidentTemplates = {
      ddos: {
        title: 'DDoS Attack Detected',
        description: 'Large-scale distributed denial of service attack detected against our infrastructure.',
        category: 'ddos' as const,
        source: 'Network Monitor',
        affected_systems: ['Web Server', 'Load Balancer'],
        mitigation_steps: ['Enable DDoS protection', 'Block malicious IPs', 'Scale infrastructure']
      },
      malware: {
        title: 'Malware Detection Alert',
        description: 'Malicious software detected in the system requiring immediate attention.',
        category: 'malware' as const,
        source: 'Antivirus Scanner',
        affected_systems: ['Endpoint Devices'],
        mitigation_steps: ['Quarantine infected files', 'Run full system scan', 'Update antivirus definitions']
      },
      breach: {
        title: 'Security Breach Detected',
        description: 'Unauthorized access attempt or successful breach detected.',
        category: 'breach' as const,
        source: 'Security Monitor',
        affected_systems: ['Authentication System'],
        mitigation_steps: ['Reset compromised credentials', 'Review access logs', 'Implement additional security measures']
      }
    };

    const template = incidentTemplates[threatType as keyof typeof incidentTemplates];
    if (!template) return;

    try {
      await createIncident({
        ...template,
        severity,
        status: 'open',
        tags: ['auto-generated', threatType]
      });
    } catch (err) {
      console.error('Failed to generate incident:', err);
    }
  }, [user, createIncident]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    comments,
    stats,
    loading,
    error,
    fetchIncidents,
    fetchComments,
    createIncident,
    updateIncident,
    addComment,
    assignIncident,
    deleteIncident,
    generateIncidentFromThreat
  };
};