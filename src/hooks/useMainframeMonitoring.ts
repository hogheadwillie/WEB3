import { useState, useEffect, useCallback } from 'react';
import { MainframeConnection, MainframeJob } from '../types';

export const useMainframeMonitoring = () => {
  const [connections, setConnections] = useState<MainframeConnection[]>([]);
  const [jobs, setJobs] = useState<MainframeJob[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [totalCpu, setTotalCpu] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);

  const generateMainframeData = useCallback(() => {
    // Simulate IBM Z Series mainframes
    const mainframes: MainframeConnection[] = [
      {
        id: 'z15-prod-01',
        name: 'IBM z15 Production',
        host: '10.0.1.100',
        port: 23,
        status: Math.random() > 0.95 ? 'error' : 'connected',
        lastHeartbeat: Date.now(),
        cpu: Math.random() * 100,
        memory: 60 + Math.random() * 30,
        storage: 70 + Math.random() * 20,
        activeJobs: Math.floor(Math.random() * 50) + 10,
        region: 'US-East',
        version: 'z/OS 2.5'
      },
      {
        id: 'z14-backup-01',
        name: 'IBM z14 Backup',
        host: '10.0.1.101',
        port: 23,
        status: Math.random() > 0.98 ? 'disconnected' : 'connected',
        lastHeartbeat: Date.now(),
        cpu: Math.random() * 60,
        memory: 40 + Math.random() * 25,
        storage: 50 + Math.random() * 30,
        activeJobs: Math.floor(Math.random() * 30) + 5,
        region: 'US-West',
        version: 'z/OS 2.4'
      },
      {
        id: 'z13-dev-01',
        name: 'IBM z13 Development',
        host: '10.0.1.102',
        port: 23,
        status: 'connected',
        lastHeartbeat: Date.now(),
        cpu: Math.random() * 40,
        memory: 30 + Math.random() * 20,
        storage: 40 + Math.random() * 25,
        activeJobs: Math.floor(Math.random() * 20) + 2,
        region: 'EU-Central',
        version: 'z/OS 2.3'
      }
    ];

    setConnections(mainframes);
    setTotalCpu(mainframes.reduce((sum, mf) => sum + mf.cpu, 0) / mainframes.length);
    setTotalMemory(mainframes.reduce((sum, mf) => sum + mf.memory, 0) / mainframes.length);
  }, []);

  const generateJobs = useCallback(() => {
    const jobTypes = ['PAYROLL', 'BACKUP', 'BATCH', 'CICS', 'DB2', 'IMS', 'COBOL', 'JCL'];
    const statuses: MainframeJob['status'][] = ['running', 'completed', 'failed', 'queued'];
    
    const newJobs: MainframeJob[] = Array.from({ length: 15 }, (_, i) => ({
      id: `JOB${String(i + 1).padStart(4, '0')}`,
      name: `${jobTypes[Math.floor(Math.random() * jobTypes.length)]}${Math.floor(Math.random() * 999) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: Math.floor(Math.random() * 10) + 1,
      startTime: Date.now() - Math.random() * 3600000,
      duration: Math.random() * 1800000,
      cpu: Math.random() * 100,
      memory: Math.random() * 1024
    }));

    setJobs(newJobs);
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        generateMainframeData();
        generateJobs();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring, generateMainframeData, generateJobs]);

  // Initialize data
  useEffect(() => {
    generateMainframeData();
    generateJobs();
  }, [generateMainframeData, generateJobs]);

  return {
    connections,
    jobs,
    isMonitoring,
    totalCpu,
    totalMemory,
    startMonitoring,
    stopMonitoring,
  };
};