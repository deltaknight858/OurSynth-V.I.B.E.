// PROMOTED from import-staging/src/authContext.tsx on 2025-09-08T20:34:32.056Z
// TODO: Review for token + design lint compliance.
"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session?.();
    setUser(session?.user ?? null);
    setLoading(false);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.unsubscribe?.(); };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
