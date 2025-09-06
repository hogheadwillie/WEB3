import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { QuantumDashboard } from './components/QuantumDashboard';
import { NetworkMonitor } from './components/NetworkMonitor';
import { UserSignup } from './components/UserSignup';
import { SecurityAnalytics } from './components/SecurityAnalytics';
import { MainframeMonitor } from './components/MainframeMonitor';
import { CloudflareMonitor } from './components/CloudflareMonitor';
import { SecurityTestingDashboard } from './components/SecurityTestingDashboard';
import { IncidentReportingDashboard } from './components/IncidentReportingDashboard';
import { UserProfile } from './components/UserProfile';
import { UserProfile } from './components/UserProfile';
import { UserProfile } from './components/UserProfile';
import { UserProfile } from './components/UserProfile';
import { UserProfile } from './components/UserProfile';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { PricingPage } from './components/PricingPage';
import { SuccessPage } from './components/SuccessPage';
import { useAuth } from './hooks/useAuth';
import { BarChart3, Key, Wifi, UserPlus, Server, Cloud, TestTube, AlertTriangle } from 'lucide-react';

type TabType = 'analytics' | 'quantum' | 'network' | 'mainframe' | 'cloudflare' | 'testing' | 'incidents' | 'signup' | 'profile';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  const tabs = [
    { id: 'analytics' as TabType, name: 'Security Analytics', icon: BarChart3 },
    { id: 'quantum' as TabType, name: 'Quantum Keys', icon: Key },
    { id: 'network' as TabType, name: 'Network Monitor', icon: Wifi },
    { id: 'mainframe' as TabType, name: 'IBM Z Series', icon: Server },
    { id: 'cloudflare' as TabType, name: 'Cloudflare', icon: Cloud },
    { id: 'testing' as TabType, name: 'Security Testing', icon: TestTube },
    { id: 'incidents' as TabType, name: 'Incident Reports', icon: AlertTriangle },
    { id: 'signup' as TabType, name: 'User Registration', icon: UserPlus },
    { id: 'profile' as TabType, name: 'Profile', icon: UserPlus },
    { id: 'profile' as TabType, name: 'Profile', icon: UserPlus },
    { id: 'profile' as TabType, name: 'Profile', icon: UserPlus },
    { id: 'profile' as TabType, name: 'Profile', icon: UserPlus },
    { id: 'profile' as TabType, name: 'Profile', icon: UserPlus },
  ];

        {activeTab === 'enterprise' && <EnterpriseSecurityDashboard />}
    { id: 'enterprise' as TabType, name: 'Enterprise Security', icon: BarChart3 },
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Quantum Security Operations Center
        </h1>
        <p className="text-gray-400">
          Advanced Web3 security platform with quantum encryption and real-time threat analysis
        </p>
      </div>

      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-800/30 p-1 rounded-xl border border-gray-700/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'analytics' && <SecurityAnalytics />}
        {activeTab === 'quantum' && <QuantumDashboard />}
        {activeTab === 'network' && <NetworkMonitor />}
        {activeTab === 'mainframe' && <MainframeMonitor />}
        {activeTab === 'cloudflare' && <CloudflareMonitor />}
        {activeTab === 'testing' && <SecurityTestingDashboard />}
        {activeTab === 'incidents' && <IncidentReportingDashboard />}
        {activeTab === 'signup' && <UserSignup />}
      </motion.div>
    </main>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <Header />
      {children}

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">QuantumSecure</h3>
              <p className="text-gray-400 text-sm">
                Next-generation Web3 security platform with quantum encryption and AI-powered threat detection.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Quantum Key Distribution</li>
                <li>• Real-time Network Monitoring</li>
                <li>• Advanced Threat Analytics</li>
                <li>• Web3 Wallet Integration</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• End-to-end Encryption</li>
                <li>• Zero-trust Architecture</li>
                <li>• Cloudflare Protection</li>
                <li>• SOC 2 Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 QuantumSecure. All rights reserved. Built with quantum-grade security.
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <AppLayout>
              <PricingPage />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;