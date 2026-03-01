export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  username?: string;
  role: 'member' | 'group_admin' | 'super_admin' | 'finance_admin' | 'support_admin';
  kycStatus: 'pending' | 'verified' | 'rejected' | 'under_review';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  profilePhoto?: string;
  createdAt: string;
  updatedAt?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccount?: BankAccount;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  lastLoginAt?: string;
  kycDocuments?: KYCDocument[];
}

export interface KYCDocument {
  id: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  groupCode: string;
  photo?: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  maxMembers: number;
  totalFund: number;
  status: 'active' | 'pending_approval' | 'inactive';
  location: string;
  createdAt: string;
  members: GroupMember[];
}

export interface GroupMember {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  installmentsPaid: number;
  totalInstallments: number;
  joinedAt: string;
  status: 'active' | 'inactive';
  lastPaymentDate?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  type: 'staff' | 'group' | 'consolidated' | 'management';
  balance: number;
  totalReceived: number;
  totalWithdrawn: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  groupId?: string;
  groupName?: string;
  amount: number;
  type: 'installment' | 'death_claim' | 'withdrawal' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'razorpay' | 'upi' | 'bank_transfer';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  walletSplit?: WalletSplit;
  timestamp: string;
  description: string;
}

export interface WalletSplit {
  staff: number;
  group: number;
  consolidated: number;
  management: number;
}

export interface Installment {
  id: string;
  userId: string;
  groupId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  transactionId?: string;
}

export interface DeathClaim {
  id: string;
  userId: string;
  userName: string;
  groupId: string;
  groupName: string;
  nomineeId: string;
  nomineeName: string;
  claimAmount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  documents: ClaimDocument[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  paidAt?: string;
  rejectionReason?: string;
}

export interface ClaimDocument {
  id: string;
  type: 'death_certificate' | 'nominee_id' | 'bank_proof' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Nominee {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  mobile: string;
  address: string;
  photo?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalGroups: number;
  totalFunds: number;
  pendingClaims: number;
  activeMembers: number;
  completedTransactions: number;
  monthlyGrowth: number;
  averageGroupSize: number;
}

export interface AdminApproval {
  id: string;
  type: 'kyc' | 'group' | 'death_claim';
  entityId: string;
  entityName: string;
  submittedBy: string;
  submittedByName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerName?: string;
  comments?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}