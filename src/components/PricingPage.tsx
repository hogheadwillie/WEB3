import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, AlertCircle } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../lib/supabase';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isActive } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      setError('Please sign in to subscribe');
      return;
    }

    setLoading(priceId);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode: 'subscription',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Security Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upgrade to premium quantum encryption and unlock advanced security features
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/20 p-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-400 mb-4">$0</div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Basic network monitoring</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">10 quantum keys per day</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Basic threat detection</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Community support</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed font-medium"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Premium Plan */}
          {STRIPE_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-purple-500/30 p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  ${product.price}
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">{product.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">Advanced quantum encryption</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">Unlimited quantum keys</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">Real-time threat analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">API access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">Custom integrations</span>
                </li>
              </ul>

              {isActive() && subscription?.price_id === product.priceId ? (
                <div className="w-full py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-center font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Active Subscription</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(product.priceId)}
                  disabled={loading === product.priceId || !user}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading === product.priceId ? (
                    'Processing...'
                  ) : !user ? (
                    'Sign In to Subscribe'
                  ) : (
                    'Upgrade Now'
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {user && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              All plans include a 30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};