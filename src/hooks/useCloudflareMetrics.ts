import { useState, useEffect, useCallback } from 'react';
import { CloudflareMetrics } from '../types';

export const useCloudflareMetrics = () => {
  const [metrics, setMetrics] = useState<CloudflareMetrics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalThreats, setTotalThreats] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);

  const generateCloudflareData = useCallback(() => {
    const countries = ['US', 'GB', 'DE', 'FR', 'JP', 'AU', 'CA', 'BR', 'IN', 'CN'];
    
    const newMetric: CloudflareMetrics = {
      timestamp: Date.now(),
      requests: Math.floor(Math.random() * 10000) + 5000,
      bandwidth: Math.random() * 1000 + 500, // GB
      threats: Math.floor(Math.random() * 100) + 10,
      cacheHitRatio: 0.85 + Math.random() * 0.1,
      responseTime: Math.random() * 200 + 50, // ms
      uniqueVisitors: Math.floor(Math.random() * 5000) + 1000,
      countries: countries.slice(0, Math.floor(Math.random() * 5) + 3)
    };

    setMetrics(prev => [...prev.slice(-19), newMetric]);
    
    // Update totals
    setTotalRequests(prev => prev + newMetric.requests);
    setTotalThreats(prev => prev + newMetric.threats);
    setAvgResponseTime(newMetric.responseTime);
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(generateCloudflareData, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, generateCloudflareData]);

  // Initialize with some data
  useEffect(() => {
    generateCloudflareData();
  }, [generateCloudflareData]);

  return {
    metrics,
    isMonitoring,
    totalRequests,
    totalThreats,
    avgResponseTime,
    startMonitoring,
    stopMonitoring,
  };
};