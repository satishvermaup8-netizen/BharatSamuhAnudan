import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, FileText, DollarSign, Crown } from 'lucide-react';
import { ROUTES } from '@/constants';
import { GroupInviteModal } from '@/components/group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import { createGroupBackend, CreateGroupBackendData } from '@/lib/api';
import { isMockAuth } from '@/lib/auth';

// Mock users for leader selection (in production, fetch from API)
const MOCK_USERS: User[] = [
  { id: 'user_1', name: 'राजेश कुमार', email: 'rajesh@example.com', mobile: '9876543210', role: 'super_admin', kycStatus: 'verified', createdAt: new Date().toISOString() },
  { id: 'user_2', name: 'प्रिया शर्मा', email: 'priya@example.com', mobile: '9876543211', role: 'group_admin', kycStatus: 'verified', createdAt: new Date().toISOString() },
  { id: 'user_3', name: 'अमित पटेल', email: 'amit@example.com', mobile: '9876543212', role: 'group_admin', kycStatus: 'verified', createdAt: new Date().toISOString() },
];

export function CreateGroupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<{id: string, name: string, code: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    monthlyContribution: '',
    maxMembers: '20',
    groupType: 'savings', // savings, emergency, business
    leaderId: currentUser?.id || '',
  });

  // Update leaderId when currentUser loads
  useEffect(() => {
    if (currentUser && !formData.leaderId) {
      setFormData(prev => ({ ...prev, leaderId: currentUser.id }));
    }
  }, [currentUser]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('कृपया समूह का नाम दर्ज करें');
      return;
    }
    if (!formData.location.trim()) {
      alert('कृपया स्थान दर्ज करें');
      return;
    }
    if (!formData.monthlyContribution || parseInt(formData.monthlyContribution) <= 0) {
      alert('कृपया मान्य मासिक योगदान दर्ज करें');
      return;
    }

    setLoading(true);
    
    try {
      // Check if using mock auth (backend API won't work)
      if (isMockAuth()) {
        toast({
          title: 'सूचना',
          description: 'बैकएंड API उपलब्ध नहीं है। डेमो मोड में समूह बनाया जा रहा है...',
        });
        
        // Simulate for demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const groupCode = `GRP${Date.now().toString(36).toUpperCase()}`;
        const groupId = `group_${Date.now()}`;
        
        setCreatedGroup({
          id: groupId,
          name: formData.name,
          code: groupCode,
        });
        
        toast({
          title: 'समूह बनाया गया!',
          description: `✓ ${formData.name} डेमो मोड में बनाया गया।`,
        });
        
        setShowInviteModal(true);
        return;
      }
      
      // Call backend API
      const groupData: CreateGroupBackendData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        contributionAmount: parseInt(formData.monthlyContribution),
        groupType: formData.groupType as 'savings' | 'emergency' | 'business',
        maxMembers: parseInt(formData.maxMembers),
        leaderId: formData.leaderId || currentUser?.id || '',
      };
      
      const response = await createGroupBackend(groupData);
      
      setCreatedGroup({
        id: response.id,
        name: response.name,
        code: response.groupCode,
      });
      
      toast({
        title: 'समूह बनाया गया!',
        description: `✓ ${response.name} सफलतापूर्वक बनाया गया। कोड: ${response.groupCode}`,
      });
      
      // Show invite modal instead of navigating away
      setShowInviteModal(true);
    } catch (error: any) {
      toast({
        title: 'त्रुटि',
        description: error.message || 'समूह बनाने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(ROUTES.GROUPS)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">नया समूह बनाएं</h1>
            <p className="text-gray-600 mt-2">अपना बचत समूह शुरू करें</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>बुनियादी जानकारी</span>
              </h2>

              <div className="space-y-4">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    समूह का नाम *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="उदाहरण: स्वाभिमान समूह"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                  <p className="text-xs text-gray-500 mt-1">3-50 वर्ण</p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>स्थान *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="उदाहरण: मुंबई, महाराष्ट्र"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    विवरण
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="अपने समूह के बारे में बताएं..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>वित्तीय विवरण</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Contribution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    मासिक योगदान (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyContribution}
                    onChange={(e) => handleChange('monthlyContribution', e.target.value)}
                    placeholder="उदाहरण: 2500"
                    min="100"
                    step="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                </div>

                {/* Group Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    समूह का प्रकार
                  </label>
                  <select
                    value={formData.groupType}
                    onChange={(e) => handleChange('groupType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  >
                    <option value="savings">बचत समूह</option>
                    <option value="emergency">आपातकालीन निधि</option>
                    <option value="business">व्यावसायिक समूह</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>सदस्य विवरण</span>
              </h2>

              <div className="space-y-4">
                {/* Group Leader Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>समूह नेता *</span>
                  </label>
                  {currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'group_admin') ? (
                    <select
                      value={formData.leaderId}
                      onChange={(e) => handleChange('leaderId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                    >
                      {/* Current user first */}
                      <option value={currentUser.id}>
                        {currentUser.name} (आप) - {currentUser.role === 'super_admin' ? 'सुपर एडमिन' : 'समूह एडमिन'}
                      </option>
                      {/* Other eligible leaders */}
                      {MOCK_USERS.filter(u => u.id !== currentUser.id).map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.role === 'super_admin' ? 'सुपर एडमिन' : 'समूह एडमिन'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 flex items-center justify-between">
                      <span>{currentUser?.name || 'वर्तमान उपयोगकर्ता'}</span>
                      <span className="text-xs bg-trust-light text-white px-2 py-1 rounded">नेता</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'group_admin')
                      ? 'आपके पास नेता नियुक्त करने का अधिकार है'
                      : 'केवल एडमिन ही नेता बदल सकते हैं'}
                  </p>
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    अधिकतम सदस्य संख्या
                  </label>
                  <select
                    value={formData.maxMembers}
                    onChange={(e) => handleChange('maxMembers', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  >
                    <option value="10">10 सदस्य</option>
                    <option value="15">15 सदस्य</option>
                    <option value="20">20 सदस्य</option>
                    <option value="30">30 सदस्य</option>
                    <option value="50">50 सदस्य</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                ✓ समूह बनाकर, आप हमारे नियम और शर्तों से सहमत हैं
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(ROUTES.GROUPS)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-trust hover:bg-trust-dark disabled:opacity-50 text-white rounded-lg font-semibold transition-colors"
              >
                {loading ? 'बनाया जा रहा है...' : 'समूह बनाएं'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">अक्सर पूछे जाने वाले प्रश्न</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-2">समूह बनाने के लिए कौन योग्य है?</p>
              <p className="text-gray-600 text-sm">कोई भी 18 वर्ष या उससे अधिक उम्र का व्यक्ति एक समूह बना सकता है।</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">न्यूनतम सदस्य संख्या क्या है?</p>
              <p className="text-gray-600 text-sm">एक समूह को कम से कम 5 सदस्यों की आवश्यकता है।</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">क्या मैं समूह बनाने के बाद इसे संपादित कर सकता हूं?</p>
              <p className="text-gray-600 text-sm">हां, आप समूह की सेटिंग्स को किसी भी समय संपादित कर सकते हैं।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Invite Modal */}
      {createdGroup && (
        <GroupInviteModal
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            navigate(ROUTES.GROUPS);
          }}
          groupId={createdGroup.id}
          groupName={createdGroup.name}
          groupCode={createdGroup.code}
        />
      )}
    </div>
  );
}

export default CreateGroupPage;
