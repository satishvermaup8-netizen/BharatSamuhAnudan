import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function ProfilePage() {
  useScrollToTop();
  
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'उपयोगकर्ता',
    email: user?.email || 'user@example.com',
    mobile: user?.mobile || '9876543210',
    address: 'महाराष्ट्र, भारत',
    city: 'मुंबई',
    state: 'महाराष्ट्र',
    pincode: '400001',
    kycStatus: user?.kycStatus || 'verified',
    aadhaar: '****-****-1234',
    pan: 'ABCD*****Z',
  });

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">प्रोफाइल</h1>
          <p className="text-gray-600">अपनी व्यक्तिगत जानकारी प्रबंधित करें</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-trust to-trust-dark rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.kycStatus === 'verified' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {profile.kycStatus === 'verified' ? '✓ KYC सत्यापित' : 'KYC लंबित'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-trust hover:bg-trust-dark text-white rounded-lg transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-5 h-5" />
                  <span>सहेजें</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5" />
                  <span>संपादित करें</span>
                </>
              )}
            </button>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">संपर्क जानकारी</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>ईमेल</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>मोबाइल नंबर</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.mobile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">पता</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>पूरा पता</span>
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">शहर</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.city}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">राज्य</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.state}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">पिनकोड</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trust"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.pincode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KYC Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">KYC जानकारी</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">आधार नंबर</p>
                <p className="text-gray-900 font-medium">{profile.aadhaar}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">PAN नंबर</p>
                <p className="text-gray-900 font-medium">{profile.pan}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
