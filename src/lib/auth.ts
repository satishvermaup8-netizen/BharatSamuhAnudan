import { supabase } from './supabase';
import { User } from '@/types';

// User registry key for managing all registered users
const USERS_REGISTRY_KEY = 'app_users_registry';
const CURRENT_USER_KEY = 'auth_user';
const CURRENT_TOKEN_KEY = 'auth_token';

// Initialize/get users registry
function getUsersRegistry(): Record<string, any> {
  try {
    const registry = localStorage.getItem(USERS_REGISTRY_KEY);
    return registry ? JSON.parse(registry) : {};
  } catch (e) {
    console.error('Failed to parse users registry:', e);
    return {};
  }
}

// Save users registry
function saveUsersRegistry(registry: Record<string, any>): void {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error('Failed to save users registry:', e);
  }
}

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

// API Base URL configuration from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function verifyOTP(mobile: string, password: string): Promise<User> {
  // Password-based demo authentication with backend JWT
  const email = `${mobile}@bharatsamuh.temp`;
  
  console.log('🔍 Verifying OTP/Password for mobile:', mobile);
  
  // Get users registry
  const registry = getUsersRegistry();
  const userKey = `user_${mobile}`;
  const storedUserData = registry[userKey];
  
  let mockUser: User;
  let loginPassword: string;
  
  if (storedUserData) {
    console.log('✅ User found in registry');
    // User exists - verify password
    if (password !== storedUserData.password) {
      throw new Error('गलत पासवर्ड।');
    }
    mockUser = storedUserData.user;
    loginPassword = storedUserData.password;
  } else {
    console.log('👤 New user login - using demo password');
    // New user login - only accept demo password
    const DEMO_PASSWORD = '1234';
    if (password !== DEMO_PASSWORD) {
      throw new Error('गलत पासवर्ड। कृपया 1234 दर्ज करें।');
    }
    
    // Create mock user for demo login
    mockUser = {
      id: `user-${mobile}`,
      name: `User ${mobile}`,
      email,
      mobile,
      role: 'member',
      kycStatus: 'verified',
      createdAt: new Date().toISOString(),
    };
    loginPassword = DEMO_PASSWORD;
  }
  
  // Helper to generate a random mock token
  // Note: Mock tokens are for local development only and will NOT work with backend APIs
  const generateMockToken = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `mock-local-${timestamp}-${randomPart}`;
  };

  // Storage key for tracking mock auth status
  const MOCK_AUTH_KEY = 'bharat_mock_auth';

  // Authenticate with backend to get real JWT token
  let token: string;
  let isMockToken = false;
  const allowMockFallback = import.meta.env.VITE_ALLOW_MOCK_AUTH === 'true';
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: loginPassword }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend login failed:', response.status, errorText);
      if (!allowMockFallback) {
        throw new Error(`Authentication service unavailable. Please try again later.`);
      }
      console.warn('⚠️  FALLBACK: Using mock token (S3 uploads disabled)');
      token = generateMockToken();
      isMockToken = true;
    } else {
      const { access_token } = await response.json();
      token = access_token;
      isMockToken = false;
      console.log('✅ JWT token obtained from backend');
    }
  } catch (error) {
    console.error('❌ Backend connection error:', error);
    if (!allowMockFallback) {
      throw new Error('Authentication service unavailable. Please check your connection and try again.');
    }
    console.warn('⚠️  FALLBACK: Using mock token due to backend unavailability (S3 uploads disabled)');
    token = generateMockToken();
    isMockToken = true;
  }
  localStorage.setItem(CURRENT_TOKEN_KEY, token);
  localStorage.setItem(MOCK_AUTH_KEY, isMockToken ? 'true' : 'false');
  
  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
  console.log('✅ User logged in:', mobile);
  
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
  // Get users registry
  const registry = getUsersRegistry();
  const userKey = `user_${userData.mobile}`;
  
  // Check if user already exists
  if (registry[userKey]) {
    throw new Error('यह मोबाइल नंबर पहले से पंजीकृत है।');
  }

  // Demo mode: Create mock user
  const mockUser: User = {
    id: `user-${userData.mobile}`,
    name: userData.name,
    email,
    mobile: userData.mobile,
    role: 'member',
    kycStatus: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  // Store user in registry with password
  registry[userKey] = {
    user: mockUser,
    password: password,
    email: email,
  };
  saveUsersRegistry(registry);
  
  // Verify save was successful
  const saved = localStorage.getItem(USERS_REGISTRY_KEY);
  console.log('✅ User registered - Mobile:', userData.mobile);
  console.log('📦 Registry saved:', saved ? 'YES' : 'NO');
  
  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
  localStorage.setItem(CURRENT_TOKEN_KEY, `token-${userData.mobile}`);
  
  console.log('✅ Current user set to:', userData.mobile);
  
  return mockUser;
}

export async function signOut(): Promise<void> {
  // Clear only the current user session, not all user data
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(CURRENT_TOKEN_KEY);
  localStorage.removeItem('bharat_mock_auth');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  // Check localStorage first for demo password auth (current user)
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Verify this user still exists in registry
      const registry = getUsersRegistry();
      const userKey = `user_${user.mobile}`;
      if (registry[userKey]) {
        console.log('✅ Current user found:', user.mobile);
        return user;
      }
      // If not in registry, clear the invalid session
      localStorage.removeItem(CURRENT_USER_KEY);
      console.log('⚠️ User not found in registry, session cleared');
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem(CURRENT_USER_KEY);
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

export function getAuthToken(): string | null {
  return localStorage.getItem(CURRENT_TOKEN_KEY);
}

/**
 * Check if the current authentication is using a mock token.
 * Mock tokens are generated when the backend is unavailable and VITE_ALLOW_MOCK_AUTH is true.
 * Note: Mock tokens cannot be used for backend API calls like S3 uploads.
 */
export function isMockAuth(): boolean {
  return localStorage.getItem('bharat_mock_auth') === 'true';
}

export async function isAuthenticated(): Promise<boolean> {
  // Check localStorage first for demo auth
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
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
