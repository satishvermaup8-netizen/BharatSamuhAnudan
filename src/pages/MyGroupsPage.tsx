import { useState } from 'react';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { ROUTES } from '@/constants';

export function MyGroupsPage() {
  useScrollToTop();
  
  const [myGroups] = useState([
    {
      id: '1',
      name: 'स्वाभिमान समूह',
      members: 12,
      totalFund: 50000,
      monthlyContribution: 2500,
      status: 'active',
    },
    {
      id: '2',
      name: 'विकास समूह',
      members: 8,
      totalFund: 35000,
      monthlyContribution: 1500,
      status: 'active',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">मेरे समूह</h1>
          <p className="text-gray-600">आपके सभी समूहों का प्रबंधन करें</p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <Link
            to={ROUTES.GROUPS}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-trust text-white rounded-lg hover:bg-trust-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>नया समूह ज्वाइन करें</span>
          </Link>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map(group => (
            <div key={group.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                  <p className="text-sm text-green-600 font-medium mt-1">✓ सक्रिय</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">सदस्य</span>
                  <span className="text-lg font-bold text-gray-900">{group.members}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">कुल राशि</span>
                  <span className="text-lg font-bold text-trust">₹{group.totalFund.toLocaleString('hi-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">मासिक योगदान</span>
                  <span className="text-lg font-bold text-gray-900">₹{group.monthlyContribution.toLocaleString('hi-IN')}</span>
                </div>
              </div>

              <Link
                to={`/groups/${group.id}`}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-lg transition-colors"
              >
                <span>विवरण देखें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {myGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">कोई समूह नहीं</h3>
            <p className="text-gray-600 mb-6">अभी कोई समूह नहीं जोड़े गए हैं</p>
            <Link
              to={ROUTES.GROUPS}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-trust text-white rounded-lg hover:bg-trust-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>समूह ज्वाइन करें</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyGroupsPage;
