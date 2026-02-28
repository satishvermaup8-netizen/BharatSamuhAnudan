import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

const DEMO_PASSWORD = '1234';

export function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateMobile = (value: string) => {
    return value.length === 10 && /^[6-9]/.test(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!mobile.trim()) {
      setError('कृपया मोबाइल नंबर दर्ज करें');
      return;
    }

    if (!validateMobile(mobile)) {
      setError('कृपया सही मोबाइल नंबर दर्ज करें (10 अंक, 6-9 से शुरू करें)');
      return;
    }
    
    if (!password) {
      setError('कृपया पासवर्ड दर्ज करें');
      return;
    }

    if (password !== DEMO_PASSWORD) {
      setError(`गलत पासवर्ड। डेमो के लिए 1234 दर्ज करें।`);
      return;
    }
    
    setLoading(true);
    
    try {
      await login(mobile, DEMO_PASSWORD);
      setSuccess('✓ लॉगिन सफल! डैशबोर्ड पर जा रहे हैं...');
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 500);
    } catch (error: any) {
      setError(error.message || 'लॉगिन विफल। क्षमा करें, कृपया पुनः प्रयास करें।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-blue-600 via-trust to-soft-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-soft-blue-600 to-trust rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">भा</span>
            </div>
            <h2 className="text-3xl font-bold text-ngo-gray-900 font-heading">
              लॉगिन करें
            </h2>
            <p className="text-ngo-gray-600 mt-2">
              अपने खाते में प्रवेश करें
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                मोबाइल नंबर
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-ngo-gray-400" />
                </div>
                <input
                  id="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="9876543210"
                />
                {mobile && validateMobile(mobile) && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-mint-green-600" />
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-ngo-gray-500">
                10 अंकों का मोबाइल नंबर दर्ज करें
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                पासवर्ड
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-ngo-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="पासवर्ड दर्ज करें"
                />
              </div>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">💡 डेमो Credentials:</span><br />
                  पासवर्ड: <code className="bg-blue-100 px-2 py-1 rounded font-mono font-bold">1234</code>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !mobile || !password}
              className="w-full px-6 py-3 bg-soft-blue-600 hover:bg-soft-blue-700 disabled:bg-ngo-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>{loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}</span>
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ngo-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-ngo-gray-500">या</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-ngo-gray-600">
                नया उपयोगकर्ता हैं?{' '}
                <Link to={ROUTES.REGISTER} className="font-semibold text-soft-blue-600 hover:text-soft-blue-700 underline">
                  रजिस्टर करें
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-ngo-gray-200">
            <div className="flex items-center justify-center space-x-2 text-ngo-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-xs">डेमो मोड - पासवर्ड आधारित लॉगिन</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
