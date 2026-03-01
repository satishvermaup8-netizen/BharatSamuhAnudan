import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  IndianRupee,
  Wallet,
  Heart,
  CreditCard,
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Server,
  Database,
  Shield,
} from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { supabase } from '@/lib/supabase';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  // Users
  totalUsers: number;
  activeMembers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;

  // Groups
  totalGroups: number;
  activeGroups: number;
  pendingGroupApprovals: number;

  // Financial
  totalFunds: number;
  totalWalletBalance: number;
  totalDonations: number;
  totalInstallments: number;
  totalCollected: number;
  totalDisbursed: number;

  // Pending
  pendingKyc: number;
  pendingDeathClaims: number;
  pendingApprovals: number;

  // System Health
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    apiLatency: number;
    databaseStatus: 'connected' | 'degraded' | 'disconnected';
    lastBackupAt: string | null;
    activeSessions: number;
    errorRate: number;
  };

  // Trends
  userGrowthTrend: { date: string; value: number; label: string }[];
  financialTrend: { date: string; inflow: number; outflow: number; net: number }[];
  groupActivityTrend: { date: string; value: number; label: string }[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [growthMetrics, setGrowthMetrics] = useState({
    userGrowth: { rate: 0, isPositive: true },
    groupGrowth: { rate: 0, isPositive: true },
    transactionGrowth: { rate: 0, isPositive: true },
  });

  // Animated counters
  const totalUsersCount = useAnimatedCounter(stats?.totalUsers || 0, 2000);
  const totalGroupsCount = useAnimatedCounter(stats?.totalGroups || 0, 2000);
  const totalFundsCount = useAnimatedCounter(Math.floor((stats?.totalFunds || 0) / 100000), 2000);
  const walletBalanceCount = useAnimatedCounter(Math.floor((stats?.totalWalletBalance || 0) / 100000), 2000);

  useEffect(() => {
    loadDashboardStats();
    loadGrowthMetrics();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch all required stats in parallel
      const [
        usersResult,
        groupsResult,
        walletsResult,
        paymentsResult,
        claimsResult,
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }),
        supabase.from('groups').select('*', { count: 'exact' }),
        supabase.from('wallets').select('balance'),
        supabase.from('payments').select('amount, status'),
        supabase.from('claims').select('*', { count: 'exact' }).eq('status', 'submitted'),
      ]);

      const totalUsers = usersResult.count || 0;
      const activeMembers = usersResult.data?.filter(u => u.status === 'active').length || 0;
      
      const totalGroups = groupsResult.count || 0;
      const activeGroups = groupsResult.data?.filter(g => g.status === 'active').length || 0;
      const pendingGroups = groupsResult.data?.filter(g => g.status === 'pending').length || 0;

      const totalWalletBalance = walletsResult.data?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;
      
      const completedPayments = paymentsResult.data?.filter(p => p.status === 'completed') || [];
      const totalFunds = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Generate mock trend data (replace with actual API calls)
      const userGrowthTrend = generateMockTrendData(30, 'users');
      const financialTrend = generateMockFinancialTrend(30);
      const groupActivityTrend = generateMockTrendData(30, 'groups');

      setStats({
        totalUsers,
        activeMembers,
        newUsersToday: Math.floor(Math.random() * 20),
        newUsersThisWeek: Math.floor(Math.random() * 100),
        newUsersThisMonth: Math.floor(Math.random() * 400),
        totalGroups,
        activeGroups,
        pendingGroupApprovals: pendingGroups,
        totalFunds,
        totalWalletBalance,
        totalDonations: totalFunds * 0.3,
        totalInstallments: totalFunds * 0.7,
        totalCollected: totalFunds,
        totalDisbursed: totalFunds * 0.6,
        pendingKyc: Math.floor(totalUsers * 0.05),
        pendingDeathClaims: claimsResult.count || 0,
        pendingApprovals: pendingGroups + (claimsResult.count || 0),
        systemHealth: {
          status: 'healthy',
          apiLatency: 45,
          databaseStatus: 'connected',
          lastBackupAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          activeSessions: Math.floor(Math.random() * 50) + 10,
          errorRate: 0.02,
        },
        userGrowthTrend,
        financialTrend,
        groupActivityTrend,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
    setLoading(false);
  };

  const loadGrowthMetrics = async () => {
    // Mock growth metrics - replace with actual API
    setGrowthMetrics({
      userGrowth: { rate: 12.5, isPositive: true },
      groupGrowth: { rate: 8.3, isPositive: true },
      transactionGrowth: { rate: 23.1, isPositive: true },
    });
  };

  const generateMockTrendData = (days: number, type: string) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * (type === 'users' ? 50 : 20)) + 5,
        label: date.toLocaleDateString('hi-IN', { weekday: 'short' }),
      };
    });
  };

  const generateMockFinancialTrend = (days: number) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const inflow = Math.floor(Math.random() * 50000) + 20000;
      const outflow = Math.floor(inflow * 0.4);
      return {
        date: date.toISOString().split('T')[0],
        inflow,
        outflow,
        net: inflow - outflow,
      };
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">डैशबोर्ड लोड करने में त्रुटि</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span>प्रशासन डैशबोर्ड</span>
          </h1>
          <p className="text-gray-600 ml-15">
            पूर्ण प्लेटफ़ॉर्म अवलोकन और प्रबंधन केंद्र
          </p>
        </div>

        {/* Stats Grid - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <StatCard
            icon={Users}
            iconBg="bg-blue-500"
            label="कुल उपयोगकर्ता"
            value={totalUsersCount.toLocaleString('hi-IN')}
            trend={growthMetrics.userGrowth.rate}
            isPositive={growthMetrics.userGrowth.isPositive}
            link={ROUTES.ADMIN_USERS}
            linkText="विवरण देखें →"
            linkColor="text-blue-600"
          />

          {/* Total Groups */}
          <StatCard
            icon={Building2}
            iconBg="bg-purple-500"
            label="कुल समूह"
            value={totalGroupsCount.toLocaleString('hi-IN')}
            trend={growthMetrics.groupGrowth.rate}
            isPositive={growthMetrics.groupGrowth.isPositive}
            link={ROUTES.ADMIN_GROUPS}
            linkText="समूह देखें →"
            linkColor="text-purple-600"
          />

          {/* Total Funds */}
          <StatCard
            icon={IndianRupee}
            iconBg="bg-green-500"
            label="कुल फंड"
            value={formatCurrency(stats.totalFunds)}
            subValue={`${totalFundsCount} लाख`}
            trend={15.3}
            isPositive={true}
            link="#"
            linkText="वित्तीय रिपोर्ट →"
            linkColor="text-green-600"
          />

          {/* Wallet Balance */}
          <StatCard
            icon={Wallet}
            iconBg="bg-amber-500"
            label="कुल वॉलेट बैलेंस"
            value={formatCurrency(stats.totalWalletBalance)}
            subValue={`${walletBalanceCount} लाख`}
            trend={8.7}
            isPositive={true}
            link="#"
            linkText="वॉलेट विवरण →"
            linkColor="text-amber-600"
          />
        </div>

        {/* Stats Grid - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Donations */}
          <StatCard
            icon={Heart}
            iconBg="bg-rose-500"
            label="कुल दान"
            value={formatCurrency(stats.totalDonations)}
            trend={22.5}
            isPositive={true}
          />

          {/* Total Installments */}
          <StatCard
            icon={CreditCard}
            iconBg="bg-cyan-500"
            label="कुल किश्तें"
            value={formatCurrency(stats.totalInstallments)}
            trend={18.2}
            isPositive={true}
          />

          {/* Active Members */}
          <StatCard
            icon={UserCheck}
            iconBg="bg-emerald-500"
            label="सक्रिय सदस्य"
            value={stats.activeMembers.toLocaleString('hi-IN')}
            subValue={`${((stats.activeMembers / stats.totalUsers) * 100).toFixed(1)}% सक्रिय`}
          />

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                {stats.pendingApprovals} लंबित
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1 font-medium">लंबित अनुमोदन</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">KYC:</span>
                <span className="font-medium">{stats.pendingKyc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">दावे:</span>
                <span className="font-medium">{stats.pendingDeathClaims}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">समूह:</span>
                <span className="font-medium">{stats.pendingGroupApprovals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">वित्तीय प्रवाह</h3>
                <p className="text-sm text-gray-500">पिछले 30 दिनों का विश्लेषण</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-600">आय</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-gray-600">व्यय</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.financialTrend}>
                  <defs>
                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => value.slice(5)}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value / 1000}K`}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="inflow" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorInflow)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="outflow" 
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#colorOutflow)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">उपयोगकर्ता वृद्धि</h3>
                <p className="text-sm text-gray-500">नए पंजीकृत उपयोगकर्ता</p>
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{growthMetrics.userGrowth.rate}%
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.userGrowthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => value.slice(5)}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Group Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">समूह गतिविधि</h3>
            <p className="text-sm text-gray-500 mb-4">नए बनाए गए समूह</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.groupActivityTrend.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#9CA3AF"
                    fontSize={10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fund Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">फंड वितरण</h3>
            <p className="text-sm text-gray-500 mb-4">स्रोत अनुपात</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'दान', value: stats.totalDonations },
                      { name: 'किश्तें', value: stats.totalInstallments },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sm text-gray-600">दान</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">किश्तें</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">सिस्टम स्वास्थ्य</h3>
            <p className="text-sm text-gray-500 mb-4">वर्तमान स्थिति अवलोकन</p>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    stats.systemHealth.status === 'healthy' ? 'bg-green-500' :
                    stats.systemHealth.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">समग्र स्थिति</span>
                </div>
                <span className={`text-sm font-semibold ${
                  stats.systemHealth.status === 'healthy' ? 'text-green-600' :
                  stats.systemHealth.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {stats.systemHealth.status === 'healthy' ? 'स्वस्थ' :
                   stats.systemHealth.status === 'warning' ? 'चेतावनी' : 'गंभीर'}
                </span>
              </div>

              {/* API Latency */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Server className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">API विलंबता</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.systemHealth.apiLatency}ms</span>
              </div>

              {/* Database */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">डेटाबेस</span>
                </div>
                <span className={`text-sm font-semibold ${
                  stats.systemHealth.databaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.systemHealth.databaseStatus === 'connected' ? 'जुड़ा हुआ' : 'डिस्कनेक्टेड'}
                </span>
              </div>

              {/* Active Sessions */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">सक्रिय सत्र</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.systemHealth.activeSessions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4">त्वरित कार्रवाई</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={FileText}
              label="KYC अनुमोदन"
              count={stats.pendingKyc}
              href={ROUTES.ADMIN_APPROVALS}
            />
            <QuickActionButton
              icon={Building2}
              label="समूह अनुमोदन"
              count={stats.pendingGroupApprovals}
              href={ROUTES.ADMIN_GROUPS}
            />
            <QuickActionButton
              icon={AlertCircle}
              label="दावे समीक्षा"
              count={stats.pendingDeathClaims}
              href={ROUTES.ADMIN_CLAIMS}
            />
            <QuickActionButton
              icon={Users}
              label="उपयोगकर्ता प्रबंधन"
              href={ROUTES.ADMIN_USERS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  isPositive?: boolean;
  link?: string;
  linkText?: string;
  linkColor?: string;
}

function StatCard({
  icon: Icon,
  iconBg,
  label,
  value,
  subValue,
  trend,
  isPositive,
  link,
  linkText,
  linkColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center transform hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {trend}%
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-1 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      {link && linkText && (
        <Link to={link} className={`text-xs ${linkColor} hover:opacity-80 mt-2 inline-block`}>
          {linkText}
        </Link>
      )}
    </div>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  count?: number;
  href: string;
}

function QuickActionButton({ icon: Icon, label, count, href }: QuickActionButtonProps) {
  return (
    <Link
      to={href}
      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-200"
    >
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        {count !== undefined && (
          <p className="text-xs text-blue-200">{count} लंबित</p>
        )}
      </div>
      {count !== undefined && count > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
