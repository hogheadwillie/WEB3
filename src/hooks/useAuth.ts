import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const skipAuthChangeRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!skipAuthChangeRef.current) {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const check2FARequired = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('is_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) return false;
      return data?.is_enabled || false;
    } catch {
      return false;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user && !error) {
      const needs2FA = await check2FARequired(data.user.id);
      if (needs2FA) {
        // Keep the Supabase session active (so we can query 2FA settings),
        // but don't expose the user in React state until 2FA is verified.
        skipAuthChangeRef.current = true;
        setPendingUser(data.user);
        setRequires2FA(true);
        setUser(null);
        return { data: { ...data, user: null }, error: null };
      }
    }

    return { data, error };
  }, [check2FARequired]);

  const complete2FALogin = useCallback(async () => {
    // Re-enable onAuthStateChange and set the user from the existing session
    skipAuthChangeRef.current = false;
    setRequires2FA(false);
    if (pendingUser) {
      setUser(pendingUser);
      setPendingUser(null);
    }
  }, [pendingUser]);

  const cancel2FALogin = useCallback(async () => {
    await supabase.auth.signOut();
    skipAuthChangeRef.current = false;
    setRequires2FA(false);
    setPendingUser(null);
    setUser(null);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setRequires2FA(false);
    setPendingUser(null);
    skipAuthChangeRef.current = false;
    return { error };
  }, []);

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
