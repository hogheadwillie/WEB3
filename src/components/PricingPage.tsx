import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Star, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      // Redirect to signup if not authenticated
      window.location.href = '/signup';
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: 'price_1S1XvP3Q3A8giusRTENwkc12',
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode: 'subscription'
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Choose Your Security Level
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Protect your digital assets with quantum-grade security. Start free or upgrade for advanced features.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-600/20 p-8 relative"
          >
            <div className="text-center mb-8">
              <div className="p-3 bg-blue-500/20 rounded-lg inline-block mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-blue-400 mb-2">$0</div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Basic network monitoring</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Limited quantum key generation</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Basic security analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Community support</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Web3 wallet integration</span>
              </li>
            </ul>

            {user ? (
              <div className="text-center">
                <div className="px-6 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg font-medium">
                  Current Plan
                </div>
              </div>
            ) : (
              <Link
                to="/signup"
                className="block w-full py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 font-medium text-center"
              >
                Get Started Free
              </Link>
            )}
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg inline-block mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Advanced Quantum Encryption</h3>
              <div className="text-4xl font-bold text-purple-400 mb-2">$40</div>
              <p className="text-gray-400">per month</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Everything in Free plan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Unlimited quantum key generation</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Advanced threat analysis & AI detection</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Real-time security monitoring</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Priority support & dedicated assistance</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">API access & custom integrations</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Advanced compliance reporting</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Enterprise-grade security features</span>
              </li>
            </ul>

            {user ? (
              isActive() ? (
                <div className="text-center">
                  <div className="px-6 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-medium flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Active Subscription</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>{isLoading ? 'Processing...' : 'Upgrade Now'}</span>
                </button>
              )
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>{isLoading ? 'Processing...' : 'Subscribe Now'}</span>
                </button>
                <p className="text-center text-gray-400 text-sm">
                  <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Create account
                  </Link>
                  {' '}to get started
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-600/20 p-8"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Why Choose QuantumSecure Premium?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-purple-500/20 rounded-lg inline-block mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Quantum-Grade Security</h4>
              <p className="text-gray-400 text-sm">
                Advanced quantum encryption algorithms that are resistant to future quantum computer attacks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-cyan-500/20 rounded-lg inline-block mb-4">
                <Zap className="h-8 w-8 text-cyan-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Real-Time Protection</h4>
              <p className="text-gray-400 text-sm">
                Continuous monitoring and instant threat detection with AI-powered analysis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-green-500/20 rounded-lg inline-block mb-4">
                <Star className="h-8 w-8 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Enterprise Support</h4>
              <p className="text-gray-400 text-sm">
                Priority support with dedicated security experts and custom integration assistance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/30 rounded-lg p-6 text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Is my data secure?</h4>
              <p className="text-gray-400 text-sm">
                Absolutely. We use quantum-grade encryption and follow industry best practices to protect your data.
              </p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 text-left">
              <h4 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400 text-sm">
                We offer a 30-day money-back guarantee for new subscribers who are not satisfied with our service.
              </p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 text-left">
              <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and cryptocurrency payments through Stripe.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};