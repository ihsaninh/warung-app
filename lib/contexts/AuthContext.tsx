import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/utils/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
