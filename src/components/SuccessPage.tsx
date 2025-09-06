import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

export const SuccessPage: React.FC = () => {
  const { getActivePlan } = useSubscription();

  useEffect(() => {
    // Add some confetti or celebration animation here if desired
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-8 w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="p-4 bg-green-500/20 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-400 mb-6">
            Welcome to {getActivePlan() || 'QuantumSecure Premium'}! Your subscription is now active and you have access to all premium features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4 mb-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Premium Features Unlocked</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Unlimited quantum key generation</li>
            <li>• Advanced threat analysis</li>
            <li>• Priority support</li>
            <li>• API access</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          
          <Link
            to="/pricing"
            className="inline-block w-full py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            View Subscription Details
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xs text-gray-500"
        >
          You will receive a confirmation email shortly with your subscription details.
        </motion.div>
      </motion.div>
    </div>
  );
};