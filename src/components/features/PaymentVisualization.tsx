import { useState } from 'react';
import { ArrowRight, Wallet, Users as UsersIcon, Building, Shield } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function PaymentVisualization() {
  const { ref, isVisible } = useScrollAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  };

  const wallets = [
    { name: 'स्टाफ वॉलेट', amount: 20, color: 'from-blue-500 to-blue-600', icon: <Shield className="w-5 h-5" /> },
    { name: 'समूह वॉलेट', amount: 50, color: 'from-green-500 to-green-600', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'कंसोलिडेटेड वॉलेट', amount: 10, color: 'from-purple-500 to-purple-600', icon: <Wallet className="w-5 h-5" /> },
    { name: 'प्रबंधन वॉलेट', amount: 20, color: 'from-orange-500 to-orange-600', icon: <Building className="w-5 h-5" /> },
  ];

  return (
    <section className="section-container bg-white">
      <div ref={ref} className="text-center mb-16">
        <h2 className={`text-4xl font-bold text-gray-900 mb-4 font-heading transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          पारदर्शी भुगतान प्रणाली
        </h2>
        <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          हर ₹100 किश्त का स्वचालित और पारदर्शी विभाजन
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 border-2 border-gray-200">
          <div className="flex flex-col items-center space-y-8">
            {/* Source */}
            <div className="text-center">
              <div className="inline-block bg-gradient-to-br from-trust to-trust-dark text-white px-8 py-6 rounded-2xl shadow-xl">
                <Wallet className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">मासिक किश्त</p>
                <p className="text-4xl font-bold">₹100</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="relative">
              <ArrowRight className="w-8 h-8 text-gray-400 transform rotate-90" />
              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-trust rounded-full animate-ping" />
                </div>
              )}
            </div>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200 transition-all duration-500 ${
                    isAnimating ? 'scale-105 shadow-2xl' : ''
                  }`}
                  style={{
                    transitionDelay: isAnimating ? `${index * 150}ms` : '0ms',
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center text-white mb-4`}>
                    {wallet.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {wallet.name}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{wallet.amount}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({wallet.amount}%)
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${wallet.color} rounded-full transition-all duration-1000 ${
                        isAnimating ? 'w-full' : 'w-0'
                      }`}
                      style={{
                        transitionDelay: isAnimating ? `${index * 150}ms` : '0ms',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Animate Button */}
            <button
              onClick={startAnimation}
              className="btn-primary flex items-center space-x-2 group"
              disabled={isAnimating}
            >
              <span>{isAnimating ? 'विभाजन हो रहा है...' : 'विभाजन देखें'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">तत्काल क्रेडिट</h4>
            <p className="text-blue-700 text-sm">
              भुगतान सफल होने पर सभी 4 वॉलेट में तुरंत राशि जमा हो जाती है
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">पूर्ण पारदर्शिता</h4>
            <p className="text-green-700 text-sm">
              हर लेनदेन का पूरा रिकॉर्ड और वॉलेट बैलेंस आपके डैशबोर्ड पर उपलब्ध
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}