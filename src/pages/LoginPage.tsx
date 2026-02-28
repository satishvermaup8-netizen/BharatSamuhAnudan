import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

const DEMO_PASSWORD = '1234';

export function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobile || mobile.length !== 10) {
      alert('कृपया सही मोबाइल नंबर दर्ज करें');
      return;
    }
    
    if (password !== DEMO_PASSWORD) {
      alert('गलत पासवर्ड। कृपया 1234 दर्ज करें।');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(mobile, DEMO_PASSWORD);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      alert(error.message || 'लॉगिन विफल। कृपया पुनः प्रयास करें।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-trust via-trust-dark to-trust-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-trust to-trust-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">भा</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-heading">
              लॉगिन करें
            </h2>
            <p className="text-gray-600 mt-2">
              अपने खाते में प्रवेश करें
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  मोबाइल नंबर
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="input-field pl-10"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  पासवर्ड
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="1234"
                  />
                </div>
                <p className="mt-2 text-sm text-blue-600 font-medium">
                  💡 डेमो पासवर्ड: 1234
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 group"
              >
                <span>{loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">या</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                नया उपयोगकर्ता हैं?{' '}
                <Link to={ROUTES.REGISTER} className="font-semibold text-trust hover:text-trust-dark">
                  रजिस्टर करें
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-xs">पासवर्ड आधारित डेमो लॉगिन</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
