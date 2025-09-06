import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Settings, Key, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { TwoFactorSetup } from './auth/TwoFactorSetup';
import { use2FA } from '../hooks/use2FA';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription, getActivePlan, isActive } = useSubscription();
  const { isEnabled: is2FAEnabled } = use2FA();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  if (!user) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
        <div className="text-center text-gray-400">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  if (showTwoFactorSetup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Security Settings</h2>
          <button
            onClick={() => setShowTwoFactorSetup(false)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            Back to Profile
          </button>
        </div>
        <TwoFactorSetup onComplete={() => setShowTwoFactorSetup(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-cyan-500/20 rounded-lg">
            <User className="h-8 w-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
            <p className="text-gray-400">Manage your account settings and security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 font-medium">Email Address</span>
              </div>
              <p className="text-white">{user.email}</p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 font-medium">Member Since</span>
              </div>
              <p className="text-white">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300 font-medium">Subscription</span>
                </div>
                {isActive() && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    Active
                  </span>
                )}
              </div>
              <p className="text-white">
                {getActivePlan() || 'Free Plan'}
              </p>
              {subscription?.current_period_end && (
                <p className="text-gray-400 text-sm mt-1">
                  Renews {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300 font-medium">Two-Factor Auth</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  is2FAEnabled 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button
                onClick={() => setShowTwoFactorSetup(true)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                {is2FAEnabled ? 'Manage 2FA Settings' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowTwoFactorSetup(true)}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Security Settings
          </button>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};