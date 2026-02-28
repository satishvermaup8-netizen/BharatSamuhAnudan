import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ROUTES } from '@/constants';

export function TransactionsPage() {
  const [transactions] = useState([
    {
      id: '1',
      type: 'contribution',
      description: 'स्वाभिमान समूह में योगदान',
      amount: 2500,
      date: '2024-02-25',
      status: 'completed',
    },
    {
      id: '2',
      type: 'distribution',
      description: 'विकास समूह से वितरण',
      amount: 5000,
      date: '2024-02-20',
      status: 'completed',
    },
    {
      id: '3',
      type: 'contribution',
      description: 'स्वाभिमान समूह में योगदान',
      amount: 2500,
      date: '2024-02-15',
      status: 'completed',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">लेनदेन</h1>
          <p className="text-gray-600">सभी लेनदेन का रिकॉर्ड देखें</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">कुल योगदान</p>
                <p className="text-3xl font-bold text-gray-900">₹7,500</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">कुल वितरण</p>
                <p className="text-3xl font-bold text-green-600">₹5,000</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">शेष राशि</p>
                <p className="text-3xl font-bold text-trust">₹2,500</p>
              </div>
              <div className="w-12 h-12 bg-trust-light rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-trust">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">विवरण</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">प्रकार</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">तारीख</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">राशि</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">स्थिति</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 text-sm font-medium ${
                        transaction.type === 'contribution' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'contribution' ? (
                          <>
                            <ArrowDownLeft className="w-4 h-4" />
                            <span>योगदान</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-4 h-4" />
                            <span>वितरण</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('hi-IN')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      ₹{transaction.amount.toLocaleString('hi-IN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        पूर्ण
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
