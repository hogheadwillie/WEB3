import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { use2FA } from './use2FA';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const check2FARequired = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('is_enabled')
        .eq('user_id', user.id)
        .maybeSingle();

      return data?.is_enabled || false;
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user && !error) {
      const needs2FA = await check2FARequired(data.user);
      if (needs2FA) {
        // Sign out immediately and require 2FA
        await supabase.auth.signOut();
        setPendingUser(data.user);
        setRequires2FA(true);
        return { data: { ...data, user: null }, error: null };
      }
    }

    return { data, error };
  };

  const complete2FALogin = () => {
    if (pendingUser) {
      setUser(pendingUser);
      setPendingUser(null);
      setRequires2FA(false);
    }
  };

  const cancel2FALogin = () => {
    setPendingUser(null);
    setRequires2FA(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setRequires2FA(false);
    setPendingUser(null);
    return { error };
  };

  return {
    user,
    loading,
    requires2FA,
    pendingUser,
    signUp,
    signIn,
    signOut,
    complete2FALogin,
    cancel2FALogin,
  };
};