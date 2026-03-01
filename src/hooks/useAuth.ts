import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { getCurrentUser, signOut, verifyOTP, signUpWithEmail, hasRegisteredUsers, isMobileRegistered } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage or Supabase on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const currentUser = await getCurrentUser();
      if (mounted) {
        setUser(currentUser);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      }
    );

    // Listen for localStorage changes (for demo auth across tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user') {
        console.log('localStorage auth_user changed, re-initializing...');
        initializeAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom auth change events (same tab)
    const handleAuthChange = () => {
      console.log('Auth change event received, re-initializing...');
      initializeAuth();
    };
    window.addEventListener('auth_change', handleAuthChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_change', handleAuthChange);
    };
  }, []);

  const login = useCallback(async (mobile: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await verifyOTP(mobile, password);
      setUser(loggedInUser);
      // Dispatch custom event to notify other components about auth change
      window.dispatchEvent(new Event('auth_change'));
      return true;
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; mobile: string; password: string }): Promise<boolean> => {
    try {
      const newUser = await signUpWithEmail(userData.email, userData.password, {
        name: userData.name,
        mobile: userData.mobile,
      });
      setUser(newUser);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    // Dispatch custom event to notify other components about auth change
    window.dispatchEvent(new Event('auth_change'));
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRegisteredUsers: hasRegisteredUsers(),
    isMobileRegistered,
  };
}