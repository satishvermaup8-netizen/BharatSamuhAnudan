import { Transaction } from '@/types';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                transaction.type === 'installment' || transaction.type === 'death_claim'
                  ? 'bg-red-100'
                  : 'bg-green-100'
              }`}>
                {transaction.type === 'installment' || transaction.type === 'death_claim' ? (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-green-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 mb-1">
                  {transaction.description}
                </p>
                {transaction.groupName && (
                  <p className="text-sm text-gray-600 mb-1">
                    समूह: {transaction.groupName}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {formatDateTime(transaction.timestamp)}
                </p>
                
                {/* Wallet Split Info */}
                {transaction.walletSplit && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      स्टाफ: ₹{transaction.walletSplit.staff}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">
                      समूह: ₹{transaction.walletSplit.group}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                      कंसोलिडेटेड: ₹{transaction.walletSplit.consolidated}
                    </span>
                    <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                      प्रबंधन: ₹{transaction.walletSplit.management}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right ml-4">
              <p className={`text-lg font-bold mb-1 ${
                transaction.type === 'installment' || transaction.type === 'death_claim'
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                {transaction.type === 'installment' || transaction.type === 'death_claim' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                {transaction.status === 'completed' ? 'पूर्ण' : transaction.status === 'pending' ? 'लंबित' : 'विफल'}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {transactions.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">कोई लेनदेन नहीं मिला</p>
        </div>
      )}
    </div>
  );
}