import { Wallet, Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import { useState } from 'react';
import { AddMoneyModal } from '@/components/payment/AddMoneyModal';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useToast } from '@/components/ui/use-toast';

export function WalletPage() {
  useScrollToTop();
  
  const [showBalance, setShowBalance] = useState(true);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const { toast } = useToast();

  // Mock wallet data - in production, this would come from the database
  const [wallet, setWallet] = useState({
    balance: 15000,
    frozen: 5000,
    available: 10000,
  });

  // Mock recent transactions
  const [transactions] = useState([
    {
      id: '1',
      type: 'credit',
      description: 'योगदान',
      group: 'स्वाभिमान समूह',
      amount: 2500,
      date: '2024-02-25',
      status: 'completed',
    },
    {
      id: '2',
      type: 'debit',
      description: 'वितरण',
      group: 'विकास समूह',
      amount: 5000,
      date: '2024-02-20',
      status: 'completed',
    },
    {
      id: '3',
      type: 'credit',
      description: 'योगदान',
      group: 'स्वाभिमान समूह',
      amount: 2500,
      date: '2024-02-15',
      status: 'completed',
    },
  ]);

  const handleAddMoneySuccess = (amount: number) => {
    // Update wallet balance (in production, this would come from the database)
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      available: prev.available + amount,
    }));
    
    toast({
      title: 'भुगतान सफल',
      description: `₹${amount.toLocaleString('hi-IN')} आपके वॉलेट में जोड़ दिए गए हैं।`,
      variant: 'default',
      className: 'bg-green-50 border-green-200 text-green-800',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">वॉलेट</h1>
          <p className="text-gray-600">आपके खाते का प्रबंधन करें</p>
        </div>

        {/* Main Wallet Card */}
        <div className="bg-gradient-to-br from-trust to-trust-dark rounded-3xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm mb-2">कुल शेष राशि</p>
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl font-bold">
                  {showBalance ? `₹${wallet.balance.toLocaleString('hi-IN')}` : '••••••'}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {showBalance ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                </button>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wallet className="w-8 h-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">उपलब्ध राशि</p>
              <p className="text-2xl font-bold">₹{wallet.available.toLocaleString('hi-IN')}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">अवरोधित राशि</p>
              <p className="text-2xl font-bold">₹{wallet.frozen.toLocaleString('hi-IN')}</p>
            </div>
          </div>

          {/* Add Money Button */}
          <button
            onClick={() => setAddMoneyOpen(true)}
            className="w-full bg-white text-trust-dark font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            वॉलेट में जोड़ें
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => setAddMoneyOpen(true)}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-trust transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">जमा करें</h3>
                <p className="text-sm text-gray-600">अपने वॉलेट में पैसे जोड़ें</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-trust transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">विथड्रॉ करें</h3>
                <p className="text-sm text-gray-600">अपने खाते में पैसे निकालें</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5" />
              हाल की गतिविधि
            </h3>
          </div>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.group}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('hi-IN')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('hi-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Money Modal */}
        <AddMoneyModal
          open={addMoneyOpen}
          onOpenChange={setAddMoneyOpen}
          onSuccess={handleAddMoneySuccess}
        />
      </div>
    </div>
  );
}

export default WalletPage;
