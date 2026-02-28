import { useState } from 'react';
import { User, Mail, Phone, Shield, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { updateUserProfile } from '@/lib/api';

interface UserManagementTableProps {
  users: any[];
  onUpdate: () => void;
}

export function UserManagementTable({ users, onUpdate }: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (user: any) => {
    if (!newRole) {
      alert('कृपया एक भूमिका चुनें');
      return;
    }

    if (!confirm(`क्या आप ${user.username} की भूमिका को ${newRole} में बदलना चाहते हैं?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.id, { role: newRole });
      alert('भूमिका सफलतापूर्वक अपडेट की गई');
      setSelectedUser(null);
      setNewRole('');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'भूमिका अपडेट करने में विफल');
    }
    setLoading(false);
  };

  const getKYCBadge = (status: string) => {
    const badges = {
      verified: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      under_review: 'bg-blue-100 text-blue-800 border-blue-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      super_admin: 'bg-purple-100 text-purple-800',
      finance_admin: 'bg-blue-100 text-blue-800',
      support_admin: 'bg-cyan-100 text-cyan-800',
      group_admin: 'bg-green-100 text-green-800',
      member: 'bg-gray-100 text-gray-800',
    };
    return badges[role as keyof typeof badges] || badges.member;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                उपयोगकर्ता
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                संपर्क
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                भूमिका
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                KYC स्थिति
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                पंजीकृत
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                क्रियाएं
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-trust text-white flex items-center justify-center font-semibold">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                    {user.mobile && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.mobile}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {selectedUser?.id === user.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">चुनें...</option>
                        <option value="member">Member</option>
                        <option value="group_admin">Group Admin</option>
                        <option value="support_admin">Support Admin</option>
                        <option value="finance_admin">Finance Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      <button
                        onClick={() => handleRoleChange(user)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(null);
                          setNewRole('');
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getKYCBadge(user.kyc_status)}`}>
                    {user.kyc_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(user.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                      }}
                      className="text-trust hover:text-trust-dark"
                      title="भूमिका संपादित करें"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`क्या आप ${user.username} को हटाना चाहते हैं?`)) {
                          alert('उपयोगकर्ता हटाने की कार्यक्षमता जल्द आ रही है');
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="उपयोगकर्ता हटाएं"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">कोई उपयोगकर्ता नहीं मिला</p>
          </div>
        )}
      </div>
    </div>
  );
}
