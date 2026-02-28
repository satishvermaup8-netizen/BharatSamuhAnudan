import { supabase } from './supabase';
import { User } from '@/types';
import { DEV_MODE, AUTO_OTP } from '@/constants';

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

export async function sendOTP(mobile: string): Promise<void> {
  // For OTP authentication via mobile
  const email = `${mobile}@bharatsamuh.temp`; // Temporary email for OTP flow
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) throw error;
}

export async function verifyOTP(mobile: string, otp: string): Promise<User> {
  const email = `${mobile}@bharatsamuh.temp`;
  
  // Development mode: Skip real OTP verification
  if (DEV_MODE && otp === AUTO_OTP) {
    console.log('🔓 DEV MODE: Auto-verifying OTP');
    // In dev mode, directly sign in (bypassing real OTP check)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { 
        shouldCreateUser: true,
        data: { mobile }
      },
    });

    if (error) throw error;

    // Return mock user for dev mode
    const mockUser: User = {
      id: Date.now().toString(),
      name: mobile,
      email,
      mobile,
      role: 'member',
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Store in localStorage for dev mode
    localStorage.setItem('dev_user', JSON.stringify(mockUser));
    return mockUser;
  }
  
  // Production mode: Normal OTP verification
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error) throw error;
  if (!data.user) throw new Error('Verification failed');

  // Wait for trigger to create profile (small delay)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get user profile (should exist from trigger)
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    // If profile doesn't exist, user metadata should still work
  }

  return mapSupabaseUser(data.user, profile);
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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
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
