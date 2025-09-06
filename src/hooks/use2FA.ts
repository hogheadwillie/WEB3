import { useState, useEffect, useCallback } from 'react';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface TwoFactorSettings {
  id: string;
  user_id: string;
  secret: string;
  is_enabled: boolean;
  backup_codes: string[];
  created_at: string;
  updated_at: string;
}

export const use2FA = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const fetchSettings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching 2FA settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const generateSecret = useCallback(() => {
    const newSecret = authenticator.generateSecret();
    setSecret(newSecret);
    return newSecret;
  }, []);

  const generateQRCode = useCallback(async (secret: string) => {
    if (!user) return '';

    const serviceName = 'QuantumSecure';
    const accountName = user.email;
    const otpauth = authenticator.keyuri(accountName, serviceName, secret);
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
      setQrCodeUrl(qrCodeDataUrl);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }, [user]);

  const generateBackupCodes = useCallback(() => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    setBackupCodes(codes);
    return codes;
  }, []);

  const verifyToken = useCallback((token: string, secret?: string) => {
    const secretToUse = secret || settings?.secret;
    if (!secretToUse) return false;

    try {
      return authenticator.verify({ token, secret: secretToUse });
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }, [settings]);

  const verifyBackupCode = useCallback(async (code: string) => {
    if (!settings || !user) return false;

    const normalizedCode = code.toUpperCase().trim();
    const isValidCode = settings.backup_codes.includes(normalizedCode);

    if (isValidCode) {
      // Remove the used backup code
      const updatedCodes = settings.backup_codes.filter(c => c !== normalizedCode);
      
      try {
        const { error } = await supabase
          .from('user_2fa_settings')
          .update({ backup_codes: updatedCodes })
          .eq('user_id', user.id);

        if (error) throw error;

        setSettings(prev => prev ? { ...prev, backup_codes: updatedCodes } : null);
        return true;
      } catch (error) {
        console.error('Error updating backup codes:', error);
        return false;
      }
    }

    return false;
  }, [settings, user]);

  const enable2FA = useCallback(async (secret: string, token: string) => {
    if (!user) throw new Error('User not authenticated');

    // Verify the token first
    if (!authenticator.verify({ token, secret })) {
      throw new Error('Invalid verification code');
    }

    const codes = generateBackupCodes();

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .upsert({
          user_id: user.id,
          secret,
          is_enabled: true,
          backup_codes: codes
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      setBackupCodes(codes);
      return data;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw error;
    }
  }, [user, generateBackupCodes]);

  const disable2FA = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('user_2fa_settings')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(null);
      setSecret('');
      setQrCodeUrl('');
      setBackupCodes([]);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      throw error;
    }
  }, [user]);

  const regenerateBackupCodes = useCallback(async () => {
    if (!user || !settings) throw new Error('2FA not enabled');

    const newCodes = generateBackupCodes();

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .update({ backup_codes: newCodes })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      setBackupCodes(newCodes);
      return newCodes;
    } catch (error) {
      console.error('Error regenerating backup codes:', error);
      throw error;
    }
  }, [user, settings, generateBackupCodes]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    qrCodeUrl,
    secret,
    backupCodes,
    isEnabled: settings?.is_enabled || false,
    generateSecret,
    generateQRCode,
    verifyToken,
    verifyBackupCode,
    enable2FA,
    disable2FA,
    regenerateBackupCodes,
    fetchSettings
  };
};