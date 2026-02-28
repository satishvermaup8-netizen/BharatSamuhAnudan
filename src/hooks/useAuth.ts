import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, signOut, verifyOTP, signUpWithEmail } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check for existing session
    getCurrentUser().then(currentUser => {
      if (mounted) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    // Listen for auth state changes
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
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await verifyOTP(mobile, password);
      setUser(loggedInUser);
      return true;
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; mobile: string; password: string }): Promise<boolean> => {
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
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}