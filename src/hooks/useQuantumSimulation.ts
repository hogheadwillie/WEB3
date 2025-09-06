import { useState, useEffect, useCallback } from 'react';
import { QuantumKey } from '../types';

export const useQuantumSimulation = () => {
  const [quantumKeys, setQuantumKeys] = useState<QuantumKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [entanglementStrength, setEntanglementStrength] = useState(0.95);

  const generateQuantumKey = useCallback(() => {
    const keyLength = 128;
    const bits = Array.from({ length: keyLength }, () => Math.random() > 0.5 ? '1' : '0').join('');
    const basis = Array.from({ length: keyLength }, () => Math.random() > 0.5 ? 'diagonal' : 'rectilinear') as ('rectilinear' | 'diagonal')[];
    
    const newKey: QuantumKey = {
      id: Math.random().toString(36).substr(2, 9),
      bits,
      basis,
      timestamp: Date.now(),
      fidelity: 0.85 + Math.random() * 0.15, // 85-100% fidelity
    };

    setQuantumKeys(prev => [...prev.slice(-9), newKey]);
  }, []);

  const startKeyGeneration = () => {
    setIsGenerating(true);
  };

  const stopKeyGeneration = () => {
    setIsGenerating(false);
  };

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(generateQuantumKey, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, generateQuantumKey]);

  useEffect(() => {
    // Simulate quantum entanglement fluctuations
    const interval = setInterval(() => {
      setEntanglementStrength(prev => {
        const change = (Math.random() - 0.5) * 0.02;
        return Math.max(0.8, Math.min(1.0, prev + change));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    quantumKeys,
    isGenerating,
    entanglementStrength,
    generateQuantumKey,
    startKeyGeneration,
    stopKeyGeneration,
  };
};