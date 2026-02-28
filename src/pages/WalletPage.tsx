import { Wallet, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);

  const wallet = {
    balance: 15000,
    frozen: 5000,
    available: 10000,
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">उपलब्ध राशि</p>
              <p className="text-2xl font-bold">₹{wallet.available.toLocaleString('hi-IN')}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">अवरोधित राशि</p>
              <p className="text-2xl font-bold">₹{wallet.frozen.toLocaleString('hi-IN')}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-trust transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">विथड्रॉ करें</h3>
                <p className="text-sm text-gray-600">अपने खाते में पैसे निकालें</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-trust transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">ब्यौरे देखें</h3>
                <p className="text-sm text-gray-600">विस्तृत विवरण देखें</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">हाल की गतिविधि</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">योगदान</p>
                <p className="text-sm text-gray-600">स्वाभिमान समूह</p>
              </div>
              <p className="font-semibold text-green-600">+₹2,500</p>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">वितरण</p>
                <p className="text-sm text-gray-600">विकास समूह</p>
              </div>
              <p className="font-semibold text-blue-600">-₹5,000</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">शुल्क</p>
                <p className="text-sm text-gray-600">प्रशासन शुल्क</p>
              </div>
              <p className="font-semibold text-red-600">-₹50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
