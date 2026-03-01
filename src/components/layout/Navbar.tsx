import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links based on authentication status
  const navLinks = isAuthenticated
    ? [
        { name: 'होम', path: ROUTES.HOME },
        { name: 'समूह', path: ROUTES.GROUPS },
        { name: 'डैशबोर्ड', path: ROUTES.DASHBOARD },
        { name: 'मेरे समूह', path: ROUTES.MY_GROUPS },
      ]
    : [
        { name: 'होम', path: ROUTES.HOME },
        { name: 'समूह', path: ROUTES.GROUPS },
      ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isScrolled ? 'bg-trust' : 'bg-white'
            }`}>
              <span className={`text-2xl font-bold ${
                isScrolled ? 'text-white' : 'text-trust'
              }`}>भा</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold font-heading transition-colors duration-300 ${
                isScrolled ? 'text-trust' : 'text-white'
              }`}>
                Bharat Samuh
              </h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
                भारत समूह अनुदान
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? isScrolled ? 'text-trust' : 'text-white font-semibold'
                    : isScrolled ? 'text-gray-700 hover:text-trust' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Profile Badge */}
                <Link
                  to={ROUTES.PROFILE}
                  className={`flex items-center space-x-3 px-5 py-2.5 rounded-xl transition-all duration-200 border-2 ${
                    isScrolled
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 text-blue-900'
                      : 'bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isScrolled ? 'bg-blue-600' : 'bg-white/30'
                  }`}>
                    <User className={`w-5 h-5 ${isScrolled ? 'text-white' : 'text-white'}`} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs opacity-80">लॉगिन है ✓</span>
                    <span className="font-semibold text-sm">{user?.name.split(' ')[0]}</span>
                  </div>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className={`p-3 rounded-xl transition-all duration-200 border-2 ${
                    isScrolled
                      ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to={ROUTES.LOGIN}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isScrolled
                      ? 'text-trust hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  लॉगिन
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-5 py-2 bg-saffron hover:bg-saffron-dark text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  रजिस्टर करें
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled ? 'text-trust hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-xl border border-gray-100">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-trust bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-green-50 border-b-2 border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-700 font-semibold">✓ लॉगिन सफल</p>
                  </div>
                </div>
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-blue-50 hover:bg-blue-100 border-b"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">प्रोफाइल</p>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>लॉगआउट</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-3 bg-blue-50 border-b-2 border-blue-200">
                  <p className="text-xs text-blue-600 font-medium">लॉगिन नहीं है</p>
                </div>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  🔐 लॉगिन करें
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white bg-saffron hover:bg-saffron-dark font-semibold"
                >
                  ✨ नया खाता बनाएं
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}