import React from 'react';
import { Shield, Wifi, Key, User, Server, Cloud } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { getActivePlan } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              QuantumSecure
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-gray-300">
              <Wifi className="h-4 w-4" />
              <span>Network Monitor</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Key className="h-4 w-4" />
              <span>Quantum Keys</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Server className="h-4 w-4" />
              <span>Mainframe</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Cloud className="h-4 w-4" />
              <span>Cloudflare</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span>Analytics</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {getActivePlan() && (
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg">
                    <span className="text-purple-400 text-sm font-medium">
                      {getActivePlan()}
                    </span>
                  </div>
                )}
                <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-400 text-sm font-medium">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};