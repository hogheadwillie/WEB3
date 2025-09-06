// Cloudflare Worker for edge computing and security
import { QuantumState } from './quantum-state';

export { QuantumState };

interface Env {
  QUANTUM_STATE: DurableObjectNamespace;
  CACHE: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Security monitoring endpoint
    if (url.pathname.startsWith('/api/security')) {
      return handleSecurityAPI(request, env, corsHeaders);
    }

    // Quantum state management
    if (url.pathname.startsWith('/api/quantum')) {
      const id = env.QUANTUM_STATE.idFromName('global');
      const stub = env.QUANTUM_STATE.get(id);
      const response = await stub.fetch(request);
      
      // Add CORS headers to response
      const newResponse = new Response(response.body, response);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });
      
      return newResponse;
    }

    // Threat intelligence endpoint
    if (url.pathname === '/api/threats') {
      return handleThreatIntelligence(request, env, corsHeaders);
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};

async function handleSecurityAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/security/scan') {
    // Simulate security scan
    const scanResults = {
      timestamp: Date.now(),
      vulnerabilities: Math.floor(Math.random() * 5),
      threats: Math.floor(Math.random() * 10),
      status: 'completed',
      recommendations: [
        'Update SSL certificates',
        'Enable additional firewall rules',
        'Review access permissions'
      ]
    };

    // Cache results for 5 minutes
    await env.CACHE.put(`scan:${Date.now()}`, JSON.stringify(scanResults), {
      expirationTtl: 300
    });

    return new Response(JSON.stringify(scanResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Security endpoint not found', { 
    status: 404, 
    headers: corsHeaders 
  });
}

async function handleThreatIntelligence(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Check cache first
  const cached = await env.CACHE.get('threat_intel');
  if (cached) {
    return new Response(cached, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Generate threat intelligence data
  const threatData = {
    timestamp: Date.now(),
    globalThreats: Math.floor(Math.random() * 1000) + 500,
    activeCampaigns: Math.floor(Math.random() * 50) + 10,
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    topThreats: [
      { name: 'Ransomware', count: Math.floor(Math.random() * 100) + 50 },
      { name: 'Phishing', count: Math.floor(Math.random() * 80) + 30 },
      { name: 'DDoS', count: Math.floor(Math.random() * 60) + 20 },
      { name: 'Malware', count: Math.floor(Math.random() * 90) + 40 }
    ]
  };

  // Cache for 10 minutes
  await env.CACHE.put('threat_intel', JSON.stringify(threatData), {
    expirationTtl: 600
  });

  return new Response(JSON.stringify(threatData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}