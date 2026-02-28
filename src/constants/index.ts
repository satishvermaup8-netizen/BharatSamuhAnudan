export const INSTALLMENT_AMOUNT = 100;
export const MAX_GROUP_MEMBERS = 1000;
export const TOTAL_INSTALLMENTS = 32;

export const WALLET_SPLIT_PERCENTAGE = {
  staff: 20,
  group: 50,
  consolidated: 10,
  management: 20,
} as const;

export const WALLET_SPLIT_AMOUNT = {
  staff: 20,
  group: 50,
  consolidated: 10,
  management: 20,
} as const;

export const ROLES = {
  MEMBER: 'member',
  GROUP_ADMIN: 'group_admin',
  SUPER_ADMIN: 'super_admin',
  FINANCE_ADMIN: 'finance_admin',
  SUPPORT_ADMIN: 'support_admin',
} as const;

export const KYC_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const CLAIM_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  MY_GROUPS: '/my-groups',
  TRANSACTIONS: '/transactions',
  WALLET: '/wallet',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_APPROVALS: '/admin/approvals',
  ADMIN_USERS: '/admin/users',
  ADMIN_GROUPS: '/admin/groups',
  ADMIN_FUNDS: '/admin/funds',
  ADMIN_CLAIMS: '/admin/claims',
  ADMIN_LOGS: '/admin/logs',
} as const;