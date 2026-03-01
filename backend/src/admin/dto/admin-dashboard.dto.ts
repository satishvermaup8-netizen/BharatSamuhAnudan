export interface DashboardStatsDto {
  // User Stats
  totalUsers: number;
  activeMembers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;

  // Group Stats
  totalGroups: number;
  activeGroups: number;
  pendingGroupApprovals: number;

  // Financial Stats
  totalFunds: number;
  totalWalletBalance: number;
  totalDonations: number;
  totalInstallments: number;
  totalCollected: number;
  totalDisbursed: number;

  // Pending Items
  pendingKyc: number;
  pendingDeathClaims: number;
  pendingApprovals: number;

  // System Health
  systemHealth: SystemHealthDto;

  // Trends
  userGrowthTrend: TrendDataDto[];
  financialTrend: FinancialTrendDto[];
  groupActivityTrend: TrendDataDto[];
}

export interface SystemHealthDto {
  status: 'healthy' | 'warning' | 'critical';
  apiLatency: number;
  databaseStatus: 'connected' | 'degraded' | 'disconnected';
  lastBackupAt: Date | null;
  activeSessions: number;
  errorRate: number;
}

export interface TrendDataDto {
  date: string;
  value: number;
  label?: string;
}

export interface FinancialTrendDto {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
}

export interface PendingApprovalsDto {
  kycCount: number;
  groupCount: number;
  claimCount: number;
  totalCount: number;
}

export interface RealTimeStatsDto {
  onlineUsers: number;
  activeSessions: number;
  transactionsLastHour: number;
  currentLoad: number;
}

export interface ChartDataDto {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}
