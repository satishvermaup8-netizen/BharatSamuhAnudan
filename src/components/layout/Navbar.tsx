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

  const navLinks = [
    { name: 'होम', path: ROUTES.HOME },
    { name: 'समूह', path: ROUTES.GROUPS },
    { name: 'डैशबोर्ड', path: ROUTES.DASHBOARD },
    { name: 'मेरे समूह', path: ROUTES.MY_GROUPS },
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
              <div className="flex items-center space-x-4">
                <Link
                  to={ROUTES.PROFILE}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isScrolled
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 text-red-600"
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
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
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
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                >
                  लॉगिन
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-saffron hover:bg-orange-50 font-semibold"
                >
                  रजिस्टर करें
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}