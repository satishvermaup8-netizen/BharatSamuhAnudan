/**
 * Fund Management Types and Utilities
 * Defines data structures for fund tracking, inflows, outflows, and audit trails
 */

// Fund Types
export type FundType = 'death_claim' | 'health_insurance' | 'emergency_relief' | 'education_support' | 'general';

export interface FundAccount {
  id: string;
  type: FundType;
  name: string;
  description: string;
  balance: number;
  totalInflow: number;
  totalOutflow: number;
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'closed';
}

// Transaction Types
export type TransactionType = 'inflow' | 'outflow' | 'transfer' | 'adjustment';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';

export interface Transaction {
  id: string;
  fundId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  timestamp: string;
  initiatedBy: string;
  approvedBy?: string;
  category?: string;
  reference?: string;
}

// Inflow/Outflow Data for Charts
export interface FlowData {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
}

// Balance Trend Data
export interface BalanceTrend {
  date: string;
  balance: number;
  fundType: FundType;
}

// Distribution Data
export interface Distribution {
  fundType: FundType;
  totalDistributed: number;
  recipientCount: number;
  avgAmount: number;
  percentage: number;
}

// Audit Trail Entry
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  resourceType: 'transaction' | 'fund' | 'user' | 'report';
  resourceId: string;
  oldValue?: any;
  newValue?: any;
  initiatedBy: string;
  ipAddress?: string;
  status: 'success' | 'failure';
  details?: string;
}

// Dashboard Summary
export interface FundDashboardSummary {
  totalBalance: number;
  totalInflow: number;
  totalOutflow: number;
  netFlow: number;
  fundsTotalCount: number;
  transactionCount: number;
  lastUpdateTime: string;
  fundAccounts: FundAccount[];
  monthlyFlowData: FlowData[];
  distributionData: Distribution[];
}

// Chart Data Format
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

// Format currency with Indian rupee
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format date
export const formatTransactionDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate fund statistics
export const calculateFundStats = (fundAccounts: FundAccount[]) => {
  return {
    totalBalance: fundAccounts.reduce((sum, f) => sum + f.balance, 0),
    totalInflow: fundAccounts.reduce((sum, f) => sum + f.totalInflow, 0),
    totalOutflow: fundAccounts.reduce((sum, f) => sum + f.totalOutflow, 0),
    activeFunds: fundAccounts.filter(f => f.status === 'active').length,
  };
};

// Get fund type color
export const getFundTypeColor = (fundType: FundType): string => {
  const colors: Record<FundType, string> = {
    death_claim: '#EF4444',      // Red
    health_insurance: '#10B981', // Green
    emergency_relief: '#F59E0B', // Amber
    education_support: '#3B82F6', // Blue
    general: '#8B5CF6',          // Purple
  };
  return colors[fundType];
};

// Get fund type label
export const getFundTypeLabel = (fundType: FundType): string => {
  const labels: Record<FundType, string> = {
    death_claim: 'Death Claim Fund',
    health_insurance: 'Health Insurance Fund',
    emergency_relief: 'Emergency Relief Fund',
    education_support: 'Education Support Fund',
    general: 'General Fund',
  };
  return labels[fundType];
};

// Get transaction status badge color
export const getTransactionStatusColor = (status: TransactionStatus): string => {
  const colors: Record<TransactionStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    reversed: 'bg-gray-100 text-gray-800',
  };
  return colors[status];
};

// Generate mock data for development
export const generateMockFundData = (): FundAccount[] => [
  {
    id: 'fund_1',
    type: 'death_claim',
    name: 'Death Claim Fund',
    description: 'Fund for death claim processing',
    balance: 450000,
    totalInflow: 2500000,
    totalOutflow: 2050000,
    createdAt: '2025-01-01T00:00:00Z',
    lastUpdated: '2026-02-28T10:30:00Z',
    status: 'active',
  },
  {
    id: 'fund_2',
    type: 'health_insurance',
    name: 'Health Insurance Fund',
    description: 'Health insurance claims fund',
    balance: 320000,
    totalInflow: 1800000,
    totalOutflow: 1480000,
    createdAt: '2025-02-01T00:00:00Z',
    lastUpdated: '2026-02-28T09:45:00Z',
    status: 'active',
  },
  {
    id: 'fund_3',
    type: 'emergency_relief',
    name: 'Emergency Relief Fund',
    description: 'Emergency relief and support',
    balance: 125000,
    totalInflow: 800000,
    totalOutflow: 675000,
    createdAt: '2025-03-01T00:00:00Z',
    lastUpdated: '2026-02-28T08:20:00Z',
    status: 'active',
  },
  {
    id: 'fund_4',
    type: 'education_support',
    name: 'Education Support Fund',
    description: 'Educational assistance program',
    balance: 280000,
    totalInflow: 1200000,
    totalOutflow: 920000,
    createdAt: '2025-04-01T00:00:00Z',
    lastUpdated: '2026-02-27T16:10:00Z',
    status: 'active',
  },
];

export const generateMockFlowData = (): FlowData[] => {
  const data: FlowData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const inflow = Math.floor(Math.random() * 150000) + 50000;
    const outflow = Math.floor(Math.random() * 120000) + 30000;

    data.push({
      date: dateStr,
      inflow,
      outflow,
      net: inflow - outflow,
    });
  }

  return data;
};

export const generateMockDistributionData = (): Distribution[] => {
  const total = 7125000;
  return [
    {
      fundType: 'death_claim',
      totalDistributed: 2050000,
      recipientCount: 45,
      avgAmount: 45556,
      percentage: 0.288,
    },
    {
      fundType: 'health_insurance',
      totalDistributed: 1480000,
      recipientCount: 320,
      avgAmount: 4625,
      percentage: 0.208,
    },
    {
      fundType: 'emergency_relief',
      totalDistributed: 675000,
      recipientCount: 85,
      avgAmount: 7941,
      percentage: 0.095,
    },
    {
      fundType: 'education_support',
      totalDistributed: 920000,
      recipientCount: 120,
      avgAmount: 7667,
      percentage: 0.129,
    },
  ];
};

export const generateMockAuditTrail = (): AuditEntry[] => [
  {
    id: 'audit_1',
    timestamp: '2026-02-28T10:30:00Z',
    action: 'Fund Inflow',
    resourceType: 'transaction',
    resourceId: 'txn_1001',
    newValue: { amount: 150000, fundId: 'fund_1' },
    initiatedBy: 'admin@example.com',
    ipAddress: '192.168.1.100',
    status: 'success',
    details: 'Received group contribution',
  },
  {
    id: 'audit_2',
    timestamp: '2026-02-28T09:45:00Z',
    action: 'Fund Outflow',
    resourceType: 'transaction',
    resourceId: 'txn_1002',
    newValue: { amount: 80000, fundId: 'fund_1' },
    initiatedBy: 'processor@example.com',
    ipAddress: '192.168.1.101',
    status: 'success',
    details: 'Death claim processed #DC-2026-001',
  },
  {
    id: 'audit_3',
    timestamp: '2026-02-28T08:20:00Z',
    action: 'Report Generated',
    resourceType: 'report',
    resourceId: 'report_2026_feb',
    newValue: { reportType: 'monthly', period: '2026-02' },
    initiatedBy: 'finance@example.com',
    status: 'success',
    details: 'Monthly fund report generated',
  },
  {
    id: 'audit_4',
    timestamp: '2026-02-27T16:10:00Z',
    action: 'Balance Adjustment',
    resourceType: 'fund',
    resourceId: 'fund_2',
    oldValue: { balance: 318000 },
    newValue: { balance: 320000 },
    initiatedBy: 'admin@example.com',
    status: 'success',
    details: 'Correction for interest accrual',
  },
  {
    id: 'audit_5',
    timestamp: '2026-02-27T14:30:00Z',
    action: 'Fund Transfer',
    resourceType: 'transaction',
    resourceId: 'txn_1003',
    newValue: { amount: 50000, from: 'fund_1', to: 'fund_3' },
    initiatedBy: 'finance@example.com',
    ipAddress: '192.168.1.102',
    status: 'success',
    details: 'Emergency reserve transfer',
  },
];
