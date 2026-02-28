import { supabase } from './supabase';
import { User } from '@/types';

// Map Supabase user to our User type
function mapSupabaseUser(user: any, profile?: any): User {
  return {
    id: user.id,
    name: profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || '',
    email: user.email || profile?.email || '',
    mobile: profile?.mobile || user.user_metadata?.mobile || '',
    role: profile?.role || 'member',
    kycStatus: profile?.kyc_status || 'pending',
    createdAt: user.created_at || new Date().toISOString(),
    aadhaarNumber: profile?.aadhaar_number,
    panNumber: profile?.pan_number,
  };
}

export async function verifyOTP(mobile: string, password: string): Promise<User> {
  // Password-based demo authentication (bypassed OTP rate limiting)
  const email = `${mobile}@bharatsamuh.temp`;
  
  // Simple password verification for demo
  const DEMO_PASSWORD = '1234';
  if (password !== DEMO_PASSWORD) {
    throw new Error('गलत पासवर्ड। कृपया 1234 दर्ज करें।');
  }

  // Create mock user for password auth
  const mockUser: User = {
    id: `user-${mobile}`,
    name: `User ${mobile}`,
    email,
    mobile,
    role: 'member',
    kycStatus: 'verified',
    createdAt: new Date().toISOString(),
  };
  
  // Store in localStorage for demo mode
  localStorage.setItem('auth_user', JSON.stringify(mockUser));
  localStorage.setItem('auth_token', `token-${mobile}`);
  
  return mockUser;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Login failed');

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return mapSupabaseUser(data.user, profile);
}

export async function signUpWithEmail(email: string, password: string, userData: { name: string; mobile: string }): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userData.name,
        mobile: userData.mobile,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('Registration failed');

  // Wait for trigger to create profile (small delay)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get user profile (created by trigger)
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    // Profile should exist from trigger, but continue anyway
  }

  return mapSupabaseUser(data.user, profile);
}

export async function signOut(): Promise<void> {
  // Clear localStorage for demo auth
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  // Check localStorage first for demo password auth
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
  }
  
  // Fallback to Supabase
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return mapSupabaseUser(user, profile);
}

export async function isAuthenticated(): Promise<boolean> {
  // Check localStorage first for demo auth
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) return true;
  
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export function hasRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['super_admin', 'finance_admin', 'support_admin']);
}

export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, ['super_admin']);
}
