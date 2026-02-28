import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES } from '@/constants';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-trust-dark via-trust to-trust-light text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-trust">भा</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading">Bharat Samuh</h3>
                <p className="text-sm text-white/80">भारत समूह अनुदान</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              एक विश्वसनीय सामूहिक बचत और सहायता मंच। वित्तीय सुरक्षा और सामुदायिक सहयोग के लिए आपका साथी।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">त्वरित लिंक</h4>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.HOME} className="text-white/70 hover:text-white transition-colors duration-200">
                  होम
                </Link>
              </li>
              <li>
                <Link to={ROUTES.GROUPS} className="text-white/70 hover:text-white transition-colors duration-200">
                  समूह
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD} className="text-white/70 hover:text-white transition-colors duration-200">
                  डैशबोर्ड
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  हमारे बारे में
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  संपर्क करें
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">कानूनी</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  नियम और शर्तें
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  धनवापसी नीति
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  NGO पंजीकरण
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/70 hover:text-white transition-colors duration-200">
                  12A & 80G प्रमाणपत्र
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">संपर्क करें</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  123, सामुदायिक केंद्र<br />नई दिल्ली, 110001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-white/70 text-sm">1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-white/70 text-sm">support@bharatsamuh.org</span>
              </li>
            </ul>

            <div className="flex items-center space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-2 text-white/80">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <span className="text-sm">RBI Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <span className="text-sm">12A Registered</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
              <span className="text-sm">80G Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🔒</span>
              </div>
              <span className="text-sm">Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Bharat Samuh Anudan. All rights reserved. | Made with ❤️ for India
          </p>
        </div>
      </div>
    </footer>
  );
}