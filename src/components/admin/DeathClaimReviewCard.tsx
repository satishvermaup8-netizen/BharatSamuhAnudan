import { useState } from 'react';
import { CheckCircle, XCircle, Heart, User, Users, IndianRupee, FileText, Eye, Download } from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { approveRequest, rejectRequest } from '@/lib/api';

interface DeathClaimReviewProps {
  approval: any;
  claim: any;
  onUpdate: () => void;
}

export function DeathClaimReviewCard({ approval, claim, onUpdate }: DeathClaimReviewProps) {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    if (!confirm('क्या आप इस मृत्यु दावे को स्वीकृत करना चाहते हैं?')) return;
    
    setLoading(true);
    try {
      await approveRequest(approval.id, notes);
      alert('दावा स्वीकृत हो गया है');
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
    
    if (!confirm('क्या आप इस मृत्यु दावे को अस्वीकार करना चाहते हैं?')) return;
    
    setLoading(true);
    try {
      await rejectRequest(approval.id, notes);
      alert('दावा अस्वीकार कर दिया गया है');
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
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                मृत्यु दावा #{claim?.id?.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-600">
                दावा राशि: {formatCurrency(claim?.claim_amount || 0)}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold border border-orange-300">
            मृत्यु दावा
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              मृतक: {claim?.user?.username || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              समूह: {claim?.group?.name || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              नामांकित: {claim?.nominee?.name || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              ₹{claim?.claim_amount || 0}
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

        {/* Claim Details */}
        {showDetails && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                नामांकित विवरण
              </label>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm"><strong>नाम:</strong> {claim?.nominee?.name}</p>
                <p className="text-sm"><strong>संबंध:</strong> {claim?.nominee?.relationship}</p>
                <p className="text-sm"><strong>मोबाइल:</strong> {claim?.nominee?.mobile || 'N/A'}</p>
                <p className="text-sm"><strong>ईमेल:</strong> {claim?.nominee?.email || 'N/A'}</p>
              </div>
            </div>

            {claim?.notes && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  दावा नोट्स
                </label>
                <p className="text-sm bg-white px-3 py-2 rounded border">
                  {claim.notes}
                </p>
              </div>
            )}

            {/* Documents */}
            {claim?.documents && claim.documents.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                  प्रस्तुत दस्तावेज़
                </label>
                <div className="space-y-2">
                  {claim.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-white p-3 rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">
                            {doc.type === 'death_certificate' ? 'मृत्यु प्रमाण पत्र' :
                             doc.type === 'nominee_id_proof' ? 'नामांकित ID प्रमाण' :
                             doc.type === 'bank_proof' ? 'बैंक प्रमाण' : 'अन्य'}
                          </p>
                          <p className="text-xs text-gray-500">{doc.file_name}</p>
                        </div>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-trust hover:text-trust-dark"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">देखें</span>
                      </a>
                    </div>
                  ))}
                </div>
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
