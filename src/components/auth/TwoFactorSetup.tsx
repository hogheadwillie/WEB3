import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Key, Copy, Download, AlertTriangle, CheckCircle, QrCode } from 'lucide-react';
import { use2FA } from '../../hooks/use2FA';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const {
    settings,
    loading,
    qrCodeUrl,
    secret,
    backupCodes,
    isEnabled,
    generateSecret,
    generateQRCode,
    verifyToken,
    enable2FA,
    disable2FA,
    regenerateBackupCodes
  } = use2FA();

  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'manage'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSecret, setCurrentSecret] = useState('');

  useEffect(() => {
    if (isEnabled) {
      setStep('manage');
    } else {
      setStep('setup');
    }
  }, [isEnabled]);

  const handleStartSetup = async () => {
    try {
      const newSecret = generateSecret();
      setCurrentSecret(newSecret);
      await generateQRCode(newSecret);
      setStep('verify');
    } catch (err) {
      setError('Failed to generate setup code');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim() || !currentSecret) return;

    setIsProcessing(true);
    setError(null);

    try {
      await enable2FA(currentSecret, verificationCode.trim());
      setSuccess('2FA has been successfully enabled!');
      setStep('backup');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setIsProcessing(true);
    try {
      await disable2FA();
      setSuccess('2FA has been disabled');
      setStep('setup');
      onComplete?.();
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!confirm('Are you sure? This will invalidate your current backup codes.')) {
      return;
    }

    setIsProcessing(true);
    try {
      await regenerateBackupCodes();
      setSuccess('New backup codes generated');
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate backup codes');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
    setTimeout(() => setSuccess(null), 2000);
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([`QuantumSecure 2FA Backup Codes\n\n${codesText}\n\nKeep these codes safe and secure!`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantumsecure-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3"
        >
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3"
        >
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400 text-sm">{success}</p>
        </motion.div>
      )}

      {step === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8"
        >
          <div className="text-center mb-8">
            <div className="p-3 bg-purple-500/20 rounded-lg inline-block mb-4">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enable Two-Factor Authentication</h2>
            <p className="text-gray-400">
              Add an extra layer of security to your QuantumSecure account
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20">
              <h3 className="text-lg font-semibold text-white mb-4">What you'll need:</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-300">An authenticator app (Google Authenticator, Authy, etc.)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <QrCode className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-300">Ability to scan QR codes or enter setup key manually</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-300">A secure place to store backup codes</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleStartSetup}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 font-medium"
              >
                Set Up 2FA
              </button>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {step === 'verify' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8"
        >
          <div className="text-center mb-8">
            <div className="p-3 bg-cyan-500/20 rounded-lg inline-block mb-4">
              <QrCode className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Scan QR Code</h2>
            <p className="text-gray-400">
              Use your authenticator app to scan this QR code
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              {qrCodeUrl && (
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              )}
              <p className="text-sm text-gray-400">
                Can't scan? Enter this code manually:
              </p>
              <div className="mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-600/20">
                <code className="text-cyan-400 text-sm break-all">{currentSecret}</code>
                <button
                  onClick={() => copyToClipboard(currentSecret)}
                  className="ml-2 p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-400 text-center text-lg tracking-widest"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isProcessing || verificationCode.length !== 6}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isProcessing ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('setup')}
                    className="flex-1 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'backup' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-8"
        >
          <div className="text-center mb-8">
            <div className="p-3 bg-green-500/20 rounded-lg inline-block mb-4">
              <Key className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Save Your Backup Codes</h2>
            <p className="text-gray-400">
              Store these codes in a safe place. You can use them to access your account if you lose your phone.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600/20 mb-6">
            <div className="grid grid-cols-2 gap-3">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded border border-gray-700/50">
                  <code className="text-green-400 font-mono">{code}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={downloadBackupCodes}
              className="flex-1 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 font-medium"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Download Codes
            </button>
            <button
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
              className="flex-1 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200 font-medium"
            >
              <Copy className="h-4 w-4 mr-2 inline" />
              Copy Codes
            </button>
            <button
              onClick={() => {
                setStep('manage');
                onComplete?.();
              }}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
            >
              Complete Setup
            </button>
          </div>
        </motion.div>
      )}

      {step === 'manage' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-8"
        >
          <div className="text-center mb-8">
            <div className="p-3 bg-green-500/20 rounded-lg inline-block mb-4">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">2FA is Enabled</h2>
            <p className="text-gray-400">
              Your account is protected with two-factor authentication
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">Two-factor authentication is active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleRegenerateBackupCodes}
                disabled={isProcessing}
                className="py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 font-medium disabled:opacity-50"
              >
                <Key className="h-4 w-4 mr-2 inline" />
                Regenerate Backup Codes
              </button>
              <button
                onClick={handleDisable2FA}
                disabled={isProcessing}
                className="py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium disabled:opacity-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2 inline" />
                Disable 2FA
              </button>
            </div>

            {settings?.backup_codes && settings.backup_codes.length > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/20">
                <h3 className="text-white font-medium mb-2">Backup Codes Status</h3>
                <p className="text-gray-400 text-sm">
                  You have {settings.backup_codes.length} unused backup codes remaining.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};