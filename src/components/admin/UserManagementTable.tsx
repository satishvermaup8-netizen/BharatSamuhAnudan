import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Unlock,
  AlertTriangle,
  Download,
  Wallet,
  Users,
  FileText,
  Calendar,
  IndianRupee,
  Shield,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { updateUserProfile, updateUserRole, updateUserStatus, getUserTransactions, getUserNominees, getUserGroupMemberships } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserManagementTableProps {
  users: any[];
  onUpdate: () => void;
}

export function UserManagementTable({ users, onUpdate }: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);

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
      await updateUserRole(user.id, newRole);
      alert('भूमिका सफलतापूर्वक अपडेट की गई');
      setSelectedUser(null);
      setNewRole('');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'भूमिका अपडेट करने में विफल');
    }
    setLoading(false);
  };

  const handleBlockUser = async (user: any) => {
    if (!confirm(`क्या आप ${user.username} को ब्लॉक करना चाहते हैं?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateUserStatus(user.id, 'suspended');
      alert('उपयोगकर्ता सफलतापूर्वक ब्लॉक किया गया');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'ब्लॉक करने में विफल');
    }
    setLoading(false);
  };

  const handleUnblockUser = async (user: any) => {
    if (!confirm(`क्या आप ${user.username} को अनब्लॉक करना चाहते हैं?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateUserStatus(user.id, 'active');
      alert('उपयोगकर्ता सफलतापूर्वक अनब्लॉक किया गया');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'अनब्लॉक करने में विफल');
    }
    setLoading(false);
  };

  const handleSuspendUser = async (user: any) => {
    if (!confirm(`क्या आप ${user.username} का खाता निलंबित करना चाहते हैं?`)) {
      return;
    }

    setLoading(true);
    try {
      await updateUserStatus(user.id, 'inactive');
      alert('खाता सफलतापूर्वक निलंबित किया गया');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'निलंबित करने में विफल');
    }
    setLoading(false);
  };

  const handleViewUser = (user: any) => {
    setViewingUser(user);
    setViewModalOpen(true);
  };

  const handleExportUser = (user: any) => {
    const userData = {
      ...user,
      exportDate: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user_${user.id.slice(0, 8)}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending_verification: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status as keyof typeof badges] || badges.pending_verification;
  };

  return (
    <>
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
                  खाता स्थिति
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateTime(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="विवरण देखें"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                        }}
                        className="text-trust hover:text-trust-dark p-1"
                        title="भूमिका संपादित करें"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {user.status === 'suspended' ? (
                        <button
                          onClick={() => handleUnblockUser(user)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="अनब्लॉक करें"
                        >
                          <Unlock className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="ब्लॉक करें"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                      {user.status !== 'inactive' && (
                        <button
                          onClick={() => handleSuspendUser(user)}
                          disabled={loading}
                          className="text-orange-600 hover:text-orange-800 p-1"
                          title="निलंबित करें"
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleExportUser(user)}
                        className="text-purple-600 hover:text-purple-800 p-1"
                        title="डेटा निर्यात करें"
                      >
                        <Download className="w-5 h-5" />
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

      {/* User Detail Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-trust text-white flex items-center justify-center font-semibold">
                {viewingUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span>{viewingUser?.username}</span>
              <Badge className={getStatusBadge(viewingUser?.status)}>
                {viewingUser?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {viewingUser && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">प्रोफ़ाइल</TabsTrigger>
                <TabsTrigger value="wallet">वॉलेट</TabsTrigger>
                <TabsTrigger value="contributions">योगदान</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
                <TabsTrigger value="nominees">नॉमिनी</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <UserProfileDetails user={viewingUser} />
              </TabsContent>

              <TabsContent value="wallet">
                <UserWalletView userId={viewingUser.id} />
              </TabsContent>

              <TabsContent value="contributions">
                <FundContributionHistory userId={viewingUser.id} />
              </TabsContent>

              <TabsContent value="kyc">
                <KYCDetailsView user={viewingUser} />
              </TabsContent>

              <TabsContent value="nominees">
                <NomineeDetailsView userId={viewingUser.id} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// User Profile Details Component
function UserProfileDetails({ user }: { user: any }) {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemberships = async () => {
      try {
        const data = await getUserGroupMemberships(user.id);
        setMemberships(data || []);
      } catch (error) {
        console.error('Failed to load memberships:', error);
      }
      setLoading(false);
    };
    loadMemberships();
  }, [user.id]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            व्यक्तिगत जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">पूरा नाम</label>
            <p className="font-medium">{user.full_name || user.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">ईमेल</label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">मोबाइल</label>
            <p className="font-medium">{user.mobile || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">भूमिका</label>
            <p className="font-medium">{user.role}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">पंजीकरण तिथि</label>
            <p className="font-medium">{formatDateTime(user.created_at)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">अंतिम लॉगिन</label>
            <p className="font-medium">
              {user.last_login_at ? formatDateTime(user.last_login_at) : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            समूह सदस्यता
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">लोड हो रहा है...</div>
          ) : memberships.length === 0 ? (
            <p className="text-gray-500">कोई समूह सदस्यता नहीं</p>
          ) : (
            <div className="space-y-3">
              {memberships.map((membership: any) => (
                <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{membership.group?.name || 'Unknown Group'}</p>
                    <p className="text-sm text-gray-500">{membership.role}</p>
                  </div>
                  <Badge>{membership.is_active ? 'सक्रिय' : 'निष्क्रिय'}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// User Wallet View Component
function UserWalletView({ userId }: { userId: string }) {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const { data: walletData } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .single();
        setWallet(walletData);

        const txData = await getUserTransactions(userId);
        setTransactions(txData || []);
      } catch (error) {
        console.error('Failed to load wallet:', error);
      }
      setLoading(false);
    };
    loadWalletData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">कुल बैलेंस</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{wallet?.balance?.toLocaleString() || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">लॉक बैलेंस</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{wallet?.locked_balance?.toLocaleString() || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">कुल जमा</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{wallet?.total_credited?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            हाल के लेनदेन
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-500">कोई लेनदेन नहीं</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(tx.created_at)}</p>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Fund Contribution History Component
function FundContributionHistory({ userId }: { userId: string }) {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContributions = async () => {
      try {
        const { data } = await supabase
          .from('installment_payments')
          .select(`
            *,
            installment:installments(installment_number),
            group:groups(name)
          `)
          .eq('user_id', userId)
          .order('paid_at', { ascending: false });
        setContributions(data || []);
      } catch (error) {
        console.error('Failed to load contributions:', error);
      }
      setLoading(false);
    };
    loadContributions();
  }, [userId]);

  const totalContributed = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);

  if (loading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">कुल योगदान</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{totalContributed.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">किश्तें दी</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{contributions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            किश्त इतिहास
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contributions.length === 0 ? (
            <p className="text-gray-500">कोई किश्त नहीं</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {contributions.map((inst: any) => (
                <div key={inst.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{inst.group?.name || 'Unknown Group'}</p>
                    <p className="text-sm text-gray-500">किश्त #{inst.installment?.installment_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{inst.amount}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(inst.paid_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// KYC Details View Component
function KYCDetailsView({ user }: { user: any }) {
  const getKYCBadge = (status: string) => {
    const badges: Record<string, string> = {
      verified: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      under_review: 'bg-blue-100 text-blue-800 border-blue-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return badges[status] || badges.pending;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          KYC जानकारी
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">KYC स्थिति</label>
            <div className="mt-1">
              <Badge className={getKYCBadge(user.kyc_status)}>
                {user.kyc_status}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Aadhaar</label>
            <p className="font-medium">
              {user.aadhaar_number ? `XXXX-XXXX-${user.aadhaar_number.slice(-4)}` : 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">PAN</label>
            <p className="font-medium">{user.pan_number || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">पता</label>
            <p className="font-medium">
              {user.address ? `${user.address}, ${user.city}, ${user.state}` : 'N/A'}
            </p>
          </div>
        </div>
        {user.kyc_documents && user.kyc_documents.length > 0 && (
          <div>
            <label className="text-sm text-gray-500">दस्तावेज़</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {user.kyc_documents.map((doc: any, index: number) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {doc.type} देखें
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Nominee Details View Component
function NomineeDetailsView({ userId }: { userId: string }) {
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNominees = async () => {
      try {
        const data = await getUserNominees(userId);
        setNominees(data || []);
      } catch (error) {
        console.error('Failed to load nominees:', error);
      }
      setLoading(false);
    };
    loadNominees();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>;
  }

  if (nominees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">कोई नॉमिनी नहीं जोड़ा गया</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {nominees.map((nominee: any) => (
        <Card key={nominee.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">{nominee.full_name}</h4>
                <p className="text-sm text-gray-500">{nominee.relationship}</p>
              </div>
              {nominee.is_primary && (
                <Badge className="bg-blue-100 text-blue-800">प्राथमिक</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-500">फोन</label>
                <p>{nominee.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">ईमेल</label>
                <p>{nominee.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">जन्म तिथि</label>
                <p>{nominee.date_of_birth || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">हिस्सा</label>
                <p>{nominee.share_percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
