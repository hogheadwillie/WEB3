import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Key, AlertCircle } from 'lucide-react';
import { use2FA } from '../../hooks/use2FA';

interface TwoFactorLoginProps {
  onVerified: () => void;
  onCancel: () => void;
  userEmail: string;
}

export const TwoFactorLogin: React.FC<TwoFactorLoginProps> = ({ onVerified, onCancel, userEmail }) => {
  const { verifyToken, verifyBackupCode, settings } = use2FA();
  const [verificationCode, setVerificationCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      let isValid = false;

      if (useBackupCode) {
        isValid = await verifyBackupCode(verificationCode.trim());
        if (!isValid) {
          setError('Invalid backup code');
        }
      } else {
        isValid = verifyToken(verificationCode.trim());
        if (!isValid) {
          setError('Invalid verification code');
        }
      }

      if (isValid) {
        await onVerified();
      }

    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="p-3 bg-cyan-500/20 rounded-lg inline-block mb-4">
            {useBackupCode ? (
              <Key className="h-8 w-8 text-cyan-400" />
            ) : (
              <Smartphone className="h-8 w-8 text-cyan-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-400">
            {useBackupCode 
              ? 'Enter one of your backup codes'
              : 'Enter the code from your authenticator app'
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Signing in as {userEmail}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {useBackupCode ? 'Backup Code' : 'Verification Code'}
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={useBackupCode ? 'Enter backup code' : 'Enter 6-digit code'}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-400 text-center text-lg tracking-widest"
              maxLength={useBackupCode ? 8 : 6}
              required
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || !verificationCode.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setVerificationCode('');
                setError(null);
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
            >
              {useBackupCode 
                ? 'Use authenticator app instead'
                : 'Use backup code instead'
              }
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              Back to login
            </button>
          </div>
        </form>

        {settings?.backup_codes && settings.backup_codes.length === 0 && useBackupCode && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm text-center">
              You have no backup codes remaining. Please use your authenticator app.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};