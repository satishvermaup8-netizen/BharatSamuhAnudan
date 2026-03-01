import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, ArrowRight, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateFields = () => {
    if (!formData.name.trim()) {
      return 'कृपया अपना पूरा नाम दर्ज करें';
    }
    if (formData.name.trim().length < 3) {
      return 'नाम कम से कम 3 अक्षर का होना चाहिए';
    }
    if (!formData.email.trim()) {
      return 'कृपया ईमेल पता दर्ज करें';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'कृपया सही ईमेल पता दर्ज करें';
    }
    if (!formData.mobile.trim()) {
      return 'कृपया मोबाइल नंबर दर्ज करें';
    }
    if (formData.mobile.length !== 10 || !/^[6-9]/.test(formData.mobile)) {
      return 'कृपया सही मोबाइल नंबर दर्ज करें (10 अंक, 6-9 से शुरू करें)';
    }
    if (!formData.password) {
      return 'कृपया पासवर्ड सेट करें';
    }
    if (formData.password.length < 6) {
      return 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'पासवर्ड मेल नहीं खाते';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    
    console.log('📝 Signup attempt with data:', {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
    });
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      console.log('✅ Signup successful!');
      setSuccess('🎉 रजिस्ट्रेशन सफल! आपका खाता बन गया है।');
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 2000);
    } catch (error: any) {
      console.error('❌ Signup error:', error.message);
      setError(error.message || 'रजिस्ट्रेशन विफल। क्षमा करें, कृपया पुनः प्रयास करें।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-blue-600 via-trust to-soft-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">भा</span>
            </div>
            <h2 className="text-3xl font-bold text-ngo-gray-900 font-heading">
              रजिस्टर करें
            </h2>
            <p className="text-ngo-gray-600 mt-2">
              नया खाता बनाएं और शुरुआत करें
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
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-xl shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-green-800">{success}</p>
                  <p className="text-sm text-green-600 mt-1">डैशबोर्ड पर रीडायरेक्ट हो रहा है...</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">आप अब लॉगिन हैं ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                पूरा नाम *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-ngo-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="राजेश कुमार"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                ईमेल पता *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-ngo-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="rajesh@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                मोबाइल नंबर *
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
                  value={formData.mobile}
                  onChange={(e) => {
                    setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') });
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="9876543210"
                />
              </div>
              <p className="mt-1 text-xs text-ngo-gray-500">10 अंकों का नंबर</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                पासवर्ड *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-ngo-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="कम से कम 6 अक्षर"
                />
              </div>
              <p className="mt-1 text-xs text-ngo-gray-500">कम से कम 6 अक्षर होना चाहिए</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ngo-gray-700 mb-2">
                पासवर्ड की पुष्टि करें *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-ngo-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ngo-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="पासवर्ड फिर से दर्ज करें"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">ℹ️ अगला कदम:</span> रजिस्ट्रेशन के बाद आपको KYC सत्यापन पूरा करना होगा
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.mobile || !formData.password}
              className="w-full px-6 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:bg-ngo-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>{loading ? 'रजिस्टर हो रहा है...' : 'रजिस्टर करें'}</span>
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
                पहले से खाता है?{' '}
                <Link to={ROUTES.LOGIN} className="font-semibold text-soft-blue-600 hover:text-soft-blue-700 underline">
                  लॉगिन करें
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-ngo-gray-200">
            <div className="flex items-center justify-center space-x-2 text-ngo-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-xs">आपका डेटा पूरी तरह सुरक्षित है</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}