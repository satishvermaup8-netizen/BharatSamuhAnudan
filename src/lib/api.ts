import { supabase } from './supabase';
import { getAuthToken } from './auth';
import { User, Group, Transaction, Wallet, Installment, DeathClaim, AdminApproval, Nominee } from '@/types';

// =====================================================
// USER PROFILES & KYC
// =====================================================

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function submitKYC(kycData: {
  aadhaarNumber: string;
  panNumber: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankAccountHolder: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      aadhaar_number: kycData.aadhaarNumber,
      pan_number: kycData.panNumber,
      bank_account_number: kycData.bankAccountNumber,
      bank_ifsc: kycData.bankIfsc,
      bank_account_holder: kycData.bankAccountHolder,
      address: kycData.address,
      city: kycData.city,
      state: kycData.state,
      pincode: kycData.pincode,
      kyc_status: 'under_review',
      kyc_submitted_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;

  // Create admin approval request
  await supabase.from('admin_approvals').insert({
    type: 'kyc',
    entity_id: user.id,
    submitted_by: user.id,
  });

  return data;
}

// Get KYC documents
export async function getKYCDocuments(userId: string) {
  const { data, error } = await supabase
    .from('kyc_documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Upload KYC document
export async function uploadKYCDocument(
  userId: string,
  documentType: string,
  file: File
) {
  // Upload to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('kyc-documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('kyc-documents')
    .getPublicUrl(fileName);

  // Create document record
  const { data, error } = await supabase
    .from('kyc_documents')
    .insert({
      user_id: userId,
      document_type: documentType,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      upload_status: 'uploaded',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// API Base URL configuration from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface S3UploadResult {
  success: boolean;
  message: string;
  data: {
    url: string;
    key: string;
    documentType: string;
  };
}

// Upload KYC document to AWS S3 via backend
export async function uploadToS3(
  documentType: string,
  file: File
): Promise<S3UploadResult> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  // Create abort controller for timeout (30 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/uploads/kyc`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      signal: controller.signal,
      credentials: 'include', // Include cookies for cross-origin requests if needed
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Upload failed (${response.status})`;
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorText;
          } catch {
            // Use text response if not valid JSON
            errorMessage = errorText;
          }
        }
      } catch {
        // If reading the response fails, use status-based message
        errorMessage = `Upload failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out. Please try again.');
    }
    throw error;
  }
}

// =====================================================
// GROUPS
// =====================================================

export async function getGroups(filters?: { status?: string; leaderId?: string }) {
  let query = supabase
    .from('groups')
    .select(`
      *,
      leader:user_profiles!groups_leader_id_fkey(id, username, email)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.leaderId) {
    query = query.eq('leader_id', filters.leaderId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getGroup(groupId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      leader:user_profiles!groups_leader_id_fkey(id, username, email),
      members:group_members(
        *,
        user:user_profiles(id, username, email)
      )
    `)
    .eq('id', groupId)
    .single();

  if (error) throw error;
  return data;
}

export async function getGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      user:user_profiles(id, username, email)
    `)
    .eq('group_id', groupId)
    .order('joined_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getGroupRoles(groupId: string) {
  const { data, error } = await supabase
    .from('group_roles')
    .select('*, user:user_profiles(*)')
    .eq('group_id', groupId);

  if (error) throw error;
  return data || [];
}

export async function createGroup(groupData: {
  name: string;
  description: string;
  photo?: string;
  location: string;
  city: string;
  state: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate unique group code
  const groupCode = generateGroupCode(groupData.name);

  const { data, error } = await supabase
    .from('groups')
    .insert({
      ...groupData,
      group_code: groupCode,
      leader_id: user.id,
      status: 'pending_approval',
    })
    .select()
    .single();

  if (error) throw error;

  // Add leader as first member
  await supabase.from('group_members').insert({
    group_id: data.id,
    user_id: user.id,
  });

  // Create approval request
  await supabase.from('admin_approvals').insert({
    type: 'group',
    entity_id: data.id,
    submitted_by: user.id,
  });

  return data;
}

// Create group via backend API
export interface CreateGroupBackendData {
  name: string;
  description: string;
  location: string;
  contributionAmount: number;
  groupType: 'savings' | 'emergency' | 'business';
  maxMembers: number;
  leaderId: string;
}

export interface CreateGroupResponse {
  id: string;
  name: string;
  description: string;
  location: string;
  groupCode: string;
  contributionAmount: number;
  groupType: string;
  maxMembers: number;
  leaderId: string;
  status: string;
  createdAt: string;
}

export async function createGroupBackend(groupData: CreateGroupBackendData): Promise<CreateGroupResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Failed to create group (${response.status})`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

export async function joinGroup(groupId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Update group member count
  await supabase.rpc('increment_group_member_count', { group_id: groupId });

  // Create installments for new member
  await createInstallmentsForMember(user.id, groupId);

  return data;
}

// =====================================================
// WALLETS
// =====================================================

export async function getUserWallets(userId: string) {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function getGroupWallet(groupId: string) {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('group_id', groupId)
    .eq('type', 'group')
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// TRANSACTIONS
// =====================================================

export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      group:groups(id, name, group_code)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(transactionData: {
  groupId: string;
  amount: number;
  type: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  description?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      group_id: transactionData.groupId,
      amount: transactionData.amount,
      type: transactionData.type,
      payment_method: transactionData.paymentMethod,
      razorpay_order_id: transactionData.razorpayOrderId,
      description: transactionData.description,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransactionStatus(
  transactionId: string,
  status: string,
  paymentId?: string,
  signature?: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;

  // If completed, update wallets
  if (status === 'completed') {
    await splitPaymentToWallets(transactionId);
  }

  return data;
}

// =====================================================
// INSTALLMENTS
// =====================================================

export async function getUserInstallments(userId: string, groupId: string) {
  const { data, error } = await supabase
    .from('installments')
    .select('*')
    .eq('user_id', userId)
    .eq('group_id', groupId)
    .order('installment_number', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createInstallmentsForMember(userId: string, groupId: string) {
  const installments = Array.from({ length: 32 }, (_, i) => ({
    user_id: userId,
    group_id: groupId,
    installment_number: i + 1,
    amount: 100,
    due_date: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
  }));

  const { data, error } = await supabase.from('installments').insert(installments);
  if (error) throw error;
  return data;
}

export async function markInstallmentPaid(installmentId: string, transactionId: string) {
  const { data, error } = await supabase
    .from('installments')
    .update({
      status: 'paid',
      paid_date: new Date().toISOString(),
      transaction_id: transactionId,
    })
    .eq('id', installmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// NOMINEES
// =====================================================

export async function getNominees(userId: string) {
  const { data, error } = await supabase
    .from('nominees')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data || [];
}

export async function createNominee(nomineeData: any) {
  const { data, error } = await supabase
    .from('nominees')
    .insert(nomineeData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNominee(nomineeId: string, nomineeData: any) {
  const { data, error } = await supabase
    .from('nominees')
    .update(nomineeData)
    .eq('id', nomineeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNominee(nomineeId: string) {
  const { error } = await supabase
    .from('nominees')
    .delete()
    .eq('id', nomineeId);

  if (error) throw error;
}

// =====================================================
// DEATH CLAIMS
// =====================================================

export async function getDeathClaims(filters?: { status?: string }) {
  let query = supabase
    .from('death_claims')
    .select(`
      *,
      user:user_profiles!death_claims_user_id_fkey(id, username, email),
      group:groups(id, name, group_code),
      nominee:nominees(id, name, relationship),
      documents:claim_documents(*)
    `)
    .order('submitted_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function submitDeathClaim(claimData: {
  userId: string;
  groupId: string;
  nomineeId: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Calculate claim amount (32 installments × ₹100)
  const claimAmount = 3200;

  const { data, error } = await supabase
    .from('death_claims')
    .insert({
      user_id: claimData.userId,
      group_id: claimData.groupId,
      nominee_id: claimData.nomineeId,
      claim_amount: claimAmount,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Create approval request
  await supabase.from('admin_approvals').insert({
    type: 'death_claim',
    entity_id: data.id,
    submitted_by: user.id,
  });

  return data;
}

// =====================================================
// ADMIN APPROVALS
// =====================================================

export async function getAdminApprovals(filters?: { status?: string; type?: string }) {
  let query = supabase
    .from('admin_approvals')
    .select(`
      *,
      submitter:user_profiles!admin_approvals_submitted_by_fkey(id, username, email)
    `)
    .order('submitted_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function approveRequest(approvalId: string, notes?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('admin_approvals')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      review_notes: notes,
    })
    .eq('id', approvalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rejectRequest(approvalId: string, notes: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('admin_approvals')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      review_notes: notes,
    })
    .eq('id', approvalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// DASHBOARD STATS
// =====================================================

export async function getDashboardStats() {
  const [usersCount, groupsCount, transactionsSum, claimsCount] = await Promise.all([
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('groups').select('id', { count: 'exact', head: true }),
    supabase.from('transactions').select('amount').eq('status', 'completed'),
    supabase.from('death_claims').select('id', { count: 'exact' }).eq('status', 'pending'),
  ]);

  const totalFunds = transactionsSum.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return {
    totalUsers: usersCount.count || 0,
    totalGroups: groupsCount.count || 0,
    totalFunds,
    pendingClaims: claimsCount.count || 0,
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function generateGroupCode(groupName: string): string {
  const prefix = groupName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${suffix}`;
}

async function splitPaymentToWallets(transactionId: string) {
  // Get transaction details
  const { data: transaction } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (!transaction) return;

  const amount = Number(transaction.amount);
  const split = {
    staff: amount * 0.2,      // 20%
    group: amount * 0.5,      // 50%
    consolidated: amount * 0.1,  // 10%
    management: amount * 0.2,    // 20%
  };

  // Update wallet split in transaction
  await supabase
    .from('transactions')
    .update({ wallet_split: split })
    .eq('id', transactionId);

  // Update staff wallet
  await supabase.rpc('update_wallet_balance', {
    p_user_id: transaction.user_id,
    p_type: 'staff',
    p_amount: split.staff,
  });

  // Update group wallet
  if (transaction.group_id) {
    await supabase.rpc('update_group_wallet_balance', {
      p_group_id: transaction.group_id,
      p_amount: split.group,
    });
  }

  console.log('Payment split completed:', split);
}

// =====================================================
// INVITATIONS
// =====================================================

export interface CreateInvitationData {
  groupId: string;
  inviteMethod: 'mobile' | 'user_id' | 'email';
  inviteValue: string;
  message?: string;
}

export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedByName: string;
  inviteMethod: string;
  inviteValue: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export async function createInvitation(data: CreateInvitationData): Promise<Invitation> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Failed to send invitation (${response.status})`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

export async function getMyInvitations(): Promise<Invitation[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }

  const response = await fetch(`${API_BASE_URL}/api/invitations/my-invitations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch invitations');
  }

  return response.json();
}

export async function respondToInvitation(invitationId: string, response: 'accept' | 'reject'): Promise<Invitation> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_BASE_URL}/api/invitations/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ invitationId, response }),
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `Failed to respond to invitation (${res.status})`;
      try {
        const errorJson = await res.json();
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}
