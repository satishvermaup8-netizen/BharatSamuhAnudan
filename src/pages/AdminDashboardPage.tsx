import { useEffect, useState } from 'react';
import { Users, UserCheck, Building2, IndianRupee, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { getDashboardStats, getAdminApprovals } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalFunds: 0,
    pendingClaims: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const usersCount = useAnimatedCounter(stats.totalUsers, 2000);
  const groupsCount = useAnimatedCounter(stats.totalGroups, 2000);
  const fundsCount = useAnimatedCounter(stats.totalFunds, 2000);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashStats, approvals] = await Promise.all([
        getDashboardStats(),
        getAdminApprovals({ status: 'pending' }),
      ]);
      setStats(dashStats);
      setPendingApprovals(approvals);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trust border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-trust to-trust-dark rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span>प्रशासन डैशबोर्ड</span>
          </h1>
          <p className="text-gray-600 ml-15">
            पूर्ण प्लेटफ़ॉर्म अवलोकन और प्रबंधन केंद्र
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="stat-card group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1 font-medium">कुल उपयोगकर्ता</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {usersCount.toLocaleString('hi-IN')}
            </p>
            <Link to={ROUTES.ADMIN_USERS} className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
              विवरण देखें →
            </Link>
          </div>

          {/* Total Groups */}
          <div className="stat-card group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1 font-medium">कुल समूह</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {groupsCount.toLocaleString('hi-IN')}
            </p>
            <Link to={ROUTES.ADMIN_GROUPS} className="text-xs text-purple-600 hover:text-purple-800 mt-2 inline-block">
              विवरण देखें →
            </Link>
          </div>

          {/* Total Funds */}
          <div className="stat-card group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <IndianRupee className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1 font-medium">कुल फंड</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {formatCurrency(fundsCount)}
            </p>
            <Link to={ROUTES.ADMIN_FUNDS} className="text-xs text-green-600 hover:text-green-800 mt-2 inline-block">
              विवरण देखें →
            </Link>
          </div>

          {/* Pending Approvals */}
          <div className="stat-card group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1 font-medium">लंबित स्वीकृतियाँ</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              {pendingApprovals.length}
            </p>
            <Link to={ROUTES.ADMIN_APPROVALS} className="text-xs text-orange-600 hover:text-orange-800 mt-2 inline-block">
              अभी समीक्षा करें →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to={ROUTES.ADMIN_APPROVALS}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">लंबित समीक्षाएं</h3>
                <p className="text-sm text-gray-600">KYC, समूह और दावे की समीक्षा करें</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN_USERS}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">उपयोगकर्ता प्रबंधन</h3>
                <p className="text-sm text-gray-600">भूमिकाएं और अनुमतियां प्रबंधित करें</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN_LOGS}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ऑडिट लॉग्स</h3>
                <p className="text-sm text-gray-600">सभी गतिविधियों का रिकॉर्ड</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 font-heading">हालिया लंबित स्वीकृतियाँ</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingApprovals.slice(0, 5).map((approval) => (
                <div key={approval.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        approval.type === 'kyc' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        approval.type === 'group' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                        'bg-orange-100 text-orange-800 border-orange-300'
                      }`}>
                        {approval.type === 'kyc' ? 'KYC' : approval.type === 'group' ? 'Group' : 'Claim'}
                      </span>
                      <p className="text-sm text-gray-600 mt-2">
                        द्वारा प्रस्तुत: {approval.submitter?.username}
                      </p>
                    </div>
                    <Link
                      to={ROUTES.ADMIN_APPROVALS}
                      className="btn-primary text-sm"
                    >
                      समीक्षा करें
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
