import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/auth';
import { supabase } from '@/services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...');
        const currentSession = await authService.getSession();

        if (currentSession) {
          console.log('[AuthContext] Session found:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log('[AuthContext] No session found');
        }
      } catch (err: any) {
        // Handle network errors gracefully
        if (err?.message?.includes('Network request failed')) {
          console.warn('[AuthContext] Network unavailable - continuing in offline mode');
          setError(null); // Don't show error for network issues
        } else {
          console.error('[AuthContext] Auth initialization error:', err);
          setError('Failed to initialize authentication');
        }
      } finally {
        console.log('[AuthContext] Auth initialization complete');
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('[AuthContext] Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user: newUser, session: newSession } = await authService.signup(email, password, name);
      setUser(newUser);
      setSession(newSession);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user: existingUser, session: existingSession } = await authService.login(email, password);
      setUser(existingUser);
      setSession(existingSession);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
