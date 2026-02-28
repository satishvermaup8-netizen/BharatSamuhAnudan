import { useState } from 'react';
import { CheckCircle, XCircle, Users, MapPin, User, Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { approveRequest, rejectRequest } from '@/lib/api';

interface GroupApprovalProps {
  approval: any;
  group: any;
  onUpdate: () => void;
}

export function GroupApprovalCard({ approval, group, onUpdate }: GroupApprovalProps) {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    if (!confirm('क्या आप इस समूह को स्वीकृत करना चाहते हैं?')) return;
    
    setLoading(true);
    try {
      await approveRequest(approval.id, notes);
      alert('समूह स्वीकृत हो गया है');
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
    
    if (!confirm('क्या आप इस समूह को अस्वीकार करना चाहते हैं?')) return;
    
    setLoading(true);
    try {
      await rejectRequest(approval.id, notes);
      alert('समूह अस्वीकार कर दिया गया है');
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
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {group?.name || 'Unknown Group'}
              </h3>
              <p className="text-sm text-gray-600 font-mono">
                कोड: {group?.group_code || 'N/A'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold border border-purple-300">
            समूह अनुमोदन
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              नेता: {group?.leader?.username || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {group?.city || 'N/A'}, {group?.state || 'N/A'}
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

        {/* Group Details */}
        {showDetails && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                समूह विवरण
              </label>
              <p className="text-sm bg-white px-3 py-2 rounded border">
                {group?.description || 'कोई विवरण नहीं'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  वर्तमान सदस्य
                </label>
                <p className="text-sm bg-white px-3 py-2 rounded border">
                  {group?.member_count || 0}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  अधिकतम सदस्य
                </label>
                <p className="text-sm bg-white px-3 py-2 rounded border">
                  {group?.max_members || 1000}
                </p>
              </div>
            </div>

            {group?.location && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  स्थान
                </label>
                <p className="text-sm bg-white px-3 py-2 rounded border">
                  {group.location}
                </p>
              </div>
            )}

            {group?.photo && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  समूह फोटो
                </label>
                <img
                  src={group.photo}
                  alt={group.name}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
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
