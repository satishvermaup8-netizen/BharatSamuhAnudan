import { Link } from 'react-router-dom';
import { 
  ArrowRight, Users, TrendingUp, Shield, CheckCircle, 
  BookOpen, Heart, Users2, Lightbulb, Award, Sparkles,
  HandHeart, Heart as HeartIcon, Gift, Building2, Star, MessageCircle
} from 'lucide-react';
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
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const { ref: impactRef, isVisible: impactVisible } = useScrollAnimation();
  const { ref: programsRef, isVisible: programsVisible } = useScrollAnimation();
  const { ref: donationRef, isVisible: donationVisible } = useScrollAnimation();
  const { ref: communityRef, isVisible: communityVisible } = useScrollAnimation();

  const stats = [
    { label: 'पंजीकृत सदस्य', value: mockDashboardStats.totalUsers, icon: <Users className="w-6 h-6" /> },
    { label: 'सक्रिय समूह', value: mockDashboardStats.totalGroups, icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'कुल फंड', value: '₹1.45 करोड़', isText: true, icon: <Shield className="w-6 h-6" /> },
    { label: 'सफल लेनदेन', value: mockDashboardStats.completedTransactions, icon: <CheckCircle className="w-6 h-6" /> },
  ];

  const missions = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'शिक्षा सहायता',
      description: 'हजारों बच्चों को गुणवत्तापूर्ण शिक्षा प्रदान करना'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'स्वास्थ्य सेवा',
      description: 'सस्ती और सुलभ स्वास्थ्य सेवा सभी के लिए'
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: 'पंचायत समूह',
      description: 'गाँव आधारित सामूहिक विकास योजना'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'आत्मनिर्भरता मिशन',
      description: 'कौशल विकास और आजीविका सहायता'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'छात्रवृत्ति योजना',
      description: 'मेधावी छात्रों के लिए पूर्ण छात्रवृत्ति'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'महिला सशक्तिकरण',
      description: 'आर्थिक स्वतंत्रता के लिए महिला संगठन'
    },
  ];

  const programs = [
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: 'छात्रवृत्ति कार्यक्रम',
      description: 'मेधावी लेकिन गरीब छात्रों के लिए 100% छात्रवृत्ति',
      participants: '5,000+',
      impact: 'बच्चों की शिक्षा'
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: 'स्वास्थ्य शिविर',
      description: 'निःशुल्क स्वास्थ्य जाँच और दवा वितरण',
      participants: '20,000+',
      impact: 'जीवन बचाया गया'
    },
    {
      icon: <Users2 className="w-10 h-10" />,
      title: 'पंचायत समूह',
      description: 'ग्रामीण विकास के लिए सामूहिक प्रयास',
      participants: '150+',
      impact: 'गाँव विकसित हुए'
    },
    {
      icon: <HandHeart className="w-10 h-10" />,
      title: 'विवाह सहायता',
      description: 'गरीब परिवारों के बच्चों की शादी में सहायता',
      participants: '1,000+',
      impact: 'परिवार खुश हुए'
    },
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: 'आपातकालीन सहायता',
      description: 'आकस्मिक समस्या में तुरंत आर्थिक मदद',
      participants: '10,000+',
      impact: 'संकट से बचाया'
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'शिक्षा समर्थन',
      description: 'व्यावसायिक प्रशिक्षण और कौशल विकास',
      participants: '3,000+',
      impact: 'नौकरियाँ पाई'
    },
  ];

  const successStories = [
    {
      name: 'राज कुमार',
      story: 'इस योजना से मेरा बेटा एक प्रतिष्ठित इंजीनियर बन गया',
      role: 'किसान, बिहार',
      rating: 5
    },
    {
      name: 'प्रिया शर्मा',
      story: 'महिला समूह ने मुझे स्वावलंबी बनाया और अब मैं दूसरों की मदद करती हूँ',
      role: 'उद्यमी, उत्तरप्रदेश',
      rating: 5
    },
    {
      name: 'देवेंद्र सिंह',
      story: 'आपातकालीन सहायता ने हमारी पूरी पारिवारिक स्थिति बदल दी',
      role: 'दिहाड़ी मजदूर, मध्यप्रदेश',
      rating: 5
    },
  ];

  const donationAmounts = [
    { amount: 100, icon: '🎓', title: 'एक दिन की शिक्षा', text: 'एक बच्चे को एक दिन की शिक्षा' },
    { amount: 500, icon: '🏥', title: 'स्वास्थ्य जाँच', text: 'पाँच बच्चों की स्वास्थ्य जाँच' },
    { amount: 1000, icon: '📚', title: 'मासिक किताब', text: 'एक बच्चे की मासिक किताबें' },
  ];

  const communityRoles = [
    {
      icon: <Users className="w-10 h-10" />,
      title: 'सदस्य बनें',
      description: 'समूह का हिस्सा बनें और बचत करें',
      cta: 'अभी शुरू करें'
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: 'स्वेच्छासेवक बनें',
      description: 'अपना समय और कौशल साझा करें',
      cta: 'आवेदन करें'
    },
    {
      icon: <Gift className="w-10 h-10" />,
      title: 'दाता बनें',
      description: 'दान देकर जीवन बदलें',
      cta: 'दान करें'
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: 'भागीदार बनें',
      description: 'संस्था के रूप में हमसे जुड़ें',
      cta: 'संपर्क करें'
    },
  ];

  const impactStats = [
    { label: 'बच्चों को शिक्षित किया', value: 50000 },
    { label: 'गाँव जुड़े हुए', value: 500 },
    { label: 'परिवार सशक्त किए', value: 100000 },
    { label: 'छात्रवृत्ति दी गई', value: 10000 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-soft-blue-700 via-trust to-soft-blue-600">
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
              सशक्त समाज • शिक्षित भारत • आत्मनिर्भर गाँव
            </h1>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              भारत समूह अनुदान एक सामाजिक मिशन है जो शिक्षा, स्वास्थ्य और स्वावलंबन के माध्यम से समाज को सशक्त बनाता है।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link
                to={ROUTES.REGISTER}
                className="px-10 py-4 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2 group"
              >
                <span>हमसे जुड़ें</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                to={ROUTES.GROUPS}
                className="px-10 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all duration-200 border border-white/30 flex items-center space-x-2"
              >
                <span>दान करें</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-mint-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">NGO प्रमाणित</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-mint-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">पारदर्शी व्यवस्था</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-mint-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">सामुदायिक संचालित</span>
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

      {/* Mission Section */}
      <section ref={missionRef} className="section-container bg-ngo-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ngo-gray-900 mb-4 font-heading">
            हमारा मिशन
          </h2>
          <p className="text-xl text-ngo-gray-600 max-w-3xl mx-auto">
            सामाजिक सशक्तिकरण के माध्यम से हर व्यक्ति को उनकी पूरी क्षमता तक पहुँचने में मदद करना
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missions.map((mission, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-ngo-gray-100 ${
                missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-soft-blue-100 to-mint-green-100 flex items-center justify-center text-soft-blue-700 mb-4">
                {mission.icon}
              </div>
              <h3 className="text-xl font-bold text-ngo-gray-900 mb-3 font-heading">{mission.title}</h3>
              <p className="text-ngo-gray-600">{mission.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section ref={impactRef} className="section-container bg-gradient-to-br from-soft-blue-50 to-mint-green-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ngo-gray-900 mb-4 font-heading">
            हमारा प्रभाव
          </h2>
          <p className="text-xl text-ngo-gray-600">
            लाखों जीवन बदलने का गौरव हमारा है
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <ImpactCounter
              key={index}
              label={stat.label}
              value={stat.value}
              isVisible={impactVisible}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Success Stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg border border-ngo-gray-100 ${
                impactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(4 + index) * 100}ms` }}
            >
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(story.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-saffron text-saffron" />
                ))}
              </div>
              <p className="text-ngo-gray-700 mb-4 italic">"{story.story}"</p>
              <div>
                <p className="font-semibold text-ngo-gray-900">{story.name}</p>
                <p className="text-sm text-ngo-gray-600">{story.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section ref={programsRef} className="section-container bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ngo-gray-900 mb-4 font-heading">
            हमारे कार्यक्रम
          </h2>
          <p className="text-xl text-ngo-gray-600">
            समाज के हर पहलू में सुधार के लिए समर्पित
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-white to-ngo-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-ngo-gray-100 transition-all duration-300 ${
                programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-soft-blue-100 to-saffron-100 flex items-center justify-center text-soft-blue-700 mb-4">
                {program.icon}
              </div>
              <h3 className="text-xl font-bold text-ngo-gray-900 mb-2 font-heading">{program.title}</h3>
              <p className="text-ngo-gray-600 mb-6">{program.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-ngo-gray-200">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-soft-blue-700">{program.participants}</p>
                  <p className="text-sm text-ngo-gray-600">सहभागी</p>
                </div>
                <div className="w-px h-12 bg-ngo-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="text-sm font-semibold text-mint-green-700">{program.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Section */}
      <section ref={donationRef} className="section-container bg-gradient-to-br from-saffron-50 to-soft-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-ngo-gray-900 mb-4 font-heading">
              दान करें
            </h2>
            <p className="text-xl text-ngo-gray-700 mb-2">
              आपका छोटा दान किसी का जीवन पूरी तरह बदल सकता है
            </p>
            <p className="text-lg text-ngo-gray-600">
              "Your small contribution can change a life"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {donationAmounts.map((donation, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-soft-blue-300 cursor-pointer ${
                  donationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{donation.icon}</div>
                <p className="text-3xl font-bold text-saffron mb-2">₹{donation.amount}</p>
                <p className="text-lg font-semibold text-ngo-gray-900 mb-2">{donation.title}</p>
                <p className="text-ngo-gray-600">{donation.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="number"
                placeholder="कस्टम राशि दर्ज करें"
                className="px-6 py-3 border-2 border-soft-blue-300 rounded-xl focus:outline-none focus:border-soft-blue-600 w-full sm:w-auto"
              />
              <button className="px-10 py-3 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center space-x-2 group w-full sm:w-auto justify-center">
                <span>अभी दान करें</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section ref={communityRef} className="section-container bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ngo-gray-900 mb-4 font-heading">
            हमारे साथ जुड़ें
          </h2>
          <p className="text-xl text-ngo-gray-600">
            आप किसी भी रूप में हमारे मिशन का हिस्सा बन सकते हैं
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {communityRoles.map((role, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-white to-ngo-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-ngo-gray-100 transition-all duration-300 text-center ${
                communityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-soft-blue-100 to-mint-green-100 flex items-center justify-center text-soft-blue-700 mb-4 mx-auto">
                {role.icon}
              </div>
              <h3 className="text-xl font-bold text-ngo-gray-900 mb-2 font-heading">{role.title}</h3>
              <p className="text-ngo-gray-600 mb-6">{role.description}</p>
              <button className="w-full px-6 py-2 bg-soft-blue-600 hover:bg-soft-blue-700 text-white rounded-lg font-semibold transition-all duration-200">
                {role.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Payment Visualization */}
      <PaymentVisualization />

      {/* Popular Groups */}
      <section className="section-container bg-ngo-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ngo-gray-900 mb-4 font-heading">
            लोकप्रिय समूह
          </h2>
          <p className="text-xl text-ngo-gray-600">
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
            className="inline-flex items-center space-x-2 px-8 py-4 bg-soft-blue-600 hover:bg-soft-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-2xl group"
          >
            <span>सभी समूह देखें</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-container bg-gradient-to-br from-soft-blue-600 via-trust to-soft-blue-700">
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
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-soft-blue-100 to-mint-green-100 flex items-center justify-center text-soft-blue-700">
          {icon}
        </div>
      </div>
      
      <p className="text-ngo-gray-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-ngo-gray-900">
        {isText ? value : animatedValue.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

interface ImpactCounterProps {
  label: string;
  value: number;
  isVisible: boolean;
  delay: number;
}

function ImpactCounter({ label, value, isVisible, delay }: ImpactCounterProps) {
  const animatedValue = useAnimatedCounter(
    isVisible ? value : 0,
    2000
  );

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-ngo-gray-100 h-full">
        <p className="text-5xl md:text-6xl font-bold text-soft-blue-700 mb-4">
          {animatedValue.toLocaleString('en-IN')}+
        </p>
        <p className="text-lg text-ngo-gray-700 font-semibold">{label}</p>
      </div>
    </div>
  );
}