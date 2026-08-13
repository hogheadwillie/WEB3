import { useState, useEffect, useCallback } from 'react';
import { CloudflareMetrics } from '../types';

export const useCloudflareMetrics = () => {
  const [metrics, setMetrics] = useState<CloudflareMetrics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalThreats, setTotalThreats] = useState(0);
  const [latestResponseTime, setLatestResponseTime] = useState(0);

  const generateCloudflareData = useCallback(() => {
    const countries = ['US', 'GB', 'DE', 'FR', 'JP', 'AU', 'CA', 'BR', 'IN', 'CN'];

    const newMetric: CloudflareMetrics = {
      timestamp: Date.now(),
      requests: Math.floor(Math.random() * 10000) + 5000,
      bandwidth: Math.random() * 1000 + 500,
      threats: Math.floor(Math.random() * 100) + 10,
      cacheHitRatio: 0.85 + Math.random() * 0.1,
      responseTime: Math.random() * 200 + 50,
      uniqueVisitors: Math.floor(Math.random() * 5000) + 1000,
      countries: countries.slice(0, Math.floor(Math.random() * 5) + 3)
    };

    setMetrics(prev => [...prev.slice(-19), newMetric]);
    setTotalRequests(prev => prev + newMetric.requests);
    setTotalThreats(prev => prev + newMetric.threats);
    setLatestResponseTime(newMetric.responseTime);
  }, []);

  const startMonitoring = useCallback(() => {
    setTotalRequests(0);
    setTotalThreats(0);
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(generateCloudflareData, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, generateCloudflareData]);

  useEffect(() => {
    generateCloudflareData();
  }, [generateCloudflareData]);

  return {
    metrics,
    isMonitoring,
    totalRequests,
    totalThreats,
    avgResponseTime: latestResponseTime,
    startMonitoring,
    stopMonitoring,
  };
};
