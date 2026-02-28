import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { ROUTES } from '@/constants';
import { FeaturesSection } from '@/components/features/FeaturesSection';
import { PaymentVisualization } from '@/components/features/PaymentVisualization';
import { mockDashboardStats, mockGroups } from '@/lib/mockData';
import { GroupCard } from '@/components/features/GroupCard';

export function HomePage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  const stats = [
    { label: 'पंजीकृत सदस्य', value: mockDashboardStats.totalUsers, icon: <Users className="w-6 h-6" /> },
    { label: 'सक्रिय समूह', value: mockDashboardStats.totalGroups, icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'कुल फंड', value: '₹1.45 करोड़', isText: true, icon: <Shield className="w-6 h-6" /> },
    { label: 'सफल लेनदेन', value: mockDashboardStats.completedTransactions, icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-trust via-trust-dark to-trust-light">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className={`transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
                🇮🇳 राष्ट्रीय सामूहिक बचत योजना
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading leading-tight">
              भारत समूह अनुदान
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90 mb-4 font-hindi">
              सामूहिक बचत, सामूहिक सुरक्षा
            </p>
            
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              1000 सदस्यों के साथ समूह बनाएं। ₹100 मासिक किश्त जमा करें। 
              पारदर्शी फंड प्रबंधन और आपातकालीन सहायता प्राप्त करें।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link
                to={ROUTES.REGISTER}
                className="btn-secondary flex items-center space-x-2 text-lg group"
              >
                <span>अभी शुरू करें</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                to={ROUTES.GROUPS}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-semibold transition-all duration-200 border border-white/30 text-lg"
              >
                समूह देखें
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">RBI Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">45K+ Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-container bg-white -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              label={stat.label}
              value={stat.value}
              isText={stat.isText}
              icon={stat.icon}
              isVisible={statsVisible}
              delay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Payment Visualization */}
      <PaymentVisualization />

      {/* Popular Groups */}
      <section className="section-container bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
            लोकप्रिय समूह
          </h2>
          <p className="text-xl text-gray-600">
            सक्रिय समुदायों से जुड़ें और आज ही बचत शुरू करें
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockGroups.filter(g => g.status === 'active').slice(0, 3).map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to={ROUTES.GROUPS}
            className="btn-primary inline-flex items-center space-x-2 group"
          >
            <span>सभी समूह देखें</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container bg-gradient-to-br from-trust via-trust-dark to-trust-light">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
            आज ही अपनी वित्तीय सुरक्षा शुरू करें
          </h2>
          <p className="text-xl mb-12 text-white/90">
            हजारों भारतीयों के साथ जुड़ें जो पहले से ही अपने भविष्य को सुरक्षित कर रहे हैं
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to={ROUTES.REGISTER}
              className="px-10 py-5 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2 group"
            >
              <span>मुफ्त में रजिस्टर करें</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link
              to={ROUTES.LOGIN}
              className="px-10 py-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all duration-200 border-2 border-white/30"
            >
              लॉगिन करें
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface StatCounterProps {
  label: string;
  value: number | string;
  isText?: boolean;
  icon: React.ReactNode;
  isVisible: boolean;
  delay: number;
}

function StatCounter({ label, value, isText, icon, isVisible, delay }: StatCounterProps) {
  const animatedValue = useAnimatedCounter(
    isVisible && typeof value === 'number' ? value : 0,
    2000
  );

  return (
    <div
      className={`stat-card transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-trust to-trust-dark flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-900">
        {isText ? value : animatedValue.toLocaleString('en-IN')}
      </p>
    </div>
  );
}