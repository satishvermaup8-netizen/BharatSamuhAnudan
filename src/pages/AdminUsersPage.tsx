import { useEffect, useState } from 'react';
import { UserCheck, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UserManagementTable } from '@/components/admin/UserManagementTable';

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

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
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
            <UserCheck className="w-10 h-10 text-blue-600" />
            <span>उपयोगकर्ता प्रबंधन</span>
          </h1>
          <p className="text-gray-600">सभी उपयोगकर्ताओं को देखें और भूमिकाएं प्रबंधित करें</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="mt-4 text-sm text-gray-600">
            कुल: <span className="font-semibold">{filteredUsers.length}</span> उपयोगकर्ता
          </div>
        </div>

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
