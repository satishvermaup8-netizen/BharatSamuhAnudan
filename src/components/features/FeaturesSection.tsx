import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Shield, Users, TrendingUp, Clock, CheckCircle, Lock } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'सुरक्षित और विश्वसनीय',
    description: 'RBI अनुपालन और बैंक-स्तरीय एन्क्रिप्शन के साथ आपका पैसा पूरी तरह सुरक्षित',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: '1000 सदस्य समूह',
    description: 'बड़े समुदाय के साथ जुड़ें और सामूहिक शक्ति का लाभ उठाएं',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'पारदर्शी फंड प्रबंधन',
    description: 'हर ₹100 का स्पष्ट विभाजन - 4 वॉलेट में स्वचालित वितरण',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '32 मासिक किश्तें',
    description: 'आसान मासिक भुगतान योजना के साथ वित्तीय योजना बनाएं',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'त्वरित मृत्यु दावा',
    description: 'आपातकालीन स्थिति में नॉमिनी को तेज़ और आसान सहायता',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'KYC सत्यापित',
    description: 'आधार और PAN सत्यापन के साथ पूर्ण पारदर्शिता और सुरक्षा',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-container bg-gray-50">
      <div ref={ref} className="text-center mb-16">
        <h2 className={`text-4xl font-bold text-gray-900 mb-4 font-heading transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          हमारी विशेषताएं
        </h2>
        <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          एक पूर्ण, सुरक्षित और पारदर्शी सामूहिक बचत मंच
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} delay={index * 100} />
        ))}
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: typeof features[0];
  delay: number;
}

function FeatureCard({ feature, delay }: FeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {feature.icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">
        {feature.title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}