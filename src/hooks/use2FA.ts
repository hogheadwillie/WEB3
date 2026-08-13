import { useState, useEffect, useCallback } from 'react';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface TwoFactorSettings {
  id: string;
  user_id: string;
  secret: string;
  is_enabled: boolean;
  backup_codes: string[];
  created_at: string;
  updated_at: string;
}

async function hashBackupCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashBackupCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map(hashBackupCode));
}

export const use2FA = (user: User | null) => {
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

      if (error) throw error;

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

  const generateQRCode = useCallback(async (secretToUse: string) => {
    if (!user?.email) return '';

    const serviceName = 'QuantumSecure';
    const otpauth = authenticator.keyuri(user.email, serviceName, secretToUse);

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
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const bytes = new Uint8Array(8);
      crypto.getRandomValues(bytes);
      const code = Array.from(bytes)
        .map(b => b.toString(36).padStart(2, '0'))
        .join('')
        .substring(0, 8)
        .toUpperCase();
      codes.push(code);
    }
    return codes;
  }, []);

  const verifyToken = useCallback((token: string, secretOverride?: string) => {
    const secretToUse = secretOverride || settings?.secret;
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
    const hashedInput = await hashBackupCode(normalizedCode);
    const isValidCode = settings.backup_codes.includes(hashedInput);

    if (isValidCode) {
      try {
        const updatedCodes = settings.backup_codes.filter(c => c !== hashedInput);
        const { error } = await supabase
          .from('user_2fa_settings')
          .update({ backup_codes: updatedCodes })
          .eq('user_id', user.id)
          .eq('backup_codes', settings.backup_codes);

        if (error) {
          if (error.code === 'PGRST116' || error.code === '23505') {
            return false;
          }
          throw error;
        }

        setSettings(prev => prev ? { ...prev, backup_codes: updatedCodes } : null);
        return true;
      } catch (error) {
        console.error('Error updating backup codes:', error);
        return false;
      }
    }

    return false;
  }, [settings, user]);

  const enable2FA = useCallback(async (secretToUse: string, token: string) => {
    if (!user) throw new Error('User not authenticated');

    if (!authenticator.verify({ token, secret: secretToUse })) {
      throw new Error('Invalid verification code');
    }

    const codes = generateBackupCodes();
    const hashedCodes = await hashBackupCodes(codes);

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .upsert({
          user_id: user.id,
          secret: secretToUse,
          is_enabled: true,
          backup_codes: hashedCodes
        }, { onConflict: 'user_id' })
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
    const hashedCodes = await hashBackupCodes(newCodes);

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .update({ backup_codes: hashedCodes })
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
