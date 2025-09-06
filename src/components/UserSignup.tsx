import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

export const UserSignup: React.FC = () => {
  const { user } = useAuth();
  const { getActivePlan, isActive } = useSubscription();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <User className="h-6 w-6 text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">User Registration</h2>
      </div>

      {user ? (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Welcome back!</h3>
            <p className="text-gray-400">You're signed in as {user.email}</p>
          </div>

          {isActive() ? (
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4 mb-6 border border-purple-500/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Active Subscription</span>
              </div>
              <p className="text-white font-semibold">{getActivePlan()}</p>
              <p className="text-gray-400 text-sm">You have access to all premium features</p>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-600/20">
              <p className="text-gray-400 mb-4">You're currently on the free plan</p>
              <Link
                to="/pricing"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
              >
                <CreditCard className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-400 mb-4">
              Create an account to access QuantumSecure's advanced security features
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/signup"
              className="block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
            >
              Create Account
            </Link>
            
            <Link
              to="/login"
              className="block w-full py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};