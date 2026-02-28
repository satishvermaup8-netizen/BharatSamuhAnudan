import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { getAdminApprovals, getDeathClaims } from '@/lib/api';
import { DeathClaimReviewCard } from '@/components/admin/DeathClaimReviewCard';

export function AdminClaimsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [claims, setClaims] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const data = await getAdminApprovals({ type: 'death_claim', status: filter });
      setApprovals(data);

      // Load claim details
      const allClaims = await getDeathClaims();
      const claimMap = new Map();
      allClaims.forEach((claim: any) => {
        claimMap.set(claim.id, claim);
      });
      setClaims(claimMap);
    } catch (error) {
      console.error('Failed to load approvals:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
            <Heart className="w-10 h-10 text-orange-600" />
            <span>मृत्यु दावा समीक्षा</span>
          </h1>
          <p className="text-gray-600">मृत्यु दावा अनुरोधों की समीक्षा और स्वीकृति</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                filter === status
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {status === 'pending' ? 'लंबित' : status === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">लोड हो रहा है...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">कोई {filter === 'pending' ? 'लंबित' : filter === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'} दावा नहीं</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvals.map((approval) => (
              <DeathClaimReviewCard
                key={approval.id}
                approval={approval}
                claim={claims.get(approval.entity_id)}
                onUpdate={loadApprovals}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
