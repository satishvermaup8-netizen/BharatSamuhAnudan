import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockApprovals } from '@/lib/mockData';
import { getStatusColor, formatDateTime } from '@/lib/utils';

export function AdminApprovalsPage() {
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2">
            स्वीकृति प्रबंधन
          </h1>
          <p className="text-gray-600">
            KYC, समूह और दावे की समीक्षा करें और अनुमोदित करें
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">लंबित स्वीकृति</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingApprovals.length}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">स्वीकृत</p>
            <p className="text-3xl font-bold text-green-600">
              {mockApprovals.filter(a => a.status === 'approved').length}
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">अस्वीकृत</p>
            <p className="text-3xl font-bold text-red-600">
              {mockApprovals.filter(a => a.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 font-heading">
              लंबित स्वीकृतियाँ
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        approval.type === 'kyc' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        approval.type === 'group' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                        'bg-orange-100 text-orange-800 border-orange-300'
                      }`}>
                        {approval.type === 'kyc' ? 'KYC सत्यापन' :
                         approval.type === 'group' ? 'समूह अनुमोदन' :
                         'मृत्यु दावा'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(approval.status)}`}>
                        {approval.status === 'pending' ? 'लंबित' : approval.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {approval.entityName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      द्वारा प्रस्तुत: {approval.submittedByName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(approval.submittedAt)}
                    </p>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200">
                      स्वीकृत करें
                    </button>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200">
                      अस्वीकार करें
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pendingApprovals.length === 0 && (
              <div className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">कोई लंबित स्वीकृति नहीं</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}