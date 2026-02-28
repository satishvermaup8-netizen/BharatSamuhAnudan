import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, MapPin, TrendingUp, Wallet, ArrowLeft, 
  UserPlus, Share2, Crown, Shield, FileText, Calendar,
  IndianRupee, Activity, Award
} from 'lucide-react';
import { getGroup, getGroupMembers, getGroupRoles } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { JoinGroupModal } from '@/components/group';
import { TOTAL_INSTALLMENTS, MAX_GROUP_MEMBERS } from '@/constants';

export function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (groupId) {
      loadGroupDetails();
    }
  }, [groupId]);

  const loadGroupDetails = async () => {
    setLoading(true);
    try {
      const [groupData, membersData, rolesData] = await Promise.all([
        getGroup(groupId!),
        getGroupMembers(groupId!),
        getGroupRoles(groupId!),
      ]);

      setGroup(groupData);
      setMembers(membersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load group details:', error);
    }
    setLoading(false);
  };

  const getRoleIcon = (roleType: string) => {
    const icons: Record<string, any> = {
      president: Crown,
      vice_president: Shield,
      secretary: FileText,
      deputy_secretary: FileText,
      treasurer: Wallet,
      gmm: Users,
    };
    return icons[roleType] || Users;
  };

  const getRoleLabel = (roleType: string) => {
    const labels: Record<string, string> = {
      president: 'अध्यक्ष',
      vice_president: 'उपाध्यक्ष',
      secretary: 'सचिव',
      deputy_secretary: 'उप सचिव',
      treasurer: 'कोषाध्यक्ष',
      gmm: 'GMM',
    };
    return labels[roleType] || roleType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-trust border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">समूह नहीं मिला</p>
          <button onClick={() => navigate('/groups')} className="btn-primary mt-4">
            समूहों पर वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalProgress = members.reduce((sum, m) => sum + m.installments_paid, 0);
  const maxProgress = members.length * TOTAL_INSTALLMENTS;
  const progressPercentage = maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center space-x-2 text-trust hover:text-trust-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">वापस जाएं</span>
        </button>

        {/* Group Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-trust to-accent">
            {group.photo && (
              <img
                src={group.photo}
                alt={group.name}
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold font-heading mb-2">{group.name}</h1>
                <p className="text-xl opacity-90">कोड: {group.group_code}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">कुल सदस्य</p>
                  <p className="text-2xl font-bold text-gray-900">{group.member_count}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">सक्रिय सदस्य</p>
                  <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">समूह फंड</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(group.total_fund)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">प्रगति</p>
                  <p className="text-2xl font-bold text-orange-600">{progressPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {group.location && (
              <div className="mt-6 flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{group.location}, {group.city}, {group.state}</span>
              </div>
            )}

            {group.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{group.description}</p>
              </div>
            )}

            {/* Join Group Button */}
            {!isMember && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full md:w-auto px-8 py-3 bg-trust hover:bg-trust-dark text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>इस समूह में शामिल हों</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  शामिल होने के लिए ₹100 की पहली किश्त का भुगतान आवश्यक है
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Group Roles */}
        {roles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6 flex items-center space-x-2">
              <Award className="w-6 h-6 text-trust" />
              <span>समूह भूमिकाएं</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => {
                const RoleIcon = getRoleIcon(role.role_type);
                return (
                  <div
                    key={role.id}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-trust text-white flex items-center justify-center">
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{getRoleLabel(role.role_type)}</p>
                      <p className="font-semibold text-gray-900">{role.user?.username || 'N/A'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Installment Payment */}
        <div className="bg-gradient-to-r from-trust to-accent rounded-2xl shadow-md p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold font-heading mb-4">किस्त भुगतान</h2>
          <p className="mb-6 opacity-90">अपनी मासिक किस्त का भुगतान करें और अपनी प्रगति बनाए रखें</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg">किस्त राशि:</span>
              <span className="text-3xl font-bold">₹100</span>
            </div>
            
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-center justify-between">
                <span>स्टाफ वॉलेट (20%):</span>
                <span className="font-semibold">₹20</span>
              </div>
              <div className="flex items-center justify-between">
                <span>समूह फंड (50%):</span>
                <span className="font-semibold">₹50</span>
              </div>
              <div className="flex items-center justify-between">
                <span>समेकित फंड (10%):</span>
                <span className="font-semibold">₹10</span>
              </div>
              <div className="flex items-center justify-between">
                <span>प्रबंधन (20%):</span>
                <span className="font-semibold">₹20</span>
              </div>
            </div>
          </div>

          <PaymentButton
            amount={100}
            groupId={groupId}
            type="installment"
            label="₹100 किस्त भुगतान करें"
            className="w-full bg-white text-trust hover:bg-gray-100"
            onSuccess={loadGroupDetails}
          />
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 font-heading flex items-center space-x-2">
              <Users className="w-6 h-6 text-trust" />
              <span>सदस्य सूची ({members.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">सदस्य</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">किस्तें भुगतान</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">प्रगति</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">स्थिति</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">अंतिम भुगतान</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member) => {
                  const progress = (member.installments_paid / TOTAL_INSTALLMENTS) * 100;
                  return (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-trust text-white flex items-center justify-center font-semibold">
                            {member.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.user?.username}</div>
                            <div className="text-xs text-gray-500">{member.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {member.installments_paid} / {TOTAL_INSTALLMENTS}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-trust h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 mt-1">{progress.toFixed(0)}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' :
                          member.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.last_payment_date ? formatDateTime(member.last_payment_date) : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Join Group Modal */}
        <JoinGroupModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          groupId={groupId || ''}
          groupName={group?.name || ''}
          groupCode={group?.group_code || ''}
          memberCount={group?.member_count || 0}
          maxMembers={MAX_GROUP_MEMBERS}
          onJoinSuccess={() => {
            setIsMember(true);
            loadGroupDetails();
          }}
        />
      </div>
    </div>
  );
}
