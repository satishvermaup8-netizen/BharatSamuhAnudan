import { useState } from 'react';
import { CheckCircle, XCircle, FileText, User, CreditCard, Building2, MapPin, Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { approveRequest, rejectRequest } from '@/lib/api';

interface KYCApprovalProps {
  approval: any;
  userProfile: any;
  onUpdate: () => void;
}

export function KYCApprovalCard({ approval, userProfile, onUpdate }: KYCApprovalProps) {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    if (!confirm('क्या आप इस KYC को स्वीकृत करना चाहते हैं?')) return;
    
    setLoading(true);
    try {
      await approveRequest(approval.id, notes);
      alert('KYC स्वीकृत हो गया है');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'स्वीकृत करने में विफल');
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      alert('कृपया अस्वीकृति का कारण दर्ज करें');
      return;
    }
    
    if (!confirm('क्या आप इस KYC को अस्वीकार करना चाहते हैं?')) return;
    
    setLoading(true);
    try {
      await rejectRequest(approval.id, notes);
      alert('KYC अस्वीकार कर दिया गया है');
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'अस्वीकार करने में विफल');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userProfile?.username || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-600">{userProfile?.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-300">
            KYC सत्यापन
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              मोबाइल: {userProfile?.mobile || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {userProfile?.city || 'N/A'}, {userProfile?.state || 'N/A'}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          प्रस्तुत: {formatDateTime(approval.submitted_at)}
        </p>

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
        >
          <Eye className="w-4 h-4" />
          <span>{showDetails ? 'विवरण छुपाएं' : 'विवरण देखें'}</span>
        </button>

        {/* KYC Details */}
        {showDetails && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 flex items-center space-x-2 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span>आधार नंबर</span>
                </label>
                <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
                  {userProfile?.aadhaar_number || 'Not Provided'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 flex items-center space-x-2 mb-1">
                  <FileText className="w-4 h-4" />
                  <span>PAN नंबर</span>
                </label>
                <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
                  {userProfile?.pan_number || 'Not Provided'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 flex items-center space-x-2 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>बैंक खाता</span>
                </label>
                <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
                  {userProfile?.bank_account_number || 'Not Provided'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 flex items-center space-x-2 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>IFSC कोड</span>
                </label>
                <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
                  {userProfile?.bank_ifsc || 'Not Provided'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4" />
                <span>पता</span>
              </label>
              <p className="text-sm bg-white px-3 py-2 rounded border">
                {userProfile?.address || 'Not Provided'}
                <br />
                {userProfile?.city}, {userProfile?.state} - {userProfile?.pincode}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            समीक्षा नोट्स / अस्वीकृति कारण
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
            rows={3}
            placeholder="यहाँ अपनी टिप्पणी लिखें..."
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span>स्वीकृत करें</span>
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <XCircle className="w-5 h-5" />
            <span>अस्वीकार करें</span>
          </button>
        </div>
      </div>
    </div>
  );
}
