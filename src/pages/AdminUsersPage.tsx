import { useEffect, useState } from 'react';
import { UserCheck, Search, Download, Filter, RefreshCw, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter, kycFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.mobile?.includes(term) ||
        user.full_name?.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // KYC filter
    if (kycFilter !== 'all') {
      filtered = filtered.filter(user => user.kyc_status === kycFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleExportAll = () => {
    const exportData = {
      users: filteredUsers,
      exportDate: new Date().toISOString(),
      totalCount: filteredUsers.length,
      filters: {
        searchTerm,
        roleFilter,
        statusFilter,
        kycFilter,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Username', 'Email', 'Mobile', 'Role', 'Status', 'KYC Status', 'Created At'];
    const rows = filteredUsers.map(user => [
      user.id,
      user.username,
      user.email,
      user.mobile || '',
      user.role,
      user.status,
      user.kyc_status,
      user.created_at,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setKycFilter('all');
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    pendingKyc: users.filter(u => u.kyc_status === 'pending' || u.kyc_status === 'under_review').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
              <UserCheck className="w-10 h-10 text-blue-600" />
              <span>उपयोगकर्ता प्रबंधन</span>
            </h1>
            <p className="text-gray-600">सभी उपयोगकर्ताओं को देखें और भूमिकाएं प्रबंधित करें</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV निर्यात
            </Button>
            <Button
              variant="outline"
              onClick={handleExportAll}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              JSON निर्यात
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">कुल उपयोगकर्ता</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">सक्रिय</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">निलंबित</p>
                  <p className="text-2xl font-bold">{stats.suspended}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">KYC लंबित</p>
                  <p className="text-2xl font-bold">{stats.pendingKyc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                फिल्टर
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500"
                >
                  साफ करें
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'छुपाएं' : 'दिखाएं'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="नाम, ईमेल या मोबाइल से खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
              >
                <option value="all">सभी भूमिकाएं</option>
                <option value="member">Member</option>
                <option value="group_admin">Group Admin</option>
                <option value="support_admin">Support Admin</option>
                <option value="finance_admin">Finance Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
              >
                <option value="all">सभी स्थिति</option>
                <option value="active">सक्रिय</option>
                <option value="inactive">निष्क्रिय</option>
                <option value="suspended">निलंबित</option>
                <option value="pending_verification">पंजीकरण लंबित</option>
              </select>

              {/* KYC Filter */}
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
              >
                <option value="all">सभी KYC स्थिति</option>
                <option value="verified">सत्यापित</option>
                <option value="pending">लंबित</option>
                <option value="under_review">समीक्षा में</option>
                <option value="rejected">अस्वीकृत</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                कुल: <span className="font-semibold">{filteredUsers.length}</span> उपयोगकर्ता दिखा रहे हैं
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadUsers}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                रिफ्रेश
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">लोड हो रहा है...</p>
          </div>
        ) : (
          <UserManagementTable users={filteredUsers} onUpdate={loadUsers} />
        )}
      </div>
    </div>
  );
}
