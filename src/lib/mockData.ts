import { User, Group, Transaction, DashboardStats, Wallet, Installment, DeathClaim, AdminApproval } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    mobile: '9876543210',
    role: 'member',
    kycStatus: 'verified',
    createdAt: '2024-01-15T10:00:00Z',
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543211',
    role: 'group_admin',
    kycStatus: 'verified',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@bharatsamuh.com',
    mobile: '9999999999',
    role: 'super_admin',
    kycStatus: 'verified',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Delhi Savings Group',
    description: 'A community-based savings group for Delhi residents to support each other financially.',
    groupCode: 'DSG7X9K2',
    photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
    leaderId: '2',
    leaderName: 'Priya Sharma',
    memberCount: 450,
    maxMembers: 1000,
    totalFund: 1440000,
    status: 'active',
    location: 'New Delhi, Delhi',
    createdAt: '2024-01-10T10:00:00Z',
    members: [
      {
        id: '1',
        userId: '1',
        userName: 'Rajesh Kumar',
        installmentsPaid: 12,
        totalInstallments: 32,
        joinedAt: '2024-01-15T10:00:00Z',
        status: 'active',
        lastPaymentDate: '2024-12-15T10:00:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Mumbai United Fund',
    description: 'Supporting Mumbai families through collective savings and mutual assistance.',
    groupCode: 'MUF3P8L5',
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
    leaderId: '2',
    leaderName: 'Priya Sharma',
    memberCount: 820,
    maxMembers: 1000,
    totalFund: 2624000,
    status: 'active',
    location: 'Mumbai, Maharashtra',
    createdAt: '2024-01-05T10:00:00Z',
    members: [],
  },
  {
    id: '3',
    name: 'Bangalore Tech Savers',
    description: 'A tech community group focused on financial security and growth.',
    groupCode: 'BTS9K4M1',
    status: 'pending_approval',
    leaderId: '1',
    leaderName: 'Rajesh Kumar',
    memberCount: 125,
    maxMembers: 1000,
    totalFund: 40000,
    location: 'Bangalore, Karnataka',
    createdAt: '2024-02-20T10:00:00Z',
    members: [],
  },
];

export const mockWallets: Wallet[] = [
  {
    id: '1',
    userId: '1',
    type: 'staff',
    balance: 12000,
    totalReceived: 15000,
    totalWithdrawn: 3000,
    lastUpdated: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    type: 'group',
    balance: 30000,
    totalReceived: 30000,
    totalWithdrawn: 0,
    lastUpdated: '2024-12-15T10:00:00Z',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Rajesh Kumar',
    groupId: '1',
    groupName: 'Delhi Savings Group',
    amount: 100,
    type: 'installment',
    status: 'completed',
    paymentMethod: 'razorpay',
    razorpayOrderId: 'order_123',
    razorpayPaymentId: 'pay_456',
    walletSplit: {
      staff: 20,
      group: 50,
      consolidated: 10,
      management: 20,
    },
    timestamp: '2024-12-15T10:00:00Z',
    description: 'Monthly installment payment #12',
  },
  {
    id: '2',
    userId: '1',
    userName: 'Rajesh Kumar',
    groupId: '1',
    groupName: 'Delhi Savings Group',
    amount: 100,
    type: 'installment',
    status: 'completed',
    paymentMethod: 'razorpay',
    timestamp: '2024-11-15T10:00:00Z',
    description: 'Monthly installment payment #11',
    walletSplit: {
      staff: 20,
      group: 50,
      consolidated: 10,
      management: 20,
    },
  },
];

export const mockInstallments: Installment[] = Array.from({ length: 32 }, (_, i) => ({
  id: `inst-${i + 1}`,
  userId: '1',
  groupId: '1',
  installmentNumber: i + 1,
  amount: 100,
  dueDate: new Date(2024, i, 15).toISOString(),
  status: i < 12 ? 'paid' : i === 12 ? 'pending' : 'pending',
  paidDate: i < 12 ? new Date(2024, i, 15).toISOString() : undefined,
  transactionId: i < 12 ? `tx-${i + 1}` : undefined,
}));

export const mockDashboardStats: DashboardStats = {
  totalUsers: 45680,
  totalGroups: 156,
  totalFunds: 14592000,
  pendingClaims: 12,
  activeMembers: 42340,
  completedTransactions: 127890,
  monthlyGrowth: 18.5,
  averageGroupSize: 293,
};

export const mockDeathClaims: DeathClaim[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Rajesh Kumar',
    groupId: '1',
    groupName: 'Delhi Savings Group',
    nomineeId: 'nom-1',
    nomineeName: 'Sunita Kumar',
    claimAmount: 320000,
    status: 'under_review',
    documents: [
      {
        id: 'doc-1',
        type: 'death_certificate',
        fileName: 'death_certificate.pdf',
        fileUrl: '#',
        uploadedAt: '2024-12-20T10:00:00Z',
      },
    ],
    submittedAt: '2024-12-20T10:00:00Z',
  },
];

export const mockApprovals: AdminApproval[] = [
  {
    id: '1',
    type: 'kyc',
    entityId: '4',
    entityName: 'Amit Patel',
    submittedBy: '4',
    submittedByName: 'Amit Patel',
    status: 'pending',
    submittedAt: '2024-12-25T10:00:00Z',
  },
  {
    id: '2',
    type: 'group',
    entityId: '3',
    entityName: 'Bangalore Tech Savers',
    submittedBy: '1',
    submittedByName: 'Rajesh Kumar',
    status: 'pending',
    submittedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '3',
    type: 'death_claim',
    entityId: '1',
    entityName: 'Claim for Rajesh Kumar',
    submittedBy: 'nom-1',
    submittedByName: 'Sunita Kumar',
    status: 'pending',
    submittedAt: '2024-12-20T10:00:00Z',
  },
];

export function getMockUser(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getMockGroup(id: string): Group | undefined {
  return mockGroups.find(g => g.id === id);
}