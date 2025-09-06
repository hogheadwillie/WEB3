import { useState, useEffect, useCallback } from 'react';
import { NetworkPacket, SecurityMetric } from '../types';

export const useNetworkMonitoring = () => {
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threatsDetected, setThreatsDetected] = useState(0);

  const generatePacket = useCallback((): NetworkPacket => {
    const protocols: NetworkPacket['protocol'][] = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'ICMP'];
    const threatLevels: NetworkPacket['threatLevel'][] = ['low', 'medium', 'high'];
    
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const threatLevel = threatLevels[Math.floor(Math.random() * threatLevels.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      protocol,
      size: Math.floor(Math.random() * 1500) + 64,
      threatLevel,
      encrypted: protocol === 'HTTPS' || Math.random() > 0.3,
    };
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  useEffect(() => {
    if (isMonitoring) {
      const packetInterval = setInterval(() => {
        const newPacket = generatePacket();
        setPackets(prev => [...prev.slice(-49), newPacket]);
        
        if (newPacket.threatLevel === 'high') {
          setThreatsDetected(prev => prev + 1);
        }
      }, 200);

      const metricsInterval = setInterval(() => {
        const newMetric: SecurityMetric = {
          timestamp: Date.now(),
          threatsBlocked: Math.floor(Math.random() * 10),
          packetsAnalyzed: Math.floor(Math.random() * 1000) + 500,
          encryptionStrength: 0.8 + Math.random() * 0.2,
          quantumEntropy: 0.85 + Math.random() * 0.15,
        };
        setMetrics(prev => [...prev.slice(-19), newMetric]);
      }, 5000);

      return () => {
        clearInterval(packetInterval);
        clearInterval(metricsInterval);
      };
    }
  }, [isMonitoring, generatePacket]);

  return {
    packets,
    metrics,
    isMonitoring,
    threatsDetected,
    startMonitoring,
    stopMonitoring,
  };
};