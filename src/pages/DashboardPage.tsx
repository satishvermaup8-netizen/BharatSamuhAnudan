import { Users, Wallet, TrendingUp, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { StatCard } from '@/components/features/StatCard';
import { TransactionList } from '@/components/features/TransactionList';
import { mockWallets, mockTransactions, mockInstallments } from '@/lib/mockData';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import { INSTALLMENT_AMOUNT, ROUTES } from '@/constants';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Scroll to top when page loads
  useScrollToTop();
  
  const userWallets = mockWallets;
  const recentTransactions = mockTransactions.slice(0, 5);
  const userInstallments = mockInstallments;
  
  const paidInstallments = userInstallments.filter(i => i.status === 'paid').length;
  const totalBalance = userWallets.reduce((sum, w) => sum + w.balance, 0);
  const nextDueDate = userInstallments.find(i => i.status === 'pending')?.dueDate;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2">
            नमस्ते, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600">
            आपके खाते का अवलोकन
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="कुल बैलेंस"
            value={totalBalance}
            isCurrency
            icon={<Wallet className="w-7 h-7" />}
            color="blue"
            growth={12.5}
          />
          <StatCard
            title="भुगतान की गई किश्तें"
            value={paidInstallments}
            icon={<CreditCard className="w-7 h-7" />}
            color="green"
          />
          <StatCard
            title="मेरे समूह"
            value={1}
            icon={<Users className="w-7 h-7" />}
            color="purple"
          />
          <StatCard
            title="कुल योगदान"
            value={paidInstallments * INSTALLMENT_AMOUNT}
            isCurrency
            icon={<TrendingUp className="w-7 h-7" />}
            color="orange"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Installment Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
                किश्त प्रगति
              </h2>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-gray-700">
                    {paidInstallments} / 32 किश्तें पूर्ण
                  </span>
                  <span className="text-lg font-bold text-trust">
                    {calculateProgress(paidInstallments, 32)}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress(paidInstallments, 32)}%` }}
                  />
                </div>
              </div>

              {nextDueDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">अगली किश्त</p>
                    <p className="text-sm text-yellow-700">
                      नियत तारीख: {new Date(nextDueDate).toLocaleDateString('hi-IN')}
                    </p>
                    <p className="text-sm text-yellow-700">
                      राशि: {formatCurrency(INSTALLMENT_AMOUNT)}
                    </p>
                  </div>
                </div>
              )}

              <button className="w-full mt-6 btn-primary">
                किश्त का भुगतान करें
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
                हाल के लेनदेन
              </h2>
              <TransactionList transactions={recentTransactions} />
            </div>
          </div>

          {/* Right Column - Wallets */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
                मेरे वॉलेट
              </h2>
              
              <div className="space-y-4">
                {userWallets.map(wallet => (
                  <div
                    key={wallet.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          wallet.type === 'staff' ? 'bg-blue-500' :
                          wallet.type === 'group' ? 'bg-green-500' :
                          wallet.type === 'consolidated' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}>
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 capitalize">
                          {wallet.type === 'staff' ? 'स्टाफ' :
                           wallet.type === 'group' ? 'समूह' :
                           wallet.type === 'consolidated' ? 'कंसोलिडेटेड' :
                           'प्रबंधन'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(wallet.balance)}
                    </p>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>प्राप्त: {formatCurrency(wallet.totalReceived)}</span>
                      <span>निकाला: {formatCurrency(wallet.totalWithdrawn)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading">
                त्वरित कार्य
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate(ROUTES.CREATE_GROUP)}
                  className="w-full px-4 py-3 bg-trust hover:bg-trust-dark text-white rounded-lg font-semibold transition-all duration-200 text-left"
                >
                  नया समूह बनाएं
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 text-left">
                  नॉमिनी जोड़ें
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 text-left">
                  KYC पूर्ण करें
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}